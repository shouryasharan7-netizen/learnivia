import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Study Guides — Learnivia K\u201310",
  description: "Free K\u201310 study guides, formula sheets, and subject summaries across Mathematics, Science, Reading & Writing, and Social Studies.",
};

const GUIDES = [
  {
    title: "Multiplication & Division Fact Families",
    subject: "Mathematics",
    level: "Grade 3\u20135",
    color: "#0E8345",
    bg: "#F0FDF4",
    border: "#BBF7D0",
    desc: "Visual fact triangles, skip-counting strategies, and long division step-by-step.",
    tags: ["Number Sense", "Multiplication", "Division"],
  },
  {
    title: "Fractions, Decimals & Percentages",
    subject: "Mathematics",
    level: "Grade 5\u20138",
    color: "#0E8345",
    bg: "#F0FDF4",
    border: "#BBF7D0",
    desc: "Converting between forms, comparing fractions, and real-world percentage applications.",
    tags: ["Fractions", "Decimals", "Ratio"],
  },
  {
    title: "Algebra Basics: Solving for X",
    subject: "Mathematics",
    level: "Grade 7\u20139",
    color: "#0E8345",
    bg: "#F0FDF4",
    border: "#BBF7D0",
    desc: "One-step and two-step equations, balancing both sides, and checking solutions.",
    tags: ["Algebra", "Equations", "Variables"],
  },
  {
    title: "Geometry Essentials",
    subject: "Mathematics",
    level: "Grade 6\u201310",
    color: "#0E8345",
    bg: "#F0FDF4",
    border: "#BBF7D0",
    desc: "Area, perimeter, volume formulas for all common 2D and 3D shapes with worked examples.",
    tags: ["Geometry", "Area", "Volume"],
  },
  {
    title: "Reading Comprehension Strategies",
    subject: "Reading & Writing",
    level: "Grade 3\u20138",
    color: "#C9922A",
    bg: "#F5F3FF",
    border: "#DDD6FE",
    desc: "Main idea, inference, author\u2019s purpose, and making connections \u2014 with practice passages.",
    tags: ["Reading", "Comprehension", "ELA"],
  },
  {
    title: "Essay Writing: Structure & Planning",
    subject: "English Language Arts",
    level: "Grade 5\u201310",
    color: "#C9922A",
    bg: "#F5F3FF",
    border: "#DDD6FE",
    desc: "Introduction hooks, body paragraph structure (PEEL), and conclusion techniques.",
    tags: ["Writing", "Essays", "Structure"],
  },
  {
    title: "Earth Science: Rocks, Water & Weather",
    subject: "Science",
    level: "Grade 4\u20136",
    color: "#1D4ED8",
    bg: "#EFF6FF",
    border: "#BFDBFE",
    desc: "Rock cycle, water cycle, cloud types, and weather patterns explained visually.",
    tags: ["Earth Science", "Weather", "Rocks"],
  },
  {
    title: "Life Science: Cells & Living Systems",
    subject: "Science",
    level: "Grade 6\u20138",
    color: "#1D4ED8",
    bg: "#EFF6FF",
    border: "#BFDBFE",
    desc: "Cell structure, photosynthesis, ecosystems, and food webs with diagrams.",
    tags: ["Biology", "Cells", "Ecosystems"],
  },
  {
    title: "Chemistry Basics: Atoms & Elements",
    subject: "Science",
    level: "Grade 8\u201310",
    color: "#1D4ED8",
    bg: "#EFF6FF",
    border: "#BFDBFE",
    desc: "Periodic table basics, atomic structure, compounds and mixtures, and balancing simple equations.",
    tags: ["Chemistry", "Atoms", "Periodic Table"],
  },
  {
    title: "Social Studies: Map Skills & Geography",
    subject: "Social Studies",
    level: "Grade 3\u20136",
    color: "#B45309",
    bg: "#FFFBEB",
    border: "#FDE68A",
    desc: "Reading maps, continents & oceans, coordinates, and understanding scale.",
    tags: ["Geography", "Maps", "Social Studies"],
  },
];

export default function StudyGuidesPage() {
  const subjects = Array.from(new Set(GUIDES.map((g) => g.subject)));

  return (
    <main style={{ minHeight: "100vh", background: "#F9FAFB", fontFamily: "var(--font-body, Inter, sans-serif)" }}>
      {/* Header */}
      <div style={{ background: "linear-gradient(135deg, #0E8345, #1a6b3a)", padding: "3rem 1.5rem 2.5rem", color: "#fff", textAlign: "center" }}>
        <h1 style={{ fontSize: "clamp(1.75rem, 4vw, 2.5rem)", fontWeight: 800, margin: "0 0 0.75rem" }}>
          K\u201310 Study Guides
        </h1>
        <p style={{ opacity: 0.9, maxWidth: "520px", margin: "0 auto", fontSize: "1rem" }}>
          Free, printable study guides and subject summaries for every K\u201310 topic.
        </p>
      </div>

      {/* Nav by subject */}
      <nav aria-label="Subject filter" style={{ background: "#fff", borderBottom: "1px solid #E5E7EB", padding: "1rem 1.5rem", display: "flex", gap: "0.75rem", flexWrap: "wrap", justifyContent: "center" }}>
        {subjects.map((s) => (
          <a key={s} href={`#${s.toLowerCase().replace(/[^a-z]/g, "-")}`} style={{ padding: "0.4rem 1rem", background: "#F3F4F6", borderRadius: "999px", textDecoration: "none", color: "#374151", fontSize: "0.875rem", fontWeight: 600 }}>
            {s}
          </a>
        ))}
      </nav>

      <div style={{ maxWidth: "960px", margin: "0 auto", padding: "3rem 1.5rem" }}>
        {subjects.map((subject) => {
          const subjectGuides = GUIDES.filter((g) => g.subject === subject);
          const first = subjectGuides[0];
          return (
            <section key={subject} id={subject.toLowerCase().replace(/[^a-z]/g, "-")} style={{ marginBottom: "3.5rem" }}>
              <h2 style={{ fontSize: "1.25rem", fontWeight: 800, color: "#111827", marginBottom: "1.25rem", paddingBottom: "0.5rem", borderBottom: `2px solid ${first.color}` }}>
                {subject}
              </h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1.25rem" }}>
                {subjectGuides.map((guide) => (
                  <div key={guide.title} style={{ background: "#fff", border: `1px solid ${guide.border}`, borderRadius: "1rem", padding: "1.25rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <span style={{ fontSize: "0.75rem", background: guide.bg, color: guide.color, border: `1px solid ${guide.border}`, borderRadius: "999px", padding: "0.25rem 0.65rem", fontWeight: 700 }}>
                        {guide.level}
                      </span>
                    </div>
                    <h3 style={{ fontSize: "1rem", fontWeight: 800, color: "#111827", margin: 0, lineHeight: 1.3 }}>{guide.title}</h3>
                    <p style={{ fontSize: "0.875rem", color: "#374151", lineHeight: 1.6, margin: 0 }}>{guide.desc}</p>
                    <div style={{ display: "flex", gap: "0.35rem", flexWrap: "wrap" }}>
                      {guide.tags.map((t) => (
                        <span key={t} style={{ fontSize: "0.7rem", background: "#F3F4F6", color: "#6B7280", borderRadius: "999px", padding: "0.2rem 0.55rem", fontWeight: 600 }}>{t}</span>
                      ))}
                    </div>
                    <Link href="/find" style={{ display: "block", textAlign: "center", marginTop: "auto", background: guide.color, color: "#fff", padding: "0.6rem", borderRadius: "0.5rem", textDecoration: "none", fontWeight: 700, fontSize: "0.875rem" }}>
                      Find a tutor for {guide.subject} →
                    </Link>
                  </div>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </main>
  );
}
