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
        width: "250px",
        minWidth: "250px",
        height: "100vh",
        position: "sticky",
        top: 0,
        background: "var(--wa-white)",
        borderRight: "1px solid var(--wa-border)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "1.25rem 1rem",
        zIndex: 40,
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", flex: 1, minHeight: 0 }}>
        {/* Brand Header */}
        <div style={{ paddingBottom: "1.25rem", paddingLeft: "0.5rem" }}>
          <Link
            href={ROUTES.learner.home}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.6rem",
              textDecoration: "none",
            }}
          >
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: "7px",
                background: "var(--wa-green)",
                color: "#FFFFFF",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 800,
                fontSize: "0.875rem",
              }}
              aria-hidden="true"
            >
              L
            </div>
            <span
              style={{
                fontFamily: "var(--font-serif, Newsreader, Georgia, serif)",
                fontSize: "1.375rem",
                fontWeight: 600,
                color: "var(--wa-ink)",
                letterSpacing: "-0.015em",
              }}
            >
              Learnivia
            </span>
          </Link>
        </div>

        {/* Workspace Switcher for multi-role users */}
        <WorkspaceSwitcher isTutor={isTutor} isAdmin={isAdmin} />

        {/* Workspace Navigation Links */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "0.25rem",
            overflowY: "auto",
            flex: 1,
            paddingRight: "0.25rem",
          }}
        >
          {activeView === "admin" ? (
            /* Administrator Navigation */
            <>
              <div
                style={{
                  fontSize: "0.6875rem",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  color: "var(--wa-muted)",
                  padding: "0.5rem 0.5rem 0.25rem",
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
                  fontSize: "0.6875rem",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  color: "var(--wa-muted)",
                  padding: "0.5rem 0.5rem 0.25rem",
                }}
              >
                Tutor Tools
              </div>
              <NavItem href={ROUTES.tutor.home} label="Tutor Overview" icon={Home} active={isLinkActive(ROUTES.tutor.home)} />
              <NavItem href={ROUTES.tutor.transcript} label="Verified Hours" icon={Award} active={isLinkActive(ROUTES.tutor.transcript)} />
              <NavItem href={ROUTES.tutor.training} label="Safeguarding Training" icon={ShieldCheck} active={isLinkActive(ROUTES.tutor.training)} />
              <NavItem href={ROUTES.sessions} label="Upcoming Sessions" icon={CalendarCheck} active={isLinkActive(ROUTES.sessions)} />
              <NavItem href={ROUTES.homeworkHelp} label="Answer Questions" icon={HelpCircle} active={isLinkActive(ROUTES.homeworkHelp)} />
            </>
          ) : (
            /* Primary Learner Navigation */
            <>
              <div
                style={{
                  fontSize: "0.6875rem",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  color: "var(--wa-muted)",
                  padding: "0.5rem 0.5rem 0.25rem",
                }}
              >
                Learning
              </div>
              <NavItem href={ROUTES.learner.home} label="Home" icon={Home} active={isLinkActive(ROUTES.learner.home)} />
              <NavItem href={ROUTES.find} label="Find a Tutor" icon={Compass} active={isLinkActive(ROUTES.find)} />
              <NavItem href={ROUTES.sessions} label="My Sessions" icon={CalendarCheck} active={isLinkActive(ROUTES.sessions)} />
              <NavItem href={ROUTES.homeworkHelp} label="Homework Help" icon={HelpCircle} active={isLinkActive(ROUTES.homeworkHelp)} />
              <NavItem href={ROUTES.community} label="Community" icon={MessageSquare} active={isLinkActive(ROUTES.community)} />

              <div
                style={{
                  fontSize: "0.6875rem",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  color: "var(--wa-muted)",
                  padding: "1rem 0.5rem 0.25rem",
                }}
              >
                Explore & Help
              </div>
              <NavItem href={ROUTES.resources} label="Learning Resources" icon={FolderOpen} active={isLinkActive(ROUTES.resources)} />
              {isTutor && (
                <NavItem href={ROUTES.tutor.home} label="My Tutoring" icon={GraduationCap} active={isLinkActive(ROUTES.tutor.home)} />
              )}
              {!isTutor && (
                <NavItem href={ROUTES.tutor.apply} label="Volunteer as Tutor" icon={Sparkles} active={isLinkActive(ROUTES.tutor.apply)} />
              )}
              <NavItem href={ROUTES.safety} label="Help & Safety" icon={ShieldCheck} active={isLinkActive(ROUTES.safety)} />
            </>
          )}
        </div>
      </div>

      {/* Footer Trust Note */}
      <div
        style={{
          paddingTop: "0.85rem",
          borderTop: "1px solid var(--wa-border)",
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          fontSize: "0.75rem",
          color: "var(--wa-muted)",
        }}
      >
        <ShieldCheck size={14} color="var(--wa-green)" />
        <span>Verified Free Tutoring</span>
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
        padding: "0.55rem 0.65rem",
        borderRadius: "var(--wa-radius-sm)",
        fontSize: "0.875rem",
        fontWeight: active ? 600 : 500,
        color: active ? "var(--wa-green)" : "var(--wa-text)",
        background: active ? "var(--wa-green-light)" : "transparent",
        borderLeft: active ? "3px solid var(--wa-green)" : "3px solid transparent",
        textDecoration: "none",
        transition: "all var(--wa-transition)",
      }}
    >
      <Icon size={17} strokeWidth={active ? 2 : 1.75} aria-hidden="true" />
      <span>{label}</span>
    </Link>
  );
}
