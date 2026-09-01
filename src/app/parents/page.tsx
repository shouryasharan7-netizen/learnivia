import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "For Parents & Guardians",
  description: "Everything parents and guardians need to know about how Learnivia works, who the tutors are, and how sessions are kept safe.",
};

export default function ParentsPage() {
  return (
    <main>
      <section style={{ background: "linear-gradient(135deg, var(--color-sky) 0%, var(--color-cream) 100%)", padding: "5rem 1.5rem" }}>
        <div style={{ maxWidth: 680, margin: "0 auto" }}>
          <h1 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 900, color: "var(--color-navy)", marginBottom: "1rem", letterSpacing: "-0.03em" }}>
            Information for parents & guardians
          </h1>
          <p style={{ fontSize: "1.125rem", color: "var(--color-text-muted)", lineHeight: 1.7 }}>
            We know that trusting an online platform with your child&apos;s learning takes confidence. Here&apos;s a clear, honest overview of how Learnivia works.
          </p>
        </div>
      </section>

      <div style={{ maxWidth: 800, margin: "0 auto", padding: "4rem 1.5rem", display: "flex", flexDirection: "column", gap: "3rem" }}>
        {[
          {
            title: "Who are the tutors?",
            content: "Learnivia tutors are volunteer students, typically in higher secondary school or university, who apply to share their subject knowledge. Every applicant is reviewed by our team. They agree to our community guidelines before their first session. We do not make claims of formal accreditation or DBS/background checks unless our operational process confirms these — please check our current status page for up-to-date safeguarding information.",
          },
          {
            title: "How do sessions work?",
            content: "Sessions take place online via Zoom video call. No in-person meetings are arranged or endorsed by Learnivia. Sessions last 30–60 minutes. We recommend younger learners (under 13) have a parent or guardian in the room or nearby during their first few sessions.",
          },
          {
            title: "What data is collected about my child?",
            content: "We collect only the information needed to run the platform: name, email address, grade level, and session bookings. We do not sell data to third parties. You may request full deletion of your child's account and associated data at any time. See our Privacy Policy for full details.",
          },
          {
            title: "What if something goes wrong?",
            content: "We maintain a clear reporting path for any concern — technical, behavioural, or safeguarding. Use the 'Report a concern' link in your dashboard or email safety@learnivia.app. We aim to respond within 24 hours.",
          },
          {
            title: "Can I observe a session?",
            content: "Yes. We encourage parents of younger learners to sit in on sessions, especially for the first time. Please let the tutor know at the start of the session so they can ensure everyone is comfortable.",
          },
        ].map(item => (
          <div key={item.title}>
            <h2 style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--color-navy)", marginBottom: "0.75rem" }}>{item.title}</h2>
            <p style={{ color: "var(--color-text-muted)", lineHeight: 1.7 }}>{item.content}</p>
          </div>
        ))}

        <div style={{ background: "var(--color-sky)", borderRadius: "1rem", padding: "2rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
          <h2 style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--color-navy)" }}>Further reading</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <Link href="/safety" style={{ color: "var(--color-teal)", fontWeight: 600, fontSize: "0.9rem" }}>Safety & Trust Centre →</Link>
            <Link href="/privacy" style={{ color: "var(--color-teal)", fontWeight: 600, fontSize: "0.9rem" }}>Privacy Policy →</Link>
            <a href="mailto:safety@learnivia.app" style={{ color: "var(--color-teal)", fontWeight: 600, fontSize: "0.9rem" }}>Contact our safety team →</a>
          </div>
        </div>
      </div>
    </main>
  );
}
