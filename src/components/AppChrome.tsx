"use client";

import { useEffect, useId, useRef, useState, type MouseEvent, type ReactNode } from "react";
import type { Session } from "next-auth";
import { signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { SidebarNav } from "./SidebarNav";
import { AppIcon, type AppIconName } from "./ui/AppIcon";
import { ButtonLink } from "./ui/Foundation";
import { LiviState } from "./ui/LiviState";
import styles from "./AppChrome.module.css";

type Panel = "messages" | "notifications" | "schedule" | "profile";

export function AppChrome({ user, pathname }: { user: Session["user"]; pathname: string }) {
  const [panel, setPanel] = useState<Panel | null>(null);
  const panelRef = useRef<HTMLElement>(null);
  const trigger = useRef<HTMLButtonElement | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const panelId = useId();
  const role = user?.role || "STUDENT";
  const isTutor = role === "TUTOR" || role === "ADMIN";
  // Navigation visibility only. Existing server-side authorization remains authoritative.
  const isAdmin = role === "ADMIN" || ["shouryasharan7@gmail.com", "ahmedashfaqfarooqui@gmail.com"].includes(user?.email?.trim().toLowerCase() || "");
  const initials = (user?.name || "Learner").split(" ").filter(Boolean).slice(0, 2).map(word => word[0]).join("").toUpperCase();

  useEffect(() => {
    if (!panel) return;
    closeRef.current?.focus();
    function outside(event: PointerEvent) {
      if (!panelRef.current?.contains(event.target as Node) && !trigger.current?.contains(event.target as Node)) setPanel(null);
    }
    function escape(event: KeyboardEvent) {
      if (event.key === "Escape") { setPanel(null); trigger.current?.focus(); }
    }
    document.addEventListener("pointerdown", outside);
    document.addEventListener("keydown", escape);
    return () => { document.removeEventListener("pointerdown", outside); document.removeEventListener("keydown", escape); };
  }, [panel]);

  function toggle(next: Panel, event: MouseEvent<HTMLButtonElement>) {
    trigger.current = event.currentTarget;
    setPanel(current => current === next ? null : next);
  }
  function close() { setPanel(null); trigger.current?.focus(); }
  function navLink(href: string, label: string, icon: AppIconName, mobileLabel?: string) {
    const active = pathname === href || (href !== "/tutor" && pathname.startsWith(`${href}/`));
    return <Link href={href} className={styles.navItem} aria-label={label} aria-current={active ? "page" : undefined}>
      <AppIcon name={icon} /><span className={styles.tooltip}>{label}</span><span className={styles.mobileLabel}>{mobileLabel || label}</span>
    </Link>;
  }
  function panelButton(target: Panel, label: string, icon: AppIconName, mobileLabel?: string) {
    return <button type="button" className={styles.navItem} aria-label={label} aria-expanded={panel === target} aria-controls={panel === target ? panelId : undefined} onClick={event => toggle(target, event)}>
      <AppIcon name={icon} /><span className={styles.tooltip}>{label}</span><span className={styles.mobileLabel}>{mobileLabel || label}</span>
    </button>;
  }
  const panelTitles = { messages: "Messages", notifications: "Notifications", schedule: "My schedule", profile: "Your account" };
  let panelContent: ReactNode;
  if (panel === "messages") panelContent = <LiviState compact title="Messaging is not available yet" description="For now, find a tutor and book a session through their profile." action={<ButtonLink href="/find">Find a tutor</ButtonLink>} />;
  else if (panel === "notifications") panelContent = <div className={styles.panelBody}><p>Session details and booking updates are available on your dashboard. A notification inbox is not available yet.</p><ButtonLink href="/dashboard" variant="secondary">View dashboard</ButtonLink></div>;
  else if (panel === "schedule") panelContent = <div className={styles.panelBody}><p>Your upcoming and past bookings are currently listed on your dashboard.</p><ButtonLink href="/dashboard">View my sessions</ButtonLink>{isTutor && <ButtonLink href="/tutor" variant="secondary">View tutoring schedule</ButtonLink>}</div>;
  else panelContent = <div className={styles.account}>
    <div className={styles.identity}><span className={styles.avatar}>{initials}</span><div><strong>{user?.name || "Learner"}</strong><p>{role === "ADMIN" ? "Administrator" : role === "TUTOR" ? "Tutor account" : "Learner account"}</p></div></div>
    <nav aria-label="Account and more">
      <Link href="/dashboard">My dashboard</Link>
      <Link href="/find">Find tutors</Link>
      <Link href="/community">Community</Link>
      <Link href="/sessions">Group sessions</Link>
      <Link href="/learn">Programs</Link>
      <Link href="/homework-help">Homework help</Link>
      <Link href="/resources">Learning resources</Link>
      {isTutor ? <><Link href="/tutor">My tutoring</Link><Link href="/tutor/training">Tutor training</Link><Link href="/tutor/transcript">Volunteer hours</Link></> : <Link href="/apply">Become a volunteer tutor</Link>}
      {isAdmin && <Link href="/admin">Admin tools</Link>}
      <Link href="/safety">Safety and support</Link>
    </nav>
    <button type="button" className={styles.signOut} onClick={() => signOut({ callbackUrl: "/" })}>Sign out</button>
  </div>;

  return <>
    <a href="#app-content" className={styles.skip}>Skip to content</a>
    <header className={styles.header}>
      <Link href="/dashboard" className={styles.brand} aria-label="Learnivia home"><Image src="/images/logo.png" alt="" width={32} height={32} /><span>Learnivia</span></Link>
      <div className={styles.utilities}>
        <div className={styles.desktopUtility}>{panelButton("messages", "Messages", "messages")}</div>
        {panelButton("notifications", "Notifications", "bell")}
        <div className={styles.desktopUtility}>{panelButton("schedule", "My schedule", "calendar")}</div>
        <button type="button" className={styles.profileButton} aria-label="Open account menu" aria-expanded={panel === "profile"} aria-controls={panel === "profile" ? panelId : undefined} onClick={event => toggle("profile", event)}><span className={styles.avatar}>{initials}</span><AppIcon name="chevron" /></button>
      </div>
    </header>
    <SidebarNav>
      {navLink("/dashboard", "Home", "home")}
      {navLink("/find", "Find tutors", "search")}
      {panelButton("schedule", "My schedule", "calendar")}
      {panelButton("messages", "Messages", "messages")}
      {navLink("/community", "Community", "community")}
      {isTutor && <div className={styles.railExtras}>{navLink("/tutor", "My tutoring", "tutor")}{navLink("/tutor/transcript", "Volunteer hours", "hours")}</div>}
      {isAdmin && navLink("/admin", "Admin tools", "admin")}
    </SidebarNav>
    <nav className={styles.mobileNav} aria-label="Mobile navigation">
      {navLink("/dashboard", "Home", "home")}
      {navLink("/find", "Find tutors", "search", "Find")}
      {panelButton("schedule", "My schedule", "calendar", "Schedule")}
      {panelButton("messages", "Messages", "messages")}
      {panelButton("profile", "Your account", "profile", "Profile")}
    </nav>
    {panel && <section ref={panelRef} id={panelId} role="dialog" aria-labelledby={`${panelId}-title`} className={styles.panel}>
      <div className={styles.panelHeader}><h2 id={`${panelId}-title`}>{panelTitles[panel]}</h2><button ref={closeRef} type="button" className={styles.close} aria-label="Close panel" onClick={close}><AppIcon name="close" /></button></div>
      {panelContent}
    </section>}
  </>;
}
