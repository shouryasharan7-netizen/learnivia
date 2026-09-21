"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RotateCcw, ArrowRight } from "lucide-react";

export default function TutorError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Tutor Dashboard error:", error);
  }, [error]);

  return (
    <main style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem", background: "var(--bg-canvas, #F4F0E8)" }}>
      <div style={{ maxWidth: 480, width: "100%", background: "var(--bg-card, #FBFAF7)", border: "1px solid var(--border-hairline, #D9D3C8)", borderRadius: 12, padding: "2.5rem 2rem", textAlign: "center", boxShadow: "0 4px 20px rgba(30, 39, 34, 0.05)" }}>
        <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 56, height: 56, borderRadius: "50%", background: "rgba(184, 90, 67, 0.1)", color: "var(--color-terracotta, #B85A43)", marginBottom: "1rem" }}>
          <AlertTriangle size={28} />
        </div>
        <h1 style={{ fontFamily: "var(--font-serif, 'Source Serif 4', Georgia, serif)", fontSize: "1.5rem", fontWeight: 700, color: "var(--text-ink, #1E2722)", marginBottom: "0.5rem" }}>
          Tutor Portal Temporarily Unavailable
        </h1>
        <p style={{ color: "var(--text-muted, #66716A)", fontSize: "0.95rem", lineHeight: 1.6, marginBottom: "1.75rem" }}>
          We encountered an issue loading your tutoring sessions. Please try refreshing or return to your student dashboard.
        </p>
        <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap" }}>
          <button
            onClick={() => reset()}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              background: "var(--color-forest, #234B3B)",
              color: "#FBFAF7",
              border: "none",
              padding: "0.75rem 1.5rem",
              borderRadius: "6px",
              fontWeight: 600,
              fontSize: "0.9rem",
              cursor: "pointer",
            }}
          >
            <RotateCcw size={15} /> Try Again
          </button>
          <Link
            href="/dashboard"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              background: "var(--bg-canvas, #F4F0E8)",
              color: "var(--text-ink, #1E2722)",
              border: "1px solid var(--border-hairline, #D9D3C8)",
              padding: "0.75rem 1.25rem",
              borderRadius: "6px",
              fontWeight: 600,
              fontSize: "0.9rem",
              textDecoration: "none",
            }}
          >
            Go to Dashboard <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </main>
  );
}
