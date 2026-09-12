"use client";

import { useSession } from "next-auth/react";
import { SidebarNav } from "./SidebarNav";
import { Footer } from "./Footer";
import styles from "./AuthShell.module.css";

interface Props {
  children: React.ReactNode;
}

export function AuthShell({ children }: Props) {
  const { data: session } = useSession();

  if (!session) {
    // Pre-login: full-width layout with revealing footer
    // .pageContent has position:relative + z-index:1 so footer behind
    // can "reveal" as content scrolls away (sticky footer reveal pattern)
    return (
      <div className={styles.pageWrapper}>
        <div className={styles.pageContent}>
          {children}
        </div>
        <Footer />
      </div>
    );
  }

  // Post-login: sidebar + content, no footer
  return (
    <div className={styles.shell}>
      <SidebarNav />
      <div className={styles.content}>
        {children}
      </div>
    </div>
  );
}
