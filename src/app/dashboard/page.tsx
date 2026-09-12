import styles from "./page.module.css";
import { getCurrentUser } from "@/lib/auth-user";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { cancelBooking } from "@/app/actions/sessions";
import { cancelWorkshopEnrollment } from "@/app/actions/workshops";
import { getMeetingUrls } from "@/lib/meetingUrl";
import { FormattedDateTime } from "@/components/FormattedDateTime";
import { calculateUserStats } from "@/lib/stats";
import ChildProfileSection from "./ChildProfileSection";
import {
  Calculator,
  Atom,
  BookOpen,
  Compass,
  MessageSquare,
  ShieldCheck,
  Clock,
  Sparkles,
  Trophy,
  Award,
  Video,
  Calendar,
  User,
  Users,
  AlertCircle,
  FileText,
  ArrowRight,
  ChevronRight,
  CheckCircle2,
  Circle,
  Zap,
  Shield,
  Star,
  GraduationCap,
  RotateCcw,
  Plus,
  Flame,
} from "lucide-react";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = {
  title: "Dashboard — Learnivia",
  description: "Your personalized Learnivia Bento peer learning dashboard with real-time tracked minutes and sessions.",
};

const BENTO_PATHWAYS = [
  {
    id: "math",
    title: "Mathematics & Algebra",
    desc: "1-on-1 algebra, geometry, calculus, and competition math.",
    href: "/sessions?subject=Mathematics",
    icon: Calculator,
    iconBg: "rgba(45, 106, 79, 0.12)",
    iconColor: "#2D6A4F",
    badge: "1-on-1 Mentorship",
  },
  {
    id: "sci",
    title: "Sciences & Lab Prep",
    desc: "Earth, life, biology, and AP physics peer sessions.",
    href: "/sessions?subject=Science",
    icon: Atom,
    iconBg: "rgba(6, 182, 212, 0.12)",
    iconColor: "#0891B2",
    badge: "Lab & Concept Prep",
  },
  {
    id: "eng",
    title: "English & Reading",
    desc: "Reading comprehension, essay reviews, and literature arts.",
    href: "/sessions?subject=Reading+%26+Writing",
    icon: BookOpen,
    iconBg: "rgba(124, 58, 237, 0.12)",
    iconColor: "#C9922A",
    badge: "Reading & Writing",
  },
  {
    id: "hw",
    title: "Live Homework Help",
    desc: "Instant Zoom questions, step-by-step guidance & solution review.",
    href: "/homework-help",
    icon: MessageSquare,
    iconBg: "rgba(245, 158, 11, 0.14)",
    iconColor: "#D97706",
    badge: "Direct Queue",
  },
];

export default async function StudentDashboard() {
  const user = await getCurrentUser();

  if (!user) {
    return (
      <main className={styles.main}>
        <div className={styles.unauthCard}>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 800, color: "#0F172A" }}>Please Sign In</h1>
          <p style={{ color: "#64748B" }}>You need to sign in to access your Learnivia dashboard.</p>
          <Link href="/signin" className={styles.browseBtn} style={{ marginTop: "1rem" }}>Sign In</Link>
        </div>
      </main>
    );
  }

  const now = new Date();
  const hour = now.getHours();
  const timeGreeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  // Run database queries and real-time stats calculation concurrently
  const tutorProfile = user.tutorProfile;
  const [
    stats,
    upcomingBookings,
    completedBookings,
    enrolledWorkshops,
    childProfiles,
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
    prisma.childProfile.findMany({
      where: { parentId: user.id },
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
  const firstName = userName.split(" ")[0];
  const userInitials = user.name
    ? user.name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()
    : "U";

  // Gamified Scholar Level Progression based on genuine Study Points
  const sp = stats.points || 0;
  let level = 1;
  let levelTitle = "Curious Explorer";
  let nextLevelSp = 250;
  let prevLevelSp = 0;
  let nextPerk = "Custom avatar frame + 1.2x SP booster on attendance";

  if (sp >= 1000) {
    level = 4;
    levelTitle = "Master Scholar";
    prevLevelSp = 1000;
    nextLevelSp = 2500;
    nextPerk = "Elite Hall of Fame entry & direct mentor honors";
  } else if (sp >= 500) {
    level = 3;
    levelTitle = "Honor Roll Scholar";
    prevLevelSp = 500;
    nextLevelSp = 1000;
    nextPerk = "Exclusive 1-on-1 Study Room hosting permissions";
  } else if (sp >= 250) {
    level = 2;
    levelTitle = "Active Peer Scholar";
    prevLevelSp = 250;
    nextLevelSp = 500;
    nextPerk = "Priority 1-on-1 booking + Custom study room theme";
  }

  const progressPercent = Math.min(100, Math.max(8, Math.round(((sp - prevLevelSp) / (nextLevelSp - prevLevelSp)) * 100)));
  const spRemaining = Math.max(0, nextLevelSp - sp);

  const completedTaskCount = 1 + (stats.completedSessions > 0 ? 1 : 0);
  const taskProgressPercent = Math.round((completedTaskCount / 3) * 100);

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        {/* 0. Compact Executive Administrator Access Bar */}
        {user.isAdmin && (
          <div className={styles.compactAdminBar}>
            <div className={styles.compactAdminLeft}>
              <ShieldCheck size={16} className={styles.compactAdminShield} />
              <span className={styles.compactAdminTitle}>Administrator Mode</span>
              <span className={styles.compactAdminPill}>
                <span className={styles.compactAdminDot} />
                System Healthy • {stats.totalUsers} Registered Learners
              </span>
            </div>
            <div className={styles.compactAdminActions}>
              <Link href="/admin" className={styles.compactAdminBtnPrimary} prefetch={false}>
                Admin Center <ArrowRight size={12} />
              </Link>
              <Link href="/admin/users" className={styles.compactAdminBtnSecondary} prefetch={false}>
                Users
              </Link>
            </div>
          </div>
        )}

        {/* Tutor Application Status & Report Card Banner */}
        {tutorProfile && tutorProfile.status === "PENDING" && (
          <div className={styles.tutorPendingBanner}>
            <div className={styles.tutorPendingLeft}>
              <div className={styles.tutorPendingTitleRow}>
                <Clock size={18} color="#92400E" />
                <span className={styles.tutorPendingTitle}>
                  Volunteer Tutor Application Under Review
                </span>
                <span className={styles.tutorPendingPill}>
                  PENDING REVIEW
                </span>
              </div>
              <p className={styles.tutorPendingDesc}>
                {tutorProfile.reportCardUrl
                  ? "Your academic report card & scores have been submitted and are being reviewed by the Learnivia Academic Board."
                  : "Action needed: Please upload your academic report card / mark sheet so our team can verify your scores and approve your tutor profile."}
              </p>
            </div>
            <Link href="/apply" className={styles.tutorPendingBtn} prefetch={false}>
              <FileText size={15} />
              {tutorProfile.reportCardUrl ? "View / Update Report Card →" : "Upload Report Card Now →"}
            </Link>
          </div>
        )}

        {/* 1. Bento Deck 1: Hero Command Deck + Streak Tile + Scholar Mastery Tile */}
        <section className={styles.bentoHeroDeck} aria-label="Scholar Command Hub">
          {/* Bento Tile A: Hero Command Card */}
          <div className={styles.heroCommandCard}>
            <div>
              <div className={styles.heroStatusBadge}>
                <span className={styles.heroPulseDot} />
                <span>COMMUNITY • VERIFIED PEER VOLUNTEER TUTORS</span>
              </div>
              <h1 className={styles.heroGreetingTitle}>
                {timeGreeting}, {firstName} 👋
              </h1>
              <p className={styles.heroGreetingDesc}>
                Ready to elevate your learning? Connect with approved peer tutors for step-by-step K–10 homework help, exam prep, and live focus sessions.
              </p>
            </div>

            <div className={styles.heroLaunchCluster}>
              <Link href="/sessions" className={styles.heroLaunchBtnPrimary} prefetch={false}>
                <Zap size={16} fill="currentColor" /> Explore Live Sessions →
              </Link>
              <Link href="/homework-help" className={styles.heroLaunchBtnSecondary} prefetch={false}>
                <MessageSquare size={15} /> Ask a Homework Question
              </Link>
              <Link href="/find" className={styles.heroLaunchBtnSecondary} prefetch={false}>
                <Compass size={15} /> Browse 1-on-1 Tutors
              </Link>
            </div>
          </div>

          {/* Bento Tile B: Daily Study Goal Card */}
          <div className={styles.bentoStreakCard}>
            <div className={styles.bentoTileHeader}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                <Flame size={20} className={styles.streakFlameIcon} />
                <h2 className={styles.bentoTileTitle}>Study Goals</h2>
              </div>
              <span className={styles.streakCountBadge}>
                {stats.completedSessions > 0 ? `🎯 ${stats.completedSessions} SESSIONS` : "🎯 ACTIVE GOAL"}
              </span>
            </div>
            <p className={styles.bentoTileDesc}>
              {stats.learningMinutes > 0
                ? `You have logged ${stats.learningMinutes} verified learning minutes on Learnivia.`
                : "Attend or book your first 1-on-1 session to start building your verified transcript."}
            </p>
            <div className={styles.weekdayTrack}>
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, idx) => {
                const dayIndex = (now.getDay() + 6) % 7; // Monday = 0
                const isToday = idx === dayIndex;
                const isPast = idx < dayIndex;
                const hasSession = stats.completedSessions > 0 && isPast;
                return (
                  <div key={day} className={styles.dayCol}>
                    <span className={styles.dayLabel}>{day[0]}</span>
                    <div
                      className={`${styles.dayDot} ${
                        hasSession ? styles.dayDotDone : isToday ? styles.dayDotToday : ""
                      }`}
                    >
                      {hasSession ? "✓" : isToday ? "•" : ""}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bento Tile C: Scholar Mastery Card */}
          <div className={styles.bentoMasteryCard}>
            <div className={styles.bentoTileHeader}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                <Award size={19} color="#2D6A4F" />
                <h2 className={styles.masteryTitle}>Level {level} Scholar</h2>
              </div>
              <span className={styles.masteryBadge}>
                <Sparkles size={11} /> {sp} SP
              </span>
            </div>
            <div className={styles.xpProgressWrap}>
              <div className={styles.xpStatsRow}>
                <span>{levelTitle}</span>
                <span>{spRemaining} SP to Level {level + 1}</span>
              </div>
              <div className={styles.xpTrack}>
                <div className={styles.xpFill} style={{ width: `${progressPercent}%` }} />
              </div>
            </div>
            <div className={styles.perkPreviewBox}>
              <Sparkles size={13} color="#2D6A4F" style={{ flexShrink: 0 }} />
              <span>{nextPerk}</span>
            </div>
          </div>
        </section>

        {/* 2. Bento Deck 2: Learning Pathways Matrix */}
        <section className={styles.bentoPathwaysGrid} aria-label="Learning Pathways">
          {BENTO_PATHWAYS.map((p) => {
            const IconComp = p.icon;
            return (
              <Link key={p.id} href={p.href} className={styles.pathwayCard} prefetch={false}>
                <div className={styles.pathwayBadgeIcon} style={{ background: p.iconBg, color: p.iconColor }}>
                  <IconComp size={22} strokeWidth={2.2} />
                </div>
                <h3 className={styles.pathwayTitle}>{p.title}</h3>
                <p className={styles.pathwayDesc}>{p.desc}</p>
                <div className={styles.pathwayFooter}>
                  <span>{p.badge}</span>
                  <span>Explore →</span>
                </div>
              </Link>
            );
          })}
        </section>

        {/* 4. User Identity & Live Stats Bar */}
        <section className={styles.userStrip} aria-label="Student progress">
          <div className={styles.userProfileBlock}>
            <div className={styles.avatarCircle}>{userInitials}</div>
            <div className={styles.userMeta}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <h2 className={styles.userDisplayName}>{userName}</h2>
                {user.isAdmin ? (
                  <span style={{ fontSize: "0.725rem", fontWeight: 800, color: "#92400E", background: "#FEF3C7", border: "1px solid #FDE68A", padding: "0.15rem 0.6rem", borderRadius: "999px", display: "inline-flex", alignItems: "center", gap: "0.3rem" }}>
                    <ShieldCheck size={13} color="#D97706" /> Administrator
                  </span>
                ) : isTutor ? (
                  <span style={{ fontSize: "0.725rem", fontWeight: 700, color: "#059669", background: "#ECFDF5", border: "1px solid #A7F3D0", padding: "0.15rem 0.55rem", borderRadius: "999px", display: "inline-flex", alignItems: "center", gap: "0.3rem" }}>
                    <CheckCircle2 size={13} color="#059669" /> Verified Tutor
                  </span>
                ) : tutorProfile?.status === "PENDING" ? (
                  <span style={{ fontSize: "0.725rem", fontWeight: 700, color: "#B45309", background: "#FEF3C7", border: "1px solid #FDE68A", padding: "0.15rem 0.55rem", borderRadius: "999px", display: "inline-flex", alignItems: "center", gap: "0.3rem" }}>
                    <Clock size={13} color="#D97706" /> Tutor Review Pending
                  </span>
                ) : (
                  <span style={{ fontSize: "0.725rem", fontWeight: 700, color: "#2D6A4F", background: "#EAF3ED", border: "1px solid #C7D2FE", padding: "0.15rem 0.55rem", borderRadius: "999px", display: "inline-flex", alignItems: "center", gap: "0.3rem" }}>
                    <GraduationCap size={13} color="#2D6A4F" /> K–10 Learner
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
                    <Link href="/tutor" className={styles.metaLink} prefetch={false}>
                      Tutor Dashboard →
                    </Link>
                    <Link href="/tutor/transcript" className={styles.metaLink} prefetch={false}>
                      Verified Hours ({stats.volunteerHours} hrs)
                    </Link>
                  </>
                ) : (
                  <>
                    <Link href="/sessions" className={styles.metaLink} prefetch={false}>
                      Browse Sessions
                    </Link>
                    <Link href="/apply" className={styles.metaLink} prefetch={false}>
                      Become a Tutor
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className={styles.statsBlock}>
            {/* Rank Pill */}
            <div className={styles.rankPill}>
              <Trophy size={16} color="#D97706" />
              <div>
                <span>Rank #{stats.rank}</span>
                <span style={{ display: "block", fontSize: "0.68rem", opacity: 0.85 }}>of {stats.totalUsers} learners</span>
              </div>
            </div>

            {/* Study Points Pill */}
            <div className={styles.statPill}>
              <Sparkles size={16} color="#2D6A4F" />
              <div className={styles.statValueCol}>
                <span className={styles.statNumber}>{stats.points.toLocaleString()}</span>
                <span className={styles.statUnit}>Study Points (SP)</span>
              </div>
            </div>

            {/* Real Learning Minutes Pill */}
            <div className={styles.statPill}>
              <Clock size={16} color="#059669" />
              <div className={styles.statValueCol}>
                <span className={styles.statNumber}>{stats.learningMinutes.toLocaleString()}</span>
                <span className={styles.statUnit}>Learning minutes</span>
              </div>
            </div>

            {/* Real-time Leaderboard Link */}
            <Link href="/leaderboard" className={styles.leaderboardLink} prefetch={false}>
              <Award size={15} color="#1E3A5F" />
              <span>Leaderboard</span>
              <ChevronRight size={13} />
            </Link>
          </div>
        </section>

        {/* Parent-Managed Child Profiles (K-10) */}
        {(!isTutor || childProfiles.length > 0) && (
          <ChildProfileSection initialProfiles={childProfiles} />
        )}

        {/* 5. Bento Main Deck: Upcoming Sessions & Scholar Tasks */}
        <div className={styles.twoColGrid}>
          {/* Left Column: Upcoming & Past Sessions */}
          <section className={styles.sessionsCol}>
            <div className={styles.colHeader}>
              <h2 className={styles.colTitle}>Upcoming Sessions</h2>
              <Link href="/sessions" className={styles.viewAllLink} prefetch={false}>
                Find more &gt;
              </Link>
            </div>

            {upcomingBookings.length === 0 && upcomingWorkshops.length === 0 ? (
              <div className={styles.emptyCard}>
                <div className={styles.emptyIcon} aria-hidden="true">
                  <Calendar size={28} />
                </div>
                <h3 className={styles.emptyTitle}>No upcoming sessions booked</h3>
                <p className={styles.emptyText}>
                  Explore live small-group sessions or book a free 1-on-1 session with an approved peer tutor.
                </p>
                <div style={{ display: "flex", gap: "0.65rem", justifyContent: "center", flexWrap: "wrap", marginTop: "0.35rem" }}>
                  <Link href="/sessions" className={styles.browseBtn} prefetch={false}>
                    Find a Session →
                  </Link>
                  <Link href="/find" className={styles.promoSecondaryBtn} prefetch={false}>
                    Browse 1-on-1 Tutors
                  </Link>
                </div>

                {/* Instant Subject Quick-Launch Chips */}
                <div className={styles.emptySubjectSection}>
                  <p className={styles.emptySubjectPrompt}>Instant Subject Quick-Launch:</p>
                  <div className={styles.subjectChipsRow}>
                    <Link href="/sessions?subject=Mathematics" className={styles.subjectChip} prefetch={false}>
                      📐 Mathematics &amp; Algebra
                    </Link>
                    <Link href="/sessions?subject=Science" className={styles.subjectChip} prefetch={false}>
                      🔬 Earth &amp; Life Science
                    </Link>
                    <Link href="/sessions?subject=Reading+%26+Writing" className={styles.subjectChip} prefetch={false}>
                      ✍️ English &amp; Reading
                    </Link>
                    <Link href="/sessions?subject=Chemistry" className={styles.subjectChip} prefetch={false}>
                      🧪 Chemistry
                    </Link>
                    <Link href="/find" className={styles.subjectChip} prefetch={false}>
                      🌟 All Verified Tutors
                    </Link>
                  </div>
                </div>
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
                          <Video size={14} /> Join Zoom
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
                            <Video size={14} /> Join Zoom
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

            {/* Past Completed Sessions */}
            <div className={styles.completedBlock}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem", flexWrap: "wrap", gap: "0.5rem" }}>
                <h3 className={styles.subHeading} style={{ margin: 0 }}>
                  Past Completed Sessions ({completedBookings.length + completedWorkshops.length})
                </h3>
                <span style={{ fontSize: "0.8rem", color: "#059669", fontWeight: 700, display: "inline-flex", alignItems: "center", gap: "0.3rem" }}>
                  <Clock size={13} color="#059669" /> {stats.learningMinutes} total learning minutes
                </span>
              </div>

              {completedBookings.length === 0 && completedWorkshops.length === 0 ? (
                <div style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: 16, padding: "1.5rem", textAlign: "center", color: "#64748B", fontSize: "0.875rem" }}>
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
                            <strong style={{ fontSize: "0.95rem", color: "#0F172A" }}>{b.subject}</strong>
                            <span style={{ color: "#64748B" }}> with {b.tutor.user.name}</span>
                            {b.topic && (
                              <p style={{ margin: "0.2rem 0 0", fontSize: "0.8rem", color: "#475569" }}>
                                Topic: {b.topic}
                              </p>
                            )}
                            <div className={styles.completedDate} style={{ marginTop: "0.2rem" }}>
                              Completed on {new Date(b.startTime).toLocaleDateString()}
                            </div>
                          </div>

                          <span className={styles.durationBadge}>
                            {durationMins} mins
                          </span>
                        </div>

                        {b.checkUpNote && (
                          <div className={styles.checkUpBox}>
                            <strong>Tutor Follow-up &amp; Notes:</strong>
                            <p style={{ margin: "0.2rem 0 0" }}>{b.checkUpNote}</p>
                          </div>
                        )}

                        <div className={styles.completedActions}>
                          <Link href={`/tutor/${b.tutorId}`} className={styles.bookAgainBtn} prefetch={false}>
                            <RotateCcw size={13} /> Book with {tutorFirstName} Again
                          </Link>

                          {b.recordingUrl ? (
                            <a href={b.recordingUrl} target="_blank" rel="noopener noreferrer" className={styles.recordingBtn}>
                              <Video size={13} /> Watch Recording
                            </a>
                          ) : (
                            <span style={{ fontSize: "0.75rem", color: "#94A3B8" }}>
                              Recording sent via email or direct link
                            </span>
                          )}

                          <Link href={`/tutor/${b.tutorId}#reviews`} className={styles.viewTutorBtn} prefetch={false}>
                            <Star size={12} color="#F59E0B" fill="#F59E0B" style={{ display: "inline", verticalAlign: "middle" }} /> Review (+15 SP)
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
                            <strong style={{ fontSize: "0.95rem", color: "#0F172A" }}>
                              [Workshop] {e.workshop.title}
                            </strong>
                            <span style={{ color: "#64748B" }}> • Host: {hostName}</span>
                            <div className={styles.completedDate} style={{ marginTop: "0.2rem" }}>
                              Completed on {new Date(e.workshop.startTime).toLocaleDateString()}
                            </div>
                          </div>

                          <span className={styles.durationBadge}>
                            {durationMins} mins
                          </span>
                        </div>

                        {e.workshop.recordingUrl && (
                          <div style={{ marginTop: "0.25rem" }}>
                            <a href={e.workshop.recordingUrl} target="_blank" rel="noopener noreferrer" className={styles.recordingBtn}>
                              <Video size={13} /> Watch Recording
                            </a>
                          </div>
                        )}

                        <div className={styles.completedActions}>
                          <Link href={`/tutor/${e.workshop.tutorId}`} className={styles.bookAgainBtn} prefetch={false}>
                            <RotateCcw size={13} /> Book with {hostFirstName}
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </section>

          {/* Right Column: Tasks & Action Cards */}
          <section className={styles.tasksCol}>
            <div className={styles.colHeader}>
              <h2 className={styles.colTitle}>Tasks</h2>
            </div>

            <div className={styles.tasksCard}>
              {/* Task Progress Meter */}
              <div className={styles.taskProgressWrap}>
                <div className={styles.taskProgressHeader}>
                  <span>Tasks Completed: {completedTaskCount} of 3</span>
                  <span>{taskProgressPercent}%</span>
                </div>
                <div className={styles.taskProgressBar}>
                  <div className={styles.taskProgressFill} style={{ width: `${taskProgressPercent}%` }} />
                </div>
                <div className={styles.taskBountyTag}>
                  <Sparkles size={12} color="#059669" /> Complete all 3 starter tasks to unlock +50 SP!
                </div>
              </div>

              <ul className={styles.taskList}>
                <li className={styles.taskItem}>
                  <CheckCircle2 size={19} color="#10B981" style={{ flexShrink: 0, marginTop: "2px" }} />
                  <div>
                    <strong className={styles.taskTitle}>Welcome to Learnivia!</strong>
                    <p className={styles.taskDesc}>Your account is active with real-time stats tracking.</p>
                  </div>
                </li>
                <li className={styles.taskItem}>
                  {stats.completedSessions > 0 ? (
                    <CheckCircle2 size={19} color="#10B981" style={{ flexShrink: 0, marginTop: "2px" }} />
                  ) : (
                    <Circle size={19} color="#94A3B8" style={{ flexShrink: 0, marginTop: "2px" }} />
                  )}
                  <div>
                    <strong className={styles.taskTitle}>Attend Your First Peer Session</strong>
                    <p className={styles.taskDesc}>
                      {stats.completedSessions > 0
                        ? `Great job! You have attended ${stats.completedSessions} session(s).`
                        : "Join a small group workshop or 1-on-1 session to start earning SP."}
                    </p>
                    {stats.completedSessions === 0 && (
                      <Link href="/sessions" className={styles.taskActionLink} prefetch={false}>
                        Browse sessions →
                      </Link>
                    )}
                  </div>
                </li>
                <li className={styles.taskItem}>
                  <Circle size={19} color="#94A3B8" style={{ flexShrink: 0, marginTop: "2px" }} />
                  <div>
                    <strong className={styles.taskTitle}>Ask a Homework Question</strong>
                    <p className={styles.taskDesc}>Get step-by-step assistance or live Zoom explanations.</p>
                    <Link href="/homework-help" className={styles.taskActionLink} prefetch={false}>
                      Open Homework Help →
                    </Link>
                  </div>
                </li>
              </ul>
            </div>

            {/* Role-Specific Action Card */}
            {isTutor ? (
              <div className={styles.sideCard} style={{ background: "linear-gradient(135deg, #EAF3ED 0%, #F3EFE8 100%)", borderColor: "#B5D9C5" }}>
                <h3 className={styles.sideCardTitle} style={{ color: "#1C1A17", display: "inline-flex", alignItems: "center", gap: "0.4rem" }}>
                  <Zap size={16} color="#2D6A4F" /> Tutor Quick Portal
                </h3>
                <p className={styles.sideCardText}>
                  Verified Tutor: You have logged {stats.volunteerHours} hours of tutoring. Host small-group workshops and answer live homework questions.
                </p>
                <div className={styles.sideCardLinks}>
                  <Link href="/tutor#schedule-session" className={styles.browseBtn} style={{ padding: "0.5rem 0.95rem", fontSize: "0.8rem", display: "inline-flex", alignItems: "center", gap: "0.35rem" }} prefetch={false}>
                    <Plus size={14} /> Host Session →
                  </Link>
                  <Link href="/tutor" className={styles.resourcesLink} prefetch={false}>
                    Tutor Dashboard →
                  </Link>
                </div>
              </div>
            ) : tutorProfile?.status === "PENDING" ? (
              <div className={styles.sideCard} style={{ background: "linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%)", borderColor: "#FDE68A" }}>
                <h3 className={styles.sideCardTitle} style={{ color: "#B45309", display: "inline-flex", alignItems: "center", gap: "0.4rem" }}>
                  <Clock size={16} color="#B45309" /> Tutor Application Pending
                </h3>
                <p className={styles.sideCardText}>
                  Your application is currently being reviewed by our moderation team. You&apos;ll be notified by email once approved!
                </p>
                <div className={styles.sideCardLinks}>
                  <Link href="/tutor" className={styles.reportLink} style={{ background: "#D97706", color: "#FFFFFF" }} prefetch={false}>
                    Check Status →
                  </Link>
                  <Link href="/support" className={styles.resourcesLink} style={{ color: "#B45309" }} prefetch={false}>
                    Support FAQ
                  </Link>
                </div>
              </div>
            ) : (
              <div className={styles.sideCard} style={{ background: "linear-gradient(135deg, #EAF3ED 0%, #F3EFE8 100%)", borderColor: "#B5D9C5" }}>
                <h3 className={styles.sideCardTitle} style={{ color: "#1C1A17", display: "inline-flex", alignItems: "center", gap: "0.4rem" }}>
                  <GraduationCap size={16} color="#2D6A4F" /> Become a Volunteer Tutor
                </h3>
                <p className={styles.sideCardText}>
                  Passionate about helping other students? Apply to become an approved peer tutor and receive official volunteer transcripts for your applications.
                </p>
                <div className={styles.sideCardLinks}>
                  <Link href="/apply" className={styles.browseBtn} style={{ padding: "0.5rem 0.95rem", fontSize: "0.8rem" }} prefetch={false}>
                    Apply to Tutor →
                  </Link>
                  <Link href="/how-it-works" className={styles.resourcesLink} prefetch={false}>
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
                <Link href="/safety/report" className={styles.reportLink} style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem" }} prefetch={false}>
                  <Shield size={14} /> Report an Issue →
                </Link>
                <Link href="/resources" className={styles.resourcesLink} style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem" }} prefetch={false}>
                  <BookOpen size={14} /> Learning Tools →
                </Link>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
