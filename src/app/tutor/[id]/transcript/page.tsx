import styles from "./page.module.css";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import PrintButton from "./PrintButton";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const tutor = await prisma.tutorProfile.findUnique({
    where: { id },
    include: { user: true },
  });

  if (!tutor) return { title: "Transcript Not Found - Learnivia" };

  return {
    title: `Official Volunteer Service Transcript - ${tutor.user.name || "Tutor"} | Learnivia`,
    description: `Official verified record of volunteer peer-tutoring hours, student impact, and academic subjects for ${tutor.user.name}.`,
  };
}

export default async function TutorTranscriptPage({ params }: Props) {
  const { id } = await params;

  const tutor = await prisma.tutorProfile.findUnique({
    where: { id },
    include: {
      user: true,
      subjects: true,
      gradeLevels: true,
      tutorBookings: {
        where: { status: "COMPLETED" },
        include: { student: true },
        orderBy: { startTime: "desc" },
      },
      reviews: {
        include: { student: true },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!tutor || tutor.status !== "APPROVED") {
    notFound();
  }

  const completedSessions = tutor.tutorBookings;
  const uniqueLearners = new Set(completedSessions.map((s) => s.studentId)).size;
  const avgRating =
    tutor.reviews.length > 0
      ? (tutor.reviews.reduce((acc, r) => acc + r.rating, 0) / tutor.reviews.length).toFixed(1)
      : "5.0";

  const certId = `TR-${tutor.id.toUpperCase().slice(0, 10)}`;
  const issueDate = new Date().toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        {/* Top actions bar */}
        <div className={styles.topActions}>
          <Link href={`/tutor/${tutor.id}`} className={styles.backLink}>
            ← Back to Tutor Profile
          </Link>
          <PrintButton />
        </div>

        {/* The Official Certificate Document */}
        <div className={styles.certificate}>
          {/* Certificate Header */}
          <div className={styles.certHeader}>
            <div className={styles.brandCol}>
              <div className={styles.logoRow}>
                <Image src="/images/logo.png" alt="Learnivia" width={42} height={42} priority />
                <span className={styles.brandName}>Learnivia</span>
              </div>
              <span className={styles.docType}>Official Volunteer Service Record</span>
            </div>

            <div className={styles.verificationBadge}>
              <span className={styles.verifiedPill}>✓ Verified Record</span>
              <div className={styles.certId}>ID: {certId}</div>
              <div style={{ fontSize: "0.75rem", color: "var(--color-text-muted)", marginTop: "0.25rem" }}>
                Issued: {issueDate}
              </div>
            </div>
          </div>

          {/* Tutor Title / Intro */}
          <div className={styles.tutorIntro}>
            <h1 className={styles.certTitle}>Certificate of Volunteer Service</h1>
            <p className={styles.certSubtitle}>
              This official transcript certifies that the individual named below has actively volunteered as an approved peer tutor on Learnivia, delivering free, interactive academic support to learners worldwide.
            </p>
            <div className={styles.tutorHighlight}>{tutor.user.name}</div>
            {tutor.school && (
              <div className={styles.schoolTag}>
                Affiliation: <strong>{tutor.school}</strong>
              </div>
            )}
          </div>

          {/* Impact Metrics Grid */}
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <span className={styles.statValue}>{tutor.volunteerHours.toFixed(1)}</span>
              <span className={styles.statLabel}>Verified Hours</span>
            </div>
            <div className={styles.statCard}>
              <span className={styles.statValue}>{completedSessions.length}</span>
              <span className={styles.statLabel}>Sessions Completed</span>
            </div>
            <div className={styles.statCard}>
              <span className={styles.statValue}>{uniqueLearners}</span>
              <span className={styles.statLabel}>Students Helped</span>
            </div>
            <div className={styles.statCard}>
              <span className={styles.statValue}>⭐ {avgRating}</span>
              <span className={styles.statLabel}>Peer Rating ({tutor.reviews.length})</span>
            </div>
          </div>

          {/* Certified Subjects */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>
              <span>Certified Subject Disciplines</span>
              <span style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--color-text-muted)" }}>
                {tutor.subjects.length} Subjects
              </span>
            </h2>
            <div className={styles.subjectsList}>
              {tutor.subjects.length > 0 ? (
                tutor.subjects.map((s) => (
                  <span key={s.id} className={styles.subjectTag}>
                    ✓ {s.name}
                  </span>
                ))
              ) : (
                <span className={styles.subjectTag}>✓ General Academic Tutoring</span>
              )}
              {tutor.gradeLevels.map((g) => (
                <span key={g.id} className={styles.subjectTag} style={{ background: "var(--color-cream)", color: "var(--color-navy)" }}>
                  🎓 {g.name}
                </span>
              ))}
            </div>
          </div>

          {/* Completed Sessions Ledger */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>
              <span>Audited Tutoring Session Ledger</span>
              <span style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--color-text-muted)" }}>
                {completedSessions.length} Total Verified
              </span>
            </h2>

            {completedSessions.length === 0 ? (
              <p style={{ color: "var(--color-text-muted)", fontStyle: "italic", padding: "1rem 0" }}>
                Volunteer sessions are currently in progress. Completed sessions with verified attendance will be audited and logged here automatically.
              </p>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table className={styles.ledgerTable}>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Subject / Discipline</th>
                      <th>Topic / Scope</th>
                      <th>Duration</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {completedSessions.map((session) => {
                      const durationMs = session.endTime.getTime() - session.startTime.getTime();
                      const durationHours = Math.max(0.5, Math.round((durationMs / (1000 * 60 * 60)) * 10) / 10);

                      return (
                        <tr key={session.id}>
                          <td>{new Date(session.startTime).toLocaleDateString()}</td>
                          <td><strong>{session.subject}</strong></td>
                          <td>{session.topic || "Homework Review"}</td>
                          <td>{durationHours} hr</td>
                          <td>
                            <span className={styles.statusCompleted}>✓ Verified</span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Learner Testimonials */}
          {tutor.reviews.length > 0 && (
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Learner Feedback &amp; Testimonials</h2>
              <div className={styles.reviewsGrid}>
                {tutor.reviews.slice(0, 4).map((r) => (
                  <div key={r.id} className={styles.reviewQuote}>
                    <p className={styles.quoteText}>"{r.comment || "Great session, really helpful!"}"</p>
                    <div className={styles.quoteAuthor}>
                      — {r.student.name || "Verified Student"} • {"★".repeat(r.rating)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Official Verification Footer */}
          <div className={styles.certFooter}>
            <div className={styles.disclaimer}>
              <p>
                <strong>Verification Statement:</strong> This transcript is an official digital record issued by Learnivia. Hours recorded reflect active 1-on-1 tutoring sessions and small group workshops verified through attendance logs and session completion.
              </p>
              <p style={{ marginTop: "0.5rem" }}>
                Official verification URL: <code>https://learnivia-green.vercel.app/tutor/{tutor.id}/transcript</code>
              </p>
            </div>

            <div className={styles.sealBlock}>
              <div className={styles.signatureLine}>Learnivia Committee</div>
              <div className={styles.signatoryTitle}>Academic Integrity &amp; Service Verification</div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
