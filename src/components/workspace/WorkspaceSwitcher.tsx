"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  GraduationCap,
  BookOpen,
  ShieldCheck,
  ChevronDown,
  Check,
} from "lucide-react";
import { ROUTES } from "@/lib/routes";

interface WorkspaceSwitcherProps {
  isTutor: boolean;
  isAdmin: boolean;
  isTrainingCompleted?: boolean;
}

export function WorkspaceSwitcher({ isTutor, isAdmin, isTrainingCompleted = false }: WorkspaceSwitcherProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Multi-role check: only render switcher if user has more than just the default student role
  if (!isTutor && !isAdmin) {
    return null;
  }

  const isCurrentAdmin = pathname.startsWith("/admin");
  const isCurrentTutor = pathname.startsWith("/tutor");
  const isCurrentLearner = !isCurrentAdmin && !isCurrentTutor;

  let currentTitle = "Learner Workspace";
  let CurrentIcon = GraduationCap;

  if (isCurrentAdmin) {
    currentTitle = "Admin Center";
    CurrentIcon = ShieldCheck;
  } else if (isCurrentTutor) {
    currentTitle = "Tutor Workspace";
    CurrentIcon = BookOpen;
  }

  return (
    <div ref={dropdownRef} style={{ position: "relative", width: "100%", marginBottom: "1rem" }}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0.55rem 0.75rem",
          background: "var(--wa-cream-dark)",
          border: "1px solid var(--wa-border)",
          borderRadius: "var(--wa-radius-sm)",
          color: "var(--wa-ink)",
          fontSize: "0.8125rem",
          fontWeight: 600,
          cursor: "pointer",
          transition: "background var(--wa-transition)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <CurrentIcon size={16} color="var(--wa-green)" />
          <span>{currentTitle}</span>
        </div>
        <ChevronDown
          size={14}
          color="var(--wa-muted)"
          style={{
            transform: isOpen ? "rotate(180deg)" : "none",
            transition: "transform var(--wa-transition)",
          }}
        />
      </button>

      {isOpen && (
        <div
          role="listbox"
          style={{
            position: "absolute",
            top: "calc(100% + 4px)",
            left: 0,
            right: 0,
            zIndex: 100,
            background: "var(--wa-white)",
            border: "1px solid var(--wa-border)",
            borderRadius: "var(--wa-radius-sm)",
            boxShadow: "var(--wa-shadow-md)",
            padding: "0.35rem",
            display: "flex",
            flexDirection: "column",
            gap: "0.2rem",
          }}
        >
          {/* Learner Option */}
          <Link
            href={ROUTES.learner.home}
            onClick={() => setIsOpen(false)}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0.5rem 0.65rem",
              borderRadius: "6px",
              background: isCurrentLearner ? "var(--wa-cream-dark)" : "transparent",
              color: "var(--wa-ink)",
              fontSize: "0.8125rem",
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <GraduationCap size={15} color={isCurrentLearner ? "var(--wa-green)" : "var(--wa-muted)"} />
              <span>Learner Workspace</span>
            </div>
            {isCurrentLearner && <Check size={14} color="var(--wa-green)" />}
          </Link>

          {/* Tutor Option */}
          {isTutor && (
            <Link
              href={isTrainingCompleted ? ROUTES.tutor.home : ROUTES.tutor.training}
              onClick={() => setIsOpen(false)}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0.5rem 0.65rem",
                borderRadius: "6px",
                background: isCurrentTutor ? "var(--wa-cream-dark)" : "transparent",
                color: "var(--wa-ink)",
                fontSize: "0.8125rem",
                fontWeight: 600,
                textDecoration: "none",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <BookOpen size={15} color={isCurrentTutor ? "var(--wa-green)" : "var(--wa-muted)"} />
                <span>Tutor Workspace</span>
                {!isTrainingCompleted && (
                  <span
                    style={{
                      fontSize: "0.65rem",
                      padding: "0.1rem 0.4rem",
                      borderRadius: "4px",
                      background: "#FEF3C7",
                      color: "#92400E",
                      fontWeight: 700,
                    }}
                  >
                    Training
                  </span>
                )}
              </div>
              {isCurrentTutor && <Check size={14} color="var(--wa-green)" />}
            </Link>
          )}

          {/* Admin Option */}
          {isAdmin && (
            <Link
              href={ROUTES.admin.home}
              onClick={() => setIsOpen(false)}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0.5rem 0.65rem",
                borderRadius: "6px",
                background: isCurrentAdmin ? "var(--wa-cream-dark)" : "transparent",
                color: "var(--wa-ink)",
                fontSize: "0.8125rem",
                fontWeight: 600,
                textDecoration: "none",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <ShieldCheck size={15} color={isCurrentAdmin ? "var(--wa-green)" : "var(--wa-muted)"} />
                <span>Admin Center</span>
              </div>
              {isCurrentAdmin && <Check size={14} color="var(--wa-green)" />}
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
