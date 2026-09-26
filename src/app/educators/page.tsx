import type { Metadata } from "next";
import Link from "next/link";
import { Users, GraduationCap, ShieldCheck, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "For Educators | Learnivia",
  description:
    "Learnivia works alongside schools, teachers, and educators to supplement learning and verify student volunteer hours.",
};

export default function EducatorsPage() {
  const items = [
    {
      icon: Users,
      title: "Complementing, not competing with, classroom instruction",
      content:
        "Students and parents can access free peer tutoring for core K-10 school subjects. For learners below Grade 9, parents create and manage accounts, while Grade 9-10 learners can participate with guardian awareness. Sessions cover foundational reading, mathematics, science, and learning support.",
    },
    {
      icon: GraduationCap,
      title: "Verified community service for student tutors",
      content:
        "Volunteering with Learnivia develops communication skills, empathy, and subject mastery. Tutors receive verified records of their volunteer service hours with cryptographic session verification IDs, which can support school service requirements, honour societies, and college applications.",
    },
    {
      icon: ShieldCheck,
      title: "Not a replacement for classroom or SEN support",
      content:
        "Learnivia is a peer supplement, not a substitute for SENCO input, specialist learning support, or qualified teacher intervention. Students with formal IEP or 504 plans should continue working with their school's specialized educational professionals.",
    },
  ];

  return (
    <main
      style={{
        background: "var(--wa-paper)",
        minHeight: "100vh",
        fontFamily: "var(--font-sans)",
        color: "var(--wa-ink)",
      }}
    >
      <section
        style={{
          background: "var(--wa-white)",
          padding: "4.5rem 1.5rem 3.5rem",
          borderBottom: "1px solid var(--wa-border)",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: 680, margin: "0 auto" }}>
          <span
            style={{
              display: "inline-block",
              background: "var(--wa-paper)",
              border: "1px solid var(--wa-border)",
              color: "var(--wa-forest)",
              padding: "0.25rem 0.75rem",
              borderRadius: "6px",
              fontSize: "0.8rem",
              fontWeight: 600,
              marginBottom: "1rem",
            }}
          >
            School &amp; Classroom Partnerships
          </span>
          <h1
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(2.25rem, 4.5vw, 3.25rem)",
              fontWeight: 700,
              color: "var(--wa-ink)",
              marginBottom: "1rem",
              letterSpacing: "-0.02em",
            }}
          >
            For educators &amp; school advisors
          </h1>
          <p
            style={{
              fontSize: "1.1rem",
              color: "var(--wa-muted)",
              lineHeight: 1.65,
              maxWidth: "600px",
              margin: "0 auto",
            }}
          >
            Learnivia is a free, structured supplement to classroom instruction.
            Connect students who need patient revision, or encourage
            high-achieving student mentors to serve their community.
          </p>
        </div>
      </section>

      <div
        style={{
          maxWidth: 820,
          margin: "0 auto",
          padding: "3.5rem 1.5rem 5rem",
          display: "flex",
          flexDirection: "column",
          gap: "2.5rem",
        }}
      >
        {items.map((item) => (
          <div
            key={item.title}
            style={{
              background: "var(--wa-white)",
              border: "1px solid var(--wa-border)",
              borderRadius: "8px",
              padding: "1.75rem 2rem",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.6rem",
                marginBottom: "0.75rem",
              }}
            >
              <item.icon
                size={20}
                style={{ color: "var(--wa-forest)" }}
                aria-hidden="true"
              />
              <h2
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: "1.25rem",
                  fontWeight: 700,
                  color: "var(--wa-ink)",
                  margin: 0,
                }}
              >
                {item.title}
              </h2>
            </div>
            <p
              style={{
                color: "var(--wa-muted)",
                lineHeight: 1.7,
                fontSize: "0.95rem",
                margin: 0,
              }}
            >
              {item.content}
            </p>
          </div>
        ))}

        <div
          style={{
            display: "flex",
            gap: "1rem",
            flexWrap: "wrap",
            marginTop: "1rem",
          }}
        >
          <Link
            href="/find"
            style={{
              background: "var(--wa-forest)",
              color: "var(--wa-paper)",
              fontWeight: 600,
              padding: "0.75rem 1.75rem",
              borderRadius: "6px",
              textDecoration: "none",
              fontSize: "0.95rem",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.4rem",
            }}
          >
            Browse Verified Tutors <ArrowRight size={15} />
          </Link>
          <Link
            href="/apply"
            style={{
              background: "var(--wa-white)",
              color: "var(--wa-ink)",
              border: "1px solid var(--wa-border)",
              fontWeight: 600,
              padding: "0.75rem 1.75rem",
              borderRadius: "6px",
              textDecoration: "none",
              fontSize: "0.95rem",
              display: "inline-flex",
              alignItems: "center",
            }}
          >
            Volunteer as a Student Mentor
          </Link>
        </div>
      </div>
    </main>
  );
}
