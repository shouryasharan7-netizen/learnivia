import styles from "./page.module.css";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";
import { auth } from "@/auth";

export const dynamic = "force-dynamic";

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

  const tutors = await prisma.tutorProfile.findMany({
    where: whereClause,
    include: {
      user: true,
      subjects: true,
      gradeLevels: true,
      reviews: true,
    },
    orderBy: { volunteerHours: "desc" },
  });

  const isAutoMatched = Boolean(dbUser && (activeGrade || activeCurriculum) && !isAllGradesExplicit);

  return (
    <main className={styles.main}>
      <div className={styles.header}>
        <Image src="/images/find-a-tutor.png" alt="Find a tutor mascot" width={120} height={150} className={styles.mascotImg} priority />
        <h1 className={styles.title}>Find a Volunteer Tutor</h1>
        <p className={styles.subtitle}>Browse certified volunteer tutors and book a free, one-on-one session.</p>
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
          <option value="Science">Science</option>
          <option value="Physics">Physics</option>
          <option value="Chemistry">Chemistry</option>
          <option value="Biology">Biology</option>
          <option value="SAT Prep">SAT Prep</option>
          <option value="Reading and Writing">Reading &amp; Writing</option>
          <option value="History">History</option>
        </select>

        <select name="grade" defaultValue={activeGrade || ""} className={styles.filterSelect}>
          <option value="">All Grade Levels</option>
          <option value="Primary">Primary (Years 1–6)</option>
          <option value="Middle School">Middle School (Grades 6–8)</option>
          <option value="Grade 9">Grade 9 / Freshman</option>
          <option value="Grade 10">Grade 10 / Sophomore</option>
          <option value="Grade 11">Grade 11 / Junior</option>
          <option value="Grade 12">Grade 12 / Senior</option>
          <option value="University">University</option>
        </select>

        <select name="curriculum" defaultValue={activeCurriculum || ""} className={styles.filterSelect}>
          <option value="">All Curricula</option>
          <option value="IB">IB</option>
          <option value="AP">AP</option>
          <option value="CBSE">CBSE</option>
          <option value="ICSE">ICSE</option>
          <option value="IGCSE">IGCSE / GCSE</option>
          <option value="US Common Core">US Common Core</option>
          <option value="A-Level">A-Level</option>
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
          tutors.map((tutor) => {
            const avgRating =
              tutor.reviews.length > 0
                ? (tutor.reviews.reduce((acc, r) => acc + r.rating, 0) / tutor.reviews.length).toFixed(1)
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
                  {tutor.subjects.length > 0 ? (
                    tutor.subjects.slice(0, 3).map((s) => (
                      <span key={s.id} className={styles.tag}>{s.name}</span>
                    ))
                  ) : (
                    <span className={styles.tag}>General Support</span>
                  )}
                  {tutor.gradeLevels.slice(0, 1).map((g) => (
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
