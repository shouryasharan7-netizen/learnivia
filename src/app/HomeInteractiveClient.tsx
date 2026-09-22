"use client";

import { useState } from "react";
import Link from "next/link";
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
        summary: "Linear equations, quadratics, Cartesian geometry, and multi-step proofs.",
        href: "/find?subject=Mathematics",
      },
      {
        name: "PEEL Essay Writing & Rhetoric",
        grade: "Grades 4-10",
        summary: "Structured point-evidence-explanation-link arguments and textual analysis.",
        href: "/find?subject=Writing",
      },
      {
        name: "Foundational Biology & Chemistry",
        grade: "Grades 6-10",
        summary: "Cellular respiration, Mendelian genetics, stoichiometry, and periodic trends.",
        href: "/find?subject=Science",
      },
      {
        name: "Elementary Fractions & Reasoning",
        grade: "Grades 3-5",
        summary: "Visual fractions, word problem modeling, multi-digit operations, and fluency.",
        href: "/find?subject=Mathematics",
      },
      {
        name: "Guided Reading & Phonics Discovery",
        grade: "Grades K-2",
        summary: "Early phonemic awareness, vocabulary decoding, and supported story narration.",
        href: "/find?subject=Reading",
      },
      {
        name: "World Geography, Civics & History",
        grade: "Grades 4-9",
        summary: "Primary source evaluation, democratic systems, map analysis, and global cultures.",
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
        summary: "Variable equations, integer rules, graphing coordinates, and rate ratios.",
        href: "/find?grade=6-8&subject=Mathematics",
      },
      {
        name: "Algebra I, II & Geometry",
        grade: "Grades 8-10",
        summary: "Polynomial factoring, geometric congruence, functions, and trigonometry basics.",
        href: "/find?grade=9-10&subject=Mathematics",
      },
      {
        name: "Cellular Biology & Ecology",
        grade: "Grades 7-10",
        summary: "Mitosis, DNA structure, ecosystem energy pyramids, and scientific hypothesis testing.",
        href: "/find?subject=Science",
      },
      {
        name: "Introductory Chemistry",
        grade: "Grades 9-10",
        summary: "Chemical nomenclature, atomic orbitals, balanced reactions, and solution molarity.",
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
        summary: "Developing clear thesis statements, integrating quotations, and persuasive rhetoric.",
        href: "/find?subject=Writing",
      },
      {
        name: "Reading Comprehension & Critical Thought",
        grade: "Grades 3-8",
        summary: "Theme identification, inferencing, author perspective, and vocabulary in context.",
        href: "/find?subject=Reading",
      },
      {
        name: "Grammar, Syntax & Sentence Craft",
        grade: "Grades 3-7",
        summary: "Parts of speech, comma rules, clause structures, and active voice precision.",
        href: "/find?subject=Writing",
      },
      {
        name: "Civics, Government & History",
        grade: "Grades 6-9",
        summary: "Constitutional principles, historical turning points, and document-based questions.",
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
        summary: "Letter-sound blending, sight word fluency, and interactive reading games.",
        href: "/find?grade=K-2&subject=Reading",
      },
      {
        name: "Number Sense & Counting Fluency",
        grade: "Kindergarten - Grade 2",
        summary: "Visual ten-frames, addition/subtraction intuition, shapes, and patterns.",
        href: "/find?grade=K-2&subject=Mathematics",
      },
      {
        name: "Guided Narrative Comprehension",
        grade: "Grades 1-3",
        summary: "Story retelling, character exploration, and expressing ideas in simple sentences.",
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

  // Concierge Form State
  const [selectedGrade, setSelectedGrade] = useState("all");
  const [selectedSubject, setSelectedSubject] = useState("all");

  const currentDiscipline = DISCIPLINES.find((d) => d.id === activeTab) || DISCIPLINES[0];

  const handleConciergeSearch = () => {
    const params = new URLSearchParams();
    if (selectedGrade !== "all") params.set("grade", selectedGrade);
    if (selectedSubject !== "all") params.set("subject", selectedSubject);
    return `/find${params.toString() ? `?${params.toString()}` : ""}`;
  };

  return (
    <div className={styles.pageWrapper}>
      {/* ── 1. EDITORIAL TICKER ── */}
      <aside className={styles.mastheadTicker} aria-label="Academic Notice">
        <div className={styles.container}>
          <div className={styles.mastheadInner}>
            <div className={styles.mastheadMeta}>
              <span className={styles.mastheadTag}>Non-Profit</span>
              <span>Supervised 1-on-1 tutoring for Kindergarten to Grade 10</span>
              <span className={styles.mastheadDivider} />
              <span>100% Free with zero fees or subscriptions</span>
            </div>
            <div className={styles.mastheadBadge}>
              <Award size={14} color="var(--wa-ochre, #B45309)" />
              <span>Verified High School and College Mentors</span>
            </div>
          </div>
        </div>
      </aside>

      {/* ── 2. HERO SECTION ── */}
      <section className={styles.heroSection}>
        <div className={styles.container}>
          <div className={styles.heroGrid}>
            {/* Left Column: Clear, Non-Vague Hero */}
            <div className={styles.heroContent}>
              <div className={styles.charterPill}>
                <ShieldCheck size={14} />
                <span>Safeguarded Child Protection Standard</span>
              </div>

              <h1 className={styles.heroHeadline}>
                Free 1-on-1 tutoring for Kindergarten to Grade 10 students.
              </h1>

              <p className={styles.heroLead}>
                Volunteer high school and college mentors help younger students build confidence and master Math, Science, and English over secure, supervised Zoom sessions. Completely free with zero fees and no subscriptions.
              </p>

              <div className={styles.heroActions}>
                <Link href="/find" className={styles.btnPrimary}>
                  <span>Find a Tutor</span>
                </Link>
                <Link href="/apply" className={styles.btnSecondary}>
                  <GraduationCap size={17} />
                  <span>Volunteer as a Tutor</span>
                </Link>
              </div>

              {/* Institutional Standards Pillars */}
              <div className={styles.trustPillars}>
                <div className={styles.pillarItem}>
                  <div className={styles.pillarIconWrap}>
                    <CheckCircle2 size={16} />
                  </div>
                  <div>
                    <h2 className={styles.pillarTitle}>100% Free Forever</h2>
                    <p className={styles.pillarDesc}>Zero tuition, no payment methods, no hidden subscriptions.</p>
                  </div>
                </div>

                <div className={styles.pillarItem}>
                  <div className={styles.pillarIconWrap}>
                    <ShieldCheck size={16} />
                  </div>
                  <div>
                    <h2 className={styles.pillarTitle}>Vetted Scholar Mentors</h2>
                    <p className={styles.pillarDesc}>Verified academic records and mandatory child safety training.</p>
                  </div>
                </div>

                <div className={styles.pillarItem}>
                  <div className={styles.pillarIconWrap}>
                    <Lock size={16} />
                  </div>
                  <div>
                    <h2 className={styles.pillarTitle}>Supervised Zoom Rooms</h2>
                    <p className={styles.pillarDesc}>Private waiting-room protection with full parent observation rights.</p>
                  </div>
                </div>

                <div className={styles.pillarItem}>
                  <div className={styles.pillarIconWrap}>
                    <Award size={16} />
                  </div>
                  <div>
                    <h2 className={styles.pillarTitle}>Certified Service Hours</h2>
                    <p className={styles.pillarDesc}>Official service transcripts with unique verification IDs for tutors.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Live Academic Dispatch Card */}
            <div className={styles.dispatchCard}>
              <div className={styles.dispatchHeader}>
                <div className={styles.dispatchTag}>
                  <span className={styles.dispatchDot} />
                  <span>Academic Dispatch</span>
                </div>
                <div className={styles.dispatchVolunteers}>
                  Volunteer Peer Mentoring
                </div>
              </div>

              <div className={styles.dispatchBody}>
                {liveSession ? (
                  <div className={styles.featuredWorkshop}>
                    <span className={styles.subjectBadge}>{liveSession.subject}</span>
                    <h3 className={styles.workshopTitle}>{liveSession.title}</h3>
                    <p className={styles.workshopTutor}>
                      Led by <strong>{liveSession.tutorName}</strong> ({liveSession.tutorSchool})
                    </p>
                    <div className={styles.workshopMeta}>
                      <span className={styles.workshopMetaItem}>
                        <Users size={14} />
                        <span>{liveSession.openSeats} of {liveSession.maxCapacity} seats available</span>
                      </span>
                      <span className={styles.workshopMetaItem}>
                        <Calendar size={14} />
                        <span>Today</span>
                      </span>
                    </div>
                    <Link href={`/sessions/${liveSession.id}`} className={styles.workshopBtn}>
                      Reserve Free Seat
                    </Link>
                  </div>
                ) : (
                  <div className={styles.featuredWorkshop}>
                    <span className={styles.subjectBadge}>1-on-1 Academic Mentorship</span>
                    <h3 className={styles.workshopTitle}>Daily Open Peer Mentoring</h3>
                    <p className={styles.workshopTutor}>
                      Experienced high school and college tutors ready to help across Math, Science, and Essay Writing.
                    </p>
                    <Link href="/find" className={styles.workshopBtn}>
                      Browse Available Tutors
                    </Link>
                  </div>
                )}

                {/* Grounded Platform Standards (No Fake Numbers) */}
                <div className={styles.dispatchLedger}>
                  <div>
                    <div className={styles.ledgerNum}>100%</div>
                    <div className={styles.ledgerLabel}>Free Forever</div>
                  </div>
                  <div>
                    <div className={styles.ledgerNum}>K-10</div>
                    <div className={styles.ledgerLabel}>Grades Supported</div>
                  </div>
                  <div>
                    <div className={styles.ledgerNum}>Zoom</div>
                    <div className={styles.ledgerLabel}>Supervised Rooms</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. HOW IT WORKS FOR FAMILIES (GENUINE 3-STEP PROCESS) ── */}
      <section className={styles.howItWorksSection} id="how-it-works">
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionBadge}>Workflow</span>
            <h2 className={styles.sectionTitle}>How 1-on-1 peer tutoring works for families</h2>
            <p className={styles.sectionLead}>
              Getting started is straightforward, safe, and transparent. We never ask for payment details or credit cards.
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

      {/* ── 4. THE ACADEMIC CURRICULUM ── */}
      <section className={styles.curriculumSection} id="curriculum">
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionBadge}>Curriculum</span>
            <h2 className={styles.sectionTitle}>Rigorous disciplines. Patient peer guidance.</h2>
            <p className={styles.sectionLead}>
              Every lesson is structured around fundamental reasoning rather than rote memorization. Explore our core curriculum for Kindergarten through Grade 10.
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
              <Link key={sub.name} href={sub.href} className={styles.subjectCard}>
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

      {/* ── 5. VERIFIED VOLUNTEER TUTOR ROSTER ── */}
      <section className={styles.registrySection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionBadge}>Scholars</span>
            <h2 className={styles.sectionTitle}>High-achieving scholars giving back</h2>
            <p className={styles.sectionLead}>
              Our volunteer tutors represent rigorous secondary schools and university programs. Each is verified, safeguarded, and dedicated to empowering younger peers.
            </p>
          </div>

          <div className={styles.tutorLedgerGrid}>
            {TUTOR_ROSTER.map((tutor) => (
              <div key={tutor.name} className={styles.tutorCard}>
                <div>
                  <div className={styles.tutorCardHeader}>
                    <div className={styles.tutorAvatar}>{tutor.avatar}</div>
                    <div className={styles.tutorInfo}>
                      <h3>{tutor.name}</h3>
                      <p className={styles.tutorSchool}>{tutor.school}</p>
                    </div>
                  </div>

                  <div className={styles.tutorBadges}>
                    {tutor.subjects.map((s) => (
                      <span key={s} className={styles.badgePill}>{s}</span>
                    ))}
                  </div>
                </div>

                <div className={styles.tutorCardFooter}>
                  <div className={styles.hoursVerified}>
                    <CheckCircle2 size={14} />
                    <span>{tutor.role}</span>
                  </div>
                  <Link href="/find" className={styles.bookTutorBtn}>
                    <span>Schedule</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6. CHILD SAFEGUARDING STANDARDS (NON-NUMBERED PRINCIPLES) ── */}
      <section className={styles.safeguardSection} id="safety">
        <div className={styles.container}>
          <div className={styles.safeguardGrid}>
            <div>
              <span className={styles.sectionBadge}>Safeguarding Protocol</span>
              <h2 className={styles.sectionTitle}>Built from the ground up for student protection</h2>
              <p className={styles.sectionLead}>
                Learnivia operates under a strict Child Protection Charter designed to safeguard young learners and protect volunteer tutors.
              </p>
              <div style={{ marginTop: "2rem" }}>
                <Link href="/parents" className={styles.btnPrimary}>
                  <span>Read Guardian Guidelines</span>
                </Link>
              </div>
            </div>

            <div className={styles.safeguardList}>
              {SAFEGUARD_PILLARS.map((pt) => (
                <div key={pt.id} className={styles.safeguardCard}>
                  <div className={styles.safeguardIconWrap}>
                    <ShieldCheck size={18} />
                  </div>
                  <div>
                    <span className={styles.safeguardBadge}>{pt.badge}</span>
                    <h3 className={styles.safeguardTitle}>{pt.title}</h3>
                    <p className={styles.safeguardText}>{pt.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 7. INTERACTIVE MATCHING CONCIERGE ── */}
      <section className={styles.conciergeSection}>
        <div className={styles.container}>
          <div className={styles.conciergeCard}>
            <h2 className={styles.conciergeTitle}>Instant Subject and Grade Matcher</h2>
            <p className={styles.conciergeLead}>
              Select your child&apos;s grade and subject to immediately locate verified volunteer mentors available this week.
            </p>

            <div className={styles.conciergeControls}>
              <div className={styles.selectGroup}>
                <label htmlFor="grade-select" className={styles.selectLabel}>Grade Level</label>
                <select
                  id="grade-select"
                  className={styles.selectInput}
                  value={selectedGrade}
                  onChange={(e) => setSelectedGrade(e.target.value)}
                >
                  <option value="all">All Grades (K-10)</option>
                  <option value="K-2">Grades K-2 (Early Elementary)</option>
                  <option value="3-5">Grades 3-5 (Elementary)</option>
                  <option value="6-8">Grades 6-8 (Middle School)</option>
                  <option value="9-10">Grades 9-10 (Early High School)</option>
                </select>
              </div>

              <div className={styles.selectGroup}>
                <label htmlFor="subject-select" className={styles.selectLabel}>Subject Area</label>
                <select
                  id="subject-select"
                  className={styles.selectInput}
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                >
                  <option value="all">All Subjects</option>
                  <option value="Mathematics">Mathematics and Problem Solving</option>
                  <option value="Reading">Reading, Phonics and Comprehension</option>
                  <option value="Writing">PEEL Writing and Composition</option>
                  <option value="Science">Sciences (Biology and Chemistry)</option>
                  <option value="Social Studies">Social Studies, Civics and History</option>
                </select>
              </div>

              <Link href={handleConciergeSearch()} className={styles.findBtn}>
                <Search size={16} />
                <span>Find Free Mentors</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── 8. INSTITUTIONAL FAQ ── */}
      <section className={styles.faqSection} id="faq">
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionBadge}>Common Questions</span>
            <h2 className={styles.sectionTitle}>Frequently Asked Questions</h2>
            <p className={styles.sectionLead}>
              Transparent answers regarding our zero-cost model, session supervision, and volunteer accreditation.
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

      {/* ── 9. ADMISSIONS AND VOLUNTEER CALL ── */}
      <section className={styles.admissionsSection}>
        <div className={styles.container}>
          <div className={styles.admissionsCard}>
            <h2 className={styles.admissionsTitle}>
              Quality education should be accessible to every student.
            </h2>
            <p className={styles.admissionsText}>
              Whether you are a parent seeking patient academic mentorship for your student, or a high school scholar looking to earn verified community service hours, our doors are open.
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
