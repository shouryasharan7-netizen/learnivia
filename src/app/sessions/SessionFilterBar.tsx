"use client";

import { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, X, SlidersHorizontal, Users, Video, Layers, RotateCcw } from "lucide-react";
import styles from "./SessionFilterBar.module.css";

const CURRICULUM_OPTIONS = [
  "All",
  "CBSE",
  "ICSE",
  "IGCSE",
  "IB",
  "US Common Core",
];

const SUBJECT_FILTERS = [
  "All",
  "Mathematics",
  "Reading & Writing",
  "English Language Arts",
  "Science",
  "Biology",
  "Chemistry",
  "Social Studies",
  "Learning Support",
  "Homework Help",
];

interface SessionFilterBarProps {
  activeCurriculum: string;
  activeSubject: string;
  initialQuery: string;
  activeTab: "all" | "tutors" | "workshops";
  totalMatches: number;
  tutorMatches: number;
  workshopMatches: number;
}

export default function SessionFilterBar({
  activeCurriculum,
  activeSubject,
  initialQuery,
  activeTab,
  totalMatches,
  tutorMatches,
  workshopMatches,
}: SessionFilterBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [query, setQuery] = useState(initialQuery);

  const updateFilters = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, val]) => {
      if (val === null || val === "" || val === "All" || (key === "tab" && val === "all")) {
        params.delete(key);
      } else {
        params.set(key, val);
      }
    });

    startTransition(() => {
      const queryString = params.toString();
      router.push(`/sessions${queryString ? `?${queryString}` : ""}`);
    });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters({ q: query.trim() || null });
  };

  const handleCurriculumChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    updateFilters({ curriculum: val === "All" ? null : val });
  };

  const handleSubjectClick = (sub: string) => {
    updateFilters({ subject: sub === "All" ? null : sub });
  };

  const handleTabClick = (tab: "all" | "tutors" | "workshops") => {
    updateFilters({ tab });
  };

  const handleClearAll = () => {
    setQuery("");
    startTransition(() => {
      router.push("/sessions?allGrades=true");
    });
  };

  const hasActiveFilters =
    activeCurriculum !== "All" ||
    activeSubject !== "All" ||
    query.trim() !== "" ||
    activeTab !== "all";

  return (
    <div className={styles.filterContainer}>
      {/* Top Filter Controls: Curriculum Select + Search Input + Submit Button */}
      <form onSubmit={handleSearchSubmit} className={styles.topControlRow}>
        {/* Curriculum Selector with modern styling */}
        <div className={styles.curriculumWrap}>
          <label htmlFor="curriculum-select" className={styles.visuallyHidden}>Curriculum</label>
          <select
            id="curriculum-select"
            value={activeCurriculum}
            onChange={handleCurriculumChange}
            className={styles.curriculumSelect}
            aria-label="Select Curriculum"
          >
            <option value="All">All Curricula</option>
            {CURRICULUM_OPTIONS.filter((c) => c !== "All").map((c) => (
              <option key={c} value={c}>{c} Curriculum</option>
            ))}
          </select>
        </div>

        {/* Search Input with Icon and Clear Button */}
        <div className={styles.searchWrap}>
          <Search size={18} className={styles.searchIcon} aria-hidden="true" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search sessions by topic, subject, or tutor..."
            className={styles.searchInput}
            aria-label="Search sessions by topic or tutor name"
          />
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                updateFilters({ q: null });
              }}
              className={styles.clearSearchBtn}
              aria-label="Clear search text"
            >
              <X size={15} />
            </button>
          )}
        </div>

        {/* Filter Sessions Submit Button */}
        <button
          type="submit"
          className={styles.filterSubmitBtn}
          disabled={isPending}
          aria-label="Apply session search filters"
        >
          <SlidersHorizontal size={15} />
          <span>{isPending ? "Filtering..." : "Filter Sessions"}</span>
        </button>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={handleClearAll}
            className={styles.resetFiltersBtn}
            title="Reset all filters"
          >
            <RotateCcw size={14} />
            <span>Reset</span>
          </button>
        )}
      </form>

      {/* Subject Filter Pills */}
      <div className={styles.subjectPillsRow} role="tablist" aria-label="Filter sessions by subject">
        {SUBJECT_FILTERS.map((f) => {
          const isCurrent = activeSubject.toLowerCase() === f.toLowerCase();
          return (
            <button
              key={f}
              type="button"
              role="tab"
              aria-selected={isCurrent}
              onClick={() => handleSubjectClick(f)}
              className={`${styles.subjectPill} ${isCurrent ? styles.subjectPillActive : ""}`}
            >
              {f}
            </button>
          );
        })}
      </div>

      {/* Section View Tabs with Authentic Database Counts */}
      <div className={styles.tabsRow}>
        <div className={styles.tabsList} role="tablist" aria-label="Session type views">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "all"}
            onClick={() => handleTabClick("all")}
            className={`${styles.tabBtn} ${activeTab === "all" ? styles.tabBtnActive : ""}`}
          >
            <Layers size={15} />
            <span>All Offerings</span>
            <span className={styles.tabBadge}>{totalMatches}</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "tutors"}
            onClick={() => handleTabClick("tutors")}
            className={`${styles.tabBtn} ${activeTab === "tutors" ? styles.tabBtnActive : ""}`}
          >
            <Users size={15} />
            <span>1-on-1 Mentors</span>
            <span className={styles.tabBadge}>{tutorMatches}</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "workshops"}
            onClick={() => handleTabClick("workshops")}
            className={`${styles.tabBtn} ${activeTab === "workshops" ? styles.tabBtnActive : ""}`}
          >
            <Video size={15} />
            <span>Group Workshops</span>
            <span className={styles.tabBadge}>{workshopMatches}</span>
          </button>
        </div>

        <div className={styles.matchCountLabel}>
          Showing <strong>{activeTab === "tutors" ? tutorMatches : activeTab === "workshops" ? workshopMatches : totalMatches}</strong> verified opportunities
        </div>
      </div>
    </div>
  );
}
