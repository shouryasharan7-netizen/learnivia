"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import LogoSplash from "@/components/LogoSplash";
import styles from "./page.module.css";

// Crisp SVG Icons
const Icons = {
  ArrowRight: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
    </svg>
  ),
  CheckCircle: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
    </svg>
  ),
  Clock: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
    </svg>
  ),
  Calendar: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
  ),
  Users: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  ),
  ShieldCheck: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/>
    </svg>
  ),
  Certificate: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/>
    </svg>
  ),
  Video: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
    </svg>
  ),
  Math: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="4" y1="12" x2="20" y2="12"/><line x1="12" y1="4" x2="12" y2="20"/>
    </svg>
  ),
  Science: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 3v6l-5 9a2 2 0 0 0 1.7 3h12.6a2 2 0 0 0 1.7-3l-5-9V3"/><line x1="9" y1="3" x2="15" y2="3"/>
    </svg>
  ),
  Book: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
    </svg>
  ),
  Globe: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
    </svg>
  ),
  Star: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
    </svg>
  ),
  Heart: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
    </svg>
  ),
};

const GRADE_BANDS = [
  {
    id: "k2",
    label: "Early Elementary",
    grades: "K\u2013Grade 2",
    ages: "Ages 5\u20138",
    subjects: ["Phonics & Reading", "Early Math", "Letter Recognition", "Number Sense"],
    href: "/find?grade=K-2",
    color: "#7C3AED",
    bg: "#F5F3FF",
  },
  {
    id: "35",
    label: "Elementary",
    grades: "Grades 3\u20135",
    ages: "Ages 8\u201311",
    subjects: ["Math", "Reading & Writing", "General Science", "Social Studies"],
    href: "/find?grade=3-5",
    color: "#0D683B",
    bg: "#F0FDF4",
  },
  {
    id: "68",
    label: "Middle School",
    grades: "Grades 6\u20138",
    ages: "Ages 11\u201314",
    subjects: ["Pre-Algebra", "English & Language Arts", "Earth Science", "Physical Science"],
    href: "/find?grade=6-8",
    color: "#1D4ED8",
    bg: "#EFF6FF",
  },
  {
    id: "910",
    label: "Early High School",
    grades: "Grades 9\u201310",
    ages: "Ages 14\u201316",
    subjects: ["Algebra I", "Geometry", "Biology", "Chemistry"],
    href: "/find?grade=9-10",
    color: "#B45309",
    bg: "#FFFBEB",
  },
];

const HOW_IT_WORKS_STEPS = [
  {
    step: "01",
    title: "Select Your Grade & Subject",
    desc: "Choose your grade (K\u201310) and subject. Only tutors approved for your grade level will appear.",
    img: "/images/find-a-tutor.png",
  },
  {
    step: "02",
    title: "Book a Free 1-on-1 Session",
    desc: "Pick an open slot with a verified volunteer tutor. No credit cards, no subscriptions \u2014 100% free.",
    img: "/images/book-a-session.png",
  },
  {
    step: "03",
    title: "Meet Live on Zoom",
    desc: "Join a private 1-on-1 Zoom session. Share your work, talk through problems, get personalized help.",
    img: "/images/join-zoom.png",
  },
  {
    step: "04",
    title: "Track Your Progress",
    desc: "Your learning minutes are logged in real time. Tutors earn verified volunteer hour transcripts.",
    img: "/images/session-complete.png",
  },
];

const SUBJECTS_K10 = [
  { name: "Mathematics", desc: "From early counting to Algebra & Geometry", icon: Icons.Math, color: "#0D683B", bg: "#F0FDF4" },
  { name: "Reading & Writing", desc: "Phonics, comprehension, and essay skills", icon: Icons.Book, color: "#1D4ED8", bg: "#EFF6FF" },
  { name: "Science", desc: "Life, Earth, Physical, Biology & Chemistry", icon: Icons.Science, color: "#7C3AED", bg: "#F5F3FF" },
  { name: "English Language Arts", desc: "Grammar, vocabulary, and literature", icon: Icons.Globe, color: "#0F766E", bg: "#F0FDFA" },
  { name: "Social Studies", desc: "History, geography, and civics", icon: Icons.Star, color: "#B45309", bg: "#FFFBEB" },
  { name: "Learning Support", desc: "Visual learners, neurodiverse learners, step-by-step pacing", icon: Icons.Heart, color: "#BE185D", bg: "#FDF2F8" },
];

const FAQS = [
  {
    q: "Is Learnivia really 100% free?",
    a: "Yes, completely. There are no trial periods, no premium tiers, and no credit card required. Learnivia is a volunteer tutoring platform \u2014 peer students help students for free, earning verified community service hours in return.",
  },
  {
    q: "Who can use Learnivia?",
    a: "Learnivia serves students in Kindergarten through Grade 10. Parents or guardians manage accounts for younger children. Students in Grades 9\u201310 may also manage their own accounts independently.",
  },
  {
    q: "Who are the volunteer tutors?",
    a: "Our tutors are high school and university students. Every applicant submits academic credentials, completes our safeguarding and safety training, and is reviewed by our team before being approved to host sessions.",
  },
  {
    q: "How do 1-on-1 Zoom sessions work?",
    a: "Sessions take place in secure, private 1-on-1 Zoom rooms. When you book a session, the Zoom link appears in your dashboard. Sessions are logged for volunteer-hour verification; no recording happens without explicit parent consent.",
  },
  {
    q: "Does my child need a diagnosis to get learning support?",
    a: "Absolutely not. Learnivia welcomes all learners, including those who prefer visual explanations, step-by-step pacing, extra processing time, frequent breaks, or practice-based learning \u2014 no diagnosis is ever required.",
  },
  {
    q: "How do tutors receive verified volunteer hours?",
    a: "When a session concludes, the duration is logged automatically. Tutors can generate an official Volunteer Service Transcript for NHS, school advisors, and other requirements.",
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
      {/* 1. Opening Brand Splash Animation */}
      <LogoSplash />

      {/* 2. Hero Section */}
      <section className={styles.heroSection}>
        <div className={styles.heroContainer}>
          <div className={styles.heroLeftCol}>
            <div className={styles.eyebrowBadge}>
              <span className={styles.pulseDot} />
              <span className={styles.eyebrowText}>Free Online Tutoring &bull; Kindergarten through Grade 10</span>
            </div>

            <h1 className={styles.heroTitle}>
              Free online tutoring{" "}
              <br />
              <span className={styles.heroTitleItalic}>built around every learner.</span>
            </h1>

            <p className={styles.heroParagraph}>
              Learnivia connects K&ndash;10 students with verified volunteer peer tutors for free,
              private 1-on-1 Zoom sessions. Personalized support for every learning style &mdash;
              no diagnosis required, no cost, ever.
            </p>

            <div className={styles.heroActions}>
              <Link href="/find" className={styles.primaryHeroBtn}>
                <span>Find a Tutor</span>
                <Icons.ArrowRight />
              </Link>
              <Link href="/apply" className={styles.secondaryHeroBtn}>
                <span>Become a Tutor</span>
              </Link>
            </div>

            <div className={styles.trustRow}>
              <div className={styles.trustItem}>
                <span className={styles.trustIcon}><Icons.CheckCircle /></span>
                <span>Zero cost, ever</span>
              </div>
              <div className={styles.trustItem}>
                <span className={styles.trustIcon}><Icons.ShieldCheck /></span>
                <span>Verified tutors</span>
              </div>
              <div className={styles.trustItem}>
                <span className={styles.trustIcon}><Icons.Certificate /></span>
                <span>Verified volunteer hours</span>
              </div>
            </div>
          </div>

          <div className={styles.heroRightCol}>
            <div className={styles.liveCardDeck}>
              <div className={styles.heroPreviewCard}>
                <div className={styles.previewHeader}>
                  <div className={styles.previewMascotMini}>
                    <Image src="/images/logo.png" alt="Learnivia" width={36} height={36} className={styles.mascotImg} />
                  </div>
                  <div>
                    <span className={styles.liveIndicator}>
                      {liveSession ? "Upcoming Session" : "Live Learning Community"}
                    </span>
                    <h3 className={styles.previewTitle}>
                      {liveSession ? liveSession.title : "1-on-1 Peer Tutoring &bull; K\u2013Grade 10"}
                    </h3>
                  </div>
                </div>

                <p className={styles.previewDesc}>
                  {liveSession
                    ? liveSession.description || "Personalized 1-on-1 support with a verified volunteer tutor."
                    : "Connect with a verified volunteer tutor for personalized help in any K\u201310 subject \u2014 completely free."}
                </p>

                <div className={styles.previewMeta}>
                  <div className={styles.metaChip}>
                    <Icons.Clock />
                    <span>
                      {liveSession
                        ? new Date(liveSession.startTime).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })
                        : "Sessions daily"}
                    </span>
                  </div>
                  <div className={styles.metaChip}>
                    <Icons.Users />
                    <span>
                      {liveSession
                        ? `${liveSession.openSeats} seats available`
                        : `${tutorsCount > 0 ? `${tutorsCount} Verified Tutors` : "Volunteer Tutors"}`}
                    </span>
                  </div>
                </div>

                <div className={styles.previewHostRow}>
                  <div className={styles.hostAvatar}>
                    {liveSession
                      ? liveSession.tutorName.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()
                      : "LV"}
                  </div>
                  <div className={styles.hostInfo}>
                    <div className={styles.hostName}>
                      {liveSession ? liveSession.tutorName : "Learnivia Volunteer Tutors"}
                    </div>
                    <div className={styles.hostCred}>
                      {liveSession ? liveSession.tutorSchool : "Reviewed & Approved Volunteers"}
                    </div>
                  </div>
                  <Link href="/find" className={styles.previewJoinBtn}>
                    {liveSession ? "Book Now" : "Find a Tutor"}
                  </Link>
                </div>
              </div>
              <div className={styles.heroCardBackdrop} aria-hidden="true" />
            </div>
          </div>
        </div>
      </section>

      {/* 3. How It Works */}
      <section className={styles.journeySection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionKicker}>HOW IT WORKS</span>
            <h2 className={styles.sectionHeading}>Simple, personalized, and completely free.</h2>
            <p className={styles.sectionLead}>
              Learnivia replaces expensive tutoring agencies with transparent peer volunteering &mdash;
              no subscriptions, no hidden fees.
            </p>
          </div>
          <div className={styles.journeyGrid}>
            {HOW_IT_WORKS_STEPS.map((step) => (
              <div key={step.step} className={styles.journeyCard}>
                <div className={styles.stepNumBadge}>{step.step}</div>
                <div className={styles.journeyImgWrap}>
                  <Image src={step.img} alt={step.title} width={180} height={180} className={styles.journeyIllustration} />
                </div>
                <h3 className={styles.journeyTitle}>{step.title}</h3>
                <p className={styles.journeyDesc}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Grade Bands Explorer */}
      <section className={styles.programsSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionKicker}>GRADE BANDS &bull; K&ndash;10</span>
            <h2 className={styles.sectionHeading}>Find help for your grade level.</h2>
            <p className={styles.sectionLead}>
              Every tutor is matched to specific grade bands and subjects &mdash;
              so your student only sees tutors approved for their level.
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
                {band.label}
              </button>
            ))}
          </div>

          <div className={styles.programStage}>
            <div className={styles.programStageHeader}>
              <div>
                <h3 className={styles.stageTitle}>{currentBand.label} &mdash; {currentBand.grades}</h3>
                <p className={styles.stageDesc}>{currentBand.ages} &middot; Subjects with verified volunteer peer tutors</p>
              </div>
              <Link href={currentBand.href} className={styles.stageBrowseLink}>
                <span>Find a Tutor for This Grade</span>
                <Icons.ArrowRight />
              </Link>
            </div>

            <div className={styles.sessionCardsGrid}>
              {currentBand.subjects.map((subject) => (
                <Link
                  key={subject}
                  href={`/find?grade=${encodeURIComponent(currentBand.grades)}&subject=${encodeURIComponent(subject)}`}
                  className={styles.sessionCard}
                  style={{ textDecoration: "none" }}
                >
                  <div className={styles.sessionCardTop}>
                    <span
                      className={styles.sessionSubjectBadge}
                      style={{ background: currentBand.bg, color: currentBand.color }}
                    >
                      {subject}
                    </span>
                    <span className={styles.sessionSeatsBadge}>1-on-1</span>
                  </div>
                  <div className={styles.sessionScheduleList}>
                    <div className={styles.scheduleItem}>
                      <Icons.Video />
                      <span>Private Zoom Session</span>
                    </div>
                    <div className={styles.scheduleItem}>
                      <Icons.CheckCircle />
                      <span>100% Free</span>
                    </div>
                  </div>
                  <div className={styles.sessionCardFooter}>
                    <span className={styles.sessionJoinBtn} style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem" }}>
                      <span>Book a Session</span>
                      <Icons.ArrowRight />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 5. Volunteer Tutor Card */}
      <section className={styles.volunteerSection}>
        <div className={styles.container}>
          <div className={styles.volunteerCard}>
            <div className={styles.volunteerLeft}>
              <span className={styles.volunteerKicker}>FOR VOLUNTEER TUTORS</span>
              <h2 className={styles.volunteerHeading}>Make a real difference &mdash; and earn verified volunteer hours.</h2>
              <p className={styles.volunteerText}>
                Share what you know with K&ndash;10 students who need personalized, compassionate support.
                Every completed session is automatically logged. Download an official Volunteer Service
                Transcript for NHS, school advisors, and more.
              </p>
              <div className={styles.volunteerBenefits}>
                <div className={styles.benefitItem}><Icons.CheckCircle /><span>Official, verifiable volunteer hour transcripts</span></div>
                <div className={styles.benefitItem}><Icons.CheckCircle /><span>Set your own schedule and choose subjects you love</span></div>
                <div className={styles.benefitItem}><Icons.CheckCircle /><span>Training provided &mdash; safeguarding, Zoom best practices & more</span></div>
                <div className={styles.benefitItem}><Icons.CheckCircle /><span>All sessions 1-on-1, verified, and attendance-logged</span></div>
              </div>
              <div className={styles.volunteerActions}>
                <Link href="/apply" className={styles.volunteerPrimaryBtn}>Apply to Volunteer</Link>
                <Link href="/how-it-works" className={styles.volunteerSecondaryBtn}>Learn How Hours Work</Link>
              </div>
            </div>
            <div className={styles.volunteerRight}>
              <div className={styles.volunteerMascotWrap}>
                <Image src="/images/become-a-tutor.png" alt="Learnivia Volunteer Tutor" width={240} height={280} className={styles.volunteerMascotImg} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Subject Directory */}
      <section className={styles.subjectsSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionKicker}>SUBJECT DIRECTORY</span>
            <h2 className={styles.sectionHeading}>What would you like to learn?</h2>
            <p className={styles.sectionLead}>
              All K&ndash;10 subjects, taught by reviewed volunteer peer tutors in private 1-on-1 Zoom sessions.
            </p>
          </div>
          <div className={styles.subjectsGrid}>
            {SUBJECTS_K10.map((sub) => {
              const IconComponent = sub.icon;
              return (
                <Link key={sub.name} href={`/find?subject=${encodeURIComponent(sub.name)}`} className={styles.subjectCard}>
                  <div className={styles.subjectIconBox} style={{ background: sub.bg, color: sub.color }}>
                    <IconComponent />
                  </div>
                  <div>
                    <h3 className={styles.subjectName}>{sub.name}</h3>
                    <p className={styles.subjectDesc}>{sub.desc}</p>
                  </div>
                  <span className={styles.subjectArrow}><Icons.ArrowRight /></span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* 7. Real-time Platform Stats */}
      {(tutorsCount > 0 || completedCount > 0) && (
        <section className={styles.subjectsSection} style={{ paddingTop: "1rem", paddingBottom: "3rem" }}>
          <div className={styles.container}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1.5rem", textAlign: "center" }}>
              {tutorsCount > 0 && (
                <div style={{ padding: "2rem", background: "#F0FDF4", borderRadius: "1rem", border: "1px solid #BBF7D0" }}>
                  <div style={{ fontSize: "2.5rem", fontWeight: 800, color: "#0D683B" }}>{tutorsCount}</div>
                  <div style={{ fontSize: "0.95rem", color: "#166534", fontWeight: 600, marginTop: "0.25rem" }}>Approved Volunteer Tutors</div>
                </div>
              )}
              {completedCount > 0 && (
                <div style={{ padding: "2rem", background: "#EFF6FF", borderRadius: "1rem", border: "1px solid #BFDBFE" }}>
                  <div style={{ fontSize: "2.5rem", fontWeight: 800, color: "#1D4ED8" }}>{completedCount}</div>
                  <div style={{ fontSize: "0.95rem", color: "#1E40AF", fontWeight: 600, marginTop: "0.25rem" }}>Completed 1-on-1 Sessions</div>
                </div>
              )}
              <div style={{ padding: "2rem", background: "#F5F3FF", borderRadius: "1rem", border: "1px solid #DDD6FE" }}>
                <div style={{ fontSize: "2.5rem", fontWeight: 800, color: "#7C3AED" }}>K&ndash;10</div>
                <div style={{ fontSize: "0.95rem", color: "#5B21B6", fontWeight: 600, marginTop: "0.25rem" }}>Grade Levels Supported</div>
              </div>
              <div style={{ padding: "2rem", background: "#FDF2F8", borderRadius: "1rem", border: "1px solid #FBCFE8" }}>
                <div style={{ fontSize: "2.5rem", fontWeight: 800, color: "#BE185D" }}>$0</div>
                <div style={{ fontSize: "0.95rem", color: "#9D174D", fontWeight: 600, marginTop: "0.25rem" }}>Cost &mdash; Always Free</div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 8. FAQ */}
      <section className={styles.faqSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionKicker}>FAQ</span>
            <h2 className={styles.sectionHeading}>Common questions, honest answers.</h2>
          </div>
          <div className={styles.faqList}>
            {FAQS.map((faq, index) => (
              <div key={faq.q} className={styles.faqItem}>
                <button
                  className={styles.faqQuestionBtn}
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  aria-expanded={openFaq === index}
                >
                  <span className={styles.faqQuestionText}>{faq.q}</span>
                  <span className={styles.faqToggleIcon}>{openFaq === index ? "\u2212" : "+"}</span>
                </button>
                {openFaq === index && (
                  <div className={styles.faqAnswer}><p>{faq.a}</p></div>
                )}
              </div>
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: "2rem" }}>
            <Link href="/faq" style={{ color: "#0D683B", fontWeight: 700, textDecoration: "none", fontSize: "0.95rem" }}>
              View all FAQs &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* 9. Final CTA */}
      <section className={styles.bottomCtaSection}>
        <div className={styles.container}>
          <div className={styles.bottomCtaCard}>
            <span className={styles.bottomKicker}>GET STARTED TODAY &mdash; IT&apos;S FREE</span>
            <h2 className={styles.bottomHeading}>Quality education belongs to every student.</h2>
            <p className={styles.bottomSubtitle}>
              Whether you&apos;re a student who needs help or a volunteer ready to give back,
              Learnivia is here for you &mdash; at no cost, ever.
            </p>
            <div className={styles.bottomBtnGroup}>
              <Link href="/signup" className={styles.bottomPrimaryBtn}>Join Learnivia &mdash; Free Forever</Link>
              <Link href="/find" className={styles.bottomSecondaryBtn}>Find a Tutor Now</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

