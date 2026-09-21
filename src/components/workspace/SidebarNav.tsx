"use client";

import React from "react";
import Image from "next/image";
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
  HeartHandshake,
  AlertTriangle,
  FolderOpen,
  Settings,
  Lock,
} from "lucide-react";
import { ROUTES } from "@/lib/routes";
import { WorkspaceSwitcher } from "./WorkspaceSwitcher";

interface SidebarNavProps {
  userRole?: string;
  isTutor?: boolean;
  isAdmin?: boolean;
  isTrainingCompleted?: boolean;
  className?: string;
}

export function SidebarNav({
  userRole = "STUDENT",
  isTutor = false,
  isAdmin = false,
  isTrainingCompleted = false,
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
        <div style={{ paddingBottom: "1.25rem", paddingLeft: "0.2rem" }}>
          <Link
            href={ROUTES.learner.home}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.75rem",
              textDecoration: "none",
            }}
          >
            <Image
              src="/images/logo.png"
              alt="Learnivia Fox Mascot"
              width={36}
              height={36}
              style={{
                borderRadius: "9px",
                objectFit: "contain",
                boxShadow: "0 2px 8px rgba(37, 99, 235, 0.2)",
              }}
              priority
            />
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span
                style={{
                  fontFamily: "var(--font-sans, 'Plus Jakarta Sans', sans-serif)",
                  fontSize: "1.25rem",
                  fontWeight: 700,
                  color: "var(--wa-ink, #0F172A)",
                  letterSpacing: "-0.025em",
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
                  letterSpacing: "0.08em",
                  color: "var(--wa-green, #2563EB)",
                }}
              >
                Peer Learning
              </span>
            </div>
          </Link>
        </div>

        {/* Workspace Switcher for multi-role users */}
        <WorkspaceSwitcher isTutor={isTutor} isAdmin={isAdmin} isTrainingCompleted={isTrainingCompleted} />

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
              <NavItem
                href={isTrainingCompleted ? ROUTES.tutor.home : `${ROUTES.tutor.training}?locked=1`}
                label="Tutor Overview"
                icon={Home}
                active={isLinkActive(ROUTES.tutor.home)}
                locked={!isTrainingCompleted}
              />
              <NavItem
                href={isTrainingCompleted ? ROUTES.tutor.transcript : `${ROUTES.tutor.training}?locked=1`}
                label="Verified Service Hours"
                icon={Award}
                active={isLinkActive(ROUTES.tutor.transcript)}
                locked={!isTrainingCompleted}
              />
              <NavItem
                href={ROUTES.tutor.training}
                label="Safeguarding Training"
                icon={ShieldCheck}
                active={isLinkActive(ROUTES.tutor.training)}
                badge={!isTrainingCompleted ? "Required" : undefined}
              />
              <NavItem
                href={isTrainingCompleted ? ROUTES.sessions : `${ROUTES.tutor.training}?locked=1`}
                label="Upcoming Sessions"
                icon={CalendarCheck}
                active={isLinkActive(ROUTES.sessions)}
                locked={!isTrainingCompleted}
              />
              <NavItem
                href={isTrainingCompleted ? ROUTES.homeworkHelp : `${ROUTES.tutor.training}?locked=1`}
                label="Answer Questions"
                icon={HelpCircle}
                active={isLinkActive(ROUTES.homeworkHelp)}
                locked={!isTrainingCompleted}
              />
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
              <NavItem href={ROUTES.sessions} label="My Schedule & Sessions" icon={CalendarCheck} active={isLinkActive(ROUTES.sessions)} />
              <NavItem href={ROUTES.homeworkHelp} label="Homework Help" icon={HelpCircle} active={isLinkActive(ROUTES.homeworkHelp)} />
              <NavItem href={ROUTES.community} label="Student Community" icon={MessageSquare} active={isLinkActive(ROUTES.community)} />

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
                <NavItem href={ROUTES.tutor.home} label="Tutor Workspace" icon={GraduationCap} active={isLinkActive(ROUTES.tutor.home)} />
              )}
              {!isTutor && (
                <NavItem href={ROUTES.tutor.apply} label="Volunteer as Tutor" icon={HeartHandshake} active={isLinkActive(ROUTES.tutor.apply)} />
              )}
              <NavItem href={ROUTES.safety} label="Safeguarding & Safety" icon={ShieldCheck} active={isLinkActive(ROUTES.safety)} />
            </>
          )}
        </div>
      </div>

      {/* Footer Trust Note */}
      <div
        style={{
          paddingTop: "0.85rem",
          borderTop: "1px solid var(--wa-border, #E2E8F0)",
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          fontSize: "0.75rem",
          color: "var(--wa-muted, #64748B)",
        }}
      >
        <ShieldCheck size={15} color="var(--wa-green, #2563EB)" />
        <span>100% Free Volunteer Platform</span>
      </div>
    </aside>
  );
}

interface NavItemProps {
  href: string;
  label: string;
  icon: React.ElementType;
  active: boolean;
  locked?: boolean;
  badge?: string;
}

function NavItem({ href, label, icon: Icon, active, locked, badge }: NavItemProps) {
  return (
    <Link
      href={href}
      title={locked ? "Complete Safeguarding Training to unlock" : undefined}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "0.65rem",
        padding: "0.55rem 0.75rem",
        borderRadius: "var(--wa-radius-sm, 8px)",
        fontSize: "0.85rem",
        fontWeight: active ? 600 : 500,
        color: active ? "#FFFFFF" : locked ? "var(--wa-muted, #64748B)" : "var(--wa-text, #1E293B)",
        background: active ? "var(--wa-green, #2563EB)" : "transparent",
        textDecoration: "none",
        transition: "all var(--wa-transition, 180ms ease)",
        boxShadow: active ? "0 2px 8px rgba(37, 99, 235, 0.25)" : "none",
        opacity: locked ? 0.7 : 1,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "0.65rem" }}>
        <Icon size={16} strokeWidth={active ? 2.2 : 1.75} aria-hidden="true" />
        <span>{label}</span>
      </div>
      {locked && (
        <div style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
          <Lock size={12} color="var(--wa-muted, #64748B)" />
        </div>
      )}
      {badge && (
        <span
          style={{
            fontSize: "0.65rem",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.04em",
            padding: "0.15rem 0.45rem",
            borderRadius: "4px",
            background: active ? "rgba(255,255,255,0.25)" : "#FEF3C7",
            color: active ? "#FFFFFF" : "#92400E",
          }}
        >
          {badge}
        </span>
      )}
    </Link>
  );
}
