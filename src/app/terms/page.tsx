import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service - Learnivia",
  description:
    "Learnivia Terms of Service for K-10 free peer tutoring. Read our terms for students, parents, and volunteer tutors.",
};

const LAST_UPDATED = "September 2026";

export default function TermsPage() {
  const sections = [
    {
      h: "1. About Learnivia",
      p: `Learnivia is a free, volunteer-run peer tutoring platform exclusively serving students in Kindergarten through Grade 10 (K-10). All tutoring sessions are free of charge. Learnivia is not a commercial tutoring service.`,
    },
    {
      h: "2. Who Can Use Learnivia",
      p: `Students: Learnivia is for K-10 learners (ages 5-16). Students under Grade 9 must have a parent or guardian create and manage their account. Students in Grade 9-10 may manage their own accounts independently. Tutors: Volunteer tutors must be in Grade 11 or above (high school or university students) and must complete our 5-module training and admin approval before hosting any sessions.`,
    },
    {
      h: "3. Parent & Guardian Responsibility",
      p: `Parents and guardians who create accounts for students below Grade 9 are responsible for all activity on that account. By creating a child account, you confirm that you are the parent or legal guardian of the student and you consent to your child participating in free 1-on-1 Zoom tutoring sessions with verified volunteer tutors.`,
    },
    {
      h: "4. Volunteer Tutors",
      p: `Tutors are unpaid volunteers, not employees or contractors of Learnivia. Learnivia does not guarantee the accuracy, completeness, or quality of any tutoring provided. All tutors complete our mandatory training and are reviewed by our admin team before approval. Learnivia may suspend or remove any tutor at any time for policy violations.`,
    },
    {
      h: "5. Session Conduct",
      p: `All communication between tutors and students must occur through the Learnivia platform only. Tutors must not share personal contact information (phone, email, social media) with students or parents. Sessions are private 1-on-1 Zoom calls. Sessions may not be recorded without explicit written consent from the parent or guardian.`,
    },
    {
      h: "6. Acceptable Use",
      p: `You agree to use Learnivia only for lawful educational purposes. Harassment, inappropriate language, sharing of personal information off-platform, or any contact that violates our Safeguarding Policy may result in immediate account suspension.`,
    },
    {
      h: "7. Privacy",
      p: `Minor learners are displayed by first name and last initial only (e.g. "Priya K."). We do not share student data with third parties. See our Privacy Policy for full details.`,
    },
    {
      h: "8. No Fees",
      p: `Learnivia will never charge students, parents, or guardians for tutoring sessions. Volunteer tutors are not paid for their time. This is a free service, always.`,
    },
    {
      h: "9. Limitation of Liability",
      p: `Learnivia provides this platform on an "as is" basis without warranty of any kind. To the maximum extent permitted by applicable law, Learnivia is not liable for any indirect, incidental, or consequential damages arising from use of the platform.`,
    },
    {
      h: "10. Changes to These Terms",
      p: `We may update these Terms from time to time. Continued use of the platform after changes constitutes acceptance of the updated Terms.`,
    },
    {
      h: "11. Contact",
      p: `For questions about these Terms: legal@learnivia.app`,
    },
  ];

  return (
    <main
      style={{
        maxWidth: 760,
        margin: "0 auto",
        padding: "4rem 1.5rem 6rem",
        fontFamily: "var(--font-body, Inter, sans-serif)",
      }}
    >
      <div style={{ marginBottom: "3rem" }}>
        <div
          style={{
            display: "inline-block",
            background: "#F0FDF4",
            color: "#0D683B",
            border: "1px solid #BBF7D0",
            borderRadius: "6px",
            padding: "0.3rem 0.9rem",
            fontSize: "0.8rem",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            marginBottom: "1rem",
          }}
        >
          Free K-10 Tutoring Platform
        </div>
        <h1
          style={{
            fontSize: "2.25rem",
            fontWeight: 900,
            color: "#111827",
            marginBottom: "0.5rem",
          }}
        >
          Terms of Service
        </h1>
        <p style={{ color: "#6B7280", fontSize: "0.9rem" }}>
          Last updated: {LAST_UPDATED}
        </p>
      </div>

      {sections.map((s) => (
        <div
          key={s.h}
          style={{
            marginBottom: "2rem",
            paddingBottom: "2rem",
            borderBottom: "1px solid #F3F4F6",
          }}
        >
          <h2
            style={{
              fontSize: "1.05rem",
              fontWeight: 800,
              color: "#111827",
              marginBottom: "0.6rem",
            }}
          >
            {s.h}
          </h2>
          <p
            style={{
              color: "#374151",
              lineHeight: 1.75,
              fontSize: "0.9375rem",
            }}
          >
            {s.p}
          </p>
        </div>
      ))}
    </main>
  );
}
