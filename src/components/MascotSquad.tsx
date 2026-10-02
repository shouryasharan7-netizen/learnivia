"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  ArrowRight,
  BookOpen,
  Calculator,
  FlaskConical,
  Target,
  Code,
  HelpCircle,
  Heart,
  MessageSquare,
  Award,
} from "lucide-react";
import styles from "./MascotSquad.module.css";

interface Mascot {
  id: string;
  name: string;
  title: string;
  subject: string;
  image: string;
  role: string;
  motto: string;
  tip: string;
  pedagogyTrait: string;
  subjectQuery: string;
  accent: string;
  accentBg: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}

const MASCOTS: Mascot[] = [
  {
    id: "archie",
    name: "Archie the Owl",
    title: "Math Whiz & Problem Solver",
    subject: "Mathematics & Geometry",
    image: "/images/new_mascots/mascot-1.jpeg",
    role: "Algebra, Calculus & Logic",
    motto: "Every complex formula breaks down into simple, intuitive patterns.",
    tip: "When facing a tough problem, work backwards from the target value. Break the equation down into bite-sized steps!",
    pedagogyTrait: "Step-by-Step Logic",
    subjectQuery: "Mathematics",
    accent: "#0284c7",
    accentBg: "#e0f2fe",
    icon: Calculator,
  },
  {
    id: "pip",
    name: "Pip the Curious Fox",
    title: "Lab Explorer & Scientist",
    subject: "Sciences (Bio, Chem, Physics)",
    image: "/images/new_mascots/mascot-2.jpeg",
    role: "Natural & Physical Sciences",
    motto: "Questions are the fuel of science. Never hesitate to ask 'why'!",
    tip: "Connect abstract formulas to real-world phenomena. Think of energy transfer like rollercoasters and photosynthesis like solar cooking!",
    pedagogyTrait: "Inquiry-Based Science",
    subjectQuery: "Science",
    accent: "#059669",
    accentBg: "#ecfdf5",
    icon: FlaskConical,
  },
  {
    id: "barnaby",
    name: "Barnaby the Bear",
    title: "Literary Scholar & Wordsmith",
    subject: "Reading & PEEL Essay Writing",
    image: "/images/new_mascots/mascot-3.jpeg",
    role: "Essays & Critical Analysis",
    motto: "Strong words inspire the world. Structure your ideas with pride.",
    tip: "Always use Point-Evidence-Explanation-Link (PEEL). Clear paragraph rhythm makes your argument impossible to ignore.",
    pedagogyTrait: "PEEL Essay Framework",
    subjectQuery: "English & Writing",
    accent: "#d97706",
    accentBg: "#fef3c7",
    icon: BookOpen,
  },
  {
    id: "sparky",
    name: "Sparky the Star",
    title: "Code Architect & Tech Guru",
    subject: "Computer Science & STEM",
    image: "/images/new_mascots/mascot-4.jpeg",
    role: "Python, Web & Computational Logic",
    motto: "Bugs are just creative puzzles waiting for the right solution.",
    tip: "When code doesn't work, don't guess! Print your variable states or step through with a debugger to find where logic branches diverge.",
    pedagogyTrait: "Algorithmic Thinking",
    subjectQuery: "Mathematics",
    accent: "#2563eb",
    accentBg: "#eff6ff",
    icon: Code,
  },
  {
    id: "stella",
    name: "Stella the Scholar",
    title: "Standardized Exam Strategist",
    subject: "Digital SAT, ACT & AP Prep",
    image: "/images/new_mascots/mascot-7.jpeg",
    role: "Standardized & AP Mastery",
    motto: "Targeted strategy beats endless cramming every single time.",
    tip: "On the digital SAT, eliminate two obviously incorrect answers first. Pacing and composure turn 700s into 800s!",
    pedagogyTrait: "Exam Time Strategy",
    subjectQuery: "Standardized Testing",
    accent: "#7c3aed",
    accentBg: "#f5f3ff",
    icon: Target,
  },
  {
    id: "milo",
    name: "Milo the Monkey",
    title: "Study Companion & Guide",
    subject: "Homework Help & Daily Habits",
    image: "/images/new_mascots/mascot-5.jpeg",
    role: "Live Homework & Concept Reviews",
    motto: "No question is too small to ask. Learning is a shared adventure!",
    tip: "Use 25-minute Pomodoro study bursts. Short, hyper-focused sessions build far deeper long-term recall than 4-hour marathons.",
    pedagogyTrait: "Daily Doubt Solving",
    subjectQuery: "Homework Help",
    accent: "#ea580c",
    accentBg: "#fff7ed",
    icon: HelpCircle,
  },
];

export default function MascotSquad() {
  const [selectedMascot, setSelectedMascot] = useState<Mascot>(MASCOTS[0]);
  const [cheeredIds, setCheeredIds] = useState<Set<string>>(new Set());

  const handleCheer = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setCheeredIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <section className={styles.section} id="mascot-squad" aria-label="Learnivia Mascot Squad">
      {/* Ambient background blur circles */}
      <div className={styles.ambientGlow1} aria-hidden="true" />
      <div className={styles.ambientGlow2} aria-hidden="true" />

      <div className={styles.container}>
        {/* Section Header */}
        <div className={styles.header}>
          <div className={styles.badgeWrap}>
            <span className={styles.categoryBadge}>
              <Sparkles size={14} className={styles.badgeSparkle} />
              Meet Your Learning Companions
            </span>
          </div>
          <h2 className={styles.title}>The Learnivia Mascot Squad</h2>
          <p className={styles.subtitle}>
            From mastering quadratic formulas to polishing AP essays and acing your SATs,
            our friendly mascots accompany you through every step of your learning journey.
          </p>
        </div>

        {/* Interactive Mascot Grid */}
        <div className={styles.grid}>
          {MASCOTS.map((m, idx) => {
            const isSelected = selectedMascot.id === m.id;
            const Icon = m.icon;
            const isCheered = cheeredIds.has(m.id);

            return (
              <motion.div
                key={m.id}
                onClick={() => setSelectedMascot(m)}
                className={`${styles.card} ${isSelected ? styles.cardSelected : ""}`}
                style={{
                  borderColor: isSelected ? m.accent : undefined,
                  boxShadow: isSelected
                    ? `0 12px 30px -4px ${m.accent}33, 0 4px 12px -2px ${m.accent}20`
                    : undefined,
                }}
                whileHover={{ y: -5 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                {/* Mascot Top Header Bar */}
                <div className={styles.cardTop}>
                  <div
                    className={styles.subjectBadge}
                    style={{ background: m.accentBg, color: m.accent }}
                  >
                    <Icon size={13} />
                    <span>{m.subject}</span>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => handleCheer(e, m.id)}
                    className={styles.cheerBtn}
                    title="Cheer on this mascot"
                    aria-label={`Cheer for ${m.name}`}
                    style={{
                      background: isCheered ? m.accentBg : undefined,
                      borderColor: isCheered ? m.accent : undefined,
                    }}
                  >
                    <Heart
                      size={14}
                      className={styles.heartIcon}
                      style={{
                        fill: isCheered ? m.accent : "none",
                        color: isCheered ? m.accent : undefined,
                      }}
                    />
                    <span style={{ color: isCheered ? m.accent : undefined, fontWeight: isCheered ? 700 : 500 }}>
                      {isCheered ? "Cheered! ✨" : "Cheer"}
                    </span>
                  </button>
                </div>

                {/* Animated Avatar */}
                <div className={styles.avatarContainer}>
                  <motion.div
                    className={styles.avatarGlow}
                    style={{ background: m.accent }}
                    animate={{
                      scale: [1, 1.08, 1],
                      opacity: [0.15, 0.25, 0.15],
                    }}
                    transition={{
                      duration: 3 + (idx % 3),
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                  <motion.div
                    className={styles.avatarImgWrap}
                    style={{ borderColor: isSelected ? m.accent : "#e2e8f0" }}
                    animate={{
                      y: [0, -6, 0],
                    }}
                    transition={{
                      duration: 3.5 + (idx * 0.4),
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    <Image
                      src={m.image}
                      alt={m.name}
                      width={100}
                      height={100}
                      className={styles.avatarImg}
                    />
                  </motion.div>
                </div>

                {/* Text Details */}
                <div className={styles.cardInfo}>
                  <h3 className={styles.mascotName}>{m.name}</h3>
                  <span className={styles.mascotRole} style={{ color: m.accent }}>
                    {m.title}
                  </span>
                  <p className={styles.mascotMotto}>"{m.motto}"</p>

                  <div className={styles.statPill}>
                    <Award size={13} style={{ color: m.accent }} />
                    <span>{m.pedagogyTrait}</span>
                  </div>
                </div>

                {/* Select Indicator */}
                <div className={styles.cardFooter}>
                  <span
                    className={styles.viewTipLabel}
                    style={{ color: isSelected ? m.accent : "#64748b" }}
                  >
                    {isSelected ? "✨ Currently Selected" : "Click to view study tip →"}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Featured Spotlight Drawer / Speech Bubble for Selected Mascot */}
        <AnimatePresence mode="wait">
          {selectedMascot && (
            <motion.div
              key={selectedMascot.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className={styles.spotlightBanner}
              style={{
                background: `linear-gradient(135deg, #ffffff 0%, ${selectedMascot.accentBg} 100%)`,
                borderColor: selectedMascot.accent,
              }}
            >
              <div className={styles.spotlightLeft}>
                <div
                  className={styles.spotlightAvatar}
                  style={{ borderColor: selectedMascot.accent }}
                >
                  <Image
                    src={selectedMascot.image}
                    alt={selectedMascot.name}
                    width={72}
                    height={72}
                    className={styles.spotlightAvatarImg}
                  />
                </div>
                <div className={styles.spotlightMeta}>
                  <div
                    className={styles.spotlightBadge}
                    style={{ background: selectedMascot.accent, color: "#ffffff" }}
                  >
                    {selectedMascot.name}&apos;s Secret Study Tip
                  </div>
                  <h4 className={styles.spotlightHeadline}>
                    Mastering {selectedMascot.subject}
                  </h4>
                </div>
              </div>

              <div className={styles.spotlightCenter}>
                <div className={styles.speechBubble}>
                  <MessageSquare
                    size={16}
                    className={styles.speechBubbleIcon}
                    style={{ color: selectedMascot.accent }}
                  />
                  <p className={styles.speechText}>"{selectedMascot.tip}"</p>
                </div>
              </div>

              <div className={styles.spotlightRight}>
                <Link
                  href={`/find?subject=${encodeURIComponent(selectedMascot.subjectQuery)}`}
                  className={styles.findSubjectBtn}
                  style={{
                    background: selectedMascot.accent,
                    boxShadow: `0 4px 14px ${selectedMascot.accent}40`,
                  }}
                >
                  <span>Find {selectedMascot.subjectQuery} Sessions</span>
                  <ArrowRight size={15} />
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bottom Call to Action Strip */}
        <div className={styles.bottomCta}>
          <div className={styles.ctaText}>
            <span className={styles.ctaHeading}>Ready to study with peer mentors &amp; our mascot squad?</span>
            <span className={styles.ctaSub}>Small groups, zero cost, and 100% verified K-12 &amp; test prep learning.</span>
          </div>
          <div className={styles.ctaButtons}>
            <Link href="/find" className={styles.ctaPrimary}>
              Browse Live Workshops <ArrowRight size={15} />
            </Link>
            <Link href="/apply" className={styles.ctaSecondary}>
              Become a Volunteer Tutor →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
