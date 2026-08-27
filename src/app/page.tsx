import Link from "next/link";
import styles from "./page.module.css";

export default function Home() {
  return (
    <main className={styles.main}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <h1 className={styles.title}>Free Online Tutoring. Personalized Support.</h1>
        <p className={styles.subtitle}>
          Find a volunteer tutor, choose a time that works for you, and meet one-on-one through Zoom — completely free.
        </p>
        <div className={styles.buttonGroup}>
          <Link href="/find" className={styles.primaryBtn}>
            Find a Tutor
          </Link>
          <Link href="/apply" className={styles.secondaryBtn}>
            Become a Volunteer Tutor
          </Link>
        </div>
      </section>

      {/* How It Works Section */}
      <section className={styles.howItWorks}>
        <h2 className={styles.sectionTitle}>How It Works for Students</h2>
        <div className={styles.stepsGrid}>
          <div className={styles.stepCard}>
            <div className={styles.stepNumber}>1</div>
            <h3>Find</h3>
            <p>Choose your grade and subject.</p>
          </div>
          <div className={styles.stepCard}>
            <div className={styles.stepNumber}>2</div>
            <h3>Choose</h3>
            <p>Browse tutors and read their profiles.</p>
          </div>
          <div className={styles.stepCard}>
            <div className={styles.stepNumber}>3</div>
            <h3>Book</h3>
            <p>Choose an available date and time.</p>
          </div>
          <div className={styles.stepCard}>
            <div className={styles.stepNumber}>4</div>
            <h3>Learn</h3>
            <p>Meet your tutor online through Zoom.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
