"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertCircle, RotateCcw, Home } from "lucide-react";
import { ROUTES } from "@/lib/routes";

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
        background: "var(--wa-cream)",
      }}
    >
      <div
        style={{
          maxWidth: 500,
          width: "100%",
          textAlign: "center",
          background: "var(--wa-white)",
          border: "1px solid var(--wa-border)",
          borderRadius: "var(--wa-radius-lg)",
          padding: "3rem 2rem",
          boxShadow: "var(--wa-shadow-sm)",
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: 56,
            height: 56,
            borderRadius: "12px",
            background: "#FEF2F2",
            color: "#B91C1C",
            marginBottom: "1.25rem",
          }}
          aria-hidden="true"
        >
          <AlertCircle size={28} strokeWidth={1.75} />
        </div>

        <div
          style={{
            fontSize: "0.8125rem",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            color: "#B91C1C",
            marginBottom: "0.35rem",
          }}
        >
          Application Error
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
              background: "var(--wa-green)",
              color: "#FFFFFF",
              fontWeight: 600,
              fontSize: "0.875rem",
              padding: "0.75rem 1.5rem",
              borderRadius: "var(--wa-radius-sm)",
              border: "none",
              cursor: "pointer",
              transition: "background 0.15s ease",
            }}
          >
            <RotateCcw size={16} aria-hidden="true" />
            <span>Try Again</span>
          </button>

          <Link
            href={ROUTES.learner.home}
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem",
              background: "var(--wa-white)",
              color: "var(--wa-ink)",
              fontWeight: 600,
              fontSize: "0.875rem",
              padding: "0.75rem 1.5rem",
              borderRadius: "var(--wa-radius-sm)",
              textDecoration: "none",
              border: "1px solid var(--wa-border)",
            }}
          >
            <Home size={16} aria-hidden="true" />
            <span>Return to Dashboard</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
