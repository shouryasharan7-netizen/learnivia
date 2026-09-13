import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page Not Found",
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
        background: "var(--color-bg, #FAF8F5)",
        fontFamily: "var(--font-sans, system-ui, sans-serif)",
      }}
    >
      <div
        style={{
          maxWidth: 540,
          width: "100%",
          textAlign: "center",
          background: "#FFFFFF",
          border: "1px solid var(--color-border, #E7E5E4)",
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
            background: "#FEF3C7",
            fontSize: "2rem",
            marginBottom: "1.25rem",
          }}
          aria-hidden="true"
        >
          🧭
        </div>

        <div
          style={{
            fontSize: "0.85rem",
            fontWeight: 800,
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            color: "#D97706",
            marginBottom: "0.5rem",
          }}
        >
          Error 404
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
          We couldn&apos;t find the learning resource or page you requested. It may have been moved, updated, or does not exist.
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
            href="/find"
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
              textDecoration: "none",
              transition: "background 0.15s ease",
            }}
          >
            🔍 Find a Volunteer Tutor
          </Link>

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
