import styles from "./page.module.css";
import Link from "next/link";
import { ArrowRight, Search, CalendarCheck, Video, ShieldCheck, HeartHandshake, UserPlus, BookOpen } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "How Learnivia Works | Free K-10 Peer Tutoring",
  description: "Learn how Learnivia connects verified student tutors with K-10 learners for free 1-on-1 Zoom tutoring sessions.",
};

export default function HowItWorksPage() {
  return (
    <main className={styles.main}>
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <span className={styles.badge}>Three Clear Pathways</span>
          <h1 className={styles.title}>How Learnivia Works</h1>
          <p className={styles.subtitle}>
            A free, volunteer-powered learning commons connecting passionate student tutors with K-10 learners across the globe.
          </p>
        </div>
      </section>

      {/* Pathway 1: For Learners */}
      <section className={styles.stepsSection}>
        <div className={styles.sectionHeader}>
          <span className={styles.pathwayTag}>Pathway 1</span>
          <h2 className={styles.sectionTitle}>Student Flow</h2>
          <p className={styles.sectionLead}>
            Patient peer tutors who explain concepts your way, with zero fees, no tests to qualify, and no judgment.
          </p>
        </div>

        <div className={styles.timelineContainer}>
          {/* Step 1 */}
          <div className={styles.timelineRow}>
            <div className={styles.timelineContent}>
              <div className={styles.stepIconWrap}>
                <Search size={26} aria-hidden="true" />
              </div>
              <div className={styles.stepNumber}>Step 01</div>
              <h3>Pick Your Subject</h3>
              <p>Browse math, reading, science, or learning support. Read tutor bios and see subjects they love teaching.</p>
            </div>
            <div className={styles.timelineImage}>
              <div className={styles.imagePlaceholder}>
                <Search size={48} color="rgba(0,0,0,0.1)" />
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div className={`${styles.timelineRow} ${styles.reverse}`}>
            <div className={styles.timelineContent}>
              <div className={styles.stepIconWrap}>
                <CalendarCheck size={26} aria-hidden="true" />
              </div>
              <div className={styles.stepNumber}>Step 02</div>
              <h3>Book an Open Slot</h3>
              <p>Select a 30-60 min slot that fits your schedule. Describe your homework topic so your tutor can prepare.</p>
            </div>
            <div className={styles.timelineImage}>
              <div className={styles.imagePlaceholder}>
                <CalendarCheck size={48} color="rgba(0,0,0,0.1)" />
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className={styles.timelineRow}>
            <div className={styles.timelineContent}>
              <div className={styles.stepIconWrap}>
                <Video size={26} aria-hidden="true" />
              </div>
              <div className={styles.stepNumber}>Step 03</div>
              <h3>Learn & Grow</h3>
              <p>Join a secure, private Zoom room. Work through problems together using screen sharing and whiteboards.</p>
            </div>
            <div className={styles.timelineImage}>
              <div className={styles.imagePlaceholder}>
                <Video size={48} color="rgba(0,0,0,0.1)" />
              </div>
            </div>
          </div>
        </div>

        <div className={styles.ctaWrapper}>
          <Link href="/signin" className={styles.primaryBtn}>
            Find a Tutor <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* Pathway 2: For Tutors */}
      <section className={`${styles.stepsSection} ${styles.altSection}`}>
        <div className={styles.sectionHeader}>
          <span className={styles.pathwayTag}>Pathway 2</span>
          <h2 className={styles.sectionTitle}>Tutor Flow</h2>
          <p className={styles.sectionLead}>
            Gain teaching experience, earn verified volunteer hours, and make a global impact from your bedroom.
          </p>
        </div>

        <div className={styles.timelineContainer}>
          {/* Step 1 */}
          <div className={`${styles.timelineRow} ${styles.reverse}`}>
            <div className={styles.timelineContent}>
              <div className={styles.stepIconWrap}>
                <UserPlus size={26} aria-hidden="true" />
              </div>
              <div className={styles.stepNumber}>Step 01</div>
              <h3>Get Certified</h3>
              <p>Pass our subject-knowledge tests and complete the mandatory child safeguarding module.</p>
            </div>
            <div className={styles.timelineImage}>
              <div className={styles.imagePlaceholder}>
                <UserPlus size={48} color="rgba(255,255,255,0.1)" />
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div className={styles.timelineRow}>
            <div className={styles.timelineContent}>
              <div className={styles.stepIconWrap}>
                <BookOpen size={26} aria-hidden="true" />
              </div>
              <div className={styles.stepNumber}>Step 02</div>
              <h3>Host Sessions</h3>
              <p>Set your availability calendar. Accept requests from K-10 learners who need your specific expertise.</p>
            </div>
            <div className={styles.timelineImage}>
              <div className={styles.imagePlaceholder}>
                <BookOpen size={48} color="rgba(255,255,255,0.1)" />
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className={`${styles.timelineRow} ${styles.reverse}`}>
            <div className={styles.timelineContent}>
              <div className={styles.stepIconWrap}>
                <HeartHandshake size={26} aria-hidden="true" />
              </div>
              <div className={styles.stepNumber}>Step 03</div>
              <h3>Earn Verified Hours</h3>
              <p>After each successful session, receive verifiable volunteer hour certificates for college applications.</p>
            </div>
            <div className={styles.timelineImage}>
              <div className={styles.imagePlaceholder}>
                <HeartHandshake size={48} color="rgba(255,255,255,0.1)" />
              </div>
            </div>
          </div>
        </div>

        <div className={styles.ctaWrapper}>
          <Link href="/apply" className={styles.secondaryBtn}>
            Become a Tutor <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* Pathway 3: Trust & Safety */}
      <section className={styles.stepsSection}>
        <div className={styles.sectionHeader}>
          <span className={styles.pathwayTag}>Trust & Safety</span>
          <h2 className={styles.sectionTitle}>For Parents & Guardians</h2>
          <p className={styles.sectionLead}>
            Full oversight of your child's learning journey, private accounts, and safe online sessions.
          </p>
        </div>

        <div className={styles.timelineContainer}>
          <div className={styles.timelineRow}>
            <div className={styles.timelineContent}>
              <div className={styles.stepIconWrap}>
                <ShieldCheck size={26} aria-hidden="true" />
              </div>
              <div className={styles.stepNumber}>01</div>
              <h3>Supervise & Verify</h3>
              <p>Create a parent account to safely manage profiles for learners below Grade 9. Sit in or supervise private Zoom sessions. Confirm attendance in one click to complete session records.</p>
            </div>
            <div className={styles.timelineImage}>
              <div className={styles.imagePlaceholder}>
                <ShieldCheck size={48} color="rgba(0,0,0,0.1)" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
