"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const MODULES = [
  {
    id: 1,
    title: "Tutoring Basics & Encouragement",
    icon: "📚",
    color: "#0D683B",
    bg: "#F0FDF4",
    estimatedMinutes: 10,
    content: [
      {
        heading: "The Role of a Volunteer Tutor",
        body: "Your job is not to lecture — it's to guide. Ask questions instead of giving answers. Say 'What do you think comes next?' instead of 'The next step is...'. This builds confidence and independent thinking.",
      },
      {
        heading: "Active Listening",
        body: "When a student explains their confusion, listen fully before responding. Repeat back what you heard: 'So you understand how to multiply, but you're not sure when to use division?' This shows you're engaged and helps clarify the real issue.",
      },
      {
        heading: "Encouragement That Works",
        body: "Praise effort, not just results. Say 'You worked through that really carefully' rather than just 'Great job!'. Specific praise is more motivating and helps students understand what they did well.",
      },
      {
        heading: "Handling Wrong Answers",
        body: "Never say 'That's wrong'. Instead say 'Interesting — let's trace through that together and see where it leads.' This keeps students engaged and removes shame from making mistakes.",
      },
    ],
    quiz: {
      question: "A student gives a wrong answer. What is the best response?",
      options: [
        "Tell them it's wrong and give the correct answer",
        "Say 'Interesting — let's trace through that together'",
        "Skip and move to the next problem",
        "Ask them to try again without any guidance",
      ],
      correct: 1,
    },
  },
  {
    id: 2,
    title: "Supporting Students Who Learn Differently",
    icon: "🧠",
    color: "#C9922A",
    bg: "#F5F3FF",
    estimatedMinutes: 12,
    content: [
      {
        heading: "Every Learner is Different",
        body: "Some students need concepts explained visually with diagrams. Others need to hear it spoken aloud. Some need extra time to process. None of these differences require a formal diagnosis — they are simply different learning profiles.",
      },
      {
        heading: "Visual Learners",
        body: "Use Zoom's whiteboard to draw diagrams, number lines, or step-by-step visual breakdowns. For a fraction problem, draw the pie chart. For a grammar rule, show it in a table. Visual aids dramatically improve retention for many learners.",
      },
      {
        heading: "Step-by-Step Pacing",
        body: "Break every problem into numbered micro-steps. Don't combine steps. For example, instead of 'Solve 3x + 6 = 15', say: Step 1: What do we want to get x by itself? Step 2: What's in our way? Step 3: Let's remove the 6 first...",
      },
      {
        heading: "Neurodiverse Learners",
        body: "Students with ADHD may need shorter task chunks and more frequent check-ins ('Does that make sense so far?'). Students with dyslexia may struggle with reading speed — read problems aloud for them. Always follow the student's pace, not a pre-set speed.",
      },
      {
        heading: "No Diagnosis Required",
        body: "You should never ask a student if they have a diagnosis, and never make assumptions. Simply follow the student's cues: if they need more time, give it. If they need visual support, provide it. Adapt to the person in front of you.",
      },
    ],
    quiz: {
      question: "A student seems confused. What should you do first?",
      options: [
        "Re-read the textbook solution to them",
        "Ask 'Which part was confusing?' then break it into smaller steps",
        "Move on to an easier problem and come back later",
        "Ask them if they have a learning disability",
      ],
      correct: 1,
    },
  },
  {
    id: 3,
    title: "Online Zoom Tutoring Best Practices",
    icon: "💻",
    color: "#1D4ED8",
    bg: "#EFF6FF",
    estimatedMinutes: 8,
    content: [
      {
        heading: "Before Every Session",
        body: "Test your audio and camera 5 minutes before the session. Have a clean, quiet background. Close unnecessary browser tabs. Open any materials you'll need — the whiteboard, a calculator, or a relevant document.",
      },
      {
        heading: "Using the Zoom Whiteboard",
        body: "Zoom's whiteboard is your primary teaching tool. Use it to draw diagrams, write equations, create tables, and show step-by-step solutions. Ask the student to draw their thinking on the whiteboard too — this reveals misconceptions faster than words.",
      },
      {
        heading: "Screen Sharing",
        body: "Only share your screen when necessary. When you do, share a specific window, not your entire desktop. Always narrate what you're doing: 'I'm going to show you how I'd set up this problem...'",
      },
      {
        heading: "Audio Checks",
        body: "At the start of every session: 'Can you hear me clearly?' and 'Can you see my whiteboard/screen?'. Don't assume the connection is fine. If audio drops, use Zoom Chat as a backup.",
      },
      {
        heading: "Session Pacing",
        body: "Keep sessions focused. A typical 45-60 minute session should cover: 5 min warm-up, 30-40 min main content, 10 min review and Q&A. End with: 'What was the most helpful thing from today?'",
      },
    ],
    quiz: {
      question: "What is the Zoom whiteboard best used for?",
      options: [
        "Showing YouTube videos",
        "Drawing diagrams, writing equations, and visualizing step-by-step solutions",
        "Recording the session",
        "Sharing your entire desktop",
      ],
      correct: 1,
    },
  },
  {
    id: 4,
    title: "Safety, Boundaries & Safeguarding",
    icon: "🛡️",
    color: "#B45309",
    bg: "#FFFBEB",
    estimatedMinutes: 10,
    content: [
      {
        heading: "Platform-Only Communication",
        body: "All communication with students and parents MUST happen through Learnivia. Never share your personal phone number, email, social media, or any other contact information with students or parents. This protects both you and the student.",
      },
      {
        heading: "Session Privacy",
        body: "Do not record sessions unless explicitly requested by the parent AND approved by Learnivia admin. Do not screenshot students' work and share it externally. What happens in a session stays in the session.",
      },
      {
        heading: "Minor Protection",
        body: "Students are K-10, which means many are under 13. Treat every interaction as if a parent is watching — because for young students, they may be. Keep all conversations strictly academic.",
      },
      {
        heading: "If a Student Discloses Something Concerning",
        body: "If a student says something that concerns you (e.g., mentions being hurt, feeling unsafe), do NOT try to handle it yourself. End the session politely, then immediately report it through Learnivia's 'Report a Concern' tool. Do not promise confidentiality to students.",
      },
      {
        heading: "Your Own Boundaries",
        body: "You are not a counselor or parent. If a session goes off-topic to non-academic issues, gently redirect: 'I want to make sure we use our session time well — let's come back to your math problem.' You are allowed to end sessions early if you feel uncomfortable.",
      },
    ],
    quiz: {
      question: "A parent asks for your personal phone number to schedule sessions directly. What do you do?",
      options: [
        "Share it — it's easier for everyone",
        "Politely decline and explain all scheduling must go through Learnivia",
        "Give them your email instead",
        "Block them on the platform",
      ],
      correct: 1,
    },
  },
  {
    id: 5,
    title: "Volunteer Hours & Verification Rules",
    icon: "⏱️",
    color: "#0F766E",
    bg: "#F0FDFA",
    estimatedMinutes: 8,
    content: [
      {
        heading: "How Hours are Logged",
        body: "Learnivia automatically logs your session start and end times. You do not need to manually track hours. Only sessions where both you AND the student were present for at least 10 minutes count toward verified hours.",
      },
      {
        heading: "What Counts as a Completed Session",
        body: "A session is marked COMPLETED when: (1) it occurs at the scheduled time, (2) both tutor and student joined via the Zoom link, and (3) the session lasted at least 10 minutes. Cancelled or no-show sessions do not count.",
      },
      {
        heading: "Student No-Shows",
        body: "If a student does not join within 10 minutes of the start time, end the session and mark it as a student no-show in your dashboard. This session will not count against your hours, and admin will follow up with the student.",
      },
      {
        heading: "Downloading Your Transcript",
        body: "Go to Tutor Dashboard → Volunteer Transcript. You can download a PDF with your total verified hours, session-by-session breakdown, and unique verification IDs for each session. This transcript is accepted by NHS chapters, school advisors, and community organizations.",
      },
      {
        heading: "Adjustments & Disputes",
        body: "If you believe a session was not counted correctly, contact admin through the platform with the session ID. Adjustments require admin review and are logged in the audit trail. Do not attempt to manually edit session records.",
      },
    ],
    quiz: {
      question: "When is a session counted as a verified volunteer hour?",
      options: [
        "When you join the Zoom call, even if the student doesn't show up",
        "When both you and the student joined and the session lasted at least 10 minutes",
        "Only when you submit a manual timesheet",
        "When an admin manually approves it after the session",
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

  useEffect(() => {
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
          background: "linear-gradient(135deg, #0E8345, #1a6b3a)",
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
              borderRadius: "999px",
              padding: "0.3rem 1rem",
              fontSize: "0.8rem",
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              marginBottom: "0.75rem",
            }}
          >
            Tutor Training — Required
          </div>
          <h1 style={{ fontSize: "clamp(1.75rem, 4vw, 2.5rem)", fontWeight: 800, margin: "0 0 0.75rem" }}>
            Complete Your Training
          </h1>
          <p style={{ opacity: 0.9, fontSize: "1rem" }}>
            You must complete all 5 modules before receiving your first booking.
            Training takes approximately 45–50 minutes total.
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
                  width: `${(completedModules.size / MODULES.length) * 100}%`,
                  background: "#fff",
                  borderRadius: "4px",
                  transition: "width 0.4s ease",
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "2.5rem 1.5rem 5rem" }}>
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
            <div style={{ fontSize: "3rem", marginBottom: "0.5rem" }}>🎉</div>
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
                borderRadius: "999px",
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
                      width: "44px",
                      height: "44px",
                      borderRadius: "0.75rem",
                      background: isCompleted ? "#F0FDF4" : mod.bg,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "1.25rem",
                      flexShrink: 0,
                    }}
                  >
                    {isCompleted ? "✅" : mod.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontSize: "1rem",
                        fontWeight: 700,
                        color: isCompleted ? "#0D683B" : "#111827",
                      }}
                    >
                      Module {mod.id}: {mod.title}
                    </div>
                    <div style={{ fontSize: "0.8125rem", color: "#6B7280", marginTop: "0.2rem" }}>
                      ~{mod.estimatedMinutes} min · {isCompleted ? "Completed ✓" : "Not started"}
                    </div>
                  </div>
                  <div style={{ color: "#9CA3AF", fontSize: "1.25rem" }}>
                    {isOpen ? "▲" : "▼"}
                  </div>
                </button>

                {/* Module Content */}
                {isOpen && (
                  <div style={{ padding: "0 1.5rem 1.5rem", borderTop: "1px solid #F3F4F6" }}>
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
                              borderRadius: "999px",
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
                            <div style={{ color: quizCorrect ? "#0D683B" : "#DC2626", fontWeight: 700, fontSize: "0.9rem" }}>
                              {quizCorrect
                                ? "✅ Correct! Great understanding."
                                : "❌ Not quite — review the notes and try again."}
                            </div>
                            {!quizCorrect && (
                              <button
                                type="button"
                                onClick={() => handleQuizRetry(mod.id)}
                                style={{
                                  background: "#F3F4F6",
                                  border: "1px solid #D1D5DB",
                                  borderRadius: "999px",
                                  padding: "0.35rem 0.85rem",
                                  fontSize: "0.8rem",
                                  fontWeight: 600,
                                  cursor: "pointer",
                                  color: "#374151",
                                }}
                              >
                                Try Again 🔄
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
                          ? `✓ Save & Mark Module ${mod.id} Complete`
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
                          color: "#0D683B",
                          fontWeight: 700,
                          fontSize: "0.9375rem",
                        }}
                      >
                        ✅ Module completed!
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
