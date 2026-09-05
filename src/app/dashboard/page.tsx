import styles from "./page.module.css";
import { getCurrentUser } from "@/lib/auth-user";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { cancelBooking } from "@/app/actions/sessions";
import { cancelWorkshopEnrollment } from "@/app/actions/workshops";
import { getMeetingUrls } from "@/lib/meetingUrl";
import { FormattedDateTime } from "@/components/FormattedDateTime";
import { calculateUserStats } from "@/lib/stats";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = {
  title: "Dashboard — Learnivia",
  description: "Your personalized Learnivia peer learning dashboard with real-time tracked minutes and sessions.",
};

const FAST_CARDS = [
  {
    id: "math",
    badge: "MATH",
    badgeBg: "#0E8345",
    badgeText: "MATH",
    title: "Mathematics",
    desc: "1-on-1 maths help for your grade level",
    href: "/find?subject=Mathematics",
  },
  {
    id: "sci",
    badge: "SCI",
    badgeBg: "#2563EB",
    badgeText: "SCI",
    title: "Science",
    desc: "Earth, Life & Physical Science sessions",
    href: "/find?subject=Science",
  },
  {
    id: "eng",
    badge: "ELA",
    badgeBg: "#7C3AED",
    badgeText: "ELA",
    title: "English & Reading",
    desc: "Reading, writing, and language arts",
    href: "/find?subject=Reading+%26+Writing",
  },
  {
    id: "comm",
    icon: "search",
    iconBg: "#E6F4EA",
    iconColor: "#0E8345",
    title: "Find a Tutor",
    desc: "Filter by grade (K–10), subject, and curriculum",
    href: "/find",
  },
  {
    id: "hw",
    icon: "chat",
    iconBg: "#F3E8FF",
    iconColor: "#7C3AED",
    title: "Homework Help",
    desc: "Ask questions or get live Zoom solutions",
    href: "/homework-help",
  },
];

export default async function StudentDashboard() {
  const user = await getCurrentUser();

  if (!user) {
    return (
      <main className={styles.main}>
        <div className={styles.unauthCard}>
          <h1>Please Sign In</h1>
          <p>You need to sign in to access your dashboard.</p>
          <Link href="/signin" className={styles.primaryBtn}>Sign In</Link>
        </div>
      </main>
    );
  }

  const now = new Date();

  // Run database queries and real-time stats calculation concurrently
  const tutorProfile = user.tutorProfile;
  const [
    stats,
    upcomingBookings,
    completedBookings,
    enrolledWorkshops,
  ] = await Promise.all([
    calculateUserStats(user.id),
    prisma.booking.findMany({
      where: { 
        studentId: user.id,
        status: "CONFIRMED",
        endTime: { gte: now },
      },
      include: {
        tutor: { include: { user: true } },
      },
      orderBy: { startTime: "asc" },
    }),
    prisma.booking.findMany({
      where: { 
        studentId: user.id,
        OR: [
          { status: "COMPLETED" },
          { status: "CONFIRMED", endTime: { lt: now } },
        ],
      },
      include: {
        tutor: { include: { user: true } },
      },
      orderBy: { startTime: "desc" },
      take: 8,
    }),
    prisma.workshopEnrollment.findMany({
      where: { studentId: user.id },
      include: {
        workshop: {
          include: {
            tutor: { include: { user: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const upcomingWorkshops = enrolledWorkshops.filter(
    (e) => e.workshop.status === "UPCOMING" && new Date(e.workshop.endTime) >= now
  );

  const completedWorkshops = enrolledWorkshops.filter(
    (e) => e.workshop.status === "COMPLETED" || new Date(e.workshop.endTime) < now
  );

  const isTutor = user.isTutor;
  const userName = user.name || "Learner";
  const userInitials = user.name
    ? user.name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()
    : "U";

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        {/* Administrator Quick Control Access Banner */}
        {user.isAdmin && (
          <div
            style={{
              background: "linear-gradient(135deg, #0F172A 0%, #1E293B 100%)",
              borderRadius: "14px",
              padding: "1.25rem 1.75rem",
              color: "#FFFFFF",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "1rem",
              marginBottom: "1.5rem",
              boxShadow: "0 4px 12px rgba(15, 23, 42, 0.08)",
            }}
          >
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.25rem" }}>
                <span style={{ fontSize: "1.25rem" }}>🛡️</span>
                <span style={{ fontSize: "1rem", fontWeight: 800 }}>Master Administrator Authority Active</span>
                <span
                  style={{
                    background: "#F59E0B",
                    color: "#78350F",
                    fontSize: "0.7rem",
                    fontWeight: 800,
                    padding: "0.15rem 0.5rem",
                    borderRadius: "999px",
                  }}
                >
                  FULL SYSTEM CONTROL
                </span>
              </div>
              <p style={{ color: "#94A3B8", fontSize: "0.85rem", margin: 0 }}>
                You have unrestricted administrative oversight over all learners, tutors, sessions, community channels, and child safety reports.
              </p>
            </div>
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
              <Link
                href="/admin"
                style={{
                  background: "#0E8345",
                  color: "#FFFFFF",
                  padding: "0.5rem 1rem",
                  borderRadius: "8px",
                  fontWeight: 700,
                  fontSize: "0.85rem",
                  textDecoration: "none",
                }}
              >
                Enter Admin Center →
              </Link>
              <Link
                href="/admin/users"
                style={{
                  background: "#334155",
                  color: "#FFFFFF",
                  padding: "0.5rem 1rem",
                  borderRadius: "8px",
                  fontWeight: 600,
                  fontSize: "0.85rem",
                  textDecoration: "none",
                }}
              >
                Manage Users
              </Link>
            </div>
          </div>
        )}

        {/* Tutor Application Status & Report Card Banner */}
        {tutorProfile && tutorProfile.status === "PENDING" && (
          <div
            style={{
              background: "linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%)",
              border: "1.5px solid #FCD34D",
              borderRadius: "14px",
              padding: "1.25rem 1.75rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "1rem",
              marginBottom: "1.5rem",
              boxShadow: "0 2px 8px rgba(245, 158, 11, 0.08)",
            }}
          >
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.25rem" }}>
                <span style={{ fontSize: "1.25rem" }}>📋</span>
                <span style={{ fontSize: "1rem", fontWeight: 800, color: "#92400E" }}>
                  Volunteer Tutor Application Under Review
                </span>
                <span
                  style={{
                    background: "#F59E0B",
                    color: "#FFFFFF",
                    fontSize: "0.7rem",
                    fontWeight: 800,
                    padding: "0.15rem 0.5rem",
                    borderRadius: "999px",
                  }}
                >
                  PENDING REVIEW
                </span>
              </div>
              <p style={{ color: "#78350F", fontSize: "0.85rem", margin: 0 }}>
                {tutorProfile.reportCardUrl
                  ? "Your academic report card & scores have been submitted and are being reviewed by the Learnivia Academic Board."
                  : "Action needed: Please upload your academic report card / mark sheet so our team can verify your scores and approve your tutor profile."}
              </p>
            </div>
            <Link
              href="/apply"
              style={{
                background: "#D97706",
                color: "#FFFFFF",
                padding: "0.6rem 1.25rem",
                borderRadius: "8px",
                fontWeight: 700,
                fontSize: "0.85rem",
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.4rem",
              }}
            >
              {tutorProfile.reportCardUrl ? "📄 View / Update Report Card →" : "📄 Upload Report Card Now →"}
            </Link>
          </div>
        )}

        {/* 1. Hero Promo Banner */}
        <section className={styles.promoBanner}>
          <div className={styles.promoContent}>
            <h1 className={styles.promoTitle}>
              Connect with peer mentors around the globe
            </h1>
            <p className={styles.promoSubtitle}>
              Work with volunteer tutors for step-by-step Ku201310 homework help, exam prep, and personalized 1-on-1 sessions.
            </p>
            <Link href="/sessions" className={styles.promoBtn}>
              Find sessions for your grade →
            </Link>
          </div>

          <div className={styles.promoIllustration} aria-hidden="true">
            <div className={styles.deskIllustration}>
              <span className={styles.deskMascot}>👩‍🎓</span>
              <span className={styles.deskLaptop}>💻</span>
              <span className={styles.deskBooks}>📚</span>
            </div>
          </div>
        </section>

        {/* 2. Fast-Access Feature Cards */}
        <section className={styles.fastCardsGrid} aria-label="Learning pathways">
          {FAST_CARDS.map((card) => (
            <Link key={card.id} href={card.href} className={styles.fastCard}>
              {card.badge ? (
                <div className={styles.squareBadge} style={{ background: card.badgeBg }}>
                  <span>{card.badgeText}</span>
                </div>
              ) : (
                <div className={styles.circleBadge} style={{ background: card.iconBg, color: card.iconColor }}>
                  {card.icon === "search" ? (
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                    </svg>
                  ) : (
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
                    </svg>
                  )}
                </div>
              )}
              <h2 className={styles.cardTitle}>{card.title}</h2>
              <p className={styles.cardDesc}>{card.desc}</p>
            </Link>
          ))}
        </section>

        {/* 3. User Progress & Genuine Real-Time Stats Strip */}
        <section className={styles.userStrip} aria-label="Student progress">
          <div className={styles.userProfileBlock}>
            <div className={styles.avatarCircle}>{userInitials}</div>
            <div className={styles.userMeta}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <h2 className={styles.userDisplayName}>{userName}</h2>
                {user.isAdmin ? (
                  <span style={{ fontSize: "0.7rem", fontWeight: 800, color: "#92400E", background: "#FEF3C7", padding: "0.15rem 0.6rem", borderRadius: "999px" }}>
                    🛡️ Administrator
                  </span>
                ) : isTutor ? (
                  <span style={{ fontSize: "0.7rem", fontWeight: 700, color: "#0E8345", background: "#E6F4EA", padding: "0.15rem 0.5rem", borderRadius: "999px" }}>
                    ✓ Verified Tutor
                  </span>
                ) : tutorProfile?.status === "PENDING" ? (
                  <span style={{ fontSize: "0.7rem", fontWeight: 700, color: "#B45309", background: "#FEF3C7", padding: "0.15rem 0.5rem", borderRadius: "999px" }}>
                    ⏳ Tutor Review Pending
                  </span>
                ) : (
                  <span style={{ fontSize: "0.7rem", fontWeight: 700, color: "#2563EB", background: "#EFF6FF", padding: "0.15rem 0.5rem", borderRadius: "999px" }}>
                    🎓 Student
                  </span>
                )}
              </div>
              <div className={styles.userLinks}>
                {stats.grade && (
                  <span style={{ fontSize: "0.75rem", color: "#64748B", fontWeight: 600 }}>
                    {stats.grade} {stats.curriculum ? `• ${stats.curriculum}` : ""}
                  </span>
                )}
                {isTutor ? (
                  <>
                    <Link href="/tutor" className={styles.metaLink} style={{ color: "#0E8345", fontWeight: 700 }}>
                      💻 Tutor Dashboard
                    </Link>
                    <Link href="/tutor/transcript" className={styles.metaLink}>
                      📜 Verified Hours ({stats.volunteerHours} hrs)
                    </Link>
                  </>
                ) : (
                  <>
                    <Link href="/sessions" className={styles.metaLink}>
                      🗓️ Browse Sessions
                    </Link>
                    <Link href="/apply" className={styles.metaLink} style={{ color: "#0E8345", fontWeight: 700 }}>
                      🌱 Become a Tutor
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Real-time Dynamic Stats Calculation */}
          <div className={styles.statsBlock}>
            {/* Rank Pill */}
            <div className={styles.rankPill}>
              <span>🏅</span>
              <div>
                <span style={{ fontSize: "1.05rem", fontWeight: 800 }}>#{stats.rank}</span>
                <span style={{ display: "block", fontSize: "0.68rem", opacity: 0.85 }}>
                  of {stats.totalUsers} learners
                </span>
              </div>
            </div>

            {/* Study Points Pill */}
            <div className={styles.statPill}>
              <span className={styles.statIcon}>🏆</span>
              <div className={styles.statValueCol}>
                <span className={styles.statNumber}>{stats.points.toLocaleString()}</span>
                <span className={styles.statUnit}>SP</span>
              </div>
            </div>

            {/* Real Learning Minutes Pill */}
            <div className={styles.statPill}>
              <span className={styles.statIcon}>⏱️</span>
              <div className={styles.statValueCol}>
                <span className={styles.statNumber}>{stats.learningMinutes.toLocaleString()}</span>
                <span className={styles.statUnit}>Learning minutes</span>
              </div>
            </div>

            {/* Real-time Leaderboard Link */}
            <Link href="/leaderboard" className={styles.leaderboardLink}>
              <span className={styles.leaderboardIcons}>🥇 👥 🥈</span>
              <span>Leaderboard</span>
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
          </div>
        </section>

        {/* 4. Two Columns: Upcoming Sessions & Tasks */}
        <div className={styles.twoColGrid}>
          {/* Left Column: Upcoming & Past Sessions */}
          <section className={styles.sessionsCol}>
            <div className={styles.colHeader}>
              <h2 className={styles.colTitle}>Upcoming Sessions</h2>
              <Link href="/sessions" className={styles.viewAllLink}>
                Find more &gt;
              </Link>
            </div>

            {upcomingBookings.length === 0 && upcomingWorkshops.length === 0 ? (
              <div className={styles.emptyCard}>
                <div className={styles.emptyIcon} aria-hidden="true">🗓️</div>
                <h3 className={styles.emptyTitle}>No upcoming sessions</h3>
                <p className={styles.emptyText}>
                  Explore live small-group sessions or book a free 1-on-1 session with a peer tutor.
                </p>
                <Link href="/sessions" className={styles.browseBtn}>
                  Find a Session →
                </Link>
              </div>
            ) : (
              <div className={styles.sessionsList}>
                {/* 1-on-1 bookings */}
                {upcomingBookings.map((b) => {
                  const { joinUrl } = getMeetingUrls(b.zoomLink);
                  return (
                    <div key={b.id} className={styles.bookingCard}>
                      <div className={styles.bookingDetails}>
                        <span className={styles.sessionTypeBadge}>1-on-1 Tutoring</span>
                        <h3 className={styles.bookingTitle}>{b.subject} with {b.tutor.user.name}</h3>
                        <p className={styles.bookingTime}>
                          <FormattedDateTime date={b.startTime} />
                        </p>
                        {b.topic && <p className={styles.bookingTopic}>Topic: {b.topic}</p>}
                      </div>

                      <div className={styles.bookingActions}>
                        <a href={joinUrl || "#"} target="_blank" rel="noopener noreferrer" className={styles.zoomBtn}>
                          🎥 Join Zoom
                        </a>
                        <form action={cancelBooking}>
                          <input type="hidden" name="bookingId" value={b.id} />
                          <button type="submit" className={styles.cancelLink}>Cancel</button>
                        </form>
                      </div>
                    </div>
                  );
                })}

                {/* Enrolled workshops */}
                {upcomingWorkshops.map((e) => {
                  const { joinUrl } = getMeetingUrls(e.workshop.zoomLink);
                  return (
                    <div key={e.id} className={styles.bookingCard}>
                      <div className={styles.bookingDetails}>
                        <span className={styles.workshopBadge}>Group Workshop</span>
                        <h3 className={styles.bookingTitle}>{e.workshop.title}</h3>
                        <p className={styles.bookingTime}>
                          Host: {e.workshop.tutor.user.name} • <FormattedDateTime date={e.workshop.startTime} />
                        </p>
                      </div>

                      <div className={styles.bookingActions}>
                        {joinUrl && (
                          <a href={joinUrl} target="_blank" rel="noopener noreferrer" className={styles.zoomBtn}>
                            🎥 Join Zoom
                          </a>
                        )}
                        <form action={cancelWorkshopEnrollment}>
                          <input type="hidden" name="workshopId" value={e.workshop.id} />
                          <button type="submit" className={styles.cancelLink}>Leave</button>
                        </form>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Past Completed Sessions with Tracked Minutes, Recordings & Re-booking */}
            <div className={styles.completedBlock}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
                <h3 className={styles.subHeading} style={{ margin: 0 }}>
                  Past Completed Sessions ({completedBookings.length + completedWorkshops.length})
                </h3>
                <span style={{ fontSize: "0.8rem", color: "#64748B", fontWeight: 600 }}>
                  ⏱️ {stats.learningMinutes} total learning minutes
                </span>
              </div>

              {completedBookings.length === 0 && completedWorkshops.length === 0 ? (
                <div style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: 12, padding: "1.5rem", textAlign: "center", color: "#64748B", fontSize: "0.875rem" }}>
                  No past sessions recorded yet. Completed tutoring sessions and class recordings will appear here automatically!
                </div>
              ) : (
                <div className={styles.completedList}>
                  {/* Past 1-on-1 Sessions */}
                  {completedBookings.map((b) => {
                    const durationMins = Math.max(
                      15,
                      Math.round((new Date(b.endTime).getTime() - new Date(b.startTime).getTime()) / 60000)
                    );
                    const tutorFirstName = b.tutor.user.name?.split(" ")[0] || "Tutor";

                    return (
                      <div key={b.id} className={styles.completedRow}>
                        <div className={styles.completedRowHeader}>
                          <div>
                            <strong style={{ fontSize: "0.95rem", color: "#1E293B" }}>{b.subject}</strong>
                            <span style={{ color: "#64748B" }}> with {b.tutor.user.name}</span>
                            {b.topic && (
                              <p style={{ margin: "0.2rem 0 0", fontSize: "0.8rem", color: "#475569" }}>
                                Topic: {b.topic}
                              </p>
                            )}
                            <span className={styles.completedDate}>
                              ✓ Completed on {new Date(b.startTime).toLocaleDateString()}
                            </span>
                          </div>

                          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                            <span className={styles.durationBadge}>
                              ⏱️ {durationMins} mins
                            </span>
                          </div>
                        </div>

                        {/* Follow-up / Tutor Check-up Note */}
                        {b.checkUpNote && (
                          <div className={styles.checkUpBox}>
                            <strong>📝 Tutor Follow-up &amp; Notes:</strong>
                            <p style={{ margin: "0.25rem 0 0" }}>{b.checkUpNote}</p>
                          </div>
                        )}

                        {/* Action buttons: Re-book with Tutor, Zoom recording */}
                        <div className={styles.completedActions}>
                          <Link href={`/tutor/${b.tutorId}`} className={styles.bookAgainBtn}>
                            <span>🔄</span> Book with {tutorFirstName} Again
                          </Link>

                          {b.recordingUrl ? (
                            <a
                              href={b.recordingUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={styles.recordingBtn}
                            >
                              <span>🎥</span> Watch Class Recording
                            </a>
                          ) : (
                            <span style={{ fontSize: "0.75rem", color: "#94A3B8" }}>
                              🎥 Recording sent via email or direct link
                            </span>
                          )}

                          <Link href={`/tutor/${b.tutorId}#reviews`} className={styles.viewTutorBtn}>
                            ⭐ Review Tutor (+15 SP)
                          </Link>
                        </div>
                      </div>
                    );
                  })}

                  {/* Past Group Workshops */}
                  {completedWorkshops.map((e) => {
                    const durationMins = Math.max(
                      15,
                      Math.round((new Date(e.workshop.endTime).getTime() - new Date(e.workshop.startTime).getTime()) / 60000)
                    );
                    const hostName = e.workshop.tutor.user.name || "Tutor";
                    const hostFirstName = hostName.split(" ")[0];

                    return (
                      <div key={e.id} className={styles.completedRow}>
                        <div className={styles.completedRowHeader}>
                          <div>
                            <strong style={{ fontSize: "0.95rem", color: "#1E293B" }}>
                              [Workshop] {e.workshop.title}
                            </strong>
                            <span style={{ color: "#64748B" }}> • Host: {hostName}</span>
                            <span className={styles.completedDate}>
                              ✓ Completed on {new Date(e.workshop.startTime).toLocaleDateString()}
                            </span>
                          </div>

                          <span className={styles.durationBadge}>
                            ⏱️ {durationMins} mins
                          </span>
                        </div>

                        {e.workshop.recordingUrl && (
                          <div style={{ marginTop: "0.25rem" }}>
                            <a
                              href={e.workshop.recordingUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={styles.recordingBtn}
                            >
                              <span>🎥</span> Watch Workshop Recording
                            </a>
                          </div>
                        )}

                        <div className={styles.completedActions}>
                          <Link href={`/tutor/${e.workshop.tutorId}`} className={styles.bookAgainBtn}>
                            <span>🔄</span> Book 1-on-1 with {hostFirstName} Again
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </section>

          {/* Right Column: Tasks & Profile */}
          <section className={styles.tasksCol}>
            <div className={styles.colHeader}>
              <h2 className={styles.colTitle}>Tasks</h2>
            </div>

            <div className={styles.tasksCard}>
              <ul className={styles.taskList}>
                <li className={styles.taskItem}>
                  <span className={styles.checkCircle}>✓</span>
                  <div>
                    <strong className={styles.taskTitle}>Welcome to Learnivia!</strong>
                    <p className={styles.taskDesc}>Your account is active with real-time stats tracking.</p>
                  </div>
                </li>
                <li className={styles.taskItem}>
                  <span className={stats.completedSessions > 0 ? styles.checkCircle : styles.pendingCircle}>
                    {stats.completedSessions > 0 ? "✓" : "○"}
                  </span>
                  <div>
                    <strong className={styles.taskTitle}>Attend Your First Peer Session</strong>
                    <p className={styles.taskDesc}>
                      {stats.completedSessions > 0
                        ? `Great job! You have attended ${stats.completedSessions} session(s).`
                        : "Join a small group workshop or 1-on-1 session to start earning SP."}
                    </p>
                    {stats.completedSessions === 0 && (
                      <Link href="/sessions" className={styles.taskActionLink}>
                        Browse sessions →
                      </Link>
                    )}
                  </div>
                </li>
                <li className={styles.taskItem}>
                  <span className={styles.pendingCircle}>○</span>
                  <div>
                    <strong className={styles.taskTitle}>Ask a Homework Question</strong>
                    <p className={styles.taskDesc}>Get step-by-step assistance or live Zoom explanations.</p>
                    <Link href="/homework-help" className={styles.taskActionLink}>
                      Open Homework Help →
                    </Link>
                  </div>
                </li>
              </ul>
            </div>

            {/* Role-Specific Action Card */}
            {isTutor ? (
              <div className={styles.sideCard} style={{ background: "linear-gradient(135deg, #F0FDF4 0%, #E6F4EA 100%)", borderColor: "#DCFCE7" }}>
                <h3 className={styles.sideCardTitle} style={{ color: "#0E8345" }}>⚡ Tutor Quick Portal</h3>
                <p className={styles.sideCardText}>
                  Verified Tutor: You have logged {stats.volunteerHours} hours of tutoring. Host small-group workshops and answer live homework questions.
                </p>
                <div className={styles.sideCardLinks}>
                  <Link href="/tutor#schedule-session" className={styles.reportLink} style={{ background: "#0E8345", color: "#FFFFFF" }}>
                    ➕ Host a New Session →
                  </Link>
                  <Link href="/tutor" className={styles.resourcesLink} style={{ color: "#0E8345", fontWeight: 700 }}>
                    💻 Open Tutor Dashboard
                  </Link>
                </div>
              </div>
            ) : tutorProfile?.status === "PENDING" ? (
              <div className={styles.sideCard} style={{ background: "linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%)", borderColor: "#FDE68A" }}>
                <h3 className={styles.sideCardTitle} style={{ color: "#B45309" }}>⏳ Tutor Application Pending</h3>
                <p className={styles.sideCardText}>
                  Your application is currently being reviewed by our moderation team. You&apos;ll be notified by email once approved!
                </p>
                <div className={styles.sideCardLinks}>
                  <Link href="/tutor" className={styles.reportLink} style={{ background: "#D97706", color: "#FFFFFF" }}>
                    Check Status →
                  </Link>
                  <Link href="/support" className={styles.resourcesLink} style={{ color: "#B45309", fontWeight: 600 }}>
                    Support FAQ
                  </Link>
                </div>
              </div>
            ) : (
              <div className={styles.sideCard} style={{ background: "linear-gradient(135deg, #F8FAFC 0%, #EFF6FF 100%)", borderColor: "#DBEAFE" }}>
                <h3 className={styles.sideCardTitle} style={{ color: "#1D4ED8" }}>🌱 Become a Volunteer Tutor</h3>
                <p className={styles.sideCardText}>
                  Passionate about helping other students? Apply to become an approved peer tutor and receive official volunteer transcripts for your applications.
                </p>
                <div className={styles.sideCardLinks}>
                  <Link href="/apply" className={styles.reportLink} style={{ background: "#2563EB", color: "#FFFFFF" }}>
                    Apply to Tutor →
                  </Link>
                  <Link href="/how-it-works" className={styles.resourcesLink} style={{ color: "#2563EB", fontWeight: 600 }}>
                    How it works →
                  </Link>
                </div>
              </div>
            )}

            {/* Quick Links Card */}
            <div className={styles.sideCard}>
              <h3 className={styles.sideCardTitle}>Need Help or Safety Support?</h3>
              <p className={styles.sideCardText}>
                Our student safety and moderation team is available around the clock.
              </p>
              <div className={styles.sideCardLinks}>
                <Link href="/safety/report" className={styles.reportLink}>
                  🛡️ Report an Issue →
                </Link>
                <Link href="/resources" className={styles.resourcesLink}>
                  📖 Learning Resources →
                </Link>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
