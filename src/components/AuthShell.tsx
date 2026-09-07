"use client";

import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { AppChrome } from "./AppChrome";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { Skeleton } from "./ui/Foundation";
import "./ui/app-theme.css";
import styles from "./AuthShell.module.css";

interface Props {
  children: React.ReactNode;
}

export function AuthShell({ children }: Props) {
  const { data: session, status } = useSession();
  const pathname = usePathname();

  if (status === "loading") {
    return <div className={`app-theme ${styles.loading}`}>
      <div className={styles.loadingHeader} role="status" aria-label="Loading navigation">
        <Skeleton width="110px" height="24px" />
        <Skeleton width="96px" height="36px" />
      </div>
      {children}
    </div>;
  }

  if (!session) {
    // Pre-login: no sidebar, full width layout with footer
    return (
      <>
        <Navbar />
        {children}
        <Footer />
      </>
    );
  }

  // Post-login: sidebar + content, no overlapping marketing footer
  return (
    <div className={`app-theme ${styles.shell}`}>
      <AppChrome key={pathname} user={session.user} pathname={pathname} />
      <div id="app-content" tabIndex={-1} className={styles.content} data-wide={pathname.startsWith("/admin")}>
        {children}
      </div>
    </div>
  );
}
