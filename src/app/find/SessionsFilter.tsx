"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, GraduationCap } from "lucide-react";
import styles from "./page.module.css";

interface Props {
  currentQ: string;
  currentSubject: string;
  currentGrade?: string;
  currentSort: string;
  availableSubjects: string[];
}

export default function SessionsFilter({
  currentQ,
  currentSubject,
  currentGrade = "All",
  currentSort,
  availableSubjects,
}: Props) {
  const router = useRouter();
  const [search, setSearch] = useState(currentQ);

  const updateFilters = (
    newQ: string,
    newSubject: string,
    newGrade: string,
    newSort: string
  ) => {
    const params = new URLSearchParams();
    if (newQ) params.set("q", newQ);
    if (newSubject && newSubject !== "All") params.set("subject", newSubject);
    if (newGrade && newGrade !== "All") params.set("grade", newGrade);
    if (newSort && newSort !== "soon") params.set("sort", newSort);
    router.push(`/find?${params.toString()}`);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters(search, currentSubject, currentGrade, currentSort);
  };

  // Combine standard subjects with DB subjects, keeping "All" first
  const standardSubjects = [
    "Mathematics",
    "Science",
    "English & Writing",
    "Standardized Testing",
    "Homework Help",
  ];
  const allSubjects = [
    "All",
    ...Array.from(new Set([...standardSubjects, ...availableSubjects])),
  ];

  const gradeBands = [
    { value: "All", label: "All Grades" },
    { value: "Elementary", label: "Elementary (K-5)" },
    { value: "Middle School", label: "Middle School (6-8)" },
    { value: "High School", label: "High School (9-12)" },
    { value: "College Prep", label: "College & AP Prep" },
  ];

  return (
    <div className={styles.filterContainer}>
      <div className={styles.searchRow}>
        <form onSubmit={handleSearchSubmit} className={styles.searchForm}>
          <Search size={20} className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search sessions by topic, tutor name, or curriculum..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={styles.searchInput}
          />
        </form>

        <select
          value={currentSort}
          onChange={(e) =>
            updateFilters(search, currentSubject, currentGrade, e.target.value)
          }
          className={styles.sortSelect}
        >
          <option value="soon">Starting Soonest</option>
          <option value="newest">Newly Scheduled</option>
        </select>
      </div>

      {/* Grade Level Filter Row */}
      <div className={styles.gradeFilterRow}>
        <span className={styles.filterSectionLabel}>
          <GraduationCap size={14} />
          Grade Band:
        </span>
        <div className={styles.gradeChips}>
          {gradeBands.map((gb) => (
            <button
              key={gb.value}
              type="button"
              onClick={() =>
                updateFilters(search, currentSubject, gb.value, currentSort)
              }
              className={`${styles.gradeChip} ${
                currentGrade === gb.value ? styles.gradeChipActive : ""
              }`}
            >
              {gb.label}
            </button>
          ))}
        </div>
      </div>

      {/* Subject Filter Row */}
      <div className={styles.pillsRow}>
        <div className={styles.pillsScroll}>
          {allSubjects.map((subj) => (
            <button
              key={subj}
              type="button"
              onClick={() =>
                updateFilters(search, subj, currentGrade, currentSort)
              }
              className={`${styles.pillBtn} ${
                currentSubject === subj ? styles.pillActive : ""
              }`}
            >
              {subj}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

