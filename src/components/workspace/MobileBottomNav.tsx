"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Compass, CalendarCheck, HelpCircle, User } from "lucide-react";
import { ROUTES } from "@/lib/routes";

interface MobileBottomNavProps {
  userRole?: string;
  isTutor?: boolean;
  isAdmin?: boolean;
}

export function MobileBottomNav({
  userRole,
  isTutor,
  isAdmin
}: MobileBottomNavProps) {
  const pathname = usePathname();
  const [adminView, setAdminView] = React.useState<"ADMIN" | "TUTOR" | "STUDENT">("ADMIN");

  React.useEffect(() => {
    if (isAdmin) {
      const saved = localStorage.getItem("learnivia_admin_view") as "ADMIN" | "TUTOR" | "STUDENT";
      if (saved) setAdminView(saved);
    }
  }, [isAdmin]);

  const studentItems = [
    { href: ROUTES.learner.home, label: "Home", icon: Home },
    { href: ROUTES.find, label: "Find", icon: Compass },
    { href: ROUTES.sessions, label: "Sessions", icon: CalendarCheck },
    { href: ROUTES.homeworkHelp, label: "Help", icon: HelpCircle },
    { href: ROUTES.learn || "/learn", label: "Workshops", icon: User },
  ];

  const tutorItems = [
    { href: ROUTES.tutor.home, label: "Home", icon: Home },
    { href: ROUTES.sessions, label: "Sessions", icon: CalendarCheck },
    { href: ROUTES.tutor.training || "/tutor/training", label: "Training", icon: User },
    { href: ROUTES.tutor.transcript || "/tutor/transcript", label: "Hours", icon: Compass },
    { href: ROUTES.homeworkHelp, label: "Help", icon: HelpCircle },
  ];

  const adminItems = [
    { href: ROUTES.admin.home || "/admin", label: "Admin", icon: Home },
    { href: ROUTES.admin.users || "/admin/users", label: "Users", icon: User },
    { href: ROUTES.admin.sessions || "/admin/sessions", label: "Sessions", icon: CalendarCheck },
    { href: ROUTES.admin.reports || "/admin/reports", label: "Reports", icon: HelpCircle },
  ];

  const items = isAdmin
    ? (adminView === "STUDENT" ? studentItems : adminView === "TUTOR" ? tutorItems : adminItems)
    : isTutor
    ? tutorItems
    : studentItems;

  return (
    <nav
      aria-label="Mobile bottom navigation"
      style={{
        display: "none",
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        height: "56px",
        background: "var(--wa-white)",
        borderTop: "1px solid var(--wa-border)",
        zIndex: 50,
        justifyContent: "space-around",
        alignItems: "center",
      }}
      className="mobile-bottom-nav"
    >
      {items.map((item) => {
        const Icon = item.icon;
        const isActive =
          item.href === "/dashboard"
            ? pathname === "/dashboard"
            : pathname === item.href || pathname.startsWith(item.href + "/");

        return (
          <Link
            key={item.href}
            href={item.href}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "2px",
              flex: 1,
              height: "100%",
              textDecoration: "none",
              color: isActive ? "var(--wa-green)" : "var(--wa-muted)",
              fontSize: "0.6875rem",
              fontWeight: isActive ? 700 : 500,
            }}
          >
            <Icon size={18} strokeWidth={isActive ? 2.2 : 1.75} aria-hidden="true" />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
