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
  Sparkles,
  Globe,
  Zap,
} from "lucide-react";

export default function HowItWorksPage() {
  return (
    <main className={styles.main}>
      {/* VISUAL HERO — gradient + floating pills */}
      <section
        style={{
          background: "linear-gradient(135deg, #0a1628 0%, #112240 40%, #1B4D3E 100%)",
          padding: "6rem 2rem 5rem",
          position: "relative",
          overflow: "hidden",
          textAlign: "center",
        }}
      >
        {/* Animated glow orbs */}
        {["#34D399", "#60A5FA", "#F472B6"].map((color, i) => (
          <motion.div
            key={i}
            animate={{ scale: [1, 1.3, 1], opacity: [0.12, 0.2, 0.12] }}
            transition={{ duration: 6 + i * 2, repeat: Infinity, ease: "easeInOut", delay: i * 1.5 }}
            style={{
              position: "absolute",
              width: ["500px", "400px", "350px"][i],
              height: ["500px", "400px", "350px"][i],
              borderRadius: "50%",
              background: color,
              filter: "blur(120px)",
              top: ["−20%", "30%", "60%"][i],
              left: ["−10%", "60%", "10%"][i],
              pointerEvents: "none",
              zIndex: 0,
            }}
          />
        ))}

        {/* Grid texture */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />

        <div style={{ position: "relative", zIndex: 2, maxWidth: "800px", margin: "0 auto" }}>
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{ marginBottom: "1.5rem" }}
          >
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.4rem",
                fontFamily: "ui-monospace, monospace",
                fontSize: "0.7rem",
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "#34D399",
                background: "rgba(52,211,153,0.1)",
                border: "1px solid rgba(52,211,153,0.3)",
                borderRadius: "9999px",
                padding: "0.35rem 1rem",
              }}
            >
              <Sparkles size={12} />
              Three Clear Pathways
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            style={{
              fontSize: "clamp(2.8rem, 6vw, 4.5rem)",
              fontWeight: 800,
              color: "#fff",
              lineHeight: 1.05,
              letterSpacing: "-0.03em",
              margin: "0 0 1.25rem",
            }}
          >
            How{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #34D399, #60A5FA)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Learnivia
            </span>{" "}
            Works
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.18 }}
            style={{
              fontSize: "1.2rem",
              color: "rgba(255,255,255,0.75)",
              lineHeight: 1.65,
              maxWidth: "600px",
              margin: "0 auto 2.5rem",
            }}
          >
            A free, volunteer-powered learning commons connecting passionate
            student tutors with K-12 learners and test-prep students across the globe.
          </motion.p>

          {/* Floating subject pills */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            style={{ display: "flex", flexWrap: "wrap", gap: "0.6rem", justifyContent: "center", marginBottom: "2.5rem" }}
          >
            {[
              { label: "📐 Algebra", color: "#34D399" },
              { label: "📖 Reading", color: "#60A5FA" },
              { label: "🔬 Science", color: "#F472B6" },
              { label: "✏️ Essay Writing", color: "#FBBF24" },
              { label: "🌍 SAT / ACT", color: "#A78BFA" },
              { label: "🧬 Biology", color: "#34D399" },
              { label: "🗺️ History", color: "#60A5FA" },
              { label: "🎯 AP Exams", color: "#F472B6" },
            ].map((pill, i) => (
              <motion.span
                key={pill.label}
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 3 + (i % 3) * 0.8, repeat: Infinity, delay: i * 0.25, ease: "easeInOut" }}
                style={{
                  padding: "0.4rem 1rem",
                  borderRadius: "9999px",
                  fontSize: "0.82rem",
                  fontWeight: 600,
                  color: pill.color,
                  background: `${pill.color}18`,
                  border: `1px solid ${pill.color}40`,
                  backdropFilter: "blur(8px)",
                  cursor: "default",
                }}
              >
                {pill.label}
              </motion.span>
            ))}
          </motion.div>

          {/* Trust indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            style={{ display: "flex", gap: "2rem", justifyContent: "center", flexWrap: "wrap" }}
          >
            {[
              { icon: <Globe size={14} />, text: "47 countries" },
              { icon: <Zap size={14} />, text: "12,400+ sessions" },
              { icon: <ShieldCheck size={14} />, text: "PVSA recognized" },
            ].map((item) => (
              <span
                key={item.text}
                style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: "rgba(255,255,255,0.6)", fontSize: "0.82rem" }}
              >
                {item.icon} {item.text}
              </span>
            ))}
          </motion.div>
        </div>
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
