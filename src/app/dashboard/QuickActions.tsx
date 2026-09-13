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
      title: "Find a tutor",
      desc: "Search verified volunteer tutors by academic subject, curriculum, and grade level.",
      href: ROUTES.find,
      icon: Compass,
    },
    {
      id: "homework",
      title: "Ask homework help",
      desc: "Submit a private academic question to our peer tutoring queue for step-by-step guidance.",
      href: ROUTES.homeworkHelp,
      icon: HelpCircle,
    },
    {
      id: "sessions",
      title: "View my sessions",
      desc: "Review your upcoming bookings, join Zoom meetings, and inspect past session notes.",
      href: ROUTES.sessions,
      icon: CalendarCheck,
    },
  ];

  return (
    <section aria-labelledby="quick-actions-heading">
      <div className={styles.sectionHeader}>
        <h2 id="quick-actions-heading" className={styles.sectionTitle}>
          Quick Actions
        </h2>
      </div>
      <div className={styles.quickActionsGrid}>
        {actions.map((act) => {
          const Icon = act.icon;
          return (
            <Link key={act.id} href={act.href} className={styles.actionCard} prefetch={false}>
              <div className={styles.actionIconWrap}>
                <Icon size={20} />
              </div>
              <h3 className={styles.actionTitle}>
                {act.title}
                <ArrowRight size={15} style={{ opacity: 0.6 }} />
              </h3>
              <p className={styles.actionDesc}>{act.desc}</p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
