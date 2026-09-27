"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, BookOpen, HelpCircle, GraduationCap, Users, CalendarCheck, User } from "lucide-react";
import { ROUTES } from "@/lib/routes";

interface MobileBottomNavProps {
  userRole?: string;
  isTutor?: boolean;
  isAdmin?: boolean;
}

export function MobileBottomNav({
  userRole,
  isTutor,
  isAdmin,
}: MobileBottomNavProps) {
  const pathname = usePathname();
  const [adminView, setAdminView] = React.useState<
    "ADMIN" | "TUTOR" | "STUDENT"
  >("ADMIN");

  React.useEffect(() => {
    let active = true;
    if (isAdmin) {
      const saved = localStorage.getItem("learnivia_admin_view") as
        "ADMIN" | "TUTOR" | "STUDENT";
      if (saved && active) {
        setTimeout(() => setAdminView(saved), 0);
      }
    }
    return () => {
      active = false;
    };
  }, [isAdmin]);

  const studentItems = [
    { href: ROUTES.learner.home, label: "Home", icon: Home },
    { href: ROUTES.find, label: "Find", icon: Search },
    { href: ROUTES.sessions, label: "Sessions", icon: BookOpen },
    { href: ROUTES.homeworkHelp, label: "Help", icon: HelpCircle },
    { href: ROUTES.learn || "/learn", label: "Workshops", icon: GraduationCap },
  ];

  const tutorItems = [
    { href: ROUTES.tutor.home, label: "Home", icon: Home },
    { href: ROUTES.sessions, label: "Sessions", icon: BookOpen },
    {
      href: ROUTES.tutor.training || "/tutor/training",
      label: "Training",
      icon: GraduationCap,
    },
    {
      href: ROUTES.tutor.transcript || "/tutor/transcript",
      label: "Hours",
      icon: Search,
    },
    { href: ROUTES.homeworkHelp, label: "Help", icon: HelpCircle },
  ];

  const adminItems = [
    { href: ROUTES.admin.home || "/admin", label: "Admin", icon: Home },
    { href: ROUTES.admin.users || "/admin/users", label: "Users", icon: Users },
    {
      href: ROUTES.admin.sessions || "/admin/sessions",
      label: "Sessions",
      icon: BookOpen,
    },
    {
      href: ROUTES.admin.reports || "/admin/reports",
      label: "Reports",
      icon: HelpCircle,
    },
  ];

  const items = isAdmin
    ? adminView === "STUDENT"
      ? studentItems
      : adminView === "TUTOR"
        ? tutorItems
        : adminItems
    : isTutor
      ? tutorItems
      : studentItems;

  return (
    <nav aria-label="Mobile bottom navigation" className="mobile-bottom-nav">
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
            className={`mobile-bottom-nav-item ${isActive ? "active" : ""}`}
          >
            <Icon
              size={18}
              strokeWidth={isActive ? 2.2 : 1.75}
              aria-hidden="true"
            />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
