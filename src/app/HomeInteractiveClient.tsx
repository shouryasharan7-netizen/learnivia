"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import LogoSplash from "@/components/LogoSplash";
import styles from "./page.module.css";

// Programs data for the Interactive Tablet Mockup (Image 2)
const TABLET_PROGRAMS = [
  {
    id: "sat",
    tabTitle: "SAT Bootcamp",
    tabBadge: "SAT",
    tabDesc: "A four-week bootcamp to prepare for the upcoming SAT",
    tabColor: "#8B5CF6",
    tabBg: "#F5F3FF",
    tabBorder: "#DDD6FE",
    tabIcon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 3v18h18"/>
        <path d="m19 9-5 5-4-4-3 3"/>
      </svg>
    ),
    headline: "peer to peer Sat tutoring",
    subheadline: "Find the program that works best with your busy schedule. Our tutors are here to help!",
    ctaText: "Join Bootcamp",
    ctaLink: "/sessions?subject=SAT+Prep",
    contentTitle: "SAT Bootcamp",
    contentSubtitle: "Programs offered daily. Choose the time that works best for you.",
    sessions: [
      {
        id: "sat-math",
        title: "SAT® Math Bootcamp",
        description: "In interactive sessions with your tutor and other students, you'll complete multiple SAT Math practice tests and work through problems from previous SATs.",
        duration: "4 weeks",
        frequency: "2 times / week",
        sessionLength: "75 mins",
        icon: "📈",
        link: "/sessions?subject=SAT+Math",
      },
      {
        id: "sat-rw",
        title: "SAT® Reading & Writing Bootcamp",
        description: "In interactive sessions with your tutor and other students, you'll complete multiple SAT Reading & Writing practice tests and work through problems from previous SATs.",
        duration: "4 weeks",
        frequency: "2 times / week",
        sessionLength: "75 mins",
        icon: "📝",
        link: "/sessions?subject=SAT+Reading",
      },
    ],
  },
  {
    id: "college",
    tabTitle: "College Admissions Workshops",
    tabBadge: "CAW",
    tabDesc: "Navigate your college prep journey with confidence",
    tabColor: "#3B82F6",
    tabBg: "#EFF6FF",
    tabBorder: "#BFDBFE",
    tabIcon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
        <line x1="16" y1="13" x2="8" y2="13"/>
        <line x1="16" y1="17" x2="8" y2="17"/>
        <polyline points="10 9 9 9 8 9"/>
      </svg>
    ),
    headline: "college prep with top mentors",
    subheadline: "Get advice directly from students at Harvard, MIT, Stanford, Oxford, and more.",
    ctaText: "Explore Workshops",
    ctaLink: "/sessions?subject=College+Admissions",
    contentTitle: "College Admissions Workshops",
    contentSubtitle: "Interactive masterclasses covering personal statements, essays, and interviews.",
    sessions: [
      {
        id: "caw-essay",
        title: "Common App & Personal Essay Masterclass",
        description: "Brainstorm high-impact topics, outline powerful narratives, and receive live line-by-line feedback from university students.",
        duration: "3 weeks",
        frequency: "1 time / week",
        sessionLength: "90 mins",
        icon: "✍️",
        link: "/sessions?subject=College+Admissions",
      },
      {
        id: "caw-interview",
        title: "Alumni Interview & Strategy Bootcamp",
        description: "Mock interviews, answering tricky behavioral questions, and building a cohesive extracurricular application spike.",
        duration: "2 weeks",
        frequency: "2 times / week",
        sessionLength: "60 mins",
        icon: "🎓",
        link: "/sessions?subject=College+Admissions",
      },
    ],
  },
  {
    id: "dialogues",
    tabTitle: "Dialogues",
    tabBadge: "Dialogues",
    tabDesc: "Join 1-on-1 conversations with students from across the globe",
    tabColor: "#F59E0B",
    tabBg: "#FFFBEB",
    tabBorder: "#FDE68A",
    tabIcon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <line x1="2" y1="12" x2="22" y2="12"/>
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
      </svg>
    ),
    headline: "global student dialogues",
    subheadline: "Practice conversational fluency, exchange cultural perspectives, and discuss big ideas.",
    ctaText: "Join a Dialogue",
    ctaLink: "/sessions?subject=Dialogues",
    contentTitle: "Global Dialogues & Roundtables",
    contentSubtitle: "Small-group guided discussions on philosophy, science, and global issues.",
    sessions: [
      {
        id: "dlg-global",
        title: "Cross-Cultural Perspectives & Current Events",
        description: "Explore diverse viewpoints on technology, climate solutions, and history with high school peers worldwide.",
        duration: "Ongoing",
        frequency: "Weekly",
        sessionLength: "45 mins",
        icon: "🌐",
        link: "/sessions?subject=Dialogues",
      },
      {
        id: "dlg-philosophy",
        title: "Ethics, Science & AI Roundtable",
        description: "Engage in friendly debates, philosophical thought experiments, and collaborative problem-solving.",
        duration: "Ongoing",
        frequency: "Bi-weekly",
        sessionLength: "60 mins",
        icon: "💡",
        link: "/sessions?subject=Dialogues",
      },
    ],
  },
];

// Interactive Subject matcher
const POPULAR_SUBJECTS = [
  { id: "sat", name: "SAT® Prep", count: 42, icon: "🎯", color: "#8B5CF6" },
  { id: "math", name: "Calculus & Algebra", count: 68, icon: "📐", color: "#2563EB" },
  { id: "chem", name: "Chemistry & AP Bio", count: 34, icon: "🔬", color: "#059669" },
  { id: "cs", name: "Computer Science (Python / Java)", count: 29, icon: "💻", color: "#D97706" },
  { id: "history", name: "AP World & US History", count: 18, icon: "📜", color: "#7C3AED" },
  { id: "languages", name: "Spanish & French", count: 22, icon: "🗣️", color: "#DC2626" },
];

const FAQS = [
  {
    q: "Is Learnivia really 100% free?",
    a: "Yes! Learnivia is completely free for all learners and tutors. There are no subscriptions, hidden paywalls, or credit card requirements. We believe high-quality peer learning should be accessible to every student everywhere.",
  },
  {
    q: "Who are the volunteer tutors?",
    a: "Our tutors are high-achieving high school and university students from institutions like MIT, Stanford, Harvard, and Oxford. Every tutor undergoes application review, identity verification, and safeguarding training before hosting sessions.",
  },
  {
    q: "How do live sessions work?",
    a: "Sessions take place in secure, small-group or 1-on-1 Zoom rooms. You can ask questions, work through practice tests together, and receive real-time explanations.",
  },
  {
    q: "Can I earn verified volunteer service hours as a tutor?",
    a: "Yes! Learnivia provides tutors with official, digitally auditable Volunteer Service Transcripts complete with verification IDs, subject certifications, and logged hours for college and scholarship applications.",
  },
];

export default function HomeInteractiveClient() {
  const [activeTab, setActiveTab] = useState<string>("sat");
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const currentProgram = TABLET_PROGRAMS.find((p) => p.id === activeTab) || TABLET_PROGRAMS[0];

  return (
    <div className={styles.homeWrapper}>
      {/* 1. Opening Logo Splash Screen Animation (Image 5) */}
      <LogoSplash />

      {/* 2. Main Hero Section with Wave Contours (Matching Image 4) */}
      <section className={styles.heroSection} aria-label="Free online peer tutoring">
        <div className={styles.heroContainer}>
          {/* Left Column: Big Headline */}
          <div className={styles.heroLeftCol}>
            <h1 className={styles.heroTitle}>
              Free <br />
              online <br />
              tutoring.
            </h1>
            <div className={styles.heroSubtitle}>Real Human</div>
          </div>

          {/* Right Column: Community Social Proof & CTAs */}
          <div className={styles.heroRightCol}>
            {/* Student Avatar Stack */}
            <div className={styles.socialProofRow}>
              <span className={styles.socialProofText}>Join over 205k students</span>
              <div className={styles.avatarStack}>
                <span className={`${styles.stackedAvatar} ${styles.avatar1}`}>👩‍🎓</span>
                <span className={`${styles.stackedAvatar} ${styles.avatar2}`}>🧑‍🏫</span>
                <span className={`${styles.stackedAvatar} ${styles.avatar3}`}>👨‍💻</span>
              </div>
            </div>

            {/* Description */}
            <p className={styles.heroParagraph}>
              Join our peer-led community for free SAT® tutoring, college admissions mentorship, homework help, and meaningful conversations with students around the globe.
            </p>

            {/* CTA Buttons */}
            <div className={styles.heroActions}>
              <Link href="/signup" className={styles.primaryHeroBtn}>
                Start learning
              </Link>
              <div className={styles.secondaryBtnRow}>
                <Link href="/parents" className={styles.outlineHeroBtn}>
                  For parents
                </Link>
                <Link href="/educators" className={styles.outlineHeroBtn}>
                  For educator
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Background Wave Graphic Overlay */}
        <div className={styles.waveOverlay} aria-hidden="true">
          <svg viewBox="0 0 1440 320" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.waveSvg}>
            <path d="M0,160 C320,300 420,40 720,160 C1020,280 1120,40 1440,160 L1440,320 L0,320 Z" fill="rgba(255, 255, 255, 0.08)" />
            <path d="M0,220 C240,120 480,260 720,200 C960,140 1200,240 1440,180 L1440,320 L0,320 Z" fill="rgba(255, 255, 255, 0.05)" />
          </svg>
        </div>
      </section>

      {/* 3. Founder / Trust Quote Card (Matching Images 3 & 4 Bottom) */}
      <section className={styles.quoteSection} aria-label="Founder quote">
        <div className={styles.quoteCardContainer}>
          <div className={styles.quoteCard}>
            {/* Top Right Decorative Sticker Badge: Graduation Cap + Certificate Ribbon */}
            <div className={styles.diplomaBadge} aria-hidden="true">
              <div className={styles.gradCap}>🎓</div>
              <div className={styles.certificate}>
                <span className={styles.certSeal}>⭐</span>
                <span className={styles.certText}>Official Verified</span>
              </div>
            </div>

            {/* Left side: Founder Profile */}
            <div className={styles.founderBlock}>
              <div className={styles.founderAvatarCircle}>
                <Image
                  src="/images/logo.png"
                  alt="Learnivia Fox Mascot"
                  width={48}
                  height={48}
                  className={styles.founderLogoImg}
                />
              </div>
              <div className={styles.founderMeta}>
                <h3 className={styles.founderName}>Founded by Rendus</h3>
                <p className={styles.founderRole}>CEO of Learnivia</p>
              </div>
            </div>

            {/* Vertical Divider */}
            <div className={styles.quoteDivider} />

            {/* Right side: Mission Quote */}
            <div className={styles.quoteContent}>
              <blockquote className={styles.quoteText}>
                &ldquo;We believe every student deserves access to great learning opportunities.&rdquo;
              </blockquote>
              <div className={styles.quoteAuthor}>— Learnivia</div>
            </div>

            {/* Bottom watermark */}
            <div className={styles.cardWatermark}>Learnivia</div>
          </div>
        </div>
      </section>

      {/* 4. Interactive Tablet Mockup Section (Matching Image 2: "peer to peer Sat tutoring") */}
      <section className={styles.showcaseSection} aria-label="Programs Showcase">
        <div className={styles.showcaseContainer}>
          {/* Left Mascot Character pointing with "Book a Session" badge */}
          <div className={styles.mascotCol}>
            <div className={styles.mascotWrap}>
              <Image
                src="/images/book-a-session.png"
                alt="Cute Fox Mascot with Backpack"
                width={150}
                height={170}
                className={styles.mascotImage}
                priority
              />
              <div className={styles.mascotBadge}>Book a Session</div>
            </div>
          </div>

          {/* Central Tablet/Device Frame */}
          <div className={styles.tabletCol}>
            <div className={styles.tabletMockup}>
              {/* Tablet Screen Interior */}
              <div className={styles.tabletScreen}>
                {/* Tablet Left Navigation Bar */}
                <div className={styles.tabletSidebar}>
                  <div className={styles.tabletSidebarHeader}>
                    <h4 className={styles.tabletSidebarTitle}>Programs</h4>
                    <p className={styles.tabletSidebarSubtitle}>Join structured classes curated by Learnivia</p>
                  </div>

                  <div className={styles.tabletNavList}>
                    {TABLET_PROGRAMS.map((prog) => (
                      <button
                        key={prog.id}
                        onClick={() => setActiveTab(prog.id)}
                        className={`${styles.tabletTabBtn} ${activeTab === prog.id ? styles.tabletTabActive : ""}`}
                        style={{
                          borderColor: activeTab === prog.id ? prog.tabColor : "transparent",
                          backgroundColor: activeTab === prog.id ? prog.tabBg : "#FFFFFF",
                        }}
                      >
                        <div className={styles.tabletTabHeader}>
                          <span className={styles.tabletTabIcon} style={{ color: prog.tabColor }}>
                            {prog.tabIcon}
                          </span>
                          <span className={styles.tabletTabBadge} style={{ backgroundColor: prog.tabBg, color: prog.tabColor }}>
                            {prog.tabBadge}
                          </span>
                        </div>
                        <h5 className={styles.tabletTabName}>{prog.tabTitle}</h5>
                        <p className={styles.tabletTabDesc}>{prog.tabDesc}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tablet Right Content Area (Dynamic per selected tab) */}
                <div className={styles.tabletMainContent}>
                  <div className={styles.tabletContentHeader}>
                    <h3 className={styles.tabletContentTitle}>{currentProgram.contentTitle}</h3>
                    <p className={styles.tabletContentSubtitle}>{currentProgram.contentSubtitle}</p>
                  </div>

                  <div className={styles.tabletCardsList}>
                    {currentProgram.sessions.map((sess) => (
                      <div key={sess.id} className={styles.programCard}>
                        <div className={styles.cardHeaderRow}>
                          <div className={styles.cardIconBox}>{sess.icon}</div>
                          <div className={styles.cardTitleBox}>
                            <h4 className={styles.cardTitle}>{sess.title}</h4>
                          </div>
                        </div>

                        <p className={styles.cardDescription}>{sess.description}</p>

                        <div className={styles.cardFooterRow}>
                          <div className={styles.cardMetaTags}>
                            <span className={styles.metaTag}>🗓️ {sess.duration}</span>
                            <span className={styles.metaTag}>🔄 {sess.frequency}</span>
                            <span className={styles.metaTag}>⏱️ {sess.sessionLength}</span>
                          </div>
                          <Link href={sess.link} className={styles.cardRegisterBtn}>
                            Register
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Title, Subtitle, and CTA Button */}
          <div className={styles.showcaseRightCol}>
            <h2 className={styles.showcaseTitle}>{currentProgram.headline}</h2>
            <p className={styles.showcaseDesc}>{currentProgram.subheadline}</p>
            <Link href={currentProgram.ctaLink} className={styles.showcaseBtn}>
              {currentProgram.ctaText}
            </Link>
          </div>
        </div>
      </section>

      {/* 5. Popular Subjects Discovery Strip */}
      <section className={styles.subjectsSection} aria-label="Browse subjects">
        <div className={styles.subjectsContainer}>
          <div className={styles.subjectsHeader}>
            <span className={styles.sectionBadge}>EXPLORE TOPICS</span>
            <h2 className={styles.sectionTitle}>Learn anything with a peer tutor</h2>
            <p className={styles.sectionSubtitle}>Choose from over 50+ academic subjects with active daily study rooms.</p>
          </div>

          <div className={styles.subjectsGrid}>
            {POPULAR_SUBJECTS.map((sub) => (
              <Link key={sub.id} href={`/sessions?subject=${encodeURIComponent(sub.name)}`} className={styles.subjectCard}>
                <div className={styles.subjectIconWrap} style={{ background: `${sub.color}15`, color: sub.color }}>
                  {sub.icon}
                </div>
                <div className={styles.subjectInfo}>
                  <h3 className={styles.subjectName}>{sub.name}</h3>
                  <span className={styles.subjectCount}>{sub.count} Tutors Available</span>
                </div>
                <span className={styles.subjectArrow}>→</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 6. FAQ Accordion Section */}
      <section className={styles.faqSection} aria-label="Frequently Asked Questions">
        <div className={styles.faqContainer}>
          <div className={styles.faqHeader}>
            <span className={styles.sectionBadge}>FAQ</span>
            <h2 className={styles.sectionTitle}>Frequently Asked Questions</h2>
            <p className={styles.sectionSubtitle}>Everything you need to know about peer-learning on Learnivia.</p>
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
                  <span className={styles.faqIcon}>{openFaq === index ? "−" : "+"}</span>
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

      {/* 7. Bottom Call to Action */}
      <section className={styles.bottomCtaSection} aria-label="Join Learnivia today">
        <div className={styles.bottomCtaContainer}>
          <div className={styles.bottomCtaCard}>
            <div className={styles.bottomCtaContent}>
              <span className={styles.bottomBadge}>100% FREE FOR EVERYONE</span>
              <h2 className={styles.bottomTitle}>Ready to start your peer learning journey?</h2>
              <p className={styles.bottomSubtitle}>
                Join 205,000+ students in structured bootcamps, homework help, and 1-on-1 tutoring today.
              </p>
              <div className={styles.bottomBtnGroup}>
                <Link href="/signup" className={styles.bottomPrimaryBtn}>
                  Join Learnivia — It&apos;s Free
                </Link>
                <Link href="/sessions" className={styles.bottomSecondaryBtn}>
                  Browse Live Sessions →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
