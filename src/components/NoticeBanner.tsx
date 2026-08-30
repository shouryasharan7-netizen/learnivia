"use client";
import { useState } from "react";
import Link from "next/link";
import styles from "./NoticeBanner.module.css";

export function NoticeBanner() {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;

  return (
    <div className={styles.banner} role="banner" aria-label="Announcement">
      <p className={styles.text}>
        Register for the October SAT Bootcamp before spots fill up!{" "}
        <Link href="/learn" className={styles.link}>Register Now</Link>
      </p>
      <button
        className={styles.close}
        onClick={() => setDismissed(true)}
        aria-label="Dismiss announcement"
      >
        ✕
      </button>
    </div>
  );
}
