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
  Zap,
  X,
  Sparkles,
} from "lucide-react";

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

  if (!tutor) {
    return (
      <main className={styles.main}>
        <div className={styles.authNoticeCard}>
          <div style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>🌱</div>
          <h1 className={styles.title}>Become a Volunteer Tutor</h1>
          <p>You have not registered a tutor profile yet. Join our global community of volunteer educators.</p>
          <Link href="/apply" className={styles.primaryBtn} style={{ marginTop: "1rem" }}>
            Start Volunteer Application →
          </Link>
        </div>
      </main>
    );
  }

  const passedModules = (tutor.trainingModules || []).filter((m) => m.quizPassed).length;

  if (tutor.status === "PENDING") {
    return (
      <main className={styles.main}>
        <div className={styles.authNoticeCard}>
          <div style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>⏳</div>
          <h1 className={styles.title}>Application Pending Review</h1>
          <p>Your tutor application is currently being reviewed by the Learnivia Academic Board. To prepare for approval, complete the 5 mandatory Safeguarding &amp; Tutoring training modules!</p>

          <div style={{ margin: "1.25rem 0", background: passedModules === 5 ? "#F0FDF4" : "#FFFBEB", border: `1px solid ${passedModules === 5 ? "#86EFAC" : "#FCD34D"}`, padding: "1rem", borderRadius: "10px", textAlign: "left" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
              <span style={{ fontWeight: 700, fontSize: "0.9rem", color: "var(--color-navy)" }}>🛡️ Safeguarding &amp; Tutoring Modules</span>
              <span style={{ fontSize: "0.8rem", fontWeight: 800, color: passedModules === 5 ? "#065F46" : "#92400E" }}>
                {passedModules}/5 Completed
              </span>
            </div>
            <div style={{ background: "#E2E8F0", borderRadius: "999px", height: "8px", overflow: "hidden" }}>
              <div style={{ background: passedModules === 5 ? "#10B981" : "#F59E0B", width: `${(passedModules / 5) * 100}%`, height: "100%", transition: "width 0.3s ease" }} />
            </div>
          </div>

          <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", marginTop: "1.25rem", flexWrap: "wrap" }}>
            <Link href="/tutor/training" className={styles.primaryBtn} style={{ background: "#0E8345" }}>
              🎓 Complete Training Modules ({passedModules}/5) →
            </Link>
            <Link href="/apply" className={styles.primaryBtn} style={{ background: "var(--color-teal)" }}>
              📄 Report Card &amp; Documents
            </Link>
            <Link href="/dashboard" className={styles.primaryBtn} style={{ background: "#F1F5F9", color: "var(--color-navy)", border: "1px solid var(--color-border)" }}>
              Dashboard
            </Link>
          </div>
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
        {passedModules < 5 && (
          <div style={{ background: "#FEF3C7", border: "1px solid #FCD34D", borderRadius: "10px", padding: "0.85rem 1.25rem", marginBottom: "1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.75rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span>🛡️</span>
              <span style={{ fontSize: "0.875rem", color: "#92400E", fontWeight: 600 }}>
                <strong>Training in progress ({passedModules}/5 completed):</strong> Complete all 5 safeguarding modules to verify your tutor credential and maintain session compliance.
              </span>
            </div>
            <Link href="/tutor/training" style={{ background: "#D97706", color: "white", padding: "0.35rem 0.85rem", borderRadius: "6px", fontSize: "0.8rem", fontWeight: 700, textDecoration: "none" }}>
              Continue Training →
            </Link>
          </div>
        )}

        {/* Compact, professional top header */}
        <div className={styles.headerRow}>
          <div className={styles.headerTitleCol}>
            <div className={styles.badgeRow}>
              <span className={styles.verifiedBadge}>
                <CheckCircle2 size={13} color="#10B981" /> Verified Tutor
              </span>
              <span className={styles.hoursBadge}>
                <Clock size={13} color="#2D6A4F" /> {tutorHours.toFixed(1)} Hours Verified
              </span>
            </div>
            <h1 className={styles.title}>{tutorName}&apos;s Tutor Portal</h1>
            <p className={styles.subtitle}>Manage your 1-on-1 tutoring sessions, group bootcamps, and volunteer record.</p>
          </div>

          <div className={styles.headerActions} style={{ display: "flex", gap: "0.75rem", alignItems: "center", flexWrap: "wrap" }}>
            <Link href="/tutor/training" className={styles.transcriptBtn} style={{ background: "rgba(45, 106, 79, 0.08)", borderColor: "rgba(45, 106, 79, 0.25)", color: "#2D6A4F", fontWeight: 700, display: "inline-flex", alignItems: "center", gap: "0.35rem" }}>
              <GraduationCap size={15} /> Training Modules
            </Link>
            <a href="#schedule-session" className={styles.primaryBtn} style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "0.35rem" }}>
              <Plus size={15} /> Schedule a Session
            </a>
            <Link href={`/tutor/${tutor.id}/transcript`} className={styles.transcriptBtn} style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem" }}>
              <FileText size={15} /> Volunteer Record →
            </Link>
          </div>
        </div>

        {/* 4-Metric Compact Impact Row */}
        <section className={styles.metricsGrid} aria-label="Tutor volunteer metrics">
          <div className={styles.metricCard}>
            <div className={styles.metricIcon} style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Clock size={24} color="#2D6A4F" />
            </div>
            <div className={styles.metricContent}>
              <span className={styles.metricValue}>{tutorHours.toFixed(1)} hrs</span>
              <span className={styles.metricLabel}>Verified Volunteer Hours</span>
            </div>
          </div>

          <div className={styles.metricCard}>
            <div className={styles.metricIcon} style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Users size={24} color="#2563EB" />
            </div>
            <div className={styles.metricContent}>
              <span className={styles.metricValue}>{uniqueStudents}</span>
              <span className={styles.metricLabel}>Students Supported</span>
            </div>
          </div>

          <div className={styles.metricCard}>
            <div className={styles.metricIcon} style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
              <CheckCircle2 size={24} color="#C9922A" />
            </div>
            <div className={styles.metricContent}>
              <span className={styles.metricValue}>{completedBookings.length}</span>
              <span className={styles.metricLabel}>Sessions Completed</span>
            </div>
          </div>

          <div className={styles.metricCard}>
            <div className={styles.metricIcon} style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
              <BookOpen size={24} color="#D97706" />
            </div>
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
                            <a href={hostUrl} target="_blank" rel="noopener noreferrer" className={styles.zoomBtn} style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem" }}>
                              <Video size={14} /> Launch Zoom Call
                            </a>
                          ) : (
                            <span style={{ fontSize: "0.8rem", color: "#64748B" }}>Zoom link provided to student</span>
                          );
                        })()}

                        <form action={completeSession}>
                          <input type="hidden" name="bookingId" value={b.id} />
                          <button type="submit" className={styles.completeBtn} style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem" }}>
                            <CheckCircle2 size={13} /> Mark Completed
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
            <section id="schedule-session" className={styles.card} style={{ border: "1.5px solid #2D6A4F", background: "#FFFFFF", boxShadow: "0 10px 30px -10px rgba(45, 106, 79, 0.12)" }}>
              <div className={styles.cardHeader}>
                <div>
                  <div style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem", fontSize: "0.75rem", fontWeight: 700, color: "#2D6A4F", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.25rem" }}>
                    <Zap size={14} color="#2D6A4F" /> Instant Tutor Publishing
                  </div>
                  <h2 className={styles.cardTitle}>Schedule a New Live Session / Workshop</h2>
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
                            <a href={hostUrl} target="_blank" rel="noopener noreferrer" className={styles.zoomBtn} style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem" }}>
                              <Video size={14} /> Host Zoom Call
                            </a>
                          )}
                          <form action={completeWorkshop}>
                            <input type="hidden" name="workshopId" value={w.id} />
                            <button type="submit" className={styles.completeBtn} style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem" }}>
                              <CheckCircle2 size={13} /> Mark Completed
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

            {/* Volunteer Service Record Quick Card */}
            <div className={styles.transcriptCard}>
              <div className={styles.transcriptTop}>
                <div style={{ background: "rgba(14, 131, 69, 0.12)", width: 44, height: 44, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <FileText size={22} color="#0E8345" />
                </div>
                <div>
                  <h3 className={styles.transcriptTitle}>Volunteer Service Record</h3>
                  <p className={styles.transcriptText}>
                    Download your verified service certificate with cryptographic IDs for school counselors.
                  </p>
                </div>
              </div>
              <Link href={`/tutor/${tutor.id}/transcript`} className={styles.viewTranscriptLink}>
                View &amp; Print Record →
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
