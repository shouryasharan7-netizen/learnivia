import styles from "./page.module.css";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { addAvailability, removeAvailability } from "./actions";
import { completeSession, cancelBooking } from "@/app/actions/sessions";
import { createWorkshop, completeWorkshop } from "@/app/actions/workshops";

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

  const tutor = await prisma.tutorProfile.findUnique({
    where: { userId: session.user.id },
    include: {
      availabilities: true,
      subjects: true,
      tutorBookings: {
        include: { student: true },
        orderBy: { startTime: "asc" },
      },
      workshops: {
        include: {
          enrollments: { include: { student: true } },
        },
        orderBy: { startTime: "asc" },
      },
    },
  });

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

  const upcomingBookings = tutor.tutorBookings.filter((b) => b.status === "CONFIRMED");
  const completedBookings = tutor.tutorBookings.filter((b) => b.status === "COMPLETED");
  const upcomingWorkshops = tutor.workshops.filter((w) => w.status === "UPCOMING");
  const uniqueStudents = new Set(completedBookings.map((b) => b.studentId)).size;

  const availabilityByDay = DAYS_OF_WEEK.map((name, index) => ({
    name,
    index,
    slots: tutor.availabilities
      .filter((a: { dayOfWeek: number }) => a.dayOfWeek === index)
      .sort((a: { startTime: string }, b: { startTime: string }) => a.startTime.localeCompare(b.startTime)),
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
              <span className={styles.hoursBadge}>{tutor.volunteerHours.toFixed(1)} Hours Verified</span>
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
              <span className={styles.metricValue}>{tutor.volunteerHours.toFixed(1)} hrs</span>
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
              <span className={styles.metricValue}>{tutor.subjects.length || 1}</span>
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
                            📅 {new Date(b.startTime).toLocaleDateString()} at{" "}
                            {new Date(b.startTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </span>
                        </div>
                      </div>

                      {b.topic && <p className={styles.sessionTopic}>Topic: {b.topic}</p>}

                      <div className={styles.sessionActions}>
                        {b.zoomLink ? (
                          <a href={b.zoomLink} target="_blank" rel="noopener noreferrer" className={styles.zoomBtn}>
                            🎥 Launch Zoom Call
                          </a>
                        ) : (
                          <span style={{ fontSize: "0.8rem", color: "#64748B" }}>Zoom link provided to student</span>
                        )}

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

              <form action={createWorkshop} className={styles.workshopForm} style={{ borderTop: "none", padding: "0.5rem 0 0" }}>
                <div className={styles.formRow}>
                  <div style={{ flex: 2 }}>
                    <label className={styles.inputLabel}>Workshop Title *</label>
                    <input type="text" name="title" placeholder="e.g. SAT Math: Geometry & Circles Bootcamp" required className={styles.textInput} />
                  </div>
                  <div style={{ flex: 1.2 }}>
                    <label className={styles.inputLabel}>Subject *</label>
                    <select name="subject" required className={styles.selectInput}>
                      <option value="SAT Prep">SAT Prep</option>
                      <option value="Mathematics">Mathematics</option>
                      <option value="Science">Science (Bio / Chem / Physics)</option>
                      <option value="College Admissions">College Admissions</option>
                      <option value="Reading and Writing">Reading and Writing</option>
                      <option value="Computer Science">Computer Science</option>
                      <option value="Homework Help">Homework Help</option>
                    </select>
                  </div>
                  <div style={{ flex: 1 }}>
                    <label className={styles.inputLabel}>Grade Level *</label>
                    <select name="grade" required className={styles.selectInput}>
                      <option value="High School">High School</option>
                      <option value="Middle School">Middle School</option>
                      <option value="College Prep">College Prep</option>
                      <option value="All Levels">All Levels</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className={styles.inputLabel}>Session Description &amp; Objectives *</label>
                  <textarea name="description" rows={2} placeholder="What topics will you cover? (e.g. We will walk through 10 practice problems and answer live questions)" required className={styles.textareaInput} />
                </div>

                <div className={styles.formRow}>
                  <div>
                    <label className={styles.inputLabel}>Date *</label>
                    <input type="date" name="date" required className={styles.textInput} />
                  </div>
                  <div>
                    <label className={styles.inputLabel}>Start Time *</label>
                    <input type="time" name="startTime" required className={styles.textInput} />
                  </div>
                  <div>
                    <label className={styles.inputLabel}>End Time *</label>
                    <input type="time" name="endTime" required className={styles.textInput} />
                  </div>
                  <div>
                    <label className={styles.inputLabel}>Max Capacity</label>
                    <input type="number" name="maxCapacity" defaultValue={12} min={2} max={30} className={styles.textInput} />
                  </div>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "0.5rem", flexWrap: "wrap", gap: "1rem" }}>
                  <span style={{ fontSize: "0.8125rem", color: "#64748B" }}>
                    ✓ Automatic Zoom link generated upon publish. Appears live across all learner directories immediately.
                  </span>
                  <button type="submit" className={styles.primaryBtn}>
                    Publish Session to Directory 🚀
                  </button>
                </div>
              </form>
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
                  {upcomingWorkshops.map((w) => (
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
                          📅 {new Date(w.startTime).toLocaleDateString()} at{" "}
                          {new Date(w.startTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>

                      <p style={{ fontSize: "0.875rem", color: "#334155" }}>{w.description}</p>

                      <div className={styles.sessionActions}>
                        {w.zoomLink && (
                          <a href={w.zoomLink} target="_blank" rel="noopener noreferrer" className={styles.zoomBtn}>
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
                  ))}
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
