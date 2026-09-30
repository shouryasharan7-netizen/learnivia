import { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/auth";
import { Bell, BookOpen, UserPlus, Star, CheckCheck, ArrowLeft, Calendar, MessageSquare } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Notifications | Learnivia",
  description: "Stay informed about your upcoming sessions, tutor replies, and study reminders.",
};

export default async function NotificationsPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/signin?callbackUrl=/notifications");
  }

  const notifications = [
    {
      id: "1",
      icon: BookOpen,
      color: "#0D9488",
      title: "Session confirmed",
      body: "Your 1-on-1 tutoring session is scheduled on your calendar.",
      time: "2 hrs ago",
      href: "/calendar",
    },
    {
      id: "2",
      icon: UserPlus,
      color: "#6366F1",
      title: "New tutor message",
      body: "You have a direct message regarding your study inquiry.",
      time: "Yesterday",
      href: "/messages",
    },
    {
      id: "3",
      icon: Star,
      color: "#F59E0B",
      title: "Session record updated",
      body: "Your peer study session has concluded. Check your service records.",
      time: "3 days ago",
      href: "/calendar?tab=past",
    },
    {
      id: "4",
      icon: Calendar,
      color: "#0D9488",
      title: "Explore peer workshops",
      body: "New weekend study bootcamps are open for registration.",
      time: "4 days ago",
      href: "/find",
    },
  ];

  return (
    <div
      style={{
        maxWidth: 720,
        margin: "2rem auto",
        padding: "0 1.5rem",
        fontFamily: "var(--font-sans, sans-serif)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "1.5rem",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: "10px",
              background: "#CCFBF1",
              color: "#0D9488",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Bell size={20} />
          </div>
          <div>
            <h1
              style={{
                fontSize: "1.45rem",
                fontWeight: 800,
                color: "#0F172A",
                margin: 0,
              }}
            >
              Notifications
            </h1>
            <p style={{ margin: 0, fontSize: "0.85rem", color: "#64748B" }}>
              All session reminders, direct messages, and platform updates.
            </p>
          </div>
        </div>

        <Link
          href="/dashboard"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.4rem",
            fontSize: "0.85rem",
            color: "#64748B",
            textDecoration: "none",
            fontWeight: 600,
          }}
        >
          <ArrowLeft size={16} /> Dashboard
        </Link>
      </div>

      <div
        style={{
          background: "#FFFFFF",
          borderRadius: "12px",
          border: "1px solid #E2E8F0",
          overflow: "hidden",
          boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
        }}
      >
        {notifications.map((n) => {
          const Icon = n.icon;
          return (
            <Link
              key={n.id}
              href={n.href}
              style={{
                display: "flex",
                gap: "1rem",
                padding: "1rem 1.25rem",
                borderBottom: "1px solid #F1F5F9",
                textDecoration: "none",
                alignItems: "flex-start",
                transition: "background 150ms",
              }}
            >
              <div
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: "50%",
                  background: `${n.color}15`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <Icon size={18} color={n.color} />
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <p
                  style={{
                    margin: 0,
                    fontSize: "0.9rem",
                    fontWeight: 700,
                    color: "#0F172A",
                  }}
                >
                  {n.title}
                </p>
                <p
                  style={{
                    margin: "0.2rem 0 0",
                    fontSize: "0.85rem",
                    color: "#475569",
                    lineHeight: 1.4,
                  }}
                >
                  {n.body}
                </p>
                <span
                  style={{
                    display: "inline-block",
                    marginTop: "0.35rem",
                    fontSize: "0.75rem",
                    color: "#94A3B8",
                  }}
                >
                  {n.time}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
