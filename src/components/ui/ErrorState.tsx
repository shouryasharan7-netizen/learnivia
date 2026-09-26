import React from "react";
import { AlertCircle, RotateCcw } from "lucide-react";
import Link from "next/link";
import { ROUTES } from "@/lib/routes";

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  homeLink?: boolean;
  className?: string;
}

export function ErrorState({
  title = "Something went wrong",
  message,
  onRetry,
  homeLink = true,
  className = "",
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      className={className}
      style={{
        padding: "1.75rem",
        background: "var(--warning-light, #FFFBF7)",
        border: "1px solid var(--warning, #F5D5C6)",
        borderRadius: "var(--wa-radius-md)",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: "0.75rem",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          color: "#C1694F",
        }}
      >
        <AlertCircle size={18} strokeWidth={2} aria-hidden="true" />
        <h2
          style={{
            fontFamily: "var(--font-serif, Newsreader, serif)",
            fontSize: "1.125rem",
            fontWeight: 600,
            color: "var(--text-primary, #0C1B33)",
            margin: 0,
          }}
        >
          {title}
        </h2>
      </div>

      <p
        style={{
          fontSize: "0.875rem",
          color: "var(--text-secondary, #475569)",
          margin: 0,
          lineHeight: 1.5,
        }}
      >
        {message}
      </p>

      {(onRetry || homeLink) && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            marginTop: "0.5rem",
          }}
        >
          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.4rem",
                padding: "0.45rem 0.85rem",
                borderRadius: "var(--wa-radius-sm)",
                background: "var(--surface-raised, #FFFFFF)",
                border: "1px solid var(--border, #E2E8F0)",
                color: "var(--text-primary, #0C1B33)",
                fontSize: "0.8125rem",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              <RotateCcw size={14} aria-hidden="true" />
              Try again
            </button>
          )}

          {homeLink && (
            <Link
              href={ROUTES.learner.home}
              style={{
                fontSize: "0.8125rem",
                fontWeight: 600,
                color: "var(--wa-green)",
                textDecoration: "underline",
              }}
            >
              Return to dashboard
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
