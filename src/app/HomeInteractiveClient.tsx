"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { springs } from "@/lib/motion";
import styles from "./page.module.css";
import {
  ArrowRight,
  ChevronDown,
} from "lucide-react";

const GRADE_BANDS = [
  {
    id: "k2",
    label: "Early Foundations",
    grades: "Kindergarten – Grade 2",
    ages: "Ages 5–8",
    tag: "Early Literacy & Math",
    subjects: [
      "Phonics & Guided Reading",
      "Early Number Sense",
      "Foundational Math",
      "Letter & Word Discovery",
    ],
    href: "/find?grade=K-2",
  },
  {
    id: "35",
    label: "Core Academy",
    grades: "Grades 3–5",
    ages: "Ages 8–11",
    tag: "Building Independent Fluency",
    subjects: [
      "Arithmetic & Problem Solving",
      "Reading Comprehension & Composition",
      "General & Earth Science",
      "Social Studies & Geography",
    ],
    href: "/find?grade=3-5",
  },
  {
    id: "68",
    label: "Intermediate Scholars",
    grades: "Grades 6–8",
    ages: "Ages 11–14",
    tag: "Abstract Reasoning & Writing",
    subjects: [
      "Pre-Algebra & Geometry Basics",
      "Literature & Persuasive Writing",
      "Physical & Life Sciences",
      "World History & Civics",
    ],
    href: "/find?grade=6-8",
  },
  {
    id: "910",
    label: "Secondary Studies",
    grades: "Grades 9–10",
    ages: "Ages 14–16",
    tag: "Advanced High School Depth",
    subjects: [
      "Algebra I & Geometry",
      "Biology & Chemistry",
      "Rhetoric & Documented Essays",
      "Study Strategy & Honors Prep",
    ],
    href: "/find?grade=9-10",
  },
];

const FAQS = [
  {
    q: "Is Learnivia really 100% free forever?",
    a: "Yes, completely and without asterisks. There are no credit cards requested, no hidden fees, and no premium paywalls. Learnivia is an authentic volunteer educational salon — accomplished high school and university scholars donate their time to mentor K–10 peers while earning certified community service credit.",
  },
  {
    q: "Who are the volunteer tutors, and how are they vetted?",
    a: "Our mentors are high-achieving high school (Grades 11+) and university students from top secondary schools and universities. Every prospective tutor submits academic transcripts, completes mandatory child safeguarding training, and passes an individual verification review before hosting a single session.",
  },
  {
    q: "How do the 1-on-1 Zoom sessions work?",
    a: "Sessions take place in secure, private 1-on-1 Zoom rooms with waiting rooms enabled. When you book a study slot, the confirmed join link appears directly in your learner dashboard. No session may be recorded without explicit written parental authorization.",
  },
  {
    q: "Does my child need a formal diagnosis for specialized learning pacing?",
    a: "Never. Learnivia was founded on the belief that every mind learns differently. Whether a student benefits from visual diagrams, micro-breaks, step-by-step problem deconstruction, or simply patient repetition, our tutors adapt with warmth. No paperwork or diagnosis is required.",
  },
  {
    q: "How do student tutors receive verified volunteer service hours?",
    a: "When a session concludes, our platform automatically verifies attendance and generates a tamper-evident Volunteer Service Record stamped with unique audit IDs. Tutors can download this official transcript for high school counselors, honor societies, and university applications.",
  },
  {
    q: "Can parents actively oversee and attend sessions?",
    a: "Always. Parents manage accounts for younger learners, receive automated session confirmations, and are welcome to sit in on any session. Transparency and family peace of mind are the bedrock of our platform.",
  },
];

const SALON_STEPS = [
  {
    num: "01",
    tag: "Catalogue",
    title: "Browse the Academic Ledger",
    desc: "Filter approved volunteer mentors by subject, grade band, and curriculum standard.",
  },
  {
    num: "02",
    tag: "Reservation",
    title: "Claim an Open Study Slot",
    desc: "Pick a time that fits your schedule. Instant confirmation with zero fees or credit cards.",
  },
  {
    num: "03",
    tag: "Dialogue",
    title: "Converse 1-on-1 in the Salon",
    desc: "Join a private Zoom study room. Share homework problems and learn at your exact pace.",
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

  const currentBand = GRADE_BANDS.find((b) => b.id === activeTab) || GRADE_BANDS[0];

  return (
    <div className={styles.homeWrapper}>

      {/* ── 1. HERO SECTION ── */}
      <section className={styles.heroSection}>
        <div className={styles.heroContainer}>

          {/* Left: Editorial Manifesto & Call to Action */}
          <div className={styles.heroLeftCol}>
            <div className={styles.academicSeal}>
              <span className={styles.sealOrnament}>✦</span>
              <span className={styles.sealText}>EX LIBRIS • THE VOLUNTEER PEER ACADEMIC SALON</span>
              <span className={styles.sealOrnament}>✦</span>
            </div>

            <h1 className={styles.heroTitle}>
              The clearest way to understand quadratic equations is from someone who{" "}
              <em className={styles.heroItalic}>just conquered them last semester.</em>
            </h1>

            <p className={styles.heroParagraph}>
              Learnivia connects Kindergarten through Grade 10 students with dedicated high school and university volunteer scholars for private 1-on-1 Zoom sessions and collaborative study tables. 100% free, patient, and grounded in community.
            </p>

            <div className={styles.heroActions}>
              <Link href="/find" className={styles.primaryBtn}>
                <span>Consult the Mentors — It&apos;s Free</span>
                <ArrowRight size={18} strokeWidth={2.2} />
              </Link>
              <Link href="/signup?role=tutor" className={styles.secondaryBtn}>
                Volunteer as a Scholar
              </Link>
            </div>

            {/* Tactile Margin Note */}
            <div className={styles.marginaliaCard}>
              <span className={styles.marginaliaIcon} aria-hidden="true">✎</span>
              <div className={styles.marginaliaContent}>
                <span className={styles.marginaliaLabel}>From the Reading Room Ledger</span>
                <p className={styles.marginaliaText}>
                  {tutorsCount > 0 ? `${tutorsCount}+ verified tutors` : "Screened mentors"} actively offering free study hours.
                  {" "}All sessions held in private, waiting-room-secured Zoom rooms with zero commercial tracking.
                </p>
              </div>
            </div>

            {/* Scholarly Trust Pillars */}
            <div className={styles.trustRow}>
              <span className={styles.trustItem}>
                <span className={styles.trustDot}>✦</span>
                100% Free · No Card Needed
              </span>
              <span className={styles.trustItem}>
                <span className={styles.trustDot}>✦</span>
                Transcript-Vetted Mentors
              </span>
              <span className={styles.trustItem}>
                <span className={styles.trustDot}>✦</span>
                Verified Service Hours
              </span>
            </div>
          </div>

          {/* Right: Archival Reading Room Index Card */}
          <div className={styles.heroRightCol}>
            <div className={styles.archivalIndexCard}>
              <div className={styles.cardBookplateHeader}>
                <div className={styles.bookplateFolio}>FOLIO NO. 2026 // READING ROOM</div>
                <div className={styles.liveIndicator}>
                  <span className={styles.livePulse} />
                  <span>SEATS OPEN</span>
                </div>
              </div>

              {/* Featured / Live Workshop Slip */}
              {liveSession ? (
                <div className={styles.liveSlip}>
                  <div className={styles.slipMeta}>
                    <span className={styles.slipTag}>{liveSession.subject}</span>
                    <span className={styles.slipSeats}>
                      {liveSession.openSeats} of {liveSession.maxCapacity} seats left
                    </span>
                  </div>
                  <h3 className={styles.slipTitle}>{liveSession.title}</h3>
                  <p className={styles.slipMentor}>
                    Led by <strong>{liveSession.tutorName}</strong> ({liveSession.tutorSchool})
                  </p>
                  <Link href="/sessions" className={styles.slipLink}>
                    <span>Reserve a Study Desk</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              ) : (
                <div className={styles.liveSlip}>
                  <div className={styles.slipMeta}>
                    <span className={styles.slipTag}>Peer Study Desk</span>
                    <span className={styles.slipSeats}>Open Daily</span>
                  </div>
                  <h3 className={styles.slipTitle}>1-on-1 Dialogue &amp; Homework Clinics</h3>
                  <p className={styles.slipMentor}>
                    Pair with an approved peer scholar for patient, step-by-step guidance.
                  </p>
                  <Link href="/find" className={styles.slipLink}>
                    <span>Browse Open Study Tables</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              )}

              {/* 3-Step Archival Catalogue Guide */}
              <div className={styles.catalogueGuide}>
                <div className={styles.catalogueTitle}>HOW A STUDY SESSION UNFOLDS</div>
                <ol className={styles.catalogueSteps}>
                  {SALON_STEPS.map((step) => (
                    <li key={step.num} className={styles.catalogueStep}>
                      <div className={styles.catalogueNum}>{step.num}</div>
                      <div className={styles.catalogueBody}>
                        <div className={styles.catalogueStepTitle}>{step.title}</div>
                        <div className={styles.catalogueStepDesc}>{step.desc}</div>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>

              <div className={styles.cardFooterAction}>
                <Link href="/find" className={styles.fullCatalogBtn}>
                  <span>Explore All {tutorsCount > 0 ? `${tutorsCount}` : "Approved"} Mentors</span>
                  <ArrowRight size={15} />
                </Link>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ── 2. THE ACADEMIC CHARTER (FEATURES) ── */}
      <section className={styles.featuresSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionOverline}>THE ACADEMIC CHARTER</div>
            <h2 className={styles.sectionHeading}>Why peer scholarship changes everything</h2>
            <p className={styles.sectionLead}>
              We replaced corporate tutoring agencies with a patient, human-centered guild where students teach students with empathy and depth.
            </p>
          </div>

          <div className={styles.featuresGrid}>
            <div className={styles.featureCard}>
              <div className={styles.featureIndex}>01</div>
              <h3 className={styles.featureTitle}>The Peer Dialectic</h3>
              <p className={styles.featureDesc}>
                Learning from someone close in age is transformative. Tutors speak the vocabulary of today&apos;s curriculum and vividly remember what it felt like to struggle with the exact same concept.
              </p>
              <div className={styles.featureOrnament}>— Thoughtful Camaraderie</div>
            </div>

            <div className={styles.featureCard}>
              <div className={styles.featureIndex}>02</div>
              <h3 className={styles.featureTitle}>Verified Service Ledger</h3>
              <p className={styles.featureDesc}>
                Tutors earn official, auditable volunteer service certificates with cryptographic session verification IDs for school advisors, honor societies, and university admissions.
              </p>
              <div className={styles.featureOrnament}>— Certified Stewardship</div>
            </div>

            <div className={styles.featureCard}>
              <div className={styles.featureIndex}>03</div>
              <h3 className={styles.featureTitle}>Uncompromising Safeguarding</h3>
              <p className={styles.featureDesc}>
                A sanctuary for young learners. Private Zoom rooms with waiting-room access controls, comprehensive transcript vetting, and strict parental transparency on every booking.
              </p>
              <div className={styles.featureOrnament}>— Guardian Oversight</div>
            </div>

            <div className={styles.featureCard}>
              <div className={styles.featureIndex}>04</div>
              <h3 className={styles.featureTitle}>Every Learning Style Welcomed</h3>
              <p className={styles.featureDesc}>
                Visual thinkers, step-by-step processors, and students who need extra pause time — no medical diagnosis is required. Patience is our foundational syllabus.
              </p>
              <div className={styles.featureOrnament}>— Dignified Pacing</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2.5. THREE SCHOLARLY PATHWAYS ── */}
      <section className={styles.pathwaysSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionOverline}>COMMUNITY FELLOWSHIPS</div>
            <h2 className={styles.sectionHeading}>Three dedicated learning pathways</h2>
            <p className={styles.sectionLead}>
              Whether you are a parent seeking safe, transparent guidance, a student seeking homework clarity, or a high school fellow earning recognized service credit.
            </p>
          </div>

          <div className={styles.pathwaysGrid}>
            <div className={styles.pathwayCard}>
              <div className={styles.pathwayBadge}>FOR PARENTS &amp; GUARDIANS</div>
              <h3 className={styles.pathwayTitle}>Transparent oversight &amp; verified security</h3>
              <p className={styles.pathwayDesc}>
                Manage your student&apos;s study schedule with privacy by design. Filter mentors by syllabus and grade band, observe sessions freely, and confirm attendance with 1-click verification.
              </p>
              <Link href="/parents" className={styles.pathwayLink}>
                <span>Read the Guardian Guide</span>
                <ArrowRight size={15} />
              </Link>
            </div>

            <div className={styles.pathwayCard}>
              <div className={styles.pathwayBadge}>FOR K–10 LEARNERS</div>
              <h3 className={styles.pathwayTitle}>Empathetic mentors &amp; zero judgment</h3>
              <p className={styles.pathwayDesc}>
                Connect with patient older students who recently mastered your exact textbook problems. Enjoy private whiteboard discussions with zero subscriptions and zero fees.
              </p>
              <Link href="/find" className={styles.pathwayLink}>
                <span>Discover Your Mentor</span>
                <ArrowRight size={15} />
              </Link>
            </div>

            <div className={styles.pathwayCard}>
              <div className={styles.pathwayBadge}>FOR VOLUNTEER FELLOWS</div>
              <h3 className={styles.pathwayTitle}>Official service credit &amp; leadership</h3>
              <p className={styles.pathwayDesc}>
                High school and university scholars earn certified volunteer service transcripts with verified session IDs for high school advisors, honor societies, and college applications.
              </p>
              <Link href="/apply" className={styles.pathwayLink}>
                <span>Apply to the Fellowship</span>
                <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. SYLLABUS & GRADE FOLIOS ── */}
      <section className={styles.programsSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionOverline}>ACADEMIC FOLIOS</div>
            <h2 className={styles.sectionHeading}>Find mentorship for your grade level</h2>
            <p className={styles.sectionLead}>
              Every volunteer mentor is reviewed and approved for specific grade tiers — ensuring age-appropriate pedagogy.
            </p>
          </div>

          {/* Archival Tab Drawer Bar */}
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
                <span className={styles.tabButtonText}>{band.label}</span>
              </button>
            ))}
          </div>

          {/* Selected Folio Drawer */}
          <div className={styles.programStage}>
            <div className={styles.programStageHeader}>
              <div>
                <span className={styles.folioTag}>{currentBand.tag}</span>
                <h3 className={styles.stageTitle}>{currentBand.label} — {currentBand.grades}</h3>
                <p className={styles.stageDesc}>{currentBand.ages} · Core subjects supported by vetted volunteer scholars</p>
              </div>
              <Link href={currentBand.href} className={styles.stageBrowseLink}>
                <span>Browse All {currentBand.label} Mentors</span>
                <ArrowRight size={16} />
              </Link>
            </div>

            <div className={styles.sessionCardsGrid}>
              {currentBand.subjects.map((subject, idx) => (
                <motion.div
                  key={subject}
                  className={styles.subjectCard}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ ...springs.smooth, delay: idx * 0.04 }}
                >
                  <Link href={`${currentBand.href}&subject=${encodeURIComponent(subject)}`} className={styles.subjectCardLink}>
                    <div className={styles.subjectCardHeader}>
                      <span className={styles.subjectBookIcon}>📖</span>
                      <span className={styles.subjectCardTitle}>{subject}</span>
                    </div>
                    <div className={styles.subjectCardCta}>
                      <span>Consult Mentors</span>
                      <ArrowRight size={14} />
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. READING ROOM FAQ ── */}
      <section className={styles.faqSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionOverline}>INQUIRIES &amp; CLARITY</div>
            <h2 className={styles.sectionHeading}>Questions from parents and students</h2>
            <p className={styles.sectionLead}>
              Clear, transparent answers about how Learnivia operates, who we serve, and how we protect every child.
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
                    <motion.div
                      className={styles.faqChevron}
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={springs.snappy}
                    >
                      <ChevronDown size={18} />
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

      {/* ── 5. FELLOWSHIP PATRON CALL TO ACTION ── */}
      <section className={styles.bottomCtaSection}>
        <div className={styles.container}>
          <div className={styles.bottomCtaCard}>
            <div className={styles.ctaGiltEmblem}>✦ EX LIBRIS LEARNIVIA ✦</div>
            <h2 className={styles.bottomCtaTitle}>Join the Fellowship of Peer Learning</h2>
            <p className={styles.bottomCtaLead}>
              Whether you need patient guidance through algebra homework or want to share your knowledge to earn verified community service credit, your seat at the table is open.
            </p>
            <div className={styles.bottomCtaButtons}>
              <Link href="/signup" className={styles.bottomPrimaryBtn}>
                <span>Claim Your Study Seat — Free Forever</span>
                <ArrowRight size={17} />
              </Link>
              <Link href="/signup?role=tutor" className={styles.bottomSecondaryBtn}>
                Apply as a Volunteer Scholar
              </Link>
            </div>
            <div className={styles.ctaPledge}>
              <span>✓ No Credit Card</span>
              <span>•</span>
              <span>✓ Verified Safe Zoom Rooms</span>
              <span>•</span>
              <span>✓ 100% Community Supported</span>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
