"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import Link from "next/link";
import { useState, useTransition } from "react";

export default function FindFiltersClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const q = searchParams.get("q") || "";
  const grade = searchParams.get("grade") || "";
  const subject = searchParams.get("subject") || "";
  const curriculum = searchParams.get("curriculum") || "";
  const allGrades = searchParams.get("allGrades");

  // Local state for debounced search
  const [searchValue, setSearchValue] = useState(q);

  const updateFilters = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    
    // Always append allGrades=true when manually interacting with filters
    params.set("allGrades", "true");

    startTransition(() => {
      router.push(`/find?${params.toString()}`);
    });
  };

  const handleSearchKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      updateFilters("q", searchValue);
    }
  };

  const hasFilters = q || grade || subject || curriculum || allGrades === "true";

  return (
    <aside style={{ width: "100%", maxWidth: "280px", flexShrink: 0 }}>
      <div 
        style={{ 
          display: "flex", 
          flexDirection: "column", 
          gap: "1.5rem", 
          background: "var(--surface-raised, #FFFFFF)", 
          padding: "1.5rem", 
          borderRadius: "var(--radius-lg, 12px)", 
          border: "1px solid var(--border, #E2E8F0)",
          opacity: isPending ? 0.6 : 1,
          transition: "opacity 0.2s"
        }}
      >
        <h2 style={{ fontSize: "1.1rem", fontWeight: 700, margin: 0, color: "var(--text-primary, #0C1B33)" }}>
          Filters
        </h2>
        
        {/* Search Input */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <label style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-secondary, #475569)" }}>Search</label>
          <div style={{ position: "relative" }}>
            <Search size={14} color="var(--text-muted, #64748B)" style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
            <input
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyDown={handleSearchKeyPress}
              onBlur={() => updateFilters("q", searchValue)}
              placeholder="Name, keyword..."
              style={{ width: "100%", padding: "0.6rem 0.75rem 0.6rem 2.25rem", border: "1px solid var(--border, #E2E8F0)", borderRadius: "var(--radius-sm, 8px)", fontSize: "0.875rem" }}
            />
          </div>
        </div>

        {/* Subject Select */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <label style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-secondary, #475569)" }}>Subject</label>
          <select 
            value={subject} 
            onChange={(e) => updateFilters("subject", e.target.value)}
            style={{ width: "100%", padding: "0.6rem", border: "1px solid var(--border, #E2E8F0)", borderRadius: "var(--radius-sm, 8px)", fontSize: "0.875rem", background: "#fff" }}
          >
            <option value="">All Subjects</option>
            <option value="Mathematics">Mathematics</option>
            <option value="Science">Science</option>
            <option value="English Language Arts">English Language Arts</option>
            <option value="Social Studies">Social Studies</option>
          </select>
        </div>

        {/* Grade Select */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <label style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-secondary, #475569)" }}>Grade Level</label>
          <select 
            value={grade} 
            onChange={(e) => updateFilters("grade", e.target.value)}
            style={{ width: "100%", padding: "0.6rem", border: "1px solid var(--border, #E2E8F0)", borderRadius: "var(--radius-sm, 8px)", fontSize: "0.875rem", background: "#fff" }}
          >
            <option value="">All Grades</option>
            <option value="Kindergarten">Kindergarten</option>
            <option value="Grade 1">Grade 1</option>
            <option value="Grade 2">Grade 2</option>
            <option value="Grade 3">Grade 3</option>
            <option value="Grade 4">Grade 4</option>
            <option value="Grade 5">Grade 5</option>
            <option value="Grade 6">Grade 6</option>
            <option value="Grade 7">Grade 7</option>
            <option value="Grade 8">Grade 8</option>
            <option value="Grade 9">Grade 9</option>
            <option value="Grade 10">Grade 10</option>
          </select>
        </div>

        {/* Board / Curriculum Select */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <label style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-secondary, #475569)" }}>Board / Curriculum</label>
          <select 
            value={curriculum} 
            onChange={(e) => updateFilters("curriculum", e.target.value)}
            style={{ width: "100%", padding: "0.6rem", border: "1px solid var(--border, #E2E8F0)", borderRadius: "var(--radius-sm, 8px)", fontSize: "0.875rem", background: "#fff" }}
          >
            <option value="">All Boards</option>
            <option value="cbse">CBSE</option>
            <option value="icse">ICSE</option>
            <option value="ib">IB / International</option>
            <option value="us">US Common Core</option>
          </select>
        </div>

        {/* Clear Filters */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginTop: "0.5rem" }}>
          {hasFilters && (
            <Link 
              href="/find?allGrades=true" 
              onClick={(e) => {
                e.preventDefault();
                startTransition(() => {
                  setSearchValue("");
                  router.push("/find?allGrades=true");
                });
              }}
              style={{ width: "100%", padding: "0.75rem", textAlign: "center", border: "1px solid var(--border, #E2E8F0)", borderRadius: "var(--radius-sm, 8px)", color: "var(--text-muted, #64748B)", textDecoration: "none", fontWeight: 600, fontSize: "0.875rem" }}
            >
              Clear Filters
            </Link>
          )}
        </div>
      </div>
    </aside>
  );
}
