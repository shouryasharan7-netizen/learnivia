import styles from "./page.module.css";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { approveTutor, rejectTutor } from "./actions";

export default async function AdminDashboard() {
  const session = await auth();
  
  // @ts-ignore
  if (!session?.user || session.user.role !== "ADMIN") {
    // Return unauthorized page for MVP if they are not admin
    return (
      <main className={styles.main}>
        <h1 className={styles.title}>Unauthorized</h1>
        <p>You must be an administrator to view this page.</p>
        <p>Note: Since there is no UI to become an admin, you must manually change your role to "ADMIN" in your Supabase database directly.</p>
      </main>
    );
  }

  const pendingTutors = await prisma.tutorProfile.findMany({
    where: { status: "PENDING" },
    include: { user: true }
  });

  const totalTutors = await prisma.tutorProfile.count();
  const totalStudents = await prisma.user.count({ where: { role: "STUDENT" } });
  const totalBookings = await prisma.booking.count();

  return (
    <main className={styles.main}>
      <h1 className={styles.title}>Admin Dashboard</h1>
      
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <h3>Total Tutors</h3>
          <p className={styles.statValue}>{totalTutors}</p>
        </div>
        <div className={styles.statCard}>
          <h3>Total Students</h3>
          <p className={styles.statValue}>{totalStudents}</p>
        </div>
        <div className={styles.statCard}>
          <h3>Total Bookings</h3>
          <p className={styles.statValue}>{totalBookings}</p>
        </div>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Pending Tutor Applications ({pendingTutors.length})</h2>
        {pendingTutors.length === 0 ? (
          <p>No pending applications.</p>
        ) : (
          <div className={styles.applicationsList}>
            {pendingTutors.map(tutor => (
              <div key={tutor.id} className={styles.applicationCard}>
                <div className={styles.appInfo}>
                  <h3>{tutor.user.name}</h3>
                  <p><strong>Email:</strong> {tutor.user.email}</p>
                  <p><strong>Timezone:</strong> {tutor.user.timezone}</p>
                  <p><strong>Bio:</strong> {tutor.bio}</p>
                </div>
                <div className={styles.appActions}>
                  <form action={approveTutor.bind(null, tutor.id)}>
                    <button type="submit" className={styles.approveBtn}>Approve</button>
                  </form>
                  <form action={rejectTutor.bind(null, tutor.id)}>
                    <button type="submit" className={styles.rejectBtn}>Reject</button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
