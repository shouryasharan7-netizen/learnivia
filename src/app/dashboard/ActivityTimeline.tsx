"use client";

import React from "react";
import Link from "next/link";
import { Clock, HelpCircle, CalendarCheck, ArrowRight } from "lucide-react";
import styles from "./dashboard.module.css";
import { FormattedDateTime } from "@/components/FormattedDateTime";
import { ROUTES } from "@/lib/routes";

export interface TimelineItem {
  id: string;
  type: "session" | "homework";
  title: string;
  subtitle: string;
  date: string | Date;
  statusLabel?: string;
  href: string;
}

interface ActivityTimelineProps {
  items: TimelineItem[];
  userTimezone?: string | null;
}

export function ActivityTimeline({ items, userTimezone }: ActivityTimelineProps) {
  return (
    <section aria-labelledby="recent-activity-heading">
      <div className={styles.sectionHeader}>
        <h2 id="recent-activity-heading" className={styles.sectionTitle}>
          Recent Activity
        </h2>
        {items.length > 0 && (
          <Link href={ROUTES.sessions} className={styles.sectionLink}>
            Session history <ArrowRight size={13} />
          </Link>
        )}
      </div>

      <div className={styles.timelineCard}>
        {items.length === 0 ? (
          <div style={{ textAlign: "center", padding: "1.5rem 1rem", color: "var(--wa-muted)" }}>
            <Clock size={28} style={{ opacity: 0.4, marginBottom: "0.5rem" }} />
            <p style={{ margin: 0, fontSize: "0.875rem" }}>
              Your completed tutoring sessions and submitted homework questions will appear here.
            </p>
          </div>
        ) : (
          <ul className={styles.timelineList}>
            {items.map((item) => (
              <li key={item.id} className={styles.timelineItem}>
                <div
                  className={`${styles.timelineDot} ${
                    item.type === "homework" ? styles.timelineDotHomework : ""
                  }`}
                  aria-hidden="true"
                />
                <div className={styles.timelineContent}>
                  <div className={styles.timelineRow}>
                    <Link
                      href={item.href}
                      style={{ textDecoration: "none", color: "inherit" }}
                    >
                      <h3 className={styles.timelineTitle}>{item.title}</h3>
                    </Link>
                    <span className={styles.timelineDate}>
                      <FormattedDateTime date={item.date} userTimezone={userTimezone} />
                    </span>
                  </div>
                  <p className={styles.timelineSub}>{item.subtitle}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
