"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { springs, buttonMotion } from "@/lib/motion";
import { loginAsDemo } from "./signin/actions";
import styles from "./page.module.css";
import {
  CheckCircle2,
  Users,
  ShieldCheck,
  Award,
  BookOpen,
  GraduationCap,
  Clock,
  Calculator,
  Atom,
  Languages,
  HeartHandshake,
  ArrowRight,
  ChevronDown,
  Video,
  Search,
  CalendarCheck,
} from "lucide-react";

const GRADE_BANDS = [
  {
    id: "k2",
    label: "Early Elementary",
    grades: "K–Grade 2",
    ages: "Ages 5–8",
    subjects: ["Phonics & Reading", "Early Math", "Letter Recognition", "Number Sense"],
    href: "/find?grade=K-2",
  },
  {
    id: "35",
    label: "Elementary",
    grades: "Grades 3–5",
    ages: "Ages 8–11",
    subjects: ["Math", "Reading & Writing", "General Science", "Social Studies"],
    href: "/find?grade=3-5",
  },
  {
    id: "68",
    label: "Middle School",
    grades: "Grades 6–8",
    ages: "Ages 11–14",
    subjects: ["Pre-Algebra", "English & Language Arts", "Earth Science", "Physical Science"],
    href: "/find?grade=6-8",
  },
  {
    id: "910",
    label: "Early High School",
    grades: "Grades 9–10",
    ages: "Ages 14–16",
    subjects: ["Algebra I", "Geometry", "Biology", "Chemistry"],
    href: "/find?grade=9-10",
  },
];

const FAQS = [
  {
    q: "Is Learnivia really 100% free?",
    a: "Yes, completely. There are no trial periods, no premium tiers, and no credit card required. Learnivia is a volunteer tutoring platform — high school and university mentors help K–10 students for free, earning certified community service hours.",
  },
  {
    q: "Who can use Learnivia?",
    a: "Learnivia serves students in Kindergarten through Grade 10. Parents manage accounts for younger learners. Students in Grades 9–10 may also manage their accounts independently.",
  },
  {
    q: "Who are the volunteer tutors?",
    a: "Our tutors are high-achieving high school and university students. Every applicant submits academic transcripts, passes safeguarding safety training, and is thoroughly reviewed before hosting sessions.",
  },
  {
    q: "How do private Zoom sessions work?",
    a: "Sessions take place in secure, private 1-on-1 Zoom rooms with waiting rooms enabled. When you book a session, the join link appears in your dashboard. No recordings occur without explicit parental consent.",
  },
  {
    q: "Does my child need a formal diagnosis for learning support?",
    a: "Absolutely not. Learnivia welcomes all learners — including those who benefit from visual explanations, step-by-step pacing, extra processing time, or frequent micro-breaks. No diagnosis is ever required.",
  },
  {
    q: "How do tutors receive verified volunteer service hours?",
    a: "When a session concludes, the duration is logged automatically. Tutors can download a verified Volunteer Service Record with verifiable session IDs for school advisors, community service programs, and college portfolios.",
  },
];

const SESSION_STEPS = [
  {
    icon: Search,
    num: "01",
    title: "Find a tutor",
    desc: "Browse verified tutors by subject and grade. Every tutor is screened and approved.",
  },
  {
    icon: CalendarCheck,
    num: "02",
    title: "Book for free",
    desc: "Pick an open slot. No credit card, no fees — completely free for every student.",
  },
  {
    icon: Video,
    num: "03",
    title: "Meet on Zoom",
    desc: "Join a private 1-on-1 Zoom session. Share your homework, get patient guidance.",
  },
];

interface HomeInteractiveClientProps {
  liveSession?: {
    id: string;
    title: string;
    subject: string;
    description: string;
    tutorName: string;
    tutorSchool: string;
    startTime: string;
    openSeats: number;
    maxCapacity: number;
  } | null;
  tutorsCount?: number;
  completedCount?: number;
}

export default function HomeInteractiveClient({
  liveSession,
  tutorsCount = 0,
  completedCount = 0,
}: HomeInteractiveClientProps) {
  const [activeTab, setActiveTab] = useState<string>("k2");
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [demoLoading, setDemoLoading] = useState<string | null>(null);

  async function handleDemo(role: "STUDENT" | "TUTOR" | "ADMIN") {
    setDemoLoading(role);
    try {
      const res = await loginAsDemo(role);
      if (res?.success && res.redirectUrl) {
        window.location.href = res.redirectUrl;
      } else {
        window.location.href = "/signin";
      }
    } catch {
      window.location.href = "/signin";
    }
  }

  const currentBand = GRADE_BANDS.find((b) => b.id === activeTab) || GRADE_BANDS[0];

  return (
    <div className={styles.homeWrapper}>

      {/* ── 1. HERO ── */}
      <section className={styles.heroSection}>
        <div className={styles.heroContainer}>

          {/* Left — headline + CTA */}
          <div className={styles.heroLeftCol}>
            <h1 className={styles.heroTitle}>
              Free tutoring,<br />
              <span className={styles.heroTitleAccent}>one Zoom call away.</span>
            </h1>

            <p className={styles.heroParagraph}>
              Verified volunteer tutors guide K–10 students through private 1-on-1 Zoom sessions.
              Every learning style supported — no cost, no subscriptions, ever.
            </p>

            <div className={styles.heroActions}>
              <Link
                href="/find"
                className={styles.primaryBtn}
              >
                Find a tutor — it&apos;s free
                <ArrowRight size={18} strokeWidth={2.5} />
              </Link>
              <Link href="/signup?role=tutor" className={styles.secondaryBtn}>
                Volunteer as tutor
              </Link>
            </div>

            <div className={styles.trustRow}>
              <span className={styles.trustItem}>
                <CheckCircle2 size={15} color="#1B4D3E" />
                No credit card
              </span>
              <span className={styles.trustItem}>
                <ShieldCheck size={15} color="#1B4D3E" />
                Privacy-first
              </span>
              <span className={styles.trustItem}>
                <Award size={15} color="#1B4D3E" />
                {tutorsCount > 0 ? `${tutorsCount}+ tutors` : "Screened tutors"}
              </span>
            </div>

            {/* Quick Demo Workspaces Preview */}
            <div className={styles.demoBar}>
              <div className={styles.demoBarHeader}>
                <span className={styles.demoBarTitle}>Explore Redesigned Workspaces</span>
                <span className={styles.demoBarSub}>1-Click Instant Preview</span>
              </div>
              <p className={styles.demoBarText}>
                Tour any of the authenticated workspaces with live verified data:
              </p>
              <div className={styles.demoBarButtons}>
                <button
                  type="button"
                  disabled={Boolean(demoLoading)}
                  onClick={() => handleDemo("STUDENT")}
                  className={styles.demoBtn}
                >
                  <BookOpen size={14} color="#1B4D3E" />
                  <span>{demoLoading === "STUDENT" ? "Opening…" : "Learner Workspace"}</span>
                </button>
                <button
                  type="button"
                  disabled={Boolean(demoLoading)}
                  onClick={() => handleDemo("TUTOR")}
                  className={styles.demoBtn}
                >
                  <GraduationCap size={14} color="#1B4D3E" />
                  <span>{demoLoading === "TUTOR" ? "Opening…" : "Tutor Center"}</span>
                </button>
                <button
                  type="button"
                  disabled={Boolean(demoLoading)}
                  onClick={() => handleDemo("ADMIN")}
                  className={styles.demoBtn}
                >
                  <ShieldCheck size={14} color="#1B4D3E" />
                  <span>{demoLoading === "ADMIN" ? "Opening…" : "Admin Center"}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right — How it works (clean 3 steps) */}
          <div className={styles.heroRightCol}>
            <div className={styles.howItWorksCard}>
              <div className={styles.howItWorksLabel}>How a session works</div>
              <ol className={styles.howItWorksList}>
                {SESSION_STEPS.map((step, i) => (
                  <li key={step.num} className={styles.howItWorksStep}>
                    <div className={styles.stepIcon}>
                      <step.icon size={18} color="#1B4D3E" strokeWidth={2} />
                    </div>
                    <div className={styles.stepBody}>
                      <div className={styles.stepTitle}>{step.title}</div>
                      <div className={styles.stepDesc}>{step.desc}</div>
                    </div>
                    {i < SESSION_STEPS.length - 1 && (
                      <div className={styles.stepConnector} aria-hidden="true" />
                    )}
                  </li>
                ))}
              </ol>
              <Link href="/find" className={styles.howItWorksBtn}>
                Get started — free <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. FEATURES ── */}
      <section className={styles.featuresSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionHeading}>Everything a student needs to succeed</h2>
            <p className={styles.sectionLead}>
              Built around the real experience of K–10 learning — not corporate tutoring agencies.
            </p>
          </div>

          <div className={styles.featuresGrid}>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon} style={{ background: "#EAF3ED" }}>
                <Users size={22} color="#2D6A4F" />
              </div>
              <h3 className={styles.featureTitle}>1-on-1 peer mentoring</h3>
              <p className={styles.featureDesc}>
                Private sessions with a verified tutor who adapts to your student's pace, style, and curriculum.
              </p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon} style={{ background: "#FDF3E3" }}>
                <Award size={22} color="#C9922A" />
              </div>
              <h3 className={styles.featureTitle}>Certified service hours</h3>
              <p className={styles.featureDesc}>
                Tutors earn verified service records with verifiable session IDs for school advisors and community service credit.
              </p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon} style={{ background: "#EAF3ED" }}>
                <ShieldCheck size={22} color="#2D6A4F" />
              </div>
              <h3 className={styles.featureTitle}>Child-safe by design</h3>
              <p className={styles.featureDesc}>
                Private Zoom waiting rooms, parent-managed profiles, and zero recordings without consent.
              </p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon} style={{ background: "#FAEDE9" }}>
                <HeartHandshake size={22} color="#C1694F" />
              </div>
              <h3 className={styles.featureTitle}>Every learning style welcome</h3>
              <p className={styles.featureDesc}>
                Visual, step-by-step, extra processing time — no diagnosis needed. Every learner belongs here.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2.5. AUDIENCE PATHWAYS (PARENTS, LEARNERS, TUTORS) ── */}
      <section className={styles.pathwaysSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <span className={styles.pathwayPill}>Tailored for the Community</span>
            <h2 className={styles.sectionHeading}>Three dedicated learning pathways</h2>
            <p className={styles.sectionLead}>
              Whether you are a parent seeking safe oversight, a student needing compassionate help, or a high school volunteer earning official service hours.
            </p>
          </div>

          <div className={styles.pathwaysGrid}>
            <div className={styles.pathwayCard}>
              <div className={styles.pathwayIconWrap}>
                <ShieldCheck size={24} style={{ color: "var(--wa-forest)" }} aria-hidden="true" />
              </div>
              <span className={styles.pathwayAudience}>For Parents &amp; Guardians</span>
              <h3 className={styles.pathwayTitle}>Transparent oversight &amp; verified safety</h3>
              <p className={styles.pathwayDesc}>
                Manage your child&apos;s account with privacy by design. Filter tutors by curriculum and grade band, observe sessions, and confirm attendance with 1-click verification.
              </p>
              <Link href="/parents" className={styles.pathwayLink}>
                <span>Explore parent guide</span>
                <ArrowRight size={15} />
              </Link>
            </div>

            <div className={styles.pathwayCard}>
              <div className={styles.pathwayIconWrap}>
                <BookOpen size={24} style={{ color: "var(--wa-forest)" }} aria-hidden="true" />
              </div>
              <span className={styles.pathwayAudience}>For K–10 Learners</span>
              <h3 className={styles.pathwayTitle}>Friendly peer mentoring &amp; homework help</h3>
              <p className={styles.pathwayDesc}>
                Connect with patient older students who recently mastered your syllabus. Enjoy interactive Zoom whiteboard sessions with no subscriptions and zero judgment.
              </p>
              <Link href="/find" className={styles.pathwayLink}>
                <span>Find your tutor</span>
                <ArrowRight size={15} />
              </Link>
            </div>

            <div className={styles.pathwayCard}>
              <div className={styles.pathwayIconWrap}>
                <GraduationCap size={24} style={{ color: "var(--wa-forest)" }} aria-hidden="true" />
              </div>
              <span className={styles.pathwayAudience}>For Volunteer Student Tutors</span>
              <h3 className={styles.pathwayTitle}>Certified hours &amp; leadership impact</h3>
              <p className={styles.pathwayDesc}>
                High school (Grade 11+) and university students earn verified volunteer service transcripts with cryptographic session verification codes for colleges and honor societies.
              </p>
              <Link href="/apply" className={styles.pathwayLink}>
                <span>Apply to tutor</span>
                <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. GRADE BANDS ── */}
      <section className={styles.programsSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionHeading}>Find help for your grade level</h2>
            <p className={styles.sectionLead}>
              Every tutor is approved for specific grade bands — matched to your student&apos;s level.
            </p>
          </div>

          <div className={styles.programTabsBar} role="tablist">
            {GRADE_BANDS.map((band) => (
              <button
                key={band.id}
                role="tab"
                aria-selected={activeTab === band.id}
                onClick={() => setActiveTab(band.id)}
                className={`${styles.programTabBtn} ${activeTab === band.id ? styles.programTabActive : ""}`}
              >
                {activeTab === band.id && (
                  <motion.div
                    layoutId="activeGradeBandIndicator"
                    className={styles.programTabActivePill}
                    transition={springs.snappy}
                  />
                )}
                <span style={{ position: "relative", zIndex: 2 }}>{band.label}</span>
              </button>
            ))}
          </div>

          <div className={styles.programStage}>
            <div className={styles.programStageHeader}>
              <div>
                <h3 className={styles.stageTitle}>{currentBand.label} — {currentBand.grades}</h3>
                <p className={styles.stageDesc}>{currentBand.ages} · Subjects with verified volunteer peer tutors</p>
              </div>
              <Link href={currentBand.href} className={styles.stageBrowseLink}>
                Find a tutor <ArrowRight size={16} />
              </Link>
            </div>

            <div className={styles.sessionCardsGrid}>
              {currentBand.subjects.map((subject, idx) => (
                <motion.div
                  key={subject}
                  className={styles.subjectCard}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ ...springs.smooth, delay: idx * 0.05 }}
                >
                  <Link href={`${currentBand.href}&subject=${encodeURIComponent(subject)}`} className={styles.subjectCardLink}>
                    <div className={styles.subjectCardTitle}>{subject}</div>
                    <div className={styles.subjectCardCta}>
                      <span>Explore</span>
                      <ArrowRight size={14} />
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. FAQ ── */}
      <section className={styles.faqSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionHeading}>Common questions</h2>
            <p className={styles.sectionLead}>
              Honest answers about how Learnivia works, who it's for, and how we keep it safe.
            </p>
          </div>

          <div className={styles.faqContainer}>
            {FAQS.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div key={faq.q} className={`${styles.faqItem} ${isOpen ? styles.faqItemOpen : ""}`}>
                  <button
                    type="button"
                    className={styles.faqQuestionBtn}
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    aria-expanded={isOpen}
                  >
                    <span>{faq.q}</span>
                    <motion.div
                      className={styles.faqChevron}
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={springs.snappy}
                    >
                      <ChevronDown size={20} />
                    </motion.div>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        key="content"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={springs.smooth}
                        style={{ overflow: "hidden" }}
                      >
                        <div className={styles.faqAnswer}>{faq.a}</div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 5. CTA BANNER ── */}
      <section className={styles.bottomCtaSection}>
        <div className={styles.container}>
          <div className={styles.bottomCtaCard}>
            <h2 className={styles.bottomCtaTitle}>Ready to get started?</h2>
            <p className={styles.bottomCtaLead}>
              Join thousands of K–10 learners and volunteer tutors. No subscriptions, zero fees.
            </p>
            <div className={styles.bottomCtaButtons}>
              <Link href="/signup" className={styles.bottomPrimaryBtn}>
                Join Learnivia — Free Forever
              </Link>
              <Link href="/signup?role=tutor" className={styles.bottomSecondaryBtn}>
                Become a Volunteer Tutor
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
