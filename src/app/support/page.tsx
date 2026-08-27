import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Support & FAQ",
  description: "Answers to common questions about Learnivia — sessions, accounts, tutoring, and safety.",
};

const FAQ_GROUPS = [
  {
    group: "Getting started",
    items: [
      { q: "Is Learnivia really free?", a: "Yes. Learnivia is a free, volunteer-run platform. There are no subscriptions, session fees, or hidden charges." },
      { q: "Do I need an account to browse tutors?", a: "You can browse the /find page without an account. You will need to create a free account to book a session." },
      { q: "What age is Learnivia suitable for?", a: "We support learners from upper primary (Year 5+) through university. Younger users should have a parent or guardian aware of their sessions." },
    ],
  },
  {
    group: "Sessions",
    items: [
      { q: "How long are sessions?", a: "Sessions are typically 30–60 minutes. The exact duration is agreed between you and your tutor when booking." },
      { q: "Where do sessions take place?", a: "All sessions take place via Zoom video call. You will receive a link when your booking is confirmed." },
      { q: "Can I cancel or reschedule?", a: "Yes. Please cancel with as much notice as possible out of respect for your tutor's time. Cancellation functionality in the app is being developed — in the meantime, contact your tutor directly via the dashboard." },
      { q: "What if my tutor doesn't show up?", a: "Please report this via the dashboard and we will follow up. Repeated no-shows may result in a tutor being removed from the platform." },
    ],
  },
  {
    group: "Tutors & volunteering",
    items: [
      { q: "How are tutors selected?", a: "Every tutor applicant is reviewed by our team and must agree to our community guidelines. We do not currently perform formal DBS checks — see our Safety page for up-to-date safeguarding details." },
      { q: "Can I see a tutor's reviews or ratings?", a: "Review functionality is in development. In the meantime, tutor bios and subject listings are available on their profiles." },
      { q: "Do volunteer tutors get paid?", a: "No. Learnivia tutors are unpaid volunteers. They may receive verified records of their volunteer hours." },
      { q: "How do I apply to be a tutor?", a: "Visit /apply to fill out the volunteer application form. You'll need to create an account first." },
    ],
  },
  {
    group: "Account & data",
    items: [
      { q: "How do I delete my account?", a: "Email support@learnivia.app with the subject 'Delete my account' and we will process your request within 5 working days." },
      { q: "Who can see my information?", a: "Your email and personal details are not shared publicly. Your name and tutor profile (if applicable) may be visible to other users. See our Privacy Policy." },
    ],
  },
];

export default function SupportPage() {
  return (
    <main>
      <section style={{ background: "linear-gradient(135deg, var(--color-sky) 0%, var(--color-cream) 100%)", padding: "5rem 1.5rem", textAlign: "center" }}>
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          <h1 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 900, color: "var(--color-navy)", marginBottom: "1rem", letterSpacing: "-0.03em" }}>
            Support & FAQ
          </h1>
          <p style={{ fontSize: "1.125rem", color: "var(--color-text-muted)", lineHeight: 1.7 }}>
            Common questions answered. If you can't find what you're looking for, email us.
          </p>
        </div>
      </section>

      <div style={{ maxWidth: 800, margin: "0 auto", padding: "4rem 1.5rem" }}>
        {FAQ_GROUPS.map(group => (
          <div key={group.group} style={{ marginBottom: "3rem" }}>
            <h2 style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--color-navy)", marginBottom: "1.25rem", paddingBottom: "0.75rem", borderBottom: "2px solid var(--color-border)" }}>
              {group.group}
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
              {group.items.map(item => (
                <details key={item.q} style={{ borderBottom: "1px solid var(--color-border)", padding: "0" }}>
                  <summary style={{ padding: "1rem 0", fontWeight: 600, color: "var(--color-navy)", cursor: "pointer", listStyle: "none", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    {item.q}
                    <span style={{ color: "var(--color-teal)", fontSize: "1.25rem", fontWeight: 300, flexShrink: 0 }}>+</span>
                  </summary>
                  <p style={{ color: "var(--color-text-muted)", lineHeight: 1.7, paddingBottom: "1rem", fontSize: "0.9375rem" }}>{item.a}</p>
                </details>
              ))}
            </div>
          </div>
        ))}

        <div style={{ background: "var(--color-navy)", borderRadius: "1.5rem", padding: "2.5rem", textAlign: "center", marginTop: "2rem" }}>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 800, color: "white", marginBottom: "0.75rem" }}>Still have questions?</h2>
          <p style={{ color: "rgb(255 255 255 / 0.7)", marginBottom: "1.5rem" }}>We'll reply to every message, usually within 24 hours.</p>
          <a href="mailto:support@learnivia.app" style={{ display: "inline-flex", background: "var(--color-teal)", color: "white", fontWeight: 700, padding: "0.875rem 2rem", borderRadius: "999px", textDecoration: "none" }}>
            Email support →
          </a>
        </div>
      </div>
    </main>
  );
}
