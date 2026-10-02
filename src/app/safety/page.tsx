import type { Metadata } from "next";
import Link from "next/link";
import styles from "./page.module.css";
import {
  ShieldCheck,
  Users,
  Lock,
  MessageSquare,
  Monitor,
  ClipboardCheck,
  AlertTriangle,
  HeartHandshake,
  ArrowRight,
  ArrowLeft,
  ShieldAlert,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Safety & Safeguarding | Learnivia",
  description:
    "How Learnivia keeps sessions safe: community guidelines, reporting, session rules, and guardian oversight for K-12 learners and standardized test prep candidates.",
};

const guidelines = [
  {
    icon: Users,
    title: "Be respectful & inclusive",
    body: "Treat everyone with courtesy. Discriminatory, harassing, or abusive language is strictly prohibited.",
    num: "01",
  },
  {
    icon: ShieldCheck,
    title: "Be safe & boundaried",
    body: "Sessions happen online only. Never share personal contact details, home addresses, or social media handles.",
    num: "02",
  },
  {
    icon: MessageSquare,
    title: "Be kind & patient",
    body: "Learning requires vulnerability. Encourage others, provide constructive explanations, and celebrate progress.",
    num: "03",
  },
  {
    icon: Lock,
    title: "Protect learner privacy",
    body: "Do not share or record session content without consent. Data is handled per our child-safe Privacy Policy.",
    num: "04",
  },
];

const safetyLifecycle = [
  {
    step: "01",
    title: "Credential & Identity Screening",
    desc: "Every volunteer tutor submits verified school report cards, GPAs, and passes 5 safeguarding modules before ever hosting a workshop.",
    icon: ClipboardCheck,
    color: "#059669",
    bg: "#ecfdf5",
  },
  {
    step: "02",
    title: "Gated Zoom Waiting Rooms",
    desc: "All workshops run inside secure, private Zoom rooms with host waiting rooms enabled. No anonymous participants can enter.",
    icon: Monitor,
    color: "#0284c7",
    bg: "#e0f2fe",
  },
  {
    step: "03",
    title: "Parental Observation Welcome",
    desc: "Parents and guardians can observe any session at any time. For students below Grade 9, parents maintain administrative account custody.",
    icon: HeartHandshake,
    color: "#7c3aed",
    bg: "#f5f3ff",
  },
  {
    step: "04",
    title: "Audit Logging & Fast Response",
    desc: "Every session attendance, message, and feedback score is timestamped. Reports are reviewed by our safety panel within 24 hours.",
    icon: AlertTriangle,
    color: "#ea580c",
    bg: "#fff7ed",
  },
];

export default function SafetyPage() {
  return (
    <main className={styles.main}>
      {/* Return to Dashboard Navigation Bar */}
      <div className={styles.navBar}>
        <div className={styles.navBarInner}>
          <Link href="/dashboard" className={styles.backLink}>
            <ArrowLeft size={16} />
            <span>Return to Workspace Dashboard</span>
          </Link>
          <Link href="/safety/report" className={styles.reportHeaderLink}>
            <ShieldAlert size={14} />
            <span>Report a Safety Concern</span>
          </Link>
        </div>
      </div>

      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.heroBadge}>
            <ShieldCheck size={14} />
            <span>Zero-Tolerance Safeguarding Protocol</span>
          </div>
          <h1 className={styles.title}>Safety &amp; Safeguarding</h1>
          <p className={styles.subtitle}>
            Learnivia is built on the founding principle that safe learning is effective
            learning. We protect every K-12 student and volunteer tutor through multi-layered screening,
            guardian oversight, and encrypted sessions.
          </p>

          {/* Quick Value Metrics Bar */}
          <div className={styles.heroStatsRow}>
            <div className={styles.heroStatCard}>
              <div className={styles.statIconWrap} style={{ background: "#ecfdf5", color: "#059669" }}>
                <Monitor size={18} />
              </div>
              <div>
                <strong className={styles.statValue}>100%</strong>
                <span className={styles.statLabel}>Zoom Waiting Rooms</span>
              </div>
            </div>

            <div className={styles.heroStatCard}>
              <div className={styles.statIconWrap} style={{ background: "#e0f2fe", color: "#0284c7" }}>
                <ClipboardCheck size={18} />
              </div>
              <div>
                <strong className={styles.statValue}>5 Modules</strong>
                <span className={styles.statLabel}>Mandatory Training</span>
              </div>
            </div>

            <div className={styles.heroStatCard}>
              <div className={styles.statIconWrap} style={{ background: "#fef3c7", color: "#d97706" }}>
                <ShieldCheck size={18} />
              </div>
              <div>
                <strong className={styles.statValue}>&lt;24 Hours</strong>
                <span className={styles.statLabel}>Moderation Response SLA</span>
              </div>
            </div>

            <div className={styles.heroStatCard}>
              <div className={styles.statIconWrap} style={{ background: "#f5f3ff", color: "#7c3aed" }}>
                <Users size={18} />
              </div>
              <div>
                <strong className={styles.statValue}>K-12 &amp; Prep</strong>
                <span className={styles.statLabel}>Protected Scope</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className={styles.inner}>
        {/* Safety Lifecycle Timeline */}
        <section className={styles.section} id="lifecycle">
          <div className={styles.sectionHeadingWrap}>
            <span className={styles.subBadge}>Multi-Layered Architecture</span>
            <h2 className={styles.sectionTitle}>The 4-Step Safety Lifecycle</h2>
            <p className={styles.sectionIntro}>
              Every lesson and interaction follows our strict four-step safeguarding framework.
            </p>
          </div>

          <div className={styles.lifecycleGrid}>
            {safetyLifecycle.map((item) => (
              <div key={item.step} className={styles.lifecycleCard}>
                <div className={styles.lifecycleHeader}>
                  <span className={styles.stepBadge}>{item.step}</span>
                  <div
                    className={styles.lifecycleIcon}
                    style={{ background: item.bg, color: item.color }}
                  >
                    <item.icon size={20} />
                  </div>
                </div>
                <h3 className={styles.lifecycleTitle}>{item.title}</h3>
                <p className={styles.lifecycleDesc}>{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Mascot Safety Companion Banner */}
        <div className={styles.mascotCallout}>
          <div className={styles.mascotImgWrap}>
            <img
              src="/images/new_mascots/mascot-7.jpeg"
              alt="Learnivia Safety Mascot"
              className={styles.mascotSafetyImg}
              width={80}
              height={80}
            />
          </div>
          <div className={styles.mascotContent}>
            <h3 className={styles.mascotCalloutTitle}>
              You Are Always in Control of Your Learning Experience
            </h3>
            <p className={styles.mascotCalloutText}>
              "If anything during a session makes you feel uncomfortable or uncertain, you are fully
              empowered to leave the Zoom room immediately. Our team investigates every flagged
              concern within 24 hours with zero repercussions to students."
            </p>
            <div className={styles.mascotFooterTag}>
              <span>— Learnivia Safeguarding &amp; Academic Board</span>
            </div>
          </div>
        </div>

        {/* Community Guidelines */}
        <section className={styles.section} id="guidelines">
          <div className={styles.sectionHeadingWrap}>
            <span className={styles.subBadge}>Code of Conduct</span>
            <h2 className={styles.sectionTitle}>Community Standards</h2>
            <p className={styles.sectionIntro}>
              Every Learnivia student, parent, and volunteer tutor commits to these standards upon registration.
            </p>
          </div>

          <div className={styles.guidelinesGrid}>
            {guidelines.map((g) => (
              <div key={g.title} className={styles.guideCard}>
                <div className={styles.guideNumBadge}>{g.num}</div>
                <div className={styles.guideIconWrap} aria-hidden="true">
                  <g.icon size={22} style={{ color: "#1b4d3e" }} />
                </div>
                <div className={styles.guideTextWrap}>
                  <h3 className={styles.guideTitle}>{g.title}</h3>
                  <p className={styles.guideBody}>{g.body}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Report a concern */}
        <section className={styles.section} id="report">
          <div className={styles.reportCard}>
            <div style={{ flex: 1 }}>
              <div className={styles.reportTitleRow}>
                <ShieldAlert size={24} style={{ color: "#dc2626" }} aria-hidden="true" />
                <h3 className={styles.reportTitleHeading}>
                  Notice something that didn&apos;t feel right?
                </h3>
              </div>
              <p className={styles.reportText}>
                If you experienced or witnessed anything that violated our community guidelines
                (during a live Zoom session, in messages, or on a profile), report it immediately.
                Our dedicated trust and safety team will take swift, confidential action.
              </p>
              <div className={styles.reportNote}>
                <strong>Safeguarding advisory:</strong> If you believe someone is in immediate danger,
                please contact your local emergency services first.
              </div>
            </div>
            <div className={styles.reportActions}>
              <Link href="/safety/report" className={styles.reportBtn}>
                <ShieldAlert size={16} aria-hidden="true" />
                <span>Submit an In-App Safety Report</span>
              </Link>
              <a href="mailto:safety@learnivia.app" className={styles.emailLink}>
                Or email safety@learnivia.app
              </a>
              <p className={styles.reportSubnote}>
                All incident reports are reviewed by our moderation staff within 24 hours.
              </p>
            </div>
          </div>
        </section>

        {/* Privacy Principles */}
        <section className={styles.section} id="privacy">
          <div className={styles.sectionHeadingWrap}>
            <span className={styles.subBadge}>Data Protection</span>
            <h2 className={styles.sectionTitle}>Privacy Principles</h2>
          </div>
          <ul className={styles.privacyList}>
            <li>We collect only the minimal data necessary to match learners with qualified peer tutors.</li>
            <li>We never sell, rent, or commercialize student data or academic records to third parties.</li>
            <li>Session video is never recorded without explicit parental consent.</li>
            <li>You can request complete deletion of your account and personal records at any time.</li>
          </ul>
          <div className={styles.legalLinks}>
            <Link href="/privacy" className={styles.legalLink}>
              Full Privacy Policy <ArrowRight size={14} />
            </Link>
            <Link href="/terms" className={styles.legalLink}>
              Terms of Service <ArrowRight size={14} />
            </Link>
            <Link href="/cookies" className={styles.legalLink}>
              Cookie Policy <ArrowRight size={14} />
            </Link>
          </div>
        </section>

        {/* For parents */}
        <section className={styles.section}>
          <div className={styles.parentCta}>
            <span className={styles.parentCtaBadge}>Guardian Portal</span>
            <h2 className={styles.parentCtaTitle}>For Parents &amp; Guardians</h2>
            <p className={styles.parentCtaSubtitle}>
              Learnivia is designed with family transparency at its core. Read our dedicated parent guide
              explaining account management, session observation, and safety best practices.
            </p>
            <div className={styles.parentCtaButtons}>
              <Link href="/parents" className={styles.outlineBtn}>
                Read Guardian Guide <ArrowRight size={15} />
              </Link>
              <Link href="/dashboard" className={styles.primaryBtn}>
                <span>Return to Dashboard</span>
                <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
