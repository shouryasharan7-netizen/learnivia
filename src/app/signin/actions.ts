"use server";

import { signIn } from "@/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";

const ADMIN_EMAILS = new Set([
  "shouryasharan7@gmail.com",
  "ahmedashfaqfarooqui@gmail.com",
  ...(process.env.ADMIN_EMAILS ? process.env.ADMIN_EMAILS.split(",").map((e) => e.trim().toLowerCase()) : []),
]);

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
    const isAdmin = ADMIN_EMAILS.has(email);

    if (role === "TUTOR") {
      const school = ((formData.get("school") as string) || "").trim();
      const educationLevel = ((formData.get("educationLevel") as string) || "").trim();

      const newUser = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          name: name || email.split("@")[0],
          role: isAdmin ? "ADMIN" : "TUTOR",
          onboardingCompleted: true,
          tutorProfile: {
            create: {
              status: "PENDING",
              school: school || undefined,
              currentGrade: educationLevel || undefined,
            },
          },
        },
      });

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
        },
      });

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
