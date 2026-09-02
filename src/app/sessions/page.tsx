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
  description: "Browse all small-group tutoring sessions. Find a session starting soon, filter by subject, and join for free.",
};

const SUBJECT_FILTERS = [
  "All",
  "SAT Prep",
  "College Prep",
  "Reading and Writing",
  "Mathematics",
  "Science",
  "College Admissions",
  "Homework Help",
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

function formatStartTime(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(new Date(date));
}

type Props = {
  searchParams: Promise<{ q?: string; subject?: string; sort?: string }>;
};

export default async function SessionsPage({ searchParams }: Props) {
  const session = await auth();
  const { q, subject } = await searchParams;
  const activeSubject = subject || "All";

  let isTutor = false;
  if (session?.user?.id) {
    const profile = await prisma.tutorProfile.findUnique({
      where: { userId: session.user.id },
    });
    if (profile && profile.status === "APPROVED") {
      isTutor = true;
    }
  }

  // Build where clause for workshops
  const workshopWhere: Prisma.WorkshopWhereInput = { status: "UPCOMING" };
  if (activeSubject && activeSubject !== "All") {
    workshopWhere.OR = [
      { subject: { contains: activeSubject, mode: "insensitive" } },
      { title: { contains: activeSubject, mode: "insensitive" } },
    ];
  }
  if (q && q.trim()) {
    const term = q.trim();
    workshopWhere.AND = [
      {
        OR: [
          { title: { contains: term, mode: "insensitive" } },
          { description: { contains: term, mode: "insensitive" } },
          { subject: { contains: term, mode: "insensitive" } },
        ],
      },
    ];
  }

  // Fetch upcoming workshops as "sessions"
  const workshops = await prisma.workshop.findMany({
    where: workshopWhere,
    include: {
      tutor: { include: { user: true } },
      enrollments: true,
    },
    orderBy: { startTime: "asc" },
    take: 20,
  });

  // Build where clause for tutors
  const tutorWhere: Prisma.TutorProfileWhereInput = { status: "APPROVED" };
  if (activeSubject && activeSubject !== "All") {
    tutorWhere.subjects = {
      some: { name: { contains: activeSubject, mode: "insensitive" } },
    };
  }
  if (q && q.trim()) {
    const term = q.trim();
    tutorWhere.OR = [
      { user: { name: { contains: term, mode: "insensitive" } } },
      { bio: { contains: term, mode: "insensitive" } },
      { subjects: { some: { name: { contains: term, mode: "insensitive" } } } },
    ];
  }

  // Also fetch approved tutors as individual session cards
  const tutors = await prisma.tutorProfile.findMany({
    where: tutorWhere,
    include: { user: true, subjects: true, availabilities: true },
    take: 12,
  });

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        {/* Page header */}
        <div className={styles.pageHeader} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1.5rem", flexWrap: "wrap" }}>
          <div>
            <h1 className={styles.pageTitle}>All Sessions</h1>
            <p className={styles.pageSubtitle}>
              These are small-group sessions run by Learnivia tutors on topics of their choosing! They are typically shorter and more focused than programs, and you can join them at any time.
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
                <span>🎓</span> Become a Tutor to Host
              </Link>
            )}
          </div>
        </div>

        {/* Search + Sort bar */}
        <form method="GET" action="/sessions" className={styles.searchBar}>
          {activeSubject !== "All" && (
            <input type="hidden" name="subject" value={activeSubject} />
          )}
          <div className={styles.searchInputWrap}>
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
            Search
          </button>
        </form>

        {/* Subject filter pills */}
        <div className={styles.filterRow} role="tablist" aria-label="Filter by subject">
          {SUBJECT_FILTERS.map((f) => {
            const isCurrent = activeSubject.toLowerCase() === f.toLowerCase();
            const href = f === "All" ? "/sessions" : `/sessions?subject=${encodeURIComponent(f)}${q ? `&q=${encodeURIComponent(q)}` : ""}`;
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
        ) : (
          /* Fallback: show tutor cards as individual sessions */
          <div className={styles.sessionsGrid}>
            {tutors.map((t) => {
              const name = t.user.name || "Tutor";
              const subject = t.subjects[0]?.name || "General Tutoring";
              const nextSlot = t.availabilities[0];
              const days = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
              const dayLabel = nextSlot ? days[nextSlot.dayOfWeek] : null;

              return (
                <Link key={t.id} href={`/tutor/${t.id}`} className={styles.sessionCard}>
                  <h3 className={styles.cardTitle}>{subject} — 1-on-1 Session</h3>
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
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
                        <circle cx="9" cy="7" r="4"/>
                      </svg>
                      <span>1-on-1</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
