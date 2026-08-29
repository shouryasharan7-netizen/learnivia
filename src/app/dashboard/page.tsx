import styles from "./page.module.css";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";
import { cancelBooking } from "@/app/actions/sessions";

export default async function StudentDashboard() {
  const session = await auth();

  if (!session?.user) {
    return (
      <main className={styles.main}>
        <h1 className={styles.title}>Unauthorized</h1>
        <p>Please log in to view your dashboard.</p>
      </main>
    );
  }

  const upcomingBookings = await prisma.booking.findMany({
    where: { 
      studentId: session.user.id,
      status: "CONFIRMED"
    },
    include: {
      tutor: { include: { user: true } }
    },
    orderBy: { startTime: "asc" }
  });

  const completedBookings = await prisma.booking.findMany({
    where: { 
      studentId: session.user.id,
      status: "COMPLETED"
    },
    include: {
      tutor: { include: { user: true } }
    },
    orderBy: { startTime: "desc" },
    take: 5,
  });

  return (
    <main className={styles.main}>
      <div className={styles.header}>
        <h1 className={styles.title}>My Dashboard</h1>
        <p className={styles.subtitle}>Welcome back, {session.user.name || "Learner"}!</p>
      </div>

      <div className={styles.dashboardGrid}>
        <section className={styles.mainContent}>
          <h2 className={styles.sectionTitle}>Upcoming Tutoring Sessions</h2>
          
          {upcomingBookings.length === 0 ? (
            <div className={styles.emptyState}>
              <Image src="/images/session-complete.png" alt="Empty state mascot" width={100} height={120} className={styles.mascotImg} />
              <p>You don't have any upcoming sessions scheduled.</p>
              <Link href="/find" className={styles.primaryBtn}>Find a Tutor</Link>
            </div>
          ) : (
            <div className={styles.bookingsList}>
              {upcomingBookings.map(booking => (
                <div key={booking.id} className={styles.bookingCard}>
                  <div className={styles.bookingInfo}>
                    <h3>{booking.subject} with {booking.tutor.user.name}</h3>
                    <p className={styles.timeInfo}>
                      📅 {new Date(booking.startTime).toLocaleDateString()} at {new Date(booking.startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </p>
                    {booking.topic && (
                      <p style={{ fontSize: "0.875rem", color: "var(--color-text-muted)", marginTop: "0.25rem" }}>
                        Topic: {booking.topic}
                      </p>
                    )}
                  </div>
                  <div className={styles.bookingActions}>
                    <a href={booking.zoomLink || "#"} target="_blank" rel="noopener noreferrer" className={styles.joinBtn}>
                      🎥 Join Zoom
                    </a>
                    <form action={cancelBooking}>
                      <input type="hidden" name="bookingId" value={booking.id} />
                      <button type="submit" className={styles.cancelBtn}>
                        Cancel
                      </button>
                    </form>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Past / Completed Sessions */}
          {completedBookings.length > 0 && (
            <div style={{ marginTop: "3rem" }}>
              <h2 className={styles.sectionTitle}>Past Completed Sessions</h2>
              <div className={styles.bookingsList}>
                {completedBookings.map(booking => (
                  <div key={booking.id} className={styles.bookingCard} style={{ opacity: 0.9 }}>
                    <div className={styles.bookingInfo}>
                      <h3>{booking.subject} with {booking.tutor.user.name}</h3>
                      <p className={styles.timeInfo}>
                        ✓ Completed on {new Date(booking.startTime).toLocaleDateString()}
                      </p>
                    </div>
                    <div className={styles.bookingActions}>
                      <Link href={`/tutor/${booking.tutorId}`} className={styles.joinBtn} style={{ background: "var(--color-bg)", color: "var(--color-navy)", border: "1px solid var(--color-border)" }}>
                        View Tutor
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        <section className={styles.sidebar}>
          <div className={styles.card}>
            <h3>Need Help?</h3>
            <p>If you have any questions or concerns about a session, check our safety resources or report an issue directly.</p>
            <Link href="/safety" style={{ color: "var(--color-primary)", fontWeight: 700, fontSize: "0.95rem" }}>
              Safety &amp; Trust Guidelines →
            </Link>
          </div>
          
          {/* @ts-ignore */}
          {session.user.role === "TUTOR" && (
            <div className={styles.tutorCard}>
              <h3>You are a Volunteer Tutor!</h3>
              <p>Manage your availability, launch your meetings, and verify volunteer hours.</p>
              <Link href="/tutor" className={styles.secondaryBtn}>Go to Tutor Dashboard</Link>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
