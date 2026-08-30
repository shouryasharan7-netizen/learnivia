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
    // Pre-login: no sidebar, full width layout with footer
    return (
      <>
        {children}
        <Footer />
      </>
    );
  }

  // Post-login: sidebar + content, no overlapping marketing footer
  return (
    <div className={styles.shell}>
      <SidebarNav />
      <div className={styles.content}>
        {children}
      </div>
    </div>
  );
}
