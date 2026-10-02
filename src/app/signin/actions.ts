"use server";

import { signIn } from "@/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { AuthError } from "next-auth";
import { getAdminEmails, isDesignatedAdmin } from "@/auth.config";
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
  if (!password) {
    return { error: "Please enter your password." };
  }

  if (action === "register" && password.length < 8) {
    return { error: "Password must be at least 8 characters long." };
  }

  if (action === "register") {
    // Check if user exists
    let existingUser: any = null;
    try {
      existingUser = await prisma.user.findUnique({ where: { email } });
    } catch (err) {
      console.warn("Notice: prisma.user.findUnique in register:", err);
    }
    if (existingUser) {
      if (!existingUser.password) {
        // Automatically set password for existing Google account trying to register
        const hashedPassword = await bcrypt.hash(password, 10);
        try {
          await prisma.user.update({
            where: { id: existingUser.id },
            data: { password: hashedPassword, failedLoginCount: 0, lockedUntil: null },
          });
        } catch (e) {}
        try {
          await signIn("credentials", { email, password, redirect: false });
          return { success: true, redirectUrl: callbackUrl || "/dashboard" };
        } catch (e) {}
      }
      return {
        error:
          "An account with this email already exists. Please sign in with your email and password.",
      };
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    // P0-5: Admin check exclusively from env var
    const adminEmails = getAdminEmails();
    const isAdmin = adminEmails.has(email);

    // P0-7: Generate email verification token
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    const baseUrl =
      process.env.NEXTAUTH_URL ||
      process.env.NEXT_PUBLIC_APP_URL ||
      "https://learnivia-green.vercel.app";
    const verifyUrl = `${baseUrl}/verify-email?token=${verificationToken}`;

    if (role === "TUTOR") {
      const school = ((formData.get("school") as string) || "").trim();
      const educationLevel = (
        (formData.get("educationLevel") as string) || ""
      ).trim();

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
        console.error("Non-blocking email verification error:", err),
      );

      try {
        await signIn("credentials", { email, password, redirect: false });
        const redirectUrl =
          callbackUrl && callbackUrl !== "/dashboard" ? callbackUrl : "/apply";
        return { success: true, redirectUrl };
      } catch (error) {
        if (error instanceof AuthError) {
          return {
            error:
              "Tutor account created! Please sign in with your email and password.",
          };
        }
        throw error;
      }
    } else {
      // Student registration
      const rawAge = formData.get("age") as string;
      const age = rawAge ? parseInt(rawAge, 10) : undefined;
      const grade =
        ((formData.get("grade") as string) || "").trim() || undefined;
      const curriculum =
        ((formData.get("curriculum") as string) || "").trim() || undefined;
      const parentEmail =
        ((formData.get("parentEmail") as string) || "").trim().toLowerCase() ||
        null;

      const isMinor = age !== undefined && !isNaN(age) ? age < 13 : false;

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
        console.error("Non-blocking email verification error:", err),
      );

      try {
        await signIn("credentials", { email, password, redirect: false });
        const redirectUrl = callbackUrl || "/dashboard";
        return { success: true, redirectUrl };
      } catch (error) {
        if (error instanceof AuthError) {
          return {
            error:
              "Student account created! Please sign in with your email and password.",
          };
        }
        throw error;
      }
    }
  }

  // Handle Login
  const isAdmin = isDesignatedAdmin({ email });
  let existingUser: any = null;
  try {
    existingUser = await prisma.user.findUnique({
      where: { email },
      include: { tutorProfile: true },
    });
  } catch (err) {
    console.warn("Notice: prisma.user.findUnique in loginWithEmail handled:", err);
  }

  // If designated admin does not exist yet, auto-provision
  if (!existingUser && isAdmin) {
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      existingUser = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          name: email.includes("shourya") ? "Shourya Sharan" : "Ahmed Farooqui",
          role: "ADMIN",
          onboardingCompleted: true,
        },
        include: { tutorProfile: true },
      });
    } catch (e) {
      console.error("Auto-provision admin error in action:", e);
    }
  }

  if (!existingUser) {
    return {
      error:
        "No account found with this email. Please click 'Create free account' below to sign up.",
    };
  }

  // If previous user signed up via Google and has no password, set it to the provided password
  if (existingUser && !existingUser.password) {
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      existingUser = await prisma.user.update({
        where: { id: existingUser.id },
        data: {
          password: hashedPassword,
          failedLoginCount: 0,
          lockedUntil: null,
        },
        include: { tutorProfile: true },
      });
    } catch (e) {
      console.error("Auto-set password error for Google user:", e);
    }
  }

  // Account status pre-checks (designated admins are never suspended)
  if (existingUser?.accountSuspended && !isAdmin) {
    return {
      error: `Your account is currently suspended (${existingUser.suspendedReason || "administrative review"}). Please contact support@learnivia.app.`,
    };
  }

  // Lockout check with forgiveness if password matches
  if (existingUser?.lockedUntil && !isAdmin) {
    if (existingUser.lockedUntil > new Date()) {
      const isMatch = existingUser.password
        ? await bcrypt.compare(password, existingUser.password)
        : false;
      if (isMatch) {
        await prisma.user.update({
          where: { id: existingUser.id },
          data: { failedLoginCount: 0, lockedUntil: null },
        });
        existingUser.lockedUntil = null;
      } else {
        const mins = Math.max(
          1,
          Math.ceil((existingUser.lockedUntil.getTime() - Date.now()) / 60000),
        );
        return {
          error: `Too many failed login attempts. Account temporarily locked. Please try again in ${mins} minute(s) or use "Forgot password".`,
        };
      }
    } else {
      await prisma.user.update({
        where: { id: existingUser.id },
        data: { failedLoginCount: 0, lockedUntil: null },
      });
      existingUser.lockedUntil = null;
    }
  }

  // Verify normal user credentials
  if (existingUser?.password && !isAdmin) {
    const isMatch = await bcrypt.compare(password, existingUser.password);
    if (!isMatch) {
      const newFailCount = (existingUser.failedLoginCount || 0) + 1;
      const willLock = newFailCount >= 5;
      await prisma.user.update({
        where: { id: existingUser.id },
        data: {
          failedLoginCount: newFailCount,
          lockedUntil: willLock
            ? new Date(Date.now() + 15 * 60 * 1000)
            : null,
        },
      });

      if (willLock) {
        return {
          error:
            "Too many failed login attempts. Account temporarily locked for 15 minutes. Please try again later or reset your password.",
        };
      }
      return {
        error: `Incorrect email or password. ${Math.max(1, 5 - newFailCount)} attempt(s) remaining before temporary lockout.`,
      };
    }
  }

  try {
    const isApprovedTutor =
      existingUser?.role === "TUTOR" &&
      existingUser?.tutorProfile?.status === "APPROVED";

    const defaultTarget = isAdmin
      ? "/admin"
      : isApprovedTutor
        ? "/tutor"
        : "/dashboard";

    const result = await signIn("credentials", {
      email,
      password,
      redirectTo: defaultTarget,
      redirect: false,
    });

    if (
      typeof result === "string" &&
      (result.includes("error=") || result.includes("CredentialsSignin"))
    ) {
      return {
        error: "Incorrect email or password. Please verify your credentials.",
      };
    }

    let redirectUrl = callbackUrl;
    if (
      !redirectUrl ||
      redirectUrl.startsWith("/signin") ||
      redirectUrl.startsWith("/signup") ||
      redirectUrl === "/" ||
      redirectUrl === "/dashboard"
    ) {
      redirectUrl = defaultTarget;
    }

    // Security guard: Non-admins can NEVER be redirected to /admin
    if (!isAdmin && redirectUrl.startsWith("/admin")) {
      redirectUrl = "/dashboard";
    }
    // Security guard: Unapproved tutors can NEVER be redirected to /tutor
    if (!isApprovedTutor && !isAdmin && redirectUrl.startsWith("/tutor")) {
      redirectUrl = "/dashboard";
    }

    return { success: true, redirectUrl };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Incorrect email or password. Please try again." };
        default:
          return {
            error: "Authentication failed. Please verify your credentials.",
          };
      }
    }
    console.error("Credentials sign in error:", error);
    return {
      error: "Authentication failed. Please verify your credentials.",
    };
  }
}

export async function loginWithGoogle(formData: FormData) {
  const callbackUrl = (formData.get("callbackUrl") as string) || "/dashboard";
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    return {
      error:
        "Google Sign-In is currently being connected to Google Cloud. Please use your email and password to sign in or create an account below.",
    };
  }
  await signIn("google", { redirectTo: callbackUrl });
}


