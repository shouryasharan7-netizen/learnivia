"use client";

import React from "react";
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
      : gradeBand || curriculum || "K–10 Peer Learning";

  return (
    <section aria-labelledby="learning-summary-heading">
      <div className={styles.sectionHeader}>
        <h2 id="learning-summary-heading" className={styles.sectionTitle}>
          Learning Summary
        </h2>
      </div>
      <div className={styles.summaryGrid}>
        <div className={styles.summaryCard}>
          <span className={styles.summaryLabel}>Completed Sessions</span>
          <span className={styles.summaryNumber}>{completedSessionsCount}</span>
          <span className={styles.summaryNote}>Verified 1-on-1 peer sessions</span>
        </div>

        <div className={styles.summaryCard}>
          <span className={styles.summaryLabel}>Learning Time</span>
          <span className={styles.summaryNumber}>{formattedDuration}</span>
          <span className={styles.summaryNote}>Direct instructional minutes</span>
        </div>

        <div className={styles.summaryCard}>
          <span className={styles.summaryLabel}>Academic Focus</span>
          <div style={{ marginTop: "0.25rem" }}>
            <span style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--wa-ink)" }}>
              {gradeDisplay}
            </span>
          </div>
          <span className={styles.summaryNote}>Registered grade band & curriculum</span>
        </div>
      </div>
    </section>
  );
}
