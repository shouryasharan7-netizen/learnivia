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

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (exploreRef.current && !exploreRef.current.contains(e.target as Node)) setExploreOpen(false);
      if (involvedRef.current && !involvedRef.current.contains(e.target as Node)) setInvolvedOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setExploreOpen(false);
    setInvolvedOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  // If logged in, render the compact top bar for the authenticated shell
  // (the left SidebarNav will be rendered separately in layout for authenticated users)
  if (session) {
    return (
      <header className={styles.authHeader} role="banner">
        <div className={styles.authContainer}>
          {/* Left: Logo (small) */}
          <Link href="/" className={styles.authLogo} aria-label="Learnivia Home">
            <Image src="/images/logo.png" alt="Learnivia" width={28} height={28} priority />
          </Link>

          {/* Spacer */}
          <div className={styles.authSpacer} />

          {/* Right: action icons */}
          <div className={styles.authActions}>
            {/* Chat icon with badge */}
            <button className={styles.iconBtn} aria-label="Messages (2 new)">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
              </svg>
              <span className={styles.badge} aria-hidden="true">2</span>
            </button>

            {/* Bell with badge */}
            <button className={styles.iconBtn} aria-label="Notifications (5 new)">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0"/>
              </svg>
              <span className={styles.badge} aria-hidden="true">5</span>
            </button>

            {/* Calendar */}
            <button className={styles.iconBtn} aria-label="Calendar">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
            </button>

            {/* User avatar capsule */}
            <div className={styles.userCapsule}>
              <div className={styles.userAvatar} aria-hidden="true">
                {session.user?.name
                  ? session.user.name.split(" ").map(n => n[0]).slice(0, 2).join("").toUpperCase()
                  : "U"}
              </div>
              <span className={styles.userName}>{session.user?.name?.split(" ")[0] || "User"}</span>
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
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
