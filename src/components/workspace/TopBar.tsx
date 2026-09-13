"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  Search,
  Bell,
  Calendar,
  LogOut,
  ChevronDown,
  User,
  ShieldCheck,
  GraduationCap,
} from "lucide-react";
import { ROUTES } from "@/lib/routes";

interface TopBarProps {
  user: {
    id?: string;
    name?: string | null;
    email?: string | null;
    role?: string;
    image?: string | null;
    isTutor?: boolean;
    isAdmin?: boolean;
  };
}

export function TopBar({ user }: TopBarProps) {
  const pathname = usePathname();
  const [profileOpen, setProfileOpen] = useState(false);
  const [shortcutLabel, setShortcutLabel] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only show keyboard shortcut on desktop devices with hover and precision pointers
    if (typeof window !== "undefined") {
      const isTouch = window.matchMedia("(pointer: coarse)").matches;
      const isSmallScreen = window.innerWidth <= 768;
      if (isTouch || isSmallScreen) {
        setShortcutLabel(null);
        return;
      }
      const isMac = /(Mac|iPhone|iPod|iPad)/i.test(navigator.userAgent || navigator.platform || "");
      setShortcutLabel(isMac ? "⌘K" : "Ctrl K");
    }
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Compute breadcrumb title from pathname
  let pageTitle = "Dashboard";
  if (pathname === "/find") pageTitle = "Find a Peer Tutor";
  else if (pathname === "/sessions") pageTitle = "Tutoring Sessions";
  else if (pathname.startsWith("/sessions/")) pageTitle = "Session Room";
  else if (pathname === "/homework-help") pageTitle = "Homework Queue";
  else if (pathname === "/community") pageTitle = "Learning Community";
  else if (pathname === "/resources") pageTitle = "Study Resources";
  else if (pathname === "/tutor") pageTitle = "Tutor Workspace";
  else if (pathname === "/tutor/transcript") pageTitle = "Verified Service Record";
  else if (pathname === "/tutor/training") pageTitle = "Safeguarding Training";
  else if (pathname === "/admin") pageTitle = "System Overview";
  else if (pathname.startsWith("/admin/")) pageTitle = "Admin Center";

  const userInitial = user.name ? user.name.trim()[0].toUpperCase() : "U";

  return (
    <header
      style={{
        height: "56px",
        minHeight: "56px",
        background: "var(--wa-white)",
        borderBottom: "1px solid var(--wa-border)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 1.5rem",
        position: "sticky",
        top: 0,
        zIndex: 30,
      }}
    >
      {/* Left: Breadcrumb / Section context */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <span
          style={{
            fontSize: "0.875rem",
            fontWeight: 600,
            color: "var(--wa-ink)",
          }}
        >
          {pageTitle}
        </span>
      </div>

      {/* Right: Search trigger, Quick links, User Menu */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
        {/* Quick Search trigger - hidden on mobile where bottom nav provides Find */}
        <Link
          href={ROUTES.find}
          className="topbar-search-btn"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            padding: "0.35rem 0.65rem",
            borderRadius: "var(--wa-radius-sm)",
            background: "var(--wa-cream-dark)",
            border: "1px solid var(--wa-border)",
            color: "var(--wa-muted)",
            fontSize: "0.75rem",
            textDecoration: "none",
          }}
        >
          <Search size={13} aria-hidden="true" />
          <span className="topbar-search-text">Find subjects...</span>
          {shortcutLabel && (
            <kbd
              className="topbar-search-kbd"
              style={{
                padding: "0.1rem 0.35rem",
                borderRadius: "4px",
                background: "var(--wa-white)",
                border: "1px solid var(--wa-border)",
                fontSize: "0.65rem",
                fontFamily: "monospace",
              }}
            >
              {shortcutLabel}
            </kbd>
          )}
        </Link>

        {/* Sessions quick link */}
        <Link
          href={ROUTES.sessions}
          style={{
            padding: "0.4rem",
            color: "var(--wa-muted)",
            borderRadius: "var(--wa-radius-sm)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          title="View scheduled sessions"
        >
          <Calendar size={17} aria-hidden="true" />
          <span className="sr-only">Scheduled sessions</span>
        </Link>

        {/* Profile Menu */}
        <div ref={menuRef} style={{ position: "relative" }}>
          <button
            type="button"
            onClick={() => setProfileOpen(!profileOpen)}
            aria-expanded={profileOpen}
            aria-haspopup="true"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              background: "transparent",
              border: "none",
              padding: "0.25rem 0.5rem",
              borderRadius: "var(--wa-radius-sm)",
              cursor: "pointer",
            }}
          >
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: "50%",
                background: "var(--wa-cream-mid)",
                border: "1px solid var(--wa-border)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 700,
                fontSize: "0.8125rem",
                color: "var(--wa-ink)",
              }}
            >
              {userInitial}
            </div>
            <span
              style={{
                fontSize: "0.8125rem",
                fontWeight: 600,
                color: "var(--wa-ink)",
                maxWidth: 120,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {user.name || "Student"}
            </span>
            <ChevronDown size={13} color="var(--wa-muted)" />
          </button>

          {profileOpen && (
            <div
              style={{
                position: "absolute",
                top: "calc(100% + 6px)",
                right: 0,
                width: 220,
                background: "var(--wa-white)",
                border: "1px solid var(--wa-border)",
                borderRadius: "var(--wa-radius-md)",
                boxShadow: "var(--wa-shadow-md)",
                padding: "0.5rem",
                zIndex: 50,
              }}
            >
              <div style={{ padding: "0.5rem 0.65rem", borderBottom: "1px solid var(--wa-border)", marginBottom: "0.35rem" }}>
                <p style={{ fontSize: "0.8125rem", fontWeight: 700, color: "var(--wa-ink)", margin: 0 }}>
                  {user.name || "Student"}
                </p>
                <p style={{ fontSize: "0.75rem", color: "var(--wa-muted)", margin: 0 }}>
                  {user.email || ""}
                </p>
                <span
                  style={{
                    display: "inline-block",
                    fontSize: "0.6875rem",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    color: "var(--wa-green)",
                    marginTop: "0.25rem",
                  }}
                >
                  {user.isAdmin ? "Administrator" : user.isTutor ? "Verified Tutor" : "K–10 Learner"}
                </span>
              </div>

              <Link
                href={ROUTES.learner.home}
                onClick={() => setProfileOpen(false)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "0.45rem 0.65rem",
                  fontSize: "0.8125rem",
                  color: "var(--wa-text)",
                  borderRadius: "6px",
                  textDecoration: "none",
                }}
              >
                <User size={14} />
                <span>My Dashboard</span>
              </Link>

              <Link
                href={ROUTES.safety}
                onClick={() => setProfileOpen(false)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "0.45rem 0.65rem",
                  fontSize: "0.8125rem",
                  color: "var(--wa-text)",
                  borderRadius: "6px",
                  textDecoration: "none",
                }}
              >
                <ShieldCheck size={14} />
                <span>Safety Standards</span>
              </Link>

              <div style={{ borderTop: "1px solid var(--wa-border)", margin: "0.35rem 0" }} />

              <button
                type="button"
                onClick={() => signOut({ callbackUrl: "/" })}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "0.45rem 0.65rem",
                  fontSize: "0.8125rem",
                  color: "#991B1B",
                  background: "transparent",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  textAlign: "left",
                }}
              >
                <LogOut size={14} />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
