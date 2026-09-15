import styles from "./page.module.css";
import Link from "next/link";
import { ArrowRight, Search, CalendarCheck, Video, Award, ShieldCheck, HeartHandshake } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "How Learnivia Works — Free K–10 Peer Tutoring",
  description: "Learn how Learnivia connects verified student tutors with K–10 learners for free 1-on-1 Zoom tutoring sessions.",
};

export default function HowItWorksPage() {
  return (
    <main className={styles.main}>
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <span className={styles.badge}>Three Clear Pathways</span>
          <h1 className={styles.title}>How Learnivia Works</h1>
          <p className={styles.subtitle}>
            A free, volunteer-powered learning commons connecting passionate student tutors with K–10 learners across the globe.
          </p>
        </div>
      </section>

      {/* Pathway 1: For Parents & Guardians */}
      <section className={styles.stepsSection}>
        <div className={styles.sectionHeader}>
          <span className={styles.pathwayTag}>Pathway 1</span>
          <h2 className={styles.sectionTitle}>For Parents &amp; Guardians</h2>
          <p className={styles.sectionLead}>
            Full oversight of your child&apos;s learning journey, private accounts, and safe online sessions.
          </p>
        </div>

        <div className={styles.stepsGrid}>
          <div className={styles.stepCard}>
            <div className={styles.stepIconWrap}>
              <ShieldCheck size={22} style={{ color: "var(--wa-forest)" }} aria-hidden="true" />
            </div>
            <div className={styles.stepNumber}>01</div>
            <h3>Manage Child Profiles</h3>
            <p>Create a parent account to safely manage profiles for learners below Grade 9. Personal data is never public.</p>
          </div>

          <div className={styles.stepCard}>
            <div className={styles.stepIconWrap}>
              <Search size={22} style={{ color: "var(--wa-forest)" }} aria-hidden="true" />
            </div>
            <div className={styles.stepNumber}>02</div>
            <h3>Filter Approved Tutors</h3>
            <p>Select your child&apos;s exact grade band. Only tutors with verified qualifications in that curriculum appear.</p>
          </div>

          <div className={styles.stepCard}>
            <div className={styles.stepIconWrap}>
              <HeartHandshake size={22} style={{ color: "var(--wa-forest)" }} aria-hidden="true" />
            </div>
            <div className={styles.stepNumber}>03</div>
            <h3>Supervise &amp; Verify</h3>
            <p>Sit in or supervise private Zoom sessions. Confirm attendance in one click to complete session records.</p>
          </div>
        </div>

        <div className={styles.ctaWrapper}>
          <Link href="/parents" className={styles.primaryBtn}>
            Read Guardian Guide <ArrowRight size={15} />
          </Link>
        </div>
      </section>

      {/* Pathway 2: For Learners */}
      <section className={`${styles.stepsSection} ${styles.altSection}`}>
        <div className={styles.sectionHeader}>
          <span className={styles.pathwayTag}>Pathway 2</span>
          <h2 className={styles.sectionTitle}>For K–10 Learners</h2>
          <p className={styles.sectionLead}>
            Patient peer tutors who explain concepts your way &mdash; with zero fees, no tests to qualify, and no judgment.
          </p>
        </div>

        <div className={styles.stepsGrid}>
          <div className={styles.stepCard}>
            <div className={styles.stepIconWrap}>
              <Search size={22} style={{ color: "var(--wa-forest)" }} aria-hidden="true" />
            </div>
            <div className={styles.stepNumber}>01</div>
            <h3>Pick Your Subject</h3>
            <p>Browse math, reading, science, or learning support. Read tutor bios and see subjects they love teaching.</p>
          </div>

          <div className={styles.stepCard}>
            <div className={styles.stepIconWrap}>
              <CalendarCheck size={22} style={{ color: "var(--wa-forest)" }} aria-hidden="true" />
            </div>
            <div className={styles.stepNumber}>02</div>
            <h3>Book an Open Slot</h3>
            <p>Select a 30–60 min slot that fits your schedule. Describe your homework topic so your tutor can prepare.</p>
          </div>

          <div className={styles.stepCard}>
            <div className={styles.stepIconWrap}>
              <Video size={22} style={{ color: "var(--wa-forest)" }} aria-hidden="true" />
            </div>
            <div className={styles.stepNumber}>03</div>
            <h3>Meet on Zoom</h3>
            <p>Launch your secure 1-on-1 Zoom call directly from your Learnivia dashboard. Share screens and solve problems together.</p>
          </div>
        </div>

        <div className={styles.ctaWrapper}>
          <Link href="/find" className={styles.primaryBtn}>
            Find a Tutor &mdash; It&apos;s Free <ArrowRight size={15} />
          </Link>
        </div>
      </section>

      {/* Pathway 3: For Volunteer Tutors */}
      <section className={styles.stepsSection}>
        <div className={styles.sectionHeader}>
          <span className={styles.pathwayTag}>Pathway 3</span>
          <h2 className={styles.sectionTitle}>For Volunteer Student Tutors</h2>
          <p className={styles.sectionLead}>
            Earn official community service hours with automated verifiable transcripts while mentoring younger peers.
          </p>
        </div>

        <div className={styles.stepsGrid}>
          <div className={styles.stepCard}>
            <div className={styles.stepIconWrap}>
              <ShieldCheck size={22} style={{ color: "var(--wa-forest)" }} aria-hidden="true" />
            </div>
            <div className={styles.stepNumber}>01</div>
            <h3>Apply with Credentials</h3>
            <p>High school (Grade 11+) and university students submit academic report cards and subject qualifications.</p>
          </div>

          <div className={styles.stepCard}>
            <div className={styles.stepIconWrap}>
              <Award size={22} style={{ color: "var(--wa-forest)" }} aria-hidden="true" />
            </div>
            <div className={styles.stepNumber}>02</div>
            <h3>Complete Safeguarding Training</h3>
            <p>Finish our 5 mandatory interactive modules on online boundaries, learning styles, and Zoom practices.</p>
          </div>

          <div className={styles.stepCard}>
            <div className={styles.stepIconWrap}>
              <CalendarCheck size={22} style={{ color: "var(--wa-forest)" }} aria-hidden="true" />
            </div>
            <div className={styles.stepNumber}>03</div>
            <h3>Tutor &amp; Download Records</h3>
            <p>Set weekly availability, host sessions, and download certified service transcripts with verification codes.</p>
          </div>
        </div>

        <div className={styles.ctaWrapper}>
          <Link href="/apply" className={styles.secondaryBtn}>
            Apply to Tutor <ArrowRight size={15} />
          </Link>
        </div>
      </section>
    </main>
  );
}
