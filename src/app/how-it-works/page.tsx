"use client";

import styles from "./page.module.css";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Search,
  CalendarCheck,
  Video,
  ShieldCheck,
  HeartHandshake,
  UserPlus,
  BookOpen,
  CheckCircle2,
  Lock,
} from "lucide-react";

export default function HowItWorksPage() {
  return (
    <main className={styles.main}>
      <section className={styles.hero}>
        <motion.div
          className={styles.heroContent}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className={styles.badge}>Three Clear Pathways</span>
          <h1 className={styles.title}>How Learnivia Works</h1>
          <p className={styles.subtitle}>
            A free, volunteer-powered learning commons connecting passionate
            student tutors with K-10 learners across the globe.
          </p>
        </motion.div>
      </section>

      {/* Pathway 1: For Learners */}
      <section className={styles.stepsSection}>
        <div className={styles.sectionHeader}>
          <span className={styles.pathwayTag}>Pathway 1</span>
          <h2 className={styles.sectionTitle}>Student Flow</h2>
          <p className={styles.sectionLead}>
            Patient peer tutors who explain concepts your way, with zero fees,
            no tests to qualify, and no judgment.
          </p>
        </div>

        <div className={styles.timelineContainer}>
          {/* Step 1 */}
          <motion.div
            className={styles.timelineRow}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className={styles.timelineContent}>
              <div className={styles.stepIconWrap}>
                <Search size={26} aria-hidden="true" />
              </div>
              <div className={styles.stepNumber}>Step 01</div>
              <h3>Pick Your Subject</h3>
              <p>
                Browse math, reading, science, or learning support. Read tutor
                bios, verified GPA marks, and subjects they love teaching.
              </p>
            </div>
            <div className={styles.timelineImage}>
              <div className={styles.stepImageCard}>
                <Image
                  src="/images/find-a-tutor.png"
                  alt="Student choosing a tutor and subject"
                  width={500}
                  height={375}
                  className={styles.stepImg}
                  priority
                />
              </div>
            </div>
          </motion.div>

          {/* Step 2 */}
          <motion.div
            className={`${styles.timelineRow} ${styles.reverse}`}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className={styles.timelineContent}>
              <div className={styles.stepIconWrap}>
                <CalendarCheck size={26} aria-hidden="true" />
              </div>
              <div className={styles.stepNumber}>Step 02</div>
              <h3>Book an Open Slot</h3>
              <p>
                Select a 30-60 min slot that fits your schedule. Describe your
                homework topic or test goals so your mentor prepares ahead.
              </p>
            </div>
            <div className={styles.timelineImage}>
              <div className={styles.stepImageCard}>
                <Image
                  src="/images/book-a-session.png"
                  alt="Booking an open session slot"
                  width={500}
                  height={375}
                  className={styles.stepImg}
                />
              </div>
            </div>
          </motion.div>

          {/* Step 3 */}
          <motion.div
            className={styles.timelineRow}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className={styles.timelineContent}>
              <div className={styles.stepIconWrap}>
                <Video size={26} aria-hidden="true" />
              </div>
              <div className={styles.stepNumber}>Step 03</div>
              <h3>Learn &amp; Grow on Zoom</h3>
              <p>
                Join an isolated, secure Zoom room with passcode protection.
                Work through problems together with whiteboards and collaborative screen sharing.
              </p>
            </div>
            <div className={styles.timelineImage}>
              <div className={styles.stepImageCard}>
                <Image
                  src="/images/join-zoom.png"
                  alt="Interactive 1-on-1 tutoring session over Zoom"
                  width={500}
                  height={375}
                  className={styles.stepImg}
                />
              </div>
            </div>
          </motion.div>
        </div>

        <div className={styles.ctaWrapper}>
          <Link href="/find" className={styles.primaryBtn}>
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
            Gain teaching experience, earn verified volunteer hours, and make a
            global impact from your bedroom.
          </p>
        </div>

        <div className={styles.timelineContainer}>
          {/* Step 1 */}
          <motion.div
            className={`${styles.timelineRow} ${styles.reverse}`}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className={styles.timelineContent}>
              <div className={styles.stepIconWrap}>
                <UserPlus size={26} aria-hidden="true" />
              </div>
              <div className={styles.stepNumber}>Step 01</div>
              <h3>Get Certified</h3>
              <p>
                Pass our subject-knowledge tests, submit academic verification, and complete the mandatory
                child safeguarding module.
              </p>
            </div>
            <div className={styles.timelineImage}>
              <div className={styles.stepImageCard}>
                <Image
                  src="/images/become-a-tutor.png"
                  alt="Tutor onboarding and certification process"
                  width={500}
                  height={375}
                  className={styles.stepImg}
                />
              </div>
            </div>
          </motion.div>

          {/* Step 2 */}
          <motion.div
            className={styles.timelineRow}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className={styles.timelineContent}>
              <div className={styles.stepIconWrap}>
                <BookOpen size={26} aria-hidden="true" />
              </div>
              <div className={styles.stepNumber}>Step 02</div>
              <h3>Host Sessions</h3>
              <p>
                Set your availability calendar. Accept requests from K-10
                learners who need your specific expertise.
              </p>
            </div>
            <div className={styles.timelineImage}>
              <div className={styles.stepImageCard}>
                <Image
                  src="/images/session-complete.png"
                  alt="Hosting a peer tutoring session"
                  width={500}
                  height={375}
                  className={styles.stepImg}
                />
              </div>
            </div>
          </motion.div>

          {/* Step 3 */}
          <motion.div
            className={`${styles.timelineRow} ${styles.reverse}`}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className={styles.timelineContent}>
              <div className={styles.stepIconWrap}>
                <HeartHandshake size={26} aria-hidden="true" />
              </div>
              <div className={styles.stepNumber}>Step 03</div>
              <h3>Earn Verified Hours</h3>
              <p>
                After each successful session, receive tamper-evident volunteer hour
                certificates and official transcripts for college and NHS applications.
              </p>
            </div>
            <div className={styles.timelineImage}>
              <div className={styles.stepImageCard}>
                <Image
                  src="/images/volunteer-hours.png"
                  alt="Verified community service certificates and transcripts"
                  width={500}
                  height={375}
                  className={styles.stepImg}
                />
              </div>
            </div>
          </motion.div>
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
          <span className={styles.pathwayTag}>Trust &amp; Safety</span>
          <h2 className={styles.sectionTitle}>For Parents &amp; Guardians</h2>
          <p className={styles.sectionLead}>
            Full oversight of your child&apos;s learning journey, private guardian accounts,
            and safe online sessions.
          </p>
        </div>

        <div className={styles.timelineContainer}>
          <motion.div
            className={styles.timelineRow}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className={styles.timelineContent}>
              <div className={styles.stepIconWrap}>
                <ShieldCheck size={26} aria-hidden="true" />
              </div>
              <div className={styles.stepNumber}>01</div>
              <h3>Supervise &amp; Verify</h3>
              <p>
                Create a parent account to safely manage profiles for learners
                below Grade 9. Sit in or observe private Zoom sessions whenever you wish.
                Confirm attendance in one click to complete official session records.
              </p>
            </div>
            <div className={styles.timelineImage}>
              <div
                className={styles.stepImageCard}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  padding: "1.75rem",
                  justifyContent: "space-between",
                  background: "#ffffff",
                  border: "1px solid #e2e8f0",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    borderBottom: "1px solid #e2e8f0",
                    paddingBottom: "1rem",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                    <div
                      style={{
                        width: "36px",
                        height: "36px",
                        borderRadius: "8px",
                        background: "rgba(13, 148, 136, 0.1)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#0F766E",
                      }}
                    >
                      <ShieldCheck size={20} />
                    </div>
                    <div>
                      <h4 style={{ margin: 0, fontSize: "0.95rem", fontWeight: 700, color: "#0F172A" }}>
                        Parent Oversight Console
                      </h4>
                      <span style={{ fontSize: "0.75rem", color: "#64748B" }}>
                        Student Account: Active (Grade 6)
                      </span>
                    </div>
                  </div>
                  <span
                    style={{
                      fontSize: "0.72rem",
                      fontWeight: 700,
                      padding: "0.2rem 0.55rem",
                      borderRadius: "9999px",
                      background: "#ECFDF5",
                      color: "#047857",
                      border: "1px solid #A7F3D0",
                    }}
                  >
                    SECURE &amp; VERIFIED
                  </span>
                </div>

                <div style={{ padding: "0.85rem 0", display: "flex", flexDirection: "column", gap: "0.55rem" }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "0.65rem 0.85rem",
                      background: "#F8FAFC",
                      borderRadius: "6px",
                      fontSize: "0.85rem",
                      color: "#334155",
                    }}
                  >
                    <span>1-Click Parent Session Join (Zoom)</span>
                    <span style={{ color: "#059669", fontWeight: 600 }}>Enabled</span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "0.65rem 0.85rem",
                      background: "#F8FAFC",
                      borderRadius: "6px",
                      fontSize: "0.85rem",
                      color: "#334155",
                    }}
                  >
                    <span>Attendance Confirmation Receipt</span>
                    <span style={{ color: "#059669", fontWeight: 600 }}>Auto-Generated</span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "0.65rem 0.85rem",
                      background: "#F8FAFC",
                      borderRadius: "6px",
                      fontSize: "0.85rem",
                      color: "#334155",
                    }}
                  >
                    <span>Direct Contact Safeguard</span>
                    <span style={{ color: "#059669", fontWeight: 600 }}>Strict Platform Only</span>
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    fontSize: "0.78rem",
                    color: "#64748B",
                    paddingTop: "0.6rem",
                    borderTop: "1px solid #F1F5F9",
                  }}
                >
                  <Lock size={13} color="#059669" />
                  <span>All mentors pass mandatory child protection accreditation</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
