"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import styles from "./page.module.css";

const SUBJECTS = [
  "Mathematics", "Science", "English", "History", "Biology",
  "Chemistry", "Physics", "SAT Prep", "Writing", "Other",
];

export default function HomeworkHelpPage() {
  const { data: session } = useSession();
  const [selectedSubject, setSelectedSubject] = useState("");
  const [question, setQuestion] = useState("");
  const [helpType, setHelpType] = useState<"zoom" | "chat">("zoom");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedSubject || !question.trim()) return;

    if (!session?.user) {
      window.location.href = "/signin?callbackUrl=/homework-help";
      return;
    }

    setLoading(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/community", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          channel: "Homework Help",
          content: `📌 [${selectedSubject}] ${question.trim()} (Preferred format: ${helpType === "zoom" ? "Live Zoom Call" : "Text Discussion"})`,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to submit question.");
      }

      setSubmitted(true);
    } catch (err: unknown) {
      const error = err as Error;
      setErrorMsg(error.message || "An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleReset() {
    setSubmitted(false);
    setQuestion("");
    setSelectedSubject("");
  }

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

        {/* Success State Card */}
        {submitted ? (
          <div className={styles.formCard} style={{ textAlign: "center", padding: "3rem 2rem" }}>
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🎉</div>
            <h2 className={styles.formTitle} style={{ color: "#0E8345" }}>
              Question Posted to Homework Help!
            </h2>
            <p style={{ color: "#475569", fontSize: "1.05rem", lineHeight: 1.6, maxWidth: 540, margin: "0.5rem auto 1.75rem" }}>
              Your question in <strong>{selectedSubject}</strong> has been shared with volunteer tutors and peers in the live room.
            </p>

            <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
              <Link
                href="/community?channel=Homework+Help"
                className={styles.submitBtn}
                style={{ width: "auto", padding: "0.85rem 1.75rem", textDecoration: "none" }}
              >
                💬 Open Homework Help Room →
              </Link>
              <button
                type="button"
                onClick={handleReset}
                style={{
                  background: "#F1F5F9",
                  color: "#334155",
                  border: "1px solid #CBD5E1",
                  borderRadius: "9999px",
                  padding: "0.85rem 1.5rem",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Ask Another Question
              </button>
            </div>
          </div>
        ) : (
          /* Main form card */
          <form onSubmit={handleSubmit} className={styles.formCard}>
            <h2 className={styles.formTitle}>Get help from a tutor now</h2>

            {errorMsg && (
              <div style={{ background: "#FEF2F2", border: "1px solid #FCA5A5", color: "#B91C1C", padding: "0.75rem 1rem", borderRadius: 8, marginBottom: "1rem", fontSize: "0.9rem" }}>
                {errorMsg}
              </div>
            )}

            {/* Subject selector */}
            <div className={styles.formGroup}>
              <label htmlFor="hw-subject" className={styles.label}>
                I need help in *
              </label>
              <select
                id="hw-subject"
                className={styles.select}
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                required
              >
                <option value="">Choose a subject...</option>
                {SUBJECTS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            {/* Question textarea */}
            <div className={styles.formGroup}>
              <label htmlFor="hw-question" className={styles.label}>
                My question *
              </label>
              <div className={styles.textareaWrap}>
                <textarea
                  id="hw-question"
                  className={styles.textarea}
                  placeholder="What do you need help with? Be as specific as possible (mention the problem number, concept, or formula)."
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  rows={4}
                  required
                />
                {/* Quick Helper Chips */}
                <div className={styles.toolbar} aria-label="Quick question prompts">
                  <button
                    type="button"
                    className={styles.toolbarBtn}
                    onClick={() => setQuestion((prev) => prev + " Can someone explain how to solve this step-by-step?")}
                  >
                    💡 Step-by-step
                  </button>
                  <button
                    type="button"
                    className={styles.toolbarBtn}
                    onClick={() => setQuestion((prev) => prev + " Is my reasoning correct on this problem?")}
                  >
                    ✏️ Check my work
                  </button>
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
              type="submit"
              className={styles.submitBtn}
              disabled={loading || !selectedSubject || !question.trim()}
            >
              {loading ? "Posting Question..." : "Get help now"}
            </button>
          </form>
        )}

        {/* Alternative: book a session */}
        <div className={styles.altSection}>
          <p className={styles.altText}>Need a full 1-on-1 session or intensive bootcamp?</p>
          <Link href="/sessions" className={styles.altLink}>Browse all sessions →</Link>
        </div>
      </div>
    </main>
  );
}
