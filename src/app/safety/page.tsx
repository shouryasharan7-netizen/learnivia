import type { Metadata } from "next";
import Link from "next/link";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Safety & Trust",
  description: "How Learnivia keeps sessions safe: community guidelines, reporting, session rules, and guardian information.",
};

const guidelines = [
  { icon: "🤝", title: "Be respectful", body: "Treat everyone with courtesy. Discriminatory, harassing, or abusive language is never acceptable." },
  { icon: "🛡️", title: "Be safe", body: "Sessions happen online only. Never share personal contact details, home addresses, or social media handles." },
  { icon: "💬", title: "Be kind", body: "Learning requires vulnerability. Encourage others, give constructive feedback, and celebrate progress." },
  { icon: "🔒", title: "Protect your privacy", body: "Do not share or record session content without consent. Data is handled per our Privacy Policy." },
];

export default function SafetyPage() {
  return (
    <main>
      <section className={styles.hero}>
        <div className={styles.inner}>
          <div className={styles.heroIcon} aria-hidden="true">🛡️</div>
          <h1 className={styles.title}>Safety & Trust</h1>
          <p className={styles.subtitle}>
            Learnivia is built on the principle that safe learning is effective learning. Here's exactly how we protect every member of our community.
          </p>
        </div>
      </section>

      <div className={styles.inner}>
        {/* How sessions work */}
        <section className={styles.section} id="sessions">
          <h2 className={styles.sectionTitle}>How sessions are kept safe</h2>
          <div className={styles.infoGrid}>
            <div className={styles.infoCard}>
              <span className={styles.infoIcon} aria-hidden="true">💻</span>
              <h3>Online-only sessions</h3>
              <p>All sessions happen via Zoom video call. No in-person meetings are arranged or endorsed by Learnivia.</p>
            </div>
            <div className={styles.infoCard}>
              <span className={styles.infoIcon} aria-hidden="true">📋</span>
              <h3>Tutor application review</h3>
              <p>Every tutor applicant is reviewed by our team and must agree to our community guidelines before their first session.</p>
            </div>
            <div className={styles.infoCard}>
              <span className={styles.infoIcon} aria-hidden="true">⚠️</span>
              <h3>Clear reporting path</h3>
              <p>Any user can report a concern at any time. Reports are reviewed and acted upon by our moderation team.</p>
            </div>
            <div className={styles.infoCard}>
              <span className={styles.infoIcon} aria-hidden="true">👪</span>
              <h3>Guardian transparency</h3>
              <p>Parents and guardians can read our full safety guidance, and we encourage younger learners to have a trusted adult nearby during sessions.</p>
            </div>
          </div>
        </section>

        {/* Community Guidelines */}
        <section className={styles.section} id="guidelines">
          <h2 className={styles.sectionTitle}>Community guidelines</h2>
          <p className={styles.sectionIntro}>Every Learnivia member agrees to these guidelines when they join.</p>
          <div className={styles.guidelinesGrid}>
            {guidelines.map(g => (
              <div key={g.title} className={styles.guideCard}>
                <span className={styles.guideIcon} aria-hidden="true">{g.icon}</span>
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
            <div>
              <h3>Something didn't feel right?</h3>
              <p>If you experienced or witnessed anything that violated our community guidelines — including during a session, on a tutor profile, or in a booking — please let us know immediately.</p>
              <p className={styles.reportNote}>
                <strong>Urgent safeguarding concern?</strong> If you believe someone is in immediate danger, contact your local emergency services first.
              </p>
            </div>
            <div className={styles.reportActions}>
              <Link href="/safety/report" className={styles.reportBtn}>
                🛡️ Submit an In-App Safety Report
              </Link>
              <a href="mailto:safety@learnivia.app" style={{ fontSize: "0.85rem", color: "var(--color-text-muted)", textDecoration: "underline" }}>
                Or email safety@learnivia.app
              </a>
              <p className={styles.reportSubnote}>All reports are investigated by moderation staff within 24 hours.</p>
            </div>
          </div>
        </section>

        {/* Privacy */}
        <section className={styles.section} id="privacy">
          <h2 className={styles.sectionTitle}>Privacy principles</h2>
          <ul className={styles.privacyList}>
            <li>We collect only the data necessary to run the platform.</li>
            <li>We do not sell your data to third parties.</li>
            <li>Session content is not recorded by Learnivia.</li>
            <li>You can request deletion of your account and data at any time.</li>
          </ul>
          <div className={styles.legalLinks}>
            <Link href="/privacy">Full Privacy Policy →</Link>
            <Link href="/terms">Terms of Service →</Link>
            <Link href="/cookies">Cookie Policy →</Link>
          </div>
        </section>

        {/* For parents */}
        <section className={styles.section}>
          <div className={styles.parentCta}>
            <h2>For parents & guardians</h2>
            <p>We have a dedicated page explaining how Learnivia works, how sessions are supervised, and how to set up a safe learning environment for younger users.</p>
            <Link href="/parents" className={styles.outlineBtn}>Read our guardian guide →</Link>
          </div>
        </section>
      </div>
    </main>
  );
}
