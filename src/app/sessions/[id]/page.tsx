import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { FormattedDateTime } from "@/components/FormattedDateTime";
import { getMeetingUrls } from "@/lib/meetingUrl";
import { submitReview, confirmStudentAttendance } from "@/app/actions/sessions";
import { ROUTES } from "@/lib/routes";
import {
  ArrowLeft,
  Calendar,
  Clock,
  BookOpen,
  GraduationCap,
  Video,
  FileText,
  MessageSquare,
  Star,
  User,
  Search,
  CheckCircle2,
  XCircle,
  Radio,
  ShieldCheck,
  AlertTriangle,
  Check,
} from "lucide-react";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const booking = await prisma.booking.findUnique({
    where: { id },
    select: { subject: true, grade: true },
  });
  if (!booking) return { title: "Session Not Found | Learnivia" };
  return {
    title: `${booking.subject} Session (${booking.grade}) | Learnivia`,
    description: `1-on-1 Learnivia peer tutoring session for ${booking.grade} ${booking.subject}.`,
  };
}

export default async function SessionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user?.id) redirect(ROUTES.auth.signIn);

  const booking = await prisma.booking.findUnique({
    where: { id },
    include: {
      student: { select: { id: true, name: true, email: true } },
      tutor: {
        include: {
          user: { select: { id: true, name: true, email: true, timezone: true } },
        },
      },
    },
  });

  if (!booking) notFound();

  const isStudent = booking.studentId === session.user.id;
  const isTutor = booking.tutor.userId === session.user.id;
  if (!isStudent && !isTutor) redirect(ROUTES.learner.home);

  const existingReview = await prisma.review.findFirst({
    where: { bookingId: booking.id },
  });

  const meetingUrls = getMeetingUrls(booking.zoomLink);
  const activeMeetingLink = isTutor ? (meetingUrls.hostUrl || meetingUrls.joinUrl) : meetingUrls.joinUrl;

  const now = new Date();
  const start = new Date(booking.startTime);
  const end = new Date(booking.endTime);

  const zoomActivationTime = new Date(start.getTime() - 15 * 60 * 1000);
  const zoomIsActive = now >= zoomActivationTime && now <= new Date(end.getTime() + 30 * 60 * 1000);
  const minutesUntilZoom = Math.max(0, Math.round((zoomActivationTime.getTime() - now.getTime()) / 60000));

  const isCompleted = booking.status === "COMPLETED" || now > end;
  const isCanceled = booking.status === "CANCELED";
  const isUpcoming = booking.status === "CONFIRMED" && now < start;
  const isLive = now >= start && now <= end;

  const durationMinutes = Math.round((end.getTime() - start.getTime()) / 60000);

  type StatusConfig = {
    label: string;
    icon: typeof Radio;
    color: string;
    bg: string;
    border: string;
  };

  const getStatusConfig = (): StatusConfig => {
    if (isLive) {
      return {
        label: "Live Now",
        icon: Radio,
        color: "#DC2626",
        bg: "#FEF2F2",
        border: "#FECACA",
      };
    }
    if (isCanceled) {
      return {
        label: "Cancelled",
        icon: XCircle,
        color: "#B91C1C",
        bg: "#FEF2F2",
        border: "#FECACA",
      };
    }
    if (isCompleted) {
      return {
        label: "Completed",
        icon: CheckCircle2,
        color: "var(--wa-green, #1B4D3E)",
        bg: "var(--wa-green-light, #EAF2EE)",
        border: "#C6DEC6",
      };
    }
    if (isUpcoming) {
      return {
        label: "Confirmed Upcoming",
        icon: CheckCircle2,
        color: "var(--wa-green, #1B4D3E)",
        bg: "var(--wa-green-light, #EAF2EE)",
        border: "#C6DEC6",
      };
    }
    return {
      label: "Session Concluded",
      icon: Clock,
      color: "var(--wa-muted, #78716C)",
      bg: "var(--wa-contrast, #F3EFE8)",
      border: "var(--wa-border, #E5DFD5)",
    };
  };

  const status = getStatusConfig();
  const StatusIcon = status.icon;
  const tutorName = booking.tutor.user.name || "Peer Tutor";
  const studentName = booking.student.name || "Student";
  const otherPartyName = isStudent ? tutorName : studentName;
  const otherPartyInitials = otherPartyName.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "var(--wa-cream, #FAF8F5)",
        fontFamily: "var(--font-sans, 'Plus Jakarta Sans', sans-serif)",
        paddingBottom: "4rem",
      }}
    >
      {/* Sub-Header Navigation */}
      <nav
        style={{
          background: "var(--wa-white, #FFFFFF)",
          borderBottom: "1px solid var(--wa-border, #E5DFD5)",
          padding: "0.875rem 1.5rem",
        }}
      >
        <div
          style={{
            maxWidth: "760px",
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
          }}
        >
          <Link
            href={ROUTES.learner.home}
            style={{
              color: "var(--wa-muted, #78716C)",
              textDecoration: "none",
              fontSize: "0.875rem",
              fontWeight: 600,
              display: "inline-flex",
              alignItems: "center",
              gap: "0.35rem",
              transition: "color 0.15s ease",
            }}
          >
            <ArrowLeft size={15} aria-hidden="true" />
            <span>Dashboard</span>
          </Link>
          <span style={{ color: "var(--wa-border, #E5DFD5)" }}>/</span>
          <Link
            href={ROUTES.learner.mySessions}
            style={{
              color: "var(--wa-muted, #78716C)",
              textDecoration: "none",
              fontSize: "0.875rem",
              fontWeight: 600,
            }}
          >
            Sessions
          </Link>
          <span style={{ color: "var(--wa-border, #E5DFD5)" }}>/</span>
          <span style={{ fontSize: "0.875rem", color: "var(--wa-ink, #1C1917)", fontWeight: 600 }}>
            Session Detail
          </span>
        </div>
      </nav>

      <div style={{ maxWidth: "760px", margin: "2rem auto 0", padding: "0 1.25rem" }}>
        {/* Status Badge */}
        <div style={{ marginBottom: "1.25rem" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.45rem",
              background: status.bg,
              color: status.color,
              border: `1px solid ${status.border}`,
              borderRadius: "var(--wa-radius-sm, 8px)",
              padding: "0.35rem 0.85rem",
              fontSize: "0.8125rem",
              fontWeight: 700,
              letterSpacing: "0.02em",
            }}
          >
            <StatusIcon size={14} strokeWidth={2} aria-hidden="true" />
            <span>{status.label}</span>
          </div>
        </div>

        {/* Main Session Card */}
        <div
          style={{
            background: "var(--wa-white, #FFFFFF)",
            border: "1px solid var(--wa-border, #E5DFD5)",
            borderRadius: "var(--wa-radius-lg, 12px)",
            padding: "2rem",
            boxShadow: "var(--wa-shadow-sm, 0 1px 2px rgba(28,25,23,0.04))",
          }}
        >
          {/* Header row: Participant Info */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "1rem",
              marginBottom: "1.75rem",
              paddingBottom: "1.5rem",
              borderBottom: "1px solid var(--wa-border, #E5DFD5)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <div
                style={{
                  width: "50px",
                  height: "50px",
                  borderRadius: "10px",
                  background: "var(--wa-green, #1B4D3E)",
                  color: "#FFFFFF",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.125rem",
                  fontWeight: 700,
                  flexShrink: 0,
                }}
                aria-hidden="true"
              >
                {otherPartyInitials}
              </div>
              <div>
                <div
                  style={{
                    fontSize: "0.75rem",
                    color: "var(--wa-muted, #78716C)",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                  }}
                >
                  {isStudent ? "Verified Peer Tutor" : "Enrolled Learner"}
                </div>
                <h1
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontSize: "1.5rem",
                    fontWeight: 600,
                    color: "var(--wa-ink)",
                    margin: "0.15rem 0 0",
                  }}
                >
                  {otherPartyName}
                </h1>
              </div>
            </div>

            {isStudent && (
              <Link
                href={`/tutor/${booking.tutor.id}`}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.35rem",
                  fontSize: "0.8125rem",
                  fontWeight: 600,
                  color: "var(--wa-green, #1B4D3E)",
                  textDecoration: "none",
                  padding: "0.4rem 0.85rem",
                  borderRadius: "var(--wa-radius-sm, 8px)",
                  background: "var(--wa-green-light, #EAF2EE)",
                  border: "1px solid #C6DEC6",
                }}
              >
                <User size={14} aria-hidden="true" />
                <span>View Full Profile</span>
              </Link>
            )}
          </div>

          {/* Academic Detail Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
              gap: "0.875rem",
              marginBottom: "1.5rem",
            }}
          >
            <div
              style={{
                background: "var(--wa-contrast, #F3EFE8)",
                borderRadius: "var(--wa-radius-sm, 8px)",
                padding: "0.875rem",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.35rem",
                  fontSize: "0.75rem",
                  color: "var(--wa-muted, #78716C)",
                  fontWeight: 600,
                  marginBottom: "0.25rem",
                }}
              >
                <BookOpen size={13} aria-hidden="true" />
                <span>Subject</span>
              </div>
              <div style={{ fontSize: "0.9375rem", fontWeight: 700, color: "var(--wa-ink, #1C1917)" }}>
                {booking.subject}
              </div>
            </div>

            <div
              style={{
                background: "var(--wa-contrast, #F3EFE8)",
                borderRadius: "var(--wa-radius-sm, 8px)",
                padding: "0.875rem",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.35rem",
                  fontSize: "0.75rem",
                  color: "var(--wa-muted, #78716C)",
                  fontWeight: 600,
                  marginBottom: "0.25rem",
                }}
              >
                <GraduationCap size={13} aria-hidden="true" />
                <span>Grade</span>
              </div>
              <div style={{ fontSize: "0.9375rem", fontWeight: 700, color: "var(--wa-ink, #1C1917)" }}>
                {booking.grade}
              </div>
            </div>

            <div
              style={{
                background: "var(--wa-contrast, #F3EFE8)",
                borderRadius: "var(--wa-radius-sm, 8px)",
                padding: "0.875rem",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.35rem",
                  fontSize: "0.75rem",
                  color: "var(--wa-muted, #78716C)",
                  fontWeight: 600,
                  marginBottom: "0.25rem",
                }}
              >
                <Clock size={13} aria-hidden="true" />
                <span>Duration</span>
              </div>
              <div style={{ fontSize: "0.9375rem", fontWeight: 700, color: "var(--wa-ink, #1C1917)" }}>
                {durationMinutes} minutes
              </div>
            </div>

            <div
              style={{
                background: "var(--wa-contrast, #F3EFE8)",
                borderRadius: "var(--wa-radius-sm, 8px)",
                padding: "0.875rem",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.35rem",
                  fontSize: "0.75rem",
                  color: "var(--wa-muted, #78716C)",
                  fontWeight: 600,
                  marginBottom: "0.25rem",
                }}
              >
                <ShieldCheck size={13} aria-hidden="true" />
                <span>Format</span>
              </div>
              <div style={{ fontSize: "0.9375rem", fontWeight: 700, color: "var(--wa-ink, #1C1917)" }}>
                1-on-1 Mentorship
              </div>
            </div>
          </div>

          {/* Session Schedule Panel */}
          <div
            style={{
              background: "var(--wa-green-light, #EAF2EE)",
              border: "1px solid #C6DEC6",
              borderRadius: "var(--wa-radius-sm, 8px)",
              padding: "1rem 1.25rem",
              marginBottom: "1.25rem",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.4rem",
                fontSize: "0.75rem",
                fontWeight: 700,
                color: "var(--wa-green, #1B4D3E)",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                marginBottom: "0.3rem",
              }}
            >
              <Calendar size={14} aria-hidden="true" />
              <span>Scheduled Appointment</span>
            </div>
            <div style={{ fontSize: "1rem", fontWeight: 700, color: "var(--wa-ink, #1C1917)" }}>
              <FormattedDateTime date={booking.startTime} />
            </div>
            <div style={{ fontSize: "0.8125rem", color: "var(--wa-muted, #78716C)", marginTop: "0.2rem" }}>
              Displayed in your local timezone · {durationMinutes}-minute verified session
            </div>
          </div>

          {/* Topic & Learning Goals */}
          {booking.topic && (
            <div
              style={{
                background: "var(--wa-white, #FFFFFF)",
                border: "1px solid var(--wa-border, #E5DFD5)",
                borderRadius: "var(--wa-radius-sm, 8px)",
                padding: "1rem 1.25rem",
                marginBottom: "1.25rem",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.4rem",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  color: "var(--wa-muted, #78716C)",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  marginBottom: "0.35rem",
                }}
              >
                <FileText size={14} aria-hidden="true" />
                <span>Session Learning Goals</span>
              </div>
              <div style={{ fontSize: "0.9375rem", color: "var(--wa-ink, #1C1917)", lineHeight: 1.6 }}>
                {booking.topic}
              </div>
              {booking.helpNeeded && (
                <div
                  style={{
                    marginTop: "0.4rem",
                    fontSize: "0.875rem",
                    color: "var(--wa-muted, #78716C)",
                    borderTop: "1px dashed var(--wa-border, #E5DFD5)",
                    paddingTop: "0.4rem",
                  }}
                >
                  {booking.helpNeeded}
                </div>
              )}
            </div>
          )}

          {/* Video Room Launch / CTA Box */}
          {!isCanceled && (
            <div
              style={{
                background: zoomIsActive
                  ? "var(--wa-green, #1B4D3E)"
                  : "var(--wa-contrast, #F3EFE8)",
                color: zoomIsActive ? "#FFFFFF" : "var(--wa-ink, #1C1917)",
                borderRadius: "var(--wa-radius-md, 10px)",
                padding: "1.5rem",
                textAlign: "center",
                marginBottom: "1.25rem",
                border: zoomIsActive ? "none" : "1px solid var(--wa-border, #E5DFD5)",
              }}
            >
              {zoomIsActive && activeMeetingLink ? (
                <div>
                  <div
                    style={{
                      fontSize: "0.875rem",
                      fontWeight: 600,
                      marginBottom: "0.875rem",
                      color: "#EAF2EE",
                    }}
                  >
                    {isTutor
                      ? "Start your 1-on-1 tutoring session (Host Room)"
                      : "Your room is open. Click below to enter the live session."}
                  </div>
                  <a
                    href={activeMeetingLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      background: "#FFFFFF",
                      color: "var(--wa-green, #1B4D3E)",
                      fontWeight: 700,
                      fontSize: "0.9375rem",
                      padding: "0.85rem 2.25rem",
                      borderRadius: "var(--wa-radius-sm, 8px)",
                      textDecoration: "none",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
                    }}
                  >
                    <Video size={18} aria-hidden="true" />
                    <span>{isTutor ? "Start Live Session" : "Join Session Now"}</span>
                  </a>
                </div>
              ) : zoomIsActive && !activeMeetingLink ? (
                <div
                  style={{
                    color: "var(--wa-muted, #78716C)",
                    fontSize: "0.9rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.4rem",
                  }}
                >
                  <AlertTriangle size={16} color="#B45309" aria-hidden="true" />
                  <span>Meeting link is being generated. Please refresh this page in a moment.</span>
                </div>
              ) : isCompleted ? (
                <div>
                  <div style={{ fontWeight: 700, marginBottom: "0.35rem", fontSize: "0.9375rem" }}>
                    Session Concluded
                  </div>
                  {isStudent && !booking.hoursCredited && (
                    <div style={{ margin: "1rem 0", background: "#EFF6FF", border: "1px solid #BFDBFE", borderRadius: "8px", padding: "1rem", textAlign: "left" }}>
                      <div style={{ fontWeight: 600, color: "#1E40AF", marginBottom: "0.35rem", fontSize: "0.875rem" }}>
                        Did this tutoring session take place?
                      </div>
                      <p style={{ margin: "0 0 0.75rem", fontSize: "0.8125rem", color: "#3B82F6", lineHeight: 1.4 }}>
                        Please confirm whether you and <strong>{tutorName}</strong> met for this lesson so we can keep your learning records and session history up to date.
                      </p>
                      <form action={async () => {
                        "use server";
                        await confirmStudentAttendance(booking.id, true);
                      }}>
                        <button
                          type="submit"
                          style={{
                            background: "var(--wa-green, #1B4D3E)",
                            color: "#fff",
                            border: "none",
                            borderRadius: "6px",
                            padding: "0.5rem 1.25rem",
                            fontSize: "0.85rem",
                            fontWeight: 600,
                            cursor: "pointer",
                          }}
                        >
                          <span style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem" }}>
                            <Check size={15} /> Confirm I Attended This Session
                          </span>
                        </button>
                      </form>
                    </div>
                  )}
                  {booking.hoursCredited && (
                    <div style={{ margin: "0.6rem 0", color: "#166534", fontSize: "0.8125rem", fontWeight: 600, display: "inline-flex", alignItems: "center", gap: "0.35rem" }}>
                      <CheckCircle2 size={15} color="#166534" />
                      <span>{isStudent ? "Session completed • Attendance verified" : "Student attendance verified • Volunteer service hours accredited"}</span>
                    </div>
                  )}
                  {isTutor && !booking.hoursCredited && (
                    <div style={{ margin: "0.75rem 0", color: "#92400E", fontSize: "0.8125rem", fontWeight: 500, background: "#FEF3C7", padding: "0.5rem 0.75rem", borderRadius: "6px" }}>
                      Awaiting student attendance confirmation before volunteer hours are accredited.
                    </div>
                  )}
                  {booking.recordingUrl ? (
                    <a
                      href={booking.recordingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        color: "var(--wa-green, #1B4D3E)",
                        fontWeight: 700,
                        fontSize: "0.875rem",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.35rem",
                        marginTop: "0.5rem",
                      }}
                    >
                      <Video size={14} aria-hidden="true" />
                      <span>Watch Session Recording</span>
                    </a>
                  ) : (
                    <div style={{ fontSize: "0.8125rem", color: "var(--wa-muted, #78716C)", marginTop: "0.5rem" }}>
                      No cloud recording attached for this private session.
                    </div>
                  )}
                </div>
              ) : isUpcoming ? (
                <div>
                  <div
                    style={{
                      fontWeight: 600,
                      fontSize: "0.875rem",
                      color: "var(--wa-muted, #78716C)",
                      marginBottom: "0.75rem",
                    }}
                  >
                    {minutesUntilZoom > 60
                      ? `Meeting room opens ${Math.floor(minutesUntilZoom / 60)}h ${minutesUntilZoom % 60}m before session start.`
                      : minutesUntilZoom > 0
                      ? `Meeting room opens in ${minutesUntilZoom} minutes.`
                      : "Meeting room opens 15 minutes before scheduled start time."}
                  </div>
                  <div
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      background: "var(--wa-white, #FFFFFF)",
                      color: "var(--wa-muted, #78716C)",
                      fontWeight: 600,
                      fontSize: "0.875rem",
                      padding: "0.75rem 2rem",
                      borderRadius: "var(--wa-radius-sm, 8px)",
                      border: "1px solid var(--wa-border, #E5DFD5)",
                      cursor: "not-allowed",
                      opacity: 0.7,
                    }}
                  >
                    <Video size={16} aria-hidden="true" />
                    <span>Room Not Yet Open</span>
                  </div>
                </div>
              ) : null}
            </div>
          )}

          {/* Check-up Note */}
          {booking.checkUpNote && (
            <div
              style={{
                background: "#EFF6FF",
                border: "1px solid #BFDBFE",
                borderRadius: "var(--wa-radius-sm, 8px)",
                padding: "1rem 1.25rem",
                marginBottom: "1.25rem",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.4rem",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  color: "#1D4ED8",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  marginBottom: "0.3rem",
                }}
              >
                <MessageSquare size={14} aria-hidden="true" />
                <span>Tutor Progress Note</span>
              </div>
              <div style={{ fontSize: "0.9375rem", color: "#1E40AF", lineHeight: 1.6 }}>
                {booking.checkUpNote}
              </div>
            </div>
          )}

          {/* Student Review Section (for completed sessions) */}
          {isCompleted && isStudent && (
            existingReview ? (
              <div
                style={{
                  background: "var(--wa-green-light, #EAF2EE)",
                  border: "1px solid #C6DEC6",
                  borderRadius: "var(--wa-radius-sm, 8px)",
                  padding: "1.25rem",
                  marginBottom: "1.25rem",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.4rem",
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    color: "var(--wa-green, #1B4D3E)",
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    marginBottom: "0.35rem",
                  }}
                >
                  <Star size={14} fill="currentColor" aria-hidden="true" />
                  <span>Your Submitted Review</span>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.35rem",
                    color: "#D97706",
                    marginBottom: "0.35rem",
                  }}
                >
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      size={16}
                      fill={s <= existingReview.rating ? "#F59E0B" : "none"}
                      color={s <= existingReview.rating ? "#F59E0B" : "#CBD5E1"}
                      aria-hidden="true"
                    />
                  ))}
                  <span
                    style={{
                      fontSize: "0.875rem",
                      color: "var(--wa-ink, #1C1917)",
                      fontWeight: 700,
                      marginLeft: "0.35rem",
                    }}
                  >
                    ({existingReview.rating}/5)
                  </span>
                </div>
                {existingReview.comment && (
                  <div
                    style={{
                      fontSize: "0.9rem",
                      color: "var(--wa-ink, #1C1917)",
                      fontStyle: "italic",
                    }}
                  >
                    &ldquo;{existingReview.comment}&rdquo;
                  </div>
                )}
              </div>
            ) : (
              <div
                style={{
                  background: "var(--wa-contrast, #F3EFE8)",
                  border: "1px solid var(--wa-border, #E5DFD5)",
                  borderRadius: "var(--wa-radius-sm, 8px)",
                  padding: "1.25rem",
                  marginBottom: "1.25rem",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.4rem",
                    fontSize: "0.875rem",
                    fontWeight: 700,
                    color: "var(--wa-ink, #1C1917)",
                    marginBottom: "0.35rem",
                  }}
                >
                  <Star size={16} color="var(--wa-green, #1B4D3E)" aria-hidden="true" />
                  <span>Verify Volunteer Service &amp; Share Feedback</span>
                </div>
                <p
                  style={{
                    fontSize: "0.8125rem",
                    color: "var(--wa-muted, #78716C)",
                    marginBottom: "1rem",
                    lineHeight: 1.5,
                  }}
                >
                  Your feedback helps your tutor maintain their certified volunteer teaching record and informs future learners.
                </p>

                <form action={submitReview} style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
                  <input type="hidden" name="bookingId" value={booking.id} />
                  <div>
                    <label
                      htmlFor="review-rating"
                      style={{
                        display: "block",
                        fontSize: "0.75rem",
                        fontWeight: 700,
                        color: "var(--wa-ink, #1C1917)",
                        marginBottom: "0.35rem",
                      }}
                    >
                      Rating *
                    </label>
                    <select
                      id="review-rating"
                      name="rating"
                      defaultValue="5"
                      required
                      style={{
                        padding: "0.6rem 0.85rem",
                        borderRadius: "var(--wa-radius-sm, 8px)",
                        border: "1px solid var(--wa-border, #E5DFD5)",
                        fontSize: "0.875rem",
                        background: "#FFFFFF",
                        color: "var(--wa-ink, #1C1917)",
                        width: "100%",
                        maxWidth: "320px",
                      }}
                    >
                      <option value="5">5 ★ - Outstanding, clear and patient</option>
                      <option value="4">4 ★ - Great session, very helpful</option>
                      <option value="3">3 ★ - Good, answered core questions</option>
                      <option value="2">2 ★ - Needed pacing or technical improvement</option>
                      <option value="1">1 ★ - Poor session experience</option>
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="review-comment"
                      style={{
                        display: "block",
                        fontSize: "0.75rem",
                        fontWeight: 700,
                        color: "var(--wa-ink, #1C1917)",
                        marginBottom: "0.35rem",
                      }}
                    >
                      Comments / Feedback for Tutor (Optional)
                    </label>
                    <textarea
                      id="review-comment"
                      name="comment"
                      rows={2}
                      placeholder="What went well? What topic did you cover?"
                      style={{
                        width: "100%",
                        padding: "0.6rem 0.85rem",
                        borderRadius: "var(--wa-radius-sm, 8px)",
                        border: "1px solid var(--wa-border, #E5DFD5)",
                        fontSize: "0.875rem",
                        resize: "vertical",
                        fontFamily: "inherit",
                        color: "var(--wa-ink, #1C1917)",
                        background: "#FFFFFF",
                      }}
                    />
                  </div>

                  <button
                    type="submit"
                    style={{
                      alignSelf: "flex-start",
                      padding: "0.6rem 1.35rem",
                      background: "var(--wa-green, #1B4D3E)",
                      color: "#FFFFFF",
                      border: "none",
                      borderRadius: "var(--wa-radius-sm, 8px)",
                      fontWeight: 600,
                      fontSize: "0.875rem",
                      cursor: "pointer",
                      transition: "background 0.15s ease",
                    }}
                  >
                    Submit Review
                  </button>
                </form>
              </div>
            )
          )}

          {/* Action Links */}
          <div
            style={{
              display: "flex",
              gap: "0.75rem",
              flexWrap: "wrap",
              marginTop: "1.5rem",
              paddingTop: "1.25rem",
              borderTop: "1px solid var(--wa-border, #E5DFD5)",
            }}
          >
            <Link
              href={ROUTES.learner.findTutor}
              style={{
                flex: 1,
                minWidth: "160px",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.45rem",
                background: "var(--wa-white, #FFFFFF)",
                color: "var(--wa-ink, #1C1917)",
                border: "1px solid var(--wa-border, #E5DFD5)",
                borderRadius: "var(--wa-radius-sm, 8px)",
                padding: "0.7rem 1.25rem",
                fontWeight: 600,
                fontSize: "0.875rem",
                textDecoration: "none",
              }}
            >
              <Search size={15} aria-hidden="true" />
              <span>Book Another Session</span>
            </Link>

            <Link
              href={ROUTES.learner.mySessions}
              style={{
                flex: 1,
                minWidth: "160px",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.45rem",
                background: "var(--wa-green-light, #EAF2EE)",
                color: "var(--wa-green, #1B4D3E)",
                border: "1px solid #C6DEC6",
                borderRadius: "var(--wa-radius-sm, 8px)",
                padding: "0.7rem 1.25rem",
                fontWeight: 600,
                fontSize: "0.875rem",
                textDecoration: "none",
              }}
            >
              <Calendar size={15} aria-hidden="true" />
              <span>All Scheduled Sessions</span>
            </Link>
          </div>
        </div>

        {/* Audit / Identifier Note */}
        <div
          style={{
            textAlign: "center",
            marginTop: "1.5rem",
            fontSize: "0.75rem",
            color: "var(--wa-muted, #78716C)",
          }}
        >
          Session Record ID: <code style={{ background: "var(--wa-contrast, #F3EFE8)", padding: "0.15rem 0.4rem", borderRadius: "4px" }}>{booking.id}</code> · Learnivia Safeguarding &amp; Verified Volunteer Record
        </div>
      </div>
    </main>
  );
}
