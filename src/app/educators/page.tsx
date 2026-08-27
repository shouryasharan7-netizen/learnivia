import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "For Educators",
  description: "How teachers and school counsellors can use Learnivia to supplement their students' learning.",
};

export default function EducatorsPage() {
  return (
    <main>
      <section style={{ background: "linear-gradient(135deg, var(--color-navy) 0%, var(--color-navy-light) 100%)", padding: "5rem 1.5rem" }}>
        <div style={{ maxWidth: 680, margin: "0 auto" }}>
          <h1 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 900, color: "white", marginBottom: "1rem", letterSpacing: "-0.03em" }}>
            For educators
          </h1>
          <p style={{ fontSize: "1.125rem", color: "rgb(255 255 255 / 0.75)", lineHeight: 1.7 }}>
            Learnivia is a free supplement to classroom learning. Share it with students who need extra support, or encourage high-achieving students to volunteer.
          </p>
        </div>
      </section>

      <div style={{ maxWidth: 800, margin: "0 auto", padding: "4rem 1.5rem", display: "flex", flexDirection: "column", gap: "3rem" }}>
        {[
          {
            title: "Recommend Learnivia to students who need support",
            content: "Students can sign up and book free tutoring sessions with no adult supervision required for account creation (though we recommend parental awareness for younger students). Sessions cover core school subjects and are suitable for lower secondary through pre-university learners.",
          },
          {
            title: "Encourage strong students to volunteer",
            content: "Volunteering with Learnivia builds communication skills, empathy, and subject mastery. Tutors receive verified records of their volunteer hours, which can support UCAS personal statements, Duke of Edinburgh awards, or other extracurricular portfolios.",
          },
          {
            title: "Not a replacement for classroom support",
            content: "Learnivia is a peer supplement — not a substitute for SENCO input, specialist learning support, or qualified teacher intervention. Students who need formal learning support plans should continue working with their school's support team.",
          },
        ].map(item => (
          <div key={item.title}>
            <h2 style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--color-navy)", marginBottom: "0.75rem" }}>{item.title}</h2>
            <p style={{ color: "var(--color-text-muted)", lineHeight: 1.7 }}>{item.content}</p>
          </div>
        ))}

        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          <Link href="/find" style={{ background: "var(--color-teal)", color: "white", fontWeight: 700, padding: "0.875rem 2rem", borderRadius: "999px", textDecoration: "none" }}>
            Browse tutors
          </Link>
          <Link href="/apply" style={{ background: "white", color: "var(--color-navy)", border: "2px solid var(--color-border-strong)", fontWeight: 700, padding: "0.875rem 2rem", borderRadius: "999px", textDecoration: "none" }}>
            Volunteer to tutor
          </Link>
        </div>
      </div>
    </main>
  );
}
