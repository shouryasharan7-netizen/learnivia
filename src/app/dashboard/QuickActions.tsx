"use client";

import React from "react";
import Link from "next/link";
import { Compass, HelpCircle, CalendarCheck, ArrowRight } from "lucide-react";
import styles from "./dashboard.module.css";
import { ROUTES } from "@/lib/routes";

export function QuickActions() {
  const actions = [
    {
      id: "find",
      title: "Find a Peer Tutor",
      desc: "Search verified volunteer tutors across K-10 Math, Science, and English.",
      href: ROUTES.find,
      icon: Compass,
    },
    {
      id: "homework",
      title: "Ask Homework Help",
      desc: "Submit a private academic inquiry to our peer queue for step-by-step guidance.",
      href: ROUTES.homeworkHelp,
      icon: HelpCircle,
    },
    {
      id: "sessions",
      title: "My Study Sessions",
      desc: "Review upcoming bookings, launch Zoom waiting rooms, and inspect session notes.",
      href: ROUTES.sessions,
      icon: CalendarCheck,
    },
  ];

  return (
    <section aria-labelledby="quick-actions-heading">
      <div className={styles.sectionHeader}>
        <h2 id="quick-actions-heading" className={styles.sectionTitle}>
          Study Desk Actions
        </h2>
      </div>
      <div className={styles.quickActionsGrid}>
        {actions.map((act) => {
          const Icon = act.icon;
          return (
            <Link key={act.id} href={act.href} className={styles.actionCard} prefetch={false}>
              <div className={styles.actionIconWrap}>
                <Icon size={18} />
              </div>
              <h3 className={styles.actionTitle}>
                <span>{act.title}</span>
                <ArrowRight size={14} style={{ opacity: 0.6 }} />
              </h3>
              <p className={styles.actionDesc}>{act.desc}</p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
