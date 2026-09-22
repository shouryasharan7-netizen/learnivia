"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import {
  Bell,
  Calendar,
  MessageCircle,
  LogOut,
  ChevronDown,
  User,
  ShieldCheck,
  Sun,
  Moon,
  X,
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

const ANNOUNCEMENT = {
  show: true,
  text: "New tutors are available for CBSE & ICSE K-10 sessions this week.",
  linkText: "Browse now",
  linkHref: "/find",
};

export function TopBar({ user }: TopBarProps) {
  const [profileOpen, setProfileOpen] = useState(false);
  const [announcementDismissed, setAnnouncementDismissed] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem("learnivia-theme") as "light" | "dark" | null;
    if (saved === "dark" || saved === "light") {
      setTheme(saved);
      document.documentElement.setAttribute("data-theme", saved);
    } else {
      setTheme("light");
      document.documentElement.setAttribute("data-theme", "light");
    }
    const dismissed = sessionStorage.getItem("announcement-dismissed");
    if (dismissed) setAnnouncementDismissed(true);
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    localStorage.setItem("learnivia-theme", nextTheme);
    document.documentElement.setAttribute("data-theme", nextTheme);
  };

  const dismissAnnouncement = () => {
    setAnnouncementDismissed(true);
    sessionStorage.setItem("announcement-dismissed", "1");
  };

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    }
    if (profileOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [profileOpen]);

  const initials = (user.name || "U")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div style={{ position: "sticky", top: 0, zIndex: 30 }}>
      {/* ── Announcement Bar ── */}
      {ANNOUNCEMENT.show && !announcementDismissed && (
        <div
          style={{
            background: "var(--announcement-bg, #FEF3C7)",
            borderBottom: "1px solid rgba(245,158,11,0.25)",
            padding: "0.55rem 1.25rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.5rem",
            fontSize: "0.8375rem",
            color: "var(--announcement-text, #92400E)",
            position: "relative",
          }}
        >
          <span>{ANNOUNCEMENT.text}</span>
          <Link
            href={ANNOUNCEMENT.linkHref}
            style={{
              color: "var(--announcement-link, #0D9488)",
              fontWeight: 700,
              textDecoration: "underline",
              textUnderlineOffset: "2px",
            }}
          >
            {ANNOUNCEMENT.linkText}
          </Link>
          <button
            onClick={dismissAnnouncement}
            aria-label="Dismiss announcement"
            style={{
              position: "absolute",
              right: "1rem",
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "var(--announcement-text, #92400E)",
              padding: "2px",
              display: "flex",
              alignItems: "center",
              opacity: 0.6,
            }}
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* ── Utility Top Bar ── */}
      <header
        style={{
          height: "52px",
          background: "var(--surface-raised, #FFFFFF)",
          borderBottom: "1px solid var(--border, #E2E8F0)",
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          padding: "0 1.25rem",
          gap: "0.5rem",
        }}
        role="banner"
      >
        {/* Icon buttons */}
        <IconBtn icon={MessageCircle} label="Messages" href="/community" />
        <IconBtn icon={Bell} label="Notifications" href="#" badge={undefined} />
        <IconBtn icon={Calendar} label="Calendar" href="/sessions" />

        {/* Divider */}
        <div
          style={{
            width: 1,
            height: 22,
            background: "var(--border, #E2E8F0)",
            margin: "0 0.25rem",
          }}
        />

        {/* Avatar / Profile menu */}
        <div style={{ position: "relative" }} ref={menuRef}>
          <button
            onClick={() => setProfileOpen((v) => !v)}
            aria-expanded={profileOpen}
            aria-label="Open profile menu"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.45rem",
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "4px",
              borderRadius: "var(--radius-pill, 9999px)",
            }}
          >
            {/* Avatar circle */}
            {user.image ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={user.image}
                alt={user.name || "User"}
                width={34}
                height={34}
                style={{ borderRadius: "50%", objectFit: "cover" }}
              />
            ) : (
              <div
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: "50%",
                  background: "var(--primary, #0D9488)",
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  letterSpacing: "0.02em",
                }}
              >
                {initials}
              </div>
            )}
            <ChevronDown
              size={13}
              color="var(--text-muted, #64748B)"
              style={{
                transform: profileOpen ? "rotate(180deg)" : "rotate(0)",
                transition: "transform 150ms",
              }}
            />
          </button>

          {/* Dropdown */}
          {profileOpen && (
            <div
              style={{
                position: "absolute",
                top: "calc(100% + 8px)",
                right: 0,
                width: 230,
                background: "var(--surface-raised, #FFFFFF)",
                border: "1px solid var(--border, #E2E8F0)",
                borderRadius: "var(--radius-lg, 14px)",
                boxShadow: "var(--shadow-lg)",
                padding: "0.5rem",
                zIndex: 60,
              }}
            >
              {/* User info */}
              <div
                style={{
                  padding: "0.6rem 0.75rem 0.6rem",
                  borderBottom: "1px solid var(--border, #E2E8F0)",
                  marginBottom: "0.35rem",
                }}
              >
                <p
                  style={{
                    fontSize: "0.875rem",
                    fontWeight: 700,
                    color: "var(--text-primary, #0C1B33)",
                    margin: 0,
                  }}
                >
                  {user.name || "Learner"}
                </p>
                <p
                  style={{
                    fontSize: "0.775rem",
                    color: "var(--text-muted, #64748B)",
                    margin: "2px 0 0",
                  }}
                >
                  {user.email || ""}
                </p>
                <span
                  style={{
                    display: "inline-block",
                    marginTop: "4px",
                    fontSize: "0.7rem",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.04em",
                    color: "var(--primary, #0D9488)",
                  }}
                >
                  {user.isAdmin
                    ? "Administrator"
                    : user.isTutor
                    ? "Verified Tutor"
                    : "K-10 Learner"}
                </span>
              </div>

              <MenuItem
                href={ROUTES.learner?.home || "/dashboard"}
                icon={User}
                label="My Dashboard"
                onClick={() => setProfileOpen(false)}
              />
              <MenuItem
                href={ROUTES.safety || "/safety"}
                icon={ShieldCheck}
                label="Safety Standards"
                onClick={() => setProfileOpen(false)}
              />

              {/* Theme toggle */}
              <button
                type="button"
                onClick={() => { toggleTheme(); setProfileOpen(false); }}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.6rem",
                  padding: "0.45rem 0.75rem",
                  fontSize: "0.8375rem",
                  color: "var(--text-secondary, #475569)",
                  borderRadius: "var(--radius-sm, 8px)",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  textAlign: "left",
                }}
              >
                {theme === "dark" ? <Sun size={14} /> : <Moon size={14} />}
                <span>{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>
              </button>

              <div
                style={{
                  height: 1,
                  background: "var(--border, #E2E8F0)",
                  margin: "0.35rem 0",
                }}
              />

              <button
                type="button"
                onClick={() => signOut({ callbackUrl: "/" })}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.6rem",
                  padding: "0.45rem 0.75rem",
                  fontSize: "0.8375rem",
                  color: "var(--error, #DC2626)",
                  borderRadius: "var(--radius-sm, 8px)",
                  background: "transparent",
                  border: "none",
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
      </header>
    </div>
  );
}

function IconBtn({
  icon: Icon,
  label,
  href,
  badge,
}: {
  icon: React.ElementType;
  label: string;
  href: string;
  badge?: number;
}) {
  return (
    <Link
      href={href}
      aria-label={label}
      title={label}
      style={{
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: 36,
        height: 36,
        borderRadius: "var(--radius-sm, 8px)",
        color: "var(--text-secondary, #475569)",
        textDecoration: "none",
        transition: "background var(--transition, 180ms ease)",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.background =
          "var(--surface-subtle, #F1F5F9)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.background = "transparent";
      }}
    >
      <Icon size={19} strokeWidth={1.75} />
      {badge !== undefined && badge > 0 && (
        <span
          style={{
            position: "absolute",
            top: 5,
            right: 5,
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: "var(--primary, #0D9488)",
            border: "1.5px solid var(--surface-raised, #FFFFFF)",
          }}
        />
      )}
    </Link>
  );
}

function MenuItem({
  href,
  icon: Icon,
  label,
  onClick,
}: {
  href: string;
  icon: React.ElementType;
  label: string;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "0.6rem",
        padding: "0.45rem 0.75rem",
        fontSize: "0.8375rem",
        color: "var(--text-secondary, #475569)",
        borderRadius: "var(--radius-sm, 8px)",
        textDecoration: "none",
        transition: "background var(--transition, 180ms)",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.background =
          "var(--surface-subtle, #F1F5F9)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.background = "transparent";
      }}
    >
      <Icon size={14} />
      <span>{label}</span>
    </Link>
  );
}
