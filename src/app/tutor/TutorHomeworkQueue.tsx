"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  HelpCircle,
  Video,
  FileText,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  PenLine,
  Send,
  X,
  ExternalLink,
} from "lucide-react";
import styles from "./page.module.css";
import { ROUTES } from "@/lib/routes";

interface HomeworkItem {
  id: string;
  subject: string;
  question: string;
  preferredFormat: string;
  grade?: string | null;
  curriculum?: string | null;
  status: string;
  createdAt: string | Date;
  student?: {
    id: string;
    name?: string | null;
    grade?: string | null;
    curriculum?: string | null;
  } | null;
}

interface Props {
  initialQuestions: HomeworkItem[];
  tutorName?: string | null;
}

export function TutorHomeworkQueue({ initialQuestions, tutorName }: Props) {
  const [questions, setQuestions] = useState<HomeworkItem[]>(initialQuestions);
  const [answeringId, setAnsweringId] = useState<string | null>(null);
  const [answerText, setAnswerText] = useState("");
  const [zoomUrl, setZoomUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successId, setSuccessId] = useState<string | null>(null);

  const handleAnswerSubmit = async (e: React.FormEvent, questionId: string) => {
    e.preventDefault();
    if (!answerText.trim() && !zoomUrl.trim()) {
      setErrorMsg("Please provide an answer explanation or a live meeting link.");
      return;
    }

    setSubmitting(true);
    setErrorMsg("");
    try {
      const res = await fetch("/api/homework", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: questionId,
          answer: answerText.trim() || undefined,
          zoomLink: zoomUrl.trim() || undefined,
          status: "ANSWERED",
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to submit answer.");
      }

      setSuccessId(questionId);
      setAnsweringId(null);
      setAnswerText("");
      setZoomUrl("");
      // Remove or mark as answered in local list
      setTimeout(() => {
        setQuestions((prev) => prev.filter((q) => q.id !== questionId));
        setSuccessId(null);
      }, 2500);
    } catch (err: any) {
      setErrorMsg(err.message || "An unexpected error occurred.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className={styles.card} aria-labelledby="homework-queue-heading">
      <div className={styles.cardHeader}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <h2 id="homework-queue-heading" className={styles.cardTitle}>
              Student Homework &amp; Concept Questions
            </h2>
            {questions.length > 0 && (
              <span
                style={{
                  background: "var(--primary-light, #EAF2EE)",
                  color: "var(--primary, #1B4D3E)",
                  padding: "0.15rem 0.55rem",
                  borderRadius: "9999px",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                }}
              >
                {questions.length} Open
              </span>
            )}
          </div>
          <p className={styles.cardSub}>
            Help students break down challenging homework assignments with step-by-step guidance.
          </p>
        </div>

        <Link
          href={ROUTES.homeworkHelp || "/homework-help"}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.35rem",
            fontSize: "0.8125rem",
            fontWeight: 600,
            color: "var(--primary, #1B4D3E)",
            textDecoration: "none",
          }}
        >
          <span>Open Full Question Feed</span>
          <ArrowRight size={14} />
        </Link>
      </div>

      {questions.length === 0 ? (
        <div
          style={{
            padding: "2.5rem 1.5rem",
            textAlign: "center",
            background: "var(--surface-subtle, #F8FAFC)",
            borderRadius: "var(--radius-md, 10px)",
            border: "1px dashed var(--border, #E2E8F0)",
          }}
        >
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "50%",
              background: "var(--primary-light, #EAF2EE)",
              color: "var(--primary, #1B4D3E)",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "0.75rem",
            }}
          >
            <CheckCircle2 size={24} />
          </div>
          <h3
            style={{
              fontSize: "0.95rem",
              fontWeight: 700,
              color: "var(--text-primary, #0F172A)",
              margin: "0 0 0.35rem",
            }}
          >
            All Caught Up!
          </h3>
          <p
            style={{
              fontSize: "0.85rem",
              color: "var(--text-muted, #64748B)",
              maxWidth: "420px",
              margin: "0 auto 1.25rem",
              lineHeight: 1.5,
            }}
          >
            There are currently no unanswered homework questions in the queue. New questions will appear here automatically.
          </p>
          <Link
            href={ROUTES.homeworkHelp || "/homework-help"}
            className={styles.secondaryBtn}
            style={{ display: "inline-flex" }}
          >
            Browse All Questions Feed
          </Link>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
          {questions.map((q) => {
            const isAnswering = answeringId === q.id;
            const isResolved = successId === q.id;

            return (
              <div
                key={q.id}
                style={{
                  background: isResolved ? "#F0FDF4" : "var(--surface-raised, #FFFFFF)",
                  border: `1px solid ${isResolved ? "#BBF7D0" : "var(--border, #E2E8F0)"}`,
                  borderRadius: "var(--radius-md, 10px)",
                  padding: "1.1rem",
                  transition: "all 0.2s ease",
                }}
              >
                {/* Header row */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    flexWrap: "wrap",
                    gap: "0.5rem",
                    marginBottom: "0.5rem",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "0.45rem", flexWrap: "wrap" }}>
                    <span
                      style={{
                        background: "var(--primary-light, #EAF2EE)",
                        color: "var(--primary, #1B4D3E)",
                        padding: "0.2rem 0.55rem",
                        borderRadius: "4px",
                        fontSize: "0.75rem",
                        fontWeight: 700,
                      }}
                    >
                      {q.subject}
                    </span>
                    {q.grade && (
                      <span
                        style={{
                          background: "var(--surface-subtle, #F1F5F9)",
                          color: "var(--text-secondary, #334155)",
                          padding: "0.2rem 0.5rem",
                          borderRadius: "4px",
                          fontSize: "0.725rem",
                          fontWeight: 600,
                          border: "1px solid var(--border, #E2E8F0)",
                        }}
                      >
                        {q.grade}
                      </span>
                    )}
                    {q.curriculum && (
                      <span
                        style={{
                          background: "#FFFBEB",
                          color: "#92400E",
                          padding: "0.2rem 0.5rem",
                          borderRadius: "4px",
                          fontSize: "0.725rem",
                          fontWeight: 600,
                          border: "1px solid #FDE68A",
                        }}
                      >
                        {q.curriculum}
                      </span>
                    )}
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.75rem", color: "var(--text-muted, #64748B)" }}>
                    {q.preferredFormat === "zoom" ? (
                      <span style={{ display: "inline-flex", alignItems: "center", gap: "0.25rem" }}>
                        <Video size={13} color="#2563EB" /> Live Zoom Preferred
                      </span>
                    ) : (
                      <span style={{ display: "inline-flex", alignItems: "center", gap: "0.25rem" }}>
                        <FileText size={13} color="#059669" /> Written Explanation
                      </span>
                    )}
                    <span>•</span>
                    <span>{new Date(q.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Question body */}
                <p
                  style={{
                    fontSize: "0.925rem",
                    color: "var(--text-primary, #0F172A)",
                    lineHeight: 1.55,
                    margin: "0 0 0.85rem",
                    fontWeight: 500,
                  }}
                >
                  {q.question}
                </p>

                {/* Student attribution */}
                <div
                  style={{
                    fontSize: "0.775rem",
                    color: "var(--text-muted, #64748B)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                    gap: "0.5rem",
                  }}
                >
                  <span>
                    Asked by <strong>{q.student?.name || "Student"}</strong>
                  </span>

                  {!isAnswering && !isResolved && (
                    <button
                      type="button"
                      onClick={() => {
                        setAnsweringId(q.id);
                        setErrorMsg("");
                      }}
                      style={{
                        background: "var(--primary, #1B4D3E)",
                        color: "#FFFFFF",
                        border: "none",
                        padding: "0.4rem 0.85rem",
                        borderRadius: "6px",
                        fontSize: "0.8rem",
                        fontWeight: 600,
                        cursor: "pointer",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.35rem",
                        transition: "background 0.15s ease",
                      }}
                    >
                      <PenLine size={13} />
                      <span>Answer Question</span>
                    </button>
                  )}
                </div>

                {/* Success feedback */}
                {isResolved && (
                  <div
                    style={{
                      marginTop: "0.75rem",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.4rem",
                      color: "#166534",
                      fontSize: "0.825rem",
                      fontWeight: 600,
                    }}
                  >
                    <CheckCircle2 size={16} />
                    <span>Answer successfully published to student! Verified volunteer response logged.</span>
                  </div>
                )}

                {/* Inline Response Form for Tutor */}
                {isAnswering && (
                  <form
                    onSubmit={(e) => handleAnswerSubmit(e, q.id)}
                    style={{
                      marginTop: "0.85rem",
                      background: "var(--surface-subtle, #F8FAFC)",
                      border: "1px solid var(--border, #E2E8F0)",
                      borderRadius: "8px",
                      padding: "1rem",
                      animation: "fadeIn 0.15s ease-out",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "0.5rem",
                      }}
                    >
                      <strong style={{ fontSize: "0.825rem", color: "var(--text-primary, #0F172A)" }}>
                        Your Guidance / Solution (as {tutorName || "Volunteer Tutor"}):
                      </strong>
                      <button
                        type="button"
                        onClick={() => setAnsweringId(null)}
                        style={{
                          background: "transparent",
                          border: "none",
                          cursor: "pointer",
                          color: "var(--text-muted, #64748B)",
                          fontSize: "0.75rem",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "0.2rem",
                        }}
                      >
                        <X size={14} /> Cancel
                      </button>
                    </div>

                    {errorMsg && (
                      <div
                        style={{
                          background: "#FEF2F2",
                          border: "1px solid #FECACA",
                          color: "#DC2626",
                          padding: "0.45rem 0.75rem",
                          borderRadius: "6px",
                          fontSize: "0.8rem",
                          marginBottom: "0.6rem",
                          display: "flex",
                          alignItems: "center",
                          gap: "0.35rem",
                        }}
                      >
                        <AlertTriangle size={14} />
                        <span>{errorMsg}</span>
                      </div>
                    )}

                    <textarea
                      rows={3}
                      required={!zoomUrl}
                      value={answerText}
                      onChange={(e) => setAnswerText(e.target.value)}
                      placeholder="Explain the concept step-by-step to help the student understand..."
                      style={{
                        width: "100%",
                        padding: "0.6rem 0.75rem",
                        borderRadius: "6px",
                        border: "1px solid var(--border, #CBD5E1)",
                        fontSize: "0.875rem",
                        fontFamily: "inherit",
                        marginBottom: "0.6rem",
                        boxSizing: "border-box",
                        background: "var(--surface-raised, #FFFFFF)",
                        color: "var(--text-primary, #0F172A)",
                      }}
                    />

                    <div style={{ marginBottom: "0.75rem" }}>
                      <label
                        style={{
                          display: "block",
                          fontSize: "0.75rem",
                          fontWeight: 600,
                          color: "var(--text-secondary, #475569)",
                          marginBottom: "0.25rem",
                        }}
                      >
                        Optional 1-on-1 Zoom or Google Meet Link:
                      </label>
                      <input
                        type="url"
                        value={zoomUrl}
                        onChange={(e) => setZoomUrl(e.target.value)}
                        placeholder="https://zoom.us/j/... or https://meet.google.com/..."
                        style={{
                          width: "100%",
                          padding: "0.45rem 0.75rem",
                          borderRadius: "6px",
                          border: "1px solid var(--border, #CBD5E1)",
                          fontSize: "0.8125rem",
                          fontFamily: "inherit",
                          boxSizing: "border-box",
                          background: "var(--surface-raised, #FFFFFF)",
                          color: "var(--text-primary, #0F172A)",
                        }}
                      />
                    </div>

                    <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem" }}>
                      <button
                        type="button"
                        onClick={() => setAnsweringId(null)}
                        style={{
                          background: "#FFFFFF",
                          border: "1px solid var(--border, #CBD5E1)",
                          color: "var(--text-secondary, #334155)",
                          padding: "0.4rem 0.85rem",
                          borderRadius: "6px",
                          fontSize: "0.8rem",
                          fontWeight: 600,
                          cursor: "pointer",
                        }}
                      >
                        Close
                      </button>
                      <button
                        type="submit"
                        disabled={submitting}
                        style={{
                          background: "var(--primary, #1B4D3E)",
                          color: "#FFFFFF",
                          border: "none",
                          padding: "0.4rem 1rem",
                          borderRadius: "6px",
                          fontSize: "0.8rem",
                          fontWeight: 600,
                          cursor: submitting ? "wait" : "pointer",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "0.35rem",
                          opacity: submitting ? 0.7 : 1,
                        }}
                      >
                        <Send size={13} />
                        <span>{submitting ? "Submitting..." : "Send Solution"}</span>
                      </button>
                    </div>
                  </form>
                )}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
