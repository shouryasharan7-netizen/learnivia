"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import styles from "./page.module.css";

interface Props {
  currentQ: string;
  currentSubject: string;
  currentSort: string;
  availableSubjects: string[];
}

export default function SessionsFilter({ currentQ, currentSubject, currentSort, availableSubjects }: Props) {
  const router = useRouter();
  const [search, setSearch] = useState(currentQ);

  const updateFilters = (newQ: string, newSubject: string, newSort: string) => {
    const params = new URLSearchParams();
    if (newQ) params.set("q", newQ);
    if (newSubject && newSubject !== "All") params.set("subject", newSubject);
    if (newSort && newSort !== "soon") params.set("sort", newSort);
    router.push(`/find?${params.toString()}`);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters(search, currentSubject, currentSort);
  };

  // Combine standard subjects with DB subjects, keeping "All" first
  const standardSubjects = ["Mathematics", "Science", "English & Writing", "Homework Help"];
  const allPills = ["All", ...Array.from(new Set([...standardSubjects, ...availableSubjects]))];

  return (
    <div className={styles.filterContainer}>
      <div className={styles.searchRow}>
        <form onSubmit={handleSearchSubmit} className={styles.searchForm}>
          <Search size={20} className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search sessions"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={styles.searchInput}
          />
        </form>
        
        <select 
          value={currentSort}
          onChange={(e) => updateFilters(search, currentSubject, e.target.value)}
          className={styles.sortSelect}
        >
          <option value="soon">Starting Soon</option>
          <option value="newest">Newly Added</option>
        </select>
      </div>

      <div className={styles.pillsRow}>
        <div className={styles.pillsScroll}>
          {allPills.map((subject) => (
            <button
              key={subject}
              onClick={() => updateFilters(search, subject, currentSort)}
              className={`${styles.pillBtn} ${currentSubject === subject ? styles.pillActive : ""}`}
            >
              {subject}
            </button>
          ))}
          <button className={styles.pillAddBtn}>+ Add a Subject</button>
        </div>
      </div>
    </div>
  );
}
