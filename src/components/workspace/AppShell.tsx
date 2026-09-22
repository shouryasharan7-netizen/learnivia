"use client";

import React from "react";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { SidebarNav } from "./SidebarNav";
import { TopBar } from "./TopBar";
import { MobileBottomNav } from "./MobileBottomNav";
import { Navbar } from "@/components/Navbar";
import { TopBar as TopBarPublic } from "@/components/TopBar";
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

  const isWorkspaceRoute =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/tutor") ||
    pathname.startsWith("/admin");

  const isPublicRoute = PUBLIC_ONLY_ROUTES.includes(pathname) || pathname.startsWith("/blog/");

  // Authenticated workspace routes (Learner, Tutor, or Administrator):
  // ALWAYS keep within the workspace shell layout; never flash the public marketing header/footer.
  if (isWorkspaceRoute) {
    if (session?.user) {
      const user = session.user;
      const isTutor = Boolean(user.isTutor);
      const isAdmin = Boolean(user.isAdmin);
      const isTrainingCompleted = Boolean(user.isTrainingCompleted);

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
            isTrainingCompleted={isTrainingCompleted}
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

    // While session is hydrating on a workspace route, maintain workspace frame layout
    return (
      <div className={styles.shell} style={{ minHeight: "100vh", background: "var(--wa-paper)" }}>
        <div className={styles.mainContainer}>
          <main id="main-content" className={styles.content}>
            {children}
          </main>
        </div>
      </div>
    );
  }

  if (!session?.user || isPublicRoute) {
    return (
      <div className={styles.publicWrapper}>
        <TopBarPublic />
        <Navbar />
        <div className={styles.publicContent}>
          {children}
        </div>
        <Footer />
      </div>
    );
  }

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
