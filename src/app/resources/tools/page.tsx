"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import styles from "./page.module.css";

const ICEBREAKERS = [
  "What is one concept from class this week that made you say 'aha!'?",
  "If you had to teach someone this topic in 60 seconds, where would you start?",
  "What is the trickiest mistake students usually make on this type of problem?",
  "On a scale of 1 to 10, how confident do you feel about this upcoming exam?",
  "What is your favorite study snack or playlist when working through problem sets?",
  "What's one goal you want to accomplish by the end of our session today?",
];

export default function TutorToolsPage() {
  // Timer State
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [timerRunning, setTimerRunning] = useState(false);
  const [selectedDuration, setSelectedDuration] = useState(25);

  // Icebreaker State
  const [currentPromptIdx, setCurrentPromptIdx] = useState(0);

  // Scratchpad State
  const [notes, setNotes] = useState("");

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (timerRunning && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft((prev) => prev - 1);
      }, 1000);
    } else if (secondsLeft === 0) {
      setTimerRunning(false);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerRunning, secondsLeft]);

  function setTimerPreset(minutes: number) {
    setTimerRunning(false);
    setSelectedDuration(minutes);
    setSecondsLeft(minutes * 60);
  }

  function toggleTimer() {
    setTimerRunning(!timerRunning);
  }

  function resetTimer() {
    setTimerRunning(false);
    setSecondsLeft(selectedDuration * 60);
  }

  function nextPrompt() {
    setCurrentPromptIdx((prev) => (prev + 1) % ICEBREAKERS.length);
  }

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const timeFormatted = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <div className={styles.breadcrumb}>
          <Link href="/resources">Tutoring Resources</Link>
          <span>/</span>
          <span>Learning Tools</span>
        </div>

        <div className={styles.header}>
          <h1 className={styles.title}>Interactive Tutoring Tools</h1>
          <p className={styles.subtitle}>
            In-session utilities for time management, icebreakers, student engagement, and quick session notes.
          </p>
        </div>

        <div className={styles.toolsGrid}>
          {/* Tool 1: Session Timer */}
          <div className={styles.toolCard}>
            <div className={styles.toolHeader}>
              <span className={styles.toolIcon}>⏱️</span>
              <div>
                <h2 className={styles.toolTitle}>Session &amp; Focus Timer</h2>
                <p className={styles.toolDesc}>Keep your 1-on-1 tutoring sessions on track.</p>
              </div>
            </div>

            <div className={styles.timerDisplay}>
              <span className={styles.timerDigits}>{timeFormatted}</span>
            </div>

            <div className={styles.presetsRow}>
              <button
                className={`${styles.presetBtn} ${selectedDuration === 15 ? styles.presetBtnActive : ""}`}
                onClick={() => setTimerPreset(15)}
              >
                15m Check-in
              </button>
              <button
                className={`${styles.presetBtn} ${selectedDuration === 25 ? styles.presetBtnActive : ""}`}
                onClick={() => setTimerPreset(25)}
              >
                25m Pomodoro
              </button>
              <button
                className={`${styles.presetBtn} ${selectedDuration === 50 ? styles.presetBtnActive : ""}`}
                onClick={() => setTimerPreset(50)}
              >
                50m Full Session
              </button>
            </div>

            <div className={styles.timerControls}>
              <button className={styles.startBtn} onClick={toggleTimer}>
                {timerRunning ? "Pause ⏸️" : "Start ▶️"}
              </button>
              <button className={styles.resetBtn} onClick={resetTimer}>
                Reset 🔄
              </button>
            </div>
          </div>

          {/* Tool 2: Icebreaker & Check-in Prompts */}
          <div className={styles.toolCard}>
            <div className={styles.toolHeader}>
              <span className={styles.toolIcon}>💡</span>
              <div>
                <h2 className={styles.toolTitle}>Check-In &amp; Reflection Prompts</h2>
                <p className={styles.toolDesc}>Kick off the call or wrap up with quick student self-assessments.</p>
              </div>
            </div>

            <div className={styles.promptBox}>
              <p className={styles.promptText}>&ldquo;{ICEBREAKERS[currentPromptIdx]}&rdquo;</p>
            </div>

            <button className={styles.nextPromptBtn} onClick={nextPrompt}>
              Next Prompt 🎲
            </button>
          </div>

          {/* Tool 3: In-Session Scratchpad */}
          <div className={`${styles.toolCard} ${styles.fullWidthCard}`}>
            <div className={styles.toolHeader}>
              <span className={styles.toolIcon}>📝</span>
              <div>
                <h2 className={styles.toolTitle}>Session Notes &amp; Follow-up Scratchpad</h2>
                <p className={styles.toolDesc}>Jot down key problems covered, formulas to remember, and next steps.</p>
              </div>
            </div>

            <textarea
              className={styles.scratchpad}
              placeholder="e.g. Covered quadratic factoring. Student excelled at recognizing (x+a)(x+b) patterns. Next session: focus on completing the square when a > 1."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={5}
            />

            <div className={styles.scratchpadFooter}>
              <span>{notes.length} characters</span>
              {notes.length > 0 && (
                <button className={styles.clearBtn} onClick={() => setNotes("")}>
                  Clear Notes
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
