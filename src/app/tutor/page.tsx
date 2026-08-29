import styles from "./page.module.css";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import { addAvailability, removeAvailability } from "./actions";
import { completeSession, cancelBooking } from "@/app/actions/sessions";
import { createWorkshop, completeWorkshop } from "@/app/actions/workshops";

const DAYS_OF_WEEK = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export default async function TutorDashboard() {
  const session = await auth();

  if (!session?.user) {
    return (
      <main className={styles.main}>
        <h1 className={styles.title}>Unauthorized</h1>
        <p>Please log in to view the Tutor Dashboard.</p>
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
        <h1 className={styles.title}>Tutor Dashboard</h1>
        <p>You have not applied to be a tutor yet. <a href="/apply">Apply here</a>.</p>
      </main>
    );
  }

  if (tutor.status === "PENDING") {
    return (
      <main className={styles.main}>
        <h1 className={styles.title}>Tutor Dashboard</h1>
        <p>Your application is currently pending review by an administrator. Check back later!</p>
      </main>
    );
  }

  if (tutor.status === "REJECTED") {
    return (
      <main className={styles.main}>
        <h1 className={styles.title}>Tutor Dashboard</h1>
        <p>Unfortunately, your application was not approved.</p>
      </main>
    );
  }

  const upcomingBookings = tutor.tutorBookings.filter((b) => b.status === "CONFIRMED");
  const completedBookings = tutor.tutorBookings.filter((b) => b.status === "COMPLETED");

  // Calculate unique students helped
  const uniqueStudents = new Set(completedBookings.map((b) => b.studentId)).size;

  // Group availability by day
  const availabilityByDay = DAYS_OF_WEEK.map((name, index) => ({
    name,
    index,
    slots: tutor.availabilities
      .filter((a: any) => a.dayOfWeek === index)
      .sort((a: any, b: any) => a.startTime.localeCompare(b.startTime)),
  }));

  return (
    <main className={styles.main}>
      <div className={styles.header}>
        <Image src="/images/volunteer-hours.png" alt="Volunteer mascot" width={120} height={150} className={styles.mascotImg} priority />
        <h1 className={styles.title}>Tutor Dashboard</h1>
        <p className={styles.subtitle}>Welcome back, {session.user.name || "Tutor"}! Manage your sessions and volunteer hours.</p>
      </div>

      <div className={styles.dashboardGrid}>
        {/* Left Column: Upcoming Sessions & Availability */}
        <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
          {/* Upcoming Booked Sessions */}
          <section className={styles.card}>
            <h2 className={styles.cardTitle}>Upcoming Tutoring Sessions</h2>
            <p className={styles.helpText}>Sessions booked by students. Launch the Zoom meeting when you are ready.</p>

            {upcomingBookings.length === 0 ? (
              <p className={styles.emptyNotice}>No upcoming sessions currently scheduled.</p>
            ) : (
              <div className={styles.sessionsList}>
                {upcomingBookings.map((b) => (
                  <div key={b.id} className={styles.sessionCard}>
                    <div className={styles.sessionHeader}>
                      <div>
                        <h3 className={styles.sessionTitle}>{b.subject}</h3>
                        <p className={styles.sessionStudent}>
                          Learner: <strong>{b.student.name || b.student.email}</strong> • Grade: {b.grade}
                        </p>
                      </div>
                      <span className={styles.sessionTime}>
                        📅 {new Date(b.startTime).toLocaleDateString()} at {new Date(b.startTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>

                    {b.topic && (
                      <div className={styles.sessionTopic}>
                        <strong>Topic:</strong> {b.topic}
                        {b.helpNeeded && <p style={{ marginTop: "0.25rem" }}><em>"{b.helpNeeded}"</em></p>}
                      </div>
                    )}

                    <div className={styles.sessionActions}>
                      {b.zoomLink && (
                        <a href={b.zoomLink} target="_blank" rel="noopener noreferrer" className={styles.zoomBtn}>
                          🎥 Start Zoom Call
                        </a>
                      )}
                      <form action={completeSession}>
                        <input type="hidden" name="bookingId" value={b.id} />
                        <button type="submit" className={styles.completeBtn}>
                          ✓ Mark as Completed
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

          {/* Group Workshops Section (Schoolhouse-style) */}
          <section className={styles.card}>
            <h2 className={styles.cardTitle}>My Live Group Workshops &amp; Bootcamps</h2>
            <p className={styles.helpText}>Host small group interactive study sessions over Zoom with up to 20 students.</p>

            {/* Form to schedule a new workshop */}
            <details style={{ marginBottom: "2rem", background: "var(--color-bg)", padding: "1rem", borderRadius: "var(--radius-lg)", border: "1px solid var(--color-border)" }}>
              <summary style={{ fontWeight: 700, cursor: "pointer", color: "var(--color-primary)" }}>
                + Schedule a New Group Workshop
              </summary>
              <form action={createWorkshop} style={{ display: "flex", flexDirection: "column", gap: "1rem", marginTop: "1rem" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                  <div>
                    <label style={{ fontSize: "0.85rem", fontWeight: 700, display: "block", marginBottom: "0.25rem" }}>Title *</label>
                    <input type="text" name="title" placeholder="e.g. SAT Math Crash Course" required style={{ width: "100%", padding: "0.5rem", borderRadius: "6px", border: "1px solid #ddd" }} />
                  </div>
                  <div>
                    <label style={{ fontSize: "0.85rem", fontWeight: 700, display: "block", marginBottom: "0.25rem" }}>Subject *</label>
                    <select name="subject" required style={{ width: "100%", padding: "0.5rem", borderRadius: "6px", border: "1px solid #ddd" }}>
                      {tutor.subjects.length > 0 ? (
                        tutor.subjects.map((s) => <option key={s.id} value={s.name}>{s.name}</option>)
                      ) : (
                        <option value="General Study Hall">General Study Hall</option>
                      )}
                    </select>
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: "0.85rem", fontWeight: 700, display: "block", marginBottom: "0.25rem" }}>Description &amp; Goals *</label>
                  <textarea name="description" rows={2} placeholder="What will be covered in this workshop?" required style={{ width: "100%", padding: "0.5rem", borderRadius: "6px", border: "1px solid #ddd", fontFamily: "inherit" }} />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "0.75rem" }}>
                  <div>
                    <label style={{ fontSize: "0.85rem", fontWeight: 700, display: "block", marginBottom: "0.25rem" }}>Date *</label>
                    <input type="date" name="date" required style={{ width: "100%", padding: "0.5rem", borderRadius: "6px", border: "1px solid #ddd" }} />
                  </div>
                  <div>
                    <label style={{ fontSize: "0.85rem", fontWeight: 700, display: "block", marginBottom: "0.25rem" }}>Start Time *</label>
                    <input type="time" name="startTime" required style={{ width: "100%", padding: "0.5rem", borderRadius: "6px", border: "1px solid #ddd" }} />
                  </div>
                  <div>
                    <label style={{ fontSize: "0.85rem", fontWeight: 700, display: "block", marginBottom: "0.25rem" }}>End Time *</label>
                    <input type="time" name="endTime" required style={{ width: "100%", padding: "0.5rem", borderRadius: "6px", border: "1px solid #ddd" }} />
                  </div>
                  <div>
                    <label style={{ fontSize: "0.85rem", fontWeight: 700, display: "block", marginBottom: "0.25rem" }}>Seats Limit</label>
                    <input type="number" name="maxCapacity" defaultValue={10} min={2} max={50} style={{ width: "100%", padding: "0.5rem", borderRadius: "6px", border: "1px solid #ddd" }} />
                  </div>
                </div>

                <button type="submit" className={styles.addBtn} style={{ alignSelf: "flex-start", marginTop: "0.5rem" }}>
                  Publish Workshop to Directory
                </button>
              </form>
            </details>

            {/* List of upcoming workshops */}
            {tutor.workshops.filter((w) => w.status === "UPCOMING").length === 0 ? (
              <p className={styles.emptyNotice}>You haven't scheduled any upcoming workshops yet.</p>
            ) : (
              <div className={styles.sessionsList}>
                {tutor.workshops.filter((w) => w.status === "UPCOMING").map((w) => (
                  <div key={w.id} className={styles.sessionCard}>
                    <div className={styles.sessionHeader}>
                      <div>
                        <h3 className={styles.sessionTitle}>{w.title}</h3>
                        <p className={styles.sessionStudent}>
                          {w.subject} • {w.enrollments.length} / {w.maxCapacity} Seats Booked
                        </p>
                      </div>
                      <span className={styles.sessionTime}>
                        📅 {new Date(w.startTime).toLocaleDateString()} at {new Date(w.startTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>

                    <p style={{ fontSize: "0.875rem", color: "var(--color-text)" }}>{w.description}</p>

                    {w.enrollments.length > 0 && (
                      <div style={{ fontSize: "0.8rem", color: "var(--color-text-muted)" }}>
                        Enrolled learners: {w.enrollments.map((e) => e.student.name || "Student").join(", ")}
                      </div>
                    )}

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

          {/* Availability Section */}
          <section className={styles.card}>
            <h2 className={styles.cardTitle}>My Weekly Availability</h2>
            <p className={styles.helpText}>Set regular time slots when learners can book sessions with you.</p>

            <form action={addAvailability} className={styles.addSlotForm}>
              <select name="dayOfWeek" required>
                {DAYS_OF_WEEK.map((day, i) => (
                  <option key={i} value={i}>{day}</option>
                ))}
              </select>
              <input type="time" name="startTime" required />
              <span>to</span>
              <input type="time" name="endTime" required />
              <button type="submit" className={styles.addBtn}>Add Slot</button>
            </form>

            <div className={styles.scheduleList}>
              {availabilityByDay.map((day) => (
                <div key={day.index} className={styles.dayRow}>
                  <h3>{day.name}</h3>
                  {day.slots.length === 0 ? (
                    <p className={styles.noSlots}>No availability</p>
                  ) : (
                    <div className={styles.slotsGroup}>
                      {day.slots.map((slot: any) => (
                        <div key={slot.id} className={styles.slotBadge}>
                          {slot.startTime} - {slot.endTime}
                          <form action={removeAvailability.bind(null, slot.id)}>
                            <button type="submit" className={styles.removeBtn} aria-label="Remove slot">&times;</button>
                          </form>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right Column: Stats & Completed Sessions */}
        <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
          {/* Stats Section */}
          <section className={styles.card}>
            <h2 className={styles.cardTitle}>My Volunteer Impact</h2>
            <div className={styles.statsBox}>
              <div className={styles.statItem}>
                <span className={styles.statNum}>{tutor.volunteerHours.toFixed(1)}</span>
                <span className={styles.statLabel}>Verified Volunteer Hours</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statNum}>{uniqueStudents}</span>
                <span className={styles.statLabel}>Students Supported</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statNum}>{completedBookings.length}</span>
                <span className={styles.statLabel}>Completed Sessions</span>
              </div>
            </div>
            
            <Link
              href={`/tutor/${tutor.id}/transcript`}
              style={{
                display: "block",
                textAlign: "center",
                marginTop: "1.5rem",
                background: "var(--color-primary)",
                color: "white",
                padding: "0.75rem 1rem",
                borderRadius: "var(--radius-full)",
                fontWeight: 700,
                textDecoration: "none",
                fontSize: "0.9rem",
                transition: "background-color 0.2s",
              }}
            >
              📜 View Official Service Transcript →
            </Link>
          </section>

          {/* Completed History */}
          {completedBookings.length > 0 && (
            <section className={styles.card}>
              <h2 className={styles.cardTitle}>Recent Completed Sessions</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginTop: "1rem" }}>
                {completedBookings.slice(0, 5).map((b) => (
                  <div key={b.id} style={{ padding: "0.75rem", background: "var(--color-cream)", borderRadius: "0.5rem", fontSize: "0.875rem" }}>
                    <div style={{ fontWeight: 700, color: "var(--color-navy)" }}>{b.subject}</div>
                    <div style={{ color: "var(--color-text-muted)" }}>
                      Learner: {b.student.name || "Student"} • {new Date(b.startTime).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </main>
  );
}
