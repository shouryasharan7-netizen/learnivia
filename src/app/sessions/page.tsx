import Link from "next/link";
import { prisma } from "@/lib/prisma";
import styles from "./page.module.css";
import { auth } from "@/auth";
import { FormattedDateTime } from "@/components/FormattedDateTime";
import { getMeetingUrls } from "@/lib/meetingUrl";
import SessionFilterBar from "./SessionFilterBar";
import { CalendarPlus, GraduationCap, ArrowRight, Video, Users, Sparkles } from "lucide-react";

export const dynamic = "force-dynamic";
export const revalidate = 30; // ISR: 30s cache

export const metadata = {
  title: "Find a Session — Learnivia",
  description: "Browse verified peer tutoring sessions and small-group workshops filtered to your grade, age, and curriculum.",
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
  const colors = ["#2D6A4F", "#C9922A", "#1E3A5F", "#C1694F", "#4A9172", "#8B5E10"];
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
            tutor: { include: { user: true } },
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
          include: { tutorProfile: true },
        })
      : Promise.resolve(null),
    getCachedSessionsData(),
  ]);

  const isTutor = Boolean(dbUser?.tutorProfile && dbUser.tutorProfile.status === "APPROVED");

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
            <h1 className={styles.pageTitle}>Find a Session</h1>
            <p className={styles.pageSubtitle}>
              Small-group workshops and 1-on-1 tutoring sessions run by verified volunteer tutors.
            </p>
          </div>
          <div>
            {isTutor ? (
              <Link
                href="/tutor#schedule-session"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  background: "#2D6A4F",
                  color: "#FFFFFF",
                  padding: "0.65rem 1.25rem",
                  borderRadius: "12px",
                  fontSize: "0.875rem",
                  fontWeight: 700,
                  textDecoration: "none",
                  boxShadow: "0 3px 10px rgba(45, 106, 79, 0.28)",
                }}
              >
                <CalendarPlus size={16} />
                <span>Host a New Session</span>
              </Link>
            ) : (
              <Link
                href="/apply"
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
                <GraduationCap size={16} />
                <span>Become a Tutor</span>
              </Link>
            )}
          </div>
        </div>

        {/* Dynamic Student Matching Notification Banner */}
        {isAutoMatched && (
          <div style={{
            background: "#EAF3ED",
            border: "1px solid #B5D9C5",
            borderRadius: 12,
            padding: "0.85rem 1.25rem",
            marginBottom: "1.5rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "0.75rem",
          }}>
            <div style={{ fontSize: "0.875rem", color: "#235840", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Sparkles size={16} color="#2D6A4F" />
              <span>
                Matching sessions tailored for your enrolled profile:{" "}
                <strong>{activeGrade || "Your Grade"}</strong>
                {studentAge ? ` (Age ${studentAge})` : ""}
                {activeCurriculum !== "All" ? ` • ${activeCurriculum} Curriculum` : ""}
              </span>
            </div>
            <Link
              href={`/sessions?allGrades=true${activeSubject !== "All" ? `&subject=${encodeURIComponent(activeSubject)}` : ""}`}
              style={{ fontSize: "0.8125rem", color: "#2D6A4F", fontWeight: 700, textDecoration: "underline" }}
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
            <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "3.5rem 1.5rem", background: "#FFFFFF", borderRadius: 14, border: "1px solid #DDD8D0", boxShadow: "0 1px 4px rgba(28,26,23,0.05)" }}>
              <p style={{ fontSize: "1.1rem", fontWeight: 600, color: "#1C1A17", fontFamily: "var(--font-serif, 'Newsreader', Georgia, serif)" }}>
                No sessions or tutors currently matched for {activeSubject !== "All" ? activeSubject : "your search"} ({activeCurriculum !== "All" ? `${activeCurriculum} Curriculum` : "All Curricula"})
              </p>
              <p style={{ color: "#7A7169", marginTop: "0.5rem", fontSize: "0.875rem" }}>
                Try switching the curriculum filter or clearing your active search criteria.
              </p>
              <div style={{ marginTop: "1.25rem", display: "flex", gap: "0.75rem", justifyContent: "center" }}>
                <Link
                  href="/sessions?allGrades=true"
                  style={{ background: "#2D6A4F", color: "#FFF", padding: "0.6rem 1.35rem", borderRadius: 10, fontWeight: 700, fontSize: "0.875rem", textDecoration: "none" }}
                >
                  View All Sessions
                </Link>
                <Link
                  href="/find"
                  style={{ background: "#FAF8F5", color: "#3D3831", border: "1.5px solid #DDD8D0", padding: "0.6rem 1.35rem", borderRadius: 10, fontWeight: 600, fontSize: "0.875rem", textDecoration: "none" }}
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
                  <Video size={18} color="#2D6A4F" />
                  <h2 style={{ fontSize: "1.125rem", fontWeight: 600, color: "#1C1A17", margin: 0, fontFamily: "var(--font-serif, 'Newsreader', Georgia, serif)" }}>
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

            {/* 2. 1-on-1 Tutors Section */}
            {showTutors && tutors.length > 0 && (
              <section aria-label="1-on-1 Verified Peer Tutors">
                <div style={{ marginBottom: "1rem", display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: "0.5rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <Users size={18} color="#2D6A4F" />
                    <h2 style={{ fontSize: "1.125rem", fontWeight: 600, color: "#1C1A17", margin: 0, fontFamily: "var(--font-serif, 'Newsreader', Georgia, serif)" }}>
                      1-on-1 Tutors Available ({tutors.length})
                    </h2>
                  </div>
                  <span style={{ fontSize: "0.8125rem", color: "#7A7169" }}>
                    Book an individual session matching your schedule directly
                  </span>
                </div>

                <div className={styles.sessionsGrid}>
                  {tutors.map((t) => {
                    const name = t.user.name || "Tutor";
                    const subjectName = t.subjects[0]?.name || activeSubject;
                    const nextSlot = t.availabilities[0];
                    const days = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
                    const dayLabel = nextSlot ? days[nextSlot.dayOfWeek] : null;
                    const tutorCurriculum = t.curricula || t.user?.curriculum;

                    return (
                      <Link key={t.id} href={`/tutor/${t.id}`} className={styles.sessionCard}>
                        <div style={{ display: "flex", gap: "0.4rem", marginBottom: "0.5rem", flexWrap: "wrap" }}>
                          <span style={{ fontSize: "0.75rem", fontWeight: 700, background: "#EAF3ED", color: "#235840", padding: "0.2rem 0.55rem", borderRadius: 6 }}>
                            {subjectName}
                          </span>
                          {tutorCurriculum && (
                            <span style={{ fontSize: "0.75rem", fontWeight: 600, background: "#FDF3E3", color: "#8B5E10", padding: "0.2rem 0.55rem", borderRadius: 6 }}>
                              {tutorCurriculum}
                            </span>
                          )}
                          {t.gradeLevels[0] && (
                            <span style={{ fontSize: "0.75rem", background: "#F3EFE8", color: "#3D3831", padding: "0.2rem 0.55rem", borderRadius: 6 }}>
                              {t.gradeLevels[0].name}
                            </span>
                          )}
                        </div>

                        <h3 className={styles.cardTitle}>{subjectName} with {name}</h3>
                        {dayLabel ? (
                          <p className={styles.cardTime}>Available {dayLabel}s at {nextSlot.startTime}</p>
                        ) : (
                          <p className={styles.cardTime} style={{ color: "#64748B" }}>Verified Volunteer Tutor</p>
                        )}
                        <p className={styles.cardDesc}>
                          {t.bio ? t.bio.slice(0, 120) + "…" : `Book a free 1-on-1 session with ${name}.`}
                        </p>
                        <div className={styles.cardFooter}>
                          <div className={styles.cardTutor}>
                            <div
                              className={styles.tutorAvatar}
                              style={{ background: getAvatarColor(name) }}
                              aria-hidden="true"
                            >
                              {getInitials(name)}
                            </div>
                            <span>{name}</span>
                          </div>
                          <div className={styles.cardAttendees}>
                            <span style={{ fontSize: "0.84375rem", fontWeight: 700, color: "#2D6A4F", display: "inline-flex", alignItems: "center", gap: "0.2rem" }}>
                              Book 1-on-1 <ArrowRight size={13} />
                            </span>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    </main>
  );
}

