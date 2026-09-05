import styles from "./page.module.css";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Learnivia — Free K\u201310 Volunteer Tutoring",
  description: "Learnivia provides free, compassionate 1-on-1 peer tutoring for K\u201310 students. Built to support all learners \u2014 including neurodiverse students and those who learn differently.",
};

export default function AboutPage() {
  return (
    <main className={styles.main}>
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <Image src="/images/logo.png" alt="Learnivia Logo" width={80} height={80} className={styles.logo} />
          <h1 className={styles.title}>About Learnivia</h1>
          <p className={styles.subtitle}>
            Free, compassionate peer tutoring built for every K&ndash;10 learner &mdash; especially those who learn differently.
          </p>
        </div>
      </section>

      <section className={styles.contentSection}>
        <div className={styles.textBlock}>
          <h2>Our Story</h2>
          <p>
            Learnivia was founded with a simple, urgent conviction: every child in Kindergarten through Grade 10
            deserves personalized, compassionate academic support &mdash; regardless of their income, learning style,
            or whether they&apos;ve ever received a formal diagnosis.
          </p>
          <p style={{ marginTop: "0.75rem" }}>
            We saw families spending hundreds of dollars per hour on private tutors, while students who learned
            differently &mdash; those who needed more time, visual explanations, step-by-step pacing, or frequent
            breaks &mdash; were left without options. Learnivia was built to change that.
          </p>
        </div>

        <div className={styles.textBlock}>
          <h2>Our Mission</h2>
          <p>
            Learnivia connects verified volunteer tutors with K&ndash;10 students for free, private 1-on-1 Zoom sessions.
            We are built on the belief that peer learning, when done with care and structure, can be transformative.
          </p>
          <p style={{ marginTop: "0.75rem" }}>
            We are specifically designed to welcome students who learn differently &mdash; visual learners,
            neurodiverse learners, students who benefit from extra processing time, repetition, or a patient tutor
            who will explain the same concept five different ways. <strong>No diagnosis required. No labels needed.</strong>
          </p>
        </div>

        <div className={styles.textBlock}>
          <h2>How It Works</h2>
          <ul className={styles.featureList}>
            <li>✔️ Parents select their child&apos;s grade (K&ndash;10) and subject</li>
            <li>✔️ Only tutors approved for that grade band appear in search results</li>
            <li>✔️ Book a free, private 1-on-1 Zoom session with a verified volunteer tutor</li>
            <li>✔️ Sessions are logged for volunteer-hour verification &mdash; no recording without consent</li>
            <li>✔️ Tutors earn official Volunteer Service Transcripts accepted by NHS and school advisors</li>
          </ul>
        </div>

        <div className={styles.textBlock}>
          <h2>For Volunteer Tutors</h2>
          <p>
            Learnivia tutors are high school and university students who pass our academic review, complete
            5 mandatory training modules (including safeguarding and Zoom best practices), and are approved
            by our admin team before hosting any sessions.
          </p>
          <p style={{ marginTop: "0.75rem" }}>
            Every completed session is automatically logged. Tutors can download an official Volunteer Service
            Transcript with unique session verification IDs &mdash; accepted by NHS chapters, school counselors,
            and community organizations.
          </p>
        </div>

        <div className={styles.ctaBox}>
          <h3>Join Learnivia</h3>
          <p>Whether you need help or want to give back, there&apos;s a place for you here &mdash; always free.</p>
          <div className={styles.btnGroup}>
            <Link href="/signup" className={styles.primaryBtn}>Find a Tutor &mdash; Free</Link>
            <Link href="/apply" className={styles.secondaryBtn}>Volunteer to Tutor</Link>
          </div>
        </div>
      </section>
    </main>
  );
}

