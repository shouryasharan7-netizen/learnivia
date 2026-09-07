import type { ReactNode } from "react";
import styles from "./SidebarNav.module.css";

/** Floating desktop rail. Navigation destinations are shared with AppChrome. */
export function SidebarNav({ children }: { children: ReactNode }) {
  return <nav className={styles.rail} aria-label="Main navigation">{children}</nav>;
}
