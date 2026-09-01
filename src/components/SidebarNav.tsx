"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import styles from "./SidebarNav.module.css";

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
  badge?: string;
  children?: { href: string; label: string }[];
  highlight?: boolean;
}

function HomeIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
      <polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="11" cy="11" r="8"/>
      <line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </svg>
  );
}

function ProgramsIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
      <path d="M6 12v5c3 3 9 3 12 0v-5"/>
    </svg>
  );
}

function ChatIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
    </svg>
  );
}

function CommunityIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 00-3-3.87"/>
      <path d="M16 3.13a4 4 0 010 7.75"/>
    </svg>
  );
}

function TutoringIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
      <line x1="8" y1="21" x2="16" y2="21"/>
      <line x1="12" y1="17" x2="12" y2="21"/>
    </svg>
  );
}

function ResourcesIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
    </svg>
  );
}

function ApplyTutorIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
    </svg>
  );
}

function HostIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10"/>
      <line x1="12" y1="8" x2="12" y2="16"/>
      <line x1="8" y1="12" x2="16" y2="12"/>
    </svg>
  );
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

  // Common student navigation items
  const studentNavItems: NavItem[] = [
    { href: "/dashboard", label: "Home", icon: <HomeIcon /> },
    { href: "/sessions", label: "Find a Session", icon: <SearchIcon /> },
    { href: "/learn", label: "Programs", icon: <ProgramsIcon /> },
    { href: "/homework-help", label: "Homework Help", icon: <ChatIcon /> },
    { href: "/community", label: "Community", icon: <CommunityIcon /> },
    {
      href: "/resources",
      label: "Learning Resources",
      icon: <ResourcesIcon />,
      children: [
        { href: "/resources/study-guides", label: "Study Guides" },
        { href: "/resources/tools", label: "Learning Tools" },
      ],
    },
    {
      href: "/apply",
      label: "Become a Tutor",
      icon: <ApplyTutorIcon />,
      badge: "Apply",
      highlight: true,
    },
  ];

  // Tutor & Admin navigation items
  const tutorNavItems: NavItem[] = [
    { href: "/dashboard", label: "Student Home", icon: <HomeIcon /> },
    { href: "/sessions", label: "Find a Session", icon: <SearchIcon /> },
    { href: "/learn", label: "Programs", icon: <ProgramsIcon /> },
    { href: "/homework-help", label: "Homework Help", icon: <ChatIcon /> },
    { href: "/community", label: "Community", icon: <CommunityIcon /> },
    {
      href: "/tutor",
      label: "My Tutoring",
      icon: <TutoringIcon />,
      badge: "Tutor",
      children: [
        { href: "/tutor", label: "Tutor Dashboard" },
        { href: "/tutor#schedule-session", label: "➕ Host a Session" },
        { href: "/tutor/transcript", label: "Volunteer Transcript" },
      ],
    },
    {
      href: "/resources",
      label: "Tutoring Resources",
      icon: <ResourcesIcon />,
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
              {isTutor ? (
                <span className={styles.tutorBadge}>✓ Verified Tutor</span>
              ) : (
                <span className={styles.studentBadge}>🎓 Learner</span>
              )}
            </div>
          )}

          <button
            className={styles.collapseToggleBtn}
            onClick={toggleCollapse}
            aria-label={collapsed ? "Expand sidebar navigation" : "Collapse sidebar to icons"}
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <svg
              className={`${styles.toggleIcon} ${collapsed ? styles.toggleIconCollapsed : ""}`}
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="15 18 9 12 15 6"/>
            </svg>
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
                      <svg
                        className={`${styles.expandChevron} ${childExpanded ? styles.expandChevronOpen : ""}`}
                        width="14"
                        height="14"
                        viewBox="0 0 16 16"
                        fill="none"
                        aria-hidden="true"
                      >
                        <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
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
                <span className={styles.btnIcon}><HostIcon /></span>
                <span>Host a Session</span>
              </Link>
            ) : (
              <div className={styles.studentApplyCard}>
                <div className={styles.applyCardIcon}>🌱</div>
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
