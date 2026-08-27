"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function FindError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to console in development
    if (process.env.NODE_ENV === "development") {
      console.error("[Find page error]", error);
    }
  }, [error]);

  return (
    <main style={{ maxWidth: 600, margin: "6rem auto", padding: "0 1.5rem", textAlign: "center" }}>
      <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>⚠️</div>
      <h1 style={{ fontSize: "1.5rem", fontWeight: 800, color: "#17324D", marginBottom: "0.75rem" }}>
        We couldn't load the tutor list
      </h1>
      <p style={{ color: "#5a6a7a", marginBottom: "2rem", lineHeight: 1.6 }}>
        Something went wrong connecting to our database. This is likely temporary — please try again.
      </p>
      <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
        <button
          onClick={reset}
          style={{
            background: "#39A6A3",
            color: "white",
            border: "none",
            padding: "0.875rem 1.5rem",
            borderRadius: 9999,
            fontWeight: 700,
            cursor: "pointer",
            fontSize: "1rem",
          }}
        >
          Try again
        </button>
        <Link
          href="/"
          style={{
            background: "white",
            color: "#17324D",
            border: "2px solid #dde7ef",
            padding: "0.875rem 1.5rem",
            borderRadius: 9999,
            fontWeight: 600,
            fontSize: "1rem",
          }}
        >
          Go home
        </Link>
      </div>
      {process.env.NODE_ENV === "development" && (
        <details style={{ marginTop: "2rem", textAlign: "left", background: "#fdecea", padding: "1rem", borderRadius: 8 }}>
          <summary style={{ cursor: "pointer", fontWeight: 600, color: "#e74c3c" }}>Error details (dev only)</summary>
          <pre style={{ fontSize: "0.75rem", overflowX: "auto", marginTop: "0.5rem", whiteSpace: "pre-wrap" }}>
            {error.message}
            {error.digest && `\nDigest: ${error.digest}`}
          </pre>
        </details>
      )}
    </main>
  );
}
