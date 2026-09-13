"use server";

import { signIn } from "@/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { AuthError } from "next-auth";
import { getAdminEmails } from "@/auth.config";
import { sendEmailVerification } from "@/lib/email";

export async function loginWithEmail(formData: FormData) {
  const rawEmail = (formData.get("email") as string) || "";
  const email = rawEmail.trim().toLowerCase();
  const password = (formData.get("password") as string) || "";
  const name = ((formData.get("name") as string) || "").trim();
  const action = (formData.get("action") as string) || "login";
  const callbackUrl = ((formData.get("callbackUrl") as string) || "").trim();
  const rawRole = (formData.get("role") as string) || "STUDENT";
  const role = rawRole.toUpperCase() === "TUTOR" ? "TUTOR" : "STUDENT";

  // Validate Email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    return { error: "Please enter a valid email address." };
  }

  // Validate Password
  if (!password || password.length < 8) {
    return { error: "Password must be at least 8 characters long." };
  }

  if (action === "register") {
    // Check if user exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      if (!existingUser.password) {
        return {
          error: "An account with this email exists via Google. Please click 'Continue with Google'.",
        };
      }
      return { error: "An account with this email already exists. Please sign in instead." };
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    // P0-5: Admin check exclusively from env var
    const adminEmails = getAdminEmails();
    const isAdmin = adminEmails.has(email);

    // P0-7: Generate email verification token
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    const baseUrl = process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_APP_URL || "https://learnivia-green.vercel.app";
    const verifyUrl = `${baseUrl}/verify-email?token=${verificationToken}`;

    if (role === "TUTOR") {
      const school = ((formData.get("school") as string) || "").trim();
      const educationLevel = ((formData.get("educationLevel") as string) || "").trim();

      await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          name: name || email.split("@")[0],
          role: isAdmin ? "ADMIN" : "TUTOR",
          onboardingCompleted: true,
          emailVerificationToken: verificationToken,
          emailVerificationExpires: verificationExpires,
          tutorProfile: {
            create: {
              status: "PENDING",
              school: school || undefined,
              currentGrade: educationLevel || undefined,
            },
          },
        },
      });

      // Send verification email non-blockingly
      sendEmailVerification(email, verifyUrl).catch((err) =>
        console.error("Non-blocking email verification error:", err)
      );

      try {
        await signIn("credentials", { email, password, redirect: false });
        const redirectUrl = (callbackUrl && callbackUrl !== "/dashboard") ? callbackUrl : "/apply";
        return { success: true, redirectUrl };
      } catch (error) {
        if (error instanceof AuthError) {
          return { error: "Tutor account created! Please sign in with your email and password." };
        }
        throw error;
      }
    } else {
      // Student registration
      const rawAge = formData.get("age") as string;
      const age = rawAge ? parseInt(rawAge, 10) : undefined;
      const grade = ((formData.get("grade") as string) || "").trim() || undefined;
      const curriculum = ((formData.get("curriculum") as string) || "").trim() || undefined;
      const parentEmail = ((formData.get("parentEmail") as string) || "").trim().toLowerCase() || null;

      const isMinor = (age !== undefined && !isNaN(age)) ? age < 13 : false;

      await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          name: name || email.split("@")[0],
          role: isAdmin ? "ADMIN" : "STUDENT",
          onboardingCompleted: true,
          age: isNaN(age as number) ? undefined : age,
          grade,
          curriculum,
          isMinor,
          parentEmail,
          emailVerificationToken: verificationToken,
          emailVerificationExpires: verificationExpires,
        },
      });

      // Send verification email non-blockingly
      sendEmailVerification(email, verifyUrl).catch((err) =>
        console.error("Non-blocking email verification error:", err)
      );

      try {
        await signIn("credentials", { email, password, redirect: false });
        const redirectUrl = callbackUrl || "/dashboard";
        return { success: true, redirectUrl };
      } catch (error) {
        if (error instanceof AuthError) {
          return { error: "Student account created! Please sign in with your email and password." };
        }
        throw error;
      }
    }
  }

  // Handle Login
  const existingUser = await prisma.user.findUnique({
    where: { email },
    include: { tutorProfile: true },
  });

  if (existingUser && !existingUser.password) {
    return {
      error: "This email is registered with Google. Please click 'Continue with Google'.",
    };
  }

  // P0-12: Account status pre-checks
  if (existingUser?.accountSuspended) {
    return {
      error: `Your account is currently suspended (${existingUser.suspendedReason || "administrative review"}). Please contact support@learnivia.app.`,
    };
  }

  if (existingUser?.lockedUntil && existingUser.lockedUntil > new Date()) {
    const mins = Math.max(1, Math.ceil((existingUser.lockedUntil.getTime() - Date.now()) / 60000));
    return {
      error: `Too many failed login attempts. Account temporarily locked. Please try again in ${mins} minute(s) or use "Forgot password".`,
    };
  }

  try {
    await signIn("credentials", { email, password, redirect: false });

    // Determine target redirect based on user role
    const userRole = existingUser?.role || "STUDENT";
    let redirectUrl = callbackUrl;
    if (!redirectUrl || redirectUrl === "/dashboard") {
      if (userRole === "TUTOR") {
        redirectUrl = "/tutor";
      } else if (userRole === "ADMIN") {
        redirectUrl = "/admin";
      } else {
        redirectUrl = "/dashboard";
      }
    }

    return { success: true, redirectUrl };
  } catch (error) {
    if (error instanceof AuthError) {
      if (existingUser) {
        const freshUser = await prisma.user.findUnique({
          where: { id: existingUser.id },
          select: { lockedUntil: true, failedLoginCount: true },
        });
        if (freshUser?.lockedUntil && freshUser.lockedUntil > new Date()) {
          return {
            error: "Too many failed login attempts. Account temporarily locked for 15 minutes. Please try again later or reset your password.",
          };
        }
        if (freshUser?.failedLoginCount && freshUser.failedLoginCount >= 3) {
          return {
            error: `Incorrect email or password. Warning: ${Math.max(1, 5 - freshUser.failedLoginCount)} attempt(s) remaining before temporary lockout.`,
          };
        }
      }

      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Incorrect email or password. Please try again." };
        default:
          return { error: "Authentication failed. Please verify your credentials." };
      }
    }
    throw error;
  }
}

export async function loginWithGoogle(formData: FormData) {
  const callbackUrl = (formData.get("callbackUrl") as string) || "/dashboard";
  await signIn("google", { redirectTo: callbackUrl });
}
