"use client";

import React from "react";
import { BookOpen, ShieldCheck } from "lucide-react";
import styles from "./dashboard.module.css";

interface TruthfulSummaryProps {
  completedSessionsCount: number;
  totalLearningMinutes: number;
  gradeBand?: string | null;
  curriculum?: string | null;
}

export function TruthfulSummary({
  completedSessionsCount,
  totalLearningMinutes,
  gradeBand,
  curriculum,
}: TruthfulSummaryProps) {
  const hours = Math.floor(totalLearningMinutes / 60);
  const remainingMinutes = totalLearningMinutes % 60;
  const formattedDuration =
    hours > 0
      ? `${hours}h ${remainingMinutes}m`
      : `${totalLearningMinutes} min`;

  const gradeDisplay =
    gradeBand && curriculum
      ? `${gradeBand} (${curriculum})`
      : gradeBand || curriculum || "K-10 Peer Learning";

  return (
    <section aria-labelledby="learning-summary-heading">
      <div className={styles.sectionHeader}>
        <h2 id="learning-summary-heading" className={styles.sectionTitle}>
          <BookOpen size={16} color="var(--wa-crimson, #2563EB)" />
          <span>My Study Progress</span>
        </h2>
      </div>

      <div className={styles.summaryLedger}>
        <div className={styles.summaryGrid}>
          <div className={styles.summaryTopRow}>
            <div className={styles.summaryCard}>
              <span className={styles.summaryLabel}>Sessions Completed</span>
              <span className={styles.summaryNumber}>
                {completedSessionsCount}
              </span>
              <span className={styles.summaryNote}>Verified peer sessions</span>
            </div>

            <div className={styles.summaryCard}>
              <span className={styles.summaryLabel}>Total Study Time</span>
              <span className={styles.summaryNumber}>{formattedDuration}</span>
              <span className={styles.summaryNote}>Time spent learning</span>
            </div>
          </div>

          <div className={styles.summaryCard}>
            <span className={styles.summaryLabel}>Curriculum Track</span>
            <div style={{ marginTop: "0.25rem" }}>
              <span
                style={{
                  fontSize: "0.95rem",
                  fontWeight: 700,
                  color: "var(--wa-ink, #0F172A)",
                  lineHeight: 1.4,
                  display: "block",
                }}
              >
                {gradeDisplay}
              </span>
            </div>
            <span className={styles.summaryNote}>Active academic profile</span>
          </div>
        </div>

        <p className={styles.ledgerFooterNote}>
          <ShieldCheck
            size={14}
            style={{
              display: "inline",
              verticalAlign: "middle",
              marginRight: "6px",
              color: "#059669",
            }}
          />
          Your study time and completed sessions are confirmed by you and your
          tutor after each meeting.
        </p>
      </div>
    </section>
  );
}
