import styles from "./page.module.css";
import Image from "next/image";
import Link from "next/link";

export default function HowItWorksPage() {
  return (
    <main className={styles.main}>
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.title}>How Learnivia Works</h1>
          <p className={styles.subtitle}>
            A vibrant community of volunteer tutors and eager learners connecting across the globe.
          </p>
        </div>
      </section>

      <section className={styles.stepsSection}>
        <h2 className={styles.sectionTitle}>For Students</h2>
        <div className={styles.stepsGrid}>
          <div className={styles.stepCard}>
            <div className={styles.stepNumber}>1</div>
            <h3>Create an Account</h3>
            <p>Sign up and tell us what you need help with. It's completely free, forever.</p>
          </div>
          <div className={styles.stepCard}>
            <div className={styles.stepNumber}>2</div>
            <h3>Find a Tutor</h3>
            <p>Browse our list of certified volunteer tutors based on subjects and availability.</p>
          </div>
          <div className={styles.stepCard}>
            <div className={styles.stepNumber}>3</div>
            <h3>Book & Learn</h3>
            <p>Book a free 1-on-1 session. Meet online via Zoom and get the personalized help you deserve.</p>
          </div>
        </div>
        <div className={styles.ctaWrapper}>
          <Link href="/find" className={styles.primaryBtn}>Find a Tutor Now</Link>
        </div>
      </section>

      <section className={`${styles.stepsSection} ${styles.altSection}`}>
        <h2 className={styles.sectionTitle}>For Tutors</h2>
        <div className={styles.stepsGrid}>
          <div className={styles.stepCard}>
            <div className={styles.stepNumber}>1</div>
            <h3>Apply</h3>
            <p>Fill out our short application form to tell us about your expertise and background.</p>
          </div>
          <div className={styles.stepCard}>
            <div className={styles.stepNumber}>2</div>
            <h3>Get Certified</h3>
            <p>Our team will review your application to ensure a safe, high-quality community.</p>
          </div>
          <div className={styles.stepCard}>
            <div className={styles.stepNumber}>3</div>
            <h3>Make an Impact</h3>
            <p>Set your availability and start helping students while earning verified volunteer hours!</p>
          </div>
        </div>
        <div className={styles.ctaWrapper}>
          <Link href="/apply" className={styles.secondaryBtn}>Apply to be a Tutor</Link>
        </div>
      </section>
    </main>
  );
}
