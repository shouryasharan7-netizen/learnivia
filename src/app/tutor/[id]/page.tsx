import styles from "./page.module.css";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";
import { bookSession } from "./actions";
import { auth } from "@/auth";
import Link from "next/link";

const DAYS_OF_WEEK = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export default async function TutorProfilePage({ params }: { params: { id: string } }) {
  const session = await auth();
  
  const tutorProfile = await prisma.tutorProfile.findUnique({
    where: { id: params.id },
    include: { availabilities: true, user: true }
  });

  if (!tutorProfile || tutorProfile.status !== "APPROVED") {
    notFound();
  }

  // Next week's dates for booking MVP
  const today = new Date();
  const nextWeek = new Date(today);
  nextWeek.setDate(nextWeek.getDate() + 7);

  return (
    <main className={styles.main}>
      <header className={styles.profileHeader}>
        <div className={styles.avatarLarge}>
          {tutorProfile.user.name?.charAt(0).toUpperCase() || "?"}
        </div>
        <div className={styles.headerInfo}>
          <h1 className={styles.name}>{tutorProfile.user.name}</h1>
          <p className={styles.grade}>{tutorProfile.currentGrade || "University"}</p>
        </div>
        
        <div className={styles.metaInfo}>
          <div className={styles.metaItem}>
            <span>Joined</span>
            <strong>{new Date(tutorProfile.createdAt).getFullYear()}</strong>
          </div>
          <div className={styles.metaItem}>
            <span>Volunteer Hours</span>
            <strong>{tutorProfile.volunteerHours}</strong>
          </div>
        </div>
      </header>

      <div className={styles.contentGrid}>
        <div className={styles.mainCol}>
          <section className={styles.section}>
            <h2>About Me</h2>
            <p className={styles.bio}>{tutorProfile.bio || "This tutor hasn't written a bio yet."}</p>
          </section>

          <section className={styles.section}>
            <h2>Subjects I Teach</h2>
            <div className={styles.tags}>
              <span className={styles.tag}>Math</span>
              <span className={styles.tag}>Science</span>
            </div>
          </section>
        </div>

        <div className={styles.sidebar}>
          <div className={styles.bookingCard}>
            <Image src="/images/book-a-session.png" alt="Book a session" width={80} height={100} className={styles.bookingMascot} />
            <h2>Book a Free Session</h2>
            <p className={styles.bookingDesc}>Sessions are held online via Zoom and last for 1 hour.</p>
            
            {!session?.user ? (
              <div className={styles.loginPrompt}>
                <p>You must be logged in to book a session.</p>
                <Link href="/api/auth/signin" className={styles.loginBtn}>Log In</Link>
              </div>
            ) : tutorProfile.availabilities.length === 0 ? (
              <p className={styles.noAvailability}>This tutor hasn't set their availability yet.</p>
            ) : (
              <form action={bookSession} className={styles.bookingForm}>
                <input type="hidden" name="tutorId" value={tutorProfile.id} />
                
                <div className={styles.formGroup}>
                  <label>Select a Time Slot</label>
                  <select name="slotId" required>
                    <option value="">Choose an available time...</option>
                    {tutorProfile.availabilities.map((slot: any) => (
                      <option key={slot.id} value={slot.id}>
                        {DAYS_OF_WEEK[slot.dayOfWeek]} {slot.startTime} - {slot.endTime}
                      </option>
                    ))}
                  </select>
                </div>

                <button type="submit" className={styles.bookBtn}>Confirm Booking</button>
              </form>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
