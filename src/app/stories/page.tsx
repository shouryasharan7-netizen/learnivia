import { prisma } from "@/lib/prisma";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Community Stories",
  description: "Real stories from the Learnivia community about learning, volunteering, and connection.",
};

export default async function StoriesPage() {
  const stories = await prisma.story.findMany({
    where: { isPublished: true },
    orderBy: { createdAt: "desc" }
  });

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
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1.5rem", marginBottom: "4rem" }}>
          {stories.map(s => (
            <div key={s.id} style={{ background: "white", border: "1px solid var(--color-border)", borderRadius: "1rem", padding: "2rem", position: "relative", boxShadow: "var(--shadow-sm)" }}>
              <p style={{ fontSize: "1rem", color: "var(--color-navy)", lineHeight: 1.7, fontStyle: "italic", marginBottom: "1.5rem" }}>
                &quot;{s.quote}&quot;
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
            Has Learnivia made a difference for you? We&apos;d love to hear about it. All submissions are reviewed and only published with your explicit consent.
          </p>
          <a href="mailto:stories@learnivia.app" style={{ display: "inline-flex", background: "var(--color-teal)", color: "white", fontWeight: 700, padding: "0.875rem 2rem", borderRadius: "999px", textDecoration: "none" }}>
            Share your experience →
          </a>
        </div>
      </section>
    </main>
  );
}
