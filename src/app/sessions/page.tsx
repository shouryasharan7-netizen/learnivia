import Link from "next/link";
import { prisma } from "@/lib/prisma";
import styles from "./page.module.css";
import { auth } from "@/auth";
import { FormattedDateTime } from "@/components/FormattedDateTime";
import { getMeetingUrls } from "@/lib/meetingUrl";
import SessionFilterBar from "./SessionFilterBar";
import { CalendarPlus, GraduationCap, ArrowRight, Video, Users, CalendarCheck, Clock, Compass, ExternalLink } from "lucide-react";

export const dynamic = "force-dynamic";
export const revalidate = 30; // ISR: 30s cache

export const metadata = {
  title: "My Schedule & Study Sessions | Learnivia",
  description: "Manage your booked 1-on-1 peer tutoring sessions, join live study rooms, and explore upcoming group workshops.",
};

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function getAvatarColor(name: string) {
  const colors = ["#234B3B", "#B85A43", "#B18435", "#526B7A", "#2F614D", "#986E2A"];
  const idx = name.charCodeAt(0) % colors.length;
  return colors[idx];
}

type Props = {
  searchParams: Promise<{
    q?: string;
    subject?: string;
    curriculum?: string;
    grade?: string;
    allGrades?: string;
    tab?: string;
  }>;
};

// High-performance shared in-memory cache for sessions & tutors
interface CachedSessionsData {
  workshops: any[];
  tutors: any[];
  timestamp: number;
}

let cachedSessionsData: CachedSessionsData | null = null;
let inflightSessionsPromise: Promise<CachedSessionsData> | null = null;

async function getCachedSessionsData(): Promise<CachedSessionsData> {
  const now = Date.now();
  if (cachedSessionsData && now - cachedSessionsData.timestamp < 120_000) {
    return cachedSessionsData;
  }
  if (inflightSessionsPromise) {
    return inflightSessionsPromise;
  }

  inflightSessionsPromise = (async () => {
    try {
      const [workshops, tutors] = await Promise.all([
        prisma.workshop.findMany({
          where: {
            status: "UPCOMING",
            startTime: { gte: new Date(Date.now() - 30 * 60 * 1000) },
            tutor: { status: "APPROVED" },
          },
          include: {
            tutor: {
              select: {
                id: true,
                school: true,
                user: { select: { id: true, name: true, image: true } },
              },
            },
            enrollments: true,
          },
          orderBy: { startTime: "asc" },
          take: 30,
        }),
        prisma.tutorProfile.findMany({
          where: { status: "APPROVED" },
          include: {
            user: { select: { id: true, name: true, image: true, email: true, curriculum: true, grade: true } },
            subjects: true,
            availabilities: true,
            gradeLevels: true,
          },
          take: 40,
        }),
      ]);

      cachedSessionsData = { workshops, tutors, timestamp: Date.now() };
      return cachedSessionsData;
    } catch (err) {
      console.warn("Sessions data fetch error:", (err as Error)?.message);
      return cachedSessionsData || { workshops: [], tutors: [], timestamp: Date.now() };
    } finally {
      inflightSessionsPromise = null;
    }
  })();

  return inflightSessionsPromise;
}

export default async function SessionsPage({ searchParams }: Props) {
  const [session, { q, subject, curriculum, grade, allGrades, tab }] = await Promise.all([
    auth(),
    searchParams,
  ]);

  // 1. Fetch current user if signed in concurrently with raw sessions data
  const [dbUser, rawData] = await Promise.all([
    session?.user?.id
      ? prisma.user.findUnique({
          where: { id: session.user.id },
          include: {
            tutorProfile: {
              include: {
                trainingModules: true,
              },
            },
          },
        })
      : Promise.resolve(null),
    getCachedSessionsData(),
  ]);

  const isTutor = Boolean(dbUser?.tutorProfile && dbUser.tutorProfile.status === "APPROVED");
  const passedModules = (dbUser?.tutorProfile?.trainingModules || []).filter((m: any) => m.quizPassed).length;
  const isTrainingCompleted = passedModules === 5;
  const canHost = isTutor && isTrainingCompleted;

  // 1b. Fetch user's bookings if signed in
  let userBookings: any[] = [];
  if (session?.user?.id) {
    try {
      userBookings = await prisma.booking.findMany({
        where: {
          OR: [
            { studentId: session.user.id },
            ...(isTutor && dbUser?.tutorProfile?.id ? [{ tutorId: dbUser.tutorProfile.id }] : []),
          ],
        },
        include: {
          student: { select: { id: true, name: true, image: true, grade: true } },
          tutor: {
            include: {
              user: { select: { id: true, name: true, image: true } },
            },
          },
        },
        orderBy: { startTime: "asc" },
      });
    } catch (err) {
      console.warn("Could not fetch user bookings:", err);
    }
  }

  const now = new Date();
  const upcomingUserBookings = userBookings.filter(
    (b) => b.status === "CONFIRMED" && new Date(b.endTime) >= now
  );
  const completedUserBookings = userBookings.filter(
    (b) => b.status === "COMPLETED" || (b.status === "CONFIRMED" && new Date(b.endTime) < now)
  );

  // 2. Determine active matching filters
  const isAllGradesExplicit = allGrades === "true";
  const activeSubject = subject || "All";
  const activeCurriculum = curriculum
    ? curriculum
    : isAllGradesExplicit
    ? "All"
    : (dbUser?.curriculum && dbUser.curriculum !== "Other" ? dbUser.curriculum : "All");
  const activeGrade = isAllGradesExplicit ? "" : (grade || dbUser?.grade || "");
  const studentAge = dbUser?.age || null;
  const activeTab = (tab === "tutors" || tab === "workshops" ? tab : "all") as "all" | "tutors" | "workshops";

  // 3. Subject matching terms
  const subTerms = activeSubject !== "All" && activeSubject.toLowerCase().includes("math")
    ? ["math", "mathematics", "algebra", "calculus", "geometry"]
    : activeSubject !== "All"
    ? [activeSubject.toLowerCase()]
    : [];

  const cleanGrade = activeGrade ? activeGrade.replace(/[^a-zA-Z0-9\s]/g, "").toLowerCase().trim() : "";
  const queryTerm = q ? q.trim().toLowerCase() : "";

  // 4. In-memory filtering for workshops
  const workshops = rawData.workshops.filter((w) => {
    // Subject check
    if (subTerms.length > 0) {
      const match = subTerms.some(
        (t) =>
          w.subject?.toLowerCase().includes(t) ||
          w.title?.toLowerCase().includes(t)
      );
      if (!match) return false;
    }
    // Curriculum check
    if (activeCurriculum !== "All") {
      const wCurriculum = (w.curriculum || "").toLowerCase();
      const wTitle = (w.title || "").toLowerCase();
      const curr = activeCurriculum.toLowerCase();
      if (!wCurriculum.includes(curr) && !wTitle.includes(curr)) {
        return false;
      }
    }
    // Grade check
    if (cleanGrade) {
      const g = (w.grade || "").toLowerCase();
      if (!g.includes(cleanGrade) && !g.includes("all")) {
        return false;
      }
    }
    // Query search
    if (queryTerm) {
      const match =
        w.title?.toLowerCase().includes(queryTerm) ||
        w.description?.toLowerCase().includes(queryTerm) ||
        w.subject?.toLowerCase().includes(queryTerm);
      if (!match) return false;
    }
    return true;
  });

  // 5. In-memory filtering for tutors
  const tutors = rawData.tutors.filter((t) => {
    // Subject check
    if (subTerms.length > 0) {
      const match = t.subjects.some((s: any) =>
        subTerms.some((st) => s.name.toLowerCase().includes(st))
      );
      if (!match) return false;
    }
    // Curriculum check
    if (activeCurriculum !== "All") {
      const curr = activeCurriculum.toLowerCase();
      const tutorCurricula = (t.curricula || t.user?.curriculum || "").toLowerCase();
      const gradeLevelNames = (t.gradeLevels || []).map((gl: any) => gl.name.toLowerCase()).join(" ");
      const tutorDetails = `${t.targetGrades || ""} ${t.bio || ""} ${gradeLevelNames}`.toLowerCase();

      if (tutorCurricula) {
        if (!tutorCurricula.includes(curr)) return false;
      } else {
        // If tutor has no curriculum tag, check for conflicting specific qualifications
        if (curr === "cbse") {
          if (tutorDetails.includes("gcse") || tutorDetails.includes("igcse") || tutorDetails.includes("ib") || tutorDetails.includes("a-level")) {
            return false;
          }
        } else if (curr === "ib") {
          if (tutorDetails.includes("cbse") || tutorDetails.includes("gcse") || tutorDetails.includes("a-level")) {
            return false;
          }
        } else if (curr === "igcse") {
          if (tutorDetails.includes("cbse") || tutorDetails.includes("ib")) {
            return false;
          }
        }
      }
    }
    // Grade check
    if (cleanGrade) {
      const hasGradeLevel = t.gradeLevels?.some((gl: any) => gl.name.toLowerCase().includes(cleanGrade));
      const hasTargetGrades = t.targetGrades?.toLowerCase().includes(cleanGrade);
      const hasNoRestriction = !t.gradeLevels || t.gradeLevels.length === 0;
      if (!hasGradeLevel && !hasTargetGrades && !hasNoRestriction) {
        return false;
      }
    }
    // Age check
    if (studentAge) {
      if (t.minAge && studentAge < t.minAge) return false;
      if (t.maxAge && studentAge > t.maxAge) return false;
    }
    // Query search
    if (queryTerm) {
      const match =
        t.user?.name?.toLowerCase().includes(queryTerm) ||
        t.bio?.toLowerCase().includes(queryTerm) ||
        t.school?.toLowerCase().includes(queryTerm) ||
        t.subjects?.some((s: any) => s.name.toLowerCase().includes(queryTerm));
      if (!match) return false;
    }
    return true;
  });

  const totalMatches = workshops.length + tutors.length;
  const showWorkshops = activeTab === "all" || activeTab === "workshops";
  const showTutors = activeTab === "all" || activeTab === "tutors";

  const isAutoMatched = Boolean(
    dbUser &&
    (activeGrade || (activeCurriculum !== "All" && !curriculum)) &&
    !isAllGradesExplicit
  );

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        {/* Page header */}
        <div className={styles.pageHeader} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1.5rem", flexWrap: "wrap" }}>
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", background: "#EFF6FF", color: "#2563EB", padding: "0.2rem 0.6rem", borderRadius: "4px", fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.5rem" }}>
              <CalendarCheck size={13} />
              <span>Personal Study Desk</span>
            </div>
            <h1 className={styles.pageTitle}>My Schedule &amp; Study Sessions</h1>
            <p className={styles.pageSubtitle}>
              Manage your scheduled 1-on-1 peer tutoring appointments, enter live video study rooms, and explore upcoming group workshops.
            </p>
          </div>
          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
            <Link
              href="/find"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                background: "var(--wa-forest, #2563EB)",
                color: "#FFFFFF",
                padding: "0.65rem 1.25rem",
                borderRadius: "12px",
                fontSize: "0.875rem",
                fontWeight: 700,
                textDecoration: "none",
                boxShadow: "0 3px 10px rgba(37, 99, 235, 0.25)",
              }}
            >
              <Compass size={16} />
              <span>Find a Peer Tutor</span>
            </Link>
            {canHost && (
              <Link
                href="/tutor#schedule-session"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  background: "#EAF3ED",
                  border: "1.5px solid #2D6A4F",
                  color: "#235840",
                  padding: "0.65rem 1.25rem",
                  borderRadius: "12px",
                  fontSize: "0.875rem",
                  fontWeight: 700,
                  textDecoration: "none",
                }}
              >
                <CalendarPlus size={16} />
                <span>Host a Workshop</span>
              </Link>
            )}
          </div>
        </div>

        {/* SECTION 1: Personal Booked 1-on-1 Sessions */}
        <section aria-labelledby="booked-sessions-heading" style={{ marginBottom: "2.5rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "1rem", flexWrap: "wrap", gap: "0.5rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <CalendarCheck size={18} color="var(--wa-forest, #2563EB)" />
              <h2 id="booked-sessions-heading" style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--wa-ink, #0F172A)", margin: 0, fontFamily: "var(--font-serif)" }}>
                My Scheduled 1-on-1 Sessions
              </h2>
            </div>
            {upcomingUserBookings.length > 0 && (
              <span style={{ fontSize: "0.8125rem", color: "var(--wa-muted, #64748B)", fontWeight: 600 }}>
                {upcomingUserBookings.length} {upcomingUserBookings.length === 1 ? "session" : "sessions"} booked
              </span>
            )}
          </div>

          {!session?.user ? (
            <div style={{ background: "var(--wa-white, #FFFFFF)", border: "1px solid var(--wa-border, #E2E8F0)", borderRadius: "14px", padding: "2rem", textAlign: "center" }}>
              <p style={{ fontSize: "1rem", color: "var(--wa-ink, #0F172A)", fontWeight: 600, margin: 0 }}>
                Sign in to view your scheduled 1-on-1 sessions and access live video rooms.
              </p>
              <div style={{ marginTop: "1rem", display: "flex", gap: "0.75rem", justifyContent: "center" }}>
                <Link
                  href="/signin?callbackUrl=/sessions"
                  style={{ background: "var(--wa-forest, #2563EB)", color: "#FFFFFF", padding: "0.55rem 1.25rem", borderRadius: "8px", fontWeight: 700, fontSize: "0.875rem", textDecoration: "none" }}
                >
                  Sign In to View Schedule
                </Link>
                <Link
                  href="/find"
                  style={{ background: "var(--wa-paper, #F8FAFC)", border: "1px solid var(--wa-border, #CBD5E1)", color: "var(--wa-ink, #1E293B)", padding: "0.55rem 1.25rem", borderRadius: "8px", fontWeight: 600, fontSize: "0.875rem", textDecoration: "none" }}
                >
                  Browse Tutors
                </Link>
              </div>
            </div>
          ) : upcomingUserBookings.length === 0 ? (
            <div style={{ background: "var(--wa-white, #FFFFFF)", border: "1px solid var(--wa-border, #E2E8F0)", borderRadius: "14px", padding: "2.25rem 1.5rem", textAlign: "center" }}>
              <div style={{ width: "48px", height: "48px", borderRadius: "50%", background: "#EFF6FF", color: "#2563EB", display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: "0.75rem" }}>
                <CalendarCheck size={24} />
              </div>
              <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--wa-ink, #0F172A)", margin: "0 0 0.35rem" }}>
                No upcoming 1-on-1 sessions scheduled
              </h3>
              <p style={{ fontSize: "0.875rem", color: "var(--wa-muted, #64748B)", maxWidth: "480px", margin: "0 auto 1.25rem", lineHeight: 1.5 }}>
                Connect with a volunteer peer tutor in Mathematics, Sciences, or Reading &amp; Writing for free personalized 1-on-1 guidance.
              </p>
              <Link
                href="/find"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.4rem",
                  background: "var(--wa-forest, #2563EB)",
                  color: "#FFFFFF",
                  padding: "0.6rem 1.35rem",
                  borderRadius: "10px",
                  fontWeight: 700,
                  fontSize: "0.875rem",
                  textDecoration: "none",
                  boxShadow: "0 2px 8px rgba(37, 99, 235, 0.2)",
                }}
              >
                <span>Find &amp; Book a Peer Tutor</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "1rem" }}>
              {upcomingUserBookings.map((b: any) => {
                const partnerName = isTutor && b.student?.name ? b.student.name : b.tutor?.user?.name || "Peer Tutor";
                const isLive = new Date() >= new Date(b.startTime) && new Date() <= new Date(b.endTime);

                return (
                  <div
                    key={b.id}
                    style={{
                      background: "var(--wa-white, #FFFFFF)",
                      border: isLive ? "2px solid #2563EB" : "1px solid var(--wa-border, #E2E8F0)",
                      borderRadius: "14px",
                      padding: "1.25rem",
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.75rem",
                      boxShadow: "var(--wa-shadow-sm)",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.5rem" }}>
                      <span style={{ fontSize: "0.75rem", fontWeight: 700, background: "#EFF6FF", color: "#2563EB", padding: "0.2rem 0.55rem", borderRadius: "6px" }}>
                        {b.subject}
                      </span>
                      {isLive ? (
                        <span style={{ fontSize: "0.7rem", fontWeight: 700, background: "#DC2626", color: "#FFFFFF", padding: "0.2rem 0.5rem", borderRadius: "4px", display: "inline-flex", alignItems: "center", gap: "0.3rem" }}>
                          <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#FFFFFF", display: "inline-block" }} />
                          LIVE NOW
                        </span>
                      ) : (
                        <span style={{ fontSize: "0.75rem", fontWeight: 600, color: "#16A34A", background: "#F0FDF4", padding: "0.2rem 0.55rem", borderRadius: "6px" }}>
                          Confirmed
                        </span>
                      )}
                    </div>

                    <div>
                      <h3 style={{ fontSize: "1.05rem", fontWeight: 700, color: "var(--wa-ink, #0F172A)", margin: 0 }}>
                        {b.topic || `${b.subject} Practice`}
                      </h3>
                      <p style={{ fontSize: "0.8125rem", color: "var(--wa-muted, #64748B)", margin: "0.25rem 0 0" }}>
                        {isTutor ? `Student: ${partnerName}` : `Tutor: ${partnerName}`}
                      </p>
                    </div>

                    <div style={{ fontSize: "0.8125rem", color: "var(--wa-text, #1E293B)", display: "flex", alignItems: "center", gap: "0.4rem", background: "var(--wa-paper, #F8FAFC)", padding: "0.5rem 0.75rem", borderRadius: "8px" }}>
                      <Clock size={14} color="var(--wa-muted, #64748B)" />
                      <FormattedDateTime date={b.startTime} />
                    </div>

                    <div style={{ display: "flex", gap: "0.5rem", marginTop: "auto", paddingTop: "0.5rem", borderTop: "1px solid var(--wa-border, #E2E8F0)" }}>
                      <Link
                        href={`/sessions/${b.id}`}
                        style={{
                          flex: 1,
                          textAlign: "center",
                          background: "var(--wa-forest, #2563EB)",
                          color: "#FFFFFF",
                          padding: "0.5rem 0.75rem",
                          borderRadius: "8px",
                          fontSize: "0.8125rem",
                          fontWeight: 700,
                          textDecoration: "none",
                        }}
                      >
                        Enter Study Room
                      </Link>
                      {b.zoomLink && (
                        <a
                          href={b.zoomLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "0.25rem",
                            background: "var(--wa-paper, #F8FAFC)",
                            border: "1px solid var(--wa-border, #CBD5E1)",
                            color: "var(--wa-ink, #1E293B)",
                            padding: "0.5rem 0.75rem",
                            borderRadius: "8px",
                            fontSize: "0.8125rem",
                            fontWeight: 600,
                            textDecoration: "none",
                          }}
                        >
                          <span>Video</span>
                          <ExternalLink size={12} />
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {completedUserBookings.length > 0 && (
            <div style={{ marginTop: "1rem", fontSize: "0.8125rem", color: "var(--wa-muted, #64748B)", textAlign: "right" }}>
              <span>You have completed {completedUserBookings.length} verified sessions. Check <Link href="/dashboard" style={{ color: "var(--wa-forest, #2563EB)", fontWeight: 600, textDecoration: "underline" }}>My Study Progress</Link> for detailed instructional hours.</span>
            </div>
          )}
        </section>

        {/* Dynamic Student Matching Notification Banner */}
        {isAutoMatched && (
          <div style={{
            background: "var(--wa-white, #FFFFFF)",
            border: "1px solid var(--wa-border, #E2E8F0)",
            borderRadius: 12,
            padding: "0.85rem 1.25rem",
            marginBottom: "1.5rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "0.75rem",
            boxShadow: "var(--wa-shadow-xs)",
          }}>
            <div style={{ fontSize: "0.875rem", color: "var(--wa-ink, #0F172A)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Compass size={16} color="var(--wa-crimson, #2563EB)" />
              <span>
                Matching sessions tailored for your enrolled profile:{" "}
                <strong>{activeGrade || "Your Grade"}</strong>
                {studentAge ? ` (Age ${studentAge})` : ""}
                {activeCurriculum !== "All" ? ` • ${activeCurriculum} Curriculum` : ""}
              </span>
            </div>
            <Link
              href={`/sessions?allGrades=true${activeSubject !== "All" ? `&subject=${encodeURIComponent(activeSubject)}` : ""}`}
              style={{ fontSize: "0.8125rem", color: "var(--wa-crimson, #2563EB)", fontWeight: 700, textDecoration: "underline" }}
            >
              Show All Grades &amp; Curricula
            </Link>
          </div>
        )}

        {/* Interactive Client Filter Bar */}
        <SessionFilterBar
          activeCurriculum={activeCurriculum}
          activeSubject={activeSubject}
          initialQuery={q || ""}
          activeTab={activeTab}
          totalMatches={totalMatches}
          tutorMatches={tutors.length}
          workshopMatches={workshops.length}
        />

        {/* Content Section: Workshops & Tutors */}
        {totalMatches === 0 ? (
          <div className={styles.sessionsGrid}>
            <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "3.5rem 1.5rem", background: "var(--wa-white)", borderRadius: 12, border: "1px solid var(--wa-border)", boxShadow: "var(--wa-shadow-sm)" }}>
              <p style={{ fontSize: "1.1rem", fontWeight: 600, color: "var(--wa-ink)", fontFamily: "var(--font-serif)" }}>
                No sessions or tutors currently matched for {activeSubject !== "All" ? activeSubject : "your search"} ({activeCurriculum !== "All" ? `${activeCurriculum} Curriculum` : "All Curricula"})
              </p>
              <p style={{ color: "var(--wa-muted)", marginTop: "0.5rem", fontSize: "0.875rem" }}>
                Try switching the curriculum filter or clearing your active search criteria.
              </p>
              <div style={{ marginTop: "1.25rem", display: "flex", gap: "0.75rem", justifyContent: "center" }}>
                <Link
                  href="/sessions?allGrades=true"
                  style={{ background: "var(--wa-forest)", color: "var(--wa-white)", padding: "0.6rem 1.35rem", borderRadius: 8, fontWeight: 700, fontSize: "0.875rem", textDecoration: "none" }}
                >
                  View All Sessions
                </Link>
                <Link
                  href="/find"
                  style={{ background: "var(--wa-paper)", color: "var(--wa-ink)", border: "1px solid var(--wa-border)", padding: "0.6rem 1.35rem", borderRadius: 8, fontWeight: 600, fontSize: "0.875rem", textDecoration: "none" }}
                >
                  Browse All Mentors
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}>
            {/* 1. Group Workshops Section */}
            {showWorkshops && workshops.length > 0 && (
              <section aria-label="Interactive Group Workshops">
                <div style={{ marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <Video size={18} color="var(--wa-forest)" />
                  <h2 style={{ fontSize: "1.125rem", fontWeight: 600, color: "var(--wa-ink)", margin: 0, fontFamily: "var(--font-serif)" }}>
                    Interactive Group Workshops ({workshops.length})
                  </h2>
                </div>

                <div className={styles.sessionsGrid}>
                  {workshops.map((w) => {
                    const ratio = `${w.enrollments.length}/${w.maxCapacity}`;
                    const tutorName = w.tutor.user.name || "Tutor";
                    const { joinUrl } = getMeetingUrls(w.zoomLink);
                    return (
                      <div key={w.id} className={styles.sessionCard}>
                        <Link href={`/learn`} style={{ textDecoration: "none", color: "inherit", display: "block" }}>
                          <div style={{ display: "flex", gap: "0.4rem", marginBottom: "0.5rem", flexWrap: "wrap" }}>
                            <span style={{ fontSize: "0.75rem", fontWeight: 700, background: "#EAF3ED", color: "#235840", padding: "0.2rem 0.55rem", borderRadius: 6 }}>
                              {w.subject}
                            </span>
                            {w.grade && (
                              <span style={{ fontSize: "0.75rem", background: "#F3EFE8", color: "#3D3831", padding: "0.2rem 0.55rem", borderRadius: 6 }}>
                                {w.grade}
                              </span>
                            )}
                            {w.curriculum && (
                              <span style={{ fontSize: "0.75rem", background: "#FDF3E3", color: "#8B5E10", padding: "0.2rem 0.55rem", borderRadius: 6 }}>
                                {w.curriculum}
                              </span>
                            )}
                          </div>

                          <h3 className={styles.cardTitle}>{w.title}</h3>
                          <p className={styles.cardTime}>
                            <FormattedDateTime date={w.startTime} />
                          </p>
                          <p className={styles.cardDesc}>{w.description}</p>
                          <div className={styles.cardFooter}>
                            <div className={styles.cardTutor}>
                              <div
                                className={styles.tutorAvatar}
                                style={{ background: getAvatarColor(tutorName) }}
                                aria-hidden="true"
                              >
                                {getInitials(tutorName)}
                              </div>
                              <span>{tutorName}</span>
                            </div>
                            <div className={styles.cardAttendees}>
                              <Users size={14} />
                              <span>{ratio} seats</span>
                            </div>
                          </div>
                        </Link>

                        {(() => {
                          const isEnrolled = w.enrollments.some((e: any) => e.studentId === session?.user?.id);
                          const isHostTutor = w.tutor?.userId === session?.user?.id;
                          const isAdmin = dbUser?.role === "ADMIN";
                          const now = Date.now();
                          const startTimeMs = new Date(w.startTime).getTime();
                          const endTimeMs = new Date(w.endTime).getTime();
                          const isWithinJoinWindow = now >= (startTimeMs - 15 * 60 * 1000) && now <= endTimeMs;

                          if ((isEnrolled || isHostTutor || isAdmin) && joinUrl && isWithinJoinWindow) {
                            return (
                              <div style={{ marginTop: "0.75rem", borderTop: "1px solid #EDE9E1", paddingTop: "0.75rem" }}>
                                <a
                                  href={joinUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    gap: "0.4rem",
                                    width: "100%",
                                    padding: "0.5rem 1rem",
                                    background: "var(--wa-green, #1B4D3E)",
                                    color: "#FFFFFF",
                                    borderRadius: "var(--wa-radius-sm, 8px)",
                                    fontSize: "0.85rem",
                                    fontWeight: 600,
                                    textDecoration: "none",
                                  }}
                                >
                                  <Video size={15} aria-hidden="true" />
                                  <span>Join Live Workshop</span>
                                </a>
                              </div>
                            );
                          }
                          return null;
                        })()}
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* 2. 1-on-1 Tutor Directory Spotlight */}
            <section aria-label="1-on-1 Verified Peer Tutors Spotlight" style={{ background: "var(--wa-white, #FFFFFF)", border: "1px solid var(--wa-border, #E2E8F0)", borderRadius: 14, padding: "2rem", boxShadow: "var(--wa-shadow-sm)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1.25rem" }}>
                <div style={{ maxWidth: "600px" }}>
                  <div style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", background: "#EFF6FF", color: "#2563EB", padding: "0.2rem 0.6rem", borderRadius: "4px", fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.5rem" }}>
                    <Compass size={13} />
                    <span>Tutor Directory</span>
                  </div>
                  <h2 style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--wa-ink, #0F172A)", margin: "0 0 0.4rem", fontFamily: "var(--font-serif)" }}>
                    Looking for 1-on-1 Peer Tutoring?
                  </h2>
                  <p style={{ fontSize: "0.9rem", color: "var(--wa-muted, #64748B)", margin: 0, lineHeight: 1.5 }}>
                    Search our full directory of certified high school and university volunteer tutors. Filter by subject, grade level, curriculum, and schedule a private 1-on-1 session at no cost.
                  </p>
                  <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginTop: "1rem" }}>
                    <Link href="/find?subject=Mathematics" style={{ fontSize: "0.75rem", fontWeight: 600, background: "#F1F5F9", color: "#334155", padding: "0.25rem 0.65rem", borderRadius: "6px", textDecoration: "none" }}>
                      Math Tutors
                    </Link>
                    <Link href="/find?subject=Science" style={{ fontSize: "0.75rem", fontWeight: 600, background: "#F1F5F9", color: "#334155", padding: "0.25rem 0.65rem", borderRadius: "6px", textDecoration: "none" }}>
                      Science Tutors
                    </Link>
                    <Link href="/find?subject=Reading+%26+Writing" style={{ fontSize: "0.75rem", fontWeight: 600, background: "#F1F5F9", color: "#334155", padding: "0.25rem 0.65rem", borderRadius: "6px", textDecoration: "none" }}>
                      Reading &amp; Writing Tutors
                    </Link>
                  </div>
                </div>

                <Link
                  href="/find"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    background: "var(--wa-forest, #2563EB)",
                    color: "#FFFFFF",
                    padding: "0.75rem 1.5rem",
                    borderRadius: "10px",
                    fontWeight: 700,
                    fontSize: "0.9375rem",
                    textDecoration: "none",
                    boxShadow: "0 3px 12px rgba(37, 99, 235, 0.25)",
                    flexShrink: 0,
                  }}
                >
                  <span>Explore Tutor Directory</span>
                  <ArrowRight size={15} />
                </Link>
              </div>
            </section>
          </div>
        )}
      </div>
    </main>
  );
}

