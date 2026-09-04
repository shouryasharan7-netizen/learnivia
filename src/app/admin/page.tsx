import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth-user";
import { redirect } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";

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

  // Fetch system-wide metrics concurrently
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
    { label: "Total Registered Users", count: totalUsers, icon: "👥", href: "/admin/users", bg: "#EFF6FF", color: "#2563EB" },
    { label: "Approved Volunteer Tutors", count: totalTutors, icon: "🎓", href: "/admin/tutors", bg: "#ECFDF5", color: "#0E8345" },
    {
      label: "Pending Tutor Applications",
      count: pendingApplications,
      icon: "📝",
      href: "/admin/applications",
      bg: pendingApplications > 0 ? "#FEF3C7" : "#F8FAFC",
      color: pendingApplications > 0 ? "#D97706" : "#64748B",
      highlight: pendingApplications > 0,
    },
    {
      label: "Open Safety Reports",
      count: openReports,
      icon: "🛡️",
      href: "/admin/reports",
      bg: openReports > 0 ? "#FEE2E2" : "#F8FAFC",
      color: openReports > 0 ? "#DC2626" : "#64748B",
      highlight: openReports > 0,
    },
    { label: "1-on-1 Sessions Booked", count: totalBookings, icon: "🤝", href: "/admin/sessions", bg: "#F3E8FF", color: "#7C3AED" },
    { label: "Group Workshops & Circles", count: totalWorkshops, icon: "📚", href: "/admin/sessions", bg: "#EFF6FF", color: "#3B82F6" },
    { label: "Community Messages", count: totalCommunityMessages, icon: "💬", href: "/admin/moderation", bg: "#F0FDF4", color: "#16A34A" },
    { label: "Homework Help Inquiries", count: totalHomeworkRequests, icon: "❓", href: "/admin/moderation", bg: "#FFFBEB", color: "#B45309" },
  ];

  return (
    <div>
      {/* Top Banner */}
      <div
        style={{
          background: "linear-gradient(135deg, #0F172A 0%, #1E293B 100%)",
          borderRadius: "16px",
          padding: "2rem",
          color: "#FFFFFF",
          marginBottom: "2rem",
          boxShadow: "0 10px 25px -5px rgba(15, 23, 42, 0.1)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
              <span style={{ fontSize: "1.5rem" }}>🛡️</span>
              <h1 style={{ fontSize: "1.75rem", fontWeight: 800, margin: 0, letterSpacing: "-0.01em" }}>
                Master Command Center
              </h1>
              <span
                style={{
                  background: "#10B981",
                  color: "#FFFFFF",
                  fontSize: "0.75rem",
                  fontWeight: 800,
                  padding: "0.2rem 0.6rem",
                  borderRadius: "999px",
                  marginLeft: "0.5rem",
                }}
              >
                LIVE SYSTEM
              </span>
            </div>
            <p style={{ color: "#94A3B8", fontSize: "0.95rem", margin: 0, maxWidth: 650 }}>
              Full administrative authority over users, volunteer educators, tutoring schedules, community communications, and child safeguarding.
            </p>
          </div>

          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            <Link
              href="/admin/moderation"
              style={{
                background: "#0E8345",
                color: "#FFFFFF",
                padding: "0.6rem 1.1rem",
                borderRadius: "10px",
                fontWeight: 700,
                fontSize: "0.875rem",
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.4rem",
              }}
            >
              📢 Broadcast Announcement
            </Link>
            <Link
              href="/admin/users"
              style={{
                background: "#334155",
                color: "#FFFFFF",
                padding: "0.6rem 1.1rem",
                borderRadius: "10px",
                fontWeight: 600,
                fontSize: "0.875rem",
                textDecoration: "none",
              }}
            >
              Manage Users &amp; Roles →
            </Link>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <h2 style={{ fontSize: "1.125rem", fontWeight: 700, color: "#1E293B", marginBottom: "1rem" }}>
        Platform Health &amp; Activity Counters
      </h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: "1rem",
          marginBottom: "2.5rem",
        }}
      >
        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            style={{
              background: "#FFFFFF",
              border: card.highlight ? `2px solid ${card.color}` : "1px solid #E2E8F0",
              borderRadius: "14px",
              padding: "1.25rem",
              textDecoration: "none",
              display: "flex",
              flexDirection: "column",
              gap: "0.75rem",
              transition: "transform 0.15s ease, box-shadow 0.15s ease",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span
                style={{
                  background: card.bg,
                  color: card.color,
                  width: 40,
                  height: 40,
                  borderRadius: "10px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.25rem",
                }}
              >
                {card.icon}
              </span>
              <span style={{ fontSize: "1.75rem", fontWeight: 800, color: card.color }}>
                {card.count}
              </span>
            </div>
            <div>
              <div style={{ fontSize: "0.875rem", fontWeight: 700, color: "#1E293B" }}>
                {card.label}
              </div>
              <div style={{ fontSize: "0.75rem", color: "#64748B", marginTop: "0.2rem" }}>
                Click to manage →
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Two Column Section: Recent Users & Recent Bookings */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))", gap: "1.5rem" }}>
        {/* Recent Registered Users */}
        <div style={{ background: "#FFFFFF", borderRadius: "14px", border: "1px solid #E2E8F0", padding: "1.5rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
            <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "#1E293B", margin: 0 }}>
              Recent Registrations
            </h3>
            <Link href="/admin/users" style={{ fontSize: "0.8rem", color: "#0E8345", fontWeight: 700, textDecoration: "none" }}>
              View All Users →
            </Link>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {recentUsers.map((u) => (
              <div
                key={u.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "0.75rem",
                  background: "#F8FAFC",
                  borderRadius: "8px",
                  fontSize: "0.875rem",
                }}
              >
                <div>
                  <div style={{ fontWeight: 700, color: "#0F172A" }}>{u.name || "Learner"}</div>
                  <div style={{ fontSize: "0.75rem", color: "#64748B" }}>{u.email}</div>
                </div>
                <span
                  style={{
                    background: u.role === "ADMIN" ? "#F59E0B" : u.role === "TUTOR" ? "#10B981" : "#E2E8F0",
                    color: u.role === "ADMIN" || u.role === "TUTOR" ? "#FFFFFF" : "#475569",
                    fontSize: "0.7rem",
                    fontWeight: 700,
                    padding: "0.2rem 0.5rem",
                    borderRadius: "999px",
                  }}
                >
                  {u.role}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Bookings */}
        <div style={{ background: "#FFFFFF", borderRadius: "14px", border: "1px solid #E2E8F0", padding: "1.5rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
            <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "#1E293B", margin: 0 }}>
              Recent Tutoring Sessions
            </h3>
            <Link href="/admin/sessions" style={{ fontSize: "0.8rem", color: "#0E8345", fontWeight: 700, textDecoration: "none" }}>
              View All Sessions →
            </Link>
          </div>

          {recentBookings.length === 0 ? (
            <p style={{ color: "#64748B", fontSize: "0.875rem", fontStyle: "italic" }}>No sessions booked yet.</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {recentBookings.map((b) => (
                <div
                  key={b.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "0.75rem",
                    background: "#F8FAFC",
                    borderRadius: "8px",
                    fontSize: "0.875rem",
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 700, color: "#0F172A" }}>{b.subject}</div>
                    <div style={{ fontSize: "0.75rem", color: "#64748B" }}>
                      Tutor: {b.tutor.user.name || "Tutor"} • Student: {b.student.name || b.student.email}
                    </div>
                  </div>
                  <span
                    style={{
                      background: b.status === "COMPLETED" ? "#D1FAE5" : "#DBEAFE",
                      color: b.status === "COMPLETED" ? "#065F46" : "#1E40AF",
                      fontSize: "0.7rem",
                      fontWeight: 700,
                      padding: "0.2rem 0.5rem",
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
