import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — Learnivia",
  description: "How Learnivia collects, uses, and protects your data. K-10 child privacy protections, minor safeguarding, and user rights.",
};

const LAST_UPDATED = "September 2026";

export default function PrivacyPage() {
  const sections = [
    {
      h: "1. Who We Are",
      p: `Learnivia ("we", "us", "our") operates the Learnivia platform — a free peer tutoring service for Kindergarten through Grade 10 students. We are a volunteer-run platform, not a commercial data business.`,
    },
    {
      h: "2. Children's Privacy & Safeguarding",
      p: `Learnivia is designed with minor safeguarding at its foundation. For students below Grade 9 (typically under 13–14 years old): accounts are created and managed by a parent or legal guardian. We display students by first name and last initial only (e.g. "Priya K."). We do not allow students to share personal contact information on the platform. We do not show student profiles to other students — only to the tutor assigned to their session. We do not collect or process children's data for marketing or advertising purposes.`,
    },
    {
      h: "3. What Data We Collect",
      p: `For all users: name, email address, grade/education level, age, timezone, curriculum, and session booking data. For tutors: bio, academic credentials summary, subjects and grade levels taught, volunteer hours, and training module completion status. We do not collect payment information (Learnivia is 100% free). We do not collect diagnostic or medical information about learners (learning support features require no diagnosis).`,
    },
    {
      h: "4. How We Use Your Data",
      p: `We use your data to operate the platform, match learners with tutors at their grade level, send session confirmations and Zoom links, log volunteer hours for service transcripts, and improve our service. We do not sell your data to third parties. We do not use your data for advertising.`,
    },
    {
      h: "5. Session Privacy",
      p: `1-on-1 tutoring sessions are private Zoom calls between the tutor and student only. Sessions are not recorded by default. Recording requires explicit written consent from the parent or guardian. Session duration is logged for volunteer-hour verification only.`,
    },
    {
      h: "6. Data Sharing",
      p: `We share data with: our hosting provider (Vercel), our database provider (Supabase), and our video conferencing provider (Zoom). All providers are bound by data processing agreements. We do not share data with advertisers, data brokers, or any other third parties.`,
    },
    {
      h: "7. Data Retention",
      p: `Your data is retained as long as your account is active. You may request account deletion at any time by emailing support@learnivia.app. Upon deletion, personal data is permanently removed within 30 days, except where retention is required by law.`,
    },
    {
      h: "8. Your Rights",
      p: `You have the right to: access the personal data we hold about you, correct inaccurate data, request deletion of your data, and receive a copy of your data (data portability). Parents and guardians can exercise these rights on behalf of minor children. To exercise any right: support@learnivia.app`,
    },
    {
      h: "9. Cookies",
      p: `We use strictly necessary cookies for authentication (signing in and session management). We do not use advertising cookies or tracking cookies. See our Cookie Policy for full details.`,
    },
    {
      h: "10. Security",
      p: `We use industry-standard security practices: encrypted connections (HTTPS), secure password storage, and access controls. Only admin users can access student and tutor personal data.`,
    },
    {
      h: "11. Contact",
      p: `For privacy enquiries: privacy@learnivia.app. For support: support@learnivia.app`,
    },
  ];

  return (
    <main style={{ maxWidth: 760, margin: "0 auto", padding: "4rem 1.5rem 6rem", fontFamily: "var(--font-body, Inter, sans-serif)" }}>
      <div style={{ marginBottom: "3rem" }}>
        <div style={{ display: "inline-block", background: "#EFF6FF", color: "#1D4ED8", border: "1px solid #BFDBFE", borderRadius: "999px", padding: "0.3rem 0.9rem", fontSize: "0.8rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "1rem" }}>
          Privacy-by-Design & Safeguarding-First
        </div>
        <h1 style={{ fontSize: "2.25rem", fontWeight: 900, color: "#111827", marginBottom: "0.5rem" }}>Privacy Policy</h1>
        <p style={{ color: "#6B7280", fontSize: "0.9rem" }}>Last updated: {LAST_UPDATED} · Free K–10 tutoring platform</p>
      </div>

      <div style={{ background: "#F0FDF4", border: "1px solid #BBF7D0", borderRadius: "0.75rem", padding: "1rem 1.25rem", marginBottom: "2.5rem", fontSize: "0.9rem", color: "#0D683B", lineHeight: 1.6 }}>
        <strong>Our commitment:</strong> We will never sell your data. We will never advertise to students or parents. Minor learner identities are protected at all times.
      </div>

      {sections.map((s) => (
        <div key={s.h} style={{ marginBottom: "2rem", paddingBottom: "2rem", borderBottom: "1px solid #F3F4F6" }}>
          <h2 style={{ fontSize: "1.05rem", fontWeight: 800, color: "#111827", marginBottom: "0.6rem" }}>{s.h}</h2>
          <p style={{ color: "#374151", lineHeight: 1.75, fontSize: "0.9375rem" }}>{s.p}</p>
        </div>
      ))}
    </main>
  );
}
