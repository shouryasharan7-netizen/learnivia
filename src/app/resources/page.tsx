import Link from "next/link";
import { BookOpen, Wrench, FileCheck, ShieldCheck, ArrowRight } from "lucide-react";
import styles from "./page.module.css";

export const metadata = {
  title: "Tutoring Resources — Learnivia",
  description: "Curated guides, session tools, and resources for tutors and students on Learnivia.",
};

const RESOURCE_SECTIONS = [
  {
    title: "Study Guides & Subject Summaries",
    description: "Curated K–10 visual concept breakdowns across Mathematics, Sciences, Reading & Writing, and Social Studies.",
    href: "/resources/study-guides",
    icon: BookOpen,
    tag: "Concept Guides",
  },
  {
    title: "Interactive Study & Tutor Tools",
    description: "Live focus timers, whiteboard scratchpads, equation reference guides, and collaborative session prompts.",
    href: "/resources/tools",
    icon: Wrench,
    tag: "Active Tools",
  },
  {
    title: "Formula Sheets & Quick Cheat Sheets",
    description: "High-yield downloadable formula blueprints: Algebra & Calculus, Periodic Table, PEEL Essay Planning, and Physics Kinematics.",
    href: "/resources/study-guides#formula-sheets",
    icon: FileCheck,
    tag: "Quick Reference",
  },
  {
    title: "Safeguarding & Learning Standards",
    description: "Classroom safety guidelines, video session etiquette, and student protection protocols.",
    href: "/safety",
    icon: ShieldCheck,
    tag: "Safety & Trust",
  },
];

const DOWNLOADABLE_TOOLKITS = [
  {
    title: "K–10 Math Formula Sheet",
    subject: "Mathematics",
    grade: "Grades 5–10",
    desc: "Comprehensive formulas for Area, Perimeter, Volume, Quadratic Equation, Slope, and Trigonometric Ratios.",
    format: "PDF Quick Sheet",
    badge: "Most Popular",
  },
  {
    title: "PEEL Essay Writing Blueprint",
    subject: "English Language Arts",
    grade: "Grades 6–10",
    desc: "Point, Evidence, Explanation, Link scaffolded essay builder with transition words and analytical hooks.",
    format: "PDF Graphic Organizer",
    badge: "Writing Essential",
  },
  {
    title: "Interactive Chemistry Periodic Guide",
    subject: "Physical Science",
    grade: "Grades 7–10",
    desc: "Atomic numbers, electron shells, element classifications, and oxidation states cheat sheet.",
    format: "Visual Guide",
    badge: "STEM Reference",
  },
  {
    title: "Physics Mechanics & Kinematics",
    subject: "Science",
    grade: "Grades 8–10",
    desc: "Motion equations, Newton's Laws, work-energy theorem, and unit conversion tables.",
    format: "Formula Sheet",
    badge: "STEM Reference",
  },
];

const QUICK_TIPS = [
  {
    title: "The 80/20 Talking Rule",
    desc: "Encourage the student to talk, explain their reasoning, and write out steps for 80% of the session time.",
  },
  {
    title: "Scaffolded Problem Solving",
    desc: "Break complex multi-step calculus or chemistry problems into 2-3 manageable sub-goals before solving.",
  },
  {
    title: "Praise the Process",
    desc: "Reinforce problem-solving effort, consistency, and curiosity rather than just getting the right answer quickly.",
  },
];

export default function ResourcesPage() {
  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <div className={styles.header}>
          <span className={styles.categoryBadge}>Tutor & Learner Hub</span>
          <h1 className={styles.title}>Tutoring Resources</h1>
          <p className={styles.subtitle}>
            Everything you need to plan engaging sessions, master core concepts, and deliver high-impact peer learning.
          </p>
        </div>

        <div className={styles.grid}>
          {RESOURCE_SECTIONS.map((res) => {
            const IconComponent = res.icon;
            return (
              <Link key={res.title} href={res.href} className={styles.card}>
                <div className={styles.cardTop}>
                  <span className={styles.icon} aria-hidden="true">
                    <IconComponent size={24} />
                  </span>
                  <span className={styles.tag}>{res.tag}</span>
                </div>
                <h2 className={styles.cardTitle}>{res.title}</h2>
                <p className={styles.cardDesc}>{res.description}</p>
                <span className={styles.cardArrow} style={{ display: "inline-flex", alignItems: "center", gap: "0.3rem" }}>
                  Explore resource <ArrowRight size={13} />
                </span>
              </Link>
            );
          })}
        </div>

        <div className={styles.tipsSection} style={{ marginTop: "2.5rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: "0.5rem", marginBottom: "1.25rem" }}>
            <div>
              <h2 className={styles.tipsHeading} style={{ margin: 0 }}>Core Academic Toolkits &amp; Cheat Sheets</h2>
              <p style={{ fontSize: "0.85rem", color: "var(--wa-muted, #64748B)", marginTop: "0.25rem" }}>
                Downloadable reference frameworks and formula sheets for high school and middle school courses.
              </p>
            </div>
            <Link
              href="/resources/study-guides"
              style={{
                fontSize: "0.8125rem",
                fontWeight: 600,
                color: "var(--wa-green, #2563EB)",
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.3rem",
              }}
            >
              <span>View all guides</span>
              <ArrowRight size={13} />
            </Link>
          </div>

          <div className={styles.grid}>
            {DOWNLOADABLE_TOOLKITS.map((tool) => (
              <div
                key={tool.title}
                className={styles.card}
                style={{
                  background: "#FFFFFF",
                  border: "1px solid var(--wa-border, #E2E8F0)",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.5rem" }}>
                  <span
                    style={{
                      fontSize: "0.6875rem",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      color: "var(--wa-green, #2563EB)",
                      background: "#EFF6FF",
                      padding: "0.2rem 0.55rem",
                      borderRadius: "4px",
                    }}
                  >
                    {tool.subject}
                  </span>
                  <span style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--wa-muted, #64748B)" }}>
                    {tool.grade}
                  </span>
                </div>

                <h3 style={{ fontSize: "1.05rem", fontWeight: 700, color: "var(--wa-ink, #0F172A)", margin: "0.25rem 0" }}>
                  {tool.title}
                </h3>
                <p style={{ fontSize: "0.8125rem", color: "var(--wa-text, #334155)", lineHeight: 1.5, margin: "0 0 1rem" }}>
                  {tool.desc}
                </p>

                <div style={{ marginTop: "auto", display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: "0.75rem", borderTop: "1px solid var(--wa-border, #F1F5F9)" }}>
                  <span style={{ fontSize: "0.75rem", color: "var(--wa-muted, #64748B)" }}>
                    {tool.format}
                  </span>
                  <Link
                    href="/resources/study-guides"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.3rem",
                      fontSize: "0.8125rem",
                      fontWeight: 600,
                      color: "var(--wa-green, #2563EB)",
                      textDecoration: "none",
                    }}
                  >
                    <span>Open Sheet</span>
                    <ArrowRight size={13} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.tipsSection}>
          <h2 className={styles.tipsHeading}>Peer Tutoring Best Practices</h2>
          <div className={styles.tipsGrid}>
            {QUICK_TIPS.map((tip) => (
              <div key={tip.title} className={styles.tipCard}>
                <h3 className={styles.tipTitle}>{tip.title}</h3>
                <p className={styles.tipDesc}>{tip.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
