"use client";

import { useSession } from "next-auth/react";
import { SidebarNav } from "./SidebarNav";
import styles from "./AuthShell.module.css";

interface Props {
  children: React.ReactNode;
}

export function AuthShell({ children }: Props) {
  const { data: session } = useSession();

  if (!session) {
    // Pre-login: no sidebar, full width layout
    return <>{children}</>;
  }

  // Post-login: sidebar + offset content
  return (
    <div className={styles.shell}>
      <SidebarNav />
      <div className={styles.content}>
        {children}
      </div>
    </div>
  );
}
