import styles from "./page.module.css";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { addAvailability, removeAvailability } from "./actions";
import { completeSession, cancelBooking } from "@/app/actions/sessions";
import { completeWorkshop } from "@/app/actions/workshops";
import { ScheduleWorkshopForm } from "./ScheduleWorkshopForm";
import { FormattedDateTime } from "@/components/FormattedDateTime";
import { getMeetingUrls } from "@/lib/meetingUrl";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = {
  title: "Tutor Dashboard — Learnivia",
  description: "Manage volunteer tutoring sessions, host live workshops, and view verified hours.",
};

const DAYS_OF_WEEK = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export default async function TutorDashboard() {
  const session = await auth();

  if (!session?.user) {
    return (
      <main className={styles.main}>
        <div className={styles.authNoticeCard}>
          <h1 className={styles.title}>Unauthorized</h1>
          <p>Please log in to view the Tutor Dashboard.</p>
          <Link href="/signin?callbackUrl=/tutor" className={styles.primaryBtn}>
            Sign In
          </Link>
        </div>
      </main>
    );
  }

  // Safely resolve userId and role with DB fallback
  let userId = session.user.id;
  let userRole = session.user.role;

  if ((!userId || !userRole) && session.user.email) {
    const dbUser = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, role: true, name: true },
    });
    if (dbUser) {
      userId = dbUser.id;
      userRole = dbUser.role;
    }
  }

  if (!userId) {
    return (
      <main className={styles.main}>
        <div className={styles.authNoticeCard}>
          <h1 className={styles.title}>Session Required</h1>
          <p>Please sign in again to access the Tutor Dashboard.</p>
          <Link href="/signin?callbackUrl=/tutor" className={styles.primaryBtn}>
            Sign In
          </Link>
        </div>
      </main>
    );
  }

  let tutor = await prisma.tutorProfile.findUnique({
    where: { userId },
    include: {
      availabilities: true,
      subjects: true,
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
        volunteerHours: 25.0,
      },
      include: {
        availabilities: true,
        subjects: true,
      },
    });
  }

  if (!tutor) {
    return (
      <main className={styles.main}>
        <div className={styles.authNoticeCard}>
          <div style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>🌱</div>
          <h1 className={styles.title}>Become a Volunteer Tutor</h1>
          <p>You have not registered a tutor profile yet. Join our global community of volunteer educators.</p>
          <Link href="/apply" className={styles.primaryBtn} style={{ marginTop: "1rem" }}>
            Apply to Become a Tutor →
          </Link>
        </div>
      </main>
    );
  }

  if (tutor.status === "PENDING") {
    return (
      <main className={styles.main}>
        <div className={styles.authNoticeCard}>
          <div style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>⏳</div>
          <h1 className={styles.title}>Application Pending Review</h1>
          <p>Your tutor application is currently being reviewed by our student safety and moderation team. We&apos;ll notify you via email shortly!</p>
          <Link href="/dashboard" className={styles.primaryBtn} style={{ marginTop: "1rem" }}>
            Go to Student Dashboard
          </Link>
        </div>
      </main>
    );
  }

  if (tutor.status === "REJECTED") {
    return (
      <main className={styles.main}>
        <div className={styles.authNoticeCard}>
          <h1 className={styles.title}>Application Update</h1>
          <p>Unfortunately, your application was not approved at this time. If you have questions, please reach out to support.</p>
        </div>
      </main>
    );
  }

  // Fast subqueries to avoid pgBouncer transaction timeout
  const [rawWorkshops, rawBookings] = await Promise.all([
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
      .filter((a) => a && a.dayOfWeek === index)
      .sort((a, b) => (a.startTime || "").localeCompare(b.startTime || "")),
  }));

  const tutorName = session.user.name || "Volunteer Tutor";

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        {/* Compact, professional top header */}
        <div className={styles.headerRow}>
          <div className={styles.headerTitleCol}>
            <div className={styles.badgeRow}>
              <span className={styles.verifiedBadge}>✓ Verified Tutor</span>
              <span className={styles.hoursBadge}>{tutorHours.toFixed(1)} Hours Verified</span>
            </div>
            <h1 className={styles.title}>{tutorName}&apos;s Tutor Portal</h1>
            <p className={styles.subtitle}>Manage your 1-on-1 tutoring sessions, group bootcamps, and volunteer record.</p>
          </div>

          <div className={styles.headerActions} style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
            <a href="#schedule-session" className={styles.primaryBtn} style={{ textDecoration: "none" }}>
              ➕ Schedule a Session
            </a>
            <Link href={`/tutor/${tutor.id}/transcript`} className={styles.transcriptBtn}>
              📜 Official Transcript →
            </Link>
          </div>
        </div>

        {/* 4-Metric Compact Impact Row */}
        <section className={styles.metricsGrid} aria-label="Tutor volunteer metrics">
          <div className={styles.metricCard}>
            <span className={styles.metricIcon}>⏱️</span>
            <div className={styles.metricContent}>
              <span className={styles.metricValue}>{tutorHours.toFixed(1)} hrs</span>
              <span className={styles.metricLabel}>Verified Volunteer Hours</span>
            </div>
          </div>

          <div className={styles.metricCard}>
            <span className={styles.metricIcon}>👥</span>
            <div className={styles.metricContent}>
              <span className={styles.metricValue}>{uniqueStudents}</span>
              <span className={styles.metricLabel}>Students Supported</span>
            </div>
          </div>

          <div className={styles.metricCard}>
            <span className={styles.metricIcon}>🎓</span>
            <div className={styles.metricContent}>
              <span className={styles.metricValue}>{completedBookings.length}</span>
              <span className={styles.metricLabel}>Sessions Completed</span>
            </div>
          </div>

          <div className={styles.metricCard}>
            <span className={styles.metricIcon}>📚</span>
            <div className={styles.metricContent}>
              <span className={styles.metricValue}>{tutor.subjects?.length || 1}</span>
              <span className={styles.metricLabel}>Subjects Approved</span>
            </div>
          </div>
        </section>

        {/* Main Two-Column Organized Grid */}
        <div className={styles.twoColGrid}>
          {/* Left Column: Sessions & Workshops */}
          <div className={styles.leftCol}>
            {/* Upcoming 1-on-1 Sessions */}
            <section className={styles.card}>
              <div className={styles.cardHeader}>
                <div>
                  <h2 className={styles.cardTitle}>Upcoming 1-on-1 Tutoring Sessions</h2>
                  <p className={styles.cardSub}>Scheduled sessions booked by learners.</p>
                </div>
                <span className={styles.countTag}>{upcomingBookings.length} Scheduled</span>
              </div>

              {upcomingBookings.length === 0 ? (
                <div className={styles.emptyNotice}>
                  <p>No upcoming 1-on-1 sessions booked.</p>
                  <span>Ensure your weekly availability slots are up to date on the right.</span>
                </div>
              ) : (
                <div className={styles.sessionsList}>
                  {upcomingBookings.map((b) => (
                    <div key={b.id} className={styles.sessionCard}>
                      <div className={styles.sessionHeader}>
                        <div>
                          <span className={styles.sessionType}>1-on-1 Tutoring</span>
                          <h3 className={styles.sessionTitle}>{b.subject} with {b.student.name || "Student"}</h3>
                          <span className={styles.sessionTime}>
                            <FormattedDateTime date={b.startTime} />
                          </span>
                        </div>
                      </div>

                      {b.topic && <p className={styles.sessionTopic}>Topic: {b.topic}</p>}

                      <div className={styles.sessionActions}>
                        {(() => {
                          const { hostUrl } = getMeetingUrls(b.zoomLink);
                          return hostUrl ? (
                            <a href={hostUrl} target="_blank" rel="noopener noreferrer" className={styles.zoomBtn}>
                              🎥 Launch Zoom Call
                            </a>
                          ) : (
                            <span style={{ fontSize: "0.8rem", color: "#64748B" }}>Zoom link provided to student</span>
                          );
                        })()}

                        <form action={completeSession}>
                          <input type="hidden" name="bookingId" value={b.id} />
                          <button type="submit" className={styles.completeBtn}>
                            ✓ Mark Completed
                          </button>
                        </form>

                        <form action={cancelBooking}>
                          <input type="hidden" name="bookingId" value={b.id} />
                          <button type="submit" className={styles.cancelBtn}>
                            Cancel
                          </button>
                        </form>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Live Group Workshops */}
            {/* Schedule a New Session / Workshop */}
            <section id="schedule-session" className={styles.card} style={{ border: "1.5px solid #0E8345", background: "#FFFFFF" }}>
              <div className={styles.cardHeader}>
                <div>
                  <div style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem", fontSize: "0.75rem", fontWeight: 700, color: "#0E8345", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.25rem" }}>
                    <span>⚡</span> Instant Tutor Publishing
                  </div>
                  <h2 className={styles.cardTitle}>➕ Schedule a New Live Session / Workshop</h2>
                  <p className={styles.cardSub}>Publish a session to the directory. When published, it will immediately appear on Find a Session for learners to join.</p>
                </div>
              </div>

              <ScheduleWorkshopForm />
            </section>

            {/* Live Group Workshops List */}
            <section className={styles.card}>
              <div className={styles.cardHeader}>
                <div>
                  <h2 className={styles.cardTitle}>My Active Group Workshops &amp; Bootcamps</h2>
                  <p className={styles.cardSub}>Scheduled group sessions hosted by you.</p>
                </div>
                <span className={styles.countTag}>{upcomingWorkshops.length} Active</span>
              </div>

              {/* Workshops list */}
              {upcomingWorkshops.length === 0 ? (
                 <p className={styles.emptyNotice}>You haven&apos;t scheduled any upcoming workshops yet.</p>
              ) : (
                <div className={styles.sessionsList} style={{ marginTop: "1rem" }}>
                  {upcomingWorkshops.map((w) => {
                    const { hostUrl } = getMeetingUrls(w.zoomLink);
                    return (
                      <div key={w.id} className={styles.sessionCard}>
                        <div className={styles.sessionHeader}>
                          <div>
                            <span className={styles.workshopTag}>Group Workshop</span>
                            <h3 className={styles.sessionTitle}>{w.title}</h3>
                            <p style={{ fontSize: "0.8125rem", color: "#64748B" }}>
                              {w.subject} • {w.enrollments.length} / {w.maxCapacity} Seats Booked
                            </p>
                          </div>
                          <span className={styles.sessionTime}>
                            <FormattedDateTime date={w.startTime} />
                          </span>
                        </div>

                        <p style={{ fontSize: "0.875rem", color: "#334155" }}>{w.description}</p>

                        <div className={styles.sessionActions}>
                          {hostUrl && (
                            <a href={hostUrl} target="_blank" rel="noopener noreferrer" className={styles.zoomBtn}>
                              🎥 Host Zoom Call
                            </a>
                          )}
                          <form action={completeWorkshop}>
                            <input type="hidden" name="workshopId" value={w.id} />
                            <button type="submit" className={styles.completeBtn}>
                              ✓ Mark Completed
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

          {/* Right Column: Availability & Recent History */}
          <div className={styles.rightCol}>
            {/* Availability Manager */}
            <section className={styles.card}>
              <div className={styles.cardHeader}>
                <div>
                  <h2 className={styles.cardTitle}>Weekly Availability</h2>
                  <p className={styles.cardSub}>Time slots when students can book you.</p>
                </div>
              </div>

              {/* Add slot compact form */}
              <form action={addAvailability} className={styles.addSlotForm}>
                <select name="dayOfWeek" required className={styles.selectInput}>
                  <option value="">Day</option>
                  {DAYS_OF_WEEK.map((day, i) => (
                    <option key={day} value={i}>{day}</option>
                  ))}
                </select>

                <input type="time" name="startTime" defaultValue="16:00" required className={styles.timeInput} />
                <span style={{ color: "#94A3B8" }}>to</span>
                <input type="time" name="endTime" defaultValue="17:00" required className={styles.timeInput} />

                <button type="submit" className={styles.addSlotBtn}>
                  + Add
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
                              <button type="submit" className={styles.removeSlotBtn} title="Remove slot">×</button>
                            </form>
                          </span>
                        ))
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Official Transcript Quick Card */}
            <div className={styles.transcriptCard}>
              <div className={styles.transcriptTop}>
                <span style={{ fontSize: "1.75rem" }}>📜</span>
                <div>
                  <h3 className={styles.transcriptTitle}>Official Service Transcript</h3>
                  <p className={styles.transcriptText}>
                    Download your verified certificate for university applications and honor societies.
                  </p>
                </div>
              </div>
              <Link href={`/tutor/${tutor.id}/transcript`} className={styles.viewTranscriptLink}>
                View &amp; Print Transcript →
              </Link>
            </div>

            {/* Completed Sessions History */}
            {completedBookings.length > 0 && (
              <section className={styles.card}>
                <h2 className={styles.cardTitle} style={{ fontSize: "1.05rem" }}>Recent Completed Sessions</h2>
                <div className={styles.historyList}>
                  {completedBookings.slice(0, 4).map((b) => (
                    <div key={b.id} className={styles.historyItem}>
                      <div>
                        <strong className={styles.historySubject}>{b.subject}</strong>
                        <span className={styles.historyStudent}>Learner: {b.student.name || "Student"}</span>
                      </div>
                      <span className={styles.historyDate}>
                        ✓ {new Date(b.startTime).toLocaleDateString()}
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
