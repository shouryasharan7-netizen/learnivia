import Link from "next/link";
import type { Metadata } from "next";
import { ShieldAlert, Home } from "lucide-react";
import { ROUTES } from "@/lib/routes";

export const metadata: Metadata = {
  title: "Access Restricted | Learnivia",
};

export default function Forbidden() {
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
          maxWidth: 480,
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
            color: "#991B1B",
            marginBottom: "1.25rem",
          }}
          aria-hidden="true"
        >
          <ShieldAlert size={28} strokeWidth={1.75} />
        </div>

        <div
          style={{
            fontSize: "0.8125rem",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            color: "#991B1B",
            marginBottom: "0.35rem",
          }}
        >
          403 Forbidden
        </div>

        <h1
          style={{
            fontFamily: "var(--font-serif, Newsreader, Georgia, serif)",
            fontSize: "1.875rem",
            fontWeight: 600,
            color: "var(--wa-ink)",
            marginBottom: "0.75rem",
            lineHeight: 1.2,
          }}
        >
          Access Restricted
        </h1>

        <p
          style={{
            color: "var(--wa-muted)",
            fontSize: "0.9375rem",
            lineHeight: 1.6,
            marginBottom: "2rem",
          }}
        >
          You do not have permission to access this area. This workspace is reserved for authorized platform administrators or verified tutors.
        </p>

        <Link
          href={ROUTES.learner.home}
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.5rem",
            background: "var(--wa-green)",
            color: "#FFFFFF",
            fontWeight: 600,
            fontSize: "0.875rem",
            padding: "0.7rem 1.5rem",
            borderRadius: "var(--wa-radius-sm)",
            textDecoration: "none",
          }}
        >
          <Home size={16} aria-hidden="true" />
          <span>Return to Learner Dashboard</span>
        </Link>
      </div>
    </main>
  );
}
