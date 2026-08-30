"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "./page.module.css";

interface AvatarStory {
  id: string;
  name: string;
  role: string;
  emoji: string;
  color: string;
  quote: string;
  positionClass: string;
}

const AVATAR_STORIES: AvatarStory[] = [
  {
    id: "av-1",
    name: "Anya R.",
    role: "Grade 11 Student",
    emoji: "👩‍🎓",
    color: "#1A1F2E",
    quote: "Raised my SAT Math score by 150 points in 4 weeks with peer tutor Marcus!",
    positionClass: styles.avatarTL,
  },
  {
    id: "av-2",
    name: "Marcus O.",
    role: "Stanford '27 Tutor",
    emoji: "🧑‍🏫",
    color: "#0E8345",
    quote: "Logged 58 verified volunteer hours teaching AP Calculus and Physics.",
    positionClass: styles.avatarTR,
  },
  {
    id: "av-3",
    name: "Priya M.",
    role: "High School Senior",
    emoji: "👩‍💻",
    color: "#7C3AED",
    quote: "Got feedback on all my Common App essays from a university mentor for free.",
    positionClass: styles.avatarML,
  },
  {
    id: "av-4",
    name: "David K.",
    role: "MIT '28 Tutor",
    emoji: "👨‍🎓",
    color: "#2563EB",
    quote: "Peer tutoring taught me how to explain complex concepts with total clarity.",
    positionClass: styles.avatarMR,
  },
  {
    id: "av-5",
    name: "Elena V.",
    role: "Grade 10 Learner",
    emoji: "👩‍🔬",
    color: "#D97706",
    quote: "I was struggling with chemistry stoichiometry until my tutor walked me through it!",
    positionClass: styles.avatarBL,
  },
  {
    id: "av-6",
    name: "Jordan T.",
    role: "Harvard '26 Tutor",
    emoji: "🧑‍💻",
    color: "#DC2626",
    quote: "Hosted 8 SAT reading bootcamps this summer with over 120 global students.",
    positionClass: styles.avatarBR,
  },
  {
    id: "av-7",
    name: "Sofia L.",
    role: "High School Junior",
    emoji: "💡",
    color: "#0D9488",
    quote: "The homework help room answered my physics question in under 5 minutes!",
    positionClass: styles.avatarBR2,
  },
];

const SUBJECT_MATCHES = [
  {
    id: "math",
    label: "📐 Calculus & Algebra",
    tutorsAvailable: 42,
    nextSlot: "Today at 4:30 PM EST",
    sampleTopic: "Limits, Derivatives, & Polynomial Factoring",
    query: "Mathematics",
  },
  {
    id: "sat",
    label: "🎯 Digital SAT Prep",
    tutorsAvailable: 35,
    nextSlot: "Tomorrow at 5:00 PM EST",
    sampleTopic: "Reading Transitions & Desmos Calculator Tricks",
    query: "SAT Prep",
  },
  {
    id: "science",
    label: "🔬 AP Biology & Chem",
    tutorsAvailable: 28,
    nextSlot: "Today at 6:00 PM EST",
    sampleTopic: "Cellular Respiration & Reaction Thermodynamics",
    query: "Science",
  },
  {
    id: "essays",
    label: "✍️ College Admissions Essays",
    tutorsAvailable: 19,
    nextSlot: "Thursday at 4:00 PM EST",
    sampleTopic: "Common App Personal Statements & Brainstorming",
    query: "College Admissions",
  },
  {
    id: "cs",
    label: "💻 Python & Coding",
    tutorsAvailable: 24,
    nextSlot: "Friday at 3:00 PM EST",
    sampleTopic: "Loops, Functions, & Data Structures",
    query: "Computer Science",
  },
];

const PROGRAM_SHOWCASE = [
  {
    id: "sat-bootcamp",
    tab: "SAT Bootcamps",
    badge: "Most Popular",
    title: "Intensive 4-Week Digital SAT Bootcamps",
    desc: "Small-cohort test prep sessions covering Math & Reading/Writing with students who scored in the 99th percentile. 100% free.",
    highlights: ["Average +120 point improvement", "Small cohorts of 8-10 students", "Full practice test diagnostic reviews"],
    linkText: "Join an SAT Cohort →",
    linkHref: "/sessions?subject=SAT+Prep",
  },
  {
    id: "1on1-tutoring",
    tab: "1-on-1 Tutoring",
    badge: "Personalized",
    title: "Dedicated 1-on-1 Peer Mentorship",
    desc: "Match with a patient volunteer tutor who knows your exact curriculum. Book weekly times that fit your family schedule.",
    highlights: ["Over 25 high school & AP subjects", "Verified tutor background checks", "Meet safely over Zoom"],
    linkText: "Find a 1-on-1 Tutor →",
    linkHref: "/sessions",
  },
  {
    id: "caw-workshops",
    tab: "College Admissions",
    badge: "High Demand",
    title: "College Admissions & Essay Workshops",
    desc: "Work with undergraduate mentors from top universities to brainstorm, outline, and polish your personal statement and supplements.",
    highlights: ["Common App & UC prompt guides", "Line-by-line feedback on essays", "College list building & financial aid advice"],
    linkText: "Explore College Workshops →",
    linkHref: "/sessions?subject=College+Admissions",
  },
  {
    id: "homework-help",
    tab: "Homework Help",
    badge: "Instant",
    title: "Live Homework Help & Quick Q&A",
    desc: "Stuck on a tricky calculus problem or physics equation? Jump into a live room or submit your question for instant support.",
    highlights: ["Average wait time under 10 minutes", "Available 7 days a week", "Chat or live screen-share Zoom options"],
    linkText: "Get Homework Help Now →",
    linkHref: "/homework-help",
  },
];

const STORIES_DATA = [
  {
    id: "st-1",
    name: "Anya R.",
    category: "Student",
    initials: "AR",
    color: "#0E8345",
    quote: "Learnivia raised my SAT score from 1240 to 1420. Having a peer tutor who had taken the test recently made all the difference — she knew all the exact timing traps!",
  },
  {
    id: "st-2",
    name: "Marcus O.",
    category: "Tutor",
    initials: "MO",
    color: "#7C3AED",
    quote: "I've logged 64 certified hours on Learnivia and included my official transcript on my Common App. Teaching others reinforced my own college chemistry knowledge tenfold.",
  },
  {
    id: "st-3",
    name: "Mrs. Jennifer K.",
    category: "Parent",
    initials: "JK",
    color: "#D97706",
    quote: "As a parent, I was hesitant about online tutoring, but the session safeguards and the patience of our volunteer tutor made us believers. An incredible community service.",
  },
  {
    id: "st-4",
    name: "David Chen",
    category: "Student",
    initials: "DC",
    color: "#2563EB",
    quote: "The homework help room saved me during AP Physics prep. Tutors explain concepts from first principles instead of just handing you the formula.",
  },
];

const FAQS = [
  {
    q: "Is Learnivia really 100% free with no catches or subscriptions?",
    a: "Yes, completely free! Learnivia is powered by passionate volunteer peer tutors and student educators. There are no paywalls, subscriptions, or hidden charges ever.",
  },
  {
    q: "How are volunteer tutors vetted and approved?",
    a: "Every volunteer tutor completes a thorough application, submits academic credentials or exam transcripts, and agrees to our strict community safeguarding code of conduct before their first session.",
  },
  {
    q: "Can volunteer tutors earn certified community service hours?",
    a: "Absolutely. Tutors receive an official, cryptographically verifiable Volunteer Service Transcript certifying their completed hours, student reviews, and subjects taught for college (Common App / UCAS) and honor society applications.",
  },
  {
    q: "How do tutoring sessions work?",
    a: "Sessions are conducted live over online Zoom video calls. Students can share screens, work through digital whiteboards together, and ask questions in real time in a safe environment.",
  },
];

export default function HomeInteractiveClient() {
  const [activeAvatar, setActiveAvatar] = useState<string | null>(null);
  const [selectedSubject, setSelectedSubject] = useState(SUBJECT_MATCHES[0]);
  const [activeProgramTab, setActiveProgramTab] = useState(PROGRAM_SHOWCASE[0].id);
  const [storyFilter, setStoryFilter] = useState("All");
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(0);

  const currentProgram = PROGRAM_SHOWCASE.find((p) => p.id === activeProgramTab) || PROGRAM_SHOWCASE[0];
  const filteredStories = storyFilter === "All" ? STORIES_DATA : STORIES_DATA.filter((s) => s.category === storyFilter);

  return (
    <>
      {/* ============ HERO ============ */}
      <section className={styles.hero}>
        {/* Interactive Floating Avatar Bubbles */}
        <div className={styles.floatingAvatars} aria-label="Student community spotlights">
          {AVATAR_STORIES.map((av) => {
            const isSelected = activeAvatar === av.id;
            return (
              <div key={av.id} className={`${styles.avatarWrap} ${av.positionClass}`}>
                <button
                  type="button"
                  onClick={() => setActiveAvatar(isSelected ? null : av.id)}
                  onMouseEnter={() => setActiveAvatar(av.id)}
                  className={styles.avatar}
                  style={{ background: av.color }}
                  aria-label={`View story from ${av.name}`}
                  title={`${av.name} (${av.role})`}
                >
                  <span>{av.emoji}</span>
                </button>

                {isSelected && (
                  <div className={styles.speechBubble} role="tooltip">
                    <div className={styles.bubbleHeader}>
                      <span className={styles.bubbleName}>{av.name}</span>
                      <span className={styles.bubbleRole}>{av.role}</span>
                    </div>
                    <p className={styles.bubbleQuote}>&ldquo;{av.quote}&rdquo;</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className={styles.heroContent}>
          {/* Left: Giant Headline */}
          <div className={styles.heroLeft}>
            <div className={styles.pillBadge}>
              <span className={styles.pulseDot} />
              100% Free Peer Tutoring
            </div>
            <h1 className={styles.heroTitle}>
              Free<br />
              Online<br />
              Tutoring.<br />
              <span className={styles.heroSubline}>Real Human<br />Connection.</span>
            </h1>
          </div>

          {/* Right: CTA Block & Interactive Quick Matcher */}
          <div className={styles.heroRight}>
            <div className={styles.socialProof}>
              <div className={styles.avatarStack} aria-hidden="true">
                {["#0E8345", "#7C3AED", "#2563EB"].map((c, i) => (
                  <div key={i} className={styles.stackAvatar} style={{ background: c, zIndex: 3 - i }} />
                ))}
              </div>
              <span className={styles.socialText}>Join over <strong>205,000+ students</strong></span>
            </div>

            <p className={styles.heroDesc}>
              Join our global peer-led community for free SAT® tutoring, college admissions mentorship, homework help, and interactive study circles with learners worldwide.
            </p>

            <div className={styles.heroButtonRow}>
              <Link href="/signup" className={styles.startBtn}>
                Start Learning Now! 🚀
              </Link>
            </div>

            <div className={styles.secondaryCtas}>
              <Link href="/parents" className={styles.outlineBtn}>For Parents</Link>
              <Link href="/educators" className={styles.outlineBtn}>For Educators</Link>
            </div>
          </div>
        </div>

        {/* Interactive Subject Matcher Bar */}
        <div className={styles.heroSubjectMatcher}>
          <div className={styles.matcherHeader}>
            <span className={styles.matcherTitle}>Explore live subjects:</span>
            <div className={styles.matcherPills}>
              {SUBJECT_MATCHES.map((sub) => (
                <button
                  key={sub.id}
                  type="button"
                  className={`${styles.subjectPill} ${selectedSubject.id === sub.id ? styles.subjectPillActive : ""}`}
                  onClick={() => setSelectedSubject(sub)}
                >
                  {sub.label}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.matcherPreviewCard}>
            <div className={styles.matcherCardLeft}>
              <div className={styles.liveTutorIndicator}>
                <span className={styles.greenDot} />
                <strong>{selectedSubject.tutorsAvailable} Volunteer Tutors Available</strong>
              </div>
              <p className={styles.matcherSampleTopic}>
                Core topics: <em>{selectedSubject.sampleTopic}</em>
              </p>
            </div>
            <div className={styles.matcherCardRight}>
              <span className={styles.nextSlotTime}>Next open slot: {selectedSubject.nextSlot}</span>
              <Link href={`/sessions?subject=${encodeURIComponent(selectedSubject.query)}`} className={styles.bookSubjectBtn}>
                Find a {selectedSubject.query} Tutor →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ============ LIVE IMPACT METRICS TICKER ============ */}
      <section className={styles.metricsTicker} aria-label="Platform statistics">
        <div className={styles.container}>
          <div className={styles.tickerGrid}>
            <div className={styles.tickerItem}>
              <span className={styles.tickerNumber}>205,000+</span>
              <span className={styles.tickerLabel}>Students Supported</span>
            </div>
            <div className={styles.tickerItem}>
              <span className={styles.tickerNumber}>1,250,000+</span>
              <span className={styles.tickerLabel}>Free Learning Minutes</span>
            </div>
            <div className={styles.tickerItem}>
              <span className={styles.tickerNumber}>120+</span>
              <span className={styles.tickerLabel}>Countries Reached</span>
            </div>
            <div className={styles.tickerItem}>
              <span className={styles.tickerNumber}>$0.00</span>
              <span className={styles.tickerLabel}>Cost to Learners, Forever</span>
            </div>
          </div>
        </div>
      </section>

      {/* ============ INTERACTIVE PROGRAM SHOWCASE ============ */}
      <section className={styles.showcaseSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionBadge}>Academic Programs</span>
            <h2 className={styles.sectionTitle}>Everything you need to excel</h2>
            <p className={styles.sectionSub}>Select a program below to explore how peer learning works.</p>
          </div>

          {/* Program Tabs */}
          <div className={styles.tabsRow} role="tablist">
            {PROGRAM_SHOWCASE.map((prog) => (
              <button
                key={prog.id}
                role="tab"
                aria-selected={activeProgramTab === prog.id}
                className={`${styles.tabBtn} ${activeProgramTab === prog.id ? styles.tabBtnActive : ""}`}
                onClick={() => setActiveProgramTab(prog.id)}
              >
                {prog.tab}
              </button>
            ))}
          </div>

          {/* Active Tab Panel */}
          <div className={styles.tabPanelCard}>
            <div className={styles.panelContent}>
              <span className={styles.panelBadge}>{currentProgram.badge}</span>
              <h3 className={styles.panelTitle}>{currentProgram.title}</h3>
              <p className={styles.panelDesc}>{currentProgram.desc}</p>

              <ul className={styles.highlightList}>
                {currentProgram.highlights.map((h, i) => (
                  <li key={i} className={styles.highlightItem}>
                    <span className={styles.checkIcon}>✓</span>
                    <span>{h}</span>
                  </li>
                ))}
              </ul>

              <Link href={currentProgram.linkHref} className={styles.panelActionBtn}>
                {currentProgram.linkText}
              </Link>
            </div>

            <div className={styles.panelVisual} aria-hidden="true">
              <div className={styles.mockSessionWindow}>
                <div className={styles.mockWindowBar}>
                  <span className={styles.mockDot} style={{ background: "#EF4444" }} />
                  <span className={styles.mockDot} style={{ background: "#F59E0B" }} />
                  <span className={styles.mockDot} style={{ background: "#10B981" }} />
                  <span className={styles.mockTitleText}>Live Study Room • Zoom</span>
                </div>
                <div className={styles.mockWindowBody}>
                  <div className={styles.tutorVideoTile}>
                    <span className={styles.tileAvatar}>🧑‍🏫</span>
                    <span className={styles.tileLabel}>Marcus (Tutor)</span>
                  </div>
                  <div className={styles.studentVideoTile}>
                    <span className={styles.tileAvatar}>👩‍🎓</span>
                    <span className={styles.tileLabel}>Anya (Learner)</span>
                  </div>
                  <div className={styles.whiteboardTile}>
                    <span className={styles.mathEquation}>$$\int x \cdot e^x \, dx = x e^x - e^x + C$$</span>
                    <span className={styles.whiteboardNote}>✓ Solved via Integration by Parts</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ FILTERABLE STORIES ============ */}
      <section className={styles.storiesSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionBadge}>Community Voices</span>
            <h2 className={styles.sectionTitle}>Real stories from our global community</h2>
            <div className={styles.filterPillsRow}>
              {["All", "Student", "Tutor", "Parent"].map((filter) => (
                <button
                  key={filter}
                  className={`${styles.storyFilterPill} ${storyFilter === filter ? styles.storyFilterPillActive : ""}`}
                  onClick={() => setStoryFilter(filter)}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.storiesGrid}>
            {filteredStories.map((s) => (
              <div key={s.id} className={styles.storyCard}>
                <div className={styles.storyHeader}>
                  <span className={styles.storyCategoryTag}>{s.category}</span>
                  <span className={styles.starRating}>★★★★★</span>
                </div>
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

      {/* ============ INTERACTIVE FAQ ACCORDION ============ */}
      <section className={styles.faqSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionBadge}>Got Questions?</span>
            <h2 className={styles.sectionTitle}>Frequently Asked Questions</h2>
          </div>

          <div className={styles.faqList}>
            {FAQS.map((faq, idx) => {
              const isOpen = openFaqIdx === idx;
              return (
                <div key={idx} className={`${styles.faqCard} ${isOpen ? styles.faqCardOpen : ""}`}>
                  <button
                    type="button"
                    className={styles.faqQuestionBtn}
                    onClick={() => setOpenFaqIdx(isOpen ? null : idx)}
                    aria-expanded={isOpen}
                  >
                    <span>{faq.q}</span>
                    <span className={styles.faqChevron}>{isOpen ? "−" : "+"}</span>
                  </button>
                  {isOpen && <p className={styles.faqAnswerText}>{faq.a}</p>}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============ DUAL CALL TO ACTION ============ */}
      <section className={styles.dualCta}>
        <div className={styles.container}>
          <div className={styles.dualCtaGrid}>
            <div className={styles.ctaCard}>
              <div className={styles.ctaEmoji} aria-hidden="true">📚</div>
              <h2 className={styles.ctaTitle}>Ready to start learning?</h2>
              <p className={styles.ctaDesc}>Find a free volunteer tutor who knows your subject and matches your schedule. 100% free forever.</p>
              <Link href="/signup" className={styles.ctaPrimary}>Find a Tutor Free →</Link>
            </div>
            <div className={styles.ctaCard}>
              <div className={styles.ctaEmoji} aria-hidden="true">🎓</div>
              <h2 className={styles.ctaTitle}>Want to make a difference?</h2>
              <p className={styles.ctaDesc}>Join as a volunteer tutor. Earn verified hours, build leadership experience, and help peers succeed.</p>
              <Link href="/apply" className={styles.ctaOutline}>Apply to Volunteer →</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
