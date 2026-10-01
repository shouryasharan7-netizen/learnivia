/**
 * Learnivia Canonical Subject & Grade Taxonomy
 *
 * Single source of truth for all subjects and grade levels across:
 * - Admin subject configuration (/admin/subjects)
 * - Student dashboard (PROGRAMS row)
 * - Tutor scheduling form (subject dropdowns)
 * - Seed scripts
 *
 * Scope: K-12 Core Academics + Standardized Testing + Advanced Academics (AP)
 */

export const SUBJECT_TAXONOMY = {
  "Core Academics (K-12)": [
    "Mathematics",
    "Pre-Algebra",
    "Algebra I",
    "Algebra II",
    "Geometry",
    "Calculus",
    "Early Math",
    "Number Sense",
    "Science",
    "Biology",
    "Chemistry",
    "Physics",
    "Earth Science",
    "Physical Science",
    "Computer Science",
    "English Language Arts",
    "Reading & Writing",
    "Phonics & Reading",
    "Social Studies",
    "History",
    "Geography",
    "Learning Support",
  ],
  "Standardized Testing": [
    "SAT",
    "ACT",
    "TOEFL",
    "IELTS",
    "GRE Prep",
  ],
  "Advanced Academics (AP)": [
    "AP Calculus AB",
    "AP Calculus BC",
    "AP Physics 1",
    "AP Physics C",
    "AP Chemistry",
    "AP Biology",
    "AP Computer Science A",
    "AP Computer Science Principles",
    "AP English Language",
    "AP English Literature",
    "AP US History",
    "AP World History",
    "AP European History",
    "AP Economics (Micro)",
    "AP Economics (Macro)",
    "AP Psychology",
    "AP Statistics",
    "AP Environmental Science",
  ],
} as const;

export type SubjectCategory = keyof typeof SUBJECT_TAXONOMY;

/** Flat array of every canonical subject name (all categories). */
export const ALL_SUBJECTS: string[] = Object.values(SUBJECT_TAXONOMY).flatMap(
  (arr) => Array.from(arr)
);

/** Mapping from subject name to category string. */
export const SUBJECT_CATEGORY_MAP: Record<string, string> = Object.entries(
  SUBJECT_TAXONOMY,
).reduce<Record<string, string>>((acc, [category, subjects]) => {
  for (const s of subjects) acc[s] = category;
  return acc;
}, {});

export const CANONICAL_GRADES = [
  { name: "Kindergarten", category: "Early Elementary" },
  { name: "Grade 1", category: "Early Elementary" },
  { name: "Grade 2", category: "Early Elementary" },
  { name: "Grade 3", category: "Elementary" },
  { name: "Grade 4", category: "Elementary" },
  { name: "Grade 5", category: "Elementary" },
  { name: "Grade 6", category: "Middle School" },
  { name: "Grade 7", category: "Middle School" },
  { name: "Grade 8", category: "Middle School" },
  { name: "Grade 9", category: "Early High School" },
  { name: "Grade 10", category: "Early High School" },
  { name: "Grade 11", category: "Upper High School" },
  { name: "Grade 12", category: "Upper High School" },
] as const;

/** Corrupted subject names to purge from DB on seed. */
export const CORRUPTED_SUBJECTS = ["and science", "and Science", "And Science"];
