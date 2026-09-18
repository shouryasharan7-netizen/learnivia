"use client";

import React from "react";
import Link from "next/link";
import { Calculator, Atom, BookOpen, MessageSquare, ArrowRight, Compass } from "lucide-react";
import styles from "./dashboard.module.css";
import { ROUTES } from "@/lib/routes";

export function LearningPaths() {
  const paths = [
    {
      id: "math",
      title: "Mathematics & Logic",
      desc: "Arithmetic, algebra, geometry, trigonometry, and calculus prep.",
      href: `${ROUTES.find}?subject=Mathematics`,
      icon: Calculator,
      badge: "K–10 Math",
    },
    {
      id: "science",
      title: "Natural Sciences",
      desc: "Biology, chemistry, physics, and scientific method.",
      href: `${ROUTES.find}?subject=Science`,
      icon: Atom,
      badge: "Sciences",
    },
    {
      id: "humanities",
      title: "Reading & Humanities",
      desc: "Reading comprehension, essay structure, and literary analysis.",
      href: `${ROUTES.find}?subject=Reading+%26+Writing`,
      icon: BookOpen,
      badge: "Language",
    },
    {
      id: "dialogues",
      title: "Peer Dialogues",
      desc: "Moderated discussions, current topics, and roundtable ideas.",
      href: ROUTES.community,
      icon: MessageSquare,
      badge: "Community",
    },
  ];

  return (
    <section aria-labelledby="learning-paths-heading">
      <div className={styles.sectionHeader}>
        <h2 id="learning-paths-heading" className={styles.sectionTitle}>
          <Compass size={16} color="var(--wa-crimson, #8B263E)" />
          <span>Study Horizons</span>
        </h2>
        <Link href={ROUTES.find} className={styles.sectionLink}>
          Browse all <ArrowRight size={12} />
        </Link>
      </div>

      <div className={styles.pathsGrid}>
        {paths.map((p) => {
          const Icon = p.icon;
          return (
            <Link key={p.id} href={p.href} className={styles.pathCard} prefetch={false}>
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
