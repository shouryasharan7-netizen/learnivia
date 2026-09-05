import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ — Learnivia Free K–10 Tutoring",
  description: "Frequently asked questions about Learnivia: free 1-on-1 Zoom tutoring for K–10 students, volunteer tutor requirements, parent safeguarding, learning preferences, and volunteer hours.",
};

const FAQ_SECTIONS = [
  {
    category: "For Parents & Guardians",
    emoji: "👨‍👩‍👧",
    questions: [
      {
        q: "Is Learnivia really 100% free?",
        a: "Yes — completely free, with no hidden fees, subscriptions, or credit card required. Learnivia runs on a peer-volunteer model: students help students in exchange for verified volunteer hours.",
      },
      {
        q: "Who manages my child's account?",
        a: "For students below Grade 9, the parent or guardian creates and manages the account. This protects younger learners and ensures a responsible adult oversees all bookings. Students in Grades 9–10 may manage their own accounts independently.",
      },
      {
        q: "Are sessions safe for my child?",
        a: "Yes. All tutors are reviewed and approved by our admin team before hosting sessions. Sessions are private, 1-on-1 Zoom calls. Learnivia's safeguarding policy prohibits any off-platform communication between tutors and students.",
      },
      {
        q: "Are sessions recorded?",
        a: "Sessions are not recorded by default. Session duration is logged for volunteer-hour verification purposes only. Any recording would require your explicit written consent.",
      },
      {
        q: "How do I find a tutor for my child's grade?",
        a: "Go to /find, select your child's grade (K–10), then choose the subject. Only tutors approved for that specific grade band will appear — so a Grade 4 student will only see tutors approved for Grades 3–5.",
      },
      {
        q: "What if I have a concern about a session?",
        a: "Every session has a 'Report a Concern' option. Reports are reviewed promptly by our admin team. Tutors found violating our policies are suspended immediately.",
      },
    ],
  },
  {
    category: "For Students",
    emoji: "📚",
    questions: [
      {
        q: "What grades and subjects does Learnivia cover?",
        a: "Learnivia covers Kindergarten through Grade 10 across core subjects: Mathematics, Reading & Writing, English Language Arts, Science (Earth, Life, Physical, Biology, Chemistry), and Social Studies. We also offer dedicated Learning Support sessions for students who benefit from visual, step-by-step, or paced approaches.",
      },
      {
        q: "How do I book a session?",
        a: "Sign in, go to 'Find a Tutor', select your grade and subject, choose a tutor you'd like to work with, pick an available time slot, describe the topic or help you need, and confirm your booking. The Zoom link will appear in your dashboard.",
      },
      {
        q: "How do I join a session on Zoom?",
        a: "The Zoom join button becomes active 15 minutes before your session starts. You'll find it on your session detail page in your dashboard. The link is only visible to you and your tutor.",
      },
      {
        q: "Do I need any special software?",
        a: "You need the Zoom app (free) installed on your device. Your tutor will share their screen, use a digital whiteboard, and walk through problems step by step.",
      },
      {
        q: "Does my child need a diagnosis to access learning support?",
        a: "Absolutely not. Our Learning Support sessions are for any student who benefits from visual explanations, step-by-step pacing, extra processing time, frequent breaks, or repetition. No diagnosis or label is required.",
      },
    ],
  },
  {
    category: "For Volunteer Tutors",
    emoji: "🎓",
    questions: [
      {
        q: "Who can apply to be a tutor?",
        a: "High school students (Grade 11+) and university students who excel in K–10 subjects can apply. You'll need to provide academic credentials (e.g., report card or transcript) and complete our 5-module training before your first session.",
      },
      {
        q: "What is the tutor training?",
        a: "All approved tutors complete 5 short training modules: (1) Tutoring Basics & Encouragement, (2) Supporting Students Who Learn Differently, (3) Online Zoom Best Practices, (4) Safety, Boundaries & Safeguarding, and (5) Volunteer Hours & Verification Rules.",
      },
      {
        q: "How are volunteer hours tracked?",
        a: "Every completed session is automatically logged. The system records start time, end time, and attendance. Only sessions where you were present and the student attended count toward verified volunteer hours.",
      },
      {
        q: "How do I get my volunteer service transcript?",
        a: "Go to your Tutor Dashboard → Volunteer Transcript. You can download an official transcript with unique session verification IDs, accepted by NHS chapters, school advisors, and community organizations.",
      },
      {
        q: "Can I choose my own schedule and subjects?",
        a: "Yes. You set your own availability windows and choose the subjects and grade bands you want to teach. You only receive booking requests that match your approved subjects and grade levels.",
      },
      {
        q: "What happens if a student doesn't show up?",
        a: "If a student does not join the session within 10 minutes, you may end the session and report a no-show. That session will not count against your hours, and the admin team will follow up with the student.",
      },
    ],
  },
  {
    category: "Platform & Technical",
    emoji: "⚙️",
    questions: [
      {
        q: "What technology does Learnivia use?",
        a: "Sessions take place on Zoom. Learnivia is a web application — no app download required. You can access it from any modern browser on laptop, tablet, or desktop. Mobile browsers are supported.",
      },
      {
        q: "Is my personal information protected?",
        a: "Yes. Minor learners are displayed by first name and last initial only (e.g., 'Priya K.'). Parent accounts protect children's personal details. Learnivia complies with COPPA and GDPR-K data protection requirements.",
      },
      {
        q: "What if I forget my password?",
        a: "Use the 'Forgot Password' link on the sign-in page to reset your password via email.",
      },
    ],
  },
];

export default function FaqPage() {
  return (
    <main style={{ minHeight: "100vh", background: "#FAFAFA", fontFamily: "var(--font-body, Inter, sans-serif)" }}>
      {/* Hero */}
      <section
        style={{
          background: "linear-gradient(135deg, #0E8345 0%, #1a6b3a 100%)",
          padding: "4rem 1.5rem 3rem",
          textAlign: "center",
          color: "#fff",
        }}
      >
        <div style={{ maxWidth: "720px", margin: "0 auto" }}>
          <div
            style={{
              display: "inline-block",
              background: "rgba(255,255,255,0.15)",
              borderRadius: "999px",
              padding: "0.35rem 1rem",
              fontSize: "0.8rem",
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              marginBottom: "1rem",
            }}
          >
            Frequently Asked Questions
          </div>
          <h1
            style={{
              fontSize: "clamp(2rem, 5vw, 3rem)",
              fontWeight: 800,
              margin: "0 0 1rem",
              lineHeight: 1.15,
            }}
          >
            Everything you need to know about Learnivia
          </h1>
          <p style={{ fontSize: "1.1rem", opacity: 0.9, maxWidth: "520px", margin: "0 auto" }}>
            Free 1-on-1 tutoring for K–10 students. Honest answers for parents, students, and volunteer tutors.
          </p>
        </div>
      </section>

      {/* Quick Nav */}
      <nav
        aria-label="FAQ section navigation"
        style={{
          background: "#fff",
          borderBottom: "1px solid #E5E7EB",
          padding: "1rem 1.5rem",
          display: "flex",
          gap: "1rem",
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
              padding: "0.5rem 1rem",
              background: "#F3F4F6",
              borderRadius: "999px",
              textDecoration: "none",
              color: "#374151",
              fontSize: "0.875rem",
              fontWeight: 600,
              transition: "background 0.2s",
            }}
          >
            <span>{s.emoji}</span>
            <span>{s.category}</span>
          </a>
        ))}
      </nav>

      {/* FAQ Sections */}
      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "3rem 1.5rem 5rem" }}>
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
                gap: "0.75rem",
                marginBottom: "1.5rem",
                paddingBottom: "0.75rem",
                borderBottom: "2px solid #0E8345",
              }}
            >
              <span style={{ fontSize: "1.5rem" }}>{section.emoji}</span>
              <h2
                style={{
                  fontSize: "1.25rem",
                  fontWeight: 800,
                  color: "#111827",
                  margin: 0,
                }}
              >
                {section.category}
              </h2>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {section.questions.map((faq, idx) => (
                <details
                  key={idx}
                  style={{
                    background: "#fff",
                    border: "1px solid #E5E7EB",
                    borderRadius: "0.75rem",
                    overflow: "hidden",
                  }}
                >
                  <summary
                    style={{
                      padding: "1.25rem 1.5rem",
                      fontWeight: 700,
                      fontSize: "0.975rem",
                      color: "#111827",
                      cursor: "pointer",
                      listStyle: "none",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: "1rem",
                    }}
                  >
                    <span>{faq.q}</span>
                    <span
                      style={{
                        flexShrink: 0,
                        width: "24px",
                        height: "24px",
                        borderRadius: "50%",
                        background: "#F0FDF4",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "1rem",
                        color: "#0E8345",
                        fontWeight: 800,
                      }}
                    >
                      +
                    </span>
                  </summary>
                  <div
                    style={{
                      padding: "0 1.5rem 1.25rem",
                      color: "#374151",
                      fontSize: "0.9375rem",
                      lineHeight: 1.7,
                      borderTop: "1px solid #F3F4F6",
                      paddingTop: "1rem",
                    }}
                  >
                    {faq.a}
                  </div>
                </details>
              ))}
            </div>
          </section>
        ))}

        {/* Still have questions CTA */}
        <div
          style={{
            background: "linear-gradient(135deg, #F0FDF4, #DCFCE7)",
            border: "1px solid #BBF7D0",
            borderRadius: "1rem",
            padding: "2.5rem",
            textAlign: "center",
          }}
        >
          <h2 style={{ fontSize: "1.375rem", fontWeight: 800, color: "#0E8345", marginBottom: "0.5rem" }}>
            Still have questions?
          </h2>
          <p style={{ color: "#374151", marginBottom: "1.5rem", fontSize: "0.95rem" }}>
            Our team is happy to help parents, students, and tutors with any questions not covered here.
          </p>
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            <Link
              href="/signup"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                background: "#0E8345",
                color: "#fff",
                padding: "0.75rem 1.75rem",
                borderRadius: "999px",
                textDecoration: "none",
                fontWeight: 700,
                fontSize: "0.9375rem",
              }}
            >
              Get Started — It&apos;s Free
            </Link>
            <Link
              href="/find"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                background: "#fff",
                color: "#0E8345",
                padding: "0.75rem 1.75rem",
                borderRadius: "999px",
                textDecoration: "none",
                fontWeight: 700,
                fontSize: "0.9375rem",
                border: "2px solid #0E8345",
              }}
            >
              Find a Tutor
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
