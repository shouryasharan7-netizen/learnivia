"use client";

import React from "react";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { SidebarNav } from "./SidebarNav";
import { TopBar } from "./TopBar";
import { MobileBottomNav } from "./MobileBottomNav";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import styles from "./AppShell.module.css";

interface AppShellProps {
  children: React.ReactNode;
}

// Routes that should always render the public layout even if a session is present
const PUBLIC_ONLY_ROUTES = [
  "/",
  "/about",
  "/how-it-works",
  "/parents",
  "/educators",
  "/safety",
  "/faq",
  "/support",
  "/blog",
  "/stories",
  "/terms",
  "/privacy",
  "/cookies",
  "/signin",
  "/signup",
  "/forgot-password",
  "/reset-password",
  "/verify-email",
];

export function AppShell({ children }: AppShellProps) {
  const { data: session } = useSession();
  const pathname = usePathname();

  const isPublicRoute = PUBLIC_ONLY_ROUTES.includes(pathname) || pathname.startsWith("/blog/");

  // If user is not logged in OR is visiting a public marketing/trust/auth page:
  // Render the calm public header + footer layout.
  if (!session?.user || isPublicRoute) {
    return (
      <div className={styles.publicWrapper}>
        <Navbar />
        <div className={styles.publicContent}>
          {children}
        </div>
        <Footer />
      </div>
    );
  }

  // Authenticated workspace view (Learner, Tutor, or Administrator):
  // Clean single shell: Left sidebar + Top bar + Main content + Mobile bottom nav.
  const user = session.user;
  const isTutor = Boolean((user as any).isTutor || user.role === "TUTOR" || user.role === "ADMIN");
  const isAdmin = Boolean((user as any).isAdmin || user.role === "ADMIN");

  return (
    <div className={styles.shell}>
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      {/* Desktop Left Sidebar with workspace navigation */}
      <SidebarNav
        userRole={user.role}
        isTutor={isTutor}
        isAdmin={isAdmin}
        className={styles.sidebarDesktop}
      />

      {/* Main Content Area */}
      <div className={styles.mainContainer}>
        <TopBar user={user} />
        <main id="main-content" className={styles.content}>
          {children}
        </main>
        <MobileBottomNav />
      </div>
    </div>
  );
}
