import Link from "next/link";
import styles from "./page.module.css";

export const metadata = {
  title: "Tutoring Resources — Learnivia",
  description: "Curated guides, session tools, and resources for tutors and students on Learnivia.",
};

const RESOURCE_SECTIONS = [
  {
    title: "Study Guides & Cheat Sheets",
    description: "Free K–10 study guides, formula sheets, and subject summaries across Mathematics, Sciences, Reading & Writing, and Social Studies.",
    href: "/resources/study-guides",
    icon: "📚",
    tag: "High Impact",
  },
  {
    title: "Interactive Tutor Tools",
    description: "Collaborative whiteboard, session timers, equation editors, and icebreaker question prompts for live sessions.",
    href: "/resources/tools",
    icon: "🛠️",
    tag: "Live Session",
  },
  {
    title: "Official Volunteer Transcript",
    description: "View and print your official certificate and verified hours ledger for college and scholarship applications.",
    href: "/tutor/transcript",
    icon: "📜",
    tag: "Certification",
  },
  {
    title: "Safeguarding & Session Etiquette",
    description: "Safety guidelines, video session standards, and incident reporting protocols for all tutors and learners.",
    href: "/safety",
    icon: "🛡️",
    tag: "Safety",
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
          {RESOURCE_SECTIONS.map((res) => (
            <Link key={res.title} href={res.href} className={styles.card}>
              <div className={styles.cardTop}>
                <span className={styles.icon} aria-hidden="true">{res.icon}</span>
                <span className={styles.tag}>{res.tag}</span>
              </div>
              <h2 className={styles.cardTitle}>{res.title}</h2>
              <p className={styles.cardDesc}>{res.description}</p>
              <span className={styles.cardArrow}>Explore resource →</span>
            </Link>
          ))}
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
