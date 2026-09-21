import Link from "next/link";
import Image from "next/image";
import styles from "./Footer.module.css";

const FOOTER_LINKS = [
  {
    heading: "Platform",
    links: [
      { href: "/sessions", label: "Find a Session" },
      { href: "/find", label: "Browse Tutors" },
      { href: "/homework-help", label: "Homework Help" },
      { href: "/community", label: "Community" },
      { href: "/apply", label: "Volunteer as Tutor" },
    ],
  },
  {
    heading: "Company",
    links: [
      { href: "/how-it-works", label: "How It Works" },
      { href: "/stories", label: "Stories & Blog" },
      { href: "/safety", label: "Safety" },
      { href: "/parents", label: "For Parents" },
      { href: "/educators", label: "For Educators" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { href: "/terms", label: "Terms of Service" },
      { href: "/privacy", label: "Privacy Policy" },
      { href: "/cookies", label: "Cookie Policy" },
    ],
  },
];

export function Footer() {
  return (
    <footer className={styles.footerReveal} role="contentinfo">
      <div className={styles.footerInner}>
        <div className={styles.container}>
          <div className={styles.grid}>
            {/* Brand column */}
            <div className={styles.brand}>
              <Link href="/" className={styles.logoLink} aria-label="Learnivia Home">
                <div className={styles.brandRow}>
                  <Image
                    src="/images/logo.png"
                    alt="Learnivia Fox Mascot"
                    width={34}
                    height={34}
                    style={{ display: "block" }}
                    unoptimized
                  />
                  <span className={styles.brandName}>Learnivia</span>
                </div>
              </Link>
              <p className={styles.tagline}>
                Free 1-on-1 peer tutoring for K-10 students, delivered by verified volunteer tutors on Zoom.
              </p>
              <div className={styles.missionPill}>
                <span className={styles.missionDot} />
                100% free · No subscriptions · No paywalls
              </div>
              <div className={styles.socialRow}>
                <a href="https://twitter.com" className={styles.socialLink} aria-label="X (Twitter)" target="_blank" rel="noopener noreferrer">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>
                <a href="https://instagram.com" className={styles.socialLink} aria-label="Instagram" target="_blank" rel="noopener noreferrer">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                    <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                  </svg>
                </a>
                <a href="https://linkedin.com" className={styles.socialLink} aria-label="LinkedIn" target="_blank" rel="noopener noreferrer">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/>
                    <circle cx="4" cy="4" r="2"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Link columns */}
            {FOOTER_LINKS.map((col) => (
              <div key={col.heading} className={styles.col}>
                <h3 className={styles.colHeading}>{col.heading}</h3>
                <ul className={styles.linkList}>
                  {col.links.map((l) => (
                    <li key={l.href}>
                      <Link href={l.href} className={styles.footerLink}>{l.label}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className={styles.bottom}>
            <p className={styles.copy}>
              © {new Date().getFullYear()} Learnivia. All rights reserved.
            </p>
            <p className={styles.disclaimer}>
              A free volunteer peer-tutoring platform. Not affiliated with any academic institution.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
