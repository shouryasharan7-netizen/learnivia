"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import styles from "./Navbar.module.css";

const megaMenuPrograms = [
  {
    title: "Early Elementary (K–Grade 2)",
    description: "Phonics, early math foundations, and reading comprehension for young learners.",
    href: "/find?grade=K-2",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
      </svg>
    ),
    badge: "Ages 5–8",
  },
  {
    title: "Elementary (Grades 3–5)",
    description: "Math, reading & writing, and general science for growing minds.",
    href: "/find?grade=3-5",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
      </svg>
    ),
    badge: "Ages 8–11",
  },
  {
    title: "Middle School (Grades 6–8)",
    description: "Pre-Algebra, English & Language Arts, Earth & Physical Science.",
    href: "/find?grade=6-8",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="4" y1="12" x2="20" y2="12"/><line x1="12" y1="4" x2="12" y2="20"/>
      </svg>
    ),
    badge: "Ages 11–14",
  },
  {
    title: "Early High School (Grades 9–10)",
    description: "Algebra I, Geometry, Biology, Chemistry, and more with 1-on-1 support.",
    href: "/find?grade=9-10",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 3v6l-5 9a2 2 0 0 0 1.7 3h12.6a2 2 0 0 0 1.7-3l-5-9V3"/><line x1="9" y1="3" x2="15" y2="3"/>
      </svg>
    ),
    badge: "Ages 14–16",
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
  { href: "/faq", label: "FAQ" },
];

export function Navbar() {
  const { status } = useSession();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [exploreOpen, setExploreOpen] = useState(false);
  const [involvedOpen, setInvolvedOpen] = useState(false);
  const exploreRef = useRef<HTMLDivElement>(null);
  const involvedRef = useRef<HTMLDivElement>(null);


  // Close dropdowns and popovers on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (exploreRef.current && !exploreRef.current.contains(e.target as Node)) setExploreOpen(false);
      if (involvedRef.current && !involvedRef.current.contains(e.target as Node)) setInvolvedOpen(false);
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
  }

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  // Pre-login High-Fidelity Navbar (Matching Image 1 & 4)
  return (
    <>
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
                <span>explore programs</span>
                <span className={`${styles.chevron} ${exploreOpen ? styles.chevronOpen : ""}`} aria-hidden="true">
                  {exploreOpen ? "▲" : "▼"}
                </span>
              </button>

              {/* Full Featured Mega Menu matching Screenshot 1 */}
              {exploreOpen && (
                <div className={styles.megaMenu} role="dialog" aria-label="Explore programs">
                  <div className={styles.megaMenuHeader}>
                    <h2 className={styles.megaMenuTitle}>Explore programs</h2>
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
                      Browse all K–10 tutors → free, 1-on-1, verified
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Main Links */}
            {mainLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`${styles.navLink} ${pathname === link.href ? styles.navLinkActive : ""}`}
              >
                {link.label}
              </Link>
            ))}

            {/* Get Involved Dropdown */}
            <div className={styles.dropdownWrapper} ref={involvedRef}>
              <button
                className={styles.navBtn}
                aria-expanded={involvedOpen}
                aria-haspopup="true"
                onClick={() => { setInvolvedOpen(!involvedOpen); setExploreOpen(false); }}
              >
                <span>Get involved</span>
                <span className={`${styles.chevron} ${involvedOpen ? styles.chevronOpen : ""}`} aria-hidden="true">
                  {involvedOpen ? "▲" : "▼"}
                </span>
              </button>

              {involvedOpen && (
                <div className={styles.involvedDropdown} role="menu">
                  {getInvolvedLinks.map((link) => (
                    <Link 
                      key={link.href} 
                      href={link.href} 
                      className={styles.dropdownItem} 
                      role="menuitem"
                      onClick={() => setInvolvedOpen(false)}
                    >
                      <div className={styles.dropdownItemTitle}>{link.label}</div>
                      <div className={styles.dropdownItemDesc}>{link.desc}</div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Donate Pill Outline Button */}
            <Link href="/about" className={styles.donateBtn}>
              Donate
            </Link>
          </nav>

          {/* Auth Controls */}
          <div className={styles.authControls}>
            {status === "loading" ? (
              <div className={styles.authSkeleton} aria-hidden="true" />
            ) : (
              <>
                <Link href="/signin" className={styles.signInBtn}>
                  Sign in
                </Link>
                <Link href="/signup" className={styles.signUpBtn}>
                  Sign up
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
          <div className={styles.mobileBrandRow}>
            <Image src="/images/logo.png" alt="Learnivia" width={32} height={32} />
            <span className={styles.mobileBrandText}>Learnivia</span>
          </div>

          <p className={styles.mobileSection}>Grade Bands (K–10)</p>
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
  );
}

export default Navbar;

