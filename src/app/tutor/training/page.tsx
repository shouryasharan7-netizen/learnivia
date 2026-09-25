"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { CheckCircle2, ShieldCheck, BookOpen, ArrowRight, Users, Video, Clock, RotateCcw, AlertCircle, ChevronDown, Check, Play } from "lucide-react";
import { VideoLessonPlayer } from "./VideoLessonPlayer";

const MODULES = [
  {
    id: 1,
    title: "Session Setup & Online Best Practices",
    color: "#0D683B",
    bg: "#F0FDF4",
    estimatedMinutes: 8,
    video: {
      title: "Module 1 Video: Online Tutoring Setup & Engagement",
      duration: "4:20",
      embedUrl: "https://www.youtube.com/embed/rptGUV59u_o", // Helpful setup video
      summary: "Learn how to prepare your workspace, use Zoom effectively, and engage students from minute one.",
      keyPoints: ["Check audio/video before starting", "Use the whiteboard for visual learning", "Set clear goals at the beginning"],
    },
    content: [
      {
        heading: "The Virtual Environment",
        body: "Your workspace should be well-lit, quiet, and professional. Always test your Zoom audio and screen sharing before the student joins.",
      },
      {
        heading: "Building Rapport Online",
        body: "Spend the first 3 minutes asking about their day. A simple 'What's the best thing that happened this week?' builds trust before diving into academics.",
      },
      {
        heading: "Using Digital Tools",
        body: "Zoom's whiteboard is your best friend. Don't just talk—draw diagrams, write out equations step-by-step, and have the student annotate on the screen.",
      },
    ],
    quiz: {
      question: "What is the best way to start a virtual tutoring session?",
      options: [
        "Jump immediately into the hardest math problem to save time",
        "Spend 2-3 minutes building rapport and checking their tech",
        "Turn off your camera so they can focus on the audio",
        "Read a 10-minute lecture on the topic",
      ],
      correct: 1,
    },
  },
  {
    id: 2,
    title: "Child Safeguarding & Protection",
    color: "#C9922A",
    bg: "#F5F3FF",
    estimatedMinutes: 12,
    video: {
      title: "Module 2 Video: Identifying a Concern | Safeguarding",
      duration: "5:15",
      embedUrl: "https://www.youtube.com/embed/bkQqMawi2-Y",
      summary: "Understand your role in child protection, how to identify signs of concern, and the strict zero-contact rule outside of sessions.",
      keyPoints: ["Never share personal contact info", "Observe but do not investigate", "Report concerns immediately"],
    },
    content: [
      {
        heading: "Professional Boundaries",
        body: "Never share your phone number, social media, or email with a student. All communication must happen within the Learnivia platform or supervised Zoom rooms.",
      },
      {
        heading: "Identifying Concerns",
        body: "You are not an investigator. If a student says something alarming or you notice signs of neglect, your job is simply to listen, stay calm, and report it to Learnivia staff immediately.",
      },
      {
        heading: "Parental Supervision",
        body: "Parents are always allowed to observe sessions. If a parent joins, welcome them, but keep the instructional focus on the student.",
      },
    ],
    quiz: {
      question: "A student asks for your Instagram to ask a quick math question later. What should you do?",
      options: [
        "Give them a fake Instagram handle",
        "Share it only if their parent is in the room",
        "Politely decline and remind them that all communication must stay on Learnivia",
        "Give them your email instead",
      ],
      correct: 2,
    },
  },
  {
    id: 3,
    title: "Teaching Strategies & Encouragement",
    color: "#1D4ED8",
    bg: "#EFF6FF",
    estimatedMinutes: 10,
    video: {
      title: "Module 3 Video: Mentorship Mindset & Guided Learning",
      duration: "3:45",
      embedUrl: "https://www.youtube.com/embed/dYzy2zsdp84", // Better teaching strategies video
      summary: "Learn why guiding beats lecturing, how to ask discovery questions, and techniques for sincere praise.",
      keyPoints: ["Guide through questions, don't lecture", "Praise effort, not just intelligence", "Normalize mistakes as discoveries"],
    },
    content: [
      {
        heading: "The Role of a Mentor",
        body: "Your job is not to lecture, it's to guide. Ask questions instead of giving answers. Say 'What do you think comes next?' instead of 'The next step is...'.",
      },
      {
        heading: "Handling Wrong Answers",
        body: "Never say 'That's wrong'. Instead say 'Interesting - let's trace through that together and see where it leads.' This keeps students engaged and removes shame.",
      },
      {
        heading: "Encouragement That Works",
        body: "Praise effort, not just results. Say 'You worked through that really carefully' rather than just 'Great job!'. Specific praise builds resilience.",
      },
    ],
    quiz: {
      question: "A student gives a wrong answer to a problem. What is the best response?",
      options: [
        "Tell them it's wrong and give the correct answer",
        "Say 'Interesting - let's trace through that together'",
        "Skip and move to the next problem",
        "Ask them to try again without any guidance",
      ],
      correct: 1,
    },
  },
];

export default function TutorTrainingPage() {
  const [completedModules, setCompletedModules] = useState<Set<number>>(new Set());
  const [activeModule, setActiveModule] = useState<number | null>(null);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number | null>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<Set<number>>(new Set());
  const [savingModule, setSavingModule] = useState<number | null>(null);
  const [isLockedNotice, setIsLockedNotice] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("locked") === "1" || params.get("gate") === "1") {
        setIsLockedNotice(true);
      }
    }

    fetch("/api/tutor/training")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.completedModules && Array.isArray(data.completedModules)) {
          setCompletedModules(new Set(data.completedModules));
        }
      })
      .catch((err) => console.error("Failed to load training progress:", err));
  }, []);

  const handleModuleComplete = async (moduleId: number) => {
    const mod = MODULES.find((m) => m.id === moduleId);
    if (!mod) return;
    const ans = quizAnswers[moduleId];
    if (ans !== mod.quiz.correct) return;

    setSavingModule(moduleId);
    try {
      const res = await fetch("/api/tutor/training", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          moduleId,
          moduleTitle: mod.title,
          quizPassed: true,
        }),
      });
      if (res.ok) {
        setCompletedModules((prev) => new Set([...prev, moduleId]));
        setActiveModule(null);
      }
    } catch (err) {
      console.error("Failed to persist training module completion:", err);
    } finally {
      setSavingModule(null);
    }
  };

  const handleQuizAnswer = (moduleId: number, answerIndex: number) => {
    setQuizAnswers((prev) => ({ ...prev, [moduleId]: answerIndex }));
  };

  const handleQuizSubmit = (moduleId: number) => {
    setQuizSubmitted((prev) => new Set([...prev, moduleId]));
  };

  const handleQuizRetry = (moduleId: number) => {
    setQuizSubmitted((prev) => {
      const updated = new Set(prev);
      updated.delete(moduleId);
      return updated;
    });
    setQuizAnswers((prev) => ({ ...prev, [moduleId]: null }));
  };

  const allDone = completedModules.size === MODULES.length;

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#F9FAFB",
        fontFamily: "var(--font-body, Inter, sans-serif)",
      }}
    >
      {/* Header */}
      <div
        style={{
          background: "var(--wa-navy, #0F172A)",
          padding: "3rem 1.5rem 2rem",
          color: "#fff",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: "720px", margin: "0 auto" }}>
          <div
            style={{
              display: "inline-block",
              background: "rgba(255,255,255,0.2)",
              borderRadius: "6px",
              padding: "0.3rem 1rem",
              fontSize: "0.8rem",
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              marginBottom: "0.75rem",
            }}
          >
            Tutor Training - Required
          </div>
          <h1 style={{ fontSize: "clamp(1.75rem, 4vw, 2.5rem)", fontWeight: 800, margin: "0 0 0.75rem" }}>
            Complete Your Training
          </h1>
          <p style={{ opacity: 0.9, fontSize: "1rem" }}>
            You must complete all 5 modules before receiving your first booking.
            Training takes approximately 45-50 minutes total.
          </p>
          {/* Progress */}
          <div style={{ marginTop: "1.5rem" }}>
            <div style={{ fontSize: "1.5rem", fontWeight: 800 }}>
              {completedModules.size} / {MODULES.length}
            </div>
            <div style={{ fontSize: "0.875rem", opacity: 0.8 }}>Modules completed</div>
            <div
              style={{
                height: "8px",
                background: "rgba(255,255,255,0.25)",
                borderRadius: "4px",
                marginTop: "0.75rem",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: "100%",
                  transform: `scaleX(${completedModules.size / MODULES.length})`,
                  transformOrigin: "left",
                  background: "#fff",
                  borderRadius: "4px",
                  transition: "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
                }}
              />
            </div>
            <div style={{ marginTop: "1rem" }}>
              <Link
                href="/resources"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.4rem",
                  color: "#fff",
                  fontSize: "0.85rem",
                  textDecoration: "underline",
                  opacity: 0.95,
                  fontWeight: 500,
                }}
              >
                <BookOpen size={14} /> Review Official Tutoring Guide &amp; Resources →
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "2.5rem 1.5rem 5rem" }}>
        {/* Locked Notice if redirected from other tutor features */}
        {isLockedNotice && !allDone && (
          <div
            style={{
              background: "#FFFBEB",
              border: "1.5px solid #FCD34D",
              borderRadius: "14px",
              padding: "1.25rem 1.5rem",
              marginBottom: "2rem",
              display: "flex",
              alignItems: "flex-start",
              gap: "1rem",
              boxShadow: "0 2px 8px rgba(217, 119, 6, 0.08)",
            }}
          >
            <AlertCircle size={24} color="#D97706" style={{ flexShrink: 0, marginTop: "2px" }} />
            <div>
              <div style={{ fontWeight: 700, color: "#92400E", fontSize: "1rem" }}>
                Safeguarding Training Required
              </div>
              <p style={{ margin: "0.35rem 0 0", color: "#78350F", fontSize: "0.875rem", lineHeight: 1.55 }}>
                Tutor Overview, verified service records, upcoming sessions, and student inquiries are locked until all 5 safeguarding training modules below are passed. Complete each module and pass its short quiz to unlock full access.
              </p>
            </div>
          </div>
        )}

        {/* All Done Banner */}
        {allDone && (
          <div
            style={{
              background: "#F0FDF4",
              border: "2px solid #0D683B",
              borderRadius: "1rem",
              padding: "2rem",
              textAlign: "center",
              marginBottom: "2.5rem",
            }}
          >
            <div style={{ display: "flex", justifyContent: "center", marginBottom: "0.75rem" }}>
              <CheckCircle2 size={44} color="#0D683B" />
            </div>
            <h2 style={{ color: "#0D683B", fontWeight: 800, margin: "0 0 0.5rem" }}>
              Training Complete!
            </h2>
            <p style={{ color: "#166534", marginBottom: "1.25rem" }}>
              You&apos;ve completed all 5 training modules. You&apos;re now eligible to receive your first booking.
            </p>
            <Link
              href="/tutor"
              style={{
                display: "inline-block",
                background: "#0D683B",
                color: "#fff",
                padding: "0.75rem 2rem",
                borderRadius: "6px",
                textDecoration: "none",
                fontWeight: 700,
                fontSize: "0.9375rem",
              }}
            >
              Go to Tutor Dashboard →
            </Link>
          </div>
        )}

        {/* Module List */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {MODULES.map((mod) => {
            const isCompleted = completedModules.has(mod.id);
            const isOpen = activeModule === mod.id;
            const quizAnswer = quizAnswers[mod.id];
            const quizDone = quizSubmitted.has(mod.id);
            const quizCorrect = quizAnswer === mod.quiz.correct;

            return (
              <div
                key={mod.id}
                style={{
                  background: "#fff",
                  border: `1.5px solid ${isCompleted ? "#BBF7D0" : "#E5E7EB"}`,
                  borderRadius: "1rem",
                  overflow: "hidden",
                }}
              >
                {/* Module Header */}
                <button
                  onClick={() => setActiveModule(isOpen ? null : mod.id)}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem",
                    padding: "1.25rem 1.5rem",
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    textAlign: "left",
                  }}
                >
                  <div
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "var(--wa-radius-md)",
                      background: isCompleted ? "var(--wa-forest-light)" : "var(--wa-paper)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      border: "1px solid var(--wa-border)",
                    }}
                  >
                    {isCompleted ? (
                      <CheckCircle2 size={20} color="var(--wa-forest)" />
                    ) : mod.id === 1 ? (
                      <BookOpen size={18} color="var(--wa-forest)" />
                    ) : mod.id === 2 ? (
                      <Users size={18} color="var(--wa-ochre)" />
                    ) : mod.id === 3 ? (
                      <Video size={18} color="var(--wa-slate-blue)" />
                    ) : mod.id === 4 ? (
                      <ShieldCheck size={18} color="var(--wa-terra)" />
                    ) : (
                      <Clock size={18} color="var(--wa-forest)" />
                    )}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontSize: "1rem",
                        fontWeight: 700,
                        color: isCompleted ? "var(--wa-forest)" : "var(--wa-ink)",
                      }}
                    >
                      Module {mod.id}: {mod.title}
                    </div>
                    <div style={{ fontSize: "0.8125rem", color: "var(--wa-muted)", marginTop: "0.2rem" }}>
                      ~{mod.estimatedMinutes} min · {isCompleted ? "Completed" : "Not started"}
                    </div>
                  </div>
                  <div style={{ color: "var(--wa-muted)", display: "flex", alignItems: "center" }}>
                    <ChevronDown
                      size={18}
                      style={{
                        transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                        transition: "transform var(--wa-transition)",
                      }}
                    />
                  </div>
                </button>

                {/* Module Content */}
                {isOpen && (
                  <div style={{ padding: "0 1.5rem 1.5rem", borderTop: "1px solid #F3F4F6" }}>
                    {/* Resilient Video Training Walkthrough Player */}
                    <div style={{ marginTop: "1.25rem" }}>
                      <VideoLessonPlayer
                        video={mod.video}
                        color={mod.color}
                        bg={mod.bg}
                        content={mod.content}
                      />
                    </div>
                    {mod.content.map((section, idx) => (
                      <div key={idx} style={{ marginTop: "1.25rem" }}>
                        <h3
                          style={{
                            fontSize: "0.9375rem",
                            fontWeight: 700,
                            color: mod.color,
                            marginBottom: "0.4rem",
                          }}
                        >
                          {section.heading}
                        </h3>
                        <p style={{ fontSize: "0.9125rem", color: "#374151", lineHeight: 1.7 }}>
                          {section.body}
                        </p>
                      </div>
                    ))}

                    {/* Quiz */}
                    <div
                      style={{
                        marginTop: "2rem",
                        background: mod.bg,
                        border: `1px solid ${mod.color}33`,
                        borderRadius: "0.75rem",
                        padding: "1.25rem",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "0.8rem",
                          fontWeight: 700,
                          textTransform: "uppercase",
                          letterSpacing: "0.06em",
                          color: mod.color,
                          marginBottom: "0.5rem",
                        }}
                      >
                        Quick Check
                      </div>
                      <p style={{ fontWeight: 600, fontSize: "0.9375rem", color: "#111827", marginBottom: "1rem" }}>
                        {mod.quiz.question}
                      </p>

                      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                        {mod.quiz.options.map((opt, optIdx) => {
                          const isSelected = quizAnswer === optIdx;
                          const isCorrectOpt = optIdx === mod.quiz.correct;
                          let optBg = "#fff";
                          let optBorder = "#D1D5DB";
                          let optColor = "#374151";

                          if (quizDone) {
                            if (isCorrectOpt) { optBg = "#F0FDF4"; optBorder = "#0D683B"; optColor = "#0D683B"; }
                            else if (isSelected && !isCorrectOpt) { optBg = "#FEF2F2"; optBorder = "#EF4444"; optColor = "#DC2626"; }
                          } else if (isSelected) {
                            optBg = mod.bg;
                            optBorder = mod.color;
                            optColor = mod.color;
                          }

                          return (
                            <button
                              key={optIdx}
                              onClick={() => !quizDone && handleQuizAnswer(mod.id, optIdx)}
                              disabled={quizDone}
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "0.75rem",
                                background: optBg,
                                border: `1.5px solid ${optBorder}`,
                                borderRadius: "0.5rem",
                                padding: "0.65rem 1rem",
                                cursor: quizDone ? "default" : "pointer",
                                textAlign: "left",
                                color: optColor,
                                fontWeight: isSelected || (quizDone && isCorrectOpt) ? 700 : 400,
                                fontSize: "0.875rem",
                                transition: "all 0.15s",
                              }}
                            >
                              <span
                                style={{
                                  width: "18px",
                                  height: "18px",
                                  borderRadius: "50%",
                                  border: `2px solid ${optBorder}`,
                                  background: isSelected ? optBorder : "transparent",
                                  flexShrink: 0,
                                }}
                              />
                              {opt}
                            </button>
                          );
                        })}
                      </div>

                      <div style={{ marginTop: "1rem", display: "flex", gap: "0.75rem", alignItems: "center" }}>
                        {!quizDone && (
                          <button
                            onClick={() => handleQuizSubmit(mod.id)}
                            disabled={quizAnswer === undefined || quizAnswer === null}
                            style={{
                              background: mod.color,
                              color: "#fff",
                              border: "none",
                              borderRadius: "6px",
                              padding: "0.55rem 1.5rem",
                              fontWeight: 700,
                              fontSize: "0.875rem",
                              cursor: quizAnswer !== null ? "pointer" : "not-allowed",
                              opacity: quizAnswer !== null ? 1 : 0.5,
                            }}
                          >
                            Submit Answer
                          </button>
                        )}
                        {quizDone && (
                          <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
                            <div style={{ color: quizCorrect ? "var(--wa-forest)" : "var(--wa-terra)", fontWeight: 700, fontSize: "0.9rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                              {quizCorrect ? (
                                <>
                                  <CheckCircle2 size={16} /> Correct! Great understanding.
                                </>
                              ) : (
                                <>
                                  <AlertCircle size={16} /> Not quite - review the notes and try again.
                                </>
                              )}
                            </div>
                            {!quizCorrect && (
                              <button
                                type="button"
                                onClick={() => handleQuizRetry(mod.id)}
                                style={{
                                  background: "var(--wa-paper)",
                                  border: "1px solid var(--wa-border)",
                                  borderRadius: "var(--wa-radius-sm)",
                                  padding: "0.35rem 0.85rem",
                                  fontSize: "0.8rem",
                                  fontWeight: 600,
                                  cursor: "pointer",
                                  color: "var(--wa-ink)",
                                  display: "inline-flex",
                                  alignItems: "center",
                                  gap: "0.35rem",
                                }}
                              >
                                <RotateCcw size={13} /> Try Again
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Complete Module Button */}
                    {!isCompleted && (
                      <button
                        onClick={() => handleModuleComplete(mod.id)}
                        disabled={!quizDone || !quizCorrect || savingModule === mod.id}
                        style={{
                          marginTop: "1.5rem",
                          width: "100%",
                          background: quizDone && quizCorrect ? "#0E8345" : "#E5E7EB",
                          color: quizDone && quizCorrect ? "#fff" : "#9CA3AF",
                          border: "none",
                          borderRadius: "0.75rem",
                          padding: "0.85rem",
                          fontWeight: 800,
                          fontSize: "0.9375rem",
                          cursor: quizDone && quizCorrect && savingModule !== mod.id ? "pointer" : "not-allowed",
                          transition: "background 0.2s",
                        }}
                      >
                        {savingModule === mod.id
                          ? "Saving progress..."
                          : quizDone && quizCorrect
                          ? `Save & Mark Module ${mod.id} Complete`
                          : quizDone && !quizCorrect
                          ? "Must pass quiz check to proceed"
                          : "Complete the quiz above to continue"}
                      </button>
                    )}

                    {isCompleted && (
                      <div
                        style={{
                          marginTop: "1.5rem",
                          textAlign: "center",
                          color: "var(--wa-forest)",
                          fontWeight: 700,
                          fontSize: "0.9375rem",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "0.4rem",
                        }}
                      >
                        <CheckCircle2 size={18} /> Module completed
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div style={{ marginTop: "2rem", textAlign: "center" }}>
          <Link
            href="/tutor"
            style={{ color: "#6B7280", fontSize: "0.875rem", textDecoration: "none" }}
          >
            ← Back to Tutor Dashboard
          </Link>
        </div>
      </div>
    </main>
  );
}
