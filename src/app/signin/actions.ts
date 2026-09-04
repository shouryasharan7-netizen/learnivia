"use server";

import { signIn } from "@/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";

const ADMIN_EMAILS = new Set([
  "shouryasharan7@gmail.com",
  ...(process.env.ADMIN_EMAILS ? process.env.ADMIN_EMAILS.split(",").map((e) => e.trim().toLowerCase()) : []),
]);

export async function loginWithEmail(formData: FormData) {
  const rawEmail = (formData.get("email") as string) || "";
  const email = rawEmail.trim().toLowerCase();
  const password = (formData.get("password") as string) || "";
  const name = ((formData.get("name") as string) || "").trim();
  const action = (formData.get("action") as string) || "login";

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

    const rawAge = formData.get("age") as string;
    const age = rawAge ? parseInt(rawAge, 10) : undefined;
    const grade = ((formData.get("grade") as string) || "").trim() || undefined;
    const curriculum = ((formData.get("curriculum") as string) || "").trim() || undefined;

    const hashedPassword = await bcrypt.hash(password, 10);
    const isAdmin = ADMIN_EMAILS.has(email);

    await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: name || email.split("@")[0],
        role: isAdmin ? "ADMIN" : "STUDENT",
        onboardingCompleted: false,
        age: isNaN(age as number) ? undefined : age,
        grade,
        curriculum,
      },
    });

    // Automatically sign them in after registering
    try {
      await signIn("credentials", { email, password, redirect: false });
      return { success: true };
    } catch (error) {
      if (error instanceof AuthError) {
        return { error: "Account created! Please enter your credentials to sign in." };
      }
      throw error;
    }
  }

  // Handle Login
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser && !existingUser.password) {
    return {
      error: "This email is registered with Google. Please click 'Continue with Google'.",
    };
  }

  try {
    await signIn("credentials", { email, password, redirect: false });
    return { success: true };
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
