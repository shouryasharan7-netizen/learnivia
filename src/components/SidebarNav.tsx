"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { motion } from "motion/react";
import { springs } from "@/lib/motion";
import styles from "./SidebarNav.module.css";
import {
  LayoutDashboard,
  Compass,
  GraduationCap,
  MessageSquare,
  Users,
  BookOpen,
  FolderOpen,
  Sparkles,
  CalendarPlus,
  ChevronDown,
  PanelLeftClose,
  PanelLeft,
  CheckCircle2,
  ShieldCheck,
} from "lucide-react";

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
  badge?: string;
  children?: { href: string; label: string }[];
  highlight?: boolean;
}

export function SidebarNav() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [expanded, setExpanded] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  // Restore saved sidebar collapsed state on mount
  useEffect(() => {
    const saved = localStorage.getItem("learnivia_sidebar_collapsed");
    if (saved === "true") {
      setCollapsed(true);
    }
  }, []);

  function toggleCollapse() {
    const nextState = !collapsed;
    setCollapsed(nextState);
    localStorage.setItem("learnivia_sidebar_collapsed", nextState ? "true" : "false");
  }

  const userRole = session?.user?.role || "STUDENT";
  const isTutor = userRole === "TUTOR" || userRole === "ADMIN";

  // Student navigation items
  const studentNavItems: NavItem[] = [
    { href: "/dashboard", label: "Student Home", icon: <LayoutDashboard size={19} /> },
    { href: "/sessions", label: "Find a Session", icon: <Compass size={19} /> },
    { href: "/learn", label: "Programs", icon: <GraduationCap size={19} /> },
    { href: "/homework-help", label: "Homework Help", icon: <MessageSquare size={19} /> },
    { href: "/community", label: "Community", icon: <Users size={19} /> },
    {
      href: "/resources",
      label: "Learning Resources",
      icon: <FolderOpen size={19} />,
      children: [
        { href: "/resources/study-guides", label: "Study Guides" },
        { href: "/resources/tools", label: "Learning Tools" },
      ],
    },
    {
      href: "/apply",
      label: "Become a Tutor",
      icon: <Sparkles size={19} />,
      badge: "Apply",
      highlight: true,
    },
  ];

  // Tutor & Admin navigation items
  const tutorNavItems: NavItem[] = [
    { href: "/dashboard", label: "Student Home", icon: <LayoutDashboard size={19} /> },
    { href: "/sessions", label: "Find a Session", icon: <Compass size={19} /> },
    { href: "/learn", label: "Programs", icon: <GraduationCap size={19} /> },
    { href: "/homework-help", label: "Homework Help", icon: <MessageSquare size={19} /> },
    { href: "/community", label: "Community", icon: <Users size={19} /> },
    {
      href: "/tutor",
      label: "My Tutoring",
      icon: <BookOpen size={19} />,
      badge: "Tutor",
      children: [
        { href: "/tutor", label: "Tutor Dashboard" },
        { href: "/tutor#schedule-session", label: "Host a Session" },
        { href: "/tutor/transcript", label: "Volunteer Transcript" },
      ],
    },
    {
      href: "/resources",
      label: "Tutoring Resources",
      icon: <FolderOpen size={19} />,
      children: [
        { href: "/resources/study-guides", label: "Study Guides" },
        { href: "/resources/tools", label: "Interactive Tools" },
        { href: "/tutor/transcript", label: "Verified Record" },
      ],
    },
  ];

  const currentNavItems = isTutor ? tutorNavItems : studentNavItems;

  function isActive(href: string) {
    if (href === "/dashboard" && pathname === "/dashboard") return true;
    if (href !== "/dashboard" && (pathname === href || pathname.startsWith(href + "/"))) return true;
    return false;
  }

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className={styles.overlay}
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar (Desktop Dock / Expandable Drawer) */}
      <aside
        className={`${styles.sidebar} ${collapsed ? styles.sidebarCollapsed : ""} ${sidebarOpen ? styles.sidebarExpanded : ""}`}
        aria-label="Main platform navigation"
      >
        {/* Top Header Row with Role Indicator & Collapse Toggle Button */}
        <div className={styles.sidebarHeader}>
          {!collapsed && (
            <div className={styles.roleBadgeBlock}>
              {userRole === "ADMIN" ? (
                <span className={styles.adminBadge}>
                  <ShieldCheck size={13} /> Administrator
                </span>
              ) : isTutor ? (
                <span className={styles.tutorBadge}>
                  <CheckCircle2 size={13} /> Verified Tutor
                </span>
              ) : (
                <span className={styles.studentBadge}>
                  <GraduationCap size={13} /> K–10 Learner
                </span>
              )}
            </div>
          )}

          <button
            className={styles.collapseToggleBtn}
            onClick={toggleCollapse}
            aria-label={collapsed ? "Expand sidebar navigation" : "Collapse sidebar to icons"}
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <PanelLeft size={17} /> : <PanelLeftClose size={17} />}
          </button>
        </div>

        {/* Navigation Items List */}
        <div className={styles.navItemsList}>
          {currentNavItems.map((item) => {
            const active = isActive(item.href);
            const hasChildren = item.children && item.children.length > 0;
            const childExpanded = expanded === item.href && !collapsed;

            return (
              <div key={item.href} className={styles.navGroup}>
                {hasChildren && !collapsed ? (
                  <>
                    <button
                      className={`${styles.navItem} ${active ? styles.navItemActive : ""}`}
                      onClick={() => setExpanded(childExpanded ? null : item.href)}
                      aria-expanded={childExpanded}
                      title={item.label}
                    >
                      <span className={styles.navIcon}>{item.icon}</span>
                      <span className={styles.navLabel}>{item.label}</span>
                      {item.badge && <span className={styles.itemBadge}>{item.badge}</span>}
                      <ChevronDown
                        size={15}
                        className={`${styles.expandChevron} ${childExpanded ? styles.expandChevronOpen : ""}`}
                      />
                    </button>
                    {childExpanded && (
                      <div className={styles.subMenu}>
                        {item.children!.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            className={`${styles.subItem} ${pathname === child.href ? styles.subItemActive : ""}`}
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    href={item.href}
                    className={`${styles.navItem} ${active ? styles.navItemActive : ""} ${item.highlight ? styles.navItemHighlight : ""}`}
                    title={item.label}
                  >
                    <span className={styles.navIcon}>{item.icon}</span>
                    {!collapsed && <span className={styles.navLabel}>{item.label}</span>}
                    {!collapsed && item.badge && <span className={styles.itemBadge}>{item.badge}</span>}
                  </Link>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom Tutor Shortcut for Tutors / Application Callout for Students */}
        {!collapsed && (
          <div className={styles.sidebarFooter}>
            {isTutor ? (
              <Link href="/tutor#schedule-session" className={styles.hostSessionBtn}>
                <CalendarPlus size={18} />
                <span>Host a Session</span>
              </Link>
            ) : (
              <div className={styles.studentApplyCard}>
                <div className={styles.applyCardIcon}>
                  <Sparkles size={18} color="#2D6A4F" />
                </div>
                <div className={styles.applyCardTitle}>Want to Teach?</div>
                <p className={styles.applyCardText}>Share your knowledge and earn verified service hours.</p>
                <Link href="/apply" className={styles.applyCardLink}>
                  Apply to Tutor →
                </Link>
              </div>
            )}
          </div>
        )}
      </aside>
    </>
  );
}

export default SidebarNav;
