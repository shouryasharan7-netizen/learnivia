import type { Metadata } from "next";

export const metadata: Metadata = { title: "Cookie Policy" };

export default function CookiesPage() {
  return (
    <main style={{ maxWidth: 760, margin: "0 auto", padding: "5rem 1.5rem" }}>
      <div style={{ background: "var(--color-warning-bg)", border: "1px solid rgb(243 156 18 / 0.3)", borderRadius: "0.75rem", padding: "1rem 1.5rem", marginBottom: "3rem" }}>
        <strong style={{ color: "var(--color-navy)", fontSize: "0.875rem" }}>⚠️ Draft policy — pending legal review</strong>
      </div>
      <h1 style={{ fontSize: "2.5rem", fontWeight: 900, color: "var(--color-navy)", marginBottom: "0.5rem" }}>Cookie Policy</h1>
      <p style={{ color: "var(--color-text-muted)", marginBottom: "3rem" }}>Last updated: [DATE — to be filled before launch]</p>

      {[
        { h: "What are cookies?", p: "Cookies are small text files stored in your browser. They help websites remember information about your visit." },
        { h: "Cookies we use", p: "Learnivia uses strictly necessary cookies to maintain your authentication session (next-auth.session-token). We do not currently use tracking, analytics, or advertising cookies." },
        { h: "Managing cookies", p: "You can manage or delete cookies through your browser settings. Deleting the session cookie will sign you out of Learnivia." },
        { h: "Changes to this policy", p: "We may update this policy as our use of cookies changes. Changes will be posted here with an updated date." },
      ].map(s => (
        <div key={s.h} style={{ marginBottom: "2rem" }}>
          <h2 style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--color-navy)", marginBottom: "0.5rem" }}>{s.h}</h2>
          <p style={{ color: "var(--color-text-muted)", lineHeight: 1.7 }}>{s.p}</p>
        </div>
      ))}
    </main>
  );
}
