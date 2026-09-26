"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Lock,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  Loader2,
} from "lucide-react";
import { resetPassword } from "./actions";

export default function ResetPasswordClient() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  if (!token) {
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
            maxWidth: "420px",
            width: "100%",
            background: "#FFFFFF",
            border: "1px solid #E5E0D8",
            borderRadius: "16px",
            padding: "2.5rem 2rem",
            textAlign: "center",
            boxShadow: "0 10px 30px -5px rgba(28, 25, 23, 0.05)",
          }}
        >
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "50%",
              background: "#FEF2F2",
              color: "#DC2626",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "1rem",
            }}
          >
            <AlertCircle size={26} />
          </div>
          <h1
            style={{
              fontFamily: "var(--font-serif, Georgia, serif)",
              fontSize: "1.4rem",
              fontWeight: 600,
              color: "#1C1917",
              marginBottom: "0.5rem",
            }}
          >
            Invalid Reset Link
          </h1>
          <p
            style={{
              fontSize: "0.9rem",
              color: "#78716C",
              lineHeight: 1.5,
              marginBottom: "1.75rem",
            }}
          >
            The reset token is missing. Please request a new password reset
            link.
          </p>
          <Link
            href="/forgot-password"
            style={{
              display: "inline-block",
              background: "#0E8345",
              color: "#FFFFFF",
              fontWeight: 600,
              fontSize: "0.9rem",
              padding: "0.75rem 1.5rem",
              borderRadius: "8px",
              textDecoration: "none",
            }}
          >
            Request New Link
          </Link>
        </div>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("token", token as string);
    formData.append("password", password);
    formData.append("confirmPassword", confirmPassword);

    try {
      const res = await resetPassword(formData);
      if (res.error) {
        setError(res.error);
      } else if (res.success) {
        setSuccess(true);
      }
    } catch {
      setError("Failed to reset password. Please try again.");
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
          boxShadow: "0 10px 30px -5px rgba(28, 25, 23, 0.05)",
        }}
      >
        {/* Header */}
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
            Create new password
          </h1>
          <p style={{ fontSize: "0.9rem", color: "#78716C", margin: 0 }}>
            Choose a strong password with at least 8 characters.
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

        {success ? (
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
                fontSize: "1.15rem",
                fontWeight: 600,
                color: "#1C1917",
                margin: "0 0 0.5rem",
              }}
            >
              Password reset successful
            </h2>
            <p
              style={{
                fontSize: "0.875rem",
                color: "#57534E",
                lineHeight: 1.6,
                marginBottom: "1.75rem",
              }}
            >
              Your password has been securely updated. You can now sign in with
              your new credentials.
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
                textAlign: "center",
                boxSizing: "border-box",
              }}
            >
              Sign In Now →
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {/* New Password */}
            <div style={{ marginBottom: "1.25rem" }}>
              <label
                htmlFor="password"
                style={{
                  display: "block",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  color: "#44403C",
                  marginBottom: "0.5rem",
                }}
              >
                New Password
              </label>
              <div style={{ position: "relative" }}>
                <Lock
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
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 8 characters"
                  style={{
                    width: "100%",
                    padding: "0.75rem 2.5rem 0.75rem 2.5rem",
                    borderRadius: "8px",
                    border: "1px solid #D6D3D1",
                    fontSize: "0.95rem",
                    color: "#1C1917",
                    background: "#FAFAF9",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: "absolute",
                    right: "10px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    color: "#A8A29E",
                    cursor: "pointer",
                    padding: "4px",
                  }}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div style={{ marginBottom: "1.5rem" }}>
              <label
                htmlFor="confirmPassword"
                style={{
                  display: "block",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  color: "#44403C",
                  marginBottom: "0.5rem",
                }}
              >
                Confirm Password
              </label>
              <div style={{ position: "relative" }}>
                <Lock
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
                  id="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter your password"
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
                  Updating Password...
                </>
              ) : (
                "Reset Password"
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
