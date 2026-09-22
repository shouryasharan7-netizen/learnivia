import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { CheckCircle2, XCircle, ArrowRight, ShieldCheck } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Verify Email | Learnivia",
  description: "Verify your Learnivia email address.",
};

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

  let status: "SUCCESS" | "EXPIRED" | "INVALID" = "INVALID";
  let verifiedEmail: string | null = null;

  if (token && typeof token === "string" && token.length > 10) {
    const user = await prisma.user.findFirst({
      where: { emailVerificationToken: token },
      select: { id: true, email: true, emailVerificationExpires: true },
    });

    if (user) {
      if (user.emailVerificationExpires && user.emailVerificationExpires > new Date()) {
        // Valid token: verify user and clear token
        await prisma.user.update({
          where: { id: user.id },
          data: {
            emailVerified: new Date(),
            emailVerificationToken: null,
            emailVerificationExpires: null,
          },
        });
        status = "SUCCESS";
        verifiedEmail = user.email;
      } else {
        status = "EXPIRED";
      }
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--wa-paper)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem 1rem",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "460px",
          background: "#FFFFFF",
          border: "1px solid #E5E0D8",
          borderRadius: "16px",
          padding: "2.5rem 2rem",
          textAlign: "center",
          boxShadow: "0 10px 30px -5px rgba(28, 25, 23, 0.05)",
        }}
      >
        <Link
          href="/"
          style={{
            textDecoration: "none",
            display: "inline-block",
            marginBottom: "1.5rem",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-serif, Georgia, serif)",
              fontSize: "1.75rem",
              fontWeight: 700,
              color: "#1C1917",
              letterSpacing: "-0.03em",
            }}
          >
            Learnivia
          </span>
        </Link>

        {status === "SUCCESS" && (
          <div>
            <div
              style={{
                width: "56px",
                height: "56px",
                borderRadius: "50%",
                background: "#ECFDF5",
                color: "#0E8345",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "1rem",
              }}
            >
              <CheckCircle2 size={32} />
            </div>
            <h1
              style={{
                fontFamily: "var(--font-serif, Georgia, serif)",
                fontSize: "1.5rem",
                fontWeight: 600,
                color: "#1C1917",
                marginBottom: "0.5rem",
              }}
            >
              Email verified!
            </h1>
            <p
              style={{
                fontSize: "0.95rem",
                color: "#57534E",
                lineHeight: 1.6,
                marginBottom: "1.75rem",
              }}
            >
              Thank you{verifiedEmail ? ` (${verifiedEmail})` : ""}. Your email address has been confirmed. You now have full access to peer tutoring sessions and learning resources.
            </p>
            <Link
              href="/dashboard"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
                width: "100%",
                padding: "0.85rem",
                background: "#0E8345",
                color: "#FFFFFF",
                fontWeight: 600,
                fontSize: "0.95rem",
                borderRadius: "8px",
                textDecoration: "none",
                boxSizing: "border-box",
                boxShadow: "0 2px 4px rgba(14, 131, 69, 0.15)",
              }}
            >
              Go to Dashboard <ArrowRight size={16} />
            </Link>
          </div>
        )}

        {status === "EXPIRED" && (
          <div>
            <div
              style={{
                width: "56px",
                height: "56px",
                borderRadius: "50%",
                background: "#FFFBEB",
                color: "#D97706",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "1rem",
              }}
            >
              <XCircle size={32} />
            </div>
            <h1
              style={{
                fontFamily: "var(--font-serif, Georgia, serif)",
                fontSize: "1.5rem",
                fontWeight: 600,
                color: "#1C1917",
                marginBottom: "0.5rem",
              }}
            >
              Verification link expired
            </h1>
            <p
              style={{
                fontSize: "0.95rem",
                color: "#57534E",
                lineHeight: 1.6,
                marginBottom: "1.75rem",
              }}
            >
              This verification link has expired. Please log in to your dashboard and request a new verification email.
            </p>
            <Link
              href="/signin"
              style={{
                display: "inline-block",
                width: "100%",
                padding: "0.85rem",
                background: "#0E8345",
                color: "#FFFFFF",
                fontWeight: 600,
                fontSize: "0.95rem",
                borderRadius: "8px",
                textDecoration: "none",
                boxSizing: "border-box",
              }}
            >
              Sign In to Resend
            </Link>
          </div>
        )}

        {status === "INVALID" && (
          <div>
            <div
              style={{
                width: "56px",
                height: "56px",
                borderRadius: "50%",
                background: "#FEF2F2",
                color: "#DC2626",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "1rem",
              }}
            >
              <ShieldCheck size={32} />
            </div>
            <h1
              style={{
                fontFamily: "var(--font-serif, Georgia, serif)",
                fontSize: "1.5rem",
                fontWeight: 600,
                color: "#1C1917",
                marginBottom: "0.5rem",
              }}
            >
              Invalid verification link
            </h1>
            <p
              style={{
                fontSize: "0.95rem",
                color: "#57534E",
                lineHeight: 1.6,
                marginBottom: "1.75rem",
              }}
            >
              The verification link provided is invalid or has already been used.
            </p>
            <Link
              href="/dashboard"
              style={{
                display: "inline-block",
                width: "100%",
                padding: "0.85rem",
                background: "#0E8345",
                color: "#FFFFFF",
                fontWeight: 600,
                fontSize: "0.95rem",
                borderRadius: "8px",
                textDecoration: "none",
                boxSizing: "border-box",
              }}
            >
              Go to Dashboard
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
