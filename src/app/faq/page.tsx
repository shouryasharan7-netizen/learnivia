import Link from "next/link";
import type { Metadata } from "next";
import { Users, BookOpen, GraduationCap, Settings, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Frequently Asked Questions | Learnivia",
  description: "Frequently asked questions about Learnivia: free 1-on-1 Zoom tutoring for K-10 students, volunteer tutor requirements, parent safeguarding, learning preferences, and volunteer hours.",
};

const FAQ_SECTIONS = [
  {
    category: "For Parents & Guardians",
    icon: Users,
    questions: [
      {
        q: "Is Learnivia really 100% free?",
        a: "Yes, completely free, with no hidden fees, subscriptions, or credit card required. Learnivia runs on a peer-volunteer model: student mentors help younger peers in exchange for verified community service hours.",
      },
      {
        q: "Who manages my child's account?",
        a: "For students below Grade 9, the parent or guardian creates and manages the account. This protects younger learners and ensures a responsible adult oversees all bookings. Students in Grades 9-10 may manage their own accounts independently.",
      },
      {
        q: "Are sessions safe for my child?",
        a: "Yes. All tutors are reviewed and approved by our admin team before hosting sessions. Sessions are private, 1-on-1 Zoom calls with waiting rooms enabled. Learnivia's safeguarding policy strictly prohibits any off-platform contact between tutors and students.",
      },
      {
        q: "Are sessions recorded?",
        a: "Sessions are not recorded by default. Session duration is logged for volunteer-hour verification purposes only. Any recording would require explicit written consent from the parent or guardian.",
      },
      {
        q: "How do I find a tutor for my child's grade?",
        a: "Go to Find a Tutor (/find), select your child's grade band (K-10), then choose the subject. Only tutors approved for that specific grade band will appear in results.",
      },
      {
        q: "What if I have a concern about a session?",
        a: "Every session card features a direct 'Report a Concern' option. Reports are reviewed by our moderation staff within 24 hours. Tutors found violating safety standards are suspended immediately.",
      },
    ],
  },
  {
    category: "For Students",
    icon: BookOpen,
    questions: [
      {
        q: "What grades and subjects does Learnivia cover?",
        a: "Learnivia covers Kindergarten through Grade 10 across core subjects: Mathematics, Reading & Writing, English Language Arts, Science (Earth, Life, Physical, Biology, Chemistry), and Social Studies. We also offer dedicated Learning Support sessions for students who benefit from visual, step-by-step, or paced approaches.",
      },
      {
        q: "How do I book a session?",
        a: "Sign in, navigate to 'Find a Tutor', select your grade and subject, choose a tutor you would like to work with, pick an available time slot, describe your homework topic, and confirm your booking. The Zoom link will appear in your dashboard.",
      },
      {
        q: "How do I join a session on Zoom?",
        a: "The Zoom join button becomes active 15 minutes before your session begins. You can launch it directly from your session details page in your dashboard.",
      },
      {
        q: "Do I need any special software?",
        a: "You simply need the Zoom application (free) installed on your laptop, tablet, or desktop. Your tutor will share their screen, use an interactive whiteboard, and guide you through problems.",
      },
      {
        q: "Does my child need a formal diagnosis to access learning support?",
        a: "No, never. Our Learning Support sessions are open to any student who benefits from visual diagrams, step-by-step explanations, extra processing time, frequent breaks, or repetition. No diagnosis or documentation is ever required.",
      },
    ],
  },
  {
    category: "For Volunteer Tutors",
    icon: GraduationCap,
    questions: [
      {
        q: "Who can apply to be a volunteer tutor?",
        a: "High school students (Grade 11+) and university students who excel in K-10 academic subjects can apply. You will need to provide an academic report card or marksheet and complete our 5 mandatory safeguarding modules before your first session.",
      },
      {
        q: "What does tutor training entail?",
        a: "All approved tutors complete 5 concise modules: (1) Tutoring Basics & Encouragement, (2) Supporting Diverse Learning Styles, (3) Online Zoom Best Practices, (4) Safety, Boundaries & Safeguarding, and (5) Volunteer Hours & Verification Rules.",
      },
      {
        q: "How are volunteer hours tracked?",
        a: "Every completed session is automatically logged in our authoritative database escrow. The system records verified timestamps and student attendance. Only sessions where both parties were present count toward certified volunteer hours.",
      },
      {
        q: "How do I get my volunteer service transcript?",
        a: "Navigate to your Tutor Workspace → Volunteer Transcript. You can download an official verified service record containing verifiable cryptographic session IDs for school advisors, honor societies, and college admissions.",
      },
      {
        q: "Can I choose my own schedule and subjects?",
        a: "Yes. You control your weekly recurring availability windows and select the subjects and grade levels you feel confident teaching. You only receive bookings that match your selections.",
      },
    ],
  },
  {
    category: "Platform & Safety Integrity",
    icon: Settings,
    questions: [
      {
        q: "What technology does Learnivia use?",
        a: "Sessions take place on private 1-on-1 Zoom video calls. Learnivia is accessible from any modern web browser on laptop, desktop, or tablet. Mobile browsers are fully responsive.",
      },
      {
        q: "How is student personal information protected?",
        a: "Minor learners are displayed by first name and last initial only (e.g. 'Priya K.'). Personal contact information is never shared between learners and tutors.",
      },
      {
        q: "What if I forget my password?",
        a: "Use the 'Forgot Password' link on the sign-in page to securely receive a password reset token via your registered email.",
      },
    ],
  },
];

export default function FaqPage() {
  return (
    <main style={{ minHeight: "100vh", background: "var(--wa-paper)", fontFamily: "var(--font-sans)", color: "var(--wa-ink)" }}>
      {/* Hero */}
      <section
        style={{
          background: "var(--wa-white)",
          padding: "4.5rem 1.5rem 3.5rem",
          textAlign: "center",
          borderBottom: "1px solid var(--wa-border)",
        }}
      >
        <div style={{ maxWidth: "720px", margin: "0 auto" }}>
          <div
            style={{
              display: "inline-block",
              background: "var(--wa-paper)",
              border: "1px solid var(--wa-border)",
              borderRadius: "6px",
              padding: "0.3rem 0.85rem",
              fontSize: "0.8rem",
              fontWeight: 600,
              color: "var(--wa-forest)",
              marginBottom: "1rem",
            }}
          >
            Frequently Asked Questions
          </div>
          <h1
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(2.25rem, 5vw, 3.25rem)",
              fontWeight: 700,
              margin: "0 0 1rem",
              lineHeight: 1.15,
              color: "var(--wa-ink)",
              letterSpacing: "-0.02em",
            }}
          >
            Everything you need to know about Learnivia
          </h1>
          <p style={{ fontSize: "1.1rem", color: "var(--wa-muted)", maxWidth: "560px", margin: "0 auto", lineHeight: 1.65 }}>
            Free 1-on-1 peer tutoring for K-10 learners. Transparent, honest answers for parents, learners, and volunteer tutors.
          </p>
        </div>
      </section>

      {/* Quick Category Navigation */}
      <nav
        aria-label="FAQ section navigation"
        style={{
          background: "var(--wa-white)",
          borderBottom: "1px solid var(--wa-border)",
          padding: "1rem 1.5rem",
          display: "flex",
          gap: "0.75rem",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        {FAQ_SECTIONS.map((s) => (
          <a
            key={s.category}
            href={`#${s.category.toLowerCase().replace(/[^a-z]/g, "-")}`}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.4rem",
              padding: "0.45rem 0.95rem",
              background: "var(--wa-paper)",
              border: "1px solid var(--wa-border)",
              borderRadius: "6px",
              textDecoration: "none",
              color: "var(--wa-ink)",
              fontSize: "0.85rem",
              fontWeight: 600,
            }}
          >
            <s.icon size={15} style={{ color: "var(--wa-forest)" }} aria-hidden="true" />
            <span>{s.category}</span>
          </a>
        ))}
      </nav>

      {/* FAQ Sections */}
      <div style={{ maxWidth: "820px", margin: "0 auto", padding: "3.5rem 1.5rem 5rem" }}>
        {FAQ_SECTIONS.map((section) => (
          <section
            key={section.category}
            id={section.category.toLowerCase().replace(/[^a-z]/g, "-")}
            style={{ marginBottom: "3.5rem" }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.6rem",
                marginBottom: "1.5rem",
                paddingBottom: "0.75rem",
                borderBottom: "1px solid var(--wa-border)",
              }}
            >
              <section.icon size={22} style={{ color: "var(--wa-forest)" }} aria-hidden="true" />
              <h2
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: "1.5rem",
                  fontWeight: 700,
                  color: "var(--wa-ink)",
                  margin: 0,
                }}
              >
                {section.category}
              </h2>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {section.questions.map((faq) => (
                <div
                  key={faq.q}
                  style={{
                    background: "var(--wa-white)",
                    border: "1px solid var(--wa-border)",
                    borderRadius: "8px",
                    padding: "1.5rem",
                  }}
                >
                  <h3
                    style={{
                      fontFamily: "var(--font-serif)",
                      fontSize: "1.1rem",
                      fontWeight: 700,
                      color: "var(--wa-ink)",
                      margin: "0 0 0.5rem 0",
                    }}
                  >
                    {faq.q}
                  </h3>
                  <p
                    style={{
                      color: "var(--wa-muted)",
                      fontSize: "0.95rem",
                      lineHeight: 1.65,
                      margin: 0,
                    }}
                  >
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </section>
        ))}

        {/* Bottom Help Box */}
        <div
          style={{
            background: "var(--wa-white)",
            border: "1px solid var(--wa-border)",
            borderRadius: "8px",
            padding: "2.5rem 2rem",
            textAlign: "center",
          }}
        >
          <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "1.35rem", fontWeight: 700, color: "var(--wa-ink)", marginBottom: "0.5rem" }}>
            Have a question not listed here?
          </h3>
          <p style={{ color: "var(--wa-muted)", fontSize: "0.95rem", marginBottom: "1.5rem" }}>
            Our team and volunteer tutors are always here to help.
          </p>
          <div style={{ display: "flex", justifyContent: "center", gap: "1rem", flexWrap: "wrap" }}>
            <Link
              href="/find"
              style={{
                background: "var(--wa-forest)",
                color: "var(--wa-paper)",
                padding: "0.65rem 1.5rem",
                borderRadius: "6px",
                fontWeight: 600,
                fontSize: "0.9rem",
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.35rem",
              }}
            >
              Browse Tutors <ArrowRight size={15} />
            </Link>
            <a
              href="mailto:support@learnivia.app"
              style={{
                background: "var(--wa-white)",
                color: "var(--wa-ink)",
                border: "1px solid var(--wa-border)",
                padding: "0.65rem 1.5rem",
                borderRadius: "6px",
                fontWeight: 600,
                fontSize: "0.9rem",
                textDecoration: "none",
              }}
            >
              Email Support
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
