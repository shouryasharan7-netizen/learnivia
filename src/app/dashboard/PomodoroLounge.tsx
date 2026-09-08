"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import styles from "./page.module.css";
import { Play, Pause, RotateCcw, Zap, Headphones, MessageSquare } from "lucide-react";

export default function PomodoroLounge() {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState<"focus" | "break">("focus");

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      if (mode === "focus") {
        setMode("break");
        setTimeLeft(5 * 60);
      } else {
        setMode("focus");
        setTimeLeft(25 * 60);
      }
      setIsRunning(false);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isRunning, timeLeft, mode]);

  const toggleTimer = () => setIsRunning(!isRunning);

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(mode === "focus" ? 25 * 60 : 5 * 60);
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  return (
    <div className={styles.bentoLoungeCard} aria-label="Interactive Focus Lounge">
      <div className={styles.bentoLoungeLeft}>
        <div className={styles.loungeBadgeRow}>
          <span className={styles.loungeLivePill}>
            <span className={styles.loungeDotPing} />
            LIVE FOCUS LOUNGE • 38 PEERS STUDYING
          </span>
          <span className={styles.loungeModeBadge}>
            <Headphones size={13} /> {mode === "focus" ? "25m Sprint" : "5m Recovery"}
          </span>
        </div>
        <h2 className={styles.bentoLoungeTitle}>Silent Co-Study &amp; Pomodoro Hub</h2>
        <p className={styles.bentoLoungeDesc}>
          Join students worldwide for synchronized deep focus sprints. Run your timer, minimize distractions, and study alongside peers.
        </p>
        <div className={styles.bentoLoungeActions}>
          <Link href="/sessions" className={styles.bentoJoinBtn} prefetch={false}>
            <Zap size={15} /> Join Live Study Room
          </Link>
          <Link href="/homework-help" className={styles.bentoSecondaryBtn} prefetch={false}>
            <MessageSquare size={14} /> Ask Homework Help
          </Link>
        </div>
      </div>

      {/* Interactive Micro-Timer Widget */}
      <div className={styles.timerWidget}>
        <div className={styles.timerHeader}>
          <span className={styles.timerModeLabel}>
            {mode === "focus" ? "DEEP FOCUS SPRINT" : "REST BREAK"}
          </span>
        </div>
        <div className={styles.timerDigits}>{formattedTime}</div>
        <div className={styles.timerControls}>
          <button
            onClick={toggleTimer}
            className={styles.timerPlayBtn}
            aria-label={isRunning ? "Pause timer" : "Start timer"}
          >
            {isRunning ? <Pause size={16} /> : <Play size={16} fill="currentColor" />}
            <span>{isRunning ? "Pause" : "Start"}</span>
          </button>
          <button
            onClick={resetTimer}
            className={styles.timerResetBtn}
            aria-label="Reset timer"
          >
            <RotateCcw size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
