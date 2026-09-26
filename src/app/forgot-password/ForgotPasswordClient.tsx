"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Mail,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { requestPasswordReset } from "./actions";

export default function ForgotPasswordClient() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData();
    formData.append("email", email);

    try {
      const res = await requestPasswordReset(formData);
      if (res.error) {
        setError(res.error);
      } else if (res.success) {
        setSuccessMessage(res.message || "Reset link dispatched.");
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--wa-paper)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem 1rem",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "440px",
          background: "#FFFFFF",
          border: "1px solid #E5E0D8",
          borderRadius: "16px",
          padding: "2.5rem 2rem",
          boxShadow:
            "0 10px 30px -5px rgba(28, 25, 23, 0.05), 0 4px 6px -2px rgba(28, 25, 23, 0.02)",
        }}
      >
        {/* Logo & Header */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <Link
            href="/"
            style={{
              textDecoration: "none",
              display: "inline-block",
              marginBottom: "1rem",
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
          <h1
            style={{
              fontFamily: "var(--font-serif, Georgia, serif)",
              fontSize: "1.5rem",
              fontWeight: 600,
              color: "#1C1917",
              margin: "0 0 0.5rem",
              letterSpacing: "-0.02em",
            }}
          >
            Reset your password
          </h1>
          <p
            style={{
              fontSize: "0.9rem",
              color: "#78716C",
              margin: 0,
              lineHeight: 1.5,
            }}
          >
            Enter the email address linked to your account and we&apos;ll send
            you a secure link to reset it.
          </p>
        </div>

        {error && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.85rem 1rem",
              background: "#FEF2F2",
              border: "1px solid #FEE2E2",
              borderRadius: "8px",
              color: "#991B1B",
              fontSize: "0.875rem",
              marginBottom: "1.5rem",
            }}
          >
            <AlertCircle size={18} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        {successMessage ? (
          <div style={{ textAlign: "center", padding: "1rem 0" }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: "48px",
                height: "48px",
                background: "#ECFDF5",
                borderRadius: "50%",
                color: "#0E8345",
                marginBottom: "1rem",
              }}
            >
              <CheckCircle size={26} />
            </div>
            <h2
              style={{
                fontSize: "1.1rem",
                fontWeight: 600,
                color: "#1C1917",
                margin: "0 0 0.5rem",
              }}
            >
              Check your inbox
            </h2>
            <p
              style={{
                fontSize: "0.875rem",
                color: "#57534E",
                lineHeight: 1.6,
                marginBottom: "1.75rem",
              }}
            >
              {successMessage}
            </p>
            <Link
              href="/signin"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                color: "#0E8345",
                fontWeight: 600,
                fontSize: "0.9rem",
                textDecoration: "none",
              }}
            >
              <ArrowLeft size={16} /> Return to sign in
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "1.5rem" }}>
              <label
                htmlFor="email"
                style={{
                  display: "block",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  color: "#44403C",
                  marginBottom: "0.5rem",
                }}
              >
                Email Address
              </label>
              <div style={{ position: "relative" }}>
                <Mail
                  size={18}
                  style={{
                    position: "absolute",
                    left: "12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#A8A29E",
                    pointerEvents: "none",
                  }}
                />
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  style={{
                    width: "100%",
                    padding: "0.75rem 0.85rem 0.75rem 2.5rem",
                    borderRadius: "8px",
                    border: "1px solid #D6D3D1",
                    fontSize: "0.95rem",
                    color: "#1C1917",
                    background: "#FAFAF9",
                    outline: "none",
                    boxSizing: "border-box",
                    transition: "border-color 0.15s, box-shadow 0.15s",
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "#0E8345";
                    e.currentTarget.style.boxShadow =
                      "0 0 0 3px rgba(14, 131, 69, 0.12)";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "#D6D3D1";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                padding: "0.85rem",
                background: "#0E8345",
                color: "#FFFFFF",
                fontWeight: 600,
                fontSize: "0.95rem",
                border: "none",
                borderRadius: "8px",
                cursor: loading ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
                boxShadow: "0 2px 4px rgba(14, 131, 69, 0.15)",
                opacity: loading ? 0.8 : 1,
              }}
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Sending Link...
                </>
              ) : (
                "Send Reset Link"
              )}
            </button>

            <div style={{ textAlign: "center", marginTop: "1.75rem" }}>
              <Link
                href="/signin"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.4rem",
                  color: "#78716C",
                  fontSize: "0.875rem",
                  textDecoration: "none",
                  fontWeight: 500,
                }}
              >
                <ArrowLeft size={15} /> Back to sign in
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
