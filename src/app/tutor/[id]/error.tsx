"use client";

import { useEffect } from "react";
import { ErrorState } from "@/components/ui/ErrorState";

export default function TutorProfileError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      console.error("[Tutor profile page error]", error);
    }
  }, [error]);

  return (
    <main style={{ maxWidth: 640, margin: "5rem auto", padding: "0 1.5rem" }}>
      <ErrorState
        title="We couldn't load this tutor's profile"
        message="Something went wrong connecting to the tutor registry. This is likely temporary - please try again."
        onRetry={reset}
        homeLink={true}
      />
      {process.env.NODE_ENV === "development" && (
        <details
          style={{
            marginTop: "1.5rem",
            textAlign: "left",
            background: "#FFFBF7",
            border: "1px solid #F5D5C6",
            padding: "1rem",
            borderRadius: 8,
          }}
        >
          <summary
            style={{ cursor: "pointer", fontWeight: 600, color: "#C1694F" }}
          >
            Technical error details (development only)
          </summary>
          <pre
            style={{
              fontSize: "0.75rem",
              overflowX: "auto",
              marginTop: "0.5rem",
              whiteSpace: "pre-wrap",
            }}
          >
            {error.message}
            {error.digest && `\nDigest: ${error.digest}`}
          </pre>
        </details>
      )}
    </main>
  );
}
