"use client";

import { useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle, BookOpen, Clock, ShieldCheck, ArrowRight } from "lucide-react";
import styles from "./ProgramDetailsModal.module.css";

export interface ProgramDetail {
  id: string;
  title: string;
  badge: string;
  gradeCode: string;
  description: string;
  curriculum: {
    subject: string;
    topics: string[];
  }[];
  format: {
    duration: string;
    pacing: string;
    supervision: string;
    tools: string;
  };
  outcomes: string[];
  filterUrl: string;
}

export const PROGRAM_DETAILS: Record<string, ProgramDetail> = {
  "k-2": {
    id: "k-2",
    title: "Early Elementary (K–Grade 2)",
    badge: "Ages 5–8",
    gradeCode: "LEVEL 01 // FOUNDATIONAL ROOTS",
    description:
      "A gentle, joyful introduction to 1-on-1 peer mentoring designed for young emergent readers and beginning thinkers.",
    curriculum: [
      {
        subject: "Phonics & Early Reading",
        topics: [
          "Letter-sound recognition & blending",
          "Sight words & vocabulary decoding",
          "Story reading aloud & comprehension questions",
        ],
      },
      {
        subject: "Early Math Foundations",
        topics: [
          "Number recognition & counting fluency",
          "Visual addition and subtraction",
          "Basic shapes, patterns, and measurements",
        ],
      },
    ],
    format: {
      duration: "30 Minutes (Optimal for young focus)",
      pacing: "Patient, play-oriented & highly encouraging",
      supervision: "Parent or guardian check-in required",
      tools: "Interactive Zoom visual whiteboard & digital flashcards",
    },
    outcomes: [
      "Fosters early love for reading and eliminates math apprehension",
      "Builds active speaking and listening confidence with older peers",
      "Ensures mastery of foundational kindergarten and early grade concepts",
    ],
    filterUrl: "/find?grade=K-2",
  },
  "3-5": {
    id: "3-5",
    title: "Elementary (Grades 3–5)",
    badge: "Ages 8–11",
    gradeCode: "LEVEL 02 // GROWING MINDS",
    description:
      "Structured homework support and foundational concept building to transition students into independent thinkers.",
    curriculum: [
      {
        subject: "Mathematics & Word Problems",
        topics: [
          "Multi-digit multiplication and division",
          "Fraction concepts, decimals, and basic percentages",
          "Multi-step word problem reasoning",
        ],
      },
      {
        subject: "Reading, Writing & Science",
        topics: [
          "Main idea identification & inference skills",
          "Paragraph structure and descriptive sentence craft",
          "Hands-on earth, life, and physical science basics",
        ],
      },
    ],
    format: {
      duration: "45 Minutes",
      pacing: "Interactive step-by-step problem walkthroughs",
      supervision: "Parent account oversight & instant attendance receipts",
      tools: "Screen sharing, math equation pads, and guided worksheets",
    },
    outcomes: [
      "Strengthens fluency with tricky fractions and arithmetic operations",
      "Develops coherent written paragraphs with proper grammar and syntax",
      "Instills structured study habits and homework discipline",
    ],
    filterUrl: "/find?grade=3-5",
  },
  "6-8": {
    id: "6-8",
    title: "Middle School (Grades 6–8)",
    badge: "Ages 11–14",
    gradeCode: "LEVEL 03 // ANALYTICAL MASTERY",
    description:
      "Bridge the critical gap between elementary learning and high school rigor with dedicated academic mentoring.",
    curriculum: [
      {
        subject: "Pre-Algebra & Algebra Foundations",
        topics: [
          "Linear equations and variable solving",
          "Coordinate graphing, rates, and proportional relationships",
          "Introductory geometry, angles, and surface area",
        ],
      },
      {
        subject: "PEEL Writing & Integrated Sciences",
        topics: [
          "Point-Evidence-Explanation-Link structured essays",
          "Cellular biology, genetics, and ecology foundations",
          "History source critique and document-based questions",
        ],
      },
    ],
    format: {
      duration: "45–60 Minutes",
      pacing: "Analytical discussion, targeted error diagnosis & review",
      supervision: "Platform-only messaging and transparent session logs",
      tools: "Shared collaborative docs, Desmos graphing & science diagrams",
    },
    outcomes: [
      "Mastery of Pre-Algebra required for high school math readiness",
      "Ability to formulate clear thesis statements and cite textual evidence",
      "Overcomes mid-school academic frustration with relatable peer mentors",
    ],
    filterUrl: "/find?grade=6-8",
  },
  "9-10": {
    id: "9-10",
    title: "Early High School (Grades 9–10)",
    badge: "Ages 14–16",
    gradeCode: "LEVEL 04 // SECONDARY EXCELLENCE",
    description:
      "Rigorous subject-matter coaching in high school courses to protect GPA and build strong academic transcripts.",
    curriculum: [
      {
        subject: "Algebra I, II & Geometry Proofs",
        topics: [
          "Quadratic equations, polynomials, and factoring techniques",
          "Two-column geometric proofs and congruence theorems",
          "Trigonometric functions and exponential modeling",
        ],
      },
      {
        subject: "Laboratory Sciences & Rhetoric",
        topics: [
          "Chemical reactions, atomic structure, and stoichiometry",
          "Cellular biology, genetics, and photosynthesis cycles",
          "Advanced literary analysis and persuasive argumentation",
        ],
      },
    ],
    format: {
      duration: "60 Minutes",
      pacing: "Deep dive problem-solving and test-taking strategy",
      supervision: "Dual-confirmed attendance logging for verified school records",
      tools: "Advanced graphing, scientific calculators & code notebooks",
    },
    outcomes: [
      "Confident comprehension of honors and college-preparatory coursework",
      "Targeted exam preparation for midterms, finals, and standardized tests",
      "Direct advice from near-peer mentors on course selection and high school success",
    ],
    filterUrl: "/find?grade=9-10",
  },
};

interface ProgramDetailsModalProps {
  programId: string | null;
  onClose: () => void;
}

export function ProgramDetailsModal({
  programId,
  onClose,
}: ProgramDetailsModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (programId) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [programId, onClose]);

  if (!programId || !PROGRAM_DETAILS[programId]) return null;

  const prog = PROGRAM_DETAILS[programId];

  return (
    <AnimatePresence>
      <div className={styles.overlay} onClick={onClose} role="dialog" aria-modal="true">
        <motion.div
          className={styles.modal}
          onClick={(e) => e.stopPropagation()}
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Header */}
          <div className={styles.header}>
            <div>
              <div className={styles.headerMeta}>
                <span className={styles.badge}>{prog.badge}</span>
                <span className={styles.blueprintTag}>[{prog.gradeCode}]</span>
              </div>
              <h2 className={styles.title}>{prog.title}</h2>
              <p className={styles.subtitle}>{prog.description}</p>
            </div>
            <button
              type="button"
              className={styles.closeBtn}
              onClick={onClose}
              aria-label="Close program details"
            >
              <X size={18} />
            </button>
          </div>

          {/* Body */}
          <div className={styles.body}>
            {/* What's Included / Curriculum */}
            <div>
              <h3 className={styles.sectionHeading}>
                <BookOpen size={15} />
                Curriculum Coverage &amp; What Is Included
              </h3>
              <div className={styles.curriculumGrid}>
                {prog.curriculum.map((c) => (
                  <div key={c.subject} className={styles.curriculumCard}>
                    <h4 className={styles.curriculumSubject}>{c.subject}</h4>
                    <ul className={styles.topicList}>
                      {c.topics.map((t) => (
                        <li key={t}>{t}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Session Format & Pacing */}
            <div>
              <h3 className={styles.sectionHeading}>
                <Clock size={15} />
                Session Structure &amp; Safeguards
              </h3>
              <div className={styles.formatGrid}>
                <div className={styles.formatItem}>
                  <div className={styles.formatLabel}>Session Length</div>
                  <div className={styles.formatValue}>{prog.format.duration}</div>
                </div>
                <div className={styles.formatItem}>
                  <div className={styles.formatLabel}>Learning Pacing</div>
                  <div className={styles.formatValue}>{prog.format.pacing}</div>
                </div>
                <div className={styles.formatItem}>
                  <div className={styles.formatLabel}>Parent Oversight</div>
                  <div className={styles.formatValue}>{prog.format.supervision}</div>
                </div>
                <div className={styles.formatItem}>
                  <div className={styles.formatLabel}>Instructional Tools</div>
                  <div className={styles.formatValue}>{prog.format.tools}</div>
                </div>
              </div>
            </div>

            {/* Key Learning Outcomes */}
            <div>
              <h3 className={styles.sectionHeading}>
                <ShieldCheck size={15} />
                Target Learning Outcomes
              </h3>
              <ul className={styles.outcomesList}>
                {prog.outcomes.map((out) => (
                  <li key={out} className={styles.outcomeItem}>
                    <CheckCircle size={16} className={styles.outcomeCheck} />
                    <span>{out}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Footer Actions */}
          <div className={styles.footer}>
            <span className={styles.footerHint}>
              100% Free · Verified Volunteer High School &amp; University Tutors
            </span>
            <div className={styles.footerActions}>
              <Link
                href={prog.filterUrl}
                className={styles.browseBtn}
                onClick={onClose}
              >
                <span>Browse {prog.title.split("(")[0]} Tutors</span>
                <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
