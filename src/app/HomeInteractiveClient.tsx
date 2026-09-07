"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import LogoSplash from "@/components/LogoSplash";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import { springs, buttonMotion, cardHoverMotion, fadeUpVariants } from "@/lib/motion";
import { fireConfetti } from "@/lib/confetti";
import styles from "./page.module.css";
import {
  Sparkles,
  CheckCircle2,
  Clock,
  Users,
  ShieldCheck,
  Award,
  BookOpen,
  Calculator,
  Atom,
  Languages,
  HeartHandshake,
  ArrowRight,
  ChevronDown,
  Video,
  Globe,
  Compass,
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

const HOW_IT_WORKS_STEPS = [
  {
    step: "01",
    title: "Select Your Grade & Subject",
    desc: "Choose your grade (K–10) and target subject. Only tutors approved for your level appear.",
    img: "/images/find-a-tutor.png",
  },
  {
    step: "02",
    title: "Book a Free 1-on-1 Session",
    desc: "Pick an open slot with a verified volunteer tutor. No credit cards, zero fees — 100% free.",
    img: "/images/book-a-session.png",
  },
  {
    step: "03",
    title: "Meet Live on Zoom",
    desc: "Join a private 1-on-1 Zoom room. Share homework, discuss problems, get patient guidance.",
    img: "/images/join-zoom.png",
  },
  {
    step: "04",
    title: "Track Your Progress",
    desc: "Minutes are logged in real time. Tutors receive verified service hour transcripts.",
    img: "/images/session-complete.png",
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
    a: "When a session concludes, the duration is logged automatically. Tutors can download an official verified Volunteer Service Transcript signed for NHS, school advisors, and college applications.",
  },
];

const BENTO_SUBJECT_CONTENT: Record<string, { topic: string; step1: string; step2: string; tip: string }> = {
  math: {
    topic: "Algebra I: Quadratic Factoring",
    step1: "1. Identify common binomial terms: (x + p)(x + q)",
    step2: "2. Verify product pq = c and sum p + q = b",
    tip: "💡 Tutor Tip: Visualize roots as x-intercepts on the parabola!",
  },
  reading: {
    topic: "Literary Analysis: Thesis Construction",
    step1: "1. State central claim + specific author device",
    step2: "2. Cite two direct text proofs with line anchors",
    tip: "💡 Tutor Tip: Avoid generalizations — show exactly how word choice shapes tone!",
  },
  science: {
    topic: "Biology: Photosynthesis Light Reactions",
    step1: "1. Photons hit Photosystem II, splitting H₂O into oxygen",
    step2: "2. Electron transport generates ATP + NADPH for Calvin cycle",
    tip: "💡 Tutor Tip: Remember OIL RIG for oxidation & reduction!",
  },
  phonics: {
    topic: "Early Reading: Phoneme Blending (C-V-C)",
    step1: "1. Sound out isolated phonemes: /b/ - /æ/ - /t/",
    step2: "2. Blend together smoothly: 'bat'",
    tip: "💡 Tutor Tip: Tap fingers on table for each sound block!",
  },
};

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
  const [bentoSubject, setBentoSubject] = useState<"math" | "reading" | "science" | "phonics">("math");

  const currentBand = GRADE_BANDS.find((b) => b.id === activeTab) || GRADE_BANDS[0];
  const bentoContent = BENTO_SUBJECT_CONTENT[bentoSubject];

  return (
    <div className={styles.homeWrapper}>
      {/* 1. Opening Brand Splash Animation */}
      <LogoSplash />

      {/* 2. Hero Section with Aurora Mesh Glows */}
      <section className={styles.heroSection}>
        {/* Ambient Aurora Glows */}
        <div className={styles.auroraLayer} aria-hidden="true">
          <div className={styles.aurora1} />
          <div className={styles.aurora2} />
          <div className={styles.aurora3} />
        </div>

        <div className={styles.heroContainer}>
          <div className={styles.heroLeftCol}>
            {/* 21st.dev Shimmer Live Radar Pill */}
            <motion.div
              className={styles.eyebrowBadge}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={springs.smooth}
            >
              <div className={styles.radarPingWrapper}>
                <div className={styles.radarPingRing} />
                <div className={styles.radarDot} />
              </div>
              <span className={styles.eyebrowText}>
                ✨ Over {completedCount > 0 ? `${completedCount.toLocaleString()}+` : "4,200+"} Sessions Completed • 100% Free
              </span>
            </motion.div>

            <motion.h1
              className={styles.heroTitle}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...springs.smooth, delay: 0.1 }}
            >
              Free online tutoring{" "}
              <br />
              <span className={styles.heroTitleItalic}>designed for every mind.</span>
            </motion.h1>

            <motion.p
              className={styles.heroParagraph}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...springs.smooth, delay: 0.2 }}
            >
              Connecting Kindergarten through Grade 10 students with verified volunteer peer tutors
              for private 1-on-1 Zoom sessions. Every learning style supported — no cost, ever.
            </motion.p>

            {/* Dual Actions with Emil Kowalski Spring Physics */}
            <motion.div
              className={styles.heroActions}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...springs.smooth, delay: 0.3 }}
            >
              <motion.div {...buttonMotion}>
                <Link
                  href="/find"
                  className={styles.primaryHeroBtn}
                  onClick={() => fireConfetti()}
                >
                  <span>Find a Tutor (Free)</span>
                  <ArrowRight size={18} />
                </Link>
              </motion.div>

              <motion.div {...buttonMotion}>
                <Link href="/signup?role=tutor" className={styles.secondaryHeroBtn}>
                  <span>Become a Volunteer Tutor</span>
                </Link>
              </motion.div>
            </motion.div>

            {/* Trust Row */}
            <motion.div
              className={styles.trustRow}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <div className={styles.trustItem}>
                <span className={styles.trustIcon}><CheckCircle2 size={18} /></span>
                <span>Zero cost, ever</span>
              </div>
              <div className={styles.trustItem}>
                <span className={styles.trustIcon}><ShieldCheck size={18} /></span>
                <span>Verified K–10 tutors</span>
              </div>
              <div className={styles.trustItem}>
                <span className={styles.trustIcon}><Award size={18} /></span>
                <span>Official volunteer hours</span>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Floating Live Classroom Card */}
          <div className={styles.heroRightCol}>
            <div className={styles.liveCardDeck}>
              <motion.div
                className={styles.heroPreviewCard}
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 5, ease: "easeInOut", repeat: Infinity }}
              >
                <div className={styles.previewHeader}>
                  <div className={styles.previewMascotMini}>
                    <Image
                      src="/images/logo.png"
                      alt="Learnivia Fox"
                      width={34}
                      height={34}
                      className={styles.mascotImg}
                      priority
                    />
                  </div>
                  <div>
                    <div className={styles.liveIndicatorRow}>
                      <span className={styles.liveIndicator}>
                        {liveSession ? "Upcoming Session" : "Live Learning Room"}
                      </span>
                      <div className={styles.soundwave} aria-label="Audio active">
                        <div className={styles.soundwaveBar} />
                        <div className={styles.soundwaveBar} />
                        <div className={styles.soundwaveBar} />
                      </div>
                    </div>
                    <h3 className={styles.previewTitle}>
                      {liveSession ? liveSession.title : "1-on-1 Peer Mentoring • K–Grade 10"}
                    </h3>
                  </div>
                </div>

                <p className={styles.previewDesc}>
                  {liveSession
                    ? liveSession.description || "Personalized 1-on-1 support with a verified volunteer tutor."
                    : "Live interactive whiteboard session. Tailored step-by-step pacing for visual & neurodiverse learners."}
                </p>

                <div className={styles.previewMeta}>
                  <div className={styles.metaChip}>
                    <Clock size={15} />
                    <span>
                      {liveSession
                        ? new Date(liveSession.startTime).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })
                        : "Private 1-on-1 Zoom"}
                    </span>
                  </div>
                  <div className={styles.metaChip}>
                    <Users size={15} />
                    <span>
                      {liveSession
                        ? `${liveSession.openSeats} seats available`
                        : `${tutorsCount > 0 ? `${tutorsCount} Verified Tutors` : "Volunteer Mentors"}`}
                    </span>
                  </div>
                </div>

                <div className={styles.previewHostRow}>
                  <div className={styles.hostAvatar}>
                    {liveSession
                      ? liveSession.tutorName.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()
                      : "LV"}
                    <span className={styles.hostOnlineBeacon} />
                  </div>
                  <div className={styles.hostInfo}>
                    <div className={styles.hostName}>
                      {liveSession ? liveSession.tutorName : "Maya Lin & Team"}
                    </div>
                    <div className={styles.hostCred}>
                      {liveSession ? liveSession.tutorSchool : "Northwestern University • Approved Tutor"}
                    </div>
                  </div>
                  <motion.div {...buttonMotion}>
                    <Link
                      href="/find"
                      className={styles.previewJoinBtn}
                      onClick={() => fireConfetti()}
                    >
                      {liveSession ? "Book Now" : "Find Tutor"}
                    </Link>
                  </motion.div>
                </div>
              </motion.div>

              <div className={styles.heroCardBackdrop} aria-hidden="true" />
            </div>
          </div>
        </div>
      </section>

      {/* 3. 21st.dev Asymmetrical Bento Grid Section */}
      <section className={styles.bentoSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionKicker}>THE LEARNIVIA DIFFERENCE</span>
            <h2 className={styles.sectionHeading}>Engineered for how students actually learn.</h2>
            <p className={styles.sectionLead}>
              Replacing expensive corporate tutoring agencies with high-touch, verified peer volunteering.
            </p>
          </div>

          <div className={styles.bentoGrid}>
            {/* Bento Card 1: 1-on-1 Interactive Mentoring (Span 2) */}
            <SpotlightCard className={`${styles.bentoCard} ${styles.bentoCardSpan2}`}>
              <div>
                <span className={styles.bentoBadge} style={{ background: "#F0FDF4", color: "#15803D" }}>
                  <Users size={14} /> 1-on-1 Mentorship
                </span>
                <h3 className={styles.bentoTitle}>Personalized Peer Tutoring at Your Own Pace</h3>
                <p className={styles.bentoDesc}>
                  No rushed 15-minute explanations. High school & university peers sit side-by-side on Zoom,
                  breaking down challenging concepts using interactive whiteboards.
                </p>

                {/* Interactive Subject Switcher */}
                <div className={styles.bentoSubjectPills}>
                  {(["math", "reading", "science", "phonics"] as const).map((sub) => (
                    <button
                      key={sub}
                      type="button"
                      className={`${styles.bentoPill} ${bentoSubject === sub ? styles.bentoPillActive : ""}`}
                      onClick={() => setBentoSubject(sub)}
                    >
                      {sub === "math" && "📐 Math"}
                      {sub === "reading" && "📖 Reading & Essay"}
                      {sub === "science" && "🔬 Science"}
                      {sub === "phonics" && "🔤 Early Phonics"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dynamic Whiteboard Sample */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={bentoSubject}
                  className={styles.bentoWhiteboardPreview}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={springs.snappy}
                >
                  <div className={styles.bentoWhiteboardHeader}>
                    <span>Interactive Whiteboard Sample</span>
                    <span style={{ color: "#0D683B" }}>Live Note</span>
                  </div>
                  <div style={{ fontWeight: 700, color: "#0F172A", marginBottom: "0.25rem" }}>
                    {bentoContent.topic}
                  </div>
                  <div>{bentoContent.step1}</div>
                  <div>{bentoContent.step2}</div>
                  <div style={{ marginTop: "0.5rem", color: "#0D683B", fontStyle: "italic" }}>
                    {bentoContent.tip}
                  </div>
                </motion.div>
              </AnimatePresence>
            </SpotlightCard>

            {/* Bento Card 2: Volunteer Hours & Transcripts (Span 1) */}
            <SpotlightCard className={`${styles.bentoCard} ${styles.bentoCardSpan1}`}>
              <div>
                <span className={styles.bentoBadge} style={{ background: "#FEF3C7", color: "#B45309" }}>
                  <Award size={14} /> Certified Service
                </span>
                <h3 className={styles.bentoTitle}>Official Volunteer Hours</h3>
                <p className={styles.bentoDesc}>
                  Every completed session is automatically timestamped and verified for National Honor Society,
                  IB CAS, and high school graduation credit.
                </p>
              </div>

              <div className={styles.bentoMetricsWrap}>
                <div className={styles.bentoStatNumber}>12,450+</div>
                <div className={styles.bentoStatLabel}>Verified Volunteer Hours Logged</div>
                <div className={styles.bentoSealBadge}>
                  <CheckCircle2 size={15} /> Official Transcript Included
                </div>
              </div>
            </SpotlightCard>

            {/* Bento Card 3: Safeguarded Zoom (Span 1) */}
            <SpotlightCard className={`${styles.bentoCard} ${styles.bentoCardSpan1}`}>
              <div>
                <span className={styles.bentoBadge} style={{ background: "#EFF6FF", color: "#1D4ED8" }}>
                  <ShieldCheck size={14} /> Safeguarding
                </span>
                <h3 className={styles.bentoTitle}>COPPA & Child Safety Guardrails</h3>
                <p className={styles.bentoDesc}>
                  Built from the ground up for K–10 learners. Waiting rooms enforced, parent oversight,
                  and verified tutor identity checks.
                </p>
              </div>

              <div className={styles.bentoSafetyList}>
                <div className={styles.bentoSafetyItem}>
                  <CheckCircle2 size={16} color="#0D683B" />
                  <span>Private 1-on-1 Zoom waiting rooms</span>
                </div>
                <div className={styles.bentoSafetyItem}>
                  <CheckCircle2 size={16} color="#0D683B" />
                  <span>Parent-managed child profiles</span>
                </div>
                <div className={styles.bentoSafetyItem}>
                  <CheckCircle2 size={16} color="#0D683B" />
                  <span>Zero recording without consent</span>
                </div>
              </div>
            </SpotlightCard>

            {/* Bento Card 4: Neurodiversity & Learning Styles (Span 2) */}
            <SpotlightCard className={`${styles.bentoCard} ${styles.bentoCardSpan2}`}>
              <div>
                <span className={styles.bentoBadge} style={{ background: "#FDF2F8", color: "#BE185D" }}>
                  <HeartHandshake size={14} /> Inclusive Education
                </span>
                <h3 className={styles.bentoTitle}>Personalized for Every Learning Style</h3>
                <p className={styles.bentoDesc}>
                  Whether your student learns best visually, needs step-by-step pacing, or requires extra
                  processing time — our tutors adapt to them. No medical diagnosis or paperwork required.
                </p>
              </div>

              <div className={styles.bentoStylesWrap}>
                <span className={styles.styleChip}>🎨 Visual Explanations</span>
                <span className={styles.styleChip}>⏳ Extra Processing Time</span>
                <span className={styles.styleChip}>🪜 Step-by-Step Pacing</span>
                <span className={styles.styleChip}>☕ Frequent Micro-Breaks</span>
                <span className={styles.styleChip}>✍️ Practice-First Learning</span>
              </div>
            </SpotlightCard>
          </div>
        </div>
      </section>

      {/* 4. Grade Bands Explorer with Emil Kowalski Sliding Spring Pill */}
      <section className={styles.programsSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionKicker}>GRADE BANDS • K–10</span>
            <h2 className={styles.sectionHeading}>Find help for your grade level.</h2>
            <p className={styles.sectionLead}>
              Every tutor is approved for specific grade bands — your student only connects with tutors matched to their level.
            </p>
          </div>

          {/* Sliding Spring Pill Tab Switcher */}
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
                <h3 className={styles.stageTitle}>
                  {currentBand.label} — {currentBand.grades}
                </h3>
                <p className={styles.stageDesc}>
                  {currentBand.ages} • Subjects with verified volunteer peer tutors
                </p>
              </div>
              <motion.div {...buttonMotion}>
                <Link href={currentBand.href} className={styles.stageBrowseLink}>
                  <span>Find a Tutor for This Grade</span>
                  <ArrowRight size={16} />
                </Link>
              </motion.div>
            </div>

            <div className={styles.sessionCardsGrid}>
              {currentBand.subjects.map((subject, idx) => (
                <SpotlightCard
                  key={subject}
                  className={styles.subjectPillCard}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ ...springs.smooth, delay: idx * 0.05 }}
                >
                  <Link href={`${currentBand.href}&subject=${encodeURIComponent(subject)}`} style={{ textDecoration: "none", color: "inherit", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                    <div className={styles.subjectPillTitle}>{subject}</div>
                    <div className={styles.subjectPillKicker}>
                      <span>Explore Tutors</span>
                      <ArrowRight size={14} />
                    </div>
                  </Link>
                </SpotlightCard>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 5. How It Works (Journey) */}
      <section className={styles.journeySection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionKicker}>HOW IT WORKS</span>
            <h2 className={styles.sectionHeading}>Simple, transparent, and completely free.</h2>
            <p className={styles.sectionLead}>
              Start learning or tutoring in minutes. Zero subscriptions, zero paywalls.
            </p>
          </div>

          <div className={styles.journeyGrid}>
            {HOW_IT_WORKS_STEPS.map((step, idx) => (
              <SpotlightCard
                key={step.step}
                className={styles.journeyCard}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ ...springs.smooth, delay: idx * 0.08 }}
              >
                <div className={styles.stepNumBadge}>{step.step}</div>
                <div className={styles.journeyImgWrap}>
                  <Image
                    src={step.img}
                    alt={step.title}
                    width={140}
                    height={140}
                    className={styles.journeyIllustration}
                  />
                </div>
                <h3 className={styles.journeyTitle}>{step.title}</h3>
                <p className={styles.journeyDesc}>{step.desc}</p>
              </SpotlightCard>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Interactive Spring Accordion FAQs */}
      <section className={styles.faqSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionKicker}>FREQUENTLY ASKED QUESTIONS</span>
            <h2 className={styles.sectionHeading}>Everything you need to know.</h2>
            <p className={styles.sectionLead}>
              Transparent answers about our mission, volunteer safeguarding, and peer matching.
            </p>
          </div>

          <div className={styles.faqContainer}>
            {FAQS.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={faq.q}
                  className={`${styles.faqItem} ${isOpen ? styles.faqItemOpen : ""}`}
                >
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

      {/* 7. Bottom CTA Banner with Spring Actions */}
      <section className={styles.bottomCtaSection}>
        <div className={styles.container}>
          <div className={styles.bottomCtaCard}>
            <h2 className={styles.bottomCtaTitle}>Ready to experience free peer tutoring?</h2>
            <p className={styles.bottomCtaLead}>
              Join hundreds of K–10 learners and certified volunteer tutors today. No subscriptions, zero fees.
            </p>
            <div className={styles.bottomCtaButtons}>
              <motion.div {...buttonMotion}>
                <Link
                  href="/signup"
                  className={styles.bottomPrimaryBtn}
                  onClick={() => fireConfetti()}
                >
                  <span>Join Learnivia — Free Forever</span>
                </Link>
              </motion.div>

              <motion.div {...buttonMotion}>
                <Link href="/signup?role=tutor" className={styles.bottomSecondaryBtn}>
                  <span>Become a Volunteer Tutor</span>
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
