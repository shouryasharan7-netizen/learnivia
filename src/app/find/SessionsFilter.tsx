"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  GraduationCap,
  X,
  Sparkles,
  Calculator,
  FlaskConical,
  BookOpen,
  Target,
  HelpCircle,
  Layers,
  ArrowUpDown,
} from "lucide-react";
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
    if (newQ && newQ.trim()) params.set("q", newQ.trim());
    if (newSubject && newSubject !== "All") params.set("subject", newSubject);
    if (newGrade && newGrade !== "All") params.set("grade", newGrade);
    if (newSort && newSort !== "soon") params.set("sort", newSort);
    router.push(`/find?${params.toString()}`);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters(search, currentSubject, currentGrade, currentSort);
  };

  const handleQuickTopic = (topic: string) => {
    setSearch(topic);
    updateFilters(topic, currentSubject, currentGrade, currentSort);
  };

  const handleClearSearch = () => {
    setSearch("");
    updateFilters("", currentSubject, currentGrade, currentSort);
  };

  const handleClearAll = () => {
    setSearch("");
    router.push("/find");
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
    { value: "All", label: "All Grades", icon: "🌐" },
    { value: "Elementary", label: "Elementary (K-5)", icon: "🎒" },
    { value: "Middle School", label: "Middle School (6-8)", icon: "📐" },
    { value: "High School", label: "High School (9-12)", icon: "🎓" },
    { value: "College Prep", label: "College & AP Prep", icon: "🚀" },
  ];

  const trendingTopics = [
    { label: "Algebra I & II", icon: "📐" },
    { label: "SAT Math & Reading", icon: "🎯" },
    { label: "AP Biology & Chem", icon: "🔬" },
    { label: "Essay Writing", icon: "✍️" },
    { label: "Geometry", icon: "📏" },
    { label: "Physics", icon: "⚡" },
  ];

  const hasActiveFilters = Boolean(
    (currentQ && currentQ.trim()) ||
    (currentSubject && currentSubject !== "All") ||
    (currentGrade && currentGrade !== "All") ||
    (currentSort && currentSort !== "soon")
  );

  const getSubjectIcon = (subj: string) => {
    const s = subj.toLowerCase();
    if (s === "all") return <Layers size={14} />;
    if (s.includes("math") || s.includes("algebra") || s.includes("geometry"))
      return <Calculator size={14} />;
    if (s.includes("sci") || s.includes("bio") || s.includes("chem") || s.includes("phys"))
      return <FlaskConical size={14} />;
    if (s.includes("eng") || s.includes("writ") || s.includes("read") || s.includes("lit"))
      return <BookOpen size={14} />;
    if (s.includes("standard") || s.includes("sat") || s.includes("act") || s.includes("ap"))
      return <Target size={14} />;
    if (s.includes("homework") || s.includes("help"))
      return <HelpCircle size={14} />;
    return <Sparkles size={14} />;
  };

  return (
    <div className={styles.filterContainer}>
      <div className={styles.searchRow}>
        <form onSubmit={handleSearchSubmit} className={styles.searchForm}>
          <Search size={20} className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search workshops by topic, tutor name, AP, SAT, or curriculum..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={styles.searchInput}
          />
          {search && (
            <button
              type="button"
              onClick={handleClearSearch}
              className={styles.clearSearchBtn}
              aria-label="Clear search"
            >
              <X size={16} />
            </button>
          )}
          <button type="submit" className={styles.searchSubmitBtn}>
            Search
          </button>
        </form>

        <div className={styles.sortWrapper}>
          <ArrowUpDown size={15} className={styles.sortIcon} />
          <select
            value={currentSort}
            onChange={(e) =>
              updateFilters(search, currentSubject, currentGrade, e.target.value)
            }
            className={styles.sortSelect}
            aria-label="Sort workshops"
          >
            <option value="soon">Starting Soonest</option>
            <option value="newest">Newly Scheduled</option>
          </select>
        </div>
      </div>

      {/* Quick Topic Shortcuts */}
      <div className={styles.trendingRow}>
        <span className={styles.trendingLabel}>
          <Sparkles size={13} className={styles.trendingSparkle} />
          Trending Topics:
        </span>
        <div className={styles.trendingChips}>
          {trendingTopics.map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={() => handleQuickTopic(item.label)}
              className={`${styles.trendingChip} ${
                search === item.label ? styles.trendingChipActive : ""
              }`}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </div>
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
              <span className={styles.chipEmoji}>{gb.icon}</span>
              <span>{gb.label}</span>
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
              <span className={styles.pillIcon}>{getSubjectIcon(subj)}</span>
              <span>{subj}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Active Filters Bar if any active */}
      {hasActiveFilters && (
        <div className={styles.activeFiltersBar}>
          <span className={styles.activeFiltersLabel}>Active Filters:</span>
          <div className={styles.activeTagsWrap}>
            {currentQ && (
              <span className={styles.activeFilterTag}>
                Search: "{currentQ}"
                <button
                  type="button"
                  onClick={() => updateFilters("", currentSubject, currentGrade, currentSort)}
                  aria-label="Remove search filter"
                >
                  <X size={12} />
                </button>
              </span>
            )}
            {currentGrade && currentGrade !== "All" && (
              <span className={styles.activeFilterTag}>
                Grade: {currentGrade}
                <button
                  type="button"
                  onClick={() => updateFilters(search, currentSubject, "All", currentSort)}
                  aria-label="Remove grade filter"
                >
                  <X size={12} />
                </button>
              </span>
            )}
            {currentSubject && currentSubject !== "All" && (
              <span className={styles.activeFilterTag}>
                Subject: {currentSubject}
                <button
                  type="button"
                  onClick={() => updateFilters(search, "All", currentGrade, currentSort)}
                  aria-label="Remove subject filter"
                >
                  <X size={12} />
                </button>
              </span>
            )}
            {currentSort && currentSort !== "soon" && (
              <span className={styles.activeFilterTag}>
                Sort: Newly Scheduled
                <button
                  type="button"
                  onClick={() => updateFilters(search, currentSubject, currentGrade, "soon")}
                  aria-label="Reset sort"
                >
                  <X size={12} />
                </button>
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={handleClearAll}
            className={styles.resetAllBtn}
          >
            Clear All
          </button>
        </div>
      )}
    </div>
  );
}

