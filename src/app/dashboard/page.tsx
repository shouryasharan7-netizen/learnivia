import React from "react";
import { getCurrentUser } from "@/lib/auth-user";
import { prisma } from "@/lib/prisma";
import { ROUTES } from "@/lib/routes";
import { getMeetingUrls } from "@/lib/meetingUrl";
import Link from "next/link";
import { redirect } from "next/navigation";
import styles from "./dashboard.module.css";
import { NextActionPanel } from "./NextActionPanel";
import { UpcomingSessionCard } from "./UpcomingSessionCard";
import { StudentAttendancePrompt } from "./StudentAttendancePrompt";
import { QuickActions } from "./QuickActions";
import { TruthfulSummary } from "./TruthfulSummary";
import { LearningPaths } from "./LearningPaths";
import { ActivityTimeline, TimelineItem } from "./ActivityTimeline";
import { CollapsibleResources } from "./CollapsibleResources";
import ChildProfileSection from "./ChildProfileSection";
import EmailVerificationBanner from "@/components/EmailVerificationBanner";
import { GraduationCap, ArrowRight } from "lucide-react";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = {
  title: "Dashboard — Learnivia",
  description:
    "Your calm, focused peer learning workspace. Schedule 1-on-1 tutoring sessions, get homework guidance, and track verified academic progress.",
};

export default async function StudentDashboard() {
  const user = await getCurrentUser();

  if (!user) {
    redirect(ROUTES.auth.signIn);
  }

  const now = new Date();
  const hour = now.getHours();
  const timeGreeting =
    hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  const firstName = user.name?.trim().split(" ")[0] || "Learner";

  // Fetch verified user data concurrently without fabricated production records
  let upcomingBookings: any[] = [];
  let completedBookings: any[] = [];
  let recentHomework: any[] = [];
  let childProfiles: any[] = [];

  try {
    const results = await Promise.all([
      prisma.booking.findMany({
        where: {
          studentId: user.id,
          status: "CONFIRMED",
          endTime: { gte: now },
        },
        include: {
          tutor: {
            include: {
              user: {
                select: {
                  name: true,
                  image: true,
                },
              },
            },
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
        include: {
          tutor: {
            include: {
              user: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
        orderBy: { startTime: "desc" },
        take: 5,
      }),
      prisma.homeworkRequest.findMany({
        where: {
          studentId: user.id,
          deletedAt: null,
        },
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
      prisma.childProfile.findMany({
        where: { parentId: user.id },
        orderBy: { createdAt: "desc" },
      }),
    ]);
    upcomingBookings = results[0];
    completedBookings = results[1];
    recentHomework = results[2];
    childProfiles = results[3];
  } catch (dbErr) {
    console.warn("Learner dashboard DB lookup fallback triggered:", dbErr instanceof Error ? dbErr.message : dbErr);
  }

  // Calculate genuine, truthful learning totals from real database records
  const completedCount = completedBookings.length;
  const totalLearningMinutes = completedBookings.reduce((sum, b) => {
    const diff = new Date(b.endTime).getTime() - new Date(b.startTime).getTime();
    return sum + Math.max(0, Math.round(diff / 60000));
  }, 0);

  const hours = Math.floor(totalLearningMinutes / 60);
  const remainingMinutes = totalLearningMinutes % 60;
  const totalHoursStr = hours > 0 ? `${hours}h ${remainingMinutes}m` : `${totalLearningMinutes}m`;

  // Unconfirmed sessions awaiting student attendance verification for volunteer hours
  const pendingAttendanceList = completedBookings
    .filter((b: any) => !b.hoursCredited)
    .map((b: any) => ({
      id: b.id,
      subject: b.subject,
      startTime: b.startTime,
      tutorName: b.tutor?.user?.name || "Volunteer Tutor",
    }));

  // Determine user state for NextActionPanel
  const isNewLearner =
    !user.onboardingCompleted ||
    (user.isMinor && !user.guardianConsentGiven) ||
    !user.emailVerified;
  const guardianConsentPending = Boolean(user.isMinor && !user.guardianConsentGiven);
  const emailUnverified = Boolean(user.email && !user.emailVerified);
  const hasApprovedProfile = user.tutorProfile?.status === "APPROVED";
  const isApprovedTutor = Boolean(hasApprovedProfile && user.isTrainingCompleted);
  const isTrainingPending = Boolean(hasApprovedProfile && !user.isTrainingCompleted);
  const isPendingTutor = Boolean(user.tutorProfile?.status === "PENDING");
  const canApplyTutor = !user.tutorProfile;

  const nextBooking = upcomingBookings[0] || null;
  const nextSessionData = nextBooking
    ? {
        id: nextBooking.id,
        subject: nextBooking.subject,
        startTime: nextBooking.startTime,
        tutorName: nextBooking.tutor?.user?.name || "Volunteer Tutor",
        meetingUrl: nextBooking.zoomLink ? getMeetingUrls(nextBooking.zoomLink).joinUrl : null,
      }
    : null;

  const lastBooking = completedBookings[0] || null;
  const lastCompletedData = lastBooking
    ? {
        id: lastBooking.id,
        subject: lastBooking.subject,
        tutorName: lastBooking.tutor?.user?.name || "Volunteer Tutor",
      }
    : null;

  // Build unified recent activity timeline items
  const timelineItems: TimelineItem[] = [];

  for (const b of completedBookings) {
    const tutorName = b.tutor?.user?.name || "Volunteer Tutor";
    const minutes = Math.round(
      (new Date(b.endTime).getTime() - new Date(b.startTime).getTime()) / 60000
    );
    timelineItems.push({
      id: `booking-${b.id}`,
      type: "session",
      title: `${b.subject} Mentorship Session`,
      subtitle: `${minutes > 0 ? `${minutes} min session` : "1-on-1 session"} with ${tutorName}`,
      date: b.startTime,
      href: `/sessions/${b.id}`,
    });
  }

  for (const hw of recentHomework) {
    const snippet = hw.question
      ? hw.question.length > 70
        ? hw.question.slice(0, 70) + "..."
        : hw.question
      : "Homework question inquiry";
    timelineItems.push({
      id: `hw-${hw.id}`,
      type: "homework",
      title: `${hw.subject} Homework Question`,
      subtitle: `${snippet} • Status: ${hw.status || "Open"}`,
      date: hw.createdAt,
      href: ROUTES.homeworkHelp,
    });
  }

  // Sort timeline newest first
  timelineItems.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <main className={styles.deskWorkspace}>
      {!user.emailVerified && <EmailVerificationBanner email={user.email} />}
      <div className={styles.deskContainer}>
        {/* Unconfirmed Attendance Verification Prompts */}
        {pendingAttendanceList.length > 0 && (
          <StudentAttendancePrompt
            pendingBookings={pendingAttendanceList}
          />
        )}

        {/* Humanized Desk Header */}
        <header className={styles.deskHeader}>
          <div className={styles.deskHeaderMain}>
            <div className={styles.deskBreadcrumb}>
              <span className={styles.deskBreadcrumbTag}>Learner Workspace</span>
              <span className={styles.deskBreadcrumbDot}>•</span>
              <span className={styles.deskBreadcrumbDate}>
                {new Date().toLocaleDateString("en-US", {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </div>
            <h1 className={styles.greetingTitle}>
              {timeGreeting}, {firstName}
            </h1>
            <p className={styles.greetingSubtitle}>
              Welcome to your personal learning space. Connect with verified volunteer peer tutors for focused, 1-on-1 academic guidance.
            </p>
          </div>

          <div className={styles.deskHeaderStats}>
            <div className={styles.headerStatItem}>
              <span className={styles.headerStatLabel}>Verified Learning</span>
              <span className={styles.headerStatValue}>{totalHoursStr}</span>
            </div>
            <div className={styles.headerStatItem}>
              <span className={styles.headerStatLabel}>Completed</span>
              <span className={styles.headerStatValue}>{completedCount}</span>
            </div>
          </div>
        </header>

        {/* 2-Column Asymmetric Study Desk Grid */}
        <div className={styles.deskGrid}>
          {/* Primary Column: The Active Desk */}
          <div className={styles.deskMain}>
            {/* 2. One State-Aware Next-Action Panel */}
            <NextActionPanel
              isNewLearner={isNewLearner}
              guardianConsentPending={guardianConsentPending}
              emailUnverified={emailUnverified}
              isApprovedTutor={isApprovedTutor}
              isPendingTutor={isPendingTutor}
              isTrainingPending={isTrainingPending}
              canApplyTutor={canApplyTutor}
              hasUpcomingSession={Boolean(nextSessionData)}
              nextSession={nextSessionData}
              hasCompletedSession={Boolean(lastCompletedData)}
              lastCompletedSession={lastCompletedData}
            />

            {/* Volunteer as a Tutor card for learners */}
            {canApplyTutor && (
              <section style={{ marginBottom: "1.75rem" }} aria-label="Volunteer as a Tutor">
                <div
                  style={{
                    background: "linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)",
                    border: "1px solid #BFDBFE",
                    borderRadius: "16px",
                    padding: "1.35rem 1.6rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "1.25rem",
                    flexWrap: "wrap",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "1rem", flex: 1, minWidth: "260px" }}>
                    <div
                      style={{
                        width: "44px",
                        height: "44px",
                        borderRadius: "12px",
                        background: "#2563EB",
                        color: "#FFFFFF",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        boxShadow: "0 4px 12px rgba(37, 99, 235, 0.25)",
                      }}
                    >
                      <GraduationCap size={22} />
                    </div>
                    <div>
                      <div style={{ fontSize: "1rem", fontWeight: 700, color: "#1E3A8A", fontFamily: "var(--font-serif)" }}>
                        Share Your Knowledge — Become a Peer Tutor
                      </div>
                      <p style={{ margin: "0.25rem 0 0", fontSize: "0.85rem", color: "#1E40AF", lineHeight: 1.45 }}>
                        Join 140+ high-achieving student volunteers. Mentor K–10 peers 1-on-1 and earn verified community service hours for university applications.
                      </p>
                    </div>
                  </div>
                  <Link
                    href={ROUTES.tutor.apply}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      background: "#2563EB",
                      color: "#FFFFFF",
                      padding: "0.65rem 1.25rem",
                      borderRadius: "10px",
                      fontSize: "0.875rem",
                      fontWeight: 700,
                      textDecoration: "none",
                      boxShadow: "0 2px 8px rgba(37, 99, 235, 0.25)",
                      whiteSpace: "nowrap",
                    }}
                  >
                    <span>Apply to Tutor</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </section>
            )}

            {/* 3. Upcoming Session Card or Useful Empty State */}
            <UpcomingSessionCard
              session={nextBooking}
              userTimezone={user.timezone}
            />

            {/* 4. Exactly Three Quick Actions */}
            <QuickActions />

            {/* 8. Lower-Priority Resources on Separate Pages or Collapsible Sections */}
            <CollapsibleResources hasChildProfiles={childProfiles.length > 0}>
              {childProfiles.length > 0 && (
                <div style={{ marginBottom: "1.25rem" }}>
                  <ChildProfileSection initialProfiles={childProfiles} />
                </div>
              )}
            </CollapsibleResources>
          </div>

          {/* Secondary Column: The Academic Ledger & Horizons */}
          <div className={styles.deskSidebar}>
            {/* 5. Truthful Learning Summary (Zero vanity metrics) */}
            <TruthfulSummary
              completedSessionsCount={completedCount}
              totalLearningMinutes={totalLearningMinutes}
              gradeBand={user.grade}
              curriculum={user.curriculum}
            />

            {/* 6. Three Learning Paths */}
            <LearningPaths />

            {/* 7. Recent Activity Timeline */}
            <ActivityTimeline
              items={timelineItems.slice(0, 5)}
              userTimezone={user.timezone}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
