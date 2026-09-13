"use client";

import { useEffect } from "react";
import Link from "next/link";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log exception for monitoring
    console.error("Global application boundary error:", error);
  }, [error]);

  return (
    <main
      style={{
        minHeight: "75vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "3rem 1.5rem",
        background: "var(--color-bg, #FAF8F5)",
        fontFamily: "var(--font-sans, system-ui, sans-serif)",
      }}
    >
      <div
        style={{
          maxWidth: 520,
          width: "100%",
          textAlign: "center",
          background: "#FFFFFF",
          border: "1px solid #FEE2E2",
          borderRadius: "16px",
          padding: "3rem 2rem",
          boxShadow: "0 8px 30px rgba(0,0,0,0.04)",
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: 72,
            height: 72,
            borderRadius: "50%",
            background: "#FEF2F2",
            fontSize: "2rem",
            marginBottom: "1.25rem",
          }}
          aria-hidden="true"
        >
          ⚠️
        </div>

        <div
          style={{
            fontSize: "0.85rem",
            fontWeight: 800,
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            color: "#DC2626",
            marginBottom: "0.5rem",
          }}
        >
          Unexpected Application Error
        </div>

        <h1
          style={{
            fontFamily: "var(--font-serif, Georgia, serif)",
            fontSize: "2rem",
            fontWeight: 800,
            color: "var(--color-navy, #0F172A)",
            marginBottom: "0.75rem",
            lineHeight: 1.25,
          }}
        >
          Something didn&apos;t load properly
        </h1>

        <p
          style={{
            color: "var(--color-text-muted, #57534E)",
            fontSize: "0.95rem",
            lineHeight: 1.6,
            marginBottom: "2rem",
          }}
        >
          We encountered an unexpected issue while loading this page. You can try refreshing the component or return to your student dashboard.
        </p>

        {error?.digest && (
          <div
            style={{
              fontSize: "0.75rem",
              color: "#94A3B8",
              background: "#F8FAFC",
              padding: "0.4rem 0.6rem",
              borderRadius: "6px",
              fontFamily: "monospace",
              marginBottom: "1.5rem",
            }}
          >
            Error ID: {error.digest}
          </div>
        )}

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "0.75rem",
          }}
        >
          <button
            onClick={() => reset()}
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem",
              background: "#0E8345",
              color: "#FFFFFF",
              fontWeight: 700,
              fontSize: "0.95rem",
              padding: "0.75rem 1.5rem",
              borderRadius: "10px",
              border: "none",
              cursor: "pointer",
              transition: "background 0.15s ease",
            }}
          >
            🔄 Try Again
          </button>

          <Link
            href="/"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem",
              background: "#F5F5F4",
              color: "var(--color-navy, #0F172A)",
              fontWeight: 600,
              fontSize: "0.95rem",
              padding: "0.75rem 1.5rem",
              borderRadius: "10px",
              textDecoration: "none",
              border: "1px solid #E7E5E4",
            }}
          >
            Return to Homepage
          </Link>
        </div>
      </div>
    </main>
  );
}
