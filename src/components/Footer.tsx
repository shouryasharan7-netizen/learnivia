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
