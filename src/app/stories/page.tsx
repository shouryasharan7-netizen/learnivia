import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Community Stories",
  description: "Real stories from the Learnivia community about learning, volunteering, and connection.",
};

/**
 * DEMO stories — clearly marked. Replace with DB query when Story model is ready.
 * All stories require explicit user consent before publication.
 */
const DEMO_STORIES = [
  {
    id: "1",
    quote: "My tutor didn't just help me pass my maths exam — she helped me understand why I'd been struggling for years. I went from a D to a B in two months.",
    name: "A learner, Year 11",
    subject: "GCSE Maths",
    isDemo: true,
  },
  {
    id: "2",
    quote: "Volunteering here has been one of the most rewarding things I've done. I've logged 60+ hours and learned as much from my students as they've learned from me.",
    name: "A volunteer tutor, University Year 2",
    subject: "Biology & Chemistry",
    isDemo: true,
  },
  {
    id: "3",
    quote: "As a parent, I was sceptical. But after sitting in on a session and seeing how patient and knowledgeable the tutor was, I'm completely convinced.",
    name: "A parent of a Year 9 student",
    subject: "English & Writing",
    isDemo: true,
  },
];

export default function StoriesPage() {
  return (
    <main>
      <section style={{ background: "linear-gradient(135deg, var(--color-sky) 0%, var(--color-cream) 100%)", padding: "5rem 1.5rem", textAlign: "center" }}>
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          <h1 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 900, color: "var(--color-navy)", marginBottom: "1rem", letterSpacing: "-0.03em" }}>
            Community stories
          </h1>
          <p style={{ fontSize: "1.125rem", color: "var(--color-text-muted)", lineHeight: 1.7 }}>
            Real experiences from learners, tutors, and families — shared with their permission.
          </p>
        </div>
      </section>

      <section style={{ maxWidth: "var(--container-lg)", margin: "0 auto", padding: "4rem 1.5rem" }}>
        {/* Demo warning */}
        <div style={{ background: "var(--color-warning-bg)", border: "1px solid rgb(243 156 18 / 0.3)", borderRadius: "0.75rem", padding: "1rem 1.5rem", marginBottom: "3rem", display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
          <span style={{ fontSize: "1.25rem", flexShrink: 0 }}>⚠️</span>
          <div>
            <strong style={{ color: "var(--color-navy)", fontSize: "0.875rem" }}>These are demonstration stories</strong>
            <p style={{ fontSize: "0.875rem", color: "var(--color-text-muted)", marginTop: "0.25rem" }}>
              Real stories will appear here once community members choose to share their experiences. All stories require explicit consent before publication.
            </p>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1.5rem", marginBottom: "4rem" }}>
          {DEMO_STORIES.map(s => (
            <div key={s.id} style={{ background: "white", border: "1px solid var(--color-border)", borderRadius: "1rem", padding: "2rem", position: "relative", boxShadow: "var(--shadow-sm)" }}>
              {s.isDemo && (
                <span style={{ position: "absolute", top: "1rem", right: "1rem", fontSize: "0.625rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", background: "var(--color-warning-bg)", color: "var(--color-warning)", border: "1px solid rgb(243 156 18 / 0.3)", borderRadius: "999px", padding: "2px 8px" }}>Demo</span>
              )}
              <p style={{ fontSize: "1rem", color: "var(--color-navy)", lineHeight: 1.7, fontStyle: "italic", marginBottom: "1.5rem" }}>
                "{s.quote}"
              </p>
              <div style={{ borderTop: "1px solid var(--color-border)", paddingTop: "1rem" }}>
                <p style={{ fontWeight: 700, fontSize: "0.875rem", color: "var(--color-navy)" }}>{s.name}</p>
                <p style={{ fontSize: "0.875rem", color: "var(--color-teal)", fontWeight: 600 }}>{s.subject}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Share your story */}
        <div style={{ background: "var(--color-navy)", borderRadius: "1.5rem", padding: "3rem", textAlign: "center" }}>
          <h2 style={{ fontSize: "1.75rem", fontWeight: 800, color: "white", marginBottom: "0.75rem" }}>Share your story</h2>
          <p style={{ color: "rgb(255 255 255 / 0.7)", marginBottom: "2rem", lineHeight: 1.6 }}>
            Has Learnivia made a difference for you? We'd love to hear about it. All submissions are reviewed and only published with your explicit consent.
          </p>
          <a href="mailto:stories@learnivia.app" style={{ display: "inline-flex", background: "var(--color-teal)", color: "white", fontWeight: 700, padding: "0.875rem 2rem", borderRadius: "999px", textDecoration: "none" }}>
            Share your experience →
          </a>
        </div>
      </section>
    </main>
  );
}
