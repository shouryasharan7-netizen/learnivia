import Link from "next/link";
import Image from "next/image";
import styles from "./Footer.module.css";

const footerLinks = {
  learn: {
    label: "Learn",
    links: [
      { href: "/learn", label: "All Programs" },
      { href: "/learn/homework-help", label: "Homework Help" },
      { href: "/learn/math-foundations", label: "Math Foundations" },
      { href: "/learn/exam-prep", label: "Exam Prep" },
      { href: "/find", label: "Find a Tutor" },
    ],
  },
  volunteer: {
    label: "Volunteer",
    links: [
      { href: "/apply", label: "Become a Tutor" },
      { href: "/how-it-works", label: "How It Works" },
      { href: "/stories", label: "Community Stories" },
    ],
  },
  community: {
    label: "Community",
    links: [
      { href: "/about", label: "About Us" },
      { href: "/safety", label: "Safety & Trust" },
      { href: "/parents", label: "For Parents" },
      { href: "/educators", label: "For Educators" },
      { href: "/support", label: "Support & FAQ" },
    ],
  },
  legal: {
    label: "Legal",
    links: [
      { href: "/privacy", label: "Privacy Policy" },
      { href: "/terms", label: "Terms of Service" },
      { href: "/cookies", label: "Cookie Policy" },
    ],
  },
};

export function Footer() {
  return (
    <footer className={styles.footer} role="contentinfo">
      <div className={styles.container}>
        <div className={styles.top}>
          {/* Brand */}
          <div className={styles.brand}>
            <Link href="/" className={styles.logoLink} aria-label="Learnivia Home">
              <Image src="/images/logo.png" alt="" width={40} height={40} />
              <span className={styles.logoText}>Learnivia</span>
            </Link>
            <p className={styles.tagline}>
              Free peer-to-peer tutoring, powered by volunteer students who care about their community.
            </p>
            <Link href="/safety" className={styles.safetyBadge}>
              🛡️ Trust &amp; Safety
            </Link>
          </div>

          {/* Link Groups */}
          {Object.values(footerLinks).map(group => (
            <div key={group.label} className={styles.linkGroup}>
              <h3 className={styles.groupLabel}>{group.label}</h3>
              <ul className={styles.linkList}>
                {group.links.map(link => (
                  <li key={link.href}>
                    <Link href={link.href} className={styles.footerLink}>{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className={styles.bottom}>
          <p className={styles.copyright}>
            © {new Date().getFullYear()} Learnivia. All rights reserved.
          </p>
          <p className={styles.disclaimer}>
            Learnivia is a volunteer-run platform. All tutors are peer volunteers, not certified professionals.{" "}
            <Link href="/safety" className={styles.safetyLink}>Learn about our safety measures →</Link>
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
