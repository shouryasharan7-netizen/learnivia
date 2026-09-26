import Link from "next/link";
import type { Metadata } from "next";
import { Compass, Home, Search } from "lucide-react";
import { ROUTES } from "@/lib/routes";

export const metadata: Metadata = {
  title: "Page Not Found | Learnivia",
};

export default function NotFound() {
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
            background: "var(--wa-cream-dark)",
            color: "var(--wa-muted)",
            marginBottom: "1.25rem",
          }}
          aria-hidden="true"
        >
          <Compass size={28} strokeWidth={1.75} />
        </div>

        <div
          style={{
            fontSize: "0.8125rem",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            color: "var(--wa-muted)",
            marginBottom: "0.35rem",
          }}
        >
          404 Not Found
        </div>

        <h1
          style={{
            fontFamily: "var(--font-serif, Georgia, serif)",
            fontSize: "2.25rem",
            fontWeight: 800,
            color: "var(--color-navy, #0F172A)",
            marginBottom: "0.75rem",
            lineHeight: 1.2,
          }}
        >
          Page not found
        </h1>

        <p
          style={{
            color: "var(--color-text-muted, #57534E)",
            fontSize: "0.95rem",
            lineHeight: 1.6,
            marginBottom: "2rem",
          }}
        >
          We couldn&apos;t find the learning resource or page you requested. It
          may have been moved, updated, or does not exist.
        </p>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "0.75rem",
            marginBottom: "2rem",
          }}
        >
          <Link
            href={ROUTES.find}
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem",
              background: "var(--wa-green)",
              color: "#FFFFFF",
              fontWeight: 600,
              fontSize: "0.875rem",
              padding: "0.7rem 1.25rem",
              borderRadius: "var(--wa-radius-sm)",
              textDecoration: "none",
            }}
          >
            <Search size={16} aria-hidden="true" />
            <span>Find a Peer Tutor</span>
          </Link>

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
              padding: "0.7rem 1.25rem",
              borderRadius: "var(--wa-radius-sm)",
              textDecoration: "none",
              border: "1px solid var(--wa-border)",
            }}
          >
            <Home size={16} aria-hidden="true" />
            <span>Return to Dashboard</span>
          </Link>
        </div>

        <div
          style={{
            borderTop: "1px solid #F5F5F4",
            paddingTop: "1.25rem",
            display: "flex",
            justifyContent: "center",
            gap: "1.5rem",
            fontSize: "0.85rem",
            color: "#78716C",
          }}
        >
          <Link href="/dashboard" style={{ color: "#0E8345", fontWeight: 600 }}>
            Dashboard
          </Link>
          <Link href="/sessions" style={{ color: "#0E8345", fontWeight: 600 }}>
            Sessions
          </Link>
          <Link href="/faq" style={{ color: "#0E8345", fontWeight: 600 }}>
            Help &amp; FAQ
          </Link>
        </div>
      </div>
    </main>
  );
}
