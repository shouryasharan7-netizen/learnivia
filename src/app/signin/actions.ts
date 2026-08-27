"use server";

import { signIn } from "@/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";

export async function loginWithEmail(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const action = formData.get("action") as string;

  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  if (action === "register") {
    // Check if user exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return { error: "A user with this email already exists." };
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    
    await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: email.split("@")[0], // default name
      }
    });

    // Automatically sign them in after registering
    try {
      await signIn("credentials", { email, password, redirect: false });
      return { success: true };
    } catch (error) {
      if (error instanceof AuthError) {
        return { error: "Failed to sign in after registration." };
      }
      throw error;
    }
  }

  // Handle Login
  try {
    await signIn("credentials", { email, password, redirect: false });
    return { success: true };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid credentials." };
        default:
          return { error: "Something went wrong." };
      }
    }
    throw error;
  }
}

export async function loginWithGoogle(formData: FormData) {
  const callbackUrl = formData.get("callbackUrl") as string || "/dashboard";
  await signIn("google", { redirectTo: callbackUrl });
}
