"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function resetPassword(formData: FormData) {
  try {
    const token = ((formData.get("token") as string) || "").trim();
    const password = (formData.get("password") as string) || "";
    const confirmPassword = (formData.get("confirmPassword") as string) || "";

    if (!token) {
      return { error: "Reset token is missing or malformed." };
    }

    if (!password || password.length < 8) {
      return { error: "Password must be at least 8 characters long." };
    }

    if (password !== confirmPassword) {
      return { error: "Passwords do not match." };
    }

    // Find user with this active token
    const user = await prisma.user.findFirst({
      where: {
        passwordResetToken: token,
        passwordResetExpires: {
          gt: new Date(),
        },
      },
      select: { id: true, email: true },
    });

    if (!user) {
      return {
        error:
          "This password reset link is invalid or has expired. Please request a new reset link.",
      };
    }

    // Hash password with cost factor 12
    const hashedPassword = await bcrypt.hash(password, 12);

    // Update password and invalidate token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        passwordResetToken: null,
        passwordResetExpires: null,
        failedLoginCount: 0,
        lockedUntil: null,
      },
    });

    return { success: true };
  } catch (error: any) {
    console.error("Error in resetPassword action:", error);
    return {
      error: "An error occurred while resetting your password. Please try again.",
    };
  }
}
