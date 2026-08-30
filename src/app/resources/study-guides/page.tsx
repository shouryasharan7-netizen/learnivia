import Link from "next/link";
import styles from "./page.module.css";

export const metadata = {
  title: "Study Guides & Formula Sheets — Learnivia",
  description: "Free curated study guides, cheat sheets, and formula collections across high school and collegiate subjects.",
};

const GUIDES = [
  {
    category: "Mathematics",
    items: [
      {
        title: "Calculus I & II Quick Formula Reference",
        topics: "Derivatives, Integrals, Taylor Series, Chain Rule, Integration by Parts",
        level: "AP / A-Level / College",
        badge: "Essential",
      },
      {
        title: "Algebra & Polynomials Mastery Guide",
        topics: "Quadratic Formula, Completing the Square, Factoring Patterns, Rational Functions",
        level: "GCSE / Secondary",
        badge: "Popular",
      },
      {
        title: "Trigonometry Identities & Circle Theorems",
        topics: "Unit Circle, Sine/Cosine Laws, Double Angle Formulas, Radians",
        level: "High School",
        badge: "Quick Sheet",
      },
    ],
  },
  {
    category: "Sciences",
    items: [
      {
        title: "AP / A-Level Biology Unit Review",
        topics: "Cellular Respiration, Photosynthesis, Genetics, Macromolecules, Signal Transduction",
        level: "High School / AP",
        badge: "Top Rated",
      },
      {
        title: "Organic & General Chemistry Fundamentals",
        topics: "Periodic Trends, Stoichiometry, Thermodynamics, Reaction Mechanisms, Acid-Base Equilbria",
        level: "High School / College",
        badge: "Detailed",
      },
      {
        title: "Classical Mechanics & Kinematics",
        topics: "Newton's Laws, Conservation of Momentum, Work-Energy Theorem, Rotational Motion",
        level: "GCSE / A-Level",
        badge: "Formulas",
      },
    ],
  },
  {
    category: "Standardized Testing & Writing",
    items: [
      {
        title: "Digital SAT Reading & Writing Strategies",
        topics: "Vocabulary in Context, Rhetorical Synthesis, Transitions, Evidence-Based Paired Passages",
        level: "SAT Prep",
        badge: "High Impact",
      },
      {
        title: "College Admissions Essay Blueprint",
        topics: "Hook Construction, Showing vs Telling, Narrative Arc, Common App Prompt Breakdowns",
        level: "College Prep",
        badge: "Guide",
      },
    ],
  },
];

export default function StudyGuidesPage() {
  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <div className={styles.breadcrumb}>
          <Link href="/resources">Tutoring Resources</Link>
          <span>/</span>
          <span>Study Guides</span>
        </div>

        <div className={styles.header}>
          <h1 className={styles.title}>Study Guides & Reference Sheets</h1>
          <p className={styles.subtitle}>
            Concise, peer-verified reference sheets designed for quick review before exams or during live tutoring sessions.
          </p>
        </div>

        <div className={styles.categories}>
          {GUIDES.map((section) => (
            <section key={section.category} className={styles.categorySection}>
              <h2 className={styles.categoryTitle}>{section.category}</h2>
              <div className={styles.cardsGrid}>
                {section.items.map((guide) => (
                  <div key={guide.title} className={styles.guideCard}>
                    <div className={styles.cardHeader}>
                      <span className={styles.levelTag}>{guide.level}</span>
                      <span className={styles.badge}>{guide.badge}</span>
                    </div>
                    <h3 className={styles.guideTitle}>{guide.title}</h3>
                    <p className={styles.guideTopics}>{guide.topics}</p>
                    <div className={styles.cardAction}>
                      <span className={styles.actionBtn}>Open Reference Sheet 📄</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
