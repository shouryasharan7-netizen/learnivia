"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import LogoSplash from "@/components/LogoSplash";
import styles from "./page.module.css";

// Crisp SVG Icons (Replacing all raw emojis)
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
  Code: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
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
  Target: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>
    </svg>
  ),
};

const PROGRAMS = [
  {
    id: "sat",
    badge: "SAT® Bootcamps",
    title: "Master the Digital SAT with top-percentile scorers",
    description: "Intensive 4-week cohort bootcamps working through real College Board questions, pacing tactics, and hard math modules.",
    sessions: [
      {
        id: "sat-m",
        subject: "SAT® Math Intensive",
        mentor: "Alex Chen • Stanford '28 (1580 SAT)",
        duration: "4 Weeks",
        schedule: "Tues & Thurs • 6:00 PM EST",
        seats: "4 seats left",
        tags: ["Advanced Algebra", "Desmos Strategies", "Practice Exams"],
        href: "/sessions?subject=SAT+Prep",
      },
      {
        id: "sat-rw",
        subject: "Reading & Writing Strategy",
        mentor: "Elena Rostova • Harvard '27 (790 RW)",
        duration: "4 Weeks",
        schedule: "Mon & Weds • 5:30 PM EST",
        seats: "2 seats left",
        tags: ["Evidence Inference", "Grammar Rules", "Rhetorical Synthesis"],
        href: "/sessions?subject=SAT+Prep",
      },
    ],
  },
  {
    id: "college",
    badge: "College Admissions",
    title: "Honest, student-to-student guidance for higher ed",
    description: "Get real feedback on personal essays, extracurricular narratives, and interview prep from students who recently went through the process.",
    sessions: [
      {
        id: "caw-essay",
        subject: "Common App Essay Workshop",
        mentor: "Maya Lin • Yale '28",
        duration: "3 Weeks",
        schedule: "Saturdays • 2:00 PM EST",
        seats: "3 seats left",
        tags: ["Brainstorming", "Line-by-Line Edits", "Hook & Structure"],
        href: "/sessions?subject=College+Admissions",
      },
      {
        id: "caw-interview",
        subject: "Alumni Mock Interviews & Spike Strategy",
        mentor: "David Kim • MIT '27",
        duration: "2 Weeks",
        schedule: "Sundays • 4:00 PM EST",
        seats: "5 seats left",
        tags: ["Mock Practice", "Extracurricular Spike", "Supplements"],
        href: "/sessions?subject=College+Admissions",
      },
    ],
  },
  {
    id: "stem",
    badge: "AP & STEM Mastery",
    title: "Conquer Calculus, Chemistry, and Computer Science",
    description: "Collaborative problem sets and conceptual breakdowns with students who scored 5s on their AP exams.",
    sessions: [
      {
        id: "ap-calc",
        subject: "AP Calculus BC Problem Solving",
        mentor: "Priya Nair • Princeton '27 (5 on AP BC)",
        duration: "Ongoing",
        schedule: "Fridays • 7:00 PM EST",
        seats: "6 seats left",
        tags: ["Integration By Parts", "Series Convergence", "FRQ Practice"],
        href: "/sessions?subject=Calculus",
      },
      {
        id: "ap-chem",
        subject: "AP Chemistry Conceptual Clinic",
        mentor: "Lucas Vance • Columbia '28 (5 on AP Chem)",
        duration: "Ongoing",
        schedule: "Thursdays • 6:30 PM EST",
        seats: "4 seats left",
        tags: ["Thermodynamics", "Equilibrium", "Rate Laws"],
        href: "/sessions?subject=Chemistry",
      },
    ],
  },
  {
    id: "dialogues",
    badge: "Global Dialogues",
    title: "Thoughtful discussions on philosophy and current issues",
    description: "Connect 1-on-1 and in roundtables with high school peers across 30+ countries to practice civil discourse and cross-cultural communication.",
    sessions: [
      {
        id: "dlg-ethics",
        subject: "AI, Technology & Modern Ethics",
        mentor: "Sophia Moreno • Oxford '27",
        duration: "Bi-weekly",
        schedule: "Saturdays • 11:00 AM EST",
        seats: "Open",
        tags: ["Philosophy", "Debate", "Global Perspectives"],
        href: "/sessions?subject=Dialogues",
      },
    ],
  },
];

const HOW_IT_WORKS_STEPS = [
  {
    step: "01",
    title: "Browse & Find Help",
    desc: "Search by subject, level, or upcoming test date. All peer tutors are reviewed and identity-verified.",
    img: "/images/find-a-tutor.png",
  },
  {
    step: "02",
    title: "Book a Free Slot",
    desc: "Pick a time that fits your life. No credit cards, no subscriptions, and zero paywalls.",
    img: "/images/book-a-session.png",
  },
  {
    step: "03",
    title: "Meet Live on Zoom",
    desc: "Jump into a private, small-group or 1-on-1 Zoom room. Share work, talk through problems, and take notes.",
    img: "/images/join-zoom.png",
  },
  {
    step: "04",
    title: "Master & Give Back",
    desc: "Students build real academic confidence; tutors log verified volunteer hours for college apps.",
    img: "/images/session-complete.png",
  },
];

const SUBJECTS = [
  { name: "SAT® Prep", desc: "Digital SAT math & verbal cohorts", icon: Icons.Target, color: "#6D28D9", bg: "#F5F3FF" },
  { name: "Calculus & Algebra", desc: "From Algebra I to Multivariable", icon: Icons.Math, color: "#0D683B", bg: "#F0FDF4" },
  { name: "Chemistry & AP Bio", desc: "Lab concepts, kinetics, organic basics", icon: Icons.Science, color: "#1D4ED8", bg: "#EFF6FF" },
  { name: "Computer Science", desc: "Python, Java, AP CSA, and web logic", icon: Icons.Code, color: "#B45309", bg: "#FFFBEB" },
  { name: "College Admissions", desc: "Personal statements & mock interviews", icon: Icons.Book, color: "#0F766E", bg: "#F0FDFA" },
  { name: "Global Dialogues", desc: "Philosophy, debate & world topics", icon: Icons.Globe, color: "#4338CA", bg: "#EEF2FF" },
];

const TESTIMONIALS = [
  {
    quote: "My tutor Elena broke down digital SAT reading inferences in three sessions better than any prep book I bought. She went through questions step-by-step without making me feel rushed.",
    author: "Sarah M.",
    role: "High School Junior • 1510 SAT (+140 pts)",
  },
  {
    quote: "Tutoring AP Calculus on Learnivia gave me 42 certified service hours that counted directly toward my NHS requirements. Being able to download an auditable transcript made college submission seamless.",
    author: "Jason K.",
    role: "Volunteer Tutor • Princeton '28",
  },
  {
    quote: "Finding a free platform where high schoolers can get quality homework help from college students without any hidden fees or credit cards is incredible.",
    author: "David R.",
    role: "Parent of 10th Grader",
  },
];

const FAQS = [
  {
    q: "Is Learnivia really 100% free?",
    a: "Yes, completely. There are no trial periods, no premium tiers, and no credit card required. Learnivia operates on an open peer-volunteering model where students help students, earning certified community service hours in return.",
  },
  {
    q: "Who are the peer tutors?",
    a: "Our tutors are high-achieving high school and university students. Every applicant submits proof of academic standing, completes our safeguarding guidelines, and is reviewed by our team before being allowed to host sessions.",
  },
  {
    q: "How do live sessions work?",
    a: "Sessions take place in secure, small-group or 1-on-1 Zoom rooms. When you book a slot or enroll in a workshop, a direct Zoom link appears in your dashboard with calendar reminders.",
  },
  {
    q: "How do tutors receive verified volunteer hours?",
    a: "Whenever a session or workshop concludes, the duration is recorded in the platform's auditable ledger. Tutors can generate an official Volunteer Service Transcript with unique verification IDs for National Honor Society, school advisors, and college admissions.",
  },
  {
    q: "Can I be both a student and a tutor?",
    a: "Yes! Many members tutor subjects they excel in (like Algebra or Physics) while attending SAT workshops or college essay sessions for their own preparation.",
  },
];

export default function HomeInteractiveClient() {
  const [activeTab, setActiveTab] = useState<string>("sat");
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const currentProgram = PROGRAMS.find((p) => p.id === activeTab) || PROGRAMS[0];

  return (
    <div className={styles.homeWrapper}>
      {/* 1. Opening Brand Splash Animation */}
      <LogoSplash />

      {/* 2. Hero Section: Scholastic Editorial Elegance */}
      <section className={styles.heroSection}>
        <div className={styles.heroContainer}>
          <div className={styles.heroLeftCol}>
            {/* Editorial Eyebrow Badge */}
            <div className={styles.eyebrowBadge}>
              <span className={styles.pulseDot} />
              <span className={styles.eyebrowText}>Peer Learning • 100% Free For All Students</span>
            </div>

            {/* Editorial Headline */}
            <h1 className={styles.heroTitle}>
              Real learning happens <br />
              <span className={styles.heroTitleItalic}>when peers teach peers.</span>
            </h1>

            {/* Direct, Honest Subheadline */}
            <p className={styles.heroParagraph}>
              Connect with high-achieving high school and university students for free 1-on-1 tutoring,
              SAT® bootcamps, college essay workshops, and collaborative study rooms. No subscriptions, no paywalls.
            </p>

            {/* Action CTAs */}
            <div className={styles.heroActions}>
              <Link href="/sessions" className={styles.primaryHeroBtn}>
                <span>Explore Live Sessions</span>
                <Icons.ArrowRight />
              </Link>
              <Link href="/apply" className={styles.secondaryHeroBtn}>
                <span>Volunteer to Tutor</span>
              </Link>
            </div>

            {/* Trust & Safeguarding Micro-Bar */}
            <div className={styles.trustRow}>
              <div className={styles.trustItem}>
                <span className={styles.trustIcon}><Icons.CheckCircle /></span>
                <span>Zero cost, ever</span>
              </div>
              <div className={styles.trustItem}>
                <span className={styles.trustIcon}><Icons.ShieldCheck /></span>
                <span>Verified peer tutors</span>
              </div>
              <div className={styles.trustItem}>
                <span className={styles.trustIcon}><Icons.Certificate /></span>
                <span>Official volunteer hours</span>
              </div>
            </div>
          </div>

          {/* Right Hero Graphic: Live Interactive Preview Card */}
          <div className={styles.heroRightCol}>
            <div className={styles.liveCardDeck}>
              <div className={styles.heroPreviewCard}>
                <div className={styles.previewHeader}>
                  <div className={styles.previewMascotMini}>
                    <Image
                      src="/images/logo.png"
                      alt="Learnivia Fox"
                      width={36}
                      height={36}
                      className={styles.mascotImg}
                    />
                  </div>
                  <div>
                    <span className={styles.liveIndicator}>Live Study Room</span>
                    <h3 className={styles.previewTitle}>Digital SAT® Math: Module 2 Hard Problems</h3>
                  </div>
                </div>

                <p className={styles.previewDesc}>
                  Live review of non-linear functions, circle equations, and Desmos shortcuts with small-group Q&amp;A.
                </p>

                <div className={styles.previewMeta}>
                  <div className={styles.metaChip}>
                    <Icons.Clock />
                    <span>Today at 6:00 PM EST</span>
                  </div>
                  <div className={styles.metaChip}>
                    <Icons.Users />
                    <span>3 of 8 seats open</span>
                  </div>
                </div>

                <div className={styles.previewHostRow}>
                  <div className={styles.hostAvatar}>AC</div>
                  <div className={styles.hostInfo}>
                    <div className={styles.hostName}>Alex Chen</div>
                    <div className={styles.hostCred}>Stanford &apos;28 • 1580 SAT</div>
                  </div>
                  <Link href="/sessions?subject=SAT+Prep" className={styles.previewJoinBtn}>
                    Join Free
                  </Link>
                </div>
              </div>

              {/* Behind Subtle Card */}
              <div className={styles.heroCardBackdrop} aria-hidden="true" />
            </div>
          </div>
        </div>
      </section>

      {/* 3. The 4-Step Learning Journey (Featuring Custom Fox Illustrations) */}
      <section className={styles.journeySection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionKicker}>HOW IT WORKS</span>
            <h2 className={styles.sectionHeading}>A simple, humane way to learn and give back.</h2>
            <p className={styles.sectionLead}>
              We replaced complicated tutoring agencies with transparent peer collaboration.
            </p>
          </div>

          <div className={styles.journeyGrid}>
            {HOW_IT_WORKS_STEPS.map((step) => (
              <div key={step.step} className={styles.journeyCard}>
                <div className={styles.stepNumBadge}>{step.step}</div>
                <div className={styles.journeyImgWrap}>
                  <Image
                    src={step.img}
                    alt={step.title}
                    width={180}
                    height={180}
                    className={styles.journeyIllustration}
                  />
                </div>
                <h3 className={styles.journeyTitle}>{step.title}</h3>
                <p className={styles.journeyDesc}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Interactive Programs & Bootcamps Showcase (Bento Grid) */}
      <section className={styles.programsSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionKicker}>CURRICULA &amp; SESSIONS</span>
            <h2 className={styles.sectionHeading}>Cohort bootcamps &amp; drop-in help.</h2>
            <p className={styles.sectionLead}>
              Join a multi-week intensive or book a quick 1-on-1 session before your next midterm.
            </p>
          </div>

          {/* Program Tabs */}
          <div className={styles.programTabsBar} role="tablist">
            {PROGRAMS.map((prog) => (
              <button
                key={prog.id}
                role="tab"
                aria-selected={activeTab === prog.id}
                onClick={() => setActiveTab(prog.id)}
                className={`${styles.programTabBtn} ${activeTab === prog.id ? styles.programTabActive : ""}`}
              >
                {prog.badge}
              </button>
            ))}
          </div>

          {/* Program Content Stage */}
          <div className={styles.programStage}>
            <div className={styles.programStageHeader}>
              <div>
                <h3 className={styles.stageTitle}>{currentProgram.title}</h3>
                <p className={styles.stageDesc}>{currentProgram.description}</p>
              </div>
              <Link href="/sessions" className={styles.stageBrowseLink}>
                <span>View Full Schedule</span>
                <Icons.ArrowRight />
              </Link>
            </div>

            <div className={styles.sessionCardsGrid}>
              {currentProgram.sessions.map((sess) => (
                <div key={sess.id} className={styles.sessionCard}>
                  <div className={styles.sessionCardTop}>
                    <span className={styles.sessionSubjectBadge}>{sess.subject}</span>
                    <span className={styles.sessionSeatsBadge}>{sess.seats}</span>
                  </div>

                  <div className={styles.sessionMentorRow}>
                    <div className={styles.mentorAvatarMini}>
                      {sess.mentor.split(" ")[0][0]}
                    </div>
                    <span className={styles.sessionMentorText}>{sess.mentor}</span>
                  </div>

                  <div className={styles.sessionScheduleList}>
                    <div className={styles.scheduleItem}>
                      <Icons.Calendar />
                      <span>{sess.schedule}</span>
                    </div>
                    <div className={styles.scheduleItem}>
                      <Icons.Clock />
                      <span>{sess.duration}</span>
                    </div>
                  </div>

                  <div className={styles.sessionTagsRow}>
                    {sess.tags.map((t) => (
                      <span key={t} className={styles.tagPill}>{t}</span>
                    ))}
                  </div>

                  <div className={styles.sessionCardFooter}>
                    <Link href={sess.href} className={styles.sessionJoinBtn}>
                      <span>Enroll in Session</span>
                      <Icons.ArrowRight />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 5. Volunteer Tutor Impact Card */}
      <section className={styles.volunteerSection}>
        <div className={styles.container}>
          <div className={styles.volunteerCard}>
            <div className={styles.volunteerLeft}>
              <span className={styles.volunteerKicker}>FOR VOLUNTEER TUTORS</span>
              <h2 className={styles.volunteerHeading}>
                Turn your academic strengths into verified community impact.
              </h2>
              <p className={styles.volunteerText}>
                Share your expertise in subjects you love. Every session you host is recorded and certified with an official Volunteer Service Transcript for college admissions, NHS, and honor society requirements.
              </p>

              <div className={styles.volunteerBenefits}>
                <div className={styles.benefitItem}>
                  <Icons.CheckCircle />
                  <span>Official, verifiable service hours transcripts</span>
                </div>
                <div className={styles.benefitItem}>
                  <Icons.CheckCircle />
                  <span>Choose your own hours and subjects</span>
                </div>
                <div className={styles.benefitItem}>
                  <Icons.CheckCircle />
                  <span>Join a community of top students from around the world</span>
                </div>
              </div>

              <div className={styles.volunteerActions}>
                <Link href="/apply" className={styles.volunteerPrimaryBtn}>
                  Apply to Volunteer
                </Link>
                <Link href="/how-it-works" className={styles.volunteerSecondaryBtn}>
                  Learn How Hours Work
                </Link>
              </div>
            </div>

            <div className={styles.volunteerRight}>
              <div className={styles.volunteerMascotWrap}>
                <Image
                  src="/images/become-a-tutor.png"
                  alt="Learnivia Volunteer Tutor Mascot with ID Badge"
                  width={240}
                  height={280}
                  className={styles.volunteerMascotImg}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Subjects Directory */}
      <section className={styles.subjectsSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionKicker}>SUBJECT DIRECTORY</span>
            <h2 className={styles.sectionHeading}>What do you want to learn?</h2>
            <p className={styles.sectionLead}>
              Browse our most active subjects with verified volunteer peer tutors.
            </p>
          </div>

          <div className={styles.subjectsGrid}>
            {SUBJECTS.map((sub) => {
              const IconComponent = sub.icon;
              return (
                <Link key={sub.name} href={`/sessions?subject=${encodeURIComponent(sub.name)}`} className={styles.subjectCard}>
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

      {/* 7. Student & Parent Testimonials */}
      <section className={styles.testimonialsSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionKicker}>COMMUNITY EXPERIENCES</span>
            <h2 className={styles.sectionHeading}>Real words from real learners.</h2>
          </div>

          <div className={styles.testimonialsGrid}>
            {TESTIMONIALS.map((t, idx) => (
              <div key={idx} className={styles.testimonialCard}>
                <blockquote className={styles.testimonialQuote}>
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <div className={styles.testimonialAuthorRow}>
                  <div>
                    <div className={styles.testimonialName}>{t.author}</div>
                    <div className={styles.testimonialRole}>{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. Frequently Asked Questions */}
      <section className={styles.faqSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionKicker}>FAQ</span>
            <h2 className={styles.sectionHeading}>Answers to common questions.</h2>
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
                  <span className={styles.faqToggleIcon}>{openFaq === index ? "−" : "+"}</span>
                </button>
                {openFaq === index && (
                  <div className={styles.faqAnswer}>
                    <p>{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. Final Call to Action */}
      <section className={styles.bottomCtaSection}>
        <div className={styles.container}>
          <div className={styles.bottomCtaCard}>
            <span className={styles.bottomKicker}>GET STARTED TODAY</span>
            <h2 className={styles.bottomHeading}>
              Great education belongs to everyone.
            </h2>
            <p className={styles.bottomSubtitle}>
              Whether you need help prepping for tomorrow&apos;s exam or want to share what you know, your seat is ready.
            </p>
            <div className={styles.bottomBtnGroup}>
              <Link href="/signup" className={styles.bottomPrimaryBtn}>
                Join Learnivia — Free Forever
              </Link>
              <Link href="/sessions" className={styles.bottomSecondaryBtn}>
                Browse Live Sessions
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
