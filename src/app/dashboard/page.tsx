import styles from "./page.module.css";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";

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
      status: "SCHEDULED"
    },
    include: {
      tutor: { include: { user: true } }
    },
    orderBy: { startTime: "asc" }
  });

  return (
    <main className={styles.main}>
      <div className={styles.header}>
        <h1 className={styles.title}>My Dashboard</h1>
        <p className={styles.subtitle}>Welcome back, {session.user.name}!</p>
      </div>

      <div className={styles.dashboardGrid}>
        <section className={styles.mainContent}>
          <h2 className={styles.sectionTitle}>Upcoming Tutoring Sessions</h2>
          
          {upcomingBookings.length === 0 ? (
            <div className={styles.emptyState}>
              <Image src="/images/session-complete.png" alt="Empty state mascot" width={100} height={120} className={styles.mascotImg} />
              <p>You don't have any upcoming sessions.</p>
              <Link href="/find" className={styles.primaryBtn}>Find a Tutor</Link>
            </div>
          ) : (
            <div className={styles.bookingsList}>
              {upcomingBookings.map(booking => (
                <div key={booking.id} className={styles.bookingCard}>
                  <div className={styles.bookingInfo}>
                    <h3>Session with {booking.tutor.user.name}</h3>
                    <p className={styles.timeInfo}>
                      📅 {booking.startTime.toLocaleDateString()} at {booking.startTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </p>
                  </div>
                  <div className={styles.bookingAction}>
                    <a href={booking.meetingUrl} target="_blank" rel="noopener noreferrer" className={styles.joinBtn}>
                      Join Zoom Meeting
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className={styles.sidebar}>
          <div className={styles.card}>
            <h3>Need Help?</h3>
            <p>If you need to cancel or reschedule, please contact your tutor directly.</p>
          </div>
          
          {/* @ts-ignore */}
          {session.user.role === "TUTOR" && (
            <div className={styles.tutorCard}>
              <h3>You are a Tutor!</h3>
              <p>Switch to your tutor dashboard to manage your availability.</p>
              <Link href="/tutor" className={styles.secondaryBtn}>Go to Tutor Dashboard</Link>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
