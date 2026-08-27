import Link from "next/link";
import Image from "next/image";
import styles from "./page.module.css";

export default function Home() {
  return (
    <main className={styles.main}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
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
        </div>
      </section>

      {/* How It Works Section */}
      <section className={styles.howItWorks}>
        <h2 className={styles.sectionTitle}>How It Works for Students</h2>
        <div className={styles.stepsGrid}>
          <div className={styles.stepCard}>
            <Image src="/images/find-a-tutor.png" alt="Find a tutor mascot" width={100} height={120} className={styles.mascotImg} />
            <div className={styles.stepNumber}>1</div>
            <h3>Find</h3>
            <p>Choose your grade and subject.</p>
          </div>
          <div className={styles.stepCard}>
            <Image src="/images/book-a-session.png" alt="Book a session mascot" width={100} height={120} className={styles.mascotImg} />
            <div className={styles.stepNumber}>2</div>
            <h3>Choose & Book</h3>
            <p>Browse tutors and choose an available date and time.</p>
          </div>
          <div className={styles.stepCard}>
            <Image src="/images/join-zoom.png" alt="Join Zoom mascot" width={100} height={120} className={styles.mascotImg} />
            <div className={styles.stepNumber}>3</div>
            <h3>Learn</h3>
            <p>Meet your tutor online through Zoom.</p>
          </div>
          <div className={styles.stepCard}>
            <Image src="/images/session-complete.png" alt="Session complete mascot" width={100} height={120} className={styles.mascotImg} />
            <div className={styles.stepNumber}>4</div>
            <h3>Complete</h3>
            <p>Finish your session and book again!</p>
          </div>
        </div>
      </section>
      
      {/* Tutor Call To Action */}
      <section className={styles.tutorCta}>
        <div className={styles.tutorCard}>
          <Image src="/images/become-a-tutor.png" alt="Become a tutor mascot" width={150} height={180} className={styles.ctaMascot} />
          <h2>Want to make an impact?</h2>
          <p>Join Learnivia as a volunteer tutor and help students around the world.</p>
          <Link href="/apply" className={styles.primaryBtn}>
            Apply to Tutor
          </Link>
        </div>
      </section>
    </main>
  );
}
