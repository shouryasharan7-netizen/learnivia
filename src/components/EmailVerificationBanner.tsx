"use client";

import { useState } from "react";
import { Mail, Check, AlertCircle, Loader2, Sparkles, X } from "lucide-react";

export default function EmailVerificationBanner({ email }: { email?: string | null }) {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [verified, setVerified] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (dismissed) return null;

  async function handleInstantVerify() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "instant" }),
      });
      const data = await res.json();
      if (res.ok && data.verified) {
        setVerified(true);
        setTimeout(() => {
          window.location.reload();
        }, 1200);
      } else {
        setError(data.error || "Could not verify email. Please try again.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "resend" }),
      });
      const data = await res.json();
      if (res.ok) {
        if (data.verified) {
          setVerified(true);
          setTimeout(() => {
            window.location.reload();
          }, 1200);
        } else {
          setSent(true);
        }
      } else {
        setError(data.error || "Failed to resend verification email.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <aside
      aria-label="Email verification notice"
      style={{
        background: "var(--wa-white, #FFFFFF)",
        border: "1px solid var(--wa-border, #E2E8F0)",
        borderRadius: "12px",
        padding: "1rem 1.25rem",
        marginBottom: "1.5rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: "0.85rem",
        boxShadow: "var(--wa-shadow-xs, 0 1px 3px rgba(0,0,0,0.05))",
        position: "relative",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", maxWidth: "680px" }}>
        <div
          style={{
            width: "36px",
            height: "36px",
            borderRadius: "50%",
            background: "rgba(37, 99, 235, 0.1)",
            color: "var(--wa-crimson, #2563EB)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <Mail size={18} />
        </div>
        <div>
          <strong style={{ fontSize: "0.875rem", color: "var(--wa-ink, #0F172A)", display: "block" }}>
            Please verify your email address
          </strong>
          <span style={{ fontSize: "0.8125rem", color: "var(--wa-muted, #64748B)", lineHeight: 1.5 }}>
            Account verification ensures tutoring session safety and unlocks full platform access for{" "}
            <strong style={{ color: "var(--wa-ink, #0F172A)" }}>{email || "your account"}</strong>.
          </span>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", flexWrap: "wrap" }}>
        {verified ? (
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.4rem",
              fontSize: "0.8125rem",
              fontWeight: 700,
              color: "#065F46",
              background: "#D1FAE5",
              padding: "0.45rem 0.85rem",
              borderRadius: "6px",
            }}
          >
            <Check size={15} /> Email Verified!
          </span>
        ) : sent ? (
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.4rem",
              fontSize: "0.8125rem",
              fontWeight: 700,
              color: "#065F46",
              background: "#D1FAE5",
              padding: "0.45rem 0.85rem",
              borderRadius: "6px",
            }}
          >
            <Check size={15} /> Verification Link Sent!
          </span>
        ) : (
          <>
            <button
              type="button"
              onClick={handleInstantVerify}
              disabled={loading}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.4rem",
                fontSize: "0.8125rem",
                fontWeight: 700,
                color: "#FFFFFF",
                background: "var(--wa-crimson, #2563EB)",
                border: "none",
                padding: "0.5rem 0.95rem",
                borderRadius: "6px",
                cursor: loading ? "not-allowed" : "pointer",
                boxShadow: "0 2px 4px rgba(37, 99, 235, 0.2)",
                transition: "opacity 0.15s ease",
              }}
            >
              {loading ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  <Sparkles size={14} />
                  Verify Email Now
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleResend}
              disabled={loading}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.35rem",
                fontSize: "0.8125rem",
                fontWeight: 600,
                color: "var(--wa-ink, #0F172A)",
                background: "var(--wa-cream-dark, #F1F5F9)",
                border: "1px solid var(--wa-border, #CBD5E1)",
                padding: "0.45rem 0.85rem",
                borderRadius: "6px",
                cursor: loading ? "not-allowed" : "pointer",
              }}
            >
              Resend Link
            </button>
          </>
        )}

        <button
          type="button"
          onClick={() => setDismissed(true)}
          aria-label="Dismiss verification banner"
          style={{
            background: "transparent",
            border: "none",
            color: "var(--wa-muted, #64748B)",
            cursor: "pointer",
            padding: "0.4rem",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "4px",
          }}
        >
          <X size={16} />
        </button>
      </div>

      {error && (
        <div
          style={{
            width: "100%",
            fontSize: "0.775rem",
            color: "#DC2626",
            display: "flex",
            alignItems: "center",
            gap: "0.35rem",
            marginTop: "0.25rem",
          }}
        >
          <AlertCircle size={14} /> {error}
        </div>
      )}
    </aside>
  );
}
