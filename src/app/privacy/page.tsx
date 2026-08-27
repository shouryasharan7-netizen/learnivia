import type { Metadata } from "next";

export const metadata: Metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
  return (
    <main style={{ maxWidth: 760, margin: "0 auto", padding: "5rem 1.5rem" }}>
      <div style={{ background: "var(--color-warning-bg)", border: "1px solid rgb(243 156 18 / 0.3)", borderRadius: "0.75rem", padding: "1rem 1.5rem", marginBottom: "3rem" }}>
        <strong style={{ color: "var(--color-navy)", fontSize: "0.875rem" }}>⚠️ Draft policy — pending legal review</strong>
        <p style={{ fontSize: "0.875rem", color: "var(--color-text-muted)", marginTop: "0.25rem" }}>This document is a placeholder template. It must be reviewed by a qualified legal professional before publishing to users.</p>
      </div>
      <h1 style={{ fontSize: "2.5rem", fontWeight: 900, color: "var(--color-navy)", marginBottom: "0.5rem" }}>Privacy Policy</h1>
      <p style={{ color: "var(--color-text-muted)", marginBottom: "3rem" }}>Last updated: [DATE — to be filled before launch]</p>

      {[
        { h: "1. Who we are", p: "Learnivia (\"we\", \"us\", \"our\") operates the Learnivia platform at learnivia.app. [Insert registered entity details here]." },
        { h: "2. What data we collect", p: "We collect: name, email address, grade/education level, timezone, session booking data, and (for tutors) a bio and subject list. We do not collect payment information." },
        { h: "3. How we use your data", p: "We use your data to: run the platform, match learners with tutors, send session confirmations, and improve our service. We do not sell your data to third parties." },
        { h: "4. Data retention", p: "Your data is retained as long as your account is active. You may request deletion at any time by emailing support@learnivia.app." },
        { h: "5. Your rights", p: "You have the right to access, correct, port, or delete your personal data. To exercise these rights, contact us at support@learnivia.app." },
        { h: "6. Cookies", p: "We use strictly necessary cookies to operate authentication. See our Cookie Policy for full details." },
        { h: "7. Contact", p: "For privacy enquiries: privacy@learnivia.app" },
      ].map(s => (
        <div key={s.h} style={{ marginBottom: "2rem" }}>
          <h2 style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--color-navy)", marginBottom: "0.5rem" }}>{s.h}</h2>
          <p style={{ color: "var(--color-text-muted)", lineHeight: 1.7 }}>{s.p}</p>
        </div>
      ))}
    </main>
  );
}
