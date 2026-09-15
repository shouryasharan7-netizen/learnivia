import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ShieldCheck, HeartHandshake, Eye, FileText } from "lucide-react";

export const metadata: Metadata = {
  title: "For Parents & Guardians — Learnivia",
  description: "Everything parents and guardians need to know about how Learnivia works, who the tutors are, and how sessions are kept safe.",
};

export default function ParentsPage() {
  const items = [
    {
      icon: ShieldCheck,
      title: "Who are the volunteer tutors?",
      content: "Learnivia tutors are high school students (Grade 11+) and university students who apply to share their subject knowledge. Every applicant submits academic transcripts or report cards, completes 5 mandatory safeguarding and session modules, and is vetted by our administrator team before hosting sessions.",
    },
    {
      icon: HeartHandshake,
      title: "How do sessions work?",
      content: "Sessions take place online via private 1-on-1 Zoom video calls with waiting rooms enabled. No in-person meetings are ever arranged or endorsed. Sessions last 30–60 minutes. We encourage parents of younger learners (under 13) to remain nearby during sessions.",
    },
    {
      icon: FileText,
      title: "What data is collected about my child?",
      content: "We collect only the information necessary to match your child with a qualified tutor: name, email address, grade level, and session bookings. We do not sell data to third parties. You may request full deletion of your child's account and history at any time.",
    },
    {
      icon: Eye,
      title: "Can I observe my child's session?",
      content: "Yes, absolutely. We encourage parents of younger learners to sit in on sessions, especially for the first time. You can also view your child's upcoming bookings and verify completed attendance directly from your account.",
    },
    {
      icon: ShieldCheck,
      title: "What if something goes wrong?",
      content: "We maintain a direct, 24-hour reporting path for any concern — technical, behavioural, or safeguarding. Use the 'Report a Concern' button in your dashboard or email safety@learnivia.app. We respond to all inquiries within 24 hours.",
    },
  ];

  return (
    <main style={{ background: "var(--wa-paper)", minHeight: "100vh", fontFamily: "var(--font-sans)", color: "var(--wa-ink)" }}>
      <section style={{ background: "var(--wa-white)", padding: "4.5rem 1.5rem 3.5rem", borderBottom: "1px solid var(--wa-border)", textAlign: "center" }}>
        <div style={{ maxWidth: 680, margin: "0 auto" }}>
          <span style={{ display: "inline-block", background: "var(--wa-paper)", border: "1px solid var(--wa-border)", color: "var(--wa-forest)", padding: "0.25rem 0.75rem", borderRadius: "999px", fontSize: "0.8rem", fontWeight: 600, marginBottom: "1rem" }}>
            Guardian Oversight &amp; Safeguarding
          </span>
          <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(2.25rem, 4.5vw, 3.25rem)", fontWeight: 700, color: "var(--wa-ink)", marginBottom: "1rem", letterSpacing: "-0.02em" }}>
            Information for parents &amp; guardians
          </h1>
          <p style={{ fontSize: "1.1rem", color: "var(--wa-muted)", lineHeight: 1.65, maxWidth: "600px", margin: "0 auto" }}>
            We know that trusting an online platform with your child&apos;s learning takes confidence. Here is a clear, honest overview of how Learnivia protects your family.
          </p>
        </div>
      </section>

      <div style={{ maxWidth: 820, margin: "0 auto", padding: "3.5rem 1.5rem 5rem", display: "flex", flexDirection: "column", gap: "2.5rem" }}>
        {items.map((item) => (
          <div key={item.title} style={{ background: "var(--wa-white)", border: "1px solid var(--wa-border)", borderRadius: "8px", padding: "1.75rem 2rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.75rem" }}>
              <item.icon size={20} style={{ color: "var(--wa-forest)" }} aria-hidden="true" />
              <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "1.25rem", fontWeight: 700, color: "var(--wa-ink)", margin: 0 }}>
                {item.title}
              </h2>
            </div>
            <p style={{ color: "var(--wa-muted)", lineHeight: 1.7, fontSize: "0.95rem", margin: 0 }}>
              {item.content}
            </p>
          </div>
        ))}

        <div style={{ background: "var(--wa-white)", borderRadius: "8px", border: "1px solid var(--wa-border)", padding: "2rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
          <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "1.25rem", fontWeight: 700, color: "var(--wa-ink)", margin: 0 }}>
            Safeguarding Resources
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
            <Link href="/safety" style={{ color: "var(--wa-forest)", fontWeight: 600, fontSize: "0.9rem", display: "inline-flex", alignItems: "center", gap: "0.3rem" }}>
              Safety &amp; Trust Center <ArrowRight size={14} />
            </Link>
            <Link href="/privacy" style={{ color: "var(--wa-forest)", fontWeight: 600, fontSize: "0.9rem", display: "inline-flex", alignItems: "center", gap: "0.3rem" }}>
              Children&apos;s Privacy Policy <ArrowRight size={14} />
            </Link>
            <a href="mailto:safety@learnivia.app" style={{ color: "var(--wa-forest)", fontWeight: 600, fontSize: "0.9rem", display: "inline-flex", alignItems: "center", gap: "0.3rem" }}>
              Contact our safety team directly <ArrowRight size={14} />
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
