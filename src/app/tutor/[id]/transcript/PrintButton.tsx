"use client";

import styles from "./page.module.css";
import { Printer } from "lucide-react";

export default function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className={styles.printBtn}
      aria-label="Print or Save PDF"
      style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem" }}
    >
      <Printer size={15} aria-hidden="true" />
      <span>Print / Save as PDF Certificate</span>
    </button>
  );
}
