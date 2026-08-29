import styles from "./page.module.css";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";
import { bookSession } from "./actions";
import { auth } from "@/auth";
import Link from "next/link";

const DAYS_OF_WEEK = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export const dynamic = "force-dynamic";

export default async function TutorProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  const { id } = await params;
  
  const tutorProfile = await prisma.tutorProfile.findUnique({
    where: { id },
    include: {
      availabilities: true,
      user: true,
      subjects: true,
      gradeLevels: true,
      reviews: {
        include: { student: true },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!tutorProfile || tutorProfile.status !== "APPROVED") {
    notFound();
  }

  const avgRating =
    tutorProfile.reviews.length > 0
      ? (tutorProfile.reviews.reduce((acc, r) => acc + r.rating, 0) / tutorProfile.reviews.length).toFixed(1)
      : null;

  return (
    <main className={styles.main}>
      <header className={styles.profileHeader}>
        <div className={styles.avatarLarge}>
          {tutorProfile.user.name?.charAt(0).toUpperCase() || "?"}
        </div>
        <div className={styles.headerInfo}>
          <h1 className={styles.name}>{tutorProfile.user.name}</h1>
          <p className={styles.grade}>
            {tutorProfile.school ? `🎓 ${tutorProfile.school}` : (tutorProfile.currentGrade || "Verified Tutor")}
          </p>
          <p className={styles.timezone}>🌍 Local Timezone: {tutorProfile.user.timezone || "UTC"}</p>
        </div>
        
        <div className={styles.metaInfo}>
          <div className={styles.metaItem}>
            <span>Volunteer Impact</span>
            <strong>{tutorProfile.volunteerHours.toFixed(1)} hrs</strong>
          </div>
          {avgRating && (
            <div className={styles.metaItem}>
              <span>Rating</span>
              <strong>⭐ {avgRating} ({tutorProfile.reviews.length})</strong>
            </div>
          )}
          <div className={styles.metaItem}>
            <Link
              href={`/tutor/${tutorProfile.id}/transcript`}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.35rem",
                color: "var(--color-primary)",
                fontWeight: 700,
                textDecoration: "underline",
                fontSize: "0.85rem",
              }}
            >
              📜 Official Transcript →
            </Link>
          </div>
        </div>
      </header>

      <div className={styles.contentGrid}>
        <div className={styles.mainCol}>
          <section className={styles.section}>
            <h2>About Me</h2>
            <p className={styles.bio}>{tutorProfile.bio || "This tutor hasn't written a bio yet."}</p>
          </section>

          {tutorProfile.experience && (
            <section className={styles.section}>
              <h2>Experience &amp; Background</h2>
              <p className={styles.bio}>{tutorProfile.experience}</p>
            </section>
          )}

          <section className={styles.section}>
            <h2>Subjects I Teach</h2>
            <div className={styles.tags}>
              {tutorProfile.subjects.length > 0 ? (
                tutorProfile.subjects.map(s => (
                  <span key={s.id} className={styles.tag}>{s.name}</span>
                ))
              ) : (
                <span className={styles.tag}>General Tutoring</span>
              )}
            </div>
          </section>

          <section className={styles.section}>
            <h2>Grade Levels Supported</h2>
            <div className={styles.tags}>
              {tutorProfile.gradeLevels.length > 0 ? (
                tutorProfile.gradeLevels.map(g => (
                  <span key={g.id} className={styles.tag} style={{ background: "var(--color-sky)", color: "var(--color-navy)" }}>
                    {g.name}
                  </span>
                ))
              ) : (
                <span className={styles.tag} style={{ background: "var(--color-sky)", color: "var(--color-navy)" }}>
                  All Ages Welcome
                </span>
              )}
            </div>
          </section>

          {/* Student Reviews */}
          <section className={styles.section}>
            <h2>Learner Reviews ({tutorProfile.reviews.length})</h2>
            {tutorProfile.reviews.length === 0 ? (
              <p style={{ color: "var(--color-text-muted)", fontStyle: "italic" }}>
                No reviews yet. Be the first to book a session and share feedback!
              </p>
            ) : (
              <div className={styles.reviewsList}>
                {tutorProfile.reviews.map(r => (
                  <div key={r.id} className={styles.reviewItem}>
                    <div className={styles.reviewTop}>
                      <span className={styles.reviewAuthor}>{r.student.name || "Learner"}</span>
                      <span className={styles.reviewStars}>{"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}</span>
                    </div>
                    {r.comment && <p className={styles.reviewComment}>"{r.comment}"</p>}
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        <div className={styles.sidebar}>
          <div className={styles.bookingCard}>
            <Image src="/images/book-a-session.png" alt="Book a session" width={80} height={100} className={styles.bookingMascot} priority />
            <h2>Book a Free Session</h2>
            <p className={styles.bookingDesc}>100% free online tutoring over Zoom. Choose a subject and reserve your time slot.</p>
            
            {!session?.user ? (
              <div className={styles.loginPrompt}>
                <p>Create a free account or sign in to book your session.</p>
                <Link href={`/signin?callbackUrl=/tutor/${tutorProfile.id}`} className={styles.loginBtn}>
                  Sign In to Book Free
                </Link>
              </div>
            ) : tutorProfile.availabilities.length === 0 ? (
              <p className={styles.noAvailability}>This tutor hasn't posted their availability yet. Check back soon!</p>
            ) : (
              <form action={bookSession} className={styles.bookingForm}>
                <input type="hidden" name="tutorId" value={tutorProfile.id} />
                
                <div className={styles.formGroup}>
                  <label htmlFor="subjectSelect">Subject *</label>
                  <select id="subjectSelect" name="subject" required>
                    {tutorProfile.subjects.length > 0 ? (
                      tutorProfile.subjects.map(s => (
                        <option key={s.id} value={s.name}>{s.name}</option>
                      ))
                    ) : (
                      <option value="General Tutoring">General Tutoring</option>
                    )}
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="topicInput">Topic or Assignment *</label>
                  <input
                    id="topicInput"
                    type="text"
                    name="topic"
                    placeholder="e.g. Quadratic Equations, Essay Feedback"
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="slotSelect">Available Time Slot *</label>
                  <select id="slotSelect" name="slotId" required>
                    <option value="">Choose an available time...</option>
                    {tutorProfile.availabilities.map((slot: any) => (
                      <option key={slot.id} value={slot.id}>
                        {DAYS_OF_WEEK[slot.dayOfWeek]} {slot.startTime} - {slot.endTime} ({tutorProfile.user.timezone || "Local"})
                      </option>
                    ))}
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="notesInput">Notes for Tutor (optional)</label>
                  <textarea
                    id="notesInput"
                    name="helpNeeded"
                    rows={3}
                    placeholder="Tell your tutor what specific questions you have or share a link to your assignment."
                  />
                </div>

                <button type="submit" className={styles.bookBtn}>
                  Confirm Free Booking →
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
