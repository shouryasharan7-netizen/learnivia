import Link from "next/link";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";
import styles from "./page.module.css";
import { auth } from "@/auth";
import { FormattedDateTime } from "@/components/FormattedDateTime";
import { getMeetingUrls } from "@/lib/meetingUrl";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = {
  title: "Find a Session — Learnivia",
  description: "Browse verified peer tutoring sessions and small-group workshops filtered to your grade, age, and curriculum.",
};

const SUBJECT_FILTERS = [
  "All",
  "Mathematics",
  "Science",
  "SAT Prep",
  "College Prep",
  "Reading and Writing",
  "Physics",
  "Chemistry",
  "Biology",
  "Homework Help",
];

const CURRICULUM_OPTIONS = [
  "All",
  "IB",
  "AP",
  "CBSE",
  "ICSE",
  "IGCSE",
  "US Common Core",
  "A-Level",
];

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function getAvatarColor(name: string) {
  const colors = ["#0E8345", "#7C3AED", "#2563EB", "#D97706", "#DC2626", "#0D9488"];
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
  }>;
};

export default async function SessionsPage({ searchParams }: Props) {
  const session = await auth();
  const { q, subject, curriculum, grade, allGrades } = await searchParams;

  // 1. Fetch current user with their grade, age, and curriculum
  let dbUser = null;
  let isTutor = false;
  if (session?.user?.id) {
    dbUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { tutorProfile: true },
    });
    if (dbUser?.tutorProfile && dbUser.tutorProfile.status === "APPROVED") {
      isTutor = true;
    }
  }

  // 2. Determine active matching filters
  const activeSubject = subject || "All";
  const activeCurriculum = curriculum || (dbUser?.curriculum && dbUser.curriculum !== "Other" ? dbUser.curriculum : "All");
  const isAllGradesExplicit = allGrades === "true";
  const activeGrade = isAllGradesExplicit ? "" : (grade || dbUser?.grade || "");
  const studentAge = dbUser?.age || null;

  // 3. Build Workshop Where Clause
  const workshopWhere: Prisma.WorkshopWhereInput = { status: "UPCOMING" };
  const workshopConditions: Prisma.WorkshopWhereInput[] = [];

  if (activeSubject !== "All") {
    // Also match "Maths" if user selected "Mathematics" or vice versa
    const subTerms = activeSubject.toLowerCase().includes("math")
      ? ["math", "mathematics", "algebra", "calculus", "geometry"]
      : [activeSubject];

    workshopConditions.push({
      OR: subTerms.flatMap((term) => [
        { subject: { contains: term, mode: "insensitive" } },
        { title: { contains: term, mode: "insensitive" } },
      ]),
    });
  }

  if (activeCurriculum !== "All") {
    workshopConditions.push({
      OR: [
        { curriculum: { contains: activeCurriculum, mode: "insensitive" } },
        { title: { contains: activeCurriculum, mode: "insensitive" } },
        { curriculum: null }, // General workshops open to all
      ],
    });
  }

  if (activeGrade && activeGrade.trim()) {
    const cleanGrade = activeGrade.replace(/[^a-zA-Z0-9\s]/g, "").trim();
    workshopConditions.push({
      OR: [
        { grade: { contains: cleanGrade, mode: "insensitive" } },
        { grade: { contains: "All", mode: "insensitive" } },
      ],
    });
  }

  if (q && q.trim()) {
    const term = q.trim();
    workshopConditions.push({
      OR: [
        { title: { contains: term, mode: "insensitive" } },
        { description: { contains: term, mode: "insensitive" } },
        { subject: { contains: term, mode: "insensitive" } },
      ],
    });
  }

  if (workshopConditions.length > 0) {
    workshopWhere.AND = workshopConditions;
  }

  // Fetch upcoming workshops matching criteria
  const workshops = await prisma.workshop.findMany({
    where: workshopWhere,
    include: {
      tutor: { include: { user: true } },
      enrollments: true,
    },
    orderBy: { startTime: "asc" },
    take: 25,
  });

  // 4. Build Tutor Where Clause for 1-on-1 Sessions Matching Student
  const tutorWhere: Prisma.TutorProfileWhereInput = { status: "APPROVED" };
  const tutorConditions: Prisma.TutorProfileWhereInput[] = [];

  if (activeSubject !== "All") {
    const subTerms = activeSubject.toLowerCase().includes("math")
      ? ["math", "mathematics", "algebra", "calculus", "geometry"]
      : [activeSubject];

    tutorConditions.push({
      OR: subTerms.map((term) => ({
        subjects: { some: { name: { contains: term, mode: "insensitive" } } },
      })),
    });
  }

  if (activeCurriculum !== "All") {
    tutorConditions.push({
      OR: [
        { curricula: { contains: activeCurriculum, mode: "insensitive" } },
        { curricula: null }, // Tutors without explicit restriction teach general curricula
      ],
    });
  }

  if (activeGrade && activeGrade.trim()) {
    const cleanGrade = activeGrade.replace(/[^a-zA-Z0-9\s]/g, "").trim();
    tutorConditions.push({
      OR: [
        { gradeLevels: { some: { name: { contains: cleanGrade, mode: "insensitive" } } } },
        { targetGrades: { contains: cleanGrade, mode: "insensitive" } },
        { gradeLevels: { none: {} } }, // Open to all grades
      ],
    });
  }

  if (studentAge) {
    tutorConditions.push({
      OR: [
        { minAge: null, maxAge: null },
        { AND: [{ minAge: { lte: studentAge } }, { maxAge: { gte: studentAge } }] },
        { minAge: { lte: studentAge }, maxAge: null },
      ],
    });
  }

  if (q && q.trim()) {
    const term = q.trim();
    tutorConditions.push({
      OR: [
        { user: { name: { contains: term, mode: "insensitive" } } },
        { bio: { contains: term, mode: "insensitive" } },
        { school: { contains: term, mode: "insensitive" } },
        { subjects: { some: { name: { contains: term, mode: "insensitive" } } } },
      ],
    });
  }

  if (tutorConditions.length > 0) {
    tutorWhere.AND = tutorConditions;
  }

  const tutors = await prisma.tutorProfile.findMany({
    where: tutorWhere,
    include: { user: true, subjects: true, availabilities: true, gradeLevels: true },
    take: 16,
  });

  const isAutoMatched = Boolean(dbUser && (activeGrade || activeCurriculum !== "All") && !isAllGradesExplicit);

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
                  background: "#0E8345",
                  color: "#FFFFFF",
                  padding: "0.65rem 1.25rem",
                  borderRadius: "9999px",
                  fontSize: "0.9rem",
                  fontWeight: 700,
                  textDecoration: "none",
                  boxShadow: "0 2px 8px rgba(14, 131, 69, 0.25)",
                }}
              >
                <span>➕</span> Host a New Session
              </Link>
            ) : (
              <Link
                href="/apply"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  background: "#FFFFFF",
                  border: "1.5px solid #0E8345",
                  color: "#0E8345",
                  padding: "0.65rem 1.25rem",
                  borderRadius: "9999px",
                  fontSize: "0.9rem",
                  fontWeight: 700,
                  textDecoration: "none",
                }}
              >
                <span>🎓</span> Become a Tutor
              </Link>
            )}
          </div>
        </div>

        {/* Dynamic Student Matching Notification Banner */}
        {isAutoMatched && (
          <div style={{
            background: "#F0FDF4",
            border: "1px solid #BBF7D0",
            borderRadius: 12,
            padding: "0.75rem 1.25rem",
            marginBottom: "1.25rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "0.5rem"
          }}>
            <div style={{ fontSize: "0.9rem", color: "#166534", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span>🎯</span>
              <span>
                Matching sessions tailored for your enrolled profile:{" "}
                <strong>{activeGrade || "Your Grade"}</strong>
                {studentAge ? ` (Age ${studentAge})` : ""}
                {activeCurriculum !== "All" ? ` • ${activeCurriculum} Curriculum` : ""}
              </span>
            </div>
            <Link
              href={`/sessions?allGrades=true${activeSubject !== "All" ? `&subject=${encodeURIComponent(activeSubject)}` : ""}`}
              style={{ fontSize: "0.825rem", color: "#15803D", fontWeight: 700, textDecoration: "underline" }}
            >
              Show All Grades &amp; Curricula
            </Link>
          </div>
        )}

        {/* Search + Curriculum selector + Search input */}
        <form method="GET" action="/sessions" className={styles.searchBar} style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", alignItems: "center" }}>
          {activeSubject !== "All" && (
            <input type="hidden" name="subject" value={activeSubject} />
          )}

          {/* Curriculum selector */}
          <div style={{ minWidth: 150 }}>
            <select
              name="curriculum"
              defaultValue={activeCurriculum}
              style={{
                width: "100%",
                padding: "0.65rem 0.85rem",
                borderRadius: 8,
                border: "1.5px solid #CBD5E1",
                fontSize: "0.9rem",
                background: "#FFFFFF",
                fontWeight: 600,
                color: "#1E293B",
                cursor: "pointer"
              }}
            >
              <option value="All">All Curricula</option>
              {CURRICULUM_OPTIONS.filter((c) => c !== "All").map((c) => (
                <option key={c} value={c}>{c} Curriculum</option>
              ))}
            </select>
          </div>

          <div className={styles.searchInputWrap} style={{ flex: 1, minWidth: 220 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={styles.searchIcon}>
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              type="search"
              name="q"
              defaultValue={q || ""}
              placeholder="Search sessions by topic or tutor name..."
              className={styles.searchInput}
              aria-label="Search sessions"
            />
          </div>

          <button type="submit" className={styles.addSubjectBtn} style={{ background: "#0E8345", color: "#fff", border: "none" }}>
            Filter Sessions
          </button>
        </form>

        {/* Subject filter pills */}
        <div className={styles.filterRow} role="tablist" aria-label="Filter by subject">
          {SUBJECT_FILTERS.map((f) => {
            const isCurrent = activeSubject.toLowerCase() === f.toLowerCase();
            const queryParams = new URLSearchParams();
            if (f !== "All") queryParams.set("subject", f);
            if (activeCurriculum !== "All") queryParams.set("curriculum", activeCurriculum);
            if (activeGrade && !isAllGradesExplicit) queryParams.set("grade", activeGrade);
            if (isAllGradesExplicit) queryParams.set("allGrades", "true");
            if (q) queryParams.set("q", q);

            const queryString = queryParams.toString();
            const href = `/sessions${queryString ? `?${queryString}` : ""}`;

            return (
              <Link
                key={f}
                href={href}
                className={`${styles.filterPill} ${isCurrent ? styles.filterPillActive : ""}`}
              >
                {f}
              </Link>
            );
          })}
        </div>

        {/* Workshop / Session cards grid */}
        {workshops.length > 0 ? (
          <div className={styles.sessionsGrid}>
            {workshops.map((w) => {
              const ratio = `${w.enrollments.length}/${w.maxCapacity}`;
              const tutorName = w.tutor.user.name || "Tutor";
              const { joinUrl } = getMeetingUrls(w.zoomLink);
              return (
                <div key={w.id} className={styles.sessionCard}>
                  <Link href={`/learn`} style={{ textDecoration: "none", color: "inherit", display: "block" }}>
                    <div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.5rem", flexWrap: "wrap" }}>
                      <span style={{ fontSize: "0.75rem", fontWeight: 700, background: "#E6F4EA", color: "#0E8345", padding: "0.2rem 0.5rem", borderRadius: 4 }}>
                        {w.subject}
                      </span>
                      {w.grade && (
                        <span style={{ fontSize: "0.75rem", background: "#F1F5F9", color: "#475569", padding: "0.2rem 0.5rem", borderRadius: 4 }}>
                          {w.grade}
                        </span>
                      )}
                      {w.curriculum && (
                        <span style={{ fontSize: "0.75rem", background: "#FEF3C7", color: "#92400E", padding: "0.2rem 0.5rem", borderRadius: 4 }}>
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
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
                          <circle cx="9" cy="7" r="4"/>
                          <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
                        </svg>
                        <span>{ratio}</span>
                      </div>
                    </div>
                  </Link>

                  {joinUrl && (
                    <div style={{ marginTop: "0.75rem", borderTop: "1px solid #F1F5F9", paddingTop: "0.75rem" }}>
                      <a
                        href={joinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          width: "100%",
                          padding: "0.5rem 1rem",
                          background: "#0E8345",
                          color: "#FFFFFF",
                          borderRadius: 8,
                          fontSize: "0.85rem",
                          fontWeight: 700,
                          textDecoration: "none",
                        }}
                      >
                        🎥 Join Live Session
                      </a>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : tutors.length > 0 ? (
          /* Show tutors matched for their age/grade */
          <div>
            <div style={{ marginBottom: "1rem" }}>
              <h2 style={{ fontSize: "1.15rem", fontWeight: 700, color: "#1E293B" }}>
                1-on-1 Tutors Available for {activeSubject !== "All" ? activeSubject : "Tutoring"}
              </h2>
              <p style={{ fontSize: "0.875rem", color: "#64748B" }}>
                Book an individual session matching your grade and curriculum directly:
              </p>
            </div>

            <div className={styles.sessionsGrid}>
              {tutors.map((t) => {
                const name = t.user.name || "Tutor";
                const subjectName = t.subjects[0]?.name || activeSubject;
                const nextSlot = t.availabilities[0];
                const days = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
                const dayLabel = nextSlot ? days[nextSlot.dayOfWeek] : null;

                return (
                  <Link key={t.id} href={`/tutor/${t.id}`} className={styles.sessionCard}>
                    <div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.5rem" }}>
                      <span style={{ fontSize: "0.75rem", fontWeight: 700, background: "#E6F4EA", color: "#0E8345", padding: "0.2rem 0.5rem", borderRadius: 4 }}>
                        {subjectName}
                      </span>
                      {t.gradeLevels[0] && (
                        <span style={{ fontSize: "0.75rem", background: "#F1F5F9", color: "#475569", padding: "0.2rem 0.5rem", borderRadius: 4 }}>
                          {t.gradeLevels[0].name}
                        </span>
                      )}
                    </div>

                    <h3 className={styles.cardTitle}>{subjectName} with {name}</h3>
                    {dayLabel && (
                      <p className={styles.cardTime}>Available {dayLabel}s at {nextSlot.startTime}</p>
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
                        <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "#0E8345" }}>Book 1-on-1 →</span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        ) : (
          <div className={styles.sessionsGrid}>
            <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "3rem 1rem", background: "#FFFFFF", borderRadius: 16, border: "1px solid #E2E8F0" }}>
              <p style={{ fontSize: "1.1rem", fontWeight: 700, color: "#1E293B" }}>
                No sessions or tutors currently matched for {activeSubject} ({activeGrade || "All Grades"})
              </p>
              <p style={{ color: "#64748B", marginTop: "0.5rem", fontSize: "0.9rem" }}>
                Try clearing your curriculum filter or view all available tutors.
              </p>
              <div style={{ marginTop: "1rem", display: "flex", gap: "0.75rem", justifyContent: "center" }}>
                <Link
                  href="/sessions?allGrades=true"
                  style={{ background: "#0E8345", color: "#FFF", padding: "0.5rem 1.25rem", borderRadius: 9999, fontWeight: 700, textDecoration: "none" }}
                >
                  View All Sessions
                </Link>
                <Link
                  href="/find"
                  style={{ background: "#F1F5F9", color: "#334155", padding: "0.5rem 1.25rem", borderRadius: 9999, fontWeight: 700, textDecoration: "none" }}
                >
                  Browse All Tutors
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
