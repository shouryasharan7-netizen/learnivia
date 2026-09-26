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

// Routes that should always render the public layout (Navbar only, no workspace shell)
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
  "/apply",
];

// All authenticated workspace route prefixes
const WORKSPACE_PREFIXES = [
  "/dashboard",
  "/tutor",
  "/admin",
  "/sessions",
  "/find",
  "/community",
  "/leaderboard",
  "/homework-help",
  "/onboarding",
  "/learn",
  "/settings",
];

export function AppShell({ children }: AppShellProps) {
  const { data: session } = useSession();
  const pathname = usePathname();

  const isPublicRoute =
    PUBLIC_ONLY_ROUTES.includes(pathname) ||
    pathname.startsWith("/blog/") ||
    pathname.startsWith("/safety/") ||
    pathname.startsWith("/apply") ||
    pathname.startsWith("/resources");

  const isWorkspaceRoute = WORKSPACE_PREFIXES.some((prefix) =>
    pathname.startsWith(prefix)
  );

  // ── PUBLIC LAYOUT ────────────────────────────────────────────────────────
  // Show public Navbar + Footer for:
  //   1. Anyone (logged-in or not) on a public marketing route
  //   2. Unauthenticated users on any route
  if (isPublicRoute || !session?.user) {
    return (
      <div className={styles.publicWrapper}>
        <Navbar />
        <div className={styles.publicContent}>{children}</div>
        <Footer />
      </div>
    );
  }

  // ── AUTHENTICATED WORKSPACE SHELL ────────────────────────────────────────
  const user = session.user;
  const isTutor = Boolean((user as any).isTutor);
  const isAdmin = Boolean((user as any).isAdmin || user.role === "ADMIN");
  const isTrainingCompleted = Boolean((user as any).isTrainingCompleted);

  return (
    <div className={styles.shell}>
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      {/* Desktop Left Sidebar — role-aware navigation */}
      <SidebarNav
        userRole={user.role}
        isTutor={isTutor}
        isAdmin={isAdmin}
        isTrainingCompleted={isTrainingCompleted}
        className={styles.sidebarDesktop}
      />

      {/* Main Content Area */}
      <div className={styles.mainContainer}>
        <TopBar user={user} />
        <main id="main-content" className={styles.content}>
          {children}
        </main>
        <MobileBottomNav 
          userRole={user.role}
          isTutor={isTutor}
          isAdmin={isAdmin}
        />
      </div>
    </div>
  );
}
