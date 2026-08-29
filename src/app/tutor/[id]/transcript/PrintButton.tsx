"use client";

import styles from "./page.module.css";

export default function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className={styles.printBtn}
      aria-label="Print or Save PDF"
    >
      🖨️ Print / Save as PDF Certificate
    </button>
  );
}
