"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { springs } from "@/lib/motion";
import styles from "./page.module.css";
import {
  ArrowRight,
  ChevronDown,
  ShieldCheck,
  Compass,
  Users,
  Award,
  Lock,
  HeartHandshake,
  GraduationCap,
  Calculator,
  BookOpen,
  FlaskConical,
  Globe,
  PenTool,
  Star,
  CheckCircle2,
  Calendar,
  Clock,
} from "lucide-react";

const GRADE_BANDS = [
  {
    id: "all",
    label: "All Grades",
    headline: "Tutoring for Kindergarten through Grade 10",
    description: "Personalized 1-on-1 guidance tailored to your child's pace and learning style.",
    subjects: [
      { name: "Math & Problem Solving", grade: "Grades K–10", icon: Calculator, href: "/find?subject=Mathematics" },
      { name: "Reading & Phonics", grade: "Grades K–8", icon: BookOpen, href: "/find?subject=Reading" },
      { name: "Science & Biology", grade: "Grades 3–10", icon: FlaskConical, href: "/find?subject=Science" },
      { name: "Essay Writing & PEEL", grade: "Grades 4–10", icon: PenTool, href: "/find?subject=Writing" },
      { name: "Social Studies & History", grade: "Grades 3–9", icon: Globe, href: "/find?subject=Social+Studies" },
      { name: "Algebra & Geometry", grade: "Grades 7–10", icon: Calculator, href: "/find?subject=Mathematics" },
    ],
  },
  {
    id: "k2",
    label: "Grades K–2",
    headline: "Early Foundations & Literacy",
    description: "Building early confidence with friendly reading games, phonics, and basic numbers.",
    subjects: [
      { name: "Phonics & Word Discovery", grade: "Kindergarten – Grade 2", icon: BookOpen, href: "/find?grade=K-2&subject=Reading" },
      { name: "Counting & Number Sense", grade: "Kindergarten – Grade 2", icon: Calculator, href: "/find?grade=K-2&subject=Mathematics" },
      { name: "Guided Story Reading", grade: "Kindergarten – Grade 2", icon: PenTool, href: "/find?grade=K-2&subject=Reading" },
      { name: "Early Addition & Shapes", grade: "Grades 1–2", icon: Calculator, href: "/find?grade=K-2&subject=Mathematics" },
    ],
  },
  {
    id: "35",
    label: "Grades 3–5",
    headline: "Elementary Fluency & Reasoning",
    description: "Mastering multiplication, reading comprehension, fractions, and introductory science.",
    subjects: [
      { name: "Multiplication & Division", grade: "Grades 3–5", icon: Calculator, href: "/find?grade=3-5&subject=Mathematics" },
      { name: "Fractions & Word Problems", grade: "Grades 4–5", icon: Calculator, href: "/find?grade=3-5&subject=Mathematics" },
      { name: "Reading Comprehension", grade: "Grades 3–5", icon: BookOpen, href: "/find?grade=3-5&subject=Reading" },
      { name: "Earth & Life Science", grade: "Grades 3–5", icon: FlaskConical, href: "/find?grade=3-5&subject=Science" },
    ],
  },
  {
    id: "68",
    label: "Grades 6–8",
    headline: "Middle School Pre-Algebra & Sciences",
    description: "Conquering multi-step algebraic equations, lab sciences, and analytical essay writing.",
    subjects: [
      { name: "Pre-Algebra & Linear Equations", grade: "Grades 6–8", icon: Calculator, href: "/find?grade=6-8&subject=Mathematics" },
      { name: "Physical Science & Biology", grade: "Grades 6–8", icon: FlaskConical, href: "/find?grade=6-8&subject=Science" },
      { name: "Essay Structure & Analysis", grade: "Grades 6–8", icon: PenTool, href: "/find?grade=6-8&subject=Writing" },
      { name: "Geography & Civics", grade: "Grades 6–8", icon: Globe, href: "/find?grade=6-8&subject=Social+Studies" },
    ],
  },
  {
    id: "910",
    label: "Grades 9–10",
    headline: "High School Core & Exam Prep",
    description: "Targeted support for Algebra I, Geometry, Chemistry, Biology, and high school exams.",
    subjects: [
      { name: "Algebra I & Geometry", grade: "Grades 9–10", icon: Calculator, href: "/find?grade=9-10&subject=Mathematics" },
      { name: "Chemistry & Biology", grade: "Grades 9–10", icon: FlaskConical, href: "/find?grade=9-10&subject=Science" },
      { name: "Rhetoric & Research Essays", grade: "Grades 9–10", icon: PenTool, href: "/find?grade=9-10&subject=Writing" },
      { name: "Exam Strategy & Study Skills", grade: "Grades 9–10", icon: Compass, href: "/find?grade=9-10" },
    ],
  },
];

const FAQS = [
  {
    q: "Is Learnivia really 100% free?",
    a: "Yes, completely free. There are no credit cards required, no trial periods, and no hidden subscriptions. High-achieving student volunteers donate their time to mentor younger learners while earning verified community service hours.",
  },
  {
    q: "Who are the volunteer tutors and how are they vetted?",
    a: "Our tutors are top-performing high school students (Grades 11+) and university undergraduates. Every tutor submits academic records, completes mandatory child safeguarding training, and passes an individual verification review before tutoring.",
  },
  {
    q: "How do the 1-on-1 Zoom sessions work?",
    a: "Sessions take place in secure, private 1-on-1 Zoom rooms with waiting room security. Once you book a slot, the meeting link and confirmation appear directly on your dashboard.",
  },
  {
    q: "Can parents observe and supervise sessions?",
    a: "Yes, absolutely. Parents manage accounts for younger learners, receive automated confirmations, and are welcome to sit in on any session.",
  },
  {
    q: "How do student tutors receive verified volunteer hours?",
    a: "Our platform verifies attendance at the conclusion of each session and generates official, tamper-evident volunteer certificates with unique audit IDs for school counselors and college applications.",
  },
  {
    q: "What if my student needs a slower pace or visual explanations?",
    a: "Our tutors adapt naturally to each student's learning style. Whether your learner needs visual diagrams, step-by-step breakdowns, or patient repetition, our sessions are always friendly and pressure-free.",
  },
];

const REVIEWS = [
  {
    quote: "My tutor explained quadratic equations in 20 minutes using simple drawings. I went from feeling lost to getting an A on my exam.",
    author: "David K.",
    role: "8th Grade Student",
    subject: "Algebra I",
  },
  {
    quote: "As a parent, having a safe, vetted place where my daughter can get math homework help without paying $60 an hour is incredible.",
    author: "Elena R.",
    role: "Parent of 5th Grader",
    subject: "Math & Reading",
  },
  {
    quote: "Tutoring on Learnivia helped me earn 40 certified volunteer hours for NHS while building real leadership skills.",
    author: "Priya M.",
    role: "High School Senior Tutor",
    subject: "Biology & Geometry",
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
  tutorsCount = 140,
  completedCount = 380,
}: HomeInteractiveClientProps) {
  const [activeTab, setActiveTab] = useState<string>("all");
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const currentBand = GRADE_BANDS.find((b) => b.id === activeTab) || GRADE_BANDS[0];

  return (
    <div className={styles.homeWrapper}>

      {/* ── 1. HERO SECTION ── */}
      <section className={styles.heroSection}>
        <div className={styles.heroContainer}>

          {/* Left Column: Clear, punchy headline & actions */}
          <div className={styles.heroLeftCol}>
            <div className={styles.heroBadge}>
              <span className={styles.badgePulseDot} />
              <span className={styles.badgeText}>
                {completedCount > 0 ? `${completedCount}+ free sessions completed` : "100% Free Peer Tutoring"}
              </span>
            </div>

            <h1 className={styles.heroTitle}>
              Free 1-on-1 peer tutoring that <span className={styles.highlightText}>actually clicks.</span>
            </h1>

            <p className={styles.heroParagraph}>
              Connect with vetted high school and college tutors for free, private Zoom sessions. All K–10 subjects supported with patient, friendly guidance. No credit card, ever.
            </p>

            <div className={styles.heroActions}>
              <Link href="/find" className={styles.primaryBtn}>
                <span>Find Your Free Tutor</span>
                <ArrowRight size={18} />
              </Link>
              <Link href="/signup?role=tutor" className={styles.secondaryBtn}>
                <GraduationCap size={18} />
                <span>Become a Tutor</span>
              </Link>
            </div>

            {/* Trust Pillars */}
            <div className={styles.trustGrid}>
              <div className={styles.trustItem}>
                <CheckCircle2 size={16} className={styles.trustIcon} />
                <span>100% Free Forever</span>
              </div>
              <div className={styles.trustItem}>
                <ShieldCheck size={16} className={styles.trustIcon} />
                <span>Vetted Student Mentors</span>
              </div>
              <div className={styles.trustItem}>
                <Lock size={16} className={styles.trustIcon} />
                <span>Private Zoom Rooms</span>
              </div>
              <div className={styles.trustItem}>
                <Award size={16} className={styles.trustIcon} />
                <span>Certified Volunteer Hours</span>
              </div>
            </div>
          </div>

          {/* Right Column: Sleek Interactive Showcase Card */}
          <div className={styles.heroRightCol}>
            <div className={styles.showcaseCard}>
              <div className={styles.showcaseHeader}>
                <div className={styles.showcaseMeta}>
                  <span className={styles.liveIndicator}>
                    <span className={styles.livePulse} />
                    LIVE SESSIONS
                  </span>
                  <span className={styles.tutorCountBadge}>
                    {tutorsCount > 0 ? `${tutorsCount}+ Active Tutors` : "Verified Tutors"}
                  </span>
                </div>
              </div>

              {/* Dynamic Featured Session or Quick Matching */}
              {liveSession ? (
                <div className={styles.featuredSessionBox}>
                  <div className={styles.sessionSubjectPill}>{liveSession.subject}</div>
                  <h3 className={styles.sessionTitle}>{liveSession.title}</h3>
                  <p className={styles.sessionMentor}>
                    Led by <strong>{liveSession.tutorName}</strong> ({liveSession.tutorSchool})
                  </p>
                  <div className={styles.sessionMetaRow}>
                    <span className={styles.sessionSeats}>
                      <Users size={14} /> {liveSession.openSeats} seats open
                    </span>
                  </div>
                  <Link href="/sessions" className={styles.sessionActionBtn}>
                    <span>Reserve Free Seat</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              ) : (
                <div className={styles.featuredSessionBox}>
                  <div className={styles.sessionSubjectPill}>1-on-1 Tutoring</div>
                  <h3 className={styles.sessionTitle}>Math, Science &amp; English Help</h3>
                  <p className={styles.sessionMentor}>
                    Book a free 45-minute private session with a top student mentor.
                  </p>
                  <div className={styles.quickFeaturesList}>
                    <div className={styles.quickFeatureItem}>
                      <Clock size={14} /> Flexible evening &amp; weekend slots
                    </div>
                    <div className={styles.quickFeatureItem}>
                      <Lock size={14} /> Safe waiting-room secured Zoom
                    </div>
                  </div>
                  <Link href="/find" className={styles.sessionActionBtn}>
                    <span>Browse Available Tutors</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              )}

              {/* 3 Quick Steps */}
              <div className={styles.quickStepsWrapper}>
                <div className={styles.quickStepsTitle}>How it works in 3 simple steps</div>
                <div className={styles.quickStepsGrid}>
                  <div className={styles.quickStepCard}>
                    <span className={styles.stepBadge}>1</span>
                    <span className={styles.stepLabel}>Pick Subject</span>
                  </div>
                  <div className={styles.quickStepCard}>
                    <span className={styles.stepBadge}>2</span>
                    <span className={styles.stepLabel}>Choose Time</span>
                  </div>
                  <div className={styles.quickStepCard}>
                    <span className={styles.stepBadge}>3</span>
                    <span className={styles.stepLabel}>Learn 1-on-1</span>
                  </div>
                </div>
              </div>

              {/* Rating bar */}
              <div className={styles.showcaseFooter}>
                <div className={styles.starsRow}>
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={15} fill="#F59E0B" color="#F59E0B" />
                  ))}
                  <span className={styles.ratingScore}>4.9/5</span>
                </div>
                <span className={styles.ratingText}>Rated by students &amp; parents</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ── 2. VALUE PILLARS ── */}
      <section className={styles.pillarsSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionTag}>Why Learnivia</span>
            <h2 className={styles.sectionTitle}>Built for real learning, not test factories</h2>
            <p className={styles.sectionSubtitle}>
              We replaced expensive corporate tutoring with a human-centered peer network where students learn from peers with empathy and patience.
            </p>
          </div>

          <div className={styles.pillarsGrid}>
            <div className={styles.pillarCard}>
              <div className={`${styles.pillarIconWrap} ${styles.iconBlue}`}>
                <Users size={24} />
              </div>
              <h3 className={styles.pillarHeading}>Relatable Peer Mentors</h3>
              <p className={styles.pillarText}>
                Learn from older students who recently conquered your exact curriculum. They explain tricky concepts in simple, friendly language without any pressure.
              </p>
            </div>

            <div className={styles.pillarCard}>
              <div className={`${styles.pillarIconWrap} ${styles.iconGreen}`}>
                <Award size={24} />
              </div>
              <h3 className={styles.pillarHeading}>100% Free Forever</h3>
              <p className={styles.pillarText}>
                No subscriptions, no hidden paywalls, and no credit card required. High quality educational support is a community right, not a luxury.
              </p>
            </div>

            <div className={styles.pillarCard}>
              <div className={`${styles.pillarIconWrap} ${styles.iconIndigo}`}>
                <ShieldCheck size={24} />
              </div>
              <h3 className={styles.pillarHeading}>Safety &amp; Privacy First</h3>
              <p className={styles.pillarText}>
                All tutors pass academic verification and child safeguarding training. Every session is held in private Zoom rooms with full parental visibility.
              </p>
            </div>

            <div className={styles.pillarCard}>
              <div className={`${styles.pillarIconWrap} ${styles.iconAmber}`}>
                <Award size={24} />
              </div>
              <h3 className={styles.pillarHeading}>Certified Service Hours</h3>
              <p className={styles.pillarText}>
                Student tutors earn officially verified volunteer hours with tamper-evident digital transcripts for NHS, honor societies, and college applications.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. INTERACTIVE SUBJECT & GRADE EXPLORER ── */}
      <section className={styles.explorerSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionTag}>Subjects &amp; Grade Levels</span>
            <h2 className={styles.sectionTitle}>Explore tutoring for every stage</h2>
            <p className={styles.sectionSubtitle}>
              From learning phonics in Kindergarten to mastering high school geometry, our vetted tutors have you covered.
            </p>
          </div>

          {/* Tab Selector */}
          <div className={styles.gradeTabsBar} role="tablist">
            {GRADE_BANDS.map((band) => (
              <button
                key={band.id}
                role="tab"
                aria-selected={activeTab === band.id}
                onClick={() => setActiveTab(band.id)}
                className={`${styles.gradeTabBtn} ${activeTab === band.id ? styles.gradeTabActive : ""}`}
              >
                {band.label}
              </button>
            ))}
          </div>

          {/* Active Band Details & Subject Cards */}
          <div className={styles.stageCard}>
            <div className={styles.stageHeader}>
              <div>
                <h3 className={styles.stageHeading}>{currentBand.headline}</h3>
                <p className={styles.stageDesc}>{currentBand.description}</p>
              </div>
              <Link href="/find" className={styles.stageBrowseBtn}>
                <span>Browse All Tutors</span>
                <ArrowRight size={15} />
              </Link>
            </div>

            <div className={styles.subjectsGrid}>
              {currentBand.subjects.map((subj) => {
                const IconComp = subj.icon;
                return (
                  <Link key={subj.name} href={subj.href} className={styles.subjectCard}>
                    <div className={styles.subjectIconWrap}>
                      <IconComp size={20} />
                    </div>
                    <div className={styles.subjectInfo}>
                      <span className={styles.subjectGradeTag}>{subj.grade}</span>
                      <h4 className={styles.subjectName}>{subj.name}</h4>
                    </div>
                    <ArrowRight size={16} className={styles.subjectArrow} />
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. THREE COMMUNITY PATHWAYS ── */}
      <section className={styles.pathwaysSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionTag}>Who It&apos;s For</span>
            <h2 className={styles.sectionTitle}>Designed for every member of the family</h2>
          </div>

          <div className={styles.pathwaysGrid}>
            <div className={styles.pathwayCard}>
              <div className={styles.pathwayPill}>FOR STUDENTS</div>
              <h3 className={styles.pathwayHeading}>Get unstuck and gain confidence</h3>
              <p className={styles.pathwayDesc}>
                Ask any question without fear of looking silly. Work through homework step-by-step with a friendly mentor who gets it.
              </p>
              <Link href="/find" className={styles.pathwayAction}>
                <span>Find a Free Tutor</span>
                <ArrowRight size={15} />
              </Link>
            </div>

            <div className={styles.pathwayCard}>
              <div className={styles.pathwayPill}>FOR PARENTS</div>
              <h3 className={styles.pathwayHeading}>Peace of mind and full visibility</h3>
              <p className={styles.pathwayDesc}>
                Manage schedules easily, observe sessions whenever you wish, and give your child access to quality help without expensive agency bills.
              </p>
              <Link href="/parents" className={styles.pathwayAction}>
                <span>Read the Parent Guide</span>
                <ArrowRight size={15} />
              </Link>
            </div>

            <div className={styles.pathwayCard}>
              <div className={styles.pathwayPill}>FOR VOLUNTEER TUTORS</div>
              <h3 className={styles.pathwayHeading}>Make an impact and earn service credit</h3>
              <p className={styles.pathwayDesc}>
                Inspire younger learners, sharpen your own subject mastery, and earn certified volunteer service transcripts for college applications.
              </p>
              <Link href="/signup?role=tutor" className={styles.pathwayAction}>
                <span>Apply to Tutor</span>
                <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. TESTIMONIALS ── */}
      <section className={styles.reviewsSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionTag}>Community Impact</span>
            <h2 className={styles.sectionTitle}>Loved by learners, parents, and tutors</h2>
          </div>

          <div className={styles.reviewsGrid}>
            {REVIEWS.map((rev) => (
              <div key={rev.author} className={styles.reviewCard}>
                <div className={styles.starsRow}>
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={15} fill="#F59E0B" color="#F59E0B" />
                  ))}
                </div>
                <p className={styles.reviewQuote}>&ldquo;{rev.quote}&rdquo;</p>
                <div className={styles.reviewAuthor}>
                  <div className={styles.authorAvatar}>
                    {rev.author.charAt(0)}
                  </div>
                  <div>
                    <h4 className={styles.authorName}>{rev.author}</h4>
                    <p className={styles.authorRole}>{rev.role} • {rev.subject}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6. FREQUENTLY ASKED QUESTIONS ── */}
      <section className={styles.faqSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionTag}>Common Questions</span>
            <h2 className={styles.sectionTitle}>Frequently Asked Questions</h2>
            <p className={styles.sectionSubtitle}>
              Everything you need to know about our free volunteer tutoring platform.
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
                    <span className={styles.faqQuestionText}>{faq.q}</span>
                    <ChevronDown
                      size={18}
                      className={`${styles.faqChevron} ${isOpen ? styles.faqChevronOpen : ""}`}
                    />
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

      {/* ── 7. FINAL CALL TO ACTION BANNER ── */}
      <section className={styles.ctaBannerSection}>
        <div className={styles.container}>
          <div className={styles.ctaBannerCard}>
            <h2 className={styles.ctaBannerTitle}>Ready to start learning for free?</h2>
            <p className={styles.ctaBannerSubtitle}>
              Book your first 1-on-1 session today or volunteer to mentor younger peers in your community.
            </p>
            <div className={styles.ctaBannerActions}>
              <Link href="/find" className={styles.ctaBannerPrimaryBtn}>
                <span>Find a Free Tutor</span>
                <ArrowRight size={17} />
              </Link>
              <Link href="/signup?role=tutor" className={styles.ctaBannerSecondaryBtn}>
                <GraduationCap size={18} />
                <span>Sign Up as a Tutor</span>
              </Link>
            </div>
            <div className={styles.ctaBannerTrust}>
              <span>✓ No credit card needed</span>
              <span className={styles.trustDivider}>•</span>
              <span>✓ Verified Zoom security</span>
              <span className={styles.trustDivider}>•</span>
              <span>✓ 100% Volunteer powered</span>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
