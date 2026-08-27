import type { Metadata } from "next";

export const metadata: Metadata = { title: "Terms of Service" };

export default function TermsPage() {
  return (
    <main style={{ maxWidth: 760, margin: "0 auto", padding: "5rem 1.5rem" }}>
      <div style={{ background: "var(--color-warning-bg)", border: "1px solid rgb(243 156 18 / 0.3)", borderRadius: "0.75rem", padding: "1rem 1.5rem", marginBottom: "3rem" }}>
        <strong style={{ color: "var(--color-navy)", fontSize: "0.875rem" }}>⚠️ Draft terms — pending legal review</strong>
        <p style={{ fontSize: "0.875rem", color: "var(--color-text-muted)", marginTop: "0.25rem" }}>This document is a placeholder template. It must be reviewed by a qualified legal professional before publishing to users.</p>
      </div>
      <h1 style={{ fontSize: "2.5rem", fontWeight: 900, color: "var(--color-navy)", marginBottom: "0.5rem" }}>Terms of Service</h1>
      <p style={{ color: "var(--color-text-muted)", marginBottom: "3rem" }}>Last updated: [DATE — to be filled before launch]</p>

      {[
        { h: "1. Acceptance", p: "By using Learnivia you agree to these Terms. If you do not agree, please do not use the platform." },
        { h: "2. Eligibility", p: "You must be at least 13 years old to create an account. Users under 18 should have parental awareness of their use of the platform." },
        { h: "3. Volunteer tutors", p: "Tutors are unpaid volunteers, not employees or contractors of Learnivia. Learnivia does not guarantee the accuracy, completeness, or quality of any tutoring provided." },
        { h: "4. Acceptable use", p: "You agree to use Learnivia only for lawful purposes and in accordance with our Community Guidelines. Misuse may result in account suspension or removal." },
        { h: "5. Intellectual property", p: "Learnivia's brand, design, and content are the property of the platform operators. Session content created by users remains their own." },
        { h: "6. Limitation of liability", p: "[To be completed by legal counsel]. Learnivia provides the platform on an 'as is' basis without warranty." },
        { h: "7. Governing law", p: "[To be completed by legal counsel — insert jurisdiction]." },
        { h: "8. Contact", p: "legal@learnivia.app" },
      ].map(s => (
        <div key={s.h} style={{ marginBottom: "2rem" }}>
          <h2 style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--color-navy)", marginBottom: "0.5rem" }}>{s.h}</h2>
          <p style={{ color: "var(--color-text-muted)", lineHeight: 1.7 }}>{s.p}</p>
        </div>
      ))}
    </main>
  );
}
