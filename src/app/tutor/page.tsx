import React from "react";
import styles from "./page.module.css";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { redirect } from "next/navigation";
import { addAvailability, removeAvailability } from "./actions";
import { completeSession, cancelBooking } from "@/app/actions/sessions";
import { completeWorkshop } from "@/app/actions/workshops";
import { ScheduleWorkshopForm } from "./ScheduleWorkshopForm";
import { FormattedDateTime } from "@/components/FormattedDateTime";
import { getMeetingUrls } from "@/lib/meetingUrl";
import { EmptyState } from "@/components/ui/EmptyState";
import { ROUTES } from "@/lib/routes";
import {
  Clock,
  Users,
  CheckCircle2,
  BookOpen,
  Plus,
  FileText,
  Video,
  Calendar,
  GraduationCap,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  X,
  Sparkles,
} from "lucide-react";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = {
  title: "Tutor Workspace — Learnivia",
  description: "Manage volunteer tutoring sessions, host live workshops, and view verified service hours.",
};

const DAYS_OF_WEEK = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export default async function TutorDashboard() {
  const session = await auth();

  if (!session?.user) {
    return (
      <main className={styles.page}>
        <div className={styles.container}>
          <div className={styles.authNoticeCard}>
            <div className={styles.authNoticeIcon}>
              <GraduationCap size={24} aria-hidden="true" />
            </div>
            <h1 className={styles.title} style={{ marginBottom: "0.5rem" }}>
              Sign In to Tutor Workspace
            </h1>
            <p className={styles.subtitle} style={{ marginBottom: "1.5rem" }}>
              Please log in to manage your volunteer tutoring appointments, workshops, and service record.
            </p>
            <Link href="/signin?callbackUrl=/tutor" className={styles.primaryBtn} style={{ display: "inline-flex" }}>
              Sign In to Your Account
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // Safely resolve userId and role with DB fallback
  let userId = session.user.id;
  let userRole = session.user.role;

  if ((!userId || !userRole) && session.user.email) {
    try {
      const dbUser = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: { id: true, role: true, name: true },
      });
      if (dbUser) {
        userId = dbUser.id;
        userRole = dbUser.role;
      }
    } catch {
      // ignore
    }
  }

  if (!userId) {
    return (
      <main className={styles.page}>
        <div className={styles.container}>
          <div className={styles.authNoticeCard}>
            <div className={styles.authNoticeIcon}>
              <GraduationCap size={24} aria-hidden="true" />
            </div>
            <h1 className={styles.title} style={{ marginBottom: "0.5rem" }}>
              Session Required
            </h1>
            <p className={styles.subtitle} style={{ marginBottom: "1.5rem" }}>
              Please sign in again to access the Tutor Workspace.
            </p>
            <Link href="/signin?callbackUrl=/tutor" className={styles.primaryBtn} style={{ display: "inline-flex" }}>
              Sign In
            </Link>
          </div>
        </div>
      </main>
    );
  }

  let tutor: any = null;
  try {
    tutor = await prisma.tutorProfile.findUnique({
      where: { userId },
      include: {
        availabilities: true,
        subjects: true,
        trainingModules: true,
      },
    });

    // If user is an ADMIN or testing, ensure they have an approved profile
    if (!tutor && userRole === "ADMIN") {
      tutor = await prisma.tutorProfile.create({
        data: {
          userId,
          status: "APPROVED",
          bio: "Administrator & Lead Volunteer Mentor",
          school: "Learnivia Core Team",
          volunteerHours: 0.0,
        },
        include: {
          availabilities: true,
          subjects: true,
          trainingModules: true,
        },
      });
    }
  } catch (err) {
    console.warn("Tutor profile lookup fallback:", err);
  }

  if (!tutor) {
    return (
      <main className={styles.page}>
        <div className={styles.container}>
          <div className={styles.authNoticeCard}>
            <div className={styles.authNoticeIcon}>
              <Sparkles size={24} aria-hidden="true" />
            </div>
            <h1 className={styles.title} style={{ marginBottom: "0.5rem" }}>
              Become a Volunteer Tutor
            </h1>
            <p className={styles.subtitle} style={{ marginBottom: "1.5rem" }}>
              You do not have an active volunteer tutor profile yet. Join our global community of academic peer educators.
            </p>
            <Link href={ROUTES.tutor.apply} className={styles.primaryBtn} style={{ display: "inline-flex" }}>
              Start Volunteer Application <ArrowRight size={14} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const passedModules = (tutor.trainingModules || []).filter((m: any) => m.quizPassed).length;

  if (tutor.status === "PENDING") {
    return (
      <main className={styles.page}>
        <div className={styles.container}>
          <div className={styles.authNoticeCard} style={{ maxWidth: "600px" }}>
            <div className={styles.authNoticeIcon} style={{ background: "#FEF3C7", color: "#92400E" }}>
              <Clock size={24} aria-hidden="true" />
            </div>
            <h1 className={styles.title} style={{ marginBottom: "0.5rem" }}>
              Application Pending Review
            </h1>
            <p className={styles.subtitle} style={{ marginBottom: "1.5rem" }}>
              Your tutor application is currently being reviewed by the Learnivia Academic Board. To prepare for approval, please complete all 5 mandatory Safeguarding &amp; Tutoring training modules.
            </p>

            <div
              style={{
                margin: "1.5rem 0",
                background: passedModules === 5 ? "var(--wa-green-light)" : "#FFFBEB",
                border: `1px solid ${passedModules === 5 ? "var(--wa-border)" : "#FDE68A"}`,
                padding: "1.25rem",
                borderRadius: "var(--wa-radius-md)",
                textAlign: "left",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                <span style={{ fontWeight: 600, fontSize: "0.875rem", color: "var(--wa-ink)", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                  <ShieldCheck size={16} color="var(--wa-green)" />
                  Safeguarding &amp; Tutoring Modules
                </span>
                <span style={{ fontSize: "0.8125rem", fontWeight: 700, color: passedModules === 5 ? "var(--wa-green)" : "#92400E" }}>
                  {passedModules} of 5 Completed
                </span>
              </div>
              <div style={{ background: "var(--wa-border)", borderRadius: "999px", height: "6px", overflow: "hidden" }}>
                <div
                  style={{
                    background: passedModules === 5 ? "var(--wa-green)" : "#D97706",
                    width: `${(passedModules / 5) * 100}%`,
                    height: "100%",
                    transition: "width 0.3s ease",
                  }}
                />
              </div>
            </div>

            <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap" }}>
              <Link href={ROUTES.tutor.training} className={styles.primaryBtn}>
                <GraduationCap size={15} />
                <span>Complete Training Modules ({passedModules}/5)</span>
              </Link>
              <Link href={ROUTES.learner.home} className={styles.secondaryBtn}>
                Return to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (tutor.status === "REJECTED") {
    return (
      <main className={styles.page}>
        <div className={styles.container}>
          <div className={styles.authNoticeCard}>
            <div className={styles.authNoticeIcon} style={{ background: "#FEE2E2", color: "#991B1B" }}>
              <AlertTriangle size={24} aria-hidden="true" />
            </div>
            <h1 className={styles.title} style={{ marginBottom: "0.5rem" }}>
              Application Status Update
            </h1>
            <p className={styles.subtitle} style={{ marginBottom: "1.5rem" }}>
              Your volunteer tutor application was not approved at this time. If you have questions regarding this decision, please contact our support team.
            </p>
            <Link href={ROUTES.support} className={styles.secondaryBtn} style={{ display: "inline-flex" }}>
              Contact Support
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // Mandatory Safeguarding & Training Gate:
  // Approved tutors cannot access the dashboard or host sessions until completing all 5 training modules.
  if (passedModules < 5) {
    redirect(ROUTES.tutor.training);
  }

  let rawWorkshops: any[] = [];
  let rawBookings: any[] = [];

  try {
    const results = await Promise.all([
      prisma.workshop.findMany({
        where: { tutorId: tutor.id },
        include: {
          enrollments: { include: { student: true } },
        },
        orderBy: { startTime: "asc" },
      }),
      prisma.booking.findMany({
        where: { tutorId: tutor.id },
        include: { student: true },
        orderBy: { startTime: "asc" },
      }),
    ]);
    rawWorkshops = results[0];
    rawBookings = results[1];
  } catch (dbErr) {
    console.warn("Tutor data fetch fallback:", dbErr);
  }

  const upcomingBookings = rawBookings.filter((b) => b && b.status === "CONFIRMED");
  const completedBookings = rawBookings.filter((b) => b && b.status === "COMPLETED");
  const completedWorkshops = rawWorkshops.filter((w) => w && w.status === "COMPLETED");
  const upcomingWorkshops = rawWorkshops.filter((w) => w && w.status === "UPCOMING");

  // Real-time calculation of verified service hours
  const bookingMinutes = completedBookings.reduce((sum, b) => {
    const dur = Math.max(15, (new Date(b.endTime).getTime() - new Date(b.startTime).getTime()) / (1000 * 60));
    return sum + dur;
  }, 0);
  const workshopMinutes = completedWorkshops.reduce((sum, w) => {
    const dur = Math.max(15, (new Date(w.endTime).getTime() - new Date(w.startTime).getTime()) / (1000 * 60));
    return sum + dur;
  }, 0);
  const tutorHours = Math.round(((bookingMinutes + workshopMinutes) / 60) * 10) / 10;
  const uniqueStudents = new Set(completedBookings.map((b) => b?.studentId).filter(Boolean)).size;

  const availabilityByDay = DAYS_OF_WEEK.map((name, index) => ({
    name,
    index,
    slots: (tutor.availabilities || [])
      .filter((a: any) => a && a.dayOfWeek === index)
      .sort((a: any, b: any) => (a.startTime || "").localeCompare(b.startTime || "")),
  }));

  const tutorName = session.user.name || "Volunteer Tutor";

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        {/* Safeguarding & Training Progress Notification */}
        {passedModules < 5 && (
          <div className={styles.trainingBanner}>
            <div className={styles.trainingBannerLeft}>
              <div className={styles.trainingBannerIcon}>
                <ShieldCheck size={18} aria-hidden="true" />
              </div>
              <div className={styles.trainingBannerText}>
                <strong>Training in progress ({passedModules}/5 completed):</strong> Complete all 5 safeguarding modules to verify your tutor credential and maintain session compliance.
              </div>
            </div>
            <Link href={ROUTES.tutor.training} className={styles.trainingBannerAction}>
              Continue Training <ArrowRight size={13} aria-hidden="true" />
            </Link>
          </div>
        )}

        {/* Header Row */}
        <header className={styles.headerRow}>
          <div className={styles.headerTitleCol}>
            <div className={styles.badgeRow}>
              <span className={styles.verifiedBadge}>
                <CheckCircle2 size={13} aria-hidden="true" />
                Verified Tutor
              </span>
              <span className={styles.hoursBadge}>
                <Clock size={13} aria-hidden="true" />
                {tutorHours.toFixed(1)} Hours Verified
              </span>
            </div>
            <h1 className={styles.title}>{tutorName}&apos;s Tutor Workspace</h1>
            <p className={styles.subtitle}>
              Manage 1-on-1 tutoring appointments, schedule group workshops, and maintain your official service record.
            </p>
          </div>

          <div className={styles.headerActions}>
            <Link href={ROUTES.tutor.training} className={styles.secondaryBtn}>
              <GraduationCap size={15} aria-hidden="true" />
              <span>Training Modules</span>
            </Link>
            <a href="#schedule-session" className={styles.primaryBtn}>
              <Plus size={15} aria-hidden="true" />
              <span>Schedule Session</span>
            </a>
            <Link href={`/tutor/${tutor.id}/transcript`} className={styles.secondaryBtn}>
              <FileText size={15} aria-hidden="true" />
              <span>Service Record</span>
            </Link>
          </div>
        </header>

        {/* 4-Metric Impact Row */}
        <section className={styles.metricsGrid} aria-label="Volunteer impact metrics">
          <div className={styles.metricCard}>
            <div className={styles.metricIcon}>
              <Clock size={20} aria-hidden="true" />
            </div>
            <div className={styles.metricContent}>
              <span className={styles.metricValue}>{tutorHours.toFixed(1)} hrs</span>
              <span className={styles.metricLabel}>Verified Service Hours</span>
            </div>
          </div>

          <div className={styles.metricCard}>
            <div className={styles.metricIcon}>
              <Users size={20} aria-hidden="true" />
            </div>
            <div className={styles.metricContent}>
              <span className={styles.metricValue}>{uniqueStudents}</span>
              <span className={styles.metricLabel}>Learners Supported</span>
            </div>
          </div>

          <div className={styles.metricCard}>
            <div className={styles.metricIcon}>
              <CheckCircle2 size={20} aria-hidden="true" />
            </div>
            <div className={styles.metricContent}>
              <span className={styles.metricValue}>{completedBookings.length}</span>
              <span className={styles.metricLabel}>Sessions Completed</span>
            </div>
          </div>

          <div className={styles.metricCard}>
            <div className={styles.metricIcon}>
              <BookOpen size={20} aria-hidden="true" />
            </div>
            <div className={styles.metricContent}>
              <span className={styles.metricValue}>{tutor.subjects?.length || 1}</span>
              <span className={styles.metricLabel}>Approved Subjects</span>
            </div>
          </div>
        </section>

        {/* Main Two-Column Organized Grid */}
        <div className={styles.twoColGrid}>
          {/* Left Column: Sessions & Workshops */}
          <div className={styles.leftCol}>
            {/* Upcoming 1-on-1 Sessions */}
            <section className={styles.card} aria-labelledby="upcoming-sessions-heading">
              <div className={styles.cardHeader}>
                <div>
                  <h2 id="upcoming-sessions-heading" className={styles.cardTitle}>
                    Upcoming 1-on-1 Tutoring Sessions
                  </h2>
                  <p className={styles.cardSub}>Scheduled appointments booked by students.</p>
                </div>
                <span className={styles.countTag}>{upcomingBookings.length} Scheduled</span>
              </div>

              {upcomingBookings.length === 0 ? (
                <EmptyState
                  title="No upcoming 1-on-1 sessions"
                  description="You do not have any pending appointments. Ensure your weekly availability slots are up to date on the right."
                  icon={Calendar}
                />
              ) : (
                <div className={styles.sessionsList}>
                  {upcomingBookings.map((b) => (
                    <div key={b.id} className={styles.sessionCard}>
                      <div className={styles.sessionHeader}>
                        <div>
                          <span className={styles.sessionType}>1-on-1 Mentorship</span>
                          <h3 className={styles.sessionTitle}>
                            {b.subject} with {b.student?.name || "Student"}
                          </h3>
                          <span className={styles.sessionTime}>
                            <Clock size={13} aria-hidden="true" />
                            <FormattedDateTime date={b.startTime} />
                          </span>
                        </div>
                      </div>

                      {b.topic && <p className={styles.sessionTopic}>Topic: {b.topic}</p>}

                      <div className={styles.sessionActions}>
                        {(() => {
                          const { hostUrl } = getMeetingUrls(b.zoomLink);
                          return hostUrl ? (
                            <a
                              href={hostUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={styles.zoomBtn}
                            >
                              <Video size={14} aria-hidden="true" />
                              <span>Launch Zoom Call</span>
                            </a>
                          ) : (
                            <span style={{ fontSize: "0.75rem", color: "var(--wa-muted)" }}>
                              Meeting link delivered to student
                            </span>
                          );
                        })()}

                        <form action={completeSession}>
                          <input type="hidden" name="bookingId" value={b.id} />
                          <button type="submit" className={styles.completeBtn}>
                            <CheckCircle2 size={13} aria-hidden="true" />
                            <span>Mark Completed</span>
                          </button>
                        </form>

                        <form action={cancelBooking}>
                          <input type="hidden" name="bookingId" value={b.id} />
                          <button type="submit" className={styles.cancelBtn}>
                            Cancel Session
                          </button>
                        </form>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Schedule a New Session / Workshop */}
            <section id="schedule-session" className={styles.card} aria-labelledby="schedule-heading">
              <div className={styles.cardHeader}>
                <div>
                  <h2 id="schedule-heading" className={styles.cardTitle}>
                    Schedule a Live Session or Workshop
                  </h2>
                  <p className={styles.cardSub}>
                    Publish an interactive group session. When published, it immediately appears in the platform directory.
                  </p>
                </div>
              </div>

              <ScheduleWorkshopForm />
            </section>

            {/* Active Group Workshops List */}
            <section className={styles.card} aria-labelledby="active-workshops-heading">
              <div className={styles.cardHeader}>
                <div>
                  <h2 id="active-workshops-heading" className={styles.cardTitle}>
                    Active Group Workshops &amp; Bootcamps
                  </h2>
                  <p className={styles.cardSub}>Scheduled group sessions hosted by you.</p>
                </div>
                <span className={styles.countTag}>{upcomingWorkshops.length} Active</span>
              </div>

              {upcomingWorkshops.length === 0 ? (
                <EmptyState
                  title="No active group workshops"
                  description="You haven't scheduled any upcoming workshops yet. Use the form above to publish your next session."
                  icon={BookOpen}
                />
              ) : (
                <div className={styles.sessionsList}>
                  {upcomingWorkshops.map((w) => {
                    const { hostUrl } = getMeetingUrls(w.zoomLink);
                    return (
                      <div key={w.id} className={styles.sessionCard}>
                        <div className={styles.sessionHeader}>
                          <div>
                            <span className={styles.workshopTag}>Group Workshop</span>
                            <h3 className={styles.sessionTitle}>{w.title}</h3>
                            <p style={{ fontSize: "0.8125rem", color: "var(--wa-muted)", margin: "0.2rem 0" }}>
                              {w.subject} • {w.enrollments?.length || 0} / {w.maxCapacity} Seats Booked
                            </p>
                          </div>
                          <span className={styles.sessionTime}>
                            <Clock size={13} aria-hidden="true" />
                            <FormattedDateTime date={w.startTime} />
                          </span>
                        </div>

                        <p style={{ fontSize: "0.8125rem", color: "var(--wa-text)", margin: 0 }}>
                          {w.description}
                        </p>

                        <div className={styles.sessionActions}>
                          {hostUrl && (
                            <a
                              href={hostUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={styles.zoomBtn}
                            >
                              <Video size={14} aria-hidden="true" />
                              <span>Host Zoom Call</span>
                            </a>
                          )}
                          <form action={completeWorkshop}>
                            <input type="hidden" name="workshopId" value={w.id} />
                            <button type="submit" className={styles.completeBtn}>
                              <CheckCircle2 size={13} aria-hidden="true" />
                              <span>Mark Completed</span>
                            </button>
                          </form>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
          </div>

          {/* Right Column: Availability & History */}
          <div className={styles.rightCol}>
            {/* Weekly Availability Manager */}
            <section className={styles.card} aria-labelledby="availability-heading">
              <div className={styles.cardHeader}>
                <div>
                  <h2 id="availability-heading" className={styles.cardTitle}>
                    Weekly Availability
                  </h2>
                  <p className={styles.cardSub}>Set recurring time slots when students can book you.</p>
                </div>
              </div>

              {/* Add slot form */}
              <form action={addAvailability} className={styles.addSlotForm}>
                <select name="dayOfWeek" required className={styles.selectInput} aria-label="Day of week">
                  <option value="">Day</option>
                  {DAYS_OF_WEEK.map((day, i) => (
                    <option key={day} value={i}>{day}</option>
                  ))}
                </select>

                <input
                  type="time"
                  name="startTime"
                  defaultValue="16:00"
                  required
                  className={styles.timeInput}
                  aria-label="Start time"
                />
                <span style={{ color: "var(--wa-muted)", fontSize: "0.8125rem" }}>to</span>
                <input
                  type="time"
                  name="endTime"
                  defaultValue="17:00"
                  required
                  className={styles.timeInput}
                  aria-label="End time"
                />

                <button type="submit" className={styles.addSlotBtn}>
                  + Add Slot
                </button>
              </form>

              {/* Day slots list */}
              <div className={styles.daysList}>
                {availabilityByDay.map((day) => (
                  <div key={day.name} className={styles.dayRow}>
                    <span className={styles.dayName}>{day.name}</span>
                    <div className={styles.slotsWrap}>
                      {day.slots.length === 0 ? (
                        <span className={styles.noSlotsText}>No slots</span>
                      ) : (
                        day.slots.map((slot: { id: string; startTime: string; endTime: string }) => (
                          <span key={slot.id} className={styles.slotBadge}>
                            {slot.startTime}–{slot.endTime}
                            <form action={removeAvailability.bind(null, slot.id)}>
                              <button type="submit" className={styles.removeSlotBtn} title="Remove slot" aria-label={`Remove slot ${slot.startTime} to ${slot.endTime}`}>
                                ×
                              </button>
                            </form>
                          </span>
                        ))
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Volunteer Service Record Quick Card */}
            <div className={styles.transcriptCard}>
              <div className={styles.transcriptTop}>
                <div className={styles.transcriptIconBox}>
                  <FileText size={20} aria-hidden="true" />
                </div>
                <div>
                  <h3 className={styles.transcriptTitle}>Verified Service Record</h3>
                  <p className={styles.transcriptText}>
                    Access your official volunteer certificate with cryptographic verification tokens for school counselors and community portfolios.
                  </p>
                </div>
              </div>
              <Link href={`/tutor/${tutor.id}/transcript`} className={styles.viewTranscriptLink}>
                <span>View &amp; Share Service Record</span>
                <ArrowRight size={13} aria-hidden="true" />
              </Link>
            </div>

            {/* Completed Sessions History */}
            {completedBookings.length > 0 && (
              <section className={styles.card} aria-labelledby="history-heading">
                <h2 id="history-heading" className={styles.cardTitle}>
                  Recent Completed Sessions
                </h2>
                <div className={styles.historyList}>
                  {completedBookings.slice(0, 5).map((b) => (
                    <div key={b.id} className={styles.historyItem}>
                      <div>
                        <strong className={styles.historySubject}>{b.subject}</strong>
                        <span className={styles.historyStudent}>Learner: {b.student?.name || "Student"}</span>
                      </div>
                      <span className={styles.historyDate}>
                        <CheckCircle2 size={12} aria-hidden="true" />
                        {new Date(b.startTime).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
