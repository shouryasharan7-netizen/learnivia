import Link from "next/link";
import Image from "next/image";
import styles from "./page.module.css";

// Demo program data — clearly marked, replace with DB when ready
const PROGRAMS = [
  {
    slug: "homework-help",
    emoji: "📚",
    title: "Homework Help",
    description: "Get one-on-one support with any assignment, any subject. Volunteer tutors available across grade levels.",
    tags: ["All grades", "Any subject"],
  },
  {
    slug: "math-foundations",
    emoji: "🔢",
    title: "Math Foundations",
    description: "Build confidence in arithmetic, algebra, geometry, and beyond with patient, knowledgeable volunteers.",
    tags: ["K–12", "Algebra", "Geometry"],
  },
  {
    slug: "science-support",
    emoji: "🔬",
    title: "Science Support",
    description: "Explore biology, chemistry, physics, and earth science with tutors who love the subject.",
    tags: ["Biology", "Chemistry", "Physics"],
  },
  {
    slug: "exam-prep",
    emoji: "✏️",
    title: "Exam Prep",
    description: "Focused preparation for standardised and school exams. Build test strategies and fill knowledge gaps.",
    tags: ["Test strategy", "Practice"],
  },
  {
    slug: "writing-essays",
    emoji: "📝",
    title: "Writing & Essays",
    description: "From brainstorming to final draft. Get feedback on structure, clarity, argument, and grammar.",
    tags: ["Essays", "College apps", "Creative"],
  },
  {
    slug: "study-skills",
    emoji: "🧠",
    title: "Study Skills",
    description: "Learn how to learn. Build note-taking systems, time management, and revision strategies that stick.",
    tags: ["Organisation", "Focus", "Revision"],
  },
];

const STUDENT_STEPS = [
  { icon: "/images/find-a-tutor.png", step: "1", title: "Choose what you need", description: "Browse programs or search by subject and grade level. No account needed to explore." },
  { icon: "/images/book-a-session.png", step: "2", title: "Compare & select a tutor", description: "Read tutor bios, see availability, and pick someone who feels like a great fit." },
  { icon: "/images/join-zoom.png", step: "3", title: "Book a free time slot", description: "Pick a date and time that works for you. Sessions are free and held online over Zoom." },
  { icon: "/images/session-complete.png", step: "4", title: "Meet, learn & reflect", description: "Have your session and share feedback so our community keeps improving." },
];

const TUTOR_STEPS = [
  { num: "1", title: "Apply online", description: "Fill out a short application about your subjects, experience, and availability." },
  { num: "2", title: "Review & safeguarding", description: "Our team reviews every application and provides community guidelines training." },
  { num: "3", title: "Set your schedule", description: "Choose when you're available each week. You're in full control." },
  { num: "4", title: "Teach & earn verified hours", description: "Run sessions and receive a verified record of your volunteer contribution." },
];

// Demo tutor spotlights — clearly labelled as demo content
const DEMO_TUTORS = [
  { name: "Aanya S.", subject: "Maths & Physics", grade: "High School & GCSE", hours: 42, initials: "AS", color: "#39A6A3" },
  { name: "Marcus O.", subject: "English & Writing", grade: "Middle & High School", hours: 28, initials: "MO", color: "#17324D" },
  { name: "Priya L.", subject: "Biology & Chemistry", grade: "A-Level & AP", hours: 65, initials: "PL", color: "#F4C95D" },
];

export default function Home() {
  return (
    <main>
      {/* ========== HERO ========== */}
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.heroBadge}>
            <span className={styles.heroBadgeDot} aria-hidden="true" />
            Free for everyone, always
          </div>
          <h1 className={styles.heroTitle}>
            Real learning support,<br />from people who care.
          </h1>
          <p className={styles.heroSubtitle}>
            Learnivia connects students with volunteer peer tutors for free, one-on-one online sessions — no subscriptions, no catch.
          </p>
          <div className={styles.heroCtas}>
            <Link href="/find" className={styles.primaryBtn}>Find learning support</Link>
            <Link href="/apply" className={styles.secondaryBtn}>Become a volunteer tutor</Link>
          </div>
          <div className={styles.heroProof}>
            <span>🎓 Volunteer-powered</span>
            <span aria-hidden="true">·</span>
            <span>📅 Flexible scheduling</span>
            <span aria-hidden="true">·</span>
            <span>🛡️ Safeguarded sessions</span>
          </div>
        </div>
      </section>

      {/* ========== PROGRAM CATALOG ========== */}
      <section className={styles.programs}>
        <div className={styles.sectionInner}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>What do you need help with?</h2>
            <p className={styles.sectionSubtitle}>Choose a program, or browse all tutors to find your fit.</p>
          </div>
          <div className={styles.programGrid}>
            {PROGRAMS.map(p => (
              <Link key={p.slug} href={`/learn/${p.slug}`} className={styles.programCard}>
                <span className={styles.programEmoji} aria-hidden="true">{p.emoji}</span>
                <h3 className={styles.programTitle}>{p.title}</h3>
                <p className={styles.programDesc}>{p.description}</p>
                <div className={styles.programTags}>
                  {p.tags.map(t => <span key={t} className={styles.tag}>{t}</span>)}
                </div>
              </Link>
            ))}
          </div>
          <div className={styles.sectionCta}>
            <Link href="/find" className={styles.outlineBtn}>Browse all tutors →</Link>
          </div>
        </div>
      </section>

      {/* ========== HOW IT WORKS — STUDENTS ========== */}
      <section className={styles.howItWorks}>
        <div className={styles.sectionInner}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>How it works for learners</h2>
            <p className={styles.sectionSubtitle}>Four simple steps from your first visit to your first session.</p>
          </div>
          <div className={styles.stepsGrid}>
            {STUDENT_STEPS.map((s, i) => (
              <div key={i} className={styles.stepCard}>
                <Image src={s.icon} alt="" width={80} height={100} className={styles.stepMascot} />
                <div className={styles.stepNum}>{s.step}</div>
                <h3 className={styles.stepTitle}>{s.title}</h3>
                <p className={styles.stepDesc}>{s.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== HOW IT WORKS — TUTORS ========== */}
      <section className={styles.howItWorksTutor}>
        <div className={styles.sectionInner}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>How it works for volunteer tutors</h2>
            <p className={styles.sectionSubtitle}>Make a genuine impact while building your own skills and record.</p>
          </div>
          <div className={styles.tutorStepsGrid}>
            {TUTOR_STEPS.map((s, i) => (
              <div key={i} className={styles.tutorStepCard}>
                <div className={styles.tutorStepNum}>{s.num}</div>
                <h3 className={styles.tutorStepTitle}>{s.title}</h3>
                <p className={styles.tutorStepDesc}>{s.description}</p>
              </div>
            ))}
          </div>
          <div className={styles.sectionCta}>
            <Link href="/apply" className={styles.primaryBtn}>Apply to become a tutor</Link>
            <Link href="/how-it-works" className={styles.textLink}>Learn more →</Link>
          </div>
        </div>
      </section>

      {/* ========== TUTOR SPOTLIGHT ========== */}
      <section className={styles.spotlight}>
        <div className={styles.sectionInner}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Meet some of our volunteer tutors</h2>
            <p className={styles.sectionSubtitle}>
              <span className={styles.demoLabel}>Demo profiles</span> — real tutor cards will appear here as volunteers join.
            </p>
          </div>
          <div className={styles.tutorGrid}>
            {DEMO_TUTORS.map(t => (
              <div key={t.name} className={styles.tutorCard}>
                <div className={styles.tutorAvatar} style={{ background: t.color }}>{t.initials}</div>
                <div className={styles.tutorInfo}>
                  <h3 className={styles.tutorName}>{t.name}</h3>
                  <p className={styles.tutorSubject}>{t.subject}</p>
                  <p className={styles.tutorGrade}>{t.grade}</p>
                  <p className={styles.tutorHours}>{t.hours} volunteer hours</p>
                </div>
                <span className={styles.demoChip} aria-label="Demo profile">Demo</span>
              </div>
            ))}
          </div>
          <div className={styles.sectionCta}>
            <Link href="/find" className={styles.outlineBtn}>Browse real tutors →</Link>
          </div>
        </div>
      </section>

      {/* ========== SAFETY PROMISE ========== */}
      <section className={styles.safety}>
        <div className={styles.sectionInner}>
          <div className={styles.safetyCard}>
            <div className={styles.safetyIcon} aria-hidden="true">🛡️</div>
            <div className={styles.safetyContent}>
              <h2 className={styles.safetyTitle}>Your safety is our priority</h2>
              <p className={styles.safetyText}>
                All sessions are online-only. Tutors agree to our community guidelines before their first session. We maintain a clear reporting path for any concern.
              </p>
              <div className={styles.safetyLinks}>
                <Link href="/safety" className={styles.safetyLink}>Safety &amp; Trust Centre</Link>
                <Link href="/parents" className={styles.safetyLink}>For Parents &amp; Guardians</Link>
                <Link href="/safety#report" className={styles.safetyLink}>Report a concern</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== DUAL CTA ========== */}
      <section className={styles.dualCta}>
        <div className={styles.sectionInner}>
          <div className={styles.dualCtaGrid}>
            <div className={styles.ctaBlock}>
              <Image src="/images/find-a-tutor.png" alt="" width={100} height={120} className={styles.ctaMascot} />
              <h2 className={styles.ctaTitle}>Need learning support?</h2>
              <p className={styles.ctaText}>Find a free volunteer tutor who knows your subject and matches your schedule.</p>
              <Link href="/find" className={styles.primaryBtn}>Find a tutor</Link>
            </div>
            <div className={styles.ctaDivider} aria-hidden="true" />
            <div className={styles.ctaBlock}>
              <Image src="/images/volunteer-hours.png" alt="" width={100} height={120} className={styles.ctaMascot} />
              <h2 className={styles.ctaTitle}>Want to make a difference?</h2>
              <p className={styles.ctaText}>Join as a volunteer tutor. Earn verified hours, sharpen your skills, and help someone succeed.</p>
              <Link href="/apply" className={styles.tealOutlineBtn}>Apply to volunteer</Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
