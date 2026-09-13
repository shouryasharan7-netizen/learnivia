"use client";

import React from "react";
import Link from "next/link";
import { Calculator, Atom, BookOpen, MessageSquare, ArrowRight } from "lucide-react";
import styles from "./dashboard.module.css";
import { ROUTES } from "@/lib/routes";

export function LearningPaths() {
  const paths = [
    {
      id: "math",
      title: "Mathematics & Problem Solving",
      desc: "Foundational arithmetic, algebra, geometry, calculus, and competition prep.",
      href: `${ROUTES.find}?subject=Mathematics`,
      icon: Calculator,
      badge: "K–10 Math",
    },
    {
      id: "science",
      title: "Sciences & Inquiry",
      desc: "General science, biology, chemistry, physics, and scientific lab fundamentals.",
      href: `${ROUTES.find}?subject=Science`,
      icon: Atom,
      badge: "Natural Sciences",
    },
    {
      id: "humanities",
      title: "Reading, Writing & Humanities",
      desc: "Reading comprehension, essay structure, literary analysis, and history.",
      href: `${ROUTES.find}?subject=Reading+%26+Writing`,
      icon: BookOpen,
      badge: "Language & Arts",
    },
    {
      id: "dialogues",
      title: "Dialogues & Discussions",
      desc: "Discuss interesting topics, current events, and ideas with peers in moderated community roundtables.",
      href: ROUTES.community,
      icon: MessageSquare,
      badge: "Peer Dialogues",
    },
  ];

  return (
    <section aria-labelledby="learning-paths-heading">
      <div className={styles.sectionHeader}>
        <h2 id="learning-paths-heading" className={styles.sectionTitle}>
          Learning Paths
        </h2>
        <Link href={ROUTES.find} className={styles.sectionLink}>
          Explore all subjects <ArrowRight size={13} />
        </Link>
      </div>
      <div className={styles.pathsGrid}>
        {paths.map((p) => {
          const Icon = p.icon;
          return (
            <Link key={p.id} href={p.href} className={styles.pathCard} prefetch={false}>
              <div className={styles.pathIcon}>
                <Icon size={20} />
              </div>
              <h3 className={styles.pathTitle}>{p.title}</h3>
              <p className={styles.pathDesc}>{p.desc}</p>
              <div className={styles.pathFooter}>
                <span>{p.badge}</span>
                <span style={{ display: "inline-flex", alignItems: "center", gap: "0.25rem" }}>
                  Find tutors <ArrowRight size={12} />
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
