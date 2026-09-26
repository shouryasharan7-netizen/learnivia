import { useState } from "react";
import Link from "next/link";
import { X } from "lucide-react";
import styles from "./NoticeBanner.module.css";

export function NoticeBanner() {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;

  return (
    <div className={styles.banner} role="banner" aria-label="Announcement">
      <p className={styles.text}>
        Free 1-on-1 peer tutoring for Kindergarten through Grade 10, book your
        session today!{" "}
        <Link href="/find" className={styles.link}>
          Find a Tutor
        </Link>
      </p>
      <button
        className={styles.close}
        onClick={() => setDismissed(true)}
        aria-label="Dismiss announcement"
      >
        <X size={14} />
      </button>
    </div>
  );
}
