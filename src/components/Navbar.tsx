"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import styles from "./Navbar.module.css";

const exploreProgramsLinks = [
  { href: "/learn", label: "All Programs" },
  { href: "/learn/homework-help", label: "Homework Help" },
  { href: "/learn/math-foundations", label: "Math Foundations" },
  { href: "/learn/science-support", label: "Science Support" },
  { href: "/learn/exam-prep", label: "Exam Prep (SAT / GCSE)" },
  { href: "/learn/writing-essays", label: "Writing & Essays" },
  { href: "/learn/study-skills", label: "Study Skills" },
];

const getInvolvedLinks = [
  { href: "/apply", label: "Become a Volunteer Tutor" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/parents", label: "For Parents" },
  { href: "/educators", label: "For Educators" },
];

const mainLinks = [
  { href: "/about", label: "About" },
  { href: "/about#faq", label: "FAQ" },
  { href: "/stories", label: "Stories" },
];

export function Navbar() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [exploreOpen, setExploreOpen] = useState(false);
  const [involvedOpen, setInvolvedOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const exploreRef = useRef<HTMLDivElement>(null);
  const involvedRef = useRef<HTMLDivElement>(null);

  const [activePopover, setActivePopover] = useState<"messages" | "notifications" | "calendar" | "user" | null>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    setMobileOpen(false);
    setExploreOpen(false);
    setInvolvedOpen(false);
    setActivePopover(null);
  }, [pathname]);

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
    // @ts-ignore
    const userRole = session.user?.role || "STUDENT";

    return (
      <header className={styles.authHeader} role="banner">
        <div className={styles.authContainer}>
          {/* Left: Logo */}
          <Link href="/dashboard" className={styles.authLogo} aria-label="Learnivia Home">
            <Image src="/images/logo.png" alt="Learnivia" width={28} height={28} priority />
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
                    <div className={styles.popoverEmptyIcon} aria-hidden="true">💬</div>
                    <p className={styles.popoverEmptyTitle}>No new messages</p>
                    <p className={styles.popoverEmptyText}>
                      When you connect with tutors or attend group sessions, direct conversations will appear here.
                    </p>
                  </div>
                  <Link href="/sessions" className={styles.popoverFooterLink} onClick={() => setActivePopover(null)}>
                    Browse Sessions & Tutors →
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
                    <div className={styles.popoverEmptyIcon} aria-hidden="true">🔔</div>
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
                    <div className={styles.popoverEmptyIcon} aria-hidden="true">📅</div>
                    <p className={styles.popoverEmptyTitle}>No sessions scheduled today</p>
                    <p className={styles.popoverEmptyText}>
                      Check your upcoming bookings or register for a live study session.
                    </p>
                  </div>
                  <Link href="/dashboard" className={styles.popoverFooterLink} onClick={() => setActivePopover(null)}>
                    Go to Full Calendar & Sessions →
                  </Link>
                </div>
              )}
            </div>

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
                      🏠 My Dashboard
                    </Link>
                    <Link href="/sessions" className={styles.userMenuItem} role="menuitem" onClick={() => setActivePopover(null)}>
                      🔍 Find a Session
                    </Link>
                    <Link href="/tutor" className={styles.userMenuItem} role="menuitem" onClick={() => setActivePopover(null)}>
                      💻 Tutor Dashboard
                    </Link>
                    <Link href="/tutor/transcript" className={styles.userMenuItem} role="menuitem" onClick={() => setActivePopover(null)}>
                      📜 Volunteer Transcript
                    </Link>
                    <Link href="/resources" className={styles.userMenuItem} role="menuitem" onClick={() => setActivePopover(null)}>
                      📖 Tutoring Resources
                    </Link>
                    {userRole === "ADMIN" && (
                      <Link href="/admin/sessions" className={styles.userMenuItem} role="menuitem" onClick={() => setActivePopover(null)} style={{ color: "#0E8345", fontWeight: 600 }}>
                        🛡️ Admin Center
                      </Link>
                    )}

                    <div className={styles.userMenuDivider} />

                    <button
                      className={styles.signOutMenuItem}
                      role="menuitem"
                      onClick={() => signOut({ callbackUrl: "/" })}
                    >
                      🚪 Sign Out
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

  // Pre-login Schoolhouse-style dark navbar
  return (
    <>
      <header className={styles.header} role="banner">
        <div className={styles.container}>
          {/* Logo */}
          <Link href="/" className={styles.logoLink} aria-label="Learnivia Home">
            <Image src="/images/logo.png" alt="" width={32} height={32} priority className={styles.logoImg} />
            <span className={styles.logoText}>learnivia</span>
          </Link>

          {/* Desktop Nav */}
          <nav className={styles.nav} aria-label="Main navigation">
            {/* Explore Programs dropdown */}
            <div className={styles.dropdownWrapper} ref={exploreRef}>
              <button
                className={styles.navBtn}
                aria-expanded={exploreOpen}
                aria-haspopup="true"
                onClick={() => { setExploreOpen(!exploreOpen); setInvolvedOpen(false); }}
              >
                Explore Programs
                <svg className={`${styles.chevron} ${exploreOpen ? styles.chevronOpen : ""}`} width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              {exploreOpen && (
                <div className={styles.dropdown} role="menu">
                  {exploreProgramsLinks.map(link => (
                    <Link key={link.href} href={link.href} className={styles.dropdownItem} role="menuitem">
                      {link.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Main links */}
            {mainLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={`${styles.navLink} ${pathname === link.href ? styles.navLinkActive : ""}`}
              >
                {link.label}
              </Link>
            ))}

            {/* Get Involved dropdown */}
            <div className={styles.dropdownWrapper} ref={involvedRef}>
              <button
                className={styles.navBtn}
                aria-expanded={involvedOpen}
                aria-haspopup="true"
                onClick={() => { setInvolvedOpen(!involvedOpen); setExploreOpen(false); }}
              >
                Get Involved
                <svg className={`${styles.chevron} ${involvedOpen ? styles.chevronOpen : ""}`} width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              {involvedOpen && (
                <div className={styles.dropdown} role="menu">
                  {getInvolvedLinks.map(link => (
                    <Link key={link.href} href={link.href} className={styles.dropdownItem} role="menuitem">
                      {link.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Donate button */}
            <Link href="/donate" className={styles.donateBtn}>Donate</Link>
          </nav>

          {/* Auth Controls */}
          <div className={styles.authControls}>
            {status === "loading" ? (
              <div className={styles.authSkeleton} aria-hidden="true" />
            ) : (
              <>
                <Link href="/signin" className={styles.signInBtn}>Sign In</Link>
                <Link href="/signup" className={styles.signUpBtn}>Sign Up</Link>
                {/* Dark mode toggle */}
                <button
                  className={styles.darkToggle}
                  aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
                  onClick={() => setDarkMode(!darkMode)}
                >
                  {darkMode ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <circle cx="12" cy="12" r="5"/>
                      <line x1="12" y1="1" x2="12" y2="3"/>
                      <line x1="12" y1="21" x2="12" y2="23"/>
                      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
                      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                      <line x1="1" y1="12" x2="3" y2="12"/>
                      <line x1="21" y1="12" x2="23" y2="12"/>
                      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
                      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
                    </svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
                    </svg>
                  )}
                </button>
              </>
            )}
          </div>

          {/* Mobile Hamburger */}
          <button
            className={styles.hamburger}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
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
        <div className={styles.mobileOverlay} onClick={() => setMobileOpen(false)} aria-hidden="true" />
      )}
      <div
        id="mobile-menu"
        className={`${styles.mobileMenu} ${mobileOpen ? styles.mobileMenuOpen : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
      >
        <div className={styles.mobileMenuInner}>
          <p className={styles.mobileSection}>Explore Programs</p>
          {exploreProgramsLinks.map(link => (
            <Link key={link.href} href={link.href} className={styles.mobileLink}>{link.label}</Link>
          ))}

          <div className={styles.mobileDivider} />

          {mainLinks.map(link => (
            <Link key={link.href} href={link.href} className={styles.mobileLink}>{link.label}</Link>
          ))}

          <p className={styles.mobileSection}>Get Involved</p>
          {getInvolvedLinks.map(link => (
            <Link key={link.href} href={link.href} className={styles.mobileLink}>{link.label}</Link>
          ))}

          <div className={styles.mobileDivider} />

          <Link href="/signin" className={styles.mobileLink}>Sign In</Link>
          <Link href="/signup" className={styles.mobileCta}>Sign Up — It's Free</Link>
          <Link href="/donate" className={styles.mobileCta2}>Donate</Link>
        </div>
      </div>
    </>
  );
}

export default Navbar;
