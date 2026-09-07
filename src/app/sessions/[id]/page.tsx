import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { FormattedDateTime } from "@/components/FormattedDateTime";
import { getMeetingUrls } from "@/lib/meetingUrl";
import { submitReview } from "@/app/actions/sessions";
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
  if (!booking) return { title: "Session Not Found — Learnivia" };
  return {
    title: `${booking.subject} Session — ${booking.grade} | Learnivia`,
    description: `Your 1-on-1 Learnivia tutoring session for ${booking.grade} ${booking.subject}.`,
  };
}

export default async function SessionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user?.id) redirect("/signin");

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
  if (!isStudent && !isTutor) redirect("/dashboard");

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

  type StatusKey = "LIVE" | "CONFIRMED_UPCOMING" | "ENDED" | "COMPLETED" | "CANCELED";
  const getStatusConfig = (): { key: StatusKey; label: string; color: string; bg: string; border: string } => {
    if (isLive) return { key: "LIVE", label: "🔴 LIVE NOW", color: "#DC2626", bg: "#FEF2F2", border: "#FECACA" };
    if (isCanceled) return { key: "CANCELED", label: "❌ Cancelled", color: "#DC2626", bg: "#FEF2F2", border: "#FECACA" };
    if (isCompleted) return { key: "COMPLETED", label: "✅ Completed", color: "#0D683B", bg: "#F0FDF4", border: "#BBF7D0" };
    if (isUpcoming) return { key: "CONFIRMED_UPCOMING", label: "✅ Confirmed", color: "#0D683B", bg: "#F0FDF4", border: "#BBF7D0" };
    return { key: "ENDED", label: "⏱ Session Ended", color: "#6B7280", bg: "#F9FAFB", border: "#E5E7EB" };
  };
  const status = getStatusConfig();
  const tutorName = booking.tutor.user.name || "Your Tutor";

  return (
    <main style={{ minHeight: "100vh", background: "#F9FAFB", fontFamily: "var(--font-body, Inter, sans-serif)", paddingBottom: "4rem" }}>
      {/* Top bar */}
      <nav style={{ background: "#fff", borderBottom: "1px solid #E5E7EB", padding: "1rem 1.5rem", display: "flex", alignItems: "center", gap: "0.75rem" }}>
        <Link href="/dashboard" style={{ color: "#6B7280", textDecoration: "none", fontSize: "0.875rem", fontWeight: 600 }}>← Dashboard</Link>
        <span style={{ color: "#D1D5DB" }}>•</span>
        <span style={{ fontSize: "0.875rem", color: "#374151", fontWeight: 600 }}>Session Detail</span>
      </nav>

      <div style={{ maxWidth: "740px", margin: "2rem auto", padding: "0 1.25rem" }}>
        {/* Status */}
        <div style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", background: status.bg, color: status.color, border: `1px solid ${status.border}`, borderRadius: "999px", padding: "0.35rem 0.9rem", fontSize: "0.875rem", fontWeight: 800, marginBottom: "1.5rem" }}>
          {status.label}
        </div>

        {/* Main Card */}
        <div style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: "1.25rem", padding: "2rem", boxShadow: "0 1px 8px rgba(0,0,0,0.04)" }}>
          {/* Tutor row */}
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.75rem", paddingBottom: "1.75rem", borderBottom: "1px solid #F3F4F6" }}>
            <div style={{ width: "52px", height: "52px", borderRadius: "50%", background: "linear-gradient(135deg,#0E8345,#1a6b3a)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.25rem", fontWeight: 800, flexShrink: 0 }}>
              {isStudent ? tutorName.charAt(0).toUpperCase() : (booking.student.name || "S").charAt(0).toUpperCase()}
            </div>
            <div>
              <div style={{ fontSize: "0.75rem", color: "#6B7280", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                {isStudent ? "Your Tutor" : "Your Student"}
              </div>
              <div style={{ fontSize: "1.125rem", fontWeight: 800, color: "#111827" }}>
                {isStudent ? tutorName : (booking.student.name || "Student")}
              </div>
              {isStudent && (
                <Link href={`/tutor/${booking.tutor.id}`} style={{ fontSize: "0.8125rem", color: "#0E8345", fontWeight: 600, textDecoration: "none" }}>
                  View profile →
                </Link>
              )}
            </div>
          </div>

          {/* Detail grid */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.5rem" }}>
            {[
              { label: "Subject", value: booking.subject, icon: "📚" },
              { label: "Grade", value: booking.grade, icon: "🎓" },
              { label: "Duration", value: `${durationMinutes} min`, icon: "⏱" },
              { label: "Status", value: booking.status, icon: "📋" },
            ].map(({ label, value, icon }) => (
              <div key={label} style={{ background: "#F9FAFB", borderRadius: "0.75rem", padding: "0.875rem" }}>
                <div style={{ fontSize: "0.75rem", color: "#6B7280", fontWeight: 600, marginBottom: "0.2rem" }}>{icon} {label}</div>
                <div style={{ fontSize: "0.9375rem", fontWeight: 700, color: "#111827" }}>{value}</div>
              </div>
            ))}
          </div>

          {/* Date/time */}
          <div style={{ background: "#F0FDF4", border: "1px solid #BBF7D0", borderRadius: "0.75rem", padding: "1rem 1.25rem", marginBottom: "1.25rem" }}>
            <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#0D683B", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "0.3rem" }}>📅 Session Time</div>
            <div style={{ fontSize: "0.9375rem", fontWeight: 700, color: "#111827" }}>
              <FormattedDateTime date={booking.startTime} />
            </div>
            <div style={{ fontSize: "0.8rem", color: "#6B7280", marginTop: "0.2rem" }}>Displayed in your local timezone · {durationMinutes} min session</div>
          </div>

          {/* Topic */}
          {booking.topic && (
            <div style={{ background: "#F9FAFB", borderRadius: "0.75rem", padding: "1rem 1.25rem", marginBottom: "1.25rem" }}>
              <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#374151", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "0.3rem" }}>📝 Topic</div>
              <div style={{ fontSize: "0.9375rem", color: "#111827", lineHeight: 1.6 }}>{booking.topic}</div>
              {booking.helpNeeded && <div style={{ marginTop: "0.4rem", fontSize: "0.875rem", color: "#6B7280" }}>{booking.helpNeeded}</div>}
            </div>
          )}

          {/* Zoom CTA */}
          {!isCanceled && (
            <div style={{ background: zoomIsActive ? "linear-gradient(135deg,#0E8345,#0a6b35)" : "#F3F4F6", borderRadius: "1rem", padding: "1.5rem", textAlign: "center", marginBottom: "1rem", border: zoomIsActive ? "2px solid #0E8345" : "2px solid #E5E7EB" }}>
              {zoomIsActive && activeMeetingLink ? (
                <>
                  <div style={{ color: "#fff", fontWeight: 600, fontSize: "0.875rem", marginBottom: "0.75rem" }}>
                    {isTutor ? "🎥 Start your session (Host View)" : "🔗 Your session is ready — join now"}
                  </div>
                  <a href={activeMeetingLink} target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", background: "#fff", color: "#0E8345", fontWeight: 800, fontSize: "1rem", padding: "0.875rem 2.5rem", borderRadius: "999px", textDecoration: "none", boxShadow: "0 2px 8px rgba(0,0,0,0.12)" }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M4.5 4a2.5 2.5 0 0 0-2.5 2.5v11A2.5 2.5 0 0 0 4.5 20h11a2.5 2.5 0 0 0 2.5-2.5V15l4 3V6l-4 3V6.5A2.5 2.5 0 0 0 15.5 4h-11z" /></svg>
                    {isTutor ? "Start Live Session" : "Join Session"}
                  </a>
                </>
              ) : zoomIsActive && !activeMeetingLink ? (
                <div style={{ color: "#6B7280", fontWeight: 600, fontSize: "0.9rem" }}>⚠️ Meeting room link not set — please refresh in a moment or contact support.</div>
              ) : isCompleted ? (
                <div style={{ color: "#6B7280" }}>
                  <div style={{ fontWeight: 700, marginBottom: "0.4rem" }}>Session ended</div>
                  {booking.recordingUrl ? (
                    <a href={booking.recordingUrl} target="_blank" rel="noopener noreferrer" style={{ color: "#2563EB", fontWeight: 700, fontSize: "0.9rem" }}>📹 Watch session recording</a>
                  ) : (
                    <div style={{ fontSize: "0.875rem" }}>No recording for this session.</div>
                  )}
                </div>
              ) : isUpcoming ? (
                <>
                  <div style={{ color: "#374151", fontWeight: 700, fontSize: "0.875rem", marginBottom: "0.5rem" }}>
                    🕐 {minutesUntilZoom > 60
                      ? `Meeting room opens ${Math.floor(minutesUntilZoom / 60)}h ${minutesUntilZoom % 60}m before start`
                      : minutesUntilZoom > 0
                      ? `Meeting room opens in ${minutesUntilZoom} minutes`
                      : "Meeting room opens 15 minutes before your session"}
                  </div>
                  <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", background: "#E5E7EB", color: "#9CA3AF", fontWeight: 800, fontSize: "1rem", padding: "0.875rem 2.5rem", borderRadius: "999px", cursor: "not-allowed" }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M4.5 4a2.5 2.5 0 0 0-2.5 2.5v11A2.5 2.5 0 0 0 4.5 20h11a2.5 2.5 0 0 0 2.5-2.5V15l4 3V6l-4 3V6.5A2.5 2.5 0 0 0 15.5 4h-11z" /></svg>
                    Join Session
                  </div>
                </>
              ) : null}
            </div>
          )}

          {/* Check-up note */}
          {booking.checkUpNote && (
            <div style={{ background: "#EFF6FF", border: "1px solid #BFDBFE", borderRadius: "0.75rem", padding: "1rem 1.25rem", marginBottom: "1rem" }}>
              <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#1D4ED8", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "0.3rem" }}>💬 Check-up from your tutor</div>
              <div style={{ fontSize: "0.9375rem", color: "#1E40AF", lineHeight: 1.6 }}>{booking.checkUpNote}</div>
            </div>
          )}

          {/* Student Review Section (for completed sessions) */}
          {isCompleted && isStudent && (
            existingReview ? (
              <div style={{ background: "#F0FDF4", border: "1px solid #BBF7D0", borderRadius: "0.75rem", padding: "1.25rem", marginBottom: "1rem" }}>
                <div style={{ fontSize: "0.8rem", fontWeight: 700, color: "#0D683B", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "0.4rem" }}>⭐ Your Rating &amp; Review</div>
                <div style={{ fontSize: "1.1rem", color: "#F59E0B", marginBottom: "0.25rem" }}>
                  {"★".repeat(existingReview.rating)}{"☆".repeat(5 - existingReview.rating)}{" "}
                  <span style={{ fontSize: "0.9rem", color: "#374151", fontWeight: 700 }}>({existingReview.rating}/5)</span>
                </div>
                {existingReview.comment && (
                  <div style={{ fontSize: "0.9rem", color: "#374151", fontStyle: "italic" }}>&ldquo;{existingReview.comment}&rdquo;</div>
                )}
              </div>
            ) : (
              <div style={{ background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: "0.75rem", padding: "1.25rem", marginBottom: "1rem" }}>
                <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#1E293B", marginBottom: "0.3rem" }}>⭐ Rate Your Volunteer Tutoring Session</div>
                <p style={{ fontSize: "0.8rem", color: "#64748B", marginBottom: "0.75rem" }}>Your honest review helps your tutor and verifies their volunteer teaching record.</p>
                <form action={submitReview} style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  <input type="hidden" name="bookingId" value={booking.id} />
                  <div>
                    <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#475569", marginBottom: "0.25rem" }}>Rating *</label>
                    <select name="rating" defaultValue="5" required style={{ padding: "0.5rem", borderRadius: "6px", border: "1px solid #CBD5E1", fontSize: "0.85rem", background: "#fff" }}>
                      <option value="5">★★★★★ 5 - Outstanding, super helpful!</option>
                      <option value="4">★★★★☆ 4 - Great session</option>
                      <option value="3">★★★☆☆ 3 - Good / helpful</option>
                      <option value="2">★★☆☆☆ 2 - Needed improvement</option>
                      <option value="1">★☆☆☆☆ 1 - Poor experience</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#475569", marginBottom: "0.25rem" }}>Feedback / Note for Tutor (Optional)</label>
                    <textarea name="comment" rows={2} placeholder="What was helpful? How did your tutor do?" style={{ width: "100%", padding: "0.5rem", borderRadius: "6px", border: "1px solid #CBD5E1", fontSize: "0.85rem", resize: "vertical" }} />
                  </div>
                  <button type="submit" style={{ alignSelf: "flex-start", padding: "0.5rem 1.25rem", background: "#0E8345", color: "#fff", border: "none", borderRadius: "6px", fontWeight: 700, fontSize: "0.85rem", cursor: "pointer" }}>
                    Submit Review
                  </button>
                </form>
              </div>
            )
          )}

          {/* Action buttons */}
          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", marginTop: "1.5rem" }}>
            <Link href={`/tutor/${booking.tutor.id}`} style={{ flex: 1, minWidth: "150px", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.4rem", background: "#F0FDF4", color: "#0E8345", border: "1.5px solid #BBF7D0", borderRadius: "0.75rem", padding: "0.75rem", fontWeight: 700, fontSize: "0.875rem", textDecoration: "none" }}>
              👤 Tutor Profile
            </Link>
            <Link href="/find" style={{ flex: 1, minWidth: "150px", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.4rem", background: "#F3F4F6", color: "#374151", border: "1.5px solid #E5E7EB", borderRadius: "0.75rem", padding: "0.75rem", fontWeight: 700, fontSize: "0.875rem", textDecoration: "none" }}>
              🔍 Book Another
            </Link>
          </div>
        </div>

        <div style={{ textAlign: "center", marginTop: "1.25rem", fontSize: "0.75rem", color: "#9CA3AF" }}>
          Session ID: <code style={{ background: "#F3F4F6", padding: "0.1rem 0.35rem", borderRadius: "4px" }}>{booking.id}</code> — Reference this ID when contacting support.
        </div>
      </div>
    </main>
  );
}
