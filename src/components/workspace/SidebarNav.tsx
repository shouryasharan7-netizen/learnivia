"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Compass,
  CalendarCheck,
  HelpCircle,
  MessageSquare,
  BookOpen,
  ShieldCheck,
  Clock,
  Award,
  Users,
  FileCheck,
  GraduationCap,
  Sparkles,
  AlertTriangle,
  FolderOpen,
  Settings,
} from "lucide-react";
import { ROUTES } from "@/lib/routes";
import { WorkspaceSwitcher } from "./WorkspaceSwitcher";

interface SidebarNavProps {
  userRole?: string;
  isTutor?: boolean;
  isAdmin?: boolean;
  className?: string;
}

export function SidebarNav({
  userRole = "STUDENT",
  isTutor = false,
  isAdmin = false,
  className = "",
}: SidebarNavProps) {
  const pathname = usePathname();

  const isCurrentAdmin = pathname.startsWith("/admin");
  const isCurrentTutor = pathname.startsWith("/tutor");

  // Determine current active workspace view
  let activeView: "admin" | "tutor" | "learner" = "learner";
  if (isCurrentAdmin && isAdmin) {
    activeView = "admin";
  } else if (isCurrentTutor && (isTutor || isAdmin)) {
    activeView = "tutor";
  }

  function isLinkActive(href: string) {
    if (href === "/dashboard" && pathname === "/dashboard") return true;
    if (href === "/tutor" && pathname === "/tutor") return true;
    if (href === "/admin" && pathname === "/admin") return true;
    if (href !== "/dashboard" && href !== "/tutor" && href !== "/admin") {
      return pathname === href || pathname.startsWith(href + "/");
    }
    return false;
  }

  return (
    <aside
      className={className}
      aria-label="Platform navigation"
      style={{
        width: "256px",
        minWidth: "256px",
        height: "100vh",
        position: "sticky",
        top: 0,
        background: "var(--wa-paper, #FAF7F2)",
        borderRight: "1px solid var(--wa-border, #E6DFD5)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "1.5rem 1.15rem",
        zIndex: 40,
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", flex: 1, minHeight: 0 }}>
        {/* Brand Header */}
        <div style={{ paddingBottom: "1.25rem", paddingLeft: "0.4rem" }}>
          <Link
            href={ROUTES.learner.home}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.65rem",
              textDecoration: "none",
            }}
          >
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: "8px",
                background: "var(--wa-crimson, #8B263E)",
                color: "#FFFFFF",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "var(--font-serif, serif)",
                fontWeight: 700,
                fontSize: "1rem",
                boxShadow: "0 2px 5px rgba(139, 38, 62, 0.25)",
              }}
              aria-hidden="true"
            >
              L
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span
                style={{
                  fontFamily: "var(--font-serif, 'Fraunces', Georgia, serif)",
                  fontSize: "1.3rem",
                  fontWeight: 600,
                  color: "var(--wa-ink, #1A1615)",
                  letterSpacing: "-0.02em",
                  lineHeight: 1.15,
                }}
              >
                Learnivia
              </span>
              <span
                style={{
                  fontFamily: "var(--font-mono, monospace)",
                  fontSize: "0.625rem",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  color: "var(--wa-muted, #685E5A)",
                }}
              >
                Academic Salon
              </span>
            </div>
          </Link>
        </div>

        {/* Workspace Switcher for multi-role users */}
        <WorkspaceSwitcher isTutor={isTutor} isAdmin={isAdmin} />

        {/* Workspace Navigation Links */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "0.2rem",
            overflowY: "auto",
            flex: 1,
            paddingRight: "0.2rem",
            marginTop: "0.5rem",
          }}
        >
          {activeView === "admin" ? (
            /* Administrator Navigation */
            <>
              <div
                style={{
                  fontFamily: "var(--font-mono, monospace)",
                  fontSize: "0.65rem",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  color: "var(--wa-muted, #685E5A)",
                  padding: "0.65rem 0.65rem 0.25rem",
                }}
              >
                Admin Center
              </div>
              <NavItem href={ROUTES.admin.home} label="Overview & Health" icon={Home} active={isLinkActive(ROUTES.admin.home)} />
              <NavItem href={ROUTES.admin.users} label="Users & Roles" icon={Users} active={isLinkActive(ROUTES.admin.users)} />
              <NavItem href={ROUTES.admin.applications} label="Tutor Applications" icon={FileCheck} active={isLinkActive(ROUTES.admin.applications)} />
              <NavItem href={ROUTES.admin.tutors} label="Tutors & Transcripts" icon={GraduationCap} active={isLinkActive(ROUTES.admin.tutors)} />
              <NavItem href={ROUTES.admin.sessions} label="Sessions & Workshops" icon={CalendarCheck} active={isLinkActive(ROUTES.admin.sessions)} />
              <NavItem href={ROUTES.admin.reports} label="Safety Incidents" icon={AlertTriangle} active={isLinkActive(ROUTES.admin.reports)} />
              <NavItem href={ROUTES.admin.moderation} label="Content Moderation" icon={MessageSquare} active={isLinkActive(ROUTES.admin.moderation)} />
              <NavItem href={ROUTES.admin.stories} label="Community Stories" icon={BookOpen} active={isLinkActive(ROUTES.admin.stories)} />
              <NavItem href={ROUTES.admin.subjects} label="Curriculum Subjects" icon={Settings} active={isLinkActive(ROUTES.admin.subjects)} />
            </>
          ) : activeView === "tutor" ? (
            /* Tutor Workspace Navigation */
            <>
              <div
                style={{
                  fontFamily: "var(--font-mono, monospace)",
                  fontSize: "0.65rem",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  color: "var(--wa-muted, #685E5A)",
                  padding: "0.65rem 0.65rem 0.25rem",
                }}
              >
                Tutor Folio
              </div>
              <NavItem href={ROUTES.tutor.home} label="Tutor Overview" icon={Home} active={isLinkActive(ROUTES.tutor.home)} />
              <NavItem href={ROUTES.tutor.transcript} label="Verified Service Hours" icon={Award} active={isLinkActive(ROUTES.tutor.transcript)} />
              <NavItem href={ROUTES.tutor.training} label="Safeguarding Training" icon={ShieldCheck} active={isLinkActive(ROUTES.tutor.training)} />
              <NavItem href={ROUTES.sessions} label="Upcoming Sessions" icon={CalendarCheck} active={isLinkActive(ROUTES.sessions)} />
              <NavItem href={ROUTES.homeworkHelp} label="Answer Questions" icon={HelpCircle} active={isLinkActive(ROUTES.homeworkHelp)} />
            </>
          ) : (
            /* Primary Learner Navigation */
            <>
              <div
                style={{
                  fontFamily: "var(--font-mono, monospace)",
                  fontSize: "0.65rem",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  color: "var(--wa-muted, #685E5A)",
                  padding: "0.65rem 0.65rem 0.25rem",
                }}
              >
                Study Desk
              </div>
              <NavItem href={ROUTES.learner.home} label="Desk Overview" icon={Home} active={isLinkActive(ROUTES.learner.home)} />
              <NavItem href={ROUTES.find} label="Find a Peer Tutor" icon={Compass} active={isLinkActive(ROUTES.find)} />
              <NavItem href={ROUTES.sessions} label="My Study Sessions" icon={CalendarCheck} active={isLinkActive(ROUTES.sessions)} />
              <NavItem href={ROUTES.homeworkHelp} label="Homework Help" icon={HelpCircle} active={isLinkActive(ROUTES.homeworkHelp)} />
              <NavItem href={ROUTES.community} label="Peer Dialogues" icon={MessageSquare} active={isLinkActive(ROUTES.community)} />

              <div
                style={{
                  fontFamily: "var(--font-mono, monospace)",
                  fontSize: "0.65rem",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  color: "var(--wa-muted, #685E5A)",
                  padding: "1rem 0.65rem 0.25rem",
                }}
              >
                Library & Support
              </div>
              <NavItem href={ROUTES.resources} label="Study Guides & Tools" icon={FolderOpen} active={isLinkActive(ROUTES.resources)} />
              {isTutor && (
                <NavItem href={ROUTES.tutor.home} label="My Tutoring Folio" icon={GraduationCap} active={isLinkActive(ROUTES.tutor.home)} />
              )}
              {!isTutor && (
                <NavItem href={ROUTES.tutor.apply} label="Volunteer as Tutor" icon={Sparkles} active={isLinkActive(ROUTES.tutor.apply)} />
              )}
              <NavItem href={ROUTES.safety} label="Safeguarding & Help" icon={ShieldCheck} active={isLinkActive(ROUTES.safety)} />
            </>
          )}
        </div>
      </div>

      {/* Footer Trust Note */}
      <div
        style={{
          paddingTop: "0.85rem",
          borderTop: "1px solid var(--wa-border, #E6DFD5)",
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          fontSize: "0.75rem",
          color: "var(--wa-muted, #685E5A)",
        }}
      >
        <ShieldCheck size={15} color="var(--wa-crimson, #8B263E)" />
        <span>100% Free Volunteer Salon</span>
      </div>
    </aside>
  );
}

interface NavItemProps {
  href: string;
  label: string;
  icon: React.ElementType;
  active: boolean;
}

function NavItem({ href, label, icon: Icon, active }: NavItemProps) {
  return (
    <Link
      href={href}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "0.65rem",
        padding: "0.55rem 0.75rem",
        borderRadius: "var(--wa-radius-sm, 8px)",
        fontSize: "0.85rem",
        fontWeight: active ? 600 : 500,
        color: active ? "#FFFFFF" : "var(--wa-text, #2C2422)",
        background: active ? "var(--wa-crimson, #8B263E)" : "transparent",
        textDecoration: "none",
        transition: "all var(--wa-transition, 180ms ease)",
        boxShadow: active ? "0 2px 6px rgba(139, 38, 62, 0.25)" : "none",
      }}
    >
      <Icon size={16} strokeWidth={active ? 2.2 : 1.75} aria-hidden="true" />
      <span>{label}</span>
    </Link>
  );
}
