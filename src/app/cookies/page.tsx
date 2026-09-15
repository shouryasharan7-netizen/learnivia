import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cookie Policy — Learnivia",
  description: "Learnivia strictly necessary cookies policy for free K–10 peer tutoring. No advertising or cross-site tracking cookies.",
};

const LAST_UPDATED = "September 2026";

export default function CookiesPage() {
  const sections = [
    {
      h: "1. What Are Cookies?",
      p: "Cookies are small data files stored in your web browser. They allow platforms to recognize your authenticated session, remember basic preferences, and secure interactions.",
    },
    {
      h: "2. Strictly Necessary Cookies Only",
      p: "Learnivia strictly uses essential session cookies required to authenticate your account (such as session tokens) and prevent cross-site request forgery (CSRF). We do not use third-party tracking cookies, analytics trackers, or advertising trackers.",
    },
    {
      h: "3. First-Party Cookies We Set",
      p: "• Auth Session Token: Secures your sign-in session and confirms whether you are navigating as a student, guardian, tutor, or administrator.\n• CSRF Protection Token: Protects against unauthorized form submissions and ensures session integrity.",
    },
    {
      h: "4. Managing and Deleting Cookies",
      p: "You can configure your browser to block or delete cookies at any time through your browser preferences. Note that blocking strictly necessary cookies will prevent you from signing in to your Learnivia account and attending tutoring sessions.",
    },
    {
      h: "5. Updates to This Policy",
      p: "If our cookie usage changes in the future (for example, if new platform security features are deployed), this policy will be updated with an updated revision date.",
    },
    {
      h: "6. Questions and Privacy Contact",
      p: "If you have questions regarding our use of cookies or privacy practices, please contact our data safety team at privacy@learnivia.app.",
    },
  ];

  return (
    <main style={{ maxWidth: 760, margin: "0 auto", padding: "5rem 1.5rem 6rem", fontFamily: "var(--font-sans)" }}>
      <div style={{ marginBottom: "3rem", borderBottom: "1px solid var(--wa-border)", paddingBottom: "2rem" }}>
        <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "2.5rem", fontWeight: 700, color: "var(--wa-ink)", marginBottom: "0.5rem" }}>
          Cookie Policy
        </h1>
        <p style={{ color: "var(--wa-muted)", fontSize: "0.9rem" }}>
          Last updated: {LAST_UPDATED} • Official policy
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
        {sections.map((s) => (
          <div key={s.h}>
            <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "1.25rem", fontWeight: 700, color: "var(--wa-ink)", marginBottom: "0.5rem" }}>
              {s.h}
            </h2>
            <p style={{ color: "var(--wa-muted)", lineHeight: 1.7, fontSize: "0.95rem", whiteSpace: "pre-line" }}>
              {s.p}
            </p>
          </div>
        ))}
      </div>
    </main>
  );
}
