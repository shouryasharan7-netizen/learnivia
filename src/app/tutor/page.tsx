import styles from "./page.module.css";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import Image from "next/image";
import { addAvailability, removeAvailability } from "./actions";

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
    include: { availability: true }
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

  // Group availability by day
  const availabilityByDay = DAYS_OF_WEEK.map((name, index) => ({
    name,
    index,
    slots: tutor.availability.filter(a => a.dayOfWeek === index).sort((a, b) => a.startTime.localeCompare(b.startTime))
  }));

  return (
    <main className={styles.main}>
      <div className={styles.header}>
        <Image src="/images/volunteer-hours.png" alt="Volunteer mascot" width={120} height={150} className={styles.mascotImg} />
        <h1 className={styles.title}>Tutor Dashboard</h1>
        <p className={styles.subtitle}>Manage your availability and upcoming sessions.</p>
      </div>

      <div className={styles.dashboardGrid}>
        {/* Availability Section */}
        <section className={styles.card}>
          <h2 className={styles.cardTitle}>My Weekly Availability</h2>
          <p className={styles.helpText}>All times are in your local timezone ({session.user.timezone || "UTC"}).</p>
          
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
            {availabilityByDay.map(day => (
              <div key={day.index} className={styles.dayRow}>
                <h3>{day.name}</h3>
                {day.slots.length === 0 ? (
                  <p className={styles.noSlots}>No availability</p>
                ) : (
                  <div className={styles.slotsGroup}>
                    {day.slots.map(slot => (
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

        {/* Stats Section */}
        <section className={styles.card}>
          <h2 className={styles.cardTitle}>My Stats</h2>
          <div className={styles.statsBox}>
            <div className={styles.statItem}>
              <span className={styles.statNum}>0</span>
              <span className={styles.statLabel}>Hours Volunteered</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statNum}>0</span>
              <span className={styles.statLabel}>Students Helped</span>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
