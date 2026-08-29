import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import Link from "next/link";
import type { Metadata } from "next";
import styles from "./page.module.css";
import { enrollInWorkshop } from "@/app/actions/workshops";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Learning Programs & Group Workshops",
  description: "Browse all Learnivia programs and live group workshops — free, interactive tutoring from homework help to exam prep.",
};

export default async function LearnPage() {
  const session = await auth();

  const [programs, workshops] = await Promise.all([
    prisma.program.findMany({
      orderBy: { createdAt: "asc" },
    }),
    prisma.workshop.findMany({
      where: {
        status: "UPCOMING",
        startTime: { gte: new Date() },
      },
      include: {
        tutor: { include: { user: true } },
        enrollments: true,
      },
      orderBy: { startTime: "asc" },
      take: 6,
    }),
  ]);

  return (
    <main>
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <h1 className={styles.title}>Explore learning &amp; group workshops</h1>
          <p className={styles.subtitle}>
            100% free peer-learning. Join live small-group study bootcamps or book 1-on-1 tutoring sessions with verified volunteers.
          </p>
        </div>
      </section>

      {/* Live Group Workshops Section (Schoolhouse-style) */}
      {workshops.length > 0 && (
        <section className={styles.workshopsSection}>
          <div className={styles.inner}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Live Group Workshops &amp; Study Rooms</h2>
              <p className={styles.sectionSubtitle}>
                Small group sessions hosted by verified tutors over Zoom. Reserve your seat for free.
              </p>
            </div>

            <div className={styles.grid}>
              {workshops.map((w) => {
                const seatsLeft = w.maxCapacity - w.enrollments.length;
                const isEnrolled = session?.user?.id
                  ? w.enrollments.some((e) => e.studentId === session.user.id)
                  : false;

                return (
                  <div key={w.id} className={styles.workshopCard}>
                    <div className={styles.workshopHeader}>
                      <div>
                        <h3 className={styles.workshopTitle}>{w.title}</h3>
                        <p className={styles.workshopTutor}>
                          Hosted by <strong>{w.tutor.user.name}</strong> • {w.subject}
                        </p>
                      </div>
                      <span className={styles.capacityBadge}>
                        {seatsLeft > 0 ? `${seatsLeft} seats left` : "Full"}
                      </span>
                    </div>

                    <p style={{ fontSize: "0.875rem", color: "var(--color-text)", lineHeight: 1.5 }}>
                      {w.description}
                    </p>

                    <div style={{ fontSize: "0.85rem", color: "var(--color-primary)", fontWeight: 600 }}>
                      📅 {new Date(w.startTime).toLocaleDateString()} at{" "}
                      {new Date(w.startTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </div>

                    <div style={{ marginTop: "auto" }}>
                      {!session?.user ? (
                        <Link href={`/signin?callbackUrl=/learn`} className={styles.rsvpBtn} style={{ display: "block", textAlign: "center", textDecoration: "none" }}>
                          Sign In to Reserve Seat
                        </Link>
                      ) : isEnrolled ? (
                        <div className={styles.enrolledBadge}>✓ Seat Reserved (View in Dashboard)</div>
                      ) : seatsLeft > 0 ? (
                        <form action={enrollInWorkshop}>
                          <input type="hidden" name="workshopId" value={w.id} />
                          <button type="submit" className={styles.rsvpBtn}>
                            RSVP Free Seat →
                          </button>
                        </form>
                      ) : (
                        <button disabled className={styles.rsvpBtn} style={{ opacity: 0.5, cursor: "not-allowed" }}>
                          Workshop Full
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      <section className={styles.catalogSection}>
        <div className={styles.inner}>
          <div className={styles.grid}>
            {programs.map(p => (
              <Link key={p.slug} href={`/learn/${p.slug}`} className={styles.card}>
                <span className={styles.emoji} aria-hidden="true">{p.emoji}</span>
                <h2 className={styles.cardTitle}>{p.title}</h2>
                <p className={styles.cardDesc}>{p.shortDescription}</p>
                <div className={styles.tags}>
                  {p.gradeLevels.slice(0, 2).map(g => (
                    <span key={g} className={styles.tag}>{g}</span>
                  ))}
                </div>
                <span className={styles.learnMore}>Explore program →</span>
              </Link>
            ))}
          </div>

          <div className={styles.findCta}>
            <p>Already know what you need?</p>
            <Link href="/find" className={styles.findBtn}>Browse all tutors directly →</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
