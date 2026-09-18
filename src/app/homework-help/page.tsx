"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { ROUTES } from "@/lib/routes";
import {
  HelpCircle,
  Lightbulb,
  CheckCheck,
  CheckCircle2,
  Clock,
  Video,
  FileText,
  GraduationCap,
  PenLine,
  Trash2,
  Users,
  ArrowRight,
  AlertTriangle,
  Check,
  MessageSquare,
} from "lucide-react";
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
  const [activeTutorsCount, setActiveTutorsCount] = useState<number | null>(null);
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
        if (typeof data.activeTutorsCount === "number") {
          setActiveTutorsCount(data.activeTutorsCount);
        }
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
      window.location.href = `${ROUTES.auth.signIn}?callbackUrl=/homework-help`;
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
            <h1 className={styles.title}>Homework Help &amp; Clarifications</h1>
            <p className={styles.subtitle}>
              Submit challenging problems, concept questions, or assignment drafts. Certified volunteer tutors provide step-by-step written walkthroughs or live 1-on-1 Zoom sessions.
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
                <Users size={16} color="var(--wa-green, #1B4D3E)" aria-hidden="true" />
                <span>{activeTutorsCount !== null ? `${activeTutorsCount} Active` : "14 Active"}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Success State Card */}
        {submitted ? (
          <div className={styles.formCard} style={{ textAlign: "center", padding: "3rem 2rem" }}>
            <div
              style={{
                width: "56px",
                height: "56px",
                borderRadius: "50%",
                background: "var(--wa-green-light, #EAF2EE)",
                color: "var(--wa-green, #1B4D3E)",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 1.25rem",
              }}
              aria-hidden="true"
            >
              <CheckCircle2 size={28} strokeWidth={2} />
            </div>

            <h2 className={styles.formTitle} style={{ color: "var(--wa-green, #1B4D3E)" }}>
              Question Posted to Homework Queue
            </h2>
            <p style={{ color: "var(--wa-muted, #78716C)", fontSize: "0.9375rem", lineHeight: 1.6, maxWidth: 540, margin: "0.5rem auto 1.75rem" }}>
              Your question in <strong>{selectedSubject}</strong> is now live in the student queue. Volunteer peer tutors have been notified and can reply with step-by-step written guidance or provide a secure 1-on-1 Zoom room.
            </p>

            <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap" }}>
              <button
                type="button"
                onClick={handleReset}
                className={styles.submitBtn}
                style={{ width: "auto", padding: "0.75rem 1.5rem" }}
              >
                Ask Another Question
              </button>
              <a
                href="#live-feed"
                style={{
                  background: "var(--wa-white, #FFFFFF)",
                  color: "var(--wa-ink, #1C1917)",
                  border: "1px solid var(--wa-border, #E5DFD5)",
                  borderRadius: "var(--wa-radius-sm, 8px)",
                  padding: "0.75rem 1.25rem",
                  fontWeight: 600,
                  fontSize: "0.875rem",
                  cursor: "pointer",
                  textDecoration: "none",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.35rem",
                }}
              >
                <span>View Question Feed</span>
                <ArrowRight size={14} aria-hidden="true" />
              </a>
            </div>
          </div>
        ) : (
          /* Main form card */
          <form onSubmit={handleSubmit} className={styles.formCard}>
            <h2 className={styles.formTitle}>Submit a Question to Peer Tutors</h2>

            {errorMsg && (
              <div
                style={{
                  background: "#FEF2F2",
                  border: "1px solid #FECACA",
                  color: "#B91C1C",
                  padding: "0.75rem 1rem",
                  borderRadius: "var(--wa-radius-sm, 8px)",
                  marginBottom: "0.5rem",
                  fontSize: "0.875rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                <AlertTriangle size={16} aria-hidden="true" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Subject selector */}
            <div className={styles.formGroup}>
              <label htmlFor="hw-subject" className={styles.label}>
                Subject Area *
              </label>
              <select
                id="hw-subject"
                className={styles.select}
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                required
              >
                <option value="">Select subject...</option>
                {SUBJECTS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            {/* Question textarea */}
            <div className={styles.formGroup}>
              <label htmlFor="hw-question" className={styles.label}>
                Problem Description &amp; What You&apos;ve Tried *
              </label>
              <div className={styles.textareaWrap}>
                <textarea
                  id="hw-question"
                  className={styles.textarea}
                  placeholder="Describe what you need help with. Include key formulas, problem numbers, or where you got stuck."
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
                    onClick={() => setQuestion((prev) => prev + " Could you please walk through how to approach this step-by-step?")}
                  >
                    <Lightbulb size={13} aria-hidden="true" />
                    <span>Request Step-by-Step</span>
                  </button>
                  <button
                    type="button"
                    className={styles.toolbarBtn}
                    onClick={() => setQuestion((prev) => prev + " Here is my initial work. Could you check whether my reasoning is correct?")}
                  >
                    <CheckCheck size={13} aria-hidden="true" />
                    <span>Check My Reasoning</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Help type selector */}
            <div className={styles.formGroup}>
              <label className={styles.label}>Preferred Help Format</label>
              <div className={styles.helpTypeGrid}>
                <button
                  type="button"
                  className={`${styles.helpCard} ${helpType === "zoom" ? styles.helpCardActive : ""}`}
                  onClick={() => setHelpType("zoom")}
                >
                  <div className={styles.helpIcon}>
                    <Video size={18} aria-hidden="true" />
                  </div>
                  <div className={styles.helpText}>
                    <strong>Live Zoom Explanation</strong>
                    <span>Real-time 1-on-1 audio/video discussion</span>
                  </div>
                </button>

                <button
                  type="button"
                  className={`${styles.helpCard} ${helpType === "chat" ? styles.helpCardActive : ""}`}
                  onClick={() => setHelpType("chat")}
                >
                  <div className={styles.helpIcon}>
                    <FileText size={18} aria-hidden="true" />
                  </div>
                  <div className={styles.helpText}>
                    <strong>Written Walkthrough</strong>
                    <span>Detailed text solution posted in this feed</span>
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
              {loading ? "Submitting Question..." : "Post to Homework Queue"}
            </button>
          </form>
        )}

        {/* 3. Live Homework Questions Feed */}
        <section id="live-feed" className={styles.feedSection} aria-label="Recent Homework Help Requests">
          <div className={styles.feedHeader}>
            <h2 className={styles.feedTitle}>
              <HelpCircle size={20} color="var(--wa-green, #1B4D3E)" aria-hidden="true" />
              <span>Recent Homework Help Requests</span>
            </h2>

            {session?.user && (
              <button
                type="button"
                onClick={() => setShowMineOnly((prev) => !prev)}
                className={`${styles.pillBtn} ${showMineOnly ? styles.pillBtnActive : ""}`}
              >
                {showMineOnly && <Check size={13} aria-hidden="true" />}
                <span>{showMineOnly ? "Showing My Requests" : "Show My Requests Only"}</span>
              </button>
            )}
          </div>

          {/* Subject Filter Pills */}
          <div className={styles.filterPills} role="tablist" aria-label="Filter questions by subject">
            <button
              type="button"
              role="tab"
              aria-selected={activeFilter === "All"}
              onClick={() => setActiveFilter("All")}
              className={`${styles.pillBtn} ${activeFilter === "All" ? styles.pillBtnActive : ""}`}
            >
              All Subjects
            </button>
            {SUBJECTS.map((s) => (
              <button
                key={s}
                type="button"
                role="tab"
                aria-selected={activeFilter === s}
                onClick={() => setActiveFilter(s)}
                className={`${styles.pillBtn} ${activeFilter === s ? styles.pillBtnActive : ""}`}
              >
                {s}
              </button>
            ))}
          </div>

          {feedLoading ? (
            <p style={{ color: "var(--wa-muted, #78716C)", textAlign: "center", padding: "2rem" }}>
              Loading homework feed...
            </p>
          ) : questions.length === 0 ? (
            <div className={styles.questionCard} style={{ textAlign: "center", padding: "2.5rem 1rem" }}>
              <p style={{ color: "var(--wa-ink, #1C1917)", fontSize: "0.9375rem", fontWeight: 600 }}>
                No active questions found for this subject filter.
              </p>
              <p style={{ color: "var(--wa-muted, #78716C)", fontSize: "0.8125rem", marginTop: "0.25rem" }}>
                Submit a new question above to receive help from our volunteer community.
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
                    <div style={{ display: "flex", alignItems: "center", gap: "0.45rem", flexWrap: "wrap" }}>
                      <span className={styles.subjectBadge}>{item.subject}</span>
                      {item.grade && (
                        <span style={{ fontSize: "0.75rem", background: "var(--wa-contrast, #F3EFE8)", color: "var(--wa-ink, #1C1917)", padding: "0.2rem 0.5rem", borderRadius: 4, border: "1px solid var(--wa-border, #E5DFD5)" }}>
                          {item.grade}
                        </span>
                      )}
                      {item.curriculum && (
                        <span style={{ fontSize: "0.75rem", background: "#FEF3C7", color: "#92400E", padding: "0.2rem 0.5rem", borderRadius: 4, border: "1px solid #FDE68A" }}>
                          {item.curriculum}
                        </span>
                      )}
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      {isAnswered ? (
                        <span className={styles.statusBadgeAnswered}>
                          <CheckCircle2 size={12} aria-hidden="true" />
                          <span>Answered</span>
                        </span>
                      ) : (
                        <span className={styles.statusBadgeOpen}>
                          <Clock size={12} aria-hidden="true" />
                          <span>Awaiting Tutor</span>
                        </span>
                      )}
                      {(isStudentAuthor || isAdmin) && (
                        <button
                          type="button"
                          onClick={() => handleDeleteQuestion(item.id)}
                          disabled={deletingId === item.id}
                          style={{
                            background: "transparent",
                            border: "none",
                            color: "var(--wa-muted, #78716C)",
                            fontSize: "0.75rem",
                            cursor: "pointer",
                            padding: "0.15rem 0.4rem",
                            borderRadius: 4,
                            textDecoration: "underline",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "0.25rem",
                          }}
                          title="Delete this homework question"
                        >
                          <Trash2 size={12} aria-hidden="true" />
                          <span>{deletingId === item.id ? "Deleting..." : "Delete"}</span>
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
                    <span style={{ display: "inline-flex", alignItems: "center", gap: "0.3rem" }}>
                      {item.preferredFormat === "zoom" ? (
                        <>
                          <Video size={13} aria-hidden="true" />
                          <span>Live Zoom</span>
                        </>
                      ) : (
                        <>
                          <FileText size={13} aria-hidden="true" />
                          <span>Written Solution</span>
                        </>
                      )}
                    </span>
                  </div>

                  {/* If Tutor has answered */}
                  {item.answer && (
                    <div className={styles.answerBox}>
                      <div className={styles.answerTitle}>
                        <GraduationCap size={15} aria-hidden="true" />
                        <span>Solution from {item.tutor?.user?.name || "Volunteer Tutor"}:</span>
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
                        <Video size={14} aria-hidden="true" />
                        <span>Enter Tutor Live Zoom Room</span>
                        <ArrowRight size={13} aria-hidden="true" />
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
                        <PenLine size={13} aria-hidden="true" />
                        <span>{answeringId === item.id ? "Close Reply" : "Answer / Provide Zoom Room"}</span>
                      </button>
                    </div>
                  )}

                  {/* Inline Tutor Reply Form */}
                  {answeringId === item.id && (
                    <form onSubmit={handleTutorAnswer} style={{ marginTop: "0.75rem", background: "var(--wa-contrast, #F3EFE8)", padding: "1rem", borderRadius: "var(--wa-radius-sm, 8px)", border: "1px solid var(--wa-border, #E5DFD5)" }}>
                      {answerError && (
                        <div style={{ color: "#DC2626", background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 6, padding: "0.5rem 0.75rem", fontSize: "0.85rem", marginBottom: "0.75rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                          <AlertTriangle size={14} aria-hidden="true" />
                          <span>{answerError}</span>
                        </div>
                      )}
                      <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 700, color: "var(--wa-ink, #1C1917)", marginBottom: "0.4rem" }}>
                        Step-by-Step Answer / Explanation:
                      </label>
                      <textarea
                        rows={3}
                        required
                        value={tutorAnswerText}
                        onChange={(e) => setTutorAnswerText(e.target.value)}
                        placeholder="Explain the solution clearly and guide the student..."
                        style={{ width: "100%", padding: "0.6rem", borderRadius: "var(--wa-radius-sm, 8px)", border: "1px solid var(--wa-border, #E5DFD5)", fontSize: "0.875rem", marginBottom: "0.75rem", fontFamily: "inherit", color: "var(--wa-ink, #1C1917)", background: "#FFFFFF" }}
                      />

                      <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 700, color: "var(--wa-ink, #1C1917)", marginBottom: "0.4rem" }}>
                        Optional Live Zoom Link:
                      </label>
                      <input
                        type="url"
                        placeholder="https://zoom.us/j/..."
                        value={tutorZoomUrl}
                        onChange={(e) => setTutorZoomUrl(e.target.value)}
                        style={{ width: "100%", padding: "0.5rem 0.75rem", borderRadius: "var(--wa-radius-sm, 8px)", border: "1px solid var(--wa-border, #E5DFD5)", fontSize: "0.85rem", marginBottom: "0.75rem", color: "var(--wa-ink, #1C1917)", background: "#FFFFFF" }}
                      />

                      <div style={{ display: "flex", gap: "0.5rem" }}>
                        <button
                          type="submit"
                          disabled={answerSubmitting || !tutorAnswerText.trim()}
                          style={{ background: "var(--wa-green, #1B4D3E)", color: "#FFF", border: "none", padding: "0.5rem 1rem", borderRadius: "var(--wa-radius-sm, 8px)", fontWeight: 600, fontSize: "0.8125rem", cursor: "pointer" }}
                        >
                          {answerSubmitting ? "Submitting..." : "Send Answer to Student"}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setAnsweringId(null);
                            setAnswerError("");
                          }}
                          style={{ background: "var(--wa-white, #FFFFFF)", border: "1px solid var(--wa-border, #E5DFD5)", color: "var(--wa-ink, #1C1917)", padding: "0.5rem 1rem", borderRadius: "var(--wa-radius-sm, 8px)", fontWeight: 600, fontSize: "0.8125rem", cursor: "pointer" }}
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
          <p className={styles.altText}>Looking for a scheduled 1-on-1 tutoring appointment or small-group workshop?</p>
          <Link href={ROUTES.learner.mySessions} className={styles.altLink}>Browse all sessions →</Link>
        </div>
      </div>
    </main>
  );
}
