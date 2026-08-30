import Link from "next/link";
import { prisma } from "@/lib/prisma";
import styles from "./page.module.css";

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
  const { q, subject } = await searchParams;
  const activeSubject = subject || "All";

  // Build where clause for workshops
  const workshopWhere: any = { status: "UPCOMING" };
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
  const tutorWhere: any = { status: "APPROVED" };
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
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>All Sessions</h1>
          <p className={styles.pageSubtitle}>
            These are small-group sessions run by Learnivia tutors on topics of their choosing! They are typically shorter and more focused than programs, and you can join them at any time.
          </p>
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
              const seatsLeft = w.maxCapacity - w.enrollments.length;
              const ratio = `${w.enrollments.length}/${w.maxCapacity}`;
              const tutorName = w.tutor.user.name || "Tutor";
              return (
                <Link key={w.id} href={`/learn`} className={styles.sessionCard}>
                  <h3 className={styles.cardTitle}>{w.title}</h3>
                  <p className={styles.cardTime}>
                    Starts {formatStartTime(w.startTime)}
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
