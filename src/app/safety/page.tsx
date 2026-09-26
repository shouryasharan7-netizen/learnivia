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
    "How Learnivia keeps sessions safe: community guidelines, reporting, session rules, and guardian oversight for K-10 learners.",
};

const guidelines = [
  {
    icon: Users,
    title: "Be respectful",
    body: "Treat everyone with courtesy. Discriminatory, harassing, or abusive language is strictly prohibited.",
  },
  {
    icon: ShieldCheck,
    title: "Be safe & boundaried",
    body: "Sessions happen online only. Never share personal contact details, home addresses, or social media handles.",
  },
  {
    icon: MessageSquare,
    title: "Be kind & patient",
    body: "Learning requires vulnerability. Encourage others, provide constructive explanations, and celebrate progress.",
  },
  {
    icon: Lock,
    title: "Protect your privacy",
    body: "Do not share or record session content without consent. Data is handled per our child-safe Privacy Policy.",
  },
];

export default function SafetyPage() {
  return (
    <main className={styles.main}>
      {/* Return to Dashboard Navigation Bar */}
      <div
        style={{
          background: "var(--wa-white, #FFFFFF)",
          borderBottom: "1px solid var(--wa-border, #E2E8F0)",
          padding: "0.75rem 1.5rem",
          position: "sticky",
          top: 0,
          zIndex: 40,
          boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
        }}
      >
        <div
          style={{
            maxWidth: "1080px",
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "0.5rem",
          }}
        >
          <Link
            href="/dashboard"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.4rem",
              fontSize: "0.875rem",
              fontWeight: 600,
              color: "var(--wa-green, #2563EB)",
              textDecoration: "none",
            }}
          >
            <ArrowLeft size={16} />
            <span>Return to Workspace Dashboard</span>
          </Link>
          <Link
            href="/safety/report"
            style={{
              fontSize: "0.8125rem",
              fontWeight: 600,
              color: "#DC2626",
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.35rem",
            }}
          >
            <ShieldAlert size={14} />
            <span>Report a Safety Concern</span>
          </Link>
        </div>
      </div>

      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.heroIconWrap} aria-hidden="true">
            <ShieldCheck size={40} style={{ color: "var(--wa-forest)" }} />
          </div>
          <h1 className={styles.title}>Safety & Safeguarding</h1>
          <p className={styles.subtitle}>
            Learnivia is built on the principle that safe learning is effective
            learning. Here is exactly how we protect every student and mentor.
          </p>
        </div>
      </section>

      <div className={styles.inner}>
        {/* How sessions work */}
        <section className={styles.section} id="sessions">
          <h2 className={styles.sectionTitle}>How sessions are kept safe</h2>
          <div className={styles.infoGrid}>
            <div className={styles.infoCard}>
              <div className={styles.infoIconWrap}>
                <Monitor
                  size={20}
                  style={{ color: "var(--wa-forest)" }}
                  aria-hidden="true"
                />
              </div>
              <h3>Online-only sessions</h3>
              <p>
                All sessions happen via secure Zoom video calls with waiting
                rooms enabled. No in-person meetings are ever arranged or
                endorsed.
              </p>
            </div>
            <div className={styles.infoCard}>
              <div className={styles.infoIconWrap}>
                <ClipboardCheck
                  size={20}
                  style={{ color: "var(--wa-forest)" }}
                  aria-hidden="true"
                />
              </div>
              <h3>Tutor credential review</h3>
              <p>
                Every volunteer applicant submits academic credentials,
                completes 5 mandatory safeguarding modules, and is vetted by our
                team.
              </p>
            </div>
            <div className={styles.infoCard}>
              <div className={styles.infoIconWrap}>
                <AlertTriangle
                  size={20}
                  style={{ color: "var(--wa-forest)" }}
                  aria-hidden="true"
                />
              </div>
              <h3>Clear reporting path</h3>
              <p>
                Any learner or parent can report a concern at any time. Reports
                are investigated by moderation staff within 24 hours.
              </p>
            </div>
            <div className={styles.infoCard}>
              <div className={styles.infoIconWrap}>
                <HeartHandshake
                  size={20}
                  style={{ color: "var(--wa-forest)" }}
                  aria-hidden="true"
                />
              </div>
              <h3>Guardian transparency</h3>
              <p>
                Parents manage minor accounts below Grade 9 and are warmly
                encouraged to supervise or sit nearby during learning sessions.
              </p>
            </div>
          </div>
        </section>

        {/* Community Guidelines */}
        <section className={styles.section} id="guidelines">
          <h2 className={styles.sectionTitle}>Community guidelines</h2>
          <p className={styles.sectionIntro}>
            Every Learnivia member commits to these standards upon registration.
          </p>
          <div className={styles.guidelinesGrid}>
            {guidelines.map((g) => (
              <div key={g.title} className={styles.guideCard}>
                <div className={styles.guideIconWrap} aria-hidden="true">
                  <g.icon size={20} style={{ color: "var(--wa-forest)" }} />
                </div>
                <div>
                  <h3 className={styles.guideTitle}>{g.title}</h3>
                  <p className={styles.guideBody}>{g.body}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Report a concern */}
        <section className={styles.section} id="report">
          <h2 className={styles.sectionTitle}>Report a concern</h2>
          <div className={styles.reportCard}>
            <div style={{ flex: 1 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  marginBottom: "0.5rem",
                }}
              >
                <ShieldAlert
                  size={20}
                  style={{ color: "var(--wa-terracotta)" }}
                  aria-hidden="true"
                />
                <h3
                  style={{
                    margin: 0,
                    fontFamily: "var(--font-serif)",
                    fontSize: "1.2rem",
                    fontWeight: 700,
                    color: "var(--wa-ink)",
                  }}
                >
                  Notice something that didn&apos;t feel right?
                </h3>
              </div>
              <p
                style={{
                  fontSize: "0.95rem",
                  color: "var(--wa-ink)",
                  lineHeight: 1.6,
                  marginBottom: "1rem",
                }}
              >
                If you experienced or witnessed anything that violated our
                community guidelines (during a session, in messages, or on a
                profile), report it immediately.
              </p>
              <div className={styles.reportNote}>
                <strong>Safeguarding advisory:</strong> If you believe someone
                is in immediate danger, contact your local emergency services
                first.
              </div>
            </div>
            <div className={styles.reportActions}>
              <Link href="/safety/report" className={styles.reportBtn}>
                <ShieldAlert size={16} aria-hidden="true" />
                <span>Submit an In-App Safety Report</span>
              </Link>
              <a
                href="mailto:safety@learnivia.app"
                className={styles.emailLink}
              >
                Or email safety@learnivia.app
              </a>
              <p className={styles.reportSubnote}>
                All reports are investigated by our moderation team within 24
                hours.
              </p>
            </div>
          </div>
        </section>

        {/* Privacy Principles */}
        <section className={styles.section} id="privacy">
          <h2 className={styles.sectionTitle}>Privacy principles</h2>
          <ul className={styles.privacyList}>
            <li>
              We collect only the data necessary to match learners with
              qualified tutors.
            </li>
            <li>We never sell, rent, or commercialize student data.</li>
            <li>
              Session video is never recorded without explicit parental consent.
            </li>
            <li>
              You can request complete deletion of your account and records at
              any time.
            </li>
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
            <h2>For parents &amp; guardians</h2>
            <p>
              Read our dedicated parent guide explaining account management,
              session observation, and safety best practices.
            </p>
            <div
              style={{
                display: "flex",
                gap: "0.75rem",
                justifyContent: "center",
                flexWrap: "wrap",
                marginTop: "1rem",
              }}
            >
              <Link href="/parents" className={styles.outlineBtn}>
                Read guardian guide <ArrowRight size={15} />
              </Link>
              <Link
                href="/dashboard"
                style={{
                  background: "var(--wa-green, #2563EB)",
                  color: "#FFFFFF",
                  padding: "0.75rem 1.5rem",
                  borderRadius: "6px",
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  textDecoration: "none",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.4rem",
                }}
              >
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
