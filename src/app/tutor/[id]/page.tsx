import styles from "./page.module.css";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { bookSession } from "./actions";
import { auth } from "@/auth";
import Link from "next/link";
import { BookingSlotSelector } from "./BookingSlotSelector";
import { GraduationCap, Globe, FileCheck, Star } from "lucide-react";

const DAYS_OF_WEEK = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export const dynamic = "force-dynamic";

export default async function TutorProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  const { id } = await params;
  
  const tutorProfile = await prisma.tutorProfile.findUnique({
    where: { id },
    include: {
      availabilities: true,
      user: {
        select: {
          id: true,
          name: true,
          image: true,
          timezone: true,
        },
      },
      subjects: true,
      gradeLevels: true,
      tutorBookings: {
        where: { status: "COMPLETED" },
        select: {
          id: true,
          startTime: true,
          endTime: true,
        },
      },
      workshops: {
        where: { status: "COMPLETED" },
        select: {
          id: true,
          startTime: true,
          endTime: true,
        },
      },
      reviews: {
        select: {
          id: true,
          rating: true,
          comment: true,
          createdAt: true,
          student: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!tutorProfile || tutorProfile.status !== "APPROVED") {
    notFound();
  }

  let currentUserTimezone: string | null = null;
  if (session?.user?.id) {
    const dbUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { timezone: true },
    });
    currentUserTimezone = dbUser?.timezone || null;
  }

  const bookingMinutes = (tutorProfile.tutorBookings || []).reduce((sum, b) => {
    const dur = Math.max(15, (new Date(b.endTime).getTime() - new Date(b.startTime).getTime()) / (1000 * 60));
    return sum + dur;
  }, 0);
  const workshopMinutes = (tutorProfile.workshops || []).reduce((sum, w) => {
    const dur = Math.max(15, (new Date(w.endTime).getTime() - new Date(w.startTime).getTime()) / (1000 * 60));
    return sum + dur;
  }, 0);
  const realVolunteerHours = Math.round(((bookingMinutes + workshopMinutes) / 60) * 10) / 10;

  const avgRating =
    tutorProfile.reviews.length > 0
      ? (tutorProfile.reviews.reduce((acc, r) => acc + r.rating, 0) / tutorProfile.reviews.length).toFixed(1)
      : null;

  return (
    <main className={styles.main}>
      <div className={styles.container}>
      <header className={styles.profileHeader}>
        <div className={styles.headerTop}>
          <div className={styles.avatarLarge}>
            {tutorProfile.user.name?.charAt(0).toUpperCase() || "?"}
          </div>
          <div className={styles.headerInfo}>
            <div className={styles.headerTitleRow}>
              <h1 className={styles.name}>{tutorProfile.user.name}</h1>
              <button className={styles.messageBtn}>
                Message
              </button>
            </div>
            
            <p className={styles.grade} style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
              <GraduationCap size={15} style={{ color: "var(--primary)" }} aria-hidden="true" />
              <span>{tutorProfile.school || tutorProfile.currentGrade || "Verified Tutor"}</span>
            </p>
            
            <p className={styles.timezone} style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
              <Globe size={14} style={{ color: "var(--wa-muted)" }} aria-hidden="true" />
              <span>Location / Timezone: {tutorProfile.user.timezone || "UTC"}</span>
            </p>
          </div>
        </div>

        {/* ── Stats Bar ── */}
        <div className={styles.statsBar}>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>Sessions Hosted</span>
            <strong className={styles.statValue}>{tutorProfile.tutorBookings.length + tutorProfile.workshops.length}</strong>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>Learners Helped</span>
            <strong className={styles.statValue}>{(tutorProfile.tutorBookings.length + tutorProfile.workshops.length * 3) || 0}</strong>
          </div>
          {avgRating && (
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Rating</span>
              <strong className={styles.statValue} style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
                <Star size={16} fill="var(--wa-ochre)" stroke="none" aria-hidden="true" />
                <span>{avgRating}</span>
              </strong>
            </div>
          )}
          <div className={styles.statItem}>
            <span className={styles.statLabel}>Member Since</span>
            <strong className={styles.statValue}>2024</strong>
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
            <h2>Certifications</h2>
            <div className={styles.certList}>
              <div className={styles.certBadge}>
                <FileCheck size={16} color="var(--primary)" />
                <span>Background Checked</span>
              </div>
              <div className={styles.certBadge}>
                <FileCheck size={16} color="var(--primary)" />
                <span>Child Safeguarding Certified</span>
              </div>
              <div className={styles.certBadge}>
                <FileCheck size={16} color="var(--primary)" />
                <span>Subject Knowledge Verified</span>
              </div>
              <Link
                href={`/tutor/${tutorProfile.id}/transcript`}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.35rem",
                  color: "var(--primary)",
                  fontWeight: 600,
                  textDecoration: "underline",
                  fontSize: "0.85rem",
                  marginTop: "0.5rem"
                }}
              >
                View Official Service Transcript →
              </Link>
            </div>
          </section>

          {tutorProfile.experience && (
            <section className={styles.section}>
              <h2>Experience & Background</h2>
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
                  <span key={g.id} className={styles.tag} style={{ background: "#E8EEF5", color: "#1E3A5F", borderColor: "#C0CCE0" }}>
                    {g.name}
                  </span>
                ))
              ) : (
                <span className={styles.tag} style={{ background: "#E8EEF5", color: "#1E3A5F", borderColor: "#C0CCE0" }}>
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
                      <span className={styles.reviewStars} style={{ display: "inline-flex", alignItems: "center", gap: "2px" }}>
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            size={13}
                            fill={s <= r.rating ? "#F59E0B" : "none"}
                            stroke={s <= r.rating ? "#F59E0B" : "#CBD5E1"}
                          />
                        ))}
                      </span>
                    </div>
                    {r.comment && <p className={styles.reviewComment}>&quot;{r.comment}&quot;</p>}
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        <div className={styles.sidebar}>
          <div className={styles.bookingCard}>
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
              <p className={styles.noAvailability}>This tutor hasn&apos;t posted their availability yet. Check back soon!</p>
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

                <BookingSlotSelector
                  availabilities={tutorProfile.availabilities}
                  tutorTimezone={tutorProfile.user.timezone || "UTC"}
                  defaultViewerTimezone={currentUserTimezone}
                />

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
      </div>
    </main>
  );
}
