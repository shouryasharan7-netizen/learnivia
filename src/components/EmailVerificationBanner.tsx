"use client";

import { useState } from "react";
import { Mail, Check, AlertCircle, Loader2 } from "lucide-react";

export default function EmailVerificationBanner({ email }: { email?: string | null }) {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleResend() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/resend-verification", { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        setSent(true);
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
    <div
      style={{
        background: "#FFFBEB",
        border: "1px solid #FDE68A",
        borderRadius: "12px",
        padding: "0.85rem 1.25rem",
        marginBottom: "1.5rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: "0.75rem",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
        <div
          style={{
            width: "32px",
            height: "32px",
            borderRadius: "50%",
            background: "#FEF3C7",
            color: "#D97706",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <Mail size={16} />
        </div>
        <div>
          <strong style={{ fontSize: "0.875rem", color: "#92400E", display: "block" }}>
            Please verify your email address
          </strong>
          <span style={{ fontSize: "0.8rem", color: "#B45309" }}>
            We sent a verification link to <strong>{email || "your email"}</strong>. Verifying your email ensures account security and unlocks all tutoring features.
          </span>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        {sent ? (
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.35rem",
              fontSize: "0.8rem",
              fontWeight: 700,
              color: "#065F46",
              background: "#D1FAE5",
              padding: "0.35rem 0.75rem",
              borderRadius: "6px",
            }}
          >
            <Check size={14} /> Verification Link Sent!
          </span>
        ) : (
          <button
            onClick={handleResend}
            disabled={loading}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.35rem",
              fontSize: "0.8rem",
              fontWeight: 700,
              color: "#92400E",
              background: "#FEF3C7",
              border: "1px solid #FCD34D",
              padding: "0.4rem 0.85rem",
              borderRadius: "6px",
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? (
              <>
                <Loader2 size={13} className="animate-spin" />
                Sending...
              </>
            ) : (
              "Resend Link"
            )}
          </button>
        )}
      </div>

      {error && (
        <div
          style={{
            width: "100%",
            fontSize: "0.75rem",
            color: "#DC2626",
            display: "flex",
            alignItems: "center",
            gap: "0.3rem",
            marginTop: "0.25rem",
          }}
        >
          <AlertCircle size={13} /> {error}
        </div>
      )}
    </div>
  );
}
