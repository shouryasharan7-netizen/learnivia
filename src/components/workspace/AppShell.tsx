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
  initialSession?: any;
}

// Routes that should always render the public layout (Navbar only, no workspace shell)
const PUBLIC_ONLY_ROUTES = [
  "/",
  "/about",
  "/how-it-works",
  "/parents",
  "/educators",
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
  "/messages",
  "/calendar",
];

export function AppShell({ children, initialSession }: AppShellProps) {
  const { data: session } = useSession();
  const currentSession = session !== undefined ? session : initialSession;
  const pathname = usePathname();

  const isWorkspaceRoute = WORKSPACE_PREFIXES.some((prefix) =>
    pathname.startsWith(prefix),
  );

  // If this is a workspace route, NEVER render public marketing Navbar / Footer
  if (isWorkspaceRoute) {
    const user = currentSession?.user;
    if (!user) {
      // While session is hydrating, retain the workspace shell container so the page
      // content renders without flashing public marketing headers or footers
      return (
        <div className={styles.shell}>
          <div className={styles.mainContainer}>
            <main id="main-content" className={styles.content}>
              {children}
            </main>
          </div>
        </div>
      );
    }

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
            isTrainingCompleted={isTrainingCompleted}
          />
        </div>
      </div>
    );
  }

  // Public marketing layout for public routes or unauthenticated visitors
  return (
    <div className={styles.publicWrapper}>
      <Navbar />
      <div className={styles.publicContent}>{children}</div>
      <Footer />
    </div>
  );
}
