"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck,
  Award,
  Lock,
  GraduationCap,
  ChevronDown,
  CheckCircle2,
  Calendar,
  Users,
  Search,
  BookOpen,
  Clock,
  Video,
} from "lucide-react";
import styles from "./page.module.css";

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
}

const DISCIPLINES = [
  {
    id: "all",
    label: "All Disciplines",
    subjects: [
      {
        name: "Algebra & Analytical Geometry",
        grade: "Grades 7-10",
        summary:
          "Linear systems, quadratics, and coordinate proofs with patient mentors.",
        href: "/find?subject=Mathematics",
        image: "/images/new_mascots/mascot-1.jpeg",
      },
      {
        name: "PEEL Essay Writing & Rhetoric",
        grade: "Grades 4-10",
        summary:
          "Point-Evidence-Explanation structured writing and analytical arguments.",
        href: "/find?subject=Writing",
        image: "/images/new_mascots/mascot-2.jpeg",
      },
      {
        name: "Foundational Biology & Chemistry",
        grade: "Grades 6-10",
        summary:
          "Cellular biology, genetics, periodic trends, and core science models.",
        href: "/find?subject=Science",
        image: "/images/new_mascots/mascot-3.jpeg",
      },
      {
        name: "Elementary Fractions & Reasoning",
        grade: "Grades 3-5",
        summary:
          "Visual fractions, multi-digit operations, and intuitive word problems.",
        href: "/find?subject=Mathematics",
        image: "/images/new_mascots/mascot-4.jpeg",
      },
      {
        name: "Guided Reading & Phonics Discovery",
        grade: "Grades K-2",
        summary:
          "Phonemic awareness, vocabulary decoding, and confidence-building stories.",
        href: "/find?subject=Reading",
        image: "/images/new_mascots/mascot-5.jpeg",
      },
      {
        name: "World Geography, Civics & History",
        grade: "Grades 4-9",
        summary:
          "Primary source evaluation, global maps, and world cultural heritage.",
        href: "/find?subject=Social+Studies",
        image: "/images/new_mascots/mascot-6.jpeg",
      },
      {
        name: "Standardized Testing & AP",
        grade: "Grades 9-12",
        summary:
          "Targeted prep for SAT, ACT, TOEFL, IELTS, and AP course exams.",
        href: "/find?subject=Standardized+Testing",
        image: "/images/new_mascots/mascot-7.jpeg",
      },
    ],
  },
  {
    id: "stem",
    label: "Exact Sciences & Mathematics",
    subjects: [
      {
        name: "Pre-Algebra & Linear Systems",
        grade: "Grades 6-8",
        summary:
          "Variable equations, integer operations, and coordinate graphing intuition.",
        href: "/find?grade=6-8&subject=Mathematics",
        image: "/images/new_mascots/mascot-8.jpeg",
      },
      {
        name: "Algebra I, II & Geometry",
        grade: "Grades 8-10",
        summary:
          "Factoring polynomials, geometric proofs, and trigonometry fundamentals.",
        href: "/find?grade=9-10&subject=Mathematics",
        image: "/images/new_mascots/mascot-9.jpeg",
      },
      {
        name: "Cellular Biology & Ecology",
        grade: "Grades 7-10",
        summary:
          "DNA structure, ecosystems, organisms, and hands-on scientific inquiry.",
        href: "/find?subject=Science",
        image: "/images/new_mascots/mascot-10.jpeg",
      },
      {
        name: "Introductory Chemistry",
        grade: "Grades 9-10",
        summary:
          "Atomic models, balanced reactions, solution chemistry, and lab logic.",
        href: "/find?grade=9-10&subject=Science",
        image: "/images/new_mascots/mascot-11.jpeg",
      },
    ],
  },
  {
    id: "humanities",
    label: "Literary Arts & Composition",
    subjects: [
      {
        name: "Analytical PEEL Essay Writing",
        grade: "Grades 5-10",
        summary:
          "Persuasive essays, thesis integration, and clear argument structures.",
        href: "/find?subject=Writing",
        image: "/images/new_mascots/mascot-12.jpeg",
      },
      {
        name: "Reading Comprehension & Critical Thought",
        grade: "Grades 3-8",
        summary:
          "Theme identification, author perspective, and contextual inference.",
        href: "/find?subject=Reading",
        image: "/images/new_mascots/mascot-13.jpeg",
      },
      {
        name: "Grammar, Syntax & Sentence Craft",
        grade: "Grades 3-7",
        summary:
          "Punctuation mastery, active voice, and rich sentence structure skills.",
        href: "/find?subject=Writing",
        image: "/images/new_mascots/mascot-14.jpeg",
      },
      {
        name: "Civics, Government & History",
        grade: "Grades 6-9",
        summary:
          "Constitutional principles, historical milestones, and document analysis.",
        href: "/find?subject=Social+Studies",
        image: "/images/new_mascots/mascot-15.jpeg",
      },
    ],
  },
  {
    id: "primary",
    label: "Foundations & Literacy (K-3)",
    subjects: [
      {
        name: "Phonics & Word Sound Decoding",
        grade: "Kindergarten - Grade 2",
        summary:
          "Letter blends, sight word fluency, and interactive reading exercises.",
        href: "/find?grade=K-2&subject=Reading",
        image: "/images/new_mascots/mascot-16.jpeg",
      },
      {
        name: "Number Sense & Counting Fluency",
        grade: "Kindergarten - Grade 2",
        summary:
          "Visual ten-frames, addition/subtraction intuition, and spatial patterns.",
        href: "/find?grade=K-2&subject=Mathematics",
        image: "/images/new_mascots/mascot-17.jpeg",
      },
      {
        name: "Guided Narrative Comprehension",
        grade: "Grades 1-3",
        summary:
          "Story retellings, character exploration, and expressive speaking.",
        href: "/find?grade=K-2&subject=Reading",
        image: "/images/new_mascots/mascot-18.jpeg",
      },
    ],
  },
  {
    id: "standardized-testing",
    label: "Standardized Testing",
    subjects: [
      {
        name: "SAT & ACT Prep",
        grade: "Grades 9-12",
        summary:
          "Math, Reading, and Writing problem strategies and timing mastery.",
        href: "/find?subject=Standardized+Testing",
        image: "/images/new_mascots/mascot-19.jpeg",
      },
      {
        name: "TOEFL & IELTS Prep",
        grade: "Grades 9-12",
        summary:
          "English language proficiency tasks, speaking drills, and test tactics.",
        href: "/find?subject=Standardized+Testing",
        image: "/images/new_mascots/mascot-20.jpeg",
      },
      {
        name: "AP Course Support",
        grade: "Grades 9-12",
        summary:
          "Advanced Placement coursework guidance, practice DBQs, and review.",
        href: "/find?subject=Standardized+Testing",
        image: "/images/new_mascots/mascot-1.jpeg",
      },
    ],
  },
];


const HOW_IT_WORKS_STEPS = [
  {
    step: 1,
    title: "Select Subject and Grade",
    desc: "Choose from our core K-10 curriculum across Mathematics, Reading Comprehension, PEEL Essay Writing, and Foundational Science.",
  },
  {
    step: 2,
    title: "Book a Supervised Zoom Slot",
    desc: "Schedule a convenient 45-minute lesson. Automated calendar invites and private Zoom credentials are sent directly to the parent.",
  },
  {
    step: 3,
    title: "Meet Your Volunteer Mentor",
    desc: "Connect 1-on-1 with an accomplished high school or college scholar. Parents are always welcome to observe and participate.",
  },
];

const SAFEGUARD_PILLARS = [
  {
    id: "zoom-security",
    badge: "Session Security",
    title: "Dual-Gate Supervised Zoom Protocol",
    desc: "Every session occurs in an isolated, private Zoom room with waiting room verification and passcode protection. Public links are strictly prohibited.",
  },
  {
    id: "parental-rights",
    badge: "Open Observation",
    title: "Full Parental Supervision Guarantee",
    desc: "Parents and guardians hold absolute rights to sit in, listen, and observe any session. Automated meeting confirmations and attendance receipts are sent immediately.",
  },
  {
    id: "vetting",
    badge: "Mentor Standards",
    title: "Comprehensive 5-Stage Mentor Vetting",
    desc: "High school mentors must submit academic records, undergo identity checks, and complete mandatory Child Protection and Safeguarding certification.",
  },
  {
    id: "audit-trail",
    badge: "Verified Attendance",
    title: "Tamper-Evident Volunteer Records",
    desc: "Both tutor and learner dual-confirm completion. Attendance generates verified PDF transcripts equipped with cryptographic audit identifiers for school advisors.",
  },
  {
    id: "privacy",
    badge: "Direct Safeguards",
    title: "Zero-Retention and Contact Privacy",
    desc: "Strict platform-only communication rules prohibit tutors from requesting or exchanging private phone numbers, social media, or off-platform addresses.",
  },
];

const FAQS = [
  {
    q: "Is Learnivia genuinely free for all families?",
    a: "Yes. Learnivia is an independent non-profit academic initiative. We require no payment method, charge zero subscriptions, and guarantee 100% free access for all Kindergarten through Grade 10 students.",
  },
  {
    q: "How are volunteer student tutors qualified to teach?",
    a: "Our peer mentors are high-achieving secondary and university students with demonstrated mastery in their chosen subjects. Each applicant completes 5 mandatory safeguarding modules, passes knowledge reviews, and signs the Mentor Integrity Charter.",
  },
  {
    q: "What measures protect my child during online tutoring?",
    a: "All sessions are conducted in private Zoom rooms with waiting room security. Tutors cannot contact learners outside the platform, parents are always welcome to attend, and our admin team continuously audits session compliance.",
  },
  {
    q: "How do student tutors receive certified volunteer service hours?",
    a: "When a session concludes, the learner confirms attendance. Our system logs the verified time and issues official, verifiable transcripts recognized by National Honor Society, IB CAS programs, and college admissions boards.",
  },
];

export default function HomeInteractiveClient({
  liveSession,
}: HomeInteractiveClientProps) {
  const [activeTab, setActiveTab] = useState("all");
  const [openFaq, setOpenFaq] = useState<number | null>(0);


  // Concierge Form State
  const [selectedGrade, setSelectedGrade] = useState("all");
  const [selectedSubject, setSelectedSubject] = useState("all");

  const currentDiscipline =
    DISCIPLINES.find((d) => d.id === activeTab) || DISCIPLINES[0];

  const handleConciergeSearch = () => {
    const params = new URLSearchParams();
    if (selectedGrade !== "all") params.set("grade", selectedGrade);
    if (selectedSubject !== "all") params.set("subject", selectedSubject);
    return `/find${params.toString() ? `?${params.toString()}` : ""}`;
  };

  return (
    <div className={styles.pageWrapper}>
      <section
        style={{
          background: "radial-gradient(ellipse at top, #1e293b, #020617)",
          color: "#fff",
          padding: "6rem 2rem 5rem",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Floating Mascot Avatars in Background */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            overflow: "hidden",
            zIndex: 1,
            pointerEvents: "none",
          }}
        >
          {[
            // Left Edge Foxes
            { src: "/images/new_mascots/mascot-1.jpeg", top: "10%", left: "3%", delay: 0 },
            { src: "/images/new_mascots/mascot-2.jpeg", top: "25%", left: "8%", delay: 1.5 },
            { src: "/images/new_mascots/mascot-3.jpeg", top: "45%", left: "2%", delay: 0.8 },
            { src: "/images/new_mascots/mascot-7.jpeg", top: "65%", left: "10%", delay: 2.8 },
            { src: "/images/new_mascots/mascot-8.jpeg", top: "85%", left: "4%", delay: 0.3 },
            { src: "/images/new_mascots/mascot-11.jpeg", top: "15%", left: "-2%", delay: 1.1 },
            { src: "/images/new_mascots/mascot-1.jpeg", top: "35%", left: "-5%", delay: 2.0 },
            { src: "/images/new_mascots/mascot-2.jpeg", top: "55%", left: "8%", delay: 0.6 },
            { src: "/images/new_mascots/mascot-3.jpeg", top: "75%", left: "-1%", delay: 1.4 },
            { src: "/images/new_mascots/mascot-7.jpeg", top: "90%", left: "10%", delay: 2.3 },
            // Right Edge Foxes
            { src: "/images/new_mascots/mascot-4.jpeg", top: "12%", right: "3%", delay: 2.2 },
            { src: "/images/new_mascots/mascot-5.jpeg", top: "28%", right: "8%", delay: 0.5 },
            { src: "/images/new_mascots/mascot-6.jpeg", top: "48%", right: "2%", delay: 1.2 },
            { src: "/images/new_mascots/mascot-9.jpeg", top: "68%", right: "10%", delay: 1.8 },
            { src: "/images/new_mascots/mascot-10.jpeg", top: "82%", right: "4%", delay: 0.9 },
            { src: "/images/new_mascots/mascot-12.jpeg", top: "18%", right: "-2%", delay: 2.5 },
            { src: "/images/new_mascots/mascot-4.jpeg", top: "38%", right: "-5%", delay: 1.0 },
            { src: "/images/new_mascots/mascot-5.jpeg", top: "58%", right: "8%", delay: 0.4 },
            { src: "/images/new_mascots/mascot-6.jpeg", top: "78%", right: "-1%", delay: 2.1 },
            { src: "/images/new_mascots/mascot-9.jpeg", top: "92%", right: "10%", delay: 1.3 },
          ].map((avatar: any, idx) => (
            <motion.img
              className={styles.floatingMascot}
              key={idx}
              src={avatar.src}
              alt="Mascot Avatar"
              drag
              dragConstraints={{ left: -50, right: 50, top: -50, bottom: 50 }}
              whileDrag={{ scale: 1.2, cursor: "grabbing" }}
              whileHover={{ cursor: "grab" }}
              style={{
                position: "absolute",
                top: avatar.top,
                left: avatar.left,
                right: avatar.right,
                bottom: avatar.bottom,
                width: "75px",
                height: "75px",
                borderRadius: "50%",
                objectFit: "cover",
                border: "3px solid rgba(255,255,255,0.15)",
                boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
                pointerEvents: "auto",
                zIndex: 1,
              }}
              animate={{ y: [0, -15, 0], scale: [1, 1.05, 1] }}
              transition={{
                duration: 6 + (idx % 3),
                repeat: Infinity,
                ease: "easeInOut",
                delay: avatar.delay,
              }}
            />
          ))}
        </div>

        <div
          style={{
            position: "relative",
            zIndex: 10,
            maxWidth: 900,
            margin: "0 auto",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            gap: "2.5rem",
          }}
        >
          {/* Technical Blueprint Precision Tag (OreoAI inspired) */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.6rem",
              padding: "0.4rem 1rem",
              borderRadius: "9999px",
              background: "rgba(27, 77, 62, 0.3)",
              border: "1px solid rgba(52, 211, 153, 0.4)",
              boxShadow: "0 0 25px rgba(27, 77, 62, 0.35)",
              backdropFilter: "blur(8px)",
              marginBottom: "-1.25rem",
            }}
          >
            <span
              style={{
                width: "7px",
                height: "7px",
                borderRadius: "50%",
                background: "#34D399",
                boxShadow: "0 0 8px #34D399",
                display: "inline-block",
              }}
            />
            <span
              style={{
                fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
                fontSize: "0.75rem",
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "#EAF2EE",
              }}
            >
              [ 100% VOLUNTEER PEER NETWORK • VERIFIED K-10 MENTORSHIP ]
            </span>
          </motion.div>

          {/* Centered Headline */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <h1
              style={{
                fontSize: "clamp(3.5rem, 7vw, 5.5rem)",
                fontWeight: 800,
                lineHeight: 1.05,
                letterSpacing: "-0.03em",
                margin: "0 0 1rem",
                color: "#FFFFFF",
                fontFamily: "var(--font-sans, system-ui, sans-serif)",
              }}
            >
              Free Online Tutoring.
              <br />
              <span
                style={{
                  opacity: 0.9,
                  fontWeight: 500,
                  fontSize: "clamp(2.5rem, 5vw, 4rem)",
                }}
              >
                Real Human Connection.
              </span>
            </h1>
          </motion.div>

          {/* Centered CTA Box Area */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
            style={{
              maxWidth: 600,
              width: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <p
              style={{
                fontSize: "1.25rem",
                lineHeight: 1.6,
                color: "rgba(255,255,255,0.85)",
                margin: "0 0 2.5rem",
              }}
            >
              Join our peer-led community for free 1-on-1 tutoring, homework
              help, and meaningful conversations with students across the globe.
            </p>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
                width: "100%",
                maxWidth: 400,
              }}
            >
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.96 }}>
                <Link
                  href="/signin"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "100%",
                    padding: "1.1rem",
                    background: "var(--primary, #1B4D3E)",
                    color: "#fff",
                    borderRadius: "9999px",
                    fontWeight: 700,
                    fontSize: "1.15rem",
                    textDecoration: "none",
                    boxShadow: "0 4px 14px rgba(27, 77, 62, 0.4)",
                    transition: "all 150ms",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "#0F2F26")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "#1B4D3E")
                  }
                >
                  Start Learning!
                </Link>
              </motion.div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "1rem",
                }}
              >
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.96 }}>
                  <Link
                    href="/about"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: "0.875rem",
                      border: "2px solid rgba(255,255,255,0.8)",
                      color: "#fff",
                      borderRadius: "9999px",
                      fontWeight: 600,
                      fontSize: "0.95rem",
                      textDecoration: "none",
                      transition: "all 150ms",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "rgba(255,255,255,0.1)";
                      e.currentTarget.style.borderColor = "#fff";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "transparent";
                      e.currentTarget.style.borderColor = "rgba(255,255,255,0.8)";
                    }}
                  >
                    For Parents
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.96 }}>
                  <Link
                    href="/signin?role=tutor"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: "0.875rem",
                      border: "2px solid rgba(255,255,255,0.8)",
                      color: "#fff",
                      borderRadius: "9999px",
                      fontWeight: 600,
                      fontSize: "0.95rem",
                      textDecoration: "none",
                      transition: "all 150ms",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "rgba(255,255,255,0.1)";
                      e.currentTarget.style.borderColor = "#fff";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "transparent";
                      e.currentTarget.style.borderColor = "rgba(255,255,255,0.8)";
                    }}
                  >
                    For Educators
                  </Link>
                </motion.div>
              </div>

              {/* Technical Accuracy Coordinates Bar (OreoAI-inspired) */}
              <div
                style={{
                  marginTop: "1.75rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexWrap: "wrap",
                  gap: "0.85rem",
                  fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
                  fontSize: "0.72rem",
                  letterSpacing: "0.04em",
                  color: "rgba(255, 255, 255, 0.65)",
                  textTransform: "uppercase",
                }}
              >
                <span>[ 0.00 USD ACCESS FEE ]</span>
                <span style={{ opacity: 0.3 }}>•</span>
                <span>[ 5-STAGE VETTING ]</span>
                <span style={{ opacity: 0.3 }}>•</span>
                <span>[ PVSA RECOGNIZED ]</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Media Query for mobile responsivenes */}
        <style>{`
          @media (max-width: 900px) {
            section[style*="--navy"] > div:nth-of-type(5) {
              grid-template-columns: 1fr !important;
              gap: 2rem !important;
            }
          }
        `}</style>
      </section>

      <section className={styles.howItWorksSection} id="how-it-works">
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionBadge}>Workflow</span>
            <h2 className={styles.sectionTitle}>
              How 1-on-1 peer tutoring works for families
            </h2>
            <p className={styles.sectionLead}>
              Getting started is straightforward, safe, and transparent. We
              never ask for payment details or credit cards.
            </p>
          </div>

          <div className={styles.howItWorksGrid}>
            {HOW_IT_WORKS_STEPS.map((step, idx) => (
              <div key={step.step} className={`${styles.stepCard} card-blueprint`}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
                  <div className={styles.stepNumber}>{step.step}</div>
                  <span className="tag-blueprint" style={{ fontSize: "0.68rem" }}>
                    [ STEP 0{idx + 1} ]
                  </span>
                </div>
                <h3 className={styles.stepTitle}>{step.title}</h3>
                <p className={styles.stepText}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.curriculumSection} id="curriculum">
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionBadge}>Curriculum</span>
            <h2 className={styles.sectionTitle}>
              Rigorous disciplines. Patient peer guidance.
            </h2>
            <p className={styles.sectionLead}>
              Every lesson is structured around fundamental reasoning rather
              than rote memorization. Explore our core curriculum for
              Kindergarten through Grade 10.
            </p>
          </div>

          {/* Discipline Navigation Tabs */}
          <div className={styles.disciplineTabs} role="tablist">
            {DISCIPLINES.map((d) => (
              <button
                key={d.id}
                role="tab"
                aria-selected={activeTab === d.id}
                className={`${styles.tabBtn} ${activeTab === d.id ? styles.tabBtnActive : ""}`}
                onClick={() => setActiveTab(d.id)}
              >
                {d.label}
              </button>
            ))}
          </div>

          {/* Subject Cards Grid */}
          <div className={styles.syllabusGrid}>
            {currentDiscipline.subjects.map((sub: any, idx) => (
              <Link
                key={sub.name}
                href={sub.href}
                className={`${styles.subjectCard} card-blueprint`}
              >
                <div className={styles.subjectCardTop}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "0.85rem",
                    }}
                  >
                    <span className={styles.gradeTag}>{sub.grade}</span>
                    <span
                      className="tag-blueprint"
                      style={{ fontSize: "0.65rem", padding: "0.15rem 0.4rem" }}
                    >
                      [ MOD-0{idx + 1} ]
                    </span>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      gap: "0.9rem",
                      alignItems: "center",
                      marginBottom: "0.75rem",
                    }}
                  >
                    {sub.image && (
                      <div
                        style={{
                          width: "56px",
                          height: "56px",
                          borderRadius: "14px",
                          overflow: "hidden",
                          flexShrink: 0,
                          border: "1px solid rgba(0, 0, 0, 0.08)",
                          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.06)",
                          background: "#ffffff",
                        }}
                      >
                        <Image
                          src={sub.image}
                          alt={sub.name}
                          width={56}
                          height={56}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      </div>
                    )}
                    <h3 className={styles.subjectName} style={{ margin: 0 }}>
                      {sub.name}
                    </h3>
                  </div>

                  <p className={styles.subjectSummary}>{sub.summary}</p>
                </div>
                <div className={styles.subjectCardBottom}>
                  <span>Find a Mentor</span>
                  <span style={{ fontFamily: "monospace", fontSize: "0.85rem" }}>
                    →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>




      <section className={styles.safeguardSection} id="safety">
        <div className={styles.container}>
          <div className={styles.safeguardGrid}>
            <div>
              <span className={styles.sectionBadge}>Safeguarding Protocol</span>
              <h2 className={styles.sectionTitle}>
                Built from the ground up for student protection
              </h2>
              <p className={styles.sectionLead}>
                Learnivia operates under a strict Child Protection Charter
                designed to safeguard young learners and protect volunteer
                tutors.
              </p>
              <div style={{ marginTop: "2rem" }}>
                <Link href="/parents" className={styles.btnPrimary}>
                  <span>Read Guardian Guidelines</span>
                </Link>
              </div>
            </div>

            <div className={styles.safeguardDiagram}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "1.5rem",
                  position: "relative",
                }}
              >
                {/* Vertical connecting line */}
                <div
                  style={{
                    position: "absolute",
                    left: "24px",
                    top: "24px",
                    bottom: "24px",
                    width: "2px",
                    background: "var(--wa-border-strong)",
                    zIndex: 0,
                  }}
                />

                {SAFEGUARD_PILLARS.map((pt, idx) => (
                  <motion.div
                    key={pt.id}
                    className={styles.safeguardCard}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.5, delay: idx * 0.15 }}
                    style={{
                      position: "relative",
                      zIndex: 1,
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "1rem",
                      background: "var(--wa-white)",
                      border: "1px solid var(--wa-border)",
                      padding: "1.5rem",
                      borderRadius: "var(--wa-radius-md)",
                      boxShadow: "var(--wa-shadow-sm)",
                    }}
                  >
                    <div
                      style={{
                        width: "48px",
                        height: "48px",
                        borderRadius: "50%",
                        background: "var(--wa-crimson-light)",
                        color: "var(--wa-crimson)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        border: "2px solid var(--wa-white)",
                        boxShadow: "0 0 0 1px var(--wa-border)",
                      }}
                    >
                      <ShieldCheck size={20} />
                    </div>
                    <div>
                      <span
                        className={styles.safeguardBadge}
                        style={{
                          display: "inline-block",
                          fontSize: "0.7rem",
                          fontWeight: 700,
                          textTransform: "uppercase",
                          color: "var(--wa-muted)",
                          marginBottom: "0.25rem",
                          letterSpacing: "0.05em",
                        }}
                      >
                        {pt.badge}
                      </span>
                      <h3
                        className={styles.safeguardTitle}
                        style={{
                          margin: "0 0 0.5rem 0",
                          fontSize: "1.1rem",
                          color: "var(--wa-ink)",
                        }}
                      >
                        {pt.title}
                      </h3>
                      <p
                        className={styles.safeguardText}
                        style={{
                          margin: 0,
                          fontSize: "0.9rem",
                          color: "var(--wa-text)",
                          lineHeight: 1.5,
                        }}
                      >
                        {pt.desc}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.faqSection} id="faq">
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionBadge}>Common Questions</span>
            <h2 className={styles.sectionTitle}>Frequently Asked Questions</h2>
            <p className={styles.sectionLead}>
              Transparent answers regarding our zero-cost model, session
              supervision, and volunteer accreditation.
            </p>
          </div>

          <div className={styles.faqList}>
            {FAQS.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div key={idx} className={styles.faqItem}>
                  <button
                    type="button"
                    className={styles.faqQuestion}
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    aria-expanded={isOpen}
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      size={18}
                      style={{
                        transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                        transition: "transform 200ms ease",
                        color: "var(--wa-muted)",
                      }}
                    />
                  </button>
                  {isOpen && <div className={styles.faqAnswer}>{faq.a}</div>}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className={styles.admissionsSection}>
        <div className={styles.container}>
          <div className={styles.admissionsCard}>
            <h2 className={styles.admissionsTitle}>
              Quality education should be accessible to every student.
            </h2>
            <p className={styles.admissionsText}>
              Whether you are a parent seeking patient academic mentorship for
              your student, or a high school scholar looking to earn verified
              community service hours, our doors are open.
            </p>

            <div className={styles.admissionsActions}>
              <Link href="/find" className={styles.btnPrimary}>
                <span>Enroll a Learner for Free</span>
              </Link>
              <Link href="/apply" className={styles.btnSecondary}>
                <GraduationCap size={17} />
                <span>Apply as a Volunteer Tutor</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
