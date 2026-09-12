import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth-user";
import { redirect } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
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
} from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin Command Center | Learnivia",
  description: "Master administrative control and oversight for Learnivia.",
};

export default async function AdminOverviewPage() {
  const user = await getCurrentUser();
  if (!user || !user.isAdmin) {
    redirect("/dashboard");
  }

  const [
    totalUsers,
    totalTutors,
    pendingApplications,
    totalBookings,
    totalWorkshops,
    openReports,
    totalCommunityMessages,
    totalHomeworkRequests,
    recentUsers,
    recentBookings,
  ] = await Promise.all([
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

  const cards = [
    { label: "Registered Users", count: totalUsers, Icon: Users, href: "/admin/users", iconBg: "#EAF3ED", iconColor: "#2D6A4F" },
    { label: "Approved Tutors", count: totalTutors, Icon: GraduationCap, href: "/admin/tutors", iconBg: "#ECFDF5", iconColor: "#0E8345" },
    {
      label: "Pending Applications",
      count: pendingApplications,
      Icon: ClipboardList,
      href: "/admin/applications",
      iconBg: pendingApplications > 0 ? "#FEF3C7" : "#F5F1EA",
      iconColor: pendingApplications > 0 ? "#D97706" : "#A89F94",
      highlight: pendingApplications > 0,
    },
    {
      label: "Open Safety Reports",
      count: openReports,
      Icon: ShieldAlert,
      href: "/admin/reports",
      iconBg: openReports > 0 ? "#FEE2E2" : "#F5F1EA",
      iconColor: openReports > 0 ? "#DC2626" : "#A89F94",
      highlight: openReports > 0,
    },
    { label: "1-on-1 Sessions", count: totalBookings, Icon: Handshake, href: "/admin/sessions", iconBg: "#EAF3ED", iconColor: "#2D6A4F" },
    { label: "Group Workshops", count: totalWorkshops, Icon: BookOpen, href: "/admin/sessions", iconBg: "#EEF2FF", iconColor: "#4338CA" },
    { label: "Community Messages", count: totalCommunityMessages, Icon: MessageSquare, href: "/admin/moderation", iconBg: "#F0FDF4", iconColor: "#16A34A" },
    { label: "Homework Inquiries", count: totalHomeworkRequests, Icon: HelpCircle, href: "/admin/moderation", iconBg: "#FFFBEB", iconColor: "#B45309" },
  ];

  return (
    <div>
      {/* ── Admin Header — warm green, fully readable ── */}
      <div
        style={{
          background: "#2D6A4F",
          borderRadius: "14px",
          padding: "1.75rem 2rem",
          marginBottom: "2rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "1rem",
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", marginBottom: "0.375rem" }}>
            <ShieldCheck size={20} color="rgba(255,255,255,0.9)" />
            <h1 style={{ fontSize: "1.375rem", fontWeight: 800, margin: 0, color: "#FFFFFF", letterSpacing: "-0.015em" }}>
              Admin Command Center
            </h1>
            <span
              style={{
                background: "rgba(255,255,255,0.15)",
                border: "1px solid rgba(255,255,255,0.3)",
                color: "#FFFFFF",
                fontSize: "0.625rem",
                fontWeight: 800,
                padding: "0.2rem 0.6rem",
                borderRadius: "999px",
                letterSpacing: "0.07em",
              }}
            >
              LIVE
            </span>
          </div>
          <p style={{ color: "rgba(255,255,255,0.72)", fontSize: "0.875rem", margin: 0, maxWidth: 560 }}>
            Full control over users, volunteer tutors, sessions, community moderation, and child safeguarding.
          </p>
        </div>
        <div style={{ display: "flex", gap: "0.625rem", flexWrap: "wrap" }}>
          <Link
            href="/admin/moderation"
            style={{
              display: "inline-flex", alignItems: "center", gap: "0.4rem",
              background: "#FFFFFF", color: "#2D6A4F",
              fontSize: "0.875rem", fontWeight: 700,
              padding: "0.6rem 1.25rem", borderRadius: "8px",
              textDecoration: "none",
            }}
          >
            <Radio size={15} /> Broadcast
          </Link>
          <Link
            href="/admin/users"
            style={{
              display: "inline-flex", alignItems: "center", gap: "0.4rem",
              background: "rgba(255,255,255,0.12)", color: "#FFFFFF",
              border: "1px solid rgba(255,255,255,0.25)",
              fontSize: "0.875rem", fontWeight: 600,
              padding: "0.6rem 1.25rem", borderRadius: "8px",
              textDecoration: "none",
            }}
          >
            Manage Users <ArrowRight size={14} />
          </Link>
        </div>
      </div>

      {/* ── Metric Cards ── */}
      <h2 style={{ fontSize: "0.875rem", fontWeight: 700, color: "#7A7169", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "0.875rem" }}>
        Platform Health &amp; Activity
      </h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "1rem",
          marginBottom: "2.5rem",
        }}
      >
        {cards.map((card) => {
          const IconComp = card.Icon;
          return (
            <Link
              key={card.label}
              href={card.href}
              style={{
                background: "#FFFFFF",
                border: card.highlight ? `1.5px solid ${card.iconColor}` : "1.5px solid #E8E4DC",
                borderRadius: "12px",
                padding: "1.25rem",
                textDecoration: "none",
                display: "flex",
                flexDirection: "column",
                gap: "0.875rem",
                transition: "transform 0.12s ease, box-shadow 0.12s ease",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span
                  style={{
                    background: card.iconBg,
                    width: 40,
                    height: 40,
                    borderRadius: "10px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <IconComp size={20} color={card.iconColor} />
                </span>
                <span style={{ fontSize: "1.875rem", fontWeight: 800, color: "#1C1A17", fontFamily: "var(--font-serif, Georgia, serif)" }}>
                  {card.count}
                </span>
              </div>
              <div>
                <div style={{ fontSize: "0.875rem", fontWeight: 700, color: "#1C1A17" }}>{card.label}</div>
                <div style={{ fontSize: "0.75rem", color: "#A89F94", marginTop: "0.15rem" }}>Tap to manage</div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* ── Recent Activity Columns ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))", gap: "1.25rem" }}>

        {/* Recent Users */}
        <div style={{ background: "#FFFFFF", borderRadius: "12px", border: "1.5px solid #E8E4DC", padding: "1.5rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
            <h3 style={{ fontSize: "0.9375rem", fontWeight: 700, color: "#1C1A17", margin: 0 }}>Recent Registrations</h3>
            <Link href="/admin/users" style={{ fontSize: "0.8125rem", color: "#2D6A4F", fontWeight: 700, textDecoration: "none" }}>
              View all →
            </Link>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
            {recentUsers.map((u) => (
              <div
                key={u.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "0.65rem 0.75rem",
                  background: "#FAF8F5",
                  borderRadius: "8px",
                  fontSize: "0.875rem",
                }}
              >
                <div>
                  <div style={{ fontWeight: 700, color: "#1C1A17" }}>{u.name || "Learner"}</div>
                  <div style={{ fontSize: "0.75rem", color: "#7A7169" }}>{u.email}</div>
                </div>
                <span
                  style={{
                    background: u.role === "ADMIN" ? "#FEF3C7" : u.role === "TUTOR" ? "#EAF3ED" : "#F0ECE5",
                    color: u.role === "ADMIN" ? "#92400E" : u.role === "TUTOR" ? "#2D6A4F" : "#7A7169",
                    fontSize: "0.6875rem",
                    fontWeight: 700,
                    padding: "0.2rem 0.55rem",
                    borderRadius: "999px",
                    border: `1px solid ${u.role === "ADMIN" ? "#FDE68A" : u.role === "TUTOR" ? "#B5D9C5" : "#DDD8D0"}`,
                  }}
                >
                  {u.role}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Bookings */}
        <div style={{ background: "#FFFFFF", borderRadius: "12px", border: "1.5px solid #E8E4DC", padding: "1.5rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
            <h3 style={{ fontSize: "0.9375rem", fontWeight: 700, color: "#1C1A17", margin: 0 }}>Recent Sessions</h3>
            <Link href="/admin/sessions" style={{ fontSize: "0.8125rem", color: "#2D6A4F", fontWeight: 700, textDecoration: "none" }}>
              View all →
            </Link>
          </div>
          {recentBookings.length === 0 ? (
            <p style={{ color: "#A89F94", fontSize: "0.875rem", fontStyle: "italic", margin: 0 }}>No sessions booked yet.</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
              {recentBookings.map((b) => (
                <div
                  key={b.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "0.65rem 0.75rem",
                    background: "#FAF8F5",
                    borderRadius: "8px",
                    fontSize: "0.875rem",
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 700, color: "#1C1A17" }}>{b.subject}</div>
                    <div style={{ fontSize: "0.75rem", color: "#7A7169" }}>
                      {b.tutor.user.name || "Tutor"} → {b.student.name || b.student.email}
                    </div>
                  </div>
                  <span
                    style={{
                      background: b.status === "COMPLETED" ? "#EAF3ED" : "#FEF3C7",
                      color: b.status === "COMPLETED" ? "#2D6A4F" : "#92400E",
                      fontSize: "0.6875rem",
                      fontWeight: 700,
                      padding: "0.2rem 0.55rem",
                      borderRadius: "999px",
                    }}
                  >
                    {b.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
