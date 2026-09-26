"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Search,
  GraduationCap,
  HelpCircle,
  Users,
  BookOpen,
  ShieldCheck,
  Award,
  Settings,
  LayoutDashboard,
  FileText,
  AlertTriangle,
} from "lucide-react";
import { ROUTES } from "@/lib/routes";

interface SidebarNavProps {
  userRole?: string;
  isTutor?: boolean;
  isAdmin?: boolean;
  isTrainingCompleted?: boolean;
  className?: string;
}

export function SidebarNav({
  userRole,
  isTutor,
  isAdmin,
  isTrainingCompleted,
  className,
}: SidebarNavProps) {
  const pathname = usePathname();
  const [adminView, setAdminView] = React.useState<"ADMIN" | "TUTOR" | "STUDENT">("ADMIN");
  
  React.useEffect(() => {
    let active = true;
    if (isAdmin) {
      const saved = localStorage.getItem("learnivia_admin_view") as "ADMIN" | "TUTOR" | "STUDENT";
      if (saved && active) {
        setTimeout(() => setAdminView(saved), 0);
      }
    }
    return () => { active = false; };
  }, [isAdmin]);

  const handleAdminViewChange = (view: "ADMIN" | "TUTOR" | "STUDENT") => {
    setAdminView(view);
    localStorage.setItem("learnivia_admin_view", view);
  };

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  // Build nav items based on role
  const studentItems = [
    { href: ROUTES.learner.home, icon: Home, label: "Home" },
    { href: ROUTES.find, icon: Search, label: "Find Sessions" },
    { href: ROUTES.learn || "/learn", icon: GraduationCap, label: "Group Workshops" },
    { href: ROUTES.homeworkHelp || "/homework-help", icon: HelpCircle, label: "Homework Help" },
    { href: ROUTES.community || "/community", icon: Users, label: "Community" },
    { href: ROUTES.sessions || "/sessions", icon: BookOpen, label: "My Sessions" },
    { href: ROUTES.resources || "/resources", icon: FileText, label: "Resources" },
  ];

  const tutorItems = [
    { href: ROUTES.tutor.home, icon: Home, label: "Tutor Home" },
    { href: ROUTES.sessions || "/sessions", icon: BookOpen, label: "Sessions" },
    { href: ROUTES.tutor.training || "/tutor/training", icon: ShieldCheck, label: "Training" },
    { href: ROUTES.tutor.transcript || "/tutor/transcript", icon: Award, label: "Service Hours" },
    { href: ROUTES.homeworkHelp || "/homework-help", icon: HelpCircle, label: "Answer Questions" },
  ];

  const adminItems = [
    { href: ROUTES.admin.home || "/admin", icon: LayoutDashboard, label: "Admin" },
    { href: ROUTES.admin.users || "/admin/users", icon: Users, label: "Users" },
    { href: ROUTES.admin.sessions || "/admin/sessions", icon: BookOpen, label: "Sessions" },
    { href: ROUTES.admin.reports || "/admin/reports", icon: AlertTriangle, label: "Reports" },
    { href: ROUTES.admin.tutors || "/admin/tutors", icon: GraduationCap, label: "Tutors" },
    { href: "/admin/subjects", icon: Settings, label: "Subjects" },
  ];

  const navItems = isAdmin
    ? (adminView === "STUDENT" ? studentItems : adminView === "TUTOR" ? tutorItems : adminItems)
    : isTutor
    ? tutorItems
    : studentItems;

  return (
    <aside
      className={className}
      style={{
        width: "var(--sidebar-width, 64px)",
        minHeight: "100vh",
        background: "var(--sidebar-bg, #FFFFFF)",
        borderRight: "1px solid var(--border, #E2E8F0)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "0",
        position: "sticky",
        top: 0,
        flexShrink: 0,
        zIndex: 40,
      }}
      aria-label="Main navigation"
    >
      {/* Logo */}
      <Link
        href={ROUTES.learner?.home || "/dashboard"}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "60px",
          borderBottom: "1px solid var(--border, #E2E8F0)",
          flexShrink: 0,
        }}
        aria-label="Go to dashboard"
      >
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: "50%",
            background: "var(--primary, #0D9488)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
          }}
        >
          <Image
            src="/images/logo.png"
            alt="Learnivia"
            width={28}
            height={28}
            style={{ objectFit: "contain" }}
          />
        </div>
      </Link>

      {/* Nav Items */}
      <nav
        style={{
          flex: 1,
          width: "100%",
          padding: "8px 0",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "2px",
        }}
      >
        {navItems.map((item) => {
          const active = isActive(item.href);
          return (
            <SidebarItem
              key={item.href}
              href={item.href}
              icon={item.icon}
              label={item.label}
              active={active}
            />
          );
        })}
      </nav>

      {/* Admin View Toggle */}
      {isAdmin && (
        <div style={{ display: "flex", flexDirection: "column", gap: "8px", paddingBottom: "16px", alignItems: "center", borderTop: "1px solid var(--border)", width: "100%", paddingTop: "16px" }}>
          <button 
            onClick={() => handleAdminViewChange("ADMIN")} 
            title="Admin View"
            style={{
              width: 40, height: 40, borderRadius: 8, border: "none", cursor: "pointer",
              background: adminView === "ADMIN" ? "var(--primary-light, #CCFBF1)" : "transparent",
              color: adminView === "ADMIN" ? "var(--primary, #0D9488)" : "var(--muted, #64748B)",
              display: "flex", alignItems: "center", justifyContent: "center"
            }}>
            <LayoutDashboard size={20} />
          </button>
          <button 
            onClick={() => handleAdminViewChange("TUTOR")}
            title="Tutor View"
            style={{
              width: 40, height: 40, borderRadius: 8, border: "none", cursor: "pointer",
              background: adminView === "TUTOR" ? "var(--primary-light, #CCFBF1)" : "transparent",
              color: adminView === "TUTOR" ? "var(--primary, #0D9488)" : "var(--muted, #64748B)",
              display: "flex", alignItems: "center", justifyContent: "center"
            }}>
            <ShieldCheck size={20} />
          </button>
          <button 
            onClick={() => handleAdminViewChange("STUDENT")}
            title="Student View"
            style={{
              width: 40, height: 40, borderRadius: 8, border: "none", cursor: "pointer",
              background: adminView === "STUDENT" ? "var(--primary-light, #CCFBF1)" : "transparent",
              color: adminView === "STUDENT" ? "var(--primary, #0D9488)" : "var(--muted, #64748B)",
              display: "flex", alignItems: "center", justifyContent: "center"
            }}>
            <GraduationCap size={20} />
          </button>
        </div>
      )}

      {/* Bottom: Safety badge */}
      <div
        style={{
          width: "100%",
          padding: "12px 0",
          borderTop: "1px solid var(--border, #E2E8F0)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <SidebarItem
          href={ROUTES.safety || "/safety"}
          icon={ShieldCheck}
          label="Safety"
          active={pathname.startsWith("/safety")}
        />
      </div>
    </aside>
  );
}

interface SidebarItemProps {
  href: string;
  icon: React.ElementType;
  label: string;
  active: boolean;
  locked?: boolean;
}

function SidebarItem({ href, icon: Icon, label, active, locked }: SidebarItemProps) {
  return (
    <Link
      href={locked ? "#" : href}
      title={label}
      aria-label={label}
      aria-current={active ? "page" : undefined}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: 48,
        height: 48,
        borderRadius: "var(--radius-md, 10px)",
        color: active
          ? "var(--primary, #0D9488)"
          : "var(--sidebar-text, #475569)",
        background: active
          ? "var(--sidebar-active-bg, #CCFBF1)"
          : "transparent",
        textDecoration: "none",
        transition: "all var(--transition, 180ms ease)",
        opacity: locked ? 0.45 : 1,
        position: "relative",
      }}
      onMouseEnter={(e) => {
        if (!active) {
          (e.currentTarget as HTMLElement).style.background =
            "var(--surface-subtle, #F1F5F9)";
          (e.currentTarget as HTMLElement).style.color =
            "var(--text-primary, #0C1B33)";
        }
      }}
      onMouseLeave={(e) => {
        if (!active) {
          (e.currentTarget as HTMLElement).style.background = "transparent";
          (e.currentTarget as HTMLElement).style.color =
            "var(--sidebar-text, #475569)";
        }
      }}
    >
      <Icon
        size={20}
        strokeWidth={active ? 2.2 : 1.75}
        aria-hidden="true"
      />
    </Link>
  );
}
