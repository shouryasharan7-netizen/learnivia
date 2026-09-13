"use server";

import { prisma } from "@/lib/prisma";
import crypto from "crypto";
import { sendPasswordResetEmail } from "@/lib/email";

export async function requestPasswordReset(formData: FormData) {
  try {
    const rawEmail = (formData.get("email") as string) || "";
    const email = rawEmail.trim().toLowerCase();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return { error: "Please enter a valid email address." };
    }

    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, email: true, password: true },
    });

    // Only send reset email if user exists and has a password (not Google-only)
    if (user && user.password) {
      const resetToken = crypto.randomBytes(32).toString("hex");
      const resetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

      await prisma.user.update({
        where: { id: user.id },
        data: {
          passwordResetToken: resetToken,
          passwordResetExpires: resetExpires,
        },
      });

      const baseUrl =
        process.env.NEXTAUTH_URL ||
        process.env.NEXT_PUBLIC_APP_URL ||
        "https://learnivia-green.vercel.app";
      const resetUrl = `${baseUrl}/reset-password?token=${resetToken}`;

      await sendPasswordResetEmail(email, resetUrl);
    }

    // Always return generic success to prevent email enumeration attacks
    return {
      success: true,
      message:
        "If an account with that email exists, we've sent password reset instructions to your inbox.",
    };
  } catch (error: any) {
    console.error("Error in requestPasswordReset:", error);
    return {
      error: "An error occurred while processing your request. Please try again later.",
    };
  }
}
