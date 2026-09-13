import React from "react";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth-user";
import { redirect } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import styles from "./page.module.css";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { ROUTES } from "@/lib/routes";
import {
  Users,
  GraduationCap,
  ClipboardList,
  ShieldAlert,
  Handshake,
  BookOpen,
  MessageSquare,
  HelpCircle,
  ShieldCheck,
  ArrowRight,
  Radio,
  Clock,
  AlertTriangle,
  UserCheck,
} from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin Command Center — Learnivia",
  description: "Platform health monitoring, safeguarding incident triage, and administrative controls.",
};

export default async function AdminOverviewPage() {
  const user = await getCurrentUser();
  if (!user || !user.isAdmin) {
    redirect(ROUTES.learner.home);
  }

  let totalUsers = 0;
  let totalTutors = 0;
  let pendingApplications = 0;
  let totalBookings = 0;
  let totalWorkshops = 0;
  let openReports = 0;
  let totalCommunityMessages = 0;
  let totalHomeworkRequests = 0;
  let recentUsers: any[] = [];
  let recentBookings: any[] = [];

  try {
    const results = await Promise.all([
      prisma.user.count(),
      prisma.tutorProfile.count({ where: { status: "APPROVED" } }),
      prisma.tutorProfile.count({ where: { status: "PENDING" } }),
      prisma.booking.count(),
      prisma.workshop.count(),
      prisma.incidentReport.count({ where: { status: "PENDING" } }),
      prisma.communityMessage.count(),
      prisma.homeworkRequest.count(),
      prisma.user.findMany({
        orderBy: { id: "desc" },
        take: 5,
        select: { id: true, name: true, email: true, role: true },
      }),
      prisma.booking.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
        include: {
          student: { select: { name: true, email: true } },
          tutor: { include: { user: { select: { name: true } } } },
        },
      }),
    ]);
    totalUsers = results[0];
    totalTutors = results[1];
    pendingApplications = results[2];
    totalBookings = results[3];
    totalWorkshops = results[4];
    openReports = results[5];
    totalCommunityMessages = results[6];
    totalHomeworkRequests = results[7];
    recentUsers = results[8];
    recentBookings = results[9];
  } catch (err) {
    console.warn("Admin dashboard data fetch fallback:", err);
  }

  const cards = [
    {
      label: "Registered Users",
      count: totalUsers,
      Icon: Users,
      href: ROUTES.admin.users,
      iconBg: "var(--wa-cream-mid)",
      iconColor: "var(--wa-text)",
    },
    {
      label: "Approved Tutors",
      count: totalTutors,
      Icon: GraduationCap,
      href: ROUTES.admin.tutors,
      iconBg: "var(--wa-green-light)",
      iconColor: "var(--wa-green)",
    },
    {
      label: "Pending Applications",
      count: pendingApplications,
      Icon: ClipboardList,
      href: ROUTES.admin.applications,
      iconBg: pendingApplications > 0 ? "#FEF3C7" : "var(--wa-cream-mid)",
      iconColor: pendingApplications > 0 ? "#B45309" : "var(--wa-muted)",
      highlight: pendingApplications > 0,
    },
    {
      label: "Open Safety Reports",
      count: openReports,
      Icon: ShieldAlert,
      href: ROUTES.admin.reports,
      iconBg: openReports > 0 ? "#FEE2E2" : "var(--wa-cream-mid)",
      iconColor: openReports > 0 ? "#DC2626" : "var(--wa-muted)",
      critical: openReports > 0,
    },
    {
      label: "1-on-1 Sessions",
      count: totalBookings,
      Icon: Handshake,
      href: ROUTES.admin.sessions,
      iconBg: "var(--wa-cream-mid)",
      iconColor: "var(--wa-text)",
    },
    {
      label: "Group Workshops",
      count: totalWorkshops,
      Icon: BookOpen,
      href: ROUTES.admin.sessions,
      iconBg: "var(--wa-cream-mid)",
      iconColor: "var(--wa-text)",
    },
    {
      label: "Community Messages",
      count: totalCommunityMessages,
      Icon: MessageSquare,
      href: ROUTES.admin.moderation,
      iconBg: "var(--wa-cream-mid)",
      iconColor: "var(--wa-text)",
    },
    {
      label: "Homework Inquiries",
      count: totalHomeworkRequests,
      Icon: HelpCircle,
      href: ROUTES.admin.moderation,
      iconBg: "var(--wa-cream-mid)",
      iconColor: "var(--wa-text)",
    },
  ];

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        {/* Command Header */}
        <header className={styles.headerRow}>
          <div className={styles.headerTitleCol}>
            <div className={styles.badgeRow}>
              <span className={styles.liveBadge}>
                <ShieldCheck size={13} aria-hidden="true" />
                Live Oversight
              </span>
            </div>
            <h1 className={styles.title}>System Command &amp; Oversight</h1>
            <p className={styles.subtitle}>
              Master administrative control over learner accounts, volunteer tutor vetting, session activity, community moderation, and child safeguarding.
            </p>
          </div>

          <div className={styles.headerActions}>
            <Link href={ROUTES.admin.moderation} className={styles.secondaryBtn}>
              <Radio size={15} aria-hidden="true" />
              <span>Broadcast Notice</span>
            </Link>
            <Link href={ROUTES.admin.users} className={styles.primaryBtn}>
              <span>Manage Users</span>
              <ArrowRight size={14} aria-hidden="true" />
            </Link>
          </div>
        </header>

        {/* Operational Triage Alerts */}
        {openReports > 0 && (
          <div className={styles.triageBannerCritical} role="alert">
            <div className={styles.triageBannerLeft}>
              <div className={styles.triageIconRed}>
                <ShieldAlert size={18} aria-hidden="true" />
              </div>
              <div className={styles.triageTextRed}>
                <strong>Child Safeguarding Alert ({openReports} open report{openReports > 1 ? "s" : ""}):</strong> A safety incident or policy escalation requires prompt review by an administrator.
              </div>
            </div>
            <Link href={ROUTES.admin.reports} className={styles.triageBtnRed}>
              Triage Incidents <ArrowRight size={13} aria-hidden="true" />
            </Link>
          </div>
        )}

        {pendingApplications > 0 && (
          <div className={styles.triageBanner} role="status">
            <div className={styles.triageBannerLeft}>
              <div className={styles.triageIconAmber}>
                <ClipboardList size={18} aria-hidden="true" />
              </div>
              <div className={styles.triageTextAmber}>
                <strong>Volunteer Applications Pending ({pendingApplications} awaiting review):</strong> New tutor candidate applications and background document credentials require academic verification.
              </div>
            </div>
            <Link href={ROUTES.admin.applications} className={styles.triageBtnAmber}>
              Review Applications <ArrowRight size={13} aria-hidden="true" />
            </Link>
          </div>
        )}

        {/* 8-Metric Health & Activity Grid */}
        <div>
          <span className={styles.sectionLabel}>Platform Metrics</span>
          <div className={styles.statsGrid} style={{ marginTop: "0.75rem" }}>
            {cards.map((card) => {
              const IconComp = card.Icon;
              const cardClass = card.critical
                ? `${styles.statCard} ${styles.statCardCritical}`
                : card.highlight
                ? `${styles.statCard} ${styles.statCardHighlight}`
                : styles.statCard;

              return (
                <Link key={card.label} href={card.href} className={cardClass}>
                  <div className={styles.statCardTop}>
                    <div
                      className={styles.statIconWrap}
                      style={{ background: card.iconBg, color: card.iconColor }}
                    >
                      <IconComp size={18} aria-hidden="true" />
                    </div>
                    <span className={styles.statValue}>{card.count}</span>
                  </div>
                  <div>
                    <div className={styles.statLabel}>{card.label}</div>
                    <div className={styles.statHint}>
                      <span>View details</span>
                      <ArrowRight size={11} aria-hidden="true" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Two-Column Operational Activity */}
        <div className={styles.twoColGrid}>
          {/* Recent Registrations Panel */}
          <section className={styles.panel} aria-labelledby="registrations-heading">
            <div className={styles.panelHeader}>
              <h2 id="registrations-heading" className={styles.panelTitle}>
                Recent User Registrations
              </h2>
              <Link href={ROUTES.admin.users} className={styles.panelLink}>
                <span>View all</span>
                <ArrowRight size={13} aria-hidden="true" />
              </Link>
            </div>

            {recentUsers.length === 0 ? (
              <p style={{ color: "var(--wa-muted)", fontSize: "0.8125rem", margin: "1rem 0" }}>
                No recent user registrations found.
              </p>
            ) : (
              <div className={styles.itemsList}>
                {recentUsers.map((u) => {
                  const roleBadgeType =
                    u.role === "ADMIN" ? "info" : u.role === "TUTOR" ? "completed" : "pending";
                  return (
                    <div key={u.id} className={styles.itemRow}>
                      <div>
                        <div className={styles.itemPrimary}>{u.name || "Learner"}</div>
                        <div className={styles.itemSecondary}>{u.email}</div>
                      </div>
                      <StatusBadge status={roleBadgeType} label={u.role} />
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          {/* Recent Bookings Panel */}
          <section className={styles.panel} aria-labelledby="sessions-heading">
            <div className={styles.panelHeader}>
              <h2 id="sessions-heading" className={styles.panelTitle}>
                Recent Tutoring Sessions
              </h2>
              <Link href={ROUTES.admin.sessions} className={styles.panelLink}>
                <span>View all</span>
                <ArrowRight size={13} aria-hidden="true" />
              </Link>
            </div>

            {recentBookings.length === 0 ? (
              <p style={{ color: "var(--wa-muted)", fontSize: "0.8125rem", margin: "1rem 0" }}>
                No recent sessions found.
              </p>
            ) : (
              <div className={styles.itemsList}>
                {recentBookings.map((b) => {
                  const sessionBadgeType =
                    b.status === "COMPLETED"
                      ? "completed"
                      : b.status === "CONFIRMED"
                      ? "scheduled"
                      : "cancelled";

                  return (
                    <div key={b.id} className={styles.itemRow}>
                      <div>
                        <div className={styles.itemPrimary}>{b.subject}</div>
                        <div className={styles.itemSecondary}>
                          {b.tutor?.user?.name || "Tutor"} → {b.student?.name || b.student?.email || "Student"}
                        </div>
                      </div>
                      <StatusBadge status={sessionBadgeType} label={b.status} />
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
