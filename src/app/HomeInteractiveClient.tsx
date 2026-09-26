"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
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
          "Linear equations, quadratics, Cartesian geometry, and multi-step proofs.",
        href: "/find?subject=Mathematics",
      },
      {
        name: "PEEL Essay Writing & Rhetoric",
        grade: "Grades 4-10",
        summary:
          "Structured point-evidence-explanation-link arguments and textual analysis.",
        href: "/find?subject=Writing",
      },
      {
        name: "Foundational Biology & Chemistry",
        grade: "Grades 6-10",
        summary:
          "Cellular respiration, Mendelian genetics, stoichiometry, and periodic trends.",
        href: "/find?subject=Science",
      },
      {
        name: "Elementary Fractions & Reasoning",
        grade: "Grades 3-5",
        summary:
          "Visual fractions, word problem modeling, multi-digit operations, and fluency.",
        href: "/find?subject=Mathematics",
      },
      {
        name: "Guided Reading & Phonics Discovery",
        grade: "Grades K-2",
        summary:
          "Early phonemic awareness, vocabulary decoding, and supported story narration.",
        href: "/find?subject=Reading",
      },
      {
        name: "World Geography, Civics & History",
        grade: "Grades 4-9",
        summary:
          "Primary source evaluation, democratic systems, map analysis, and global cultures.",
        href: "/find?subject=Social+Studies",
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
          "Variable equations, integer rules, graphing coordinates, and rate ratios.",
        href: "/find?grade=6-8&subject=Mathematics",
      },
      {
        name: "Algebra I, II & Geometry",
        grade: "Grades 8-10",
        summary:
          "Polynomial factoring, geometric congruence, functions, and trigonometry basics.",
        href: "/find?grade=9-10&subject=Mathematics",
      },
      {
        name: "Cellular Biology & Ecology",
        grade: "Grades 7-10",
        summary:
          "Mitosis, DNA structure, ecosystem energy pyramids, and scientific hypothesis testing.",
        href: "/find?subject=Science",
      },
      {
        name: "Introductory Chemistry",
        grade: "Grades 9-10",
        summary:
          "Chemical nomenclature, atomic orbitals, balanced reactions, and solution molarity.",
        href: "/find?grade=9-10&subject=Science",
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
          "Developing clear thesis statements, integrating quotations, and persuasive rhetoric.",
        href: "/find?subject=Writing",
      },
      {
        name: "Reading Comprehension & Critical Thought",
        grade: "Grades 3-8",
        summary:
          "Theme identification, inferencing, author perspective, and vocabulary in context.",
        href: "/find?subject=Reading",
      },
      {
        name: "Grammar, Syntax & Sentence Craft",
        grade: "Grades 3-7",
        summary:
          "Parts of speech, comma rules, clause structures, and active voice precision.",
        href: "/find?subject=Writing",
      },
      {
        name: "Civics, Government & History",
        grade: "Grades 6-9",
        summary:
          "Constitutional principles, historical turning points, and document-based questions.",
        href: "/find?subject=Social+Studies",
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
          "Letter-sound blending, sight word fluency, and interactive reading games.",
        href: "/find?grade=K-2&subject=Reading",
      },
      {
        name: "Number Sense & Counting Fluency",
        grade: "Kindergarten - Grade 2",
        summary:
          "Visual ten-frames, addition/subtraction intuition, shapes, and patterns.",
        href: "/find?grade=K-2&subject=Mathematics",
      },
      {
        name: "Guided Narrative Comprehension",
        grade: "Grades 1-3",
        summary:
          "Story retelling, character exploration, and expressing ideas in simple sentences.",
        href: "/find?grade=K-2&subject=Reading",
      },
    ],
  },
];

const TUTOR_ROSTER = [
  {
    name: "Aiden Chen",
    school: "Stuyvesant High School",
    avatar: "AC",
    subjects: ["AP Calculus BC", "Physics", "Algebra I"],
    role: "Verified Volunteer Tutor",
  },
  {
    name: "Maya Patel",
    school: "Bronx High School of Science",
    avatar: "MP",
    subjects: ["AP Biology", "PEEL Writing", "Middle School Science"],
    role: "Verified Volunteer Tutor",
  },
  {
    name: "Julian Rivera",
    school: "Thomas Jefferson High School",
    avatar: "JR",
    subjects: ["Geometry", "Pre-Algebra", "Spanish"],
    role: "Verified Volunteer Tutor",
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

  // Carousel State
  const [currentTutorSlide, setCurrentTutorSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Auto-play carousel
  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(() => {
      setCurrentTutorSlide((prev) => (prev + 1) % TUTOR_ROSTER.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [isHovered]);

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
            { src: "/images/new_mascots/mascot-2.jpeg", top: "25%", left: "12%", delay: 1.5 },
            { src: "/images/new_mascots/mascot-3.jpeg", top: "45%", left: "5%", delay: 0.8 },
            { src: "/images/new_mascots/mascot-7.jpeg", top: "65%", left: "14%", delay: 2.8 },
            { src: "/images/new_mascots/mascot-8.jpeg", top: "85%", left: "4%", delay: 0.3 },
            { src: "/images/new_mascots/mascot-11.jpeg", top: "15%", left: "18%", delay: 1.1 },
            { src: "/images/new_mascots/mascot-1.jpeg", top: "35%", left: "2%", delay: 2.0 },
            { src: "/images/new_mascots/mascot-2.jpeg", top: "55%", left: "16%", delay: 0.6 },
            { src: "/images/new_mascots/mascot-3.jpeg", top: "75%", left: "8%", delay: 1.4 },
            { src: "/images/new_mascots/mascot-7.jpeg", top: "90%", left: "15%", delay: 2.3 },
            // Right Edge Foxes
            { src: "/images/new_mascots/mascot-4.jpeg", top: "12%", right: "8%", delay: 2.2 },
            { src: "/images/new_mascots/mascot-5.jpeg", top: "28%", right: "18%", delay: 0.5 },
            { src: "/images/new_mascots/mascot-6.jpeg", top: "48%", right: "4%", delay: 1.2 },
            { src: "/images/new_mascots/mascot-9.jpeg", top: "68%", right: "14%", delay: 1.8 },
            { src: "/images/new_mascots/mascot-10.jpeg", top: "82%", right: "6%", delay: 0.9 },
            { src: "/images/new_mascots/mascot-12.jpeg", top: "18%", right: "3%", delay: 2.5 },
            { src: "/images/new_mascots/mascot-4.jpeg", top: "38%", right: "12%", delay: 1.0 },
            { src: "/images/new_mascots/mascot-5.jpeg", top: "58%", right: "19%", delay: 0.4 },
            { src: "/images/new_mascots/mascot-6.jpeg", top: "78%", right: "2%", delay: 2.1 },
            { src: "/images/new_mascots/mascot-9.jpeg", top: "92%", right: "16%", delay: 1.3 },
          ].map((avatar, idx) => (
            <motion.img
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
                    background: "var(--primary, #0D9488)",
                    color: "#fff",
                    borderRadius: "9999px",
                    fontWeight: 700,
                    fontSize: "1.15rem",
                    textDecoration: "none",
                    transition: "background 150ms",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "#0F766E")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "#0D9488")
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
            {HOW_IT_WORKS_STEPS.map((step) => (
              <div key={step.step} className={styles.stepCard}>
                <div className={styles.stepNumber}>{step.step}</div>
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
            {currentDiscipline.subjects.map((sub) => (
              <Link
                key={sub.name}
                href={sub.href}
                className={styles.subjectCard}
              >
                <div className={styles.subjectCardTop}>
                  <span className={styles.gradeTag}>{sub.grade}</span>
                  <h3 className={styles.subjectName}>{sub.name}</h3>
                  <p className={styles.subjectSummary}>{sub.summary}</p>
                </div>
                <div className={styles.subjectCardBottom}>
                  <span>Find a Mentor</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.registrySection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionBadge}>Scholars</span>
            <h2 className={styles.sectionTitle}>
              High-achieving scholars giving back
            </h2>
            <p className={styles.sectionLead}>
              Our volunteer tutors represent rigorous secondary schools and
              university programs. Each is verified, safeguarded, and dedicated
              to empowering younger peers.
            </p>
          </div>

          <div
            className={styles.tutorCarouselWrapper}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{
              position: "relative",
              overflow: "hidden",
              display: "flex",
              alignItems: "stretch",
              justifyContent: "center",
            }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentTutorSlide}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.5 }}
                className={styles.tutorCard}
                style={{ width: "100%", maxWidth: "450px", margin: "0 auto" }}
              >
                <div>
                  <div className={styles.tutorCardHeader}>
                    <div className={styles.tutorAvatar}>
                      {TUTOR_ROSTER[currentTutorSlide].avatar}
                    </div>
                    <div className={styles.tutorInfo}>
                      <h3>{TUTOR_ROSTER[currentTutorSlide].name}</h3>
                      <p className={styles.tutorSchool}>
                        {TUTOR_ROSTER[currentTutorSlide].school}
                      </p>
                    </div>
                  </div>

                  <div className={styles.tutorBadges}>
                    {TUTOR_ROSTER[currentTutorSlide].subjects.map((s) => (
                      <span key={s} className={styles.badgePill}>
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div className={styles.tutorCardFooter}>
                  <div className={styles.hoursVerified}>
                    <CheckCircle2 size={14} />
                    <span>{TUTOR_ROSTER[currentTutorSlide].role}</span>
                  </div>
                  <Link href="/find" className={styles.bookTutorBtn}>
                    <span>Schedule</span>
                  </Link>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Carousel Dots */}
            <div
              style={{
                position: "absolute",
                bottom: "-30px",
                left: 0,
                right: 0,
                display: "flex",
                justifyContent: "center",
                gap: "8px",
              }}
            >
              {TUTOR_ROSTER.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentTutorSlide(idx)}
                  style={{
                    width: "10px",
                    height: "10px",
                    borderRadius: "50%",
                    background:
                      currentTutorSlide === idx
                        ? "var(--wa-crimson)"
                        : "var(--wa-border-strong)",
                    border: "none",
                    cursor: "pointer",
                    transition: "background 0.3s",
                  }}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
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
