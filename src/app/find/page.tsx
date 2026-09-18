import styles from "./page.module.css";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { auth } from "@/auth";
import {
  Target,
  GraduationCap,
  Globe,
  Clock,
  Star,
  Search,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";

export const dynamic = "force-dynamic";

// Fast in-memory cache for tutor search to eliminate multi-second DB roundtrips
const findTutorsMemoryCache = new Map<string, { tutors: any[]; timestamp: number }>();

type Props = {
  searchParams: Promise<{
    q?: string;
    grade?: string;
    subject?: string;
    curriculum?: string;
    allGrades?: string;
  }>;
};

export default async function FindTutorPage({ searchParams }: Props) {
  const session = await auth();
  const { q, grade, subject, curriculum, allGrades } = await searchParams;

  // 1. Fetch current logged-in user profile
  let dbUser = null;
  if (session?.user?.id) {
    dbUser = await prisma.user.findUnique({
      where: { id: session.user.id },
    });
  }

  const isAllGradesExplicit = allGrades === "true";
  const activeGrade = isAllGradesExplicit ? "" : (grade || dbUser?.grade || "");
  const activeCurriculum = curriculum || (dbUser?.curriculum && dbUser.curriculum !== "Other" ? dbUser.curriculum : "");
  const studentAge = dbUser?.age || null;
  const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);

  const whereClause: any = {
    status: "APPROVED",
    NOT: [
      {
        availabilities: { none: {} },
        OR: [
          { approvedAt: { lt: threeDaysAgo } },
          { approvedAt: null, createdAt: { lt: threeDaysAgo } },
        ],
      },
    ],
  };

  const conditions: any[] = [];

  if (q && q.trim()) {
    const term = q.trim();
    conditions.push({
      OR: [
        { user: { name: { contains: term, mode: "insensitive" } } },
        { bio: { contains: term, mode: "insensitive" } },
        { school: { contains: term, mode: "insensitive" } },
        { subjects: { some: { name: { contains: term, mode: "insensitive" } } } },
      ],
    });
  }

  // Filter by subject (supporting "Math" matching "Mathematics")
  if (subject && subject.trim() && subject !== "All") {
    const subTerms = subject.toLowerCase().includes("math")
      ? ["math", "mathematics", "algebra", "calculus", "geometry"]
      : [subject.trim()];

    conditions.push({
      subjects: {
        some: {
          OR: subTerms.map((term) => ({
            name: { contains: term, mode: "insensitive" },
          })),
        },
      },
    });
  }

  // Filter by grade
  if (activeGrade && activeGrade.trim()) {
    const cleanGrade = activeGrade.replace(/[^a-zA-Z0-9\s]/g, "").trim();
    conditions.push({
      OR: [
        { gradeLevels: { some: { name: { contains: cleanGrade, mode: "insensitive" } } } },
        { targetGrades: { contains: cleanGrade, mode: "insensitive" } },
        { gradeLevels: { none: {} } }, // Open to all grades
      ],
    });
  }

  // Filter by curriculum
  if (activeCurriculum && activeCurriculum.trim() && activeCurriculum !== "All") {
    conditions.push({
      OR: [
        { curricula: { contains: activeCurriculum.trim(), mode: "insensitive" } },
        { curricula: null },
      ],
    });
  }

  // Filter by age suitability
  if (studentAge) {
    conditions.push({
      OR: [
        { minAge: null, maxAge: null },
        { AND: [{ minAge: { lte: studentAge } }, { maxAge: { gte: studentAge } }] },
        { minAge: { lte: studentAge }, maxAge: null },
      ],
    });
  }

  if (conditions.length > 0) {
    whereClause.AND = conditions;
  }

  const cacheKey = `${subject || ""}:${activeCurriculum}:${activeGrade}:${studentAge || ""}:${q || ""}`;
  const cached = findTutorsMemoryCache.get(cacheKey);

  let tutors: any[] = [];

  if (cached && Date.now() - cached.timestamp < 60_000) {
    tutors = cached.tutors;
  } else {
    try {
      tutors = await prisma.tutorProfile.findMany({
        where: whereClause,
        select: {
          id: true,
          bio: true,
          school: true,
          volunteerHours: true,
          curricula: true,
          minAge: true,
          maxAge: true,
          user: {
            select: {
              id: true,
              name: true,
              timezone: true,
              image: true,
            },
          },
          subjects: true,
          gradeLevels: true,
          reviews: {
            select: {
              id: true,
              rating: true,
            },
          },
          _count: {
            select: {
              tutorBookings: {
                where: { status: "COMPLETED" },
              },
              workshops: {
                where: { status: "COMPLETED" },
              },
            },
          },
        },
        orderBy: { volunteerHours: "desc" },
        take: 36,
      });

      // Prioritize tutors who have the most completed classes/sessions
      tutors.sort((a, b) => {
        const aCompleted = (a._count?.tutorBookings || 0) + (a._count?.workshops || 0);
        const bCompleted = (b._count?.tutorBookings || 0) + (b._count?.workshops || 0);
        if (bCompleted !== aCompleted) {
          return bCompleted - aCompleted;
        }
        return (b.volunteerHours || 0) - (a.volunteerHours || 0);
      });

      findTutorsMemoryCache.set(cacheKey, { tutors, timestamp: Date.now() });
    } catch (err) {
      console.warn("Find page tutor lookup fallback triggered:", (err as Error)?.message);
    }
  }

  const isAutoMatched = Boolean(dbUser && (activeGrade || activeCurriculum) && !isAllGradesExplicit);

  return (
    <main className={styles.main}>
      <div className={styles.header}>
        <div className={styles.kicker}>
          <GraduationCap size={14} color="#1B4D3E" />
          <span>Verified Peer Mentors &middot; K–10</span>
        </div>
        <h1 className={styles.title}>Find a Volunteer Tutor</h1>
        <p className={styles.subtitle}>
          Browse verified high school and university mentors approved for your grade level — free 1-on-1 Zoom sessions.
        </p>
      </div>

      {/* Auto-matching Notification Banner */}
      {isAutoMatched && (
        <div
          style={{
            maxWidth: 960,
            margin: "0 auto 1.75rem",
            background: "#EAF2EE",
            border: "1px solid #C6DEC6",
            borderRadius: 10,
            padding: "0.85rem 1.25rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "0.5rem",
          }}
        >
          <div
            style={{
              fontSize: "0.875rem",
              color: "#1B4D3E",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <Target size={16} color="#1B4D3E" />
            <span>
              Showing tutors matched for your profile:{" "}
              <strong>{activeGrade || "Your Grade"}</strong>
              {studentAge ? ` (Age ${studentAge})` : ""}
              {activeCurriculum ? ` • ${activeCurriculum} Curriculum` : ""}
            </span>
          </div>
          <Link
            href={`/find?allGrades=true${subject ? `&subject=${encodeURIComponent(subject)}` : ""}`}
            style={{
              fontSize: "0.825rem",
              color: "#1B4D3E",
              fontWeight: 700,
              textDecoration: "underline",
            }}
          >
            Show All Tutors
          </Link>
        </div>
      )}

      {/* Search & Filters Bar */}
      <form method="GET" action="/find" className={styles.filters}>
        <div className={styles.searchWrapper}>
          <Search size={16} className={styles.searchIcon} />
          <input
            type="text"
            name="q"
            defaultValue={q || ""}
            placeholder="Search by tutor name, subject, or school…"
            className={styles.searchInput}
          />
        </div>

        <select name="subject" defaultValue={subject || ""} className={styles.filterSelect}>
          <option value="">All Subjects</option>
          <option value="Mathematics">Mathematics</option>
          <option value="Reading &amp; Writing">Reading &amp; Writing</option>
          <option value="English Language Arts">English Language Arts</option>
          <option value="Science">Science</option>
          <option value="Biology">Biology</option>
          <option value="Chemistry">Chemistry</option>
          <option value="Social Studies">Social Studies</option>
          <option value="Learning Support">Learning Support</option>
        </select>

        <select name="grade" defaultValue={activeGrade || ""} className={styles.filterSelect}>
          <option value="">All Grade Levels (K–10)</option>
          <option value="Kindergarten">Kindergarten</option>
          <option value="Grade 1">Grade 1</option>
          <option value="Grade 2">Grade 2</option>
          <option value="Grade 3">Grade 3</option>
          <option value="Grade 4">Grade 4</option>
          <option value="Grade 5">Grade 5</option>
          <option value="Grade 6">Grade 6</option>
          <option value="Grade 7">Grade 7</option>
          <option value="Grade 8">Grade 8</option>
          <option value="Grade 9">Grade 9</option>
          <option value="Grade 10">Grade 10</option>
        </select>

        <select name="curriculum" defaultValue={activeCurriculum || ""} className={styles.filterSelect}>
          <option value="">All Curricula</option>
          <option value="US Common Core">US Common Core</option>
          <option value="CBSE">CBSE (India)</option>
          <option value="ICSE">ICSE (India)</option>
          <option value="IGCSE">IGCSE / GCSE (UK)</option>
          <option value="IB">IB (K–10)</option>
          <option value="Other">Other</option>
        </select>

        <button type="submit" className={styles.searchBtn}>Filter</button>
        {(q || grade || subject || curriculum || activeGrade) && (
          <Link href="/find?allGrades=true" className={styles.clearBtn}>Clear</Link>
        )}
      </form>

      <div className={styles.tutorGrid}>
        {tutors.length === 0 ? (
          <div className={styles.noTutors}>
            <p style={{ margin: "0 0 1rem 0", fontSize: "1rem", color: "#1C1917" }}>
              No tutors matched your search criteria for {subject || "the selected filters"}.
            </p>
            <Link href="/find?allGrades=true" className={styles.clearBtn}>
              Show All Available Tutors
            </Link>
          </div>
        ) : (
          tutors.map((tutor: any) => {
            const completedSessions = (tutor._count?.tutorBookings || 0) + (tutor._count?.workshops || 0);
            const avgRating =
              tutor.reviews?.length > 0
                ? (tutor.reviews.reduce((acc: number, r: any) => acc + r.rating, 0) / tutor.reviews.length).toFixed(1)
                : null;

            return (
              <div key={tutor.id} className={styles.tutorCard}>
                <div className={styles.tutorHeader}>
                  <div className={styles.avatarPlaceholder}>
                    {tutor.user.name?.charAt(0).toUpperCase() || "T"}
                  </div>
                  <div>
                    <h2 className={styles.tutorName}>{tutor.user.name}</h2>
                    <p className={styles.tutorTimezone}>
                      {tutor.school ? (
                        <>
                          <GraduationCap size={13} color="#1B4D3E" />
                          <span>{tutor.school}</span>
                        </>
                      ) : (
                        <>
                          <Globe size={13} color="#78716C" />
                          <span>{tutor.user.timezone || "UTC"}</span>
                        </>
                      )}
                    </p>
                  </div>
                </div>

                <p className={styles.tutorBio}>
                  {(tutor.bio || "").length > 130
                    ? `${(tutor.bio || "").substring(0, 130)}…`
                    : (tutor.bio || "Volunteer tutor ready to help.")}
                </p>

                {/* Real subjects and grade levels */}
                <div className={styles.tags}>
                  {tutor.subjects?.length > 0 ? (
                    tutor.subjects.slice(0, 3).map((s: any) => (
                      <span key={s.id} className={`${styles.tag} ${styles.tagSubject}`}>
                        {s.name}
                      </span>
                    ))
                  ) : (
                    <span className={styles.tag}>General Support</span>
                  )}
                  {tutor.gradeLevels?.slice(0, 1).map((g: any) => (
                    <span key={g.id} className={styles.tag}>
                      {g.name}
                    </span>
                  ))}
                  {tutor.curricula && (
                    <span key="curr" className={styles.tag}>
                      {tutor.curricula.split(",")[0].trim()}
                    </span>
                  )}
                </div>

                <div className={styles.tutorMeta}>
                  {completedSessions > 0 && (
                    <span className={styles.hoursBadge} style={{ background: "#F0FDF4", borderColor: "#BBF7D0", color: "#166534" }}>
                      <CheckCircle2 size={13} color="#166534" />
                      <span>{completedSessions} {completedSessions === 1 ? "class" : "classes"} taught</span>
                    </span>
                  )}
                  <span className={styles.hoursBadge}>
                    <Clock size={13} color="#1B4D3E" />
                    <span>{tutor.volunteerHours} hrs volunteered</span>
                  </span>
                  {avgRating && (
                    <span className={styles.ratingBadge}>
                      <Star size={13} color="#92400E" fill="#92400E" />
                      <span>{avgRating} ({tutor.reviews.length})</span>
                    </span>
                  )}
                </div>

                <Link href={`/tutor/${tutor.id}`} className={styles.viewProfileBtn}>
                  <span>View Profile &amp; Book</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            );
          })
        )}
      </div>
    </main>
  );
}
