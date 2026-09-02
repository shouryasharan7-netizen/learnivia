import Link from "next/link";
import Image from "next/image";
import styles from "./Footer.module.css";

const FOOTER_LINKS = [
  {
    heading: "Platform",
    links: [
      { href: "/sessions", label: "Find a Session" },
      { href: "/learn", label: "Programs" },
      { href: "/homework-help", label: "Homework Help" },
      { href: "/community", label: "Community" },
      { href: "/apply", label: "Volunteer as Tutor" },
    ],
  },
  {
    heading: "Company",
    links: [
      { href: "/about", label: "About" },
      { href: "/stories", label: "Stories & Blog" },
      { href: "/about#faq", label: "FAQ" },
      { href: "/safety", label: "Safety" },
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
    <footer className={styles.footer} role="contentinfo">
      <div className={styles.container}>
        <div className={styles.grid}>
          {/* Brand column */}
          <div className={styles.brand}>
            <Link href="/" className={styles.logoLink} aria-label="Learnivia Home">
              <Image src="/images/logo.png" alt="" width={32} height={32} />
              <span className={styles.logoText}>learnivia</span>
            </Link>
            <p className={styles.tagline}>
              Free peer-to-peer tutoring for everyone, everywhere.
            </p>
            <div className={styles.socialRow}>
              <a href="https://twitter.com" className={styles.socialLink} aria-label="Twitter" target="_blank" rel="noopener noreferrer">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <a href="https://instagram.com" className={styles.socialLink} aria-label="Instagram" target="_blank" rel="noopener noreferrer">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
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
            Learnivia is a free volunteer peer-tutoring platform. Not affiliated with any academic institution.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
