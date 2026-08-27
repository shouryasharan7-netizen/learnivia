"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import styles from "./Navbar.module.css";

const exploreLinks = [
  { href: "/learn", label: "All Programs" },
  { href: "/learn/homework-help", label: "Homework Help" },
  { href: "/learn/math-foundations", label: "Math Foundations" },
  { href: "/learn/science-support", label: "Science Support" },
  { href: "/learn/exam-prep", label: "Exam Prep" },
  { href: "/learn/writing-essays", label: "Writing & Essays" },
  { href: "/learn/study-skills", label: "Study Skills" },
];

const mainLinks = [
  { href: "/about", label: "About" },
  { href: "/stories", label: "Stories" },
  { href: "/safety", label: "Safety" },
];

export function Navbar() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [exploreOpen, setExploreOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const mobileRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setExploreOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
    setExploreOpen(false);
  }, [pathname]);

  // Trap focus in mobile menu when open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <>
      <header className={styles.header} role="banner">
        <div className={styles.container}>
          {/* Logo */}
          <Link href="/" className={styles.logoLink} aria-label="Learnivia Home">
            <Image src="/images/logo.png" alt="" width={36} height={36} priority />
            <span className={styles.logoText}>Learnivia</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className={styles.nav} aria-label="Main navigation">
            {/* Explore Dropdown */}
            <div className={styles.dropdownWrapper} ref={dropdownRef}>
              <button
                className={styles.dropdownTrigger}
                aria-expanded={exploreOpen}
                aria-haspopup="true"
                onClick={() => setExploreOpen(!exploreOpen)}
              >
                Explore Learning
                <svg className={`${styles.chevron} ${exploreOpen ? styles.chevronOpen : ""}`} width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              {exploreOpen && (
                <div className={styles.dropdown} role="menu">
                  {exploreLinks.map(link => (
                    <Link key={link.href} href={link.href} className={styles.dropdownItem} role="menuitem">
                      {link.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {mainLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={`${styles.navLink} ${pathname === link.href ? styles.navLinkActive : ""}`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Auth Controls */}
          <div className={styles.authControls}>
            {status === "loading" ? (
              <div className={styles.authSkeleton} aria-hidden="true" />
            ) : session ? (
              <>
                <Link href="/dashboard" className={styles.navLink}>
                  {session.user?.name?.split(" ")[0] || "Dashboard"}
                </Link>
                <button
                  className={styles.signOutBtn}
                  onClick={() => signOut({ callbackUrl: "/" })}
                >
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link href="/signin" className={styles.signInBtn}>Sign In</Link>
                <Link href="/find" className={styles.ctaBtn}>Find Support</Link>
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
        ref={mobileRef}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
      >
        <div className={styles.mobileMenuInner}>
          <p className={styles.mobileSection}>Explore Learning</p>
          {exploreLinks.map(link => (
            <Link key={link.href} href={link.href} className={styles.mobileLink}>
              {link.label}
            </Link>
          ))}

          <div className={styles.mobileDivider} />

          {mainLinks.map(link => (
            <Link key={link.href} href={link.href} className={styles.mobileLink}>
              {link.label}
            </Link>
          ))}

          <div className={styles.mobileDivider} />

          {session ? (
            <>
              <Link href="/dashboard" className={styles.mobileLink}>My Dashboard</Link>
              <Link href="/apply" className={styles.mobileLink}>Become a Tutor</Link>
              <button
                className={styles.mobileSignOut}
                onClick={() => signOut({ callbackUrl: "/" })}
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link href="/signin" className={styles.mobileLink}>Sign In</Link>
              <Link href="/find" className={styles.mobileCta}>Find Support</Link>
              <Link href="/apply" className={styles.mobileCta2}>Become a Volunteer Tutor</Link>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default Navbar;
