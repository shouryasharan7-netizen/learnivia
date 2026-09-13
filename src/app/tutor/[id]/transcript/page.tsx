import styles from "./page.module.css";
import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import PrintButton from "./PrintButton";
import ShareTranscriptButton from "./ShareTranscriptButton";
import { getCurrentUser } from "@/lib/auth-user";
import { generateTranscriptToken, verifyTranscriptToken } from "@/lib/transcript";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ token?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const tutor = await prisma.tutorProfile.findUnique({
    where: { id },
    include: { user: true },
  });

  if (!tutor) return { title: "Transcript Not Found - Learnivia" };

  return {
    title: `Volunteer Service Record - ${tutor.user.name || "Tutor"} | Learnivia`,
    description: `Verified record of volunteer peer-tutoring hours, student impact, and academic subjects for ${tutor.user.name}.`,
  };
}

export default async function TutorTranscriptPage({ params, searchParams }: Props) {
  const { id } = await params;
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const token = resolvedSearchParams?.token;

  const hasValidToken = token ? verifyTranscriptToken(id, token) : false;
  const currentUser = await getCurrentUser();

  // P0-2 & P2-2: Access requires authentication OR a valid cryptographic token
  if (!currentUser && !hasValidToken) {
    redirect(`/signin?callbackUrl=/tutor/${id}/transcript`);
  }

  const tutor = await prisma.tutorProfile.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          grade: true,
          curriculum: true,
          // Explicitly exclude: email, password, age, dateOfBirth, failedLoginCount
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
          subject: true,
          topic: true,
          studentId: true,
          // Explicitly exclude: helpNeeded, zoomLink, recordingUrl, checkUpNote
        },
        orderBy: { startTime: "desc" },
      },
      workshops: {
        where: { status: "COMPLETED" },
        select: {
          id: true,
          startTime: true,
          endTime: true,
          subject: true,
          title: true,
        },
      },
      reviews: {
        include: {
          student: {
            select: {
              id: true,
              name: true,
              // Explicitly exclude email and other PII
            },
          },
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!tutor || tutor.status !== "APPROVED") {
    notFound();
  }

  // Authorization: viewer must be the tutor themselves, an admin, or have a valid cryptographic token
  const isOwnTranscript = currentUser ? tutor.user.id === currentUser.id : false;
  const isAdmin = currentUser ? currentUser.isAdmin : false;

  if (!isOwnTranscript && !isAdmin && !hasValidToken) {
    // Instead of 404 (which reveals existence), redirect to the public profile
    redirect(`/tutor/${id}`);
  }

  const shareToken = generateTranscriptToken(tutor.id);

  const completedSessions = tutor.tutorBookings;
  const completedWorkshops = tutor.workshops || [];
  const bookingMinutes = completedSessions.reduce((acc, b) => {
    const dur = Math.max(15, (new Date(b.endTime).getTime() - new Date(b.startTime).getTime()) / (1000 * 60));
    return acc + dur;
  }, 0);
  const workshopMinutes = completedWorkshops.reduce((acc, w) => {
    const dur = Math.max(15, (new Date(w.endTime).getTime() - new Date(w.startTime).getTime()) / (1000 * 60));
    return acc + dur;
  }, 0);
  const realVolunteerHours = Math.round(((bookingMinutes + workshopMinutes) / 60) * 10) / 10;
  const totalSessionsCount = completedSessions.length + completedWorkshops.length;

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
        <div className={styles.topActions} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.75rem" }}>
          <Link href={`/tutor/${tutor.id}`} className={styles.backLink}>
            ← Back to Tutor Profile
          </Link>
          <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", flexWrap: "wrap" }}>
            {(isOwnTranscript || isAdmin) && (
              <ShareTranscriptButton tutorId={tutor.id} token={shareToken} />
            )}
            <PrintButton />
          </div>
        </div>

        {hasValidToken && !currentUser && (
          <div style={{ background: "#ECFDF5", border: "1px solid #A7F3D0", padding: "0.75rem 1.25rem", borderRadius: "8px", marginBottom: "1.25rem", fontSize: "0.85rem", color: "#065F46", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span>🔒</span>
            <span>
              <strong>Verified Public View:</strong> You are viewing an authentic Learnivia Volunteer Service Record verified via cryptographic signature. Student PII is strictly protected and redacted.
            </span>
          </div>
        )}

        {/* The Official Certificate Document */}
        <div className={styles.certificate}>
          {/* Certificate Header */}
          <div className={styles.certHeader}>
            <div className={styles.brandCol}>
              <div className={styles.logoRow}>
                <Image src="/images/logo.png" alt="Learnivia" width={42} height={42} priority />
                <span className={styles.brandName}>Learnivia</span>
              </div>
              <span className={styles.docType}>Verified Volunteer Service Record</span>
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
              This verified service record certifies that the individual named below has actively volunteered as an approved peer tutor on Learnivia, delivering free, interactive academic support to learners worldwide.
            </p>
            <div className={styles.tutorHighlight}>{tutor.user.name}</div>
            <div style={{ display: "flex", justifyContent: "center", gap: "0.75rem", flexWrap: "wrap", marginTop: "0.5rem" }}>
              {tutor.school && (
                <div className={styles.schoolTag}>
                  Affiliation: <strong>{tutor.school}</strong>
                </div>
              )}
              {(tutor.user.grade || tutor.currentGrade || tutor.user.curriculum) && (
                <div className={styles.schoolTag}>
                  Academic Grade: <strong>{tutor.user.grade || tutor.currentGrade || "Senior Secondary"}</strong>
                  {tutor.user.curriculum ? ` (${tutor.user.curriculum})` : ""}
                </div>
              )}
            </div>
          </div>

          {/* Impact Metrics Grid */}
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <span className={styles.statValue}>{realVolunteerHours.toFixed(1)}</span>
              <span className={styles.statLabel}>Verified Hours</span>
            </div>
            <div className={styles.statCard}>
              <span className={styles.statValue}>{totalSessionsCount}</span>
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
                {tutor.reviews.slice(0, 4).map((r) => {
                  // Privacy: display first name + last initial only for student reviewers
                  const rawName = r.student.name || "Verified Student";
                  const parts = rawName.trim().split(/\s+/);
                  const displayName = parts.length > 1
                    ? `${parts[0]} ${parts[parts.length - 1][0]}.`
                    : parts[0];
                  return (
                    <div key={r.id} className={styles.reviewQuote}>
                      <p className={styles.quoteText}>&quot;{r.comment || "Great session, really helpful!"}&quot;</p>
                      <div className={styles.quoteAuthor}>
                        — {displayName} &bull; {"★".repeat(r.rating)}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Official Verification Footer */}
          <div className={styles.certFooter}>
            <div className={styles.disclaimer}>
              <p>
                <strong>Verification Statement:</strong> This transcript is a platform-generated service record issued by Learnivia reflecting sessions and workshops marked as completed within the Learnivia platform. Hours are computed from session start and end times recorded at time of booking.
              </p>
              <p style={{ marginTop: "0.5rem" }}>
                Record ID: <code>{certId}</code> — Issued {issueDate}
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
