import React from "react";
import { getCurrentUser } from "@/lib/auth-user";
import { prisma } from "@/lib/prisma";
import { ROUTES } from "@/lib/routes";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  Trophy,
  Clock,
  Users,
  ArrowRight,
  Search,
  GraduationCap,
  HelpCircle,
  BookOpen,
  ChevronRight,
} from "lucide-react";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = {
  title: "Dashboard | Learnivia",
  description:
    "Your Learnivia dashboard — find sessions, track your progress, and connect with peer tutors.",
};

// Program cards (Schoolhouse-style horizontal scroll row)
const PROGRAMS = [
  {
    id: "maths",
    label: "Mathematics",
    sublabel: "Algebra, Geometry & more",
    bg: "#7C3AED",
    abbr: "MTH",
    href: "/find?subject=Mathematics",
  },
  {
    id: "science",
    label: "Science",
    sublabel: "Physics, Biology, Chemistry",
    bg: "#0D9488",
    abbr: "SCI",
    href: "/find?subject=Science",
  },
  {
    id: "english",
    label: "English & Writing",
    sublabel: "Grammar, essays, comprehension",
    bg: "#2563EB",
    abbr: "ENG",
    href: "/find?subject=English",
  },
  {
    id: "community",
    label: "Community Sessions",
    sublabel: "Group Q&A with peers",
    bg: "#059669",
    abbr: "COM",
    href: "/community",
  },
  {
    id: "homework",
    label: "Homework Help",
    sublabel: "Get quick subject help",
    bg: "#D97706",
    abbr: "HWK",
    href: "/homework-help",
  },
];

export default async function StudentDashboard() {
  const user = await getCurrentUser();

  if (!user) {
    redirect(ROUTES.auth.signIn);
  }

  const now = new Date();
  const hour = now.getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  const firstName = user.name?.trim().split(" ")[0] || "Learner";
  const initials = (user.name || "L")
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  // Fetch upcoming bookings
  let upcomingBookings: any[] = [];
  let completedCount = 0;
  let totalMinutes = 0;

  try {
    const [upcoming, completed] = await Promise.all([
      prisma.booking.findMany({
        where: {
          studentId: user.id,
          status: "CONFIRMED",
          endTime: { gte: now },
        },
        include: {
          tutor: {
            include: { user: { select: { name: true } } },
          },
        },
        orderBy: { startTime: "asc" },
        take: 3,
      }),
      prisma.booking.findMany({
        where: {
          studentId: user.id,
          OR: [
            { status: "COMPLETED" },
            { status: "CONFIRMED", endTime: { lt: now } },
          ],
        },
        orderBy: { startTime: "desc" },
        take: 10,
      }),
    ]);
    upcomingBookings = upcoming;
    completedCount = completed.length;
    totalMinutes = completed.length * 45; // approx 45min per session
  } catch {
    // DB not available
  }

  const isTutor = Boolean(user.isTutor || user.role === "TUTOR");
  const canApplyTutor = !isTutor;

  return (
    <div style={{ maxWidth: 900, margin: "0 auto" }}>
      {/* ── Featured Hero Banner ── */}
      <div
        style={{
          borderRadius: "var(--radius-xl, 18px)",
          background: "linear-gradient(135deg, #EFF6FF 0%, #CCFBF1 100%)",
          border: "1px solid var(--border, #E2E8F0)",
          padding: "1.75rem 2rem",
          marginBottom: "1.5rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "1.5rem",
          overflow: "hidden",
          position: "relative",
        }}
      >
        <div style={{ flex: 1, minWidth: 0 }}>
          <p
            style={{
              fontSize: "0.75rem",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.07em",
              color: "var(--primary, #0D9488)",
              marginBottom: "0.4rem",
            }}
          >
            Learnivia — Free K-10 Tutoring
          </p>
          <h1
            style={{
              fontFamily: "var(--font-serif, 'Playfair Display', serif)",
              fontSize: "clamp(1.3rem, 2.5vw, 1.7rem)",
              fontWeight: 700,
              color: "var(--text-primary, #0C1B33)",
              lineHeight: 1.25,
              marginBottom: "0.75rem",
            }}
          >
            Connect with K-10 peer tutors across every board
          </h1>
          <p
            style={{
              fontSize: "0.875rem",
              color: "var(--text-secondary, #475569)",
              marginBottom: "1rem",
              maxWidth: 440,
              lineHeight: 1.55,
            }}
          >
            Get matched with verified tutors for CBSE, ICSE, IGCSE, and more.
            Every session is 100% free and happens live on Zoom.
          </p>
          <Link
            href={ROUTES.find || "/find"}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.45rem",
              padding: "0.6rem 1.25rem",
              background: "var(--primary, #0D9488)",
              color: "#fff",
              borderRadius: "var(--radius-sm, 8px)",
              fontSize: "0.875rem",
              fontWeight: 700,
              textDecoration: "none",
              transition: "background var(--transition, 180ms)",
            }}
          >
            <Search size={15} />
            Find a Tutor
          </Link>
        </div>
        {/* Decorative illustration area */}
        <div
          style={{
            width: 140,
            height: 120,
            borderRadius: "var(--radius-lg, 14px)",
            background: "rgba(13, 148, 136, 0.08)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/find-a-tutor.png"
            alt=""
            width={110}
            height={100}
            style={{ objectFit: "contain" }}
          />
        </div>
      </div>

      {/* ── Program Cards Row (Schoolhouse-style horizontal scroll) ── */}
      <div
        style={{
          display: "flex",
          gap: "0.75rem",
          overflowX: "auto",
          paddingBottom: "0.5rem",
          marginBottom: "1.75rem",
          scrollbarWidth: "none",
        }}
      >
        {PROGRAMS.map((prog) => (
          <Link
            key={prog.id}
            href={prog.href}
            style={{
              flexShrink: 0,
              width: 155,
              padding: "0.875rem",
              background: "var(--surface-raised, #FFFFFF)",
              border: "1px solid var(--border, #E2E8F0)",
              borderRadius: "var(--radius-lg, 14px)",
              textDecoration: "none",
              transition: "box-shadow var(--transition, 180ms), transform var(--transition, 180ms)",
              display: "flex",
              flexDirection: "column",
              gap: "0.6rem",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.boxShadow =
                "var(--shadow-md)";
              (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.boxShadow = "none";
              (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
            }}
          >
            {/* Color badge */}
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: "var(--radius-md, 10px)",
                background: prog.bg,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                fontSize: "0.65rem",
                fontWeight: 800,
                letterSpacing: "0.04em",
              }}
            >
              {prog.abbr}
            </div>
            <div>
              <p
                style={{
                  fontSize: "0.875rem",
                  fontWeight: 700,
                  color: "var(--text-primary, #0C1B33)",
                  margin: 0,
                  lineHeight: 1.3,
                }}
              >
                {prog.label}
              </p>
              <p
                style={{
                  fontSize: "0.775rem",
                  color: "var(--text-muted, #64748B)",
                  margin: "3px 0 0",
                  lineHeight: 1.35,
                }}
              >
                {prog.sublabel}
              </p>
            </div>
          </Link>
        ))}
      </div>

      {/* ── User Identity + Stats ── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "1.5rem",
          flexWrap: "wrap",
          marginBottom: "1.75rem",
          padding: "1.25rem 1.5rem",
          background: "var(--surface-raised, #FFFFFF)",
          border: "1px solid var(--border, #E2E8F0)",
          borderRadius: "var(--radius-xl, 18px)",
        }}
      >
        {/* Avatar */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.875rem" }}>
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: "50%",
              background: "var(--primary, #0D9488)",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1rem",
              fontWeight: 700,
              flexShrink: 0,
            }}
          >
            {initials}
          </div>
          <div>
            <p
              style={{
                fontSize: "1.1rem",
                fontWeight: 800,
                color: "var(--text-primary, #0C1B33)",
                margin: 0,
              }}
            >
              {user.name || "Learner"}
            </p>
            <div style={{ display: "flex", gap: "0.75rem", marginTop: "3px" }}>
              <Link
                href="/sessions"
                style={{
                  fontSize: "0.8rem",
                  color: "var(--primary, #0D9488)",
                  fontWeight: 600,
                  textDecoration: "none",
                }}
              >
                My Sessions
              </Link>
              {isTutor && (
                <Link
                  href="/tutor"
                  style={{
                    fontSize: "0.8rem",
                    color: "var(--primary, #0D9488)",
                    fontWeight: 600,
                    textDecoration: "none",
                  }}
                >
                  Tutor Profile
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div
          style={{
            display: "flex",
            gap: "1.25rem",
            marginLeft: "auto",
            flexWrap: "wrap",
          }}
        >
          <Stat
            icon={<Trophy size={18} color="#F59E0B" />}
            value={completedCount}
            label="Sessions"
          />
          <Stat
            icon={<Clock size={18} color="#0D9488" />}
            value={`${totalMinutes}`}
            label="Learning mins"
          />
          <Stat
            icon={<Users size={18} color="#7C3AED" />}
            value="K-10"
            label="Grade band"
          />
        </div>
      </div>

      {/* ── Two-Column Content ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 340px",
          gap: "1.25rem",
          alignItems: "start",
        }}
      >
        {/* Left: Upcoming Sessions + Action Links */}
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "0.875rem",
            }}
          >
            <h2
              style={{
                fontSize: "1rem",
                fontWeight: 700,
                color: "var(--text-primary, #0C1B33)",
                margin: 0,
              }}
            >
              Upcoming Sessions
            </h2>
            <Link
              href="/sessions"
              style={{
                fontSize: "0.8rem",
                color: "var(--primary, #0D9488)",
                fontWeight: 600,
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                gap: "3px",
              }}
            >
              View All <ChevronRight size={14} />
            </Link>
          </div>

          {upcomingBookings.length === 0 ? (
            <div
              style={{
                padding: "1rem 1.25rem",
                background: "var(--surface-subtle, #F1F5F9)",
                borderRadius: "var(--radius-md, 10px)",
                fontSize: "0.875rem",
                color: "var(--text-muted, #64748B)",
                marginBottom: "0.75rem",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              📅 No upcoming sessions — find your next session below!
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.625rem",
                marginBottom: "0.75rem",
              }}
            >
              {upcomingBookings.map((b: any) => (
                <SessionCard key={b.id} booking={b} />
              ))}
            </div>
          )}

          {/* Quick-action links — Schoolhouse style */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <ActionLink
              icon={<GraduationCap size={18} color="var(--primary, #0D9488)" />}
              label="Find a peer tutor for your subject"
              href="/find"
            />
            <ActionLink
              icon={<Search size={18} color="var(--primary, #0D9488)" />}
              label="Browse all available sessions"
              href="/sessions"
            />
            <ActionLink
              icon={<HelpCircle size={18} color="var(--primary, #0D9488)" />}
              label="Get quick homework help"
              href="/homework-help"
            />
          </div>

          {/* Become-a-tutor promo */}
          {canApplyTutor && (
            <div
              style={{
                marginTop: "1rem",
                padding: "1rem 1.25rem",
                background: "var(--surface-subtle, #F1F5F9)",
                border: "1px solid var(--border, #E2E8F0)",
                borderRadius: "var(--radius-lg, 14px)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "0.75rem",
              }}
            >
              <div>
                <p
                  style={{
                    fontSize: "0.8375rem",
                    color: "var(--text-secondary, #475569)",
                    margin: 0,
                  }}
                >
                  <strong style={{ color: "var(--text-primary, #0C1B33)" }}>
                    Want to mentor others?
                  </strong>{" "}
                  Become a tutor, give back, and earn verified service hours.
                </p>
              </div>
              <Link
                href="/apply"
                style={{
                  flexShrink: 0,
                  padding: "0.5rem 1rem",
                  background: "var(--primary, #0D9488)",
                  color: "#fff",
                  borderRadius: "var(--radius-sm, 8px)",
                  fontSize: "0.8rem",
                  fontWeight: 700,
                  textDecoration: "none",
                  whiteSpace: "nowrap",
                }}
              >
                Apply to Tutor
              </Link>
            </div>
          )}
        </div>

        {/* Right: Tasks / Next steps panel */}
        <div>
          <h2
            style={{
              fontSize: "1rem",
              fontWeight: 700,
              color: "var(--text-primary, #0C1B33)",
              margin: "0 0 0.875rem",
            }}
          >
            Suggested Next Steps
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
            <TaskCard
              category="FIND A TUTOR"
              color="#7C3AED"
              title="Book your first free session"
              href="/find"
              completed={completedCount > 0}
            />
            <TaskCard
              category="PROGRAMS"
              color="#0D9488"
              title={`Explore ${isTutor ? "sessions to host" : "K-10 sessions"}`}
              href={isTutor ? "/tutor" : "/learn"}
              completed={false}
            />
            {!isTutor && (
              <TaskCard
                category="VOLUNTEER"
                color="#D97706"
                title="Become a Tutor"
                subtitle="3 steps to get started"
                href="/apply"
                completed={false}
              />
            )}
            <TaskCard
              category="SAFETY"
              color="#64748B"
              title="Review our safeguarding standards"
              href="/safety"
              completed={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Sub-components ──────────────────────────────────────────────────────────

function Stat({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: string | number;
  label: string;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "0.5rem",
        padding: "0.4rem 0.8rem",
        background: "var(--surface-subtle, #F1F5F9)",
        borderRadius: "var(--radius-sm, 8px)",
      }}
    >
      {icon}
      <div>
        <span
          style={{
            fontSize: "0.9rem",
            fontWeight: 800,
            color: "var(--text-primary, #0C1B33)",
            display: "block",
          }}
        >
          {value}
        </span>
        <span
          style={{
            fontSize: "0.7rem",
            color: "var(--text-muted, #64748B)",
          }}
        >
          {label}
        </span>
      </div>
    </div>
  );
}

function SessionCard({ booking }: { booking: any }) {
  const start = new Date(booking.startTime);
  const tutorName = booking.tutor?.user?.name || "Your Tutor";
  const subject = booking.subject || "Tutoring Session";
  return (
    <Link
      href={`/sessions/${booking.id}`}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "0.875rem",
        padding: "0.875rem 1rem",
        background: "var(--surface-raised, #FFFFFF)",
        border: "1px solid var(--border, #E2E8F0)",
        borderRadius: "var(--radius-md, 10px)",
        textDecoration: "none",
        transition: "box-shadow var(--transition, 180ms)",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.boxShadow = "var(--shadow-sm)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.boxShadow = "none";
      }}
    >
      <BookOpen size={18} color="var(--primary, #0D9488)" />
      <div style={{ flex: 1, minWidth: 0 }}>
        <p
          style={{
            fontSize: "0.875rem",
            fontWeight: 600,
            color: "var(--text-primary, #0C1B33)",
            margin: 0,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {subject}
        </p>
        <p
          style={{
            fontSize: "0.775rem",
            color: "var(--primary, #0D9488)",
            margin: "2px 0 0",
            fontWeight: 600,
          }}
        >
          {start.toLocaleDateString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
          })}{" "}
          {start.toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
          })}
          {" · "}
          {tutorName}
        </p>
      </div>
      <ArrowRight size={15} color="var(--text-muted, #64748B)" />
    </Link>
  );
}

function ActionLink({
  icon,
  label,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "0.875rem",
        padding: "0.875rem 1.1rem",
        background: "var(--surface-raised, #FFFFFF)",
        border: "1px solid var(--border, #E2E8F0)",
        borderRadius: "var(--radius-md, 10px)",
        textDecoration: "none",
        transition: "box-shadow var(--transition, 180ms)",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.boxShadow = "var(--shadow-sm)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.boxShadow = "none";
      }}
    >
      {icon}
      <span
        style={{
          fontSize: "0.9rem",
          fontWeight: 600,
          color: "var(--text-primary, #0C1B33)",
        }}
      >
        {label}
      </span>
    </Link>
  );
}

function TaskCard({
  category,
  color,
  title,
  subtitle,
  href,
  completed,
}: {
  category: string;
  color: string;
  title: string;
  subtitle?: string;
  href: string;
  completed: boolean;
}) {
  return (
    <Link
      href={href}
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: "0.75rem",
        padding: "0.875rem 1rem",
        background: "var(--surface-raised, #FFFFFF)",
        border: "1px solid var(--border, #E2E8F0)",
        borderRadius: "var(--radius-md, 10px)",
        textDecoration: "none",
        transition: "box-shadow var(--transition, 180ms)",
        opacity: completed ? 0.65 : 1,
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.boxShadow = "var(--shadow-sm)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.boxShadow = "none";
      }}
    >
      {/* Colored category badge */}
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: "var(--radius-sm, 8px)",
          background: color,
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {completed ? (
          <span style={{ color: "#fff", fontSize: "0.75rem" }}>✓</span>
        ) : (
          <span
            style={{
              color: "#fff",
              fontSize: "0.55rem",
              fontWeight: 800,
              letterSpacing: "0.02em",
              textAlign: "center",
              lineHeight: 1.1,
              padding: "0 2px",
            }}
          >
            {category.slice(0, 3)}
          </span>
        )}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p
          style={{
            fontSize: "0.65rem",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            color: "var(--text-muted, #64748B)",
            margin: "0 0 3px",
          }}
        >
          {category}
        </p>
        <p
          style={{
            fontSize: "0.875rem",
            fontWeight: 600,
            color: completed
              ? "var(--text-muted, #64748B)"
              : "var(--text-primary, #0C1B33)",
            margin: 0,
            lineHeight: 1.35,
            textDecoration: completed ? "line-through" : "none",
          }}
        >
          {title}
        </p>
        {subtitle && !completed && (
          <span
            style={{
              display: "inline-block",
              marginTop: "4px",
              fontSize: "0.7rem",
              fontWeight: 700,
              padding: "2px 7px",
              background: "var(--primary-light, #CCFBF1)",
              color: "var(--primary, #0D9488)",
              borderRadius: "var(--radius-pill, 9999px)",
            }}
          >
            {subtitle}
          </span>
        )}
      </div>
    </Link>
  );
}
