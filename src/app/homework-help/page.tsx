"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "./page.module.css";

const SUBJECTS = [
  "Mathematics", "Science", "English", "History", "Biology",
  "Chemistry", "Physics", "SAT Prep", "Writing", "Other",
];

export default function HomeworkHelpPage() {
  const [selectedSubject, setSelectedSubject] = useState("");
  const [question, setQuestion] = useState("");
  const [helpType, setHelpType] = useState<"zoom" | "chat">("zoom");

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        {/* Page header with live stats */}
        <div className={styles.header}>
          <div className={styles.headerText}>
            <h1 className={styles.title}>Get quick help with homework!</h1>
            <p className={styles.subtitle}>
              Whether you&apos;re studying for an upcoming test, working on a homework assignment, or just looking for some extra support, our team of tutors are here to help.
            </p>
          </div>

          <div className={styles.liveStats}>
            <div className={styles.statCard}>
              <span className={styles.statLabel}>AVG WAIT</span>
              <div className={styles.statValue}>
                <span className={styles.statDot} aria-hidden="true" />
                <span>10 min</span>
              </div>
            </div>
            <div className={styles.statCard}>
              <span className={styles.statLabel}>TUTORS ONLINE</span>
              <div className={styles.statValue}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0E8345" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
                </svg>
                <span>12</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main form card */}
        <div className={styles.formCard}>
          <h2 className={styles.formTitle}>Get help from a tutor now</h2>

          {/* Subject selector */}
          <div className={styles.formGroup}>
            <label htmlFor="hw-subject" className={styles.label}>
              I need help in
            </label>
            <select
              id="hw-subject"
              className={styles.select}
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
            >
              <option value="">Subject</option>
              {SUBJECTS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* Question textarea */}
          <div className={styles.formGroup}>
            <label htmlFor="hw-question" className={styles.label}>
              My question
            </label>
            <div className={styles.textareaWrap}>
              <textarea
                id="hw-question"
                className={styles.textarea}
                placeholder="What do you need help with? Be as specific as possible (and feel free to attach a photo!)"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                rows={4}
              />
              {/* Toolbar */}
              <div className={styles.toolbar} aria-label="Text formatting options">
                <button type="button" className={styles.toolbarBtn} aria-label="Add emoji">😊</button>
                <button type="button" className={styles.toolbarBtn} aria-label="Attach image">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                    <circle cx="8.5" cy="8.5" r="1.5"/>
                    <polyline points="21 15 16 10 5 21"/>
                  </svg>
                </button>
                <button type="button" className={styles.toolbarBtn} aria-label="Format text">Aa</button>
              </div>
            </div>
          </div>

          {/* Help type selector */}
          <div className={styles.formGroup}>
            <label className={styles.label}>How I want help</label>
            <div className={styles.helpTypeGrid}>
              <button
                type="button"
                className={`${styles.helpCard} ${helpType === "zoom" ? styles.helpCardActive : ""}`}
                onClick={() => setHelpType("zoom")}
              >
                <div className={styles.helpIcon}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <polygon points="23 7 16 12 23 17 23 7"/>
                    <rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
                  </svg>
                </div>
                <div className={styles.helpText}>
                  <strong>Zoom Help</strong>
                  <span>Peer tutors are waiting to help you live on a Zoom call</span>
                </div>
              </button>

              <button
                type="button"
                className={`${styles.helpCard} ${helpType === "chat" ? styles.helpCardActive : ""}`}
                onClick={() => setHelpType("chat")}
              >
                <div className={styles.helpIcon} style={{ background: "#F4F6F8", color: "#374151" }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
                  </svg>
                </div>
                <div className={styles.helpText}>
                  <strong>Chat Help</strong>
                  <span>Peer tutors will respond to your question over text</span>
                </div>
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="button"
            className={styles.submitBtn}
            disabled={!selectedSubject || !question.trim()}
          >
            Get help now
          </button>
        </div>

        {/* Alternative: book a session */}
        <div className={styles.altSection}>
          <p className={styles.altText}>Need more in-depth help?</p>
          <Link href="/sessions" className={styles.altLink}>Browse all sessions →</Link>
        </div>
      </div>
    </main>
  );
}
