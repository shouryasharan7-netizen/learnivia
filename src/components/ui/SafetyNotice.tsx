import React from "react";
import Link from "next/link";
import { ShieldCheck, Flag } from "lucide-react";
import { ROUTES } from "@/lib/routes";

interface SafetyNoticeProps {
  compact?: boolean;
  className?: string;
}

export function SafetyNotice({ compact = false, className = "" }: SafetyNoticeProps) {
  if (compact) {
    return (
      <div
        className={className}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "0.5rem",
          fontSize: "0.75rem",
          color: "var(--wa-muted)",
        }}
      >
        <ShieldCheck size={14} color="var(--wa-green)" aria-hidden="true" />
        <span>Child-safe peer learning space.</span>
        <Link
          href={ROUTES.safety}
          style={{ color: "var(--wa-green)", fontWeight: 600, textDecoration: "underline" }}
        >
          Standards
        </Link>
        <span>•</span>
        <Link
          href={ROUTES.safetyReport}
          style={{ color: "var(--wa-muted)", textDecoration: "underline" }}
        >
          Report concern
        </Link>
      </div>
    );
  }

  return (
    <aside
      className={className}
      aria-label="Child safety standards"
      style={{
        padding: "1rem 1.25rem",
        background: "var(--wa-green-light)",
        border: "1px solid rgba(45, 106, 79, 0.18)",
        borderRadius: "var(--wa-radius-md)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "1rem",
        flexWrap: "wrap",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: "8px",
            background: "rgba(45, 106, 79, 0.15)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--wa-green)",
          }}
          aria-hidden="true"
        >
          <ShieldCheck size={17} strokeWidth={2} />
        </div>
        <div>
          <p
            style={{
              fontSize: "0.875rem",
              fontWeight: 600,
              color: "var(--wa-green-active)",
              margin: 0,
              lineHeight: 1.3,
            }}
          >
            Safe, Supervised Learning Environment
          </p>
          <p style={{ fontSize: "0.75rem", color: "#3B5E4F", margin: 0, marginTop: "0.15rem" }}>
            All sessions use verified waiting rooms. Private contact information is never shared between minors.
          </p>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "0.85rem", fontSize: "0.8125rem" }}>
        <Link
          href={ROUTES.safety}
          style={{
            color: "var(--wa-green-active)",
            fontWeight: 600,
            textDecoration: "underline",
          }}
        >
          Safeguarding Policy
        </Link>
        <Link
          href={ROUTES.safetyReport}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.3rem",
            color: "#4A6B5C",
            textDecoration: "none",
          }}
        >
          <Flag size={13} aria-hidden="true" />
          <span>Report an issue</span>
        </Link>
      </div>
    </aside>
  );
}
