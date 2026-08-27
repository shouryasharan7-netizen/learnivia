import styles from "./page.module.css";
import Image from "next/image";
import Link from "next/link";

export default function AboutPage() {
  return (
    <main className={styles.main}>
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <Image src="/images/logo.png" alt="Learnivia Logo" width={80} height={80} className={styles.logo} />
          <h1 className={styles.title}>About Learnivia</h1>
          <p className={styles.subtitle}>
            Learnivia was built on a simple belief: everyone deserves access to high-quality education, regardless of their background or financial situation.
          </p>
        </div>
      </section>

      <section className={styles.contentSection}>
        <div className={styles.textBlock}>
          <h2>Our Mission</h2>
          <p>
            We connect passionate, knowledgeable volunteer tutors with students who need extra help but might not be able to afford expensive private tutoring. By leveraging the power of peer-to-peer learning and community, we aim to bridge the educational gap.
          </p>
        </div>

        <div className={styles.textBlock}>
          <h2>Why Volunteer?</h2>
          <p>
            Volunteering with Learnivia isn't just about teaching; it's about building a community. High school and university students can earn verified volunteer hours for their college applications while making a genuine impact on someone else's academic journey.
          </p>
          <ul className={styles.featureList}>
            <li>✔️ Gain leadership and communication skills</li>
            <li>✔️ Earn official volunteer hours</li>
            <li>✔️ Help students achieve their academic goals</li>
          </ul>
        </div>

        <div className={styles.ctaBox}>
          <h3>Join the Movement</h3>
          <p>Whether you need help or want to give help, there's a place for you here.</p>
          <div className={styles.btnGroup}>
            <Link href="/signin" className={styles.primaryBtn}>Sign Up Now</Link>
            <Link href="/apply" className={styles.secondaryBtn}>Apply to Tutor</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
