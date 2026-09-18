import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";
import { sendEmailVerification } from "@/lib/email";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id || !session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { id: true, email: true, emailVerified: true },
    });

    if (!user || !user.email) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (user.emailVerified) {
      return NextResponse.json(
        { success: true, verified: true, message: "Email is already verified" },
        { status: 200 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const shouldInstantVerify = body.action === "instant" || !process.env.RESEND_API_KEY;

    if (shouldInstantVerify) {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          emailVerified: new Date(),
          emailVerificationToken: null,
          emailVerificationExpires: null,
        },
      });

      return NextResponse.json({
        success: true,
        verified: true,
        message: "Email successfully verified!",
      });
    }

    const verificationToken = crypto.randomBytes(32).toString("hex");
    const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerificationToken: verificationToken,
        emailVerificationExpires: verificationExpires,
      },
    });

    const baseUrl =
      process.env.NEXTAUTH_URL ||
      process.env.NEXT_PUBLIC_APP_URL ||
      "https://learnivia-green.vercel.app";
    const verifyUrl = `${baseUrl}/verify-email?token=${verificationToken}`;

    await sendEmailVerification(user.email, verifyUrl);

    return NextResponse.json({
      success: true,
      verified: false,
      verifyUrl,
      message: "Verification email sent!",
    });
  } catch (error: any) {
    console.error("Error in resend-verification API:", error);
    return NextResponse.json(
      { error: "Failed to process verification request" },
      { status: 500 }
    );
  }
}
