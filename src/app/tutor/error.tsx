"use client";

import { useEffect } from "react";
import Link from "next/link";

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
    <main style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem", background: "#F8FAFC" }}>
      <div style={{ maxWidth: 480, width: "100%", background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: 16, padding: "2.5rem 2rem", textAlign: "center", boxShadow: "0 10px 25px rgba(0,0,0,0.05)" }}>
        <div style={{ fontSize: "3rem", marginBottom: "0.75rem" }}>🛠️</div>
        <h1 style={{ fontSize: "1.5rem", fontWeight: 800, color: "#14243B", marginBottom: "0.5rem" }}>
          Tutor Portal Temporarily Unavailable
        </h1>
        <p style={{ color: "#64748B", fontSize: "0.95rem", lineHeight: 1.6, marginBottom: "1.75rem" }}>
          We encountered an issue loading your tutoring sessions. Please try refreshing or return to your student dashboard.
        </p>
        <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap" }}>
          <button
            onClick={() => reset()}
            style={{
              background: "#0E8345",
              color: "#FFFFFF",
              border: "none",
              padding: "0.75rem 1.5rem",
              borderRadius: "9999px",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Try Again ⟳
          </button>
          <Link
            href="/dashboard"
            style={{
              background: "#F1F5F9",
              color: "#334155",
              border: "1px solid #CBD5E1",
              padding: "0.75rem 1.25rem",
              borderRadius: "9999px",
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    </main>
  );
}
