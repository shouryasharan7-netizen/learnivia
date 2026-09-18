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
      : gradeBand || curriculum || "K–10 Peer Learning";

  return (
    <section aria-labelledby="learning-summary-heading">
      <div className={styles.sectionHeader}>
        <h2 id="learning-summary-heading" className={styles.sectionTitle}>
          <BookOpen size={16} color="var(--wa-crimson, #8B263E)" />
          <span>Academic Ledger</span>
        </h2>
      </div>

      <div className={styles.summaryLedger}>
        <div className={styles.summaryGrid}>
          <div className={styles.summaryCard}>
            <span className={styles.summaryLabel}>Completed</span>
            <span className={styles.summaryNumber}>{completedSessionsCount}</span>
            <span className={styles.summaryNote}>Verified sessions</span>
          </div>

          <div className={styles.summaryCard}>
            <span className={styles.summaryLabel}>Total Time</span>
            <span className={styles.summaryNumber}>{formattedDuration}</span>
            <span className={styles.summaryNote}>Instructional time</span>
          </div>

          <div className={styles.summaryCard}>
            <span className={styles.summaryLabel}>Grade Focus</span>
            <div style={{ marginTop: "0.2rem" }}>
              <span style={{ fontSize: "1.05rem", fontWeight: 700, color: "var(--wa-ink, #1A1615)", lineHeight: 1.2, display: "block" }}>
                {gradeDisplay}
              </span>
            </div>
            <span className={styles.summaryNote}>Academic track</span>
          </div>
        </div>

        <p className={styles.ledgerFooterNote}>
          <ShieldCheck size={13} style={{ display: "inline", verticalAlign: "middle", marginRight: "4px" }} />
          Truthful academic records verified through student & tutor attendance confirmation. Zero gamification.
        </p>
      </div>
    </section>
  );
}
