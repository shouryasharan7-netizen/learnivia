"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import styles from "./page.module.css";

const SUBJECTS = [
  "Mathematics", "Science", "English", "History", "Biology",
  "Chemistry", "Social Studies", "Learning Support", "Writing", "Other",
];

interface HomeworkItem {
  id: string;
  subject: string;
  question: string;
  preferredFormat: string;
  grade?: string | null;
  curriculum?: string | null;
  status: string;
  answer?: string | null;
  zoomLink?: string | null;
  createdAt: string;
  student?: {
    id: string;
    name?: string | null;
    grade?: string | null;
    curriculum?: string | null;
  } | null;
  tutor?: {
    user: {
      name?: string | null;
    };
  } | null;
}

export default function HomeworkHelpPage() {
  const { data: session } = useSession();
  const [selectedSubject, setSelectedSubject] = useState("");
  const [question, setQuestion] = useState("");
  const [helpType, setHelpType] = useState<"zoom" | "chat">("zoom");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Live feed states
  const [questions, setQuestions] = useState<HomeworkItem[]>([]);
  const [feedLoading, setFeedLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("All");
  const [showMineOnly, setShowMineOnly] = useState(false);

  // Tutor response states
  const [answeringId, setAnsweringId] = useState<string | null>(null);
  const [tutorAnswerText, setTutorAnswerText] = useState("");
  const [tutorZoomUrl, setTutorZoomUrl] = useState("");
  const [answerSubmitting, setAnswerSubmitting] = useState(false);
  const [answerError, setAnswerError] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchQuestions = useCallback(async () => {
    try {
      const url = `/api/homework?subject=${encodeURIComponent(activeFilter)}${showMineOnly ? "&mine=true" : ""}`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setQuestions(data.requests || []);
      }
    } catch (err) {
      console.error("Failed to load homework questions:", err);
    } finally {
      setFeedLoading(false);
    }
  }, [activeFilter, showMineOnly]);

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

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
      const res = await fetch("/api/homework", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: selectedSubject,
          question: question.trim(),
          preferredFormat: helpType,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to submit question.");
      }

      setSubmitted(true);
      fetchQuestions(); // Refresh live feed immediately
    } catch (err: unknown) {
      const error = err as Error;
      setErrorMsg(error.message || "An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleTutorAnswer(e: React.FormEvent) {
    e.preventDefault();
    if (!answeringId) return;

    setAnswerSubmitting(true);
    setAnswerError("");
    try {
      const res = await fetch("/api/homework", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: answeringId,
          answer: tutorAnswerText.trim() || undefined,
          zoomLink: tutorZoomUrl.trim() || undefined,
          status: "ANSWERED",
        }),
      });

      if (res.ok) {
        setAnsweringId(null);
        setTutorAnswerText("");
        setTutorZoomUrl("");
        setAnswerError("");
        fetchQuestions();
      } else {
        const data = await res.json();
        setAnswerError(data.error || "Failed to submit tutor answer.");
      }
    } catch (err) {
      console.error("Failed to submit tutor answer:", err);
      setAnswerError("Network error. Please check your connection and try again.");
    } finally {
      setAnswerSubmitting(false);
    }
  }

  async function handleDeleteQuestion(id: string) {
    if (!confirm("Are you sure you want to delete this homework request?")) return;
    setDeletingId(id);
    try {
      const res = await fetch("/api/homework", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        fetchQuestions();
      } else {
        const data = await res.json();
        alert(data.error || "Failed to delete question.");
      }
    } catch (err) {
      console.error("Failed to delete homework question:", err);
      alert("Network error. Please try again.");
    } finally {
      setDeletingId(null);
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
        {/* Page header with verified live stats */}
        <div className={styles.header}>
          <div className={styles.headerText}>
            <h1 className={styles.title}>Get quick help with homework!</h1>
            <p className={styles.subtitle}>
              Whether you&apos;re studying for an upcoming exam, stuck on a challenging problem, or need step-by-step guidance, volunteer peer tutors are here to help.
            </p>
          </div>

          <div className={styles.liveStats}>
            <div className={styles.statCard}>
              <span className={styles.statLabel}>QUESTIONS</span>
              <div className={styles.statValue}>
                <span className={styles.statDot} aria-hidden="true" />
                <span>{questions.length}</span>
              </div>
            </div>
            <div className={styles.statCard}>
              <span className={styles.statLabel}>PEER TUTORS</span>
              <div className={styles.statValue}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0E8345" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
                </svg>
                <span>Active</span>
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
              Your question in <strong>{selectedSubject}</strong> is now live. Volunteer tutors have been notified and can reply with step-by-step solutions or launch a 1-on-1 Zoom room.
            </p>

            <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
              <button
                type="button"
                onClick={handleReset}
                className={styles.submitBtn}
                style={{ width: "auto", padding: "0.85rem 1.75rem" }}
              >
                Ask Another Question
              </button>
              <a
                href="#live-feed"
                style={{
                  background: "#F1F5F9",
                  color: "#334155",
                  border: "1px solid #CBD5E1",
                  borderRadius: "9999px",
                  padding: "0.85rem 1.5rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  textDecoration: "none",
                  display: "inline-flex",
                  alignItems: "center",
                }}
              >
                View Live Feed Below ↓
              </a>
            </div>
          </div>
        ) : (
          /* Main form card */
          <form onSubmit={handleSubmit} className={styles.formCard}>
            <h2 className={styles.formTitle}>Ask a tutor for help</h2>

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
                    <span>Live 1-on-1 video call explanation</span>
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
                    <strong>Written Solution</strong>
                    <span>Step-by-step written explanation</span>
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

        {/* 3. Live Homework Questions Feed */}
        <section id="live-feed" className={styles.feedSection}>
          <div className={styles.feedHeader}>
            <h2 className={styles.feedTitle}>
              <span>📋</span> Recent Homework Help Requests
            </h2>

            {session?.user && (
              <button
                type="button"
                onClick={() => setShowMineOnly((prev) => !prev)}
                className={`${styles.pillBtn} ${showMineOnly ? styles.pillBtnActive : ""}`}
              >
                {showMineOnly ? "✓ Showing My Questions" : "Show My Questions"}
              </button>
            )}
          </div>

          {/* Subject Filter Pills */}
          <div className={styles.filterPills}>
            <button
              type="button"
              onClick={() => setActiveFilter("All")}
              className={`${styles.pillBtn} ${activeFilter === "All" ? styles.pillBtnActive : ""}`}
            >
              All Subjects
            </button>
            {SUBJECTS.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setActiveFilter(s)}
                className={`${styles.pillBtn} ${activeFilter === s ? styles.pillBtnActive : ""}`}
              >
                {s}
              </button>
            ))}
          </div>

          {feedLoading ? (
            <p style={{ color: "#64748B", textAlign: "center", padding: "2rem" }}>Loading questions...</p>
          ) : questions.length === 0 ? (
            <div className={styles.questionCard} style={{ textAlign: "center", padding: "2.5rem 1rem" }}>
              <p style={{ color: "#64748B", fontSize: "1rem" }}>No homework questions found for this filter.</p>
              <p style={{ color: "#94A3B8", fontSize: "0.875rem", marginTop: "0.25rem" }}>
                Be the first to ask a question above!
              </p>
            </div>
          ) : (
            questions.map((item) => {
              const isAnswered = item.status === "ANSWERED" || Boolean(item.answer);
              const isStudentAuthor = Boolean(session?.user?.id && item.student?.id && session.user.id === item.student.id);
              const isTutorRole = (session?.user as any)?.role === "TUTOR";
              const isAdmin = Boolean((session?.user as any)?.isAdmin);

              return (
                <article key={item.id} className={styles.questionCard}>
                  <div className={styles.qMetaRow}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <span className={styles.subjectBadge}>{item.subject}</span>
                      {item.grade && (
                        <span style={{ fontSize: "0.75rem", background: "#F1F5F9", color: "#475569", padding: "0.2rem 0.5rem", borderRadius: 4 }}>
                          {item.grade}
                        </span>
                      )}
                      {item.curriculum && (
                        <span style={{ fontSize: "0.75rem", background: "#FEF3C7", color: "#92400E", padding: "0.2rem 0.5rem", borderRadius: 4 }}>
                          {item.curriculum}
                        </span>
                      )}
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      {isAnswered ? (
                        <span className={styles.statusBadgeAnswered}>✓ Answered</span>
                      ) : (
                        <span className={styles.statusBadgeOpen}>⏳ Waiting for Tutor</span>
                      )}
                      {(isStudentAuthor || isAdmin) && (
                        <button
                          type="button"
                          onClick={() => handleDeleteQuestion(item.id)}
                          disabled={deletingId === item.id}
                          style={{
                            background: "transparent",
                            border: "none",
                            color: "#94A3B8",
                            fontSize: "0.75rem",
                            cursor: "pointer",
                            padding: "0.15rem 0.4rem",
                            borderRadius: 4,
                            textDecoration: "underline",
                          }}
                          title="Delete this homework question"
                        >
                          {deletingId === item.id ? "Deleting..." : "Delete"}
                        </button>
                      )}
                    </div>
                  </div>

                  <p className={styles.questionText}>{item.question}</p>

                  <div className={styles.studentMeta}>
                    <span>Asked by <strong>{item.student?.name || "Student"}</strong></span>
                    <span>•</span>
                    <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                    <span>•</span>
                    <span>Format: {item.preferredFormat === "zoom" ? "🎥 Live Zoom" : "💬 Written"}</span>
                  </div>

                  {/* If Tutor has answered */}
                  {item.answer && (
                    <div className={styles.answerBox}>
                      <div className={styles.answerTitle}>
                        <span>🧑‍🏫</span> Solution from {item.tutor?.user?.name || "Volunteer Tutor"}:
                      </div>
                      <p className={styles.answerText}>{item.answer}</p>
                    </div>
                  )}

                  {/* Zoom link if available */}
                  {item.zoomLink && (
                    <div style={{ marginTop: "0.5rem" }}>
                      <a
                        href={item.zoomLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.zoomHelpBtn}
                      >
                        <span>🎥</span> Join Tutor Live Zoom Room →
                      </a>
                    </div>
                  )}

                  {/* Tutor Reply / Zoom launcher */}
                  {isTutorRole && !isStudentAuthor && (
                    <div className={styles.tutorActionRow}>
                      <button
                        type="button"
                        onClick={() => {
                          setAnsweringId(answeringId === item.id ? null : item.id);
                          setAnswerError("");
                        }}
                        className={styles.tutorAnswerBtn}
                      >
                        {answeringId === item.id ? "Close Reply" : "✍️ Write Answer / Provide Zoom Room"}
                      </button>
                    </div>
                  )}

                  {/* Inline Tutor Reply Form */}
                  {answeringId === item.id && (
                    <form onSubmit={handleTutorAnswer} style={{ marginTop: "1rem", background: "#F8FAFC", padding: "1rem", borderRadius: 10, border: "1px solid #E2E8F0" }}>
                      {answerError && (
                        <div style={{ color: "#DC2626", background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 6, padding: "0.5rem 0.75rem", fontSize: "0.85rem", marginBottom: "0.75rem" }}>
                          ⚠️ {answerError}
                        </div>
                      )}
                      <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "#1E293B", marginBottom: "0.4rem" }}>
                        Your Step-by-Step Answer / Explanation:
                      </label>
                      <textarea
                        rows={3}
                        required
                        value={tutorAnswerText}
                        onChange={(e) => setTutorAnswerText(e.target.value)}
                        placeholder="Explain the solution clearly..."
                        style={{ width: "100%", padding: "0.6rem", borderRadius: 8, border: "1px solid #CBD5E1", fontSize: "0.9rem", marginBottom: "0.75rem" }}
                      />

                      <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "#1E293B", marginBottom: "0.4rem" }}>
                        Optional Live Zoom Link (approved providers only):
                      </label>
                      <input
                        type="url"
                        placeholder="https://zoom.us/j/..."
                        value={tutorZoomUrl}
                        onChange={(e) => setTutorZoomUrl(e.target.value)}
                        style={{ width: "100%", padding: "0.5rem", borderRadius: 8, border: "1px solid #CBD5E1", fontSize: "0.85rem", marginBottom: "0.75rem" }}
                      />

                      <div style={{ display: "flex", gap: "0.5rem" }}>
                        <button
                          type="submit"
                          disabled={answerSubmitting || !tutorAnswerText.trim()}
                          style={{ background: "#0E8345", color: "#FFF", border: "none", padding: "0.5rem 1rem", borderRadius: 6, fontWeight: 700, cursor: "pointer" }}
                        >
                          {answerSubmitting ? "Submitting..." : "Send Answer to Student"}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setAnsweringId(null);
                            setAnswerError("");
                          }}
                          style={{ background: "#E2E8F0", border: "none", padding: "0.5rem 1rem", borderRadius: 6, fontWeight: 600, cursor: "pointer" }}
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  )}
                </article>
              );
            })
          )}
        </section>

        {/* Alternative: browse all sessions */}
        <div className={styles.altSection}>
          <p className={styles.altText}>Need a scheduled 1-on-1 session or intensive bootcamp?</p>
          <Link href="/sessions" className={styles.altLink}>Browse all sessions →</Link>
        </div>
      </div>
    </main>
  );
}
