"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Search,
  MessageSquare,
  BookOpen,
  CalendarPlus,
  GraduationCap,
  Award,
  ShieldAlert,
  LogOut,
  ChevronDown,
  HeartHandshake,
  Bell,
  Calendar,
  Sun,
  Moon,
} from "lucide-react";
import styles from "./Navbar.module.css";

const megaMenuPrograms = [
  {
    title: "Early Elementary (K-Grade 2)",
    description: "Phonics, early math foundations, and reading comprehension for young learners.",
    href: "/find?grade=K-2",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
      </svg>
    ),
    badge: "Ages 5-8",
  },
  {
    title: "Elementary (Grades 3-5)",
    description: "Math, reading & writing, and general science for growing minds.",
    href: "/find?grade=3-5",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
      </svg>
    ),
    badge: "Ages 8-11",
  },
  {
    title: "Middle School (Grades 6-8)",
    description: "Pre-Algebra, English & Language Arts, Earth & Physical Science.",
    href: "/find?grade=6-8",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="4" y1="12" x2="20" y2="12"/><line x1="12" y1="4" x2="12" y2="20"/>
      </svg>
    ),
    badge: "Ages 11-14",
  },
  {
    title: "Early High School (Grades 9-10)",
    description: "Algebra I, Geometry, Biology, Chemistry, and more with 1-on-1 support.",
    href: "/find?grade=9-10",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 3v6l-5 9a2 2 0 0 0 1.7 3h12.6a2 2 0 0 0 1.7-3l-5-9V3"/><line x1="9" y1="3" x2="15" y2="3"/>
      </svg>
    ),
    badge: "Ages 14-16",
  },
];

const getInvolvedLinks = [
  { href: "/apply", label: "Become a Volunteer Tutor", desc: "Share your knowledge and earn verified hours" },
  { href: "/how-it-works", label: "How It Works", desc: "Learn about our peer-learning model" },
  { href: "/parents", label: "For Parents", desc: "Safeguarding and guardian guidelines" },
  { href: "/educators", label: "For Educators", desc: "Bring Learnivia to your classroom" },
];

const mainLinks = [
  { href: "/about", label: "About" },
  { href: "/faq", label: "FAQ & Support" },
];

export function Navbar() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [exploreOpen, setExploreOpen] = useState(false);
  const [involvedOpen, setInvolvedOpen] = useState(false);
  const exploreRef = useRef<HTMLDivElement>(null);
  const involvedRef = useRef<HTMLDivElement>(null);

  const [activePopover, setActivePopover] = useState<"messages" | "notifications" | "calendar" | "user" | null>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const saved = localStorage.getItem("learnivia-theme") as "light" | "dark" | null;
    if (saved === "dark" || saved === "light") {
      setTheme(saved);
      document.documentElement.setAttribute("data-theme", saved);
    } else {
      setTheme("light");
      document.documentElement.setAttribute("data-theme", "light");
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    localStorage.setItem("learnivia-theme", nextTheme);
    document.documentElement.setAttribute("data-theme", nextTheme);
  };

  // Close dropdowns and popovers on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (exploreRef.current && !exploreRef.current.contains(e.target as Node)) setExploreOpen(false);
      if (involvedRef.current && !involvedRef.current.contains(e.target as Node)) setInvolvedOpen(false);
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) setActivePopover(null);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const [prevPathname, setPrevPathname] = useState(pathname);
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setMobileOpen(false);
    setExploreOpen(false);
    setInvolvedOpen(false);
    setActivePopover(null);
  }

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  // If logged in, render the compact top bar for the authenticated shell
  if (session) {
    const userName = session.user?.name || "Learner";
    const userInitials = session.user?.name
      ? session.user.name.split(" ").map(n => n[0]).slice(0, 2).join("").toUpperCase()
      : "U";

    const userRole = session.user?.role || "STUDENT";
    const isAdmin = userRole === "ADMIN";

    return (
      <header className={styles.authHeader} role="banner">
        <div className={styles.authContainer}>
          {/* Left: Logo */}
          <Link href="/dashboard" className={styles.authLogo} aria-label="Learnivia Home">
            <Image src="/images/logo.png" alt="Learnivia" width={32} height={32} priority className={styles.authLogoImg} />
            <span className={styles.authLogoText}>Learnivia</span>
          </Link>

          {/* Spacer */}
          <div className={styles.authSpacer} />

          {/* Right: action icons with working dropdowns */}
          <div className={styles.authActions} ref={popoverRef}>
            {/* Messages button */}
            <div className={styles.actionWrapper}>
              <button
                className={styles.iconBtn}
                aria-label="Messages (0 new)"
                aria-expanded={activePopover === "messages"}
                onClick={() => setActivePopover(activePopover === "messages" ? null : "messages")}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
                </svg>
              </button>

              {activePopover === "messages" && (
                <div className={styles.popoverMenu} role="dialog" aria-label="Messages">
                  <div className={styles.popoverHeader}>
                    <span>Messages</span>
                    <span className={styles.popoverCount}>0 new</span>
                  </div>
                  <div className={styles.popoverEmpty}>
                    <div className={styles.popoverEmptyIcon} aria-hidden="true">
                      <MessageSquare size={32} color="#78716C" strokeWidth={1.5} />
                    </div>
                    <p className={styles.popoverEmptyTitle}>No new messages</p>
                    <p className={styles.popoverEmptyText}>
                      When you connect with tutors or attend group sessions, direct conversations will appear here.
                    </p>
                  </div>
                  <Link href="/sessions" className={styles.popoverFooterLink} onClick={() => setActivePopover(null)}>
                    Browse Sessions &amp; Tutors →
                  </Link>
                </div>
              )}
            </div>

            {/* Notifications button */}
            <div className={styles.actionWrapper}>
              <button
                className={styles.iconBtn}
                aria-label="Notifications (0 new)"
                aria-expanded={activePopover === "notifications"}
                onClick={() => setActivePopover(activePopover === "notifications" ? null : "notifications")}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0"/>
                </svg>
              </button>

              {activePopover === "notifications" && (
                <div className={styles.popoverMenu} role="dialog" aria-label="Notifications">
                  <div className={styles.popoverHeader}>
                    <span>Notifications</span>
                    <span className={styles.popoverCount}>0 unread</span>
                  </div>
                  <div className={styles.popoverEmpty}>
                    <div className={styles.popoverEmptyIcon} aria-hidden="true">
                      <Bell size={32} color="#78716C" strokeWidth={1.5} />
                    </div>
                    <p className={styles.popoverEmptyTitle}>You&apos;re all caught up!</p>
                    <p className={styles.popoverEmptyText}>
                      Session reminders, enrollment confirmations, and community updates will appear here.
                    </p>
                  </div>
                  <Link href="/dashboard" className={styles.popoverFooterLink} onClick={() => setActivePopover(null)}>
                    View My Dashboard →
                  </Link>
                </div>
              )}
            </div>

            {/* Calendar button */}
            <div className={styles.actionWrapper}>
              <button
                className={styles.iconBtn}
                aria-label="Calendar schedule"
                aria-expanded={activePopover === "calendar"}
                onClick={() => setActivePopover(activePopover === "calendar" ? null : "calendar")}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                  <line x1="16" y1="2" x2="16" y2="6"/>
                  <line x1="8" y1="2" x2="8" y2="6"/>
                  <line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
              </button>

              {activePopover === "calendar" && (
                <div className={styles.popoverMenu} role="dialog" aria-label="Calendar">
                  <div className={styles.popoverHeader}>
                    <span>Upcoming Schedule</span>
                  </div>
                  <div className={styles.popoverEmpty}>
                    <div className={styles.popoverEmptyIcon} aria-hidden="true">
                      <Calendar size={32} color="#78716C" strokeWidth={1.5} />
                    </div>
                    <p className={styles.popoverEmptyTitle}>No sessions scheduled today</p>
                    <p className={styles.popoverEmptyText}>
                      Check your upcoming bookings or register for a live study session.
                    </p>
                  </div>
                  <Link href="/dashboard" className={styles.popoverFooterLink} onClick={() => setActivePopover(null)}>
                    Go to Full Calendar &amp; Sessions →
                  </Link>
                </div>
              )}
            </div>

            {/* Direct Theme Switcher */}
            <button
              type="button"
              onClick={toggleTheme}
              title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
              aria-label={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
              className={styles.iconBtn}
              style={{ display: "inline-flex", alignItems: "center", justifyContent: "center" }}
            >
              {theme === "dark" ? <Sun size={18} color="#F59E0B" /> : <Moon size={18} color="#2563EB" />}
            </button>

            {/* User profile capsule with dropdown */}
            <div className={styles.actionWrapper}>
              <button
                className={styles.userCapsule}
                aria-expanded={activePopover === "user"}
                onClick={() => setActivePopover(activePopover === "user" ? null : "user")}
              >
                <div className={styles.userAvatar} aria-hidden="true">
                  {userInitials}
                </div>
                <span className={styles.userName}>{userName.split(" ")[0]}</span>
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>

              {activePopover === "user" && (
                <div className={`${styles.popoverMenu} ${styles.userProfileMenu}`} role="menu">
                  <div className={styles.userInfoBlock}>
                    <p className={styles.userFullName}>{userName}</p>
                    <p className={styles.userEmail}>{session.user?.email}</p>
                    <span className={styles.roleTag}>{userRole}</span>
                  </div>

                  <div className={styles.userMenuList}>
                    <Link href="/dashboard" className={styles.userMenuItem} role="menuitem" onClick={() => setActivePopover(null)}>
                      <LayoutDashboard size={16} color="var(--wa-muted, #64748B)" />
                      <span>My Dashboard</span>
                    </Link>
                    <Link href="/sessions" className={styles.userMenuItem} role="menuitem" onClick={() => setActivePopover(null)}>
                      <Search size={16} color="var(--wa-muted, #64748B)" />
                      <span>Find a Session</span>
                    </Link>
                    <Link href="/community" className={styles.userMenuItem} role="menuitem" onClick={() => setActivePopover(null)}>
                      <MessageSquare size={16} color="var(--wa-muted, #64748B)" />
                      <span>Community Discussions</span>
                    </Link>
                    <Link href="/resources" className={styles.userMenuItem} role="menuitem" onClick={() => setActivePopover(null)}>
                      <BookOpen size={16} color="var(--wa-muted, #64748B)" />
                      <span>{userRole === "TUTOR" || userRole === "ADMIN" ? "Tutoring Resources" : "Learning Resources"}</span>
                    </Link>

                    {userRole === "TUTOR" || userRole === "ADMIN" ? (
                      <>
                        <Link href="/tutor#schedule-session" className={styles.userMenuItem} role="menuitem" onClick={() => setActivePopover(null)} style={{ color: "var(--wa-crimson, #2563EB)", fontWeight: 600 }}>
                          <CalendarPlus size={16} color="var(--wa-crimson, #2563EB)" />
                          <span>Host a Session</span>
                        </Link>
                        <Link href="/tutor" className={styles.userMenuItem} role="menuitem" onClick={() => setActivePopover(null)}>
                          <GraduationCap size={16} color="var(--wa-muted, #64748B)" />
                          <span>Tutor Dashboard</span>
                        </Link>
                        <Link href="/tutor/transcript" className={styles.userMenuItem} role="menuitem" onClick={() => setActivePopover(null)}>
                          <Award size={16} color="var(--wa-muted, #64748B)" />
                          <span>Volunteer Transcript</span>
                        </Link>
                      </>
                    ) : (
                      <Link href="/apply" className={styles.userMenuItem} role="menuitem" onClick={() => setActivePopover(null)} style={{ color: "var(--wa-crimson, #2563EB)", fontWeight: 600 }}>
                        <HeartHandshake size={16} color="var(--wa-crimson, #2563EB)" />
                        <span>Become a Volunteer Tutor</span>
                      </Link>
                    )}

                    {isAdmin && (
                      <Link href="/admin" className={styles.userMenuItem} role="menuitem" onClick={() => setActivePopover(null)} style={{ color: "var(--wa-warning, #D97706)", fontWeight: 700, background: "var(--wa-warning-bg, #FFFBEB)" }}>
                        <ShieldAlert size={16} color="var(--wa-warning, #D97706)" />
                        <span>Master Admin Center</span>
                      </Link>
                    )}

                    <div className={styles.userMenuDivider} />

                    <button
                      className={styles.signOutMenuItem}
                      role="menuitem"
                      onClick={() => signOut({ callbackUrl: "/" })}
                    >
                      <LogOut size={16} />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
    );
  }

  // Pre-login High-Fidelity Navbar (Matching Image 1 & 4)
  return (
    <>
      {/* ── Slim Announcement Strip (replaces old TopBarPublic) ── */}
      <div style={{
        background: "var(--navy, #0C1B33)",
        color: "#fff",
        fontSize: "0.8rem",
        fontWeight: 600,
        textAlign: "center",
        padding: "0.45rem 1rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "1rem",
        flexWrap: "wrap",
      }}>
        <span style={{ opacity: 0.85 }}>Non-Profit · Supervised 1-on-1 tutoring for Kindergarten to Grade 10 · 100% Free</span>
        <span style={{ display: "flex", alignItems: "center", gap: "0.5rem", opacity: 0.9 }}>
          <span style={{ background: "var(--primary, #0D9488)", borderRadius: "4px", padding: "1px 8px", fontSize: "0.7rem", fontWeight: 700 }}>✦ Verified</span>
          High School &amp; College Mentors
        </span>
      </div>

      <header className={styles.header} role="banner">

        <div className={styles.container}>
          {/* Logo & Name */}
          <Link href="/" className={styles.logoLink} aria-label="Learnivia Home">
            <Image 
              src="/images/logo.png" 
              alt="Learnivia Fox Mascot" 
              width={38} 
              height={38} 
              priority 
              className={styles.logoImg} 
            />
            <span className={styles.logoText}>Learnivia</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className={styles.nav} aria-label="Main navigation">
            {/* Explore Programs Mega-Menu Trigger */}
            <div className={styles.dropdownWrapper} ref={exploreRef}>
              <button
                className={`${styles.exploreBtn} ${exploreOpen ? styles.exploreBtnActive : ""}`}
                aria-expanded={exploreOpen}
                aria-haspopup="true"
                onClick={() => { setExploreOpen(!exploreOpen); setInvolvedOpen(false); }}
              >
                <span>Explore Programs</span>
                <span className={`${styles.chevron} ${exploreOpen ? styles.chevronOpen : ""}`} aria-hidden="true">
                  {exploreOpen ? "▲" : "▼"}
                </span>
              </button>

              {/* Full Featured Mega Menu */}
              {exploreOpen && (
                <div className={styles.megaMenu} role="dialog" aria-label="Explore programs">
                  <div className={styles.megaMenuHeader}>
                    <h2 className={styles.megaMenuTitle}>Explore Programs</h2>
                    <p className={styles.megaMenuSubtitle}>Find the program that&apos;s right for you.</p>
                  </div>

                  <div className={styles.megaMenuGrid}>
                    {megaMenuPrograms.map((prog) => (
                      <Link 
                        key={prog.title} 
                        href={prog.href} 
                        className={styles.megaCard}
                        onClick={() => setExploreOpen(false)}
                      >
                        <div className={styles.megaCardTop}>
                          <span className={styles.megaCardIcon}>{prog.icon}</span>
                          <span className={styles.megaCardBadge}>{prog.badge}</span>
                        </div>
                        <h3 className={styles.megaCardHeading}>{prog.title}</h3>
                        <p className={styles.megaCardDesc}>{prog.description}</p>
                      </Link>
                    ))}
                  </div>

                  <div className={styles.megaMenuFooter}>
                    <span>Not sure where to start?</span>
                    <Link href="/find" className={styles.megaFooterLink} onClick={() => setExploreOpen(false)}>
                      Browse all K-10 tutors, free 1-on-1 verified
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Schoolhouse-style Direct Nav Links */}
            <Link
              href="/how-it-works"
              className={`${styles.navLink} ${pathname === "/how-it-works" ? styles.navLinkActive : ""}`}
            >
              How It Works
            </Link>

            <Link
              href="/apply"
              className={`${styles.navLink} ${pathname === "/apply" ? styles.navLinkActive : ""}`}
            >
              Become a Tutor
            </Link>

            <Link
              href="/about"
              className={`${styles.navLink} ${pathname === "/about" ? styles.navLinkActive : ""}`}
            >
              About
            </Link>

            <Link
              href="/faq"
              className={`${styles.navLink} ${pathname === "/faq" ? styles.navLinkActive : ""}`}
            >
              FAQ & Support
            </Link>
          </nav>

          {/* Auth Controls */}
          <div className={styles.authControls}>

            {status === "loading" ? (
              <div className={styles.authSkeleton} aria-hidden="true" />
            ) : (
              <>
                <Link href="/signin" className={styles.signInBtn}>
                  Sign In
                </Link>
                <Link href="/signup" className={styles.signUpBtn}>
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Hamburger */}
          <button
            className={styles.hamburger}
            aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            <span className={`${styles.hamburgerLine} ${mobileOpen ? styles.hamburgerLineOpen1 : ""}`} />
            <span className={`${styles.hamburgerLine} ${mobileOpen ? styles.hamburgerLineOpen2 : ""}`} />
            <span className={`${styles.hamburgerLine} ${mobileOpen ? styles.hamburgerLineOpen3 : ""}`} />
          </button>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <>
          <div className={styles.mobileOverlay} onClick={() => setMobileOpen(false)} aria-hidden="true" />
          <div
            id="mobile-menu"
            className={`${styles.mobileMenu} ${styles.mobileMenuOpen}`}
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
          >
        <div className={styles.mobileMenuInner}>
          <div className={styles.mobileBrandRow}>
            <Image src="/images/logo.png" alt="Learnivia" width={32} height={32} />
            <span className={styles.mobileBrandText}>Learnivia</span>
          </div>

          <p className={styles.mobileSection}>Grade Bands (K-10)</p>
          {megaMenuPrograms.map((prog) => (
            <Link 
              key={prog.title} 
              href={prog.href} 
              className={styles.mobileLink}
              onClick={() => setMobileOpen(false)}
            >
              <span>{prog.icon} {prog.title}</span>
              <span className={styles.mobileSubtext}>{prog.description}</span>
            </Link>
          ))}

          <div className={styles.mobileDivider} />

          <p className={styles.mobileSection}>Company &amp; Community</p>
          {mainLinks.map((link) => (
            <Link 
              key={link.href} 
              href={link.href} 
              className={styles.mobileLink}
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}

          <p className={styles.mobileSection}>Get Involved</p>
          {getInvolvedLinks.map((link) => (
            <Link 
              key={link.href} 
              href={link.href} 
              className={styles.mobileLink}
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}

          <div className={styles.mobileDivider} />

          <div style={{ padding: "0.5rem 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--wa-ink)" }}>Appearance</span>
            <button
              type="button"
              onClick={toggleTheme}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.4rem",
                padding: "0.4rem 0.85rem",
                fontSize: "0.8125rem",
                fontWeight: 600,
                borderRadius: "6px",
                border: "1px solid var(--wa-border, #CBD5E1)",
                background: "var(--wa-white, #FFFFFF)",
                color: "var(--wa-ink, #0F172A)",
                cursor: "pointer",
              }}
            >
              {theme === "dark" ? (
                <>
                  <Sun size={14} color="#F59E0B" />
                  <span>Light Mode</span>
                </>
              ) : (
                <>
                  <Moon size={14} color="#2563EB" />
                  <span>Dark Mode</span>
                </>
              )}
            </button>
          </div>

          <div className={styles.mobileAuthRow}>
            <Link href="/signin" className={styles.mobileSignIn} onClick={() => setMobileOpen(false)}>
              Sign in
            </Link>
            <Link href="/signup" className={styles.mobileSignUp} onClick={() => setMobileOpen(false)}>
              Sign up
            </Link>
          </div>
        </div>
      </div>
      </>
      )}
    </>
  );
}

export default Navbar;
