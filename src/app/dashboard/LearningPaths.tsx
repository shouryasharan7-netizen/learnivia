"use client";

import React from "react";
import Link from "next/link";
import {
  Calculator,
  Atom,
  BookOpen,
  MessageSquare,
  ArrowRight,
  Compass,
} from "lucide-react";
import styles from "./dashboard.module.css";
import { ROUTES } from "@/lib/routes";

export function LearningPaths() {
  const paths = [
    {
      id: "math",
      title: "Math & Problem Solving",
      desc: "Arithmetic, algebra, geometry, trigonometry, and calculus prep.",
      href: `${ROUTES.find}?subject=Mathematics`,
      icon: Calculator,
      badge: "K-10 Math",
    },
    {
      id: "science",
      title: "Science & Nature",
      desc: "Biology, chemistry, physics, and scientific thinking.",
      href: `${ROUTES.find}?subject=Science`,
      icon: Atom,
      badge: "Sciences",
    },
    {
      id: "humanities",
      title: "Reading & Writing",
      desc: "Reading comprehension, essay structure, and clear writing.",
      href: `${ROUTES.find}?subject=Reading+%26+Writing`,
      icon: BookOpen,
      badge: "Language",
    },
    {
      id: "dialogues",
      title: "Student Discussions",
      desc: "Ask questions, share study routines, and connect with peers.",
      href: ROUTES.community,
      icon: MessageSquare,
      badge: "Community",
    },
  ];

  return (
    <section aria-labelledby="learning-paths-heading">
      <div className={styles.sectionHeader}>
        <h2 id="learning-paths-heading" className={styles.sectionTitle}>
          <Compass size={16} color="var(--wa-crimson, #2563EB)" />
          <span>Explore Subjects</span>
        </h2>
        <Link href={ROUTES.find} className={styles.sectionLink}>
          Browse all tutors <ArrowRight size={12} />
        </Link>
      </div>

      <div className={styles.pathsGrid}>
        {paths.map((p) => {
          const Icon = p.icon;
          return (
            <Link
              key={p.id}
              href={p.href}
              className={styles.pathCard}
              prefetch={false}
            >
              <div className={styles.pathIcon}>
                <Icon size={18} />
              </div>
              <div className={styles.pathBody}>
                <h3 className={styles.pathTitle}>{p.title}</h3>
                <p className={styles.pathDesc}>{p.desc}</p>
              </div>
              <span className={styles.pathFooter}>
                <ArrowRight size={14} />
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
