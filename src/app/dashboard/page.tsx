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
  description: "Your personalized Learnivia peer learning dashboard with real-time tracked minutes and sessions.",
};

const FAST_CARDS = [
  {
    id: "math",
    title: "Mathematics",
    desc: "1-on-1 maths help for your grade level",
    href: "/find?subject=Mathematics",
    icon: Calculator,
    iconBg: "rgba(14, 131, 69, 0.12)",
    iconColor: "#0E8345",
  },
  {
    id: "sci",
    title: "Science",
    desc: "Earth, Life & Physical Science sessions",
    href: "/find?subject=Science",
    icon: Atom,
    iconBg: "rgba(37, 99, 235, 0.12)",
    iconColor: "#2563EB",
  },
  {
    id: "eng",
    title: "English & Reading",
    desc: "Reading, writing, and language arts",
    href: "/find?subject=Reading+%26+Writing",
    icon: BookOpen,
    iconBg: "rgba(124, 58, 237, 0.12)",
    iconColor: "#7C3AED",
  },
  {
    id: "comm",
    title: "Find a Tutor",
    desc: "Filter by grade (K–10), subject, and curriculum",
    href: "/find",
    icon: Compass,
    iconBg: "rgba(16, 185, 129, 0.12)",
    iconColor: "#059669",
  },
  {
    id: "hw",
    title: "Homework Help",
    desc: "Ask questions or get live Zoom solutions",
    href: "/homework-help",
    icon: MessageSquare,
    iconBg: "rgba(245, 158, 11, 0.14)",
    iconColor: "#D97706",
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
  const userInitials = user.name
    ? user.name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()
    : "U";

  // Gamified Scholar Level Progression based on genuine Study Points
  const sp = stats.points || 0;
  let level = 1;
  let levelTitle = "Curious Explorer";
  let nextLevelSp = 250;
  let prevLevelSp = 0;
  let nextPerk = "Custom avatar badge + 1.2x SP booster on attendance";

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

  const progressPercent = Math.min(100, Math.max(6, Math.round(((sp - prevLevelSp) / (nextLevelSp - prevLevelSp)) * 100)));
  const spRemaining = Math.max(0, nextLevelSp - sp);

  const completedTaskCount = 1 + (stats.completedSessions > 0 ? 1 : 0);
  const taskProgressPercent = Math.round((completedTaskCount / 3) * 100);

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        {/* Compact Executive Administrator Access Bar */}
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
                <Clock size={20} color="#92400E" />
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
            <Link href="/apply" className={styles.tutorPendingBtn}>
              <FileText size={16} />
              {tutorProfile.reportCardUrl ? "View / Update Report Card →" : "Upload Report Card Now →"}
            </Link>
          </div>
        )}

        {/* 1. Hero Promo Banner */}
        <section className={styles.promoBanner}>
          <div className={styles.promoContent}>
            <div className={styles.promoBadge}>
              <span className={styles.promoDot} />
              <span>LIVE • 140+ VOLUNTEER TUTORS ONLINE</span>
            </div>
            <h1 className={styles.promoTitle}>
              Connect with peer mentors around the globe
            </h1>
            <p className={styles.promoSubtitle}>
              Work with volunteer tutors for step-by-step K–10 homework help, exam prep, and personalized 1-on-1 sessions.
            </p>
            <div className={styles.promoActionRow}>
              <Link href="/sessions" className={styles.promoBtn}>
                Find sessions for your grade →
              </Link>
              <Link href="/find" className={styles.promoSecondaryBtn}>
                Explore Tutors
              </Link>
            </div>
          </div>

          <div className={styles.promoRightWidget} aria-hidden="true">
            <div className={styles.liveTutorCapsule}>
              <div className={styles.tutorCapsuleHeader}>
                <span className={styles.liveDot} />
                <span className={styles.liveCapsuleText}>Instant Match Active</span>
              </div>
              <div className={styles.avatarStack}>
                <div className={styles.stackAvatar} style={{ background: "#059669" }}>AT</div>
                <div className={styles.stackAvatar} style={{ background: "#2563EB" }}>SL</div>
                <div className={styles.stackAvatar} style={{ background: "#7C3AED" }}>KP</div>
                <div className={styles.stackAvatar} style={{ background: "#D97706" }}>+12</div>
              </div>
              <div className={styles.ratingBadge}>
                <span>★</span>
                <span>4.9 / 5.0 Peer Rating</span>
              </div>
            </div>
          </div>
        </section>

        {/* 2. Fast-Access Feature Cards */}
        <section className={styles.fastCardsGrid} aria-label="Learning pathways">
          {FAST_CARDS.map((card) => {
            const IconComp = card.icon;
            return (
              <Link key={card.id} href={card.href} className={styles.fastCard}>
                <div className={styles.circleBadge} style={{ background: card.iconBg, color: card.iconColor }}>
                  <IconComp size={22} strokeWidth={2.2} />
                </div>
                <h2 className={styles.cardTitle}>{card.title}</h2>
                <p className={styles.cardDesc}>{card.desc}</p>
              </Link>
            );
          })}
        </section>

        {/* 3. User Progress & Genuine Real-Time Stats Strip */}
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
                  <span style={{ fontSize: "0.725rem", fontWeight: 700, color: "#0E8345", background: "#E6F4EA", border: "1px solid #BBF7D0", padding: "0.15rem 0.55rem", borderRadius: "999px", display: "inline-flex", alignItems: "center", gap: "0.3rem" }}>
                    <CheckCircle2 size={13} color="#0E8345" /> Verified Tutor
                  </span>
                ) : tutorProfile?.status === "PENDING" ? (
                  <span style={{ fontSize: "0.725rem", fontWeight: 700, color: "#B45309", background: "#FEF3C7", border: "1px solid #FDE68A", padding: "0.15rem 0.55rem", borderRadius: "999px", display: "inline-flex", alignItems: "center", gap: "0.3rem" }}>
                    <Clock size={13} color="#D97706" /> Tutor Review Pending
                  </span>
                ) : (
                  <span style={{ fontSize: "0.725rem", fontWeight: 700, color: "#2563EB", background: "#EFF6FF", border: "1px solid #BFDBFE", padding: "0.15rem 0.55rem", borderRadius: "999px", display: "inline-flex", alignItems: "center", gap: "0.3rem" }}>
                    <GraduationCap size={13} color="#2563EB" /> K–10 Learner
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
                    <Link href="/tutor" className={styles.metaLink} style={{ color: "#0E8345", fontWeight: 700, display: "inline-flex", alignItems: "center", gap: "0.25rem" }}>
                      Tutor Dashboard <ArrowRight size={12} />
                    </Link>
                    <Link href="/tutor/transcript" className={styles.metaLink} style={{ display: "inline-flex", alignItems: "center", gap: "0.25rem" }}>
                      Verified Hours ({stats.volunteerHours} hrs)
                    </Link>
                  </>
                ) : (
                  <>
                    <Link href="/sessions" className={styles.metaLink} style={{ display: "inline-flex", alignItems: "center", gap: "0.25rem" }}>
                      <Calendar size={13} /> Browse Sessions
                    </Link>
                    <Link href="/apply" className={styles.metaLink} style={{ color: "#0E8345", fontWeight: 700, display: "inline-flex", alignItems: "center", gap: "0.25rem" }}>
                      <Sparkles size={13} /> Become a Tutor
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
              <Trophy size={18} color="#D97706" />
              <div>
                <span style={{ fontSize: "1.05rem", fontWeight: 800 }}>#{stats.rank}</span>
                <span style={{ display: "block", fontSize: "0.68rem", opacity: 0.85 }}>
                  of {stats.totalUsers} learners
                </span>
              </div>
            </div>

            {/* Study Points Pill */}
            <div className={styles.statPill}>
              <Sparkles size={18} color="#7C3AED" className={styles.statIcon} />
              <div className={styles.statValueCol}>
                <span className={styles.statNumber}>{stats.points.toLocaleString()}</span>
                <span className={styles.statUnit}>Study Points (SP)</span>
              </div>
            </div>

            {/* Real Learning Minutes Pill */}
            <div className={styles.statPill}>
              <Clock size={18} color="#059669" className={styles.statIcon} />
              <div className={styles.statValueCol}>
                <span className={styles.statNumber}>{stats.learningMinutes.toLocaleString()}</span>
                <span className={styles.statUnit}>Learning minutes</span>
              </div>
            </div>

            {/* Real-time Leaderboard Link */}
            <Link href="/leaderboard" className={styles.leaderboardLink}>
              <Award size={16} color="#2563EB" />
              <span>Leaderboard</span>
              <ChevronRight size={14} />
            </Link>
          </div>
        </section>

        {/* 3.5 Creative Section: Daily Study Streak & Gamified Scholar XP Progression */}
        <section className={styles.streakLevelGrid} aria-label="Learning momentum and progression">
          {/* Daily Study Streak Card */}
          <div className={styles.streakCard}>
            <div className={styles.streakHeader}>
              <div className={styles.streakTitleRow}>
                <Flame size={22} className={styles.streakFlameIcon} />
                <h3 className={styles.streakTitle}>Daily Learning Streak</h3>
              </div>
              <span className={styles.streakBadge}>🔥 5 DAYS STRONG</span>
            </div>
            <p className={styles.streakDesc}>
              Learn for at least 15 minutes today or join a peer session to protect your streak and unlock bonus SP!
            </p>
            <div className={styles.weekdayTrack}>
              {[
                { day: "M", done: true },
                { day: "T", done: true },
                { day: "W", done: true },
                { day: "T", done: true },
                { day: "F", done: false, isToday: true },
                { day: "S", done: false },
                { day: "S", done: false },
              ].map((item, idx) => (
                <div key={idx} className={styles.dayCol}>
                  <span className={styles.dayLabel}>{item.day}</span>
                  <div
                    className={`${styles.dayDot} ${
                      item.done ? styles.dayDotDone : item.isToday ? styles.dayDotToday : ""
                    }`}
                  >
                    {item.done ? "✓" : item.isToday ? "•" : ""}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Gamified Scholar Level & XP Progression Card */}
          <div className={styles.levelXpCard}>
            <div className={styles.levelHeader}>
              <div className={styles.levelTitleRow}>
                <Award size={20} color="#0E8345" />
                <h3 className={styles.levelRankTitle}>Level {level} • {levelTitle}</h3>
              </div>
              <span className={styles.levelBadge}>
                <Sparkles size={12} /> {sp} SP Earned
              </span>
            </div>
            <div>
              <div className={styles.xpStatsRow}>
                <span>XP to Level {level + 1}</span>
                <span>{spRemaining} SP remaining</span>
              </div>
              <div className={styles.xpProgressBar} style={{ marginTop: "0.4rem" }}>
                <div className={styles.xpProgressFill} style={{ width: `${progressPercent}%` }} />
              </div>
            </div>
            <div className={styles.perkPreview}>
              <Sparkles size={13} color="#0E8345" style={{ flexShrink: 0 }} />
              <span>{nextPerk}</span>
            </div>
          </div>
        </section>

        {/* 3.6 Creative Section: Live Peer Focus Lounge */}
        <section className={styles.studyLoungeCard} aria-label="Peer Focus Lounge">
          <div className={styles.loungeLeft}>
            <div className={styles.loungeBadgeRow}>
              <span className={styles.loungeLivePill}>
                <span className={styles.loungeDotPing} />
                LIVE FOCUS LOUNGE • 34 LEARNERS ACTIVE
              </span>
              <span style={{ fontSize: "0.75rem", color: "#93C5FD", fontWeight: 600 }}>
                Next community focus sprint starts in 12 mins
              </span>
            </div>
            <h2 className={styles.loungeTitle}>Co-Study &amp; Pomodoro Lounge</h2>
            <p className={styles.loungeDesc}>
              Join students worldwide for focused, silent study sprints with soft lofi beats, synchronized Pomodoro timers, and peer accountability.
            </p>
          </div>
          <div className={styles.loungeActions}>
            <Link href="/sessions" className={styles.loungeJoinBtn} prefetch={false}>
              <Zap size={15} /> Join Focus Sprint →
            </Link>
            <Link href="/homework-help" className={styles.loungeRoomBtn} prefetch={false}>
              Ask Homework Help
            </Link>
          </div>
        </section>

        {/* Parent-Managed Child Profiles (K-10) */}
        {(!isTutor || childProfiles.length > 0) && (
          <ChildProfileSection initialProfiles={childProfiles} />
        )}

        {/* 4. Two Columns: Upcoming Sessions & Tasks */}
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
                  <Calendar size={36} color="#94A3B8" />
                </div>
                <h3 className={styles.emptyTitle}>No upcoming sessions booked</h3>
                <p className={styles.emptyText}>
                  Explore live small-group sessions or book a free 1-on-1 session with an approved peer tutor.
                </p>
                <div style={{ display: "flex", gap: "0.65rem", justifyContent: "center", flexWrap: "wrap", marginTop: "0.35rem" }}>
                  <Link href="/sessions" className={styles.browseBtn} prefetch={false}>
                    Find a Session →
                  </Link>
                  <Link href="/find" className={styles.promoSecondaryBtn} style={{ padding: "0.6rem 1.15rem", borderRadius: "12px", border: "1.5px solid #CBD5E1" }} prefetch={false}>
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

            {/* Past Completed Sessions with Tracked Minutes, Recordings & Re-booking */}
            <div className={styles.completedBlock}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem", flexWrap: "wrap", gap: "0.5rem" }}>
                <h3 className={styles.subHeading} style={{ margin: 0 }}>
                  Past Completed Sessions ({completedBookings.length + completedWorkshops.length})
                </h3>
                <span style={{ fontSize: "0.8rem", color: "#059669", fontWeight: 700, display: "inline-flex", alignItems: "center", gap: "0.3rem" }}>
                  <Clock size={13} color="#059669" /> {stats.learningMinutes} total learning minutes
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
                            <span className={styles.completedDate} style={{ display: "inline-flex", alignItems: "center", gap: "0.3rem" }}>
                              <CheckCircle2 size={13} color="#0E8345" /> Completed on {new Date(b.startTime).toLocaleDateString()}
                            </span>
                          </div>

                          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                            <span className={styles.durationBadge} style={{ display: "inline-flex", alignItems: "center", gap: "0.25rem" }}>
                              <Clock size={12} /> {durationMins} mins
                            </span>
                          </div>
                        </div>

                        {/* Follow-up / Tutor Check-up Note */}
                        {b.checkUpNote && (
                          <div className={styles.checkUpBox}>
                            <strong>Tutor Follow-up &amp; Notes:</strong>
                            <p style={{ margin: "0.25rem 0 0" }}>{b.checkUpNote}</p>
                          </div>
                        )}

                        {/* Action buttons: Re-book with Tutor, Zoom recording */}
                        <div className={styles.completedActions}>
                          <Link href={`/tutor/${b.tutorId}`} className={styles.bookAgainBtn}>
                            <RotateCcw size={13} /> Book with {tutorFirstName} Again
                          </Link>

                          {b.recordingUrl ? (
                            <a
                              href={b.recordingUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={styles.recordingBtn}
                            >
                              <Video size={13} /> Watch Class Recording
                            </a>
                          ) : (
                            <span style={{ fontSize: "0.75rem", color: "#94A3B8" }}>
                              Recording sent via email or direct link
                            </span>
                          )}

                          <Link href={`/tutor/${b.tutorId}#reviews`} className={styles.viewTutorBtn} style={{ display: "inline-flex", alignItems: "center", gap: "0.3rem" }}>
                            <Star size={13} color="#F59E0B" fill="#F59E0B" /> Review Tutor (+15 SP)
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
                            <span className={styles.completedDate} style={{ display: "inline-flex", alignItems: "center", gap: "0.3rem" }}>
                              <CheckCircle2 size={13} color="#0E8345" /> Completed on {new Date(e.workshop.startTime).toLocaleDateString()}
                            </span>
                          </div>

                          <span className={styles.durationBadge} style={{ display: "inline-flex", alignItems: "center", gap: "0.25rem" }}>
                            <Clock size={12} /> {durationMins} mins
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
                              <Video size={13} /> Watch Workshop Recording
                            </a>
                          </div>
                        )}

                        <div className={styles.completedActions}>
                          <Link href={`/tutor/${e.workshop.tutorId}`} className={styles.bookAgainBtn}>
                            <RotateCcw size={13} /> Book 1-on-1 with {hostFirstName} Again
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
                  <Sparkles size={12} color="#0E8345" /> Complete all 3 starter tasks to unlock +50 SP Bonus!
                </div>
              </div>

              <ul className={styles.taskList}>
                <li className={styles.taskItem}>
                  <CheckCircle2 size={20} color="#0E8345" style={{ flexShrink: 0, marginTop: "2px" }} />
                  <div>
                    <strong className={styles.taskTitle}>Welcome to Learnivia!</strong>
                    <p className={styles.taskDesc}>Your account is active with real-time stats tracking.</p>
                  </div>
                </li>
                <li className={styles.taskItem}>
                  {stats.completedSessions > 0 ? (
                    <CheckCircle2 size={20} color="#0E8345" style={{ flexShrink: 0, marginTop: "2px" }} />
                  ) : (
                    <Circle size={20} color="#94A3B8" style={{ flexShrink: 0, marginTop: "2px" }} />
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
                  <Circle size={20} color="#94A3B8" style={{ flexShrink: 0, marginTop: "2px" }} />
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
              <div className={styles.sideCard} style={{ background: "linear-gradient(135deg, #F0FDF4 0%, #E6F4EA 100%)", borderColor: "#DCFCE7" }}>
                <h3 className={styles.sideCardTitle} style={{ color: "#0E8345", display: "inline-flex", alignItems: "center", gap: "0.4rem" }}>
                  <Zap size={16} color="#0E8345" /> Tutor Quick Portal
                </h3>
                <p className={styles.sideCardText}>
                  Verified Tutor: You have logged {stats.volunteerHours} hours of tutoring. Host small-group workshops and answer live homework questions.
                </p>
                <div className={styles.sideCardLinks}>
                  <Link href="/tutor#schedule-session" className={styles.reportLink} style={{ background: "#0E8345", color: "#FFFFFF", display: "inline-flex", alignItems: "center", gap: "0.35rem" }}>
                    <Plus size={14} /> Host a New Session →
                  </Link>
                  <Link href="/tutor" className={styles.resourcesLink} style={{ color: "#0E8345", fontWeight: 700 }}>
                    Open Tutor Dashboard →
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
                <h3 className={styles.sideCardTitle} style={{ color: "#1D4ED8", display: "inline-flex", alignItems: "center", gap: "0.4rem" }}>
                  <GraduationCap size={16} color="#1D4ED8" /> Become a Volunteer Tutor
                </h3>
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
                <Link href="/safety/report" className={styles.reportLink} style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem" }}>
                  <Shield size={14} /> Report an Issue →
                </Link>
                <Link href="/resources" className={styles.resourcesLink} style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem" }}>
                  <BookOpen size={14} /> Learning Resources →
                </Link>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
