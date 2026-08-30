import Link from "next/link";
import Image from "next/image";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import styles from "./page.module.css";

export const metadata = {
  title: "Learnivia — Free Online Peer Tutoring",
  description: "Join over 205k students. Free peer-led tutoring, SAT prep, college admissions mentorship, homework help, and meaningful conversations with students around the globe.",
};

const PROGRAMS = [
  {
    id: "sat",
    badge: "SAT",
    badgeColor: "#7C3AED",
    badgeBg: "#7C3AED",
    label: "SAT",
    description: "Join intensive SAT prep sessions",
    href: "/learn/exam-prep",
  },
  {
    id: "caw",
    badge: "CAW",
    badgeColor: "#2563EB",
    badgeBg: "#2563EB",
    label: "College Admissions Workshops",
    description: "Get advice from college students",
    href: "/learn/college-admissions",
    isNew: true,
  },
  {
    id: "dia",
    badge: "DIA",
    badgeColor: "#D97706",
    badgeBg: "#D97706",
    label: "Dialogues",
    description: "Discuss interesting topics with peers",
    href: "/learn/dialogues",
  },
  {
    id: "community",
    icon: "search",
    label: "Community Sessions",
    description: "Choose a subject to learn",
    href: "/sessions",
    iconColor: "#0E8345",
    iconBg: "#E6F4EA",
  },
  {
    id: "homework",
    icon: "chat",
    label: "Homework Help",
    description: "Get instant help with your work",
    href: "/homework-help",
    iconColor: "#6B7280",
    iconBg: "#F3F4F6",
  },
];

const STORIES = [
  { name: "Anya R.", initials: "AR", color: "#0E8345", quote: "Learnivia helped me raise my SAT score by 180 points. My tutor was incredible!" },
  { name: "James K.", initials: "JK", color: "#7C3AED", quote: "As a volunteer tutor I've logged 60+ hours. I've learned as much from my students as they have from me." },
  { name: "Priya M.", initials: "PM", color: "#D97706", quote: "I was skeptical at first, but after seeing how patient my daughter's tutor was, I'm completely convinced." },
];

export default async function Home() {
  const session = await auth();

  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <main className={styles.main}>
      {/* ============ HERO ============ */}
      <section className={styles.hero}>
        {/* Floating avatar decorations */}
        <div className={styles.floatingAvatars} aria-hidden="true">
          <div className={`${styles.avatar} ${styles.avatarTL}`} style={{ background: "#1A1F2E" }}>
            <span>😎</span>
          </div>
          <div className={`${styles.avatar} ${styles.avatarTR}`} style={{ background: "#0E8345" }}>
            <span>🕶️</span>
          </div>
          <div className={`${styles.avatar} ${styles.avatarML}`} style={{ background: "#7C3AED" }}>
            <span>👩‍💻</span>
          </div>
          <div className={`${styles.avatar} ${styles.avatarMR}`} style={{ background: "#2563EB" }}>
            <span>👩‍🎓</span>
          </div>
          <div className={`${styles.avatar} ${styles.avatarBL}`} style={{ background: "#D97706" }}>
            <span>🧑‍🏫</span>
          </div>
          <div className={`${styles.avatar} ${styles.avatarBR}`} style={{ background: "#DC2626" }}>
            <span>👨‍🎓</span>
          </div>
          <div className={`${styles.avatar} ${styles.avatarBR2}`} style={{ background: "#0D9488" }}>
            <span>👩‍🔬</span>
          </div>
        </div>

        <div className={styles.heroContent}>
          {/* Left: Big headline */}
          <div className={styles.heroLeft}>
            <h1 className={styles.heroTitle}>
              Free<br />
              Online<br />
              Tutoring.<br />
              <span className={styles.heroSubline}>Real Human<br />Connection.</span>
            </h1>
          </div>

          {/* Right: CTA block */}
          <div className={styles.heroRight}>
            {/* 205k social proof */}
            <div className={styles.socialProof}>
              <div className={styles.avatarStack} aria-hidden="true">
                {["#0E8345","#7C3AED","#D97706"].map((c, i) => (
                  <div key={i} className={styles.stackAvatar} style={{ background: c, zIndex: 3 - i }} />
                ))}
              </div>
              <span className={styles.socialText}>Join over <strong>205k students</strong></span>
            </div>

            <p className={styles.heroDesc}>
              Join our peer-led community for free SAT® tutoring, college admissions mentorship, homework help, and meaningful conversations with students around the globe.
            </p>

            <Link href="/signup" className={styles.startBtn}>Start Learning!</Link>

            <div className={styles.secondaryCtas}>
              <Link href="/parents" className={styles.outlineBtn}>For Parents</Link>
              <Link href="/educators" className={styles.outlineBtn}>For Educators</Link>
            </div>
          </div>
        </div>

        {/* Summer Camp promo banner */}
        <div className={styles.promoBanner}>
          <div className={styles.promoIllustration} aria-hidden="true">
            <span className={styles.promoFlag}>🏕️</span>
          </div>
          <div className={styles.promoText}>
            <strong>Summer Camp &apos;26</strong>
            <span>In session July 1 to August 31, 2026.</span>
          </div>
          <div className={styles.promoDivider} aria-hidden="true" />
          <p className={styles.promoDesc}>
            Join Learnivia Summer Camp to learn with and from other students across the world—100% free.
          </p>
          <Link href="/learn" className={styles.promoLink}>Learn more →</Link>
        </div>
      </section>

      {/* ============ PROGRAMS QUICK ACCESS ============ */}
      <section className={styles.programs}>
        <div className={styles.container}>
          <div className={styles.programsGrid}>
            {PROGRAMS.map((p) => (
              <Link key={p.id} href={p.href} className={styles.programCard}>
                {p.isNew && <span className={styles.newDot} aria-hidden="true" />}
                {/* Icon / Badge */}
                <div
                  className={styles.programBadge}
                  style={p.badge ? { background: p.badgeBg, color: "#fff" } : { background: p.iconBg, color: p.iconColor }}
                >
                  {p.badge ? (
                    <span className={styles.programBadgeText}>{p.badge}</span>
                  ) : p.icon === "search" ? (
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                    </svg>
                  ) : (
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
                    </svg>
                  )}
                </div>

                <h3 className={styles.programLabel}>{p.label}</h3>
                <p className={styles.programDesc}>{p.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ============ HOW IT WORKS ============ */}
      <section className={styles.howSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>How it works</h2>
            <p className={styles.sectionSub}>Four simple steps from your first visit to your first session.</p>
          </div>
          <div className={styles.stepsGrid}>
            {[
              { num: "1", title: "Choose what you need", desc: "Browse programs or search by subject. No account needed to explore.", emoji: "🔍" },
              { num: "2", title: "Sign up for free", desc: "Create your account in seconds using Google sign-in.", emoji: "✍️" },
              { num: "3", title: "Book a session", desc: "Pick a tutor, choose a time slot, and confirm. Sessions are held on Zoom.", emoji: "📅" },
              { num: "4", title: "Learn & grow", desc: "Have your session and share feedback to help our community keep improving.", emoji: "🚀" },
            ].map((s) => (
              <div key={s.num} className={styles.stepCard}>
                <div className={styles.stepEmoji} aria-hidden="true">{s.emoji}</div>
                <div className={styles.stepNum}>{s.num}</div>
                <h3 className={styles.stepTitle}>{s.title}</h3>
                <p className={styles.stepDesc}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ COMMUNITY STORIES ============ */}
      <section className={styles.storiesSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>What our community says</h2>
          </div>
          <div className={styles.storiesGrid}>
            {STORIES.map((s) => (
              <div key={s.name} className={styles.storyCard}>
                <p className={styles.storyQuote}>&ldquo;{s.quote}&rdquo;</p>
                <div className={styles.storyAuthor}>
                  <div className={styles.storyAvatar} style={{ background: s.color }}>{s.initials}</div>
                  <span className={styles.storyName}>{s.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ DUAL CTA ============ */}
      <section className={styles.dualCta}>
        <div className={styles.container}>
          <div className={styles.dualCtaGrid}>
            <div className={styles.ctaCard}>
              <div className={styles.ctaEmoji} aria-hidden="true">📚</div>
              <h2 className={styles.ctaTitle}>Need learning support?</h2>
              <p className={styles.ctaDesc}>Find a free volunteer tutor who knows your subject and matches your schedule.</p>
              <Link href="/signup" className={styles.ctaPrimary}>Find a tutor</Link>
            </div>
            <div className={styles.ctaCard}>
              <div className={styles.ctaEmoji} aria-hidden="true">🎓</div>
              <h2 className={styles.ctaTitle}>Want to make a difference?</h2>
              <p className={styles.ctaDesc}>Join as a volunteer tutor. Earn verified hours, sharpen your skills, and help someone succeed.</p>
              <Link href="/apply" className={styles.ctaOutline}>Apply to volunteer</Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
