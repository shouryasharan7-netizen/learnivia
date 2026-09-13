import styles from "./page.module.css";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";
import { auth } from "@/auth";

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

  const whereClause: any = {
    status: "APPROVED",
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
        },
        orderBy: { volunteerHours: "desc" },
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
        <Image src="/images/find-a-tutor.png" alt="Find a tutor mascot" width={120} height={150} className={styles.mascotImg} priority />
        <h1 className={styles.title}>Find a Volunteer Tutor</h1>
        <p className={styles.subtitle}>Browse verified volunteer tutors approved for your grade level — free 1-on-1 Zoom sessions.</p>
      </div>

      {/* Auto-matching Notification Banner */}
      {isAutoMatched && (
        <div style={{
          maxWidth: 900,
          margin: "0 auto 1.5rem",
          background: "#F0FDF4",
          border: "1px solid #BBF7D0",
          borderRadius: 12,
          padding: "0.75rem 1.25rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "0.5rem"
        }}>
          <div style={{ fontSize: "0.9rem", color: "#166534", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span>🎯</span>
            <span>
              Showing tutors matched for your profile:{" "}
              <strong>{activeGrade || "Your Grade"}</strong>
              {studentAge ? ` (Age ${studentAge})` : ""}
              {activeCurriculum ? ` • ${activeCurriculum} Curriculum` : ""}
            </span>
          </div>
          <Link
            href={`/find?allGrades=true${subject ? `&subject=${encodeURIComponent(subject)}` : ""}`}
            style={{ fontSize: "0.825rem", color: "#15803D", fontWeight: 700, textDecoration: "underline" }}
          >
            Show All Tutors
          </Link>
        </div>
      )}

      {/* Search & Filters Bar */}
      <form method="GET" action="/find" className={styles.filters} style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", alignItems: "center" }}>
        <input
          type="text"
          name="q"
          defaultValue={q || ""}
          placeholder="Search by tutor name, subject, or school..."
          className={styles.searchInput}
          style={{ flex: 1, minWidth: 200 }}
        />

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
            <p>No tutors matched your search criteria for {subject || "the selected filters"}.</p>
            <Link href="/find?allGrades=true" className={styles.clearBtn} style={{ marginTop: "1rem" }}>
              Show All Available Tutors
            </Link>
          </div>
        ) : (
          tutors.map((tutor: any) => {
            const avgRating =
              tutor.reviews?.length > 0
                ? (tutor.reviews.reduce((acc: number, r: any) => acc + r.rating, 0) / tutor.reviews.length).toFixed(1)
                : null;

            return (
              <div key={tutor.id} className={styles.tutorCard}>
                <div className={styles.tutorHeader}>
                  <div className={styles.avatarPlaceholder}>
                    {tutor.user.name?.charAt(0).toUpperCase() || "?"}
                  </div>
                  <div>
                    <h2 className={styles.tutorName}>{tutor.user.name}</h2>
                    <p className={styles.tutorTimezone}>
                      {tutor.school ? `🎓 ${tutor.school}` : `🌍 ${tutor.user.timezone || "UTC"}`}
                    </p>
                  </div>
                </div>

                <p className={styles.tutorBio}>
                  {(tutor.bio || "").length > 130
                    ? `${(tutor.bio || "").substring(0, 130)}...`
                    : (tutor.bio || "Volunteer tutor ready to help.")}
                </p>
                
                {/* Real subjects and grade levels */}
                <div className={styles.tags}>
                  {tutor.subjects?.length > 0 ? (
                    tutor.subjects.slice(0, 3).map((s: any) => (
                      <span key={s.id} className={styles.tag}>{s.name}</span>
                    ))
                  ) : (
                    <span className={styles.tag}>General Support</span>
                  )}
                  {tutor.gradeLevels?.slice(0, 1).map((g: any) => (
                    <span key={g.id} className={styles.tag} style={{ background: "var(--color-cream)", color: "var(--color-navy)" }}>
                      {g.name}
                    </span>
                  ))}
                  {tutor.curricula && (
                    <span className={styles.tag} style={{ background: "#FEF3C7", color: "#92400E" }}>
                      {tutor.curricula.split(",")[0].trim()}
                    </span>
                  )}
                </div>

                <div className={styles.tutorMeta}>
                  <span className={styles.hoursBadge}>
                    ⏱️ {tutor.volunteerHours} hrs volunteered
                  </span>
                  {avgRating && (
                    <span>⭐ {avgRating} ({tutor.reviews.length})</span>
                  )}
                </div>

                <Link href={`/tutor/${tutor.id}`} className={styles.viewProfileBtn}>
                  View Profile &amp; Book
                </Link>
              </div>
            );
          })
        )}
      </div>
    </main>
  );
}
