"use client";
import styles from "./page.module.css";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

export default function AboutPage() {
  return (
    <main className={styles.main}>
      {/* Visual hero */}
      <section
        style={{
          background: "linear-gradient(135deg, #0a1628 0%, #1B4D3E 100%)",
          padding: "6rem 2rem 5rem",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Glow */}
        <div style={{ position: "absolute", top: "-20%", left: "50%", transform: "translateX(-50%)", width: "600px", height: "600px", borderRadius: "50%", background: "#1B4D3E", filter: "blur(120px)", opacity: 0.4, pointerEvents: "none" }} />

        <div style={{ position: "relative", zIndex: 2, maxWidth: "760px", margin: "0 auto" }}>
          <motion.div initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }} style={{ marginBottom: "1.5rem" }}>
            <Image
              src="/images/logo.png"
              alt="Learnivia Logo"
              width={72}
              height={72}
              style={{ borderRadius: "16px", boxShadow: "0 0 40px rgba(52,211,153,0.3)" }}
            />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
            style={{ fontSize: "clamp(2.5rem, 5vw, 3.8rem)", fontWeight: 800, color: "#fff", lineHeight: 1.1, letterSpacing: "-0.03em", margin: "0 0 1rem" }}
          >
            About{" "}
            <span style={{ background: "linear-gradient(135deg, #34D399, #60A5FA)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Learnivia</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.18 }}
            style={{ fontSize: "1.15rem", color: "rgba(255,255,255,0.75)", lineHeight: 1.65, maxWidth: "560px", margin: "0 auto 2rem" }}
          >
            Free, compassionate peer tutoring built for every K-12 learner,
            especially those who learn differently.
          </motion.p>
          {/* Visual stat pills */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.3 }}
            style={{ display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap" }}
          >
            {[
              { text: "12,400+ sessions", color: "#34D399" },
              { text: "47 countries", color: "#60A5FA" },
              { text: "Always free", color: "#FBBF24" },
              { text: "PVSA recognized", color: "#F472B6" },
            ].map((p) => (
              <span key={p.text} style={{ padding: "0.35rem 1rem", borderRadius: "9999px", fontSize: "0.8rem", fontWeight: 600, color: p.color, background: `${p.color}18`, border: `1px solid ${p.color}35` }}>{p.text}</span>
            ))}
          </motion.div>
        </div>
      </section>

      <section className={styles.contentSection}>
        <div className={styles.textBlock}>
          <h2>Our Story</h2>
          <p>
            Learnivia was founded with a simple, urgent conviction: every child
            in Kindergarten through Grade 10 deserves personalized,
            compassionate academic support, regardless of their income, learning
            style, or whether they&apos;ve ever received a formal diagnosis.
          </p>
          <p style={{ marginTop: "0.75rem" }}>
            We saw families spending hundreds of dollars per hour on private
            tutors, while students who learned differently (those who needed
            more time, visual explanations, step-by-step pacing, or frequent
            breaks) were left without options. Learnivia was built to change
            that.
          </p>
        </div>

        <div className={styles.textBlock}>
          <h2>Our Mission</h2>
          <p>
            Learnivia connects verified volunteer tutors with K-12 students for
            free, private 1-on-1 sessions. We are built on the belief that
            peer learning, when done with care and structure, can be
            transformative.
          </p>
          <p style={{ marginTop: "0.75rem" }}>
            We are specifically designed to welcome students who learn
            differently: visual learners, neurodiverse learners, students who
            benefit from extra processing time, repetition, or a patient tutor
            who will explain the same concept five different ways.{" "}
            <strong>No diagnosis required. No labels needed.</strong>
          </p>
        </div>

        <div className={styles.textBlock}>
          <h2>How It Works</h2>
          <ul className={styles.featureList}>
            <li className={styles.featureItem}>
              <CheckCircle2
                size={18}
                style={{ color: "var(--wa-forest)", flexShrink: 0 }}
                aria-hidden="true"
              />
              <span>
                Parents select their child&apos;s grade (K-12) and subject
              </span>
            </li>
            <li className={styles.featureItem}>
              <CheckCircle2
                size={18}
                style={{ color: "var(--wa-forest)", flexShrink: 0 }}
                aria-hidden="true"
              />
              <span>
                Only tutors approved for that grade band appear in search
                results
              </span>
            </li>
            <li className={styles.featureItem}>
              <CheckCircle2
                size={18}
                style={{ color: "var(--wa-forest)", flexShrink: 0 }}
                aria-hidden="true"
              />
              <span>
                Book a free, private 1-on-1 Zoom session with a verified
                volunteer tutor
              </span>
            </li>
            <li className={styles.featureItem}>
              <CheckCircle2
                size={18}
                style={{ color: "var(--wa-forest)", flexShrink: 0 }}
                aria-hidden="true"
              />
              <span>
                Sessions are logged for volunteer-hour verification, no
                recording without consent
              </span>
            </li>
            <li className={styles.featureItem}>
              <CheckCircle2
                size={18}
                style={{ color: "var(--wa-forest)", flexShrink: 0 }}
                aria-hidden="true"
              />
              <span>
                Tutors earn verified Volunteer Service Records with verifiable
                session IDs
              </span>
            </li>
          </ul>
        </div>

        <div className={styles.textBlock}>
          <h2>For Volunteer Tutors</h2>
          <p>
            Learnivia tutors are high school and university students who pass
            our academic review, complete 5 mandatory training modules
            (including safeguarding and Zoom best practices), and are approved
            by our admin team before hosting any sessions.
          </p>
          <p style={{ marginTop: "0.75rem" }}>
            Every completed session is automatically logged. Tutors can download
            a verified Volunteer Service Record with unique session verification
            IDs, suitable for school counselors, advisors, and community service
            recognition.
          </p>
        </div>

        <div className={styles.ctaBox}>
          <h3>Join Learnivia</h3>
          <p>
            Whether you need help or want to give back, there&apos;s a place for
            you here, always free.
          </p>
          <div className={styles.btnGroup}>
            <Link href="/signup" className={styles.primaryBtn}>
              Find a Free Tutor
            </Link>
            <Link href="/apply" className={styles.secondaryBtn}>
              Volunteer to Tutor
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
