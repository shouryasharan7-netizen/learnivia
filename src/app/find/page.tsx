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
  Users,
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

  // Subject chip tabs (Schoolhouse-style horizontal filter row)
  const SUBJECT_CHIPS = [
    { label: "All", value: "" },
    { label: "Mathematics", value: "Mathematics" },
    { label: "Science", value: "Science" },
    { label: "English", value: "English Language Arts" },
    { label: "CBSE", value: "cbse" },
    { label: "ICSE", value: "icse" },
    { label: "IB", value: "ib" },
    { label: "Social Studies", value: "Social Studies" },
  ];

  return (
    <div>
      {/* ── Page Header ── */}
      <div style={{ marginBottom: "2rem" }}>
        <h1
          style={{
            fontSize: "1.75rem",
            fontWeight: 800,
            color: "var(--text-primary, #0C1B33)",
            margin: "0 0 0.5rem",
            fontFamily: "var(--font-sans, system-ui, sans-serif)",
          }}
        >
          Find a Peer Tutor
        </h1>
        <p style={{ fontSize: "0.95rem", color: "var(--text-secondary, #475569)", margin: 0, maxWidth: 600 }}>
          Connect with verified volunteer tutors for K-10 students. 
          Use the filters to find your perfect match.
        </p>
      </div>

      <div style={{ display: "flex", gap: "2rem", alignItems: "flex-start", flexDirection: "column", '@media (min-width: 768px)': { flexDirection: "row" } } as any}>
        {/* ── Left Sidebar Filters ── */}
        <aside style={{ width: "100%", maxWidth: "280px", flexShrink: 0 }}>
          <form method="GET" action="/find" style={{ display: "flex", flexDirection: "column", gap: "1.5rem", background: "var(--surface-raised, #FFFFFF)", padding: "1.5rem", borderRadius: "var(--radius-lg, 12px)", border: "1px solid var(--border, #E2E8F0)" }}>
            <h2 style={{ fontSize: "1.1rem", fontWeight: 700, margin: 0, color: "var(--text-primary, #0C1B33)" }}>Filters</h2>
            
            {/* Search Input in Sidebar */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <label style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-secondary, #475569)" }}>Search</label>
              <div style={{ position: "relative" }}>
                <Search size={14} color="var(--text-muted, #64748B)" style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
                <input
                  type="text"
                  name="q"
                  defaultValue={q || ""}
                  placeholder="Name, keyword..."
                  style={{ width: "100%", padding: "0.6rem 0.75rem 0.6rem 2.25rem", border: "1px solid var(--border, #E2E8F0)", borderRadius: "var(--radius-sm, 8px)", fontSize: "0.875rem" }}
                />
              </div>
            </div>

            {/* Subject Select */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <label style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-secondary, #475569)" }}>Subject</label>
              <select name="subject" defaultValue={subject || ""} style={{ width: "100%", padding: "0.6rem", border: "1px solid var(--border, #E2E8F0)", borderRadius: "var(--radius-sm, 8px)", fontSize: "0.875rem", background: "#fff" }}>
                <option value="">All Subjects</option>
                <option value="Mathematics">Mathematics</option>
                <option value="Science">Science</option>
                <option value="English Language Arts">English Language Arts</option>
                <option value="Social Studies">Social Studies</option>
              </select>
            </div>

            {/* Grade Select */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <label style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-secondary, #475569)" }}>Grade Level</label>
              <select name="grade" defaultValue={activeGrade || ""} style={{ width: "100%", padding: "0.6rem", border: "1px solid var(--border, #E2E8F0)", borderRadius: "var(--radius-sm, 8px)", fontSize: "0.875rem", background: "#fff" }}>
                <option value="">All Grades</option>
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
            </div>

            {/* Board / Curriculum Select */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <label style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-secondary, #475569)" }}>Board / Curriculum</label>
              <select name="curriculum" defaultValue={activeCurriculum || ""} style={{ width: "100%", padding: "0.6rem", border: "1px solid var(--border, #E2E8F0)", borderRadius: "var(--radius-sm, 8px)", fontSize: "0.875rem", background: "#fff" }}>
                <option value="">All Boards</option>
                <option value="cbse">CBSE</option>
                <option value="icse">ICSE</option>
                <option value="ib">IB / International</option>
                <option value="us">US Common Core</option>
              </select>
            </div>

            <input type="hidden" name="allGrades" value="true" />

            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginTop: "0.5rem" }}>
              <button type="submit" style={{ width: "100%", padding: "0.75rem", background: "var(--primary, #0D9488)", color: "#fff", border: "none", borderRadius: "var(--radius-sm, 8px)", fontWeight: 700, cursor: "pointer" }}>
                Apply Filters
              </button>
              {(q || grade || subject || curriculum || activeGrade) && (
                <Link href="/find?allGrades=true" style={{ width: "100%", padding: "0.75rem", textAlign: "center", border: "1px solid var(--border, #E2E8F0)", borderRadius: "var(--radius-sm, 8px)", color: "var(--text-muted, #64748B)", textDecoration: "none", fontWeight: 600, fontSize: "0.875rem" }}>
                  Clear All
                </Link>
              )}
            </div>
          </form>
        </aside>

        {/* ── Main Content Area ── */}
        <div style={{ flex: 1, minWidth: 0, width: "100%" }}>
          {/* ── Auto-match banner ── */}
          {isAutoMatched && (
            <div
              style={{
                background: "var(--primary-light, #CCFBF1)",
                border: "1px solid rgba(13,148,136,0.2)",
                borderRadius: "var(--radius-md, 10px)",
                padding: "0.85rem 1.25rem",
                marginBottom: "1.5rem",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: "0.5rem",
                fontSize: "0.9rem",
                color: "var(--primary-dark, #115E59)",
              }}
            >
              <span style={{ display: "flex", alignItems: "center" }}>
                <Target size={16} style={{ marginRight: "0.5rem" }} />
                Showing tutors perfectly matched for: <strong style={{ marginLeft: "0.25rem" }}>{activeGrade || "Your Grade"}</strong>
                {activeCurriculum ? ` · ${activeCurriculum}` : ""}
              </span>
              <Link
                href={`/find?allGrades=true${subject ? `&subject=${encodeURIComponent(subject)}` : ""}`}
                style={{ color: "var(--primary, #0D9488)", fontWeight: 700, textDecoration: "underline", fontSize: "0.85rem" }}
              >
                Clear Auto-match
              </Link>
            </div>
          )}

          {/* ── Tutor Grid (3-col Schoolhouse card layout) ── */}
          {tutors.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "4rem 2rem",
                background: "var(--surface-raised, #FFFFFF)",
                border: "1px solid var(--border, #E2E8F0)",
                borderRadius: "var(--radius-lg, 12px)",
              }}
            >
              <BookOpen size={48} color="var(--border, #E2E8F0)" style={{ marginBottom: "1rem" }} />
              <p style={{ fontSize: "1.1rem", fontWeight: 600, color: "var(--text-primary, #0C1B33)", margin: "0 0 0.5rem" }}>
                No tutors found for these filters
              </p>
              <p style={{ fontSize: "0.95rem", color: "var(--text-muted, #64748B)", margin: "0 0 1.5rem" }}>
                Try broadening your search or clearing some filters.
              </p>
              <Link
                href="/find?allGrades=true"
                style={{
                  display: "inline-block",
                  padding: "0.75rem 1.5rem",
                  background: "var(--primary, #0D9488)",
                  color: "#fff",
                  borderRadius: "var(--radius-md, 10px)",
                  fontSize: "0.95rem",
                  fontWeight: 700,
                  textDecoration: "none",
                }}
              >
                Browse All Tutors
              </Link>
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                gap: "1.25rem",
              }}
            >
          {tutors.map((tutor: any) => {
            const completedSessions = (tutor._count?.tutorBookings || 0) + (tutor._count?.workshops || 0);
            const avgRating =
              tutor.reviews?.length > 0
                ? (
                    tutor.reviews.reduce((acc: number, r: any) => acc + r.rating, 0) /
                    tutor.reviews.length
                  ).toFixed(1)
                : null;

            return (
              <Link
                key={tutor.id}
                href={`/tutor/${tutor.id}`}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  padding: "1.1rem 1.1rem 1rem",
                  background: "var(--surface-raised, #FFFFFF)",
                  border: "1px solid var(--border, #E2E8F0)",
                  borderRadius: "var(--radius-lg, 14px)",
                  textDecoration: "none",
                  transition: "box-shadow 180ms, transform 180ms",
                }}
                className="tutor-card-link"
              >
                {/* Tutor header */}
                <div style={{ display: "flex", gap: "0.75rem", marginBottom: "0.75rem", alignItems: "flex-start" }}>
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: "50%",
                      background: "var(--primary, #0D9488)",
                      color: "#fff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "1rem",
                      fontWeight: 700,
                      flexShrink: 0,
                    }}
                  >
                    {tutor.user.name?.charAt(0).toUpperCase() || "T"}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p
                      style={{
                        fontSize: "0.9rem",
                        fontWeight: 700,
                        color: "var(--text-primary, #0C1B33)",
                        margin: "0 0 2px",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {tutor.user.name}
                    </p>
                    <p
                      style={{
                        fontSize: "0.775rem",
                        color: "var(--text-muted, #64748B)",
                        margin: 0,
                      }}
                    >
                      {tutor.school || tutor.user.timezone || "Volunteer Tutor"}
                    </p>
                  </div>
                  {avgRating && (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "2px",
                        fontSize: "0.775rem",
                        color: "var(--accent, #F59E0B)",
                        fontWeight: 700,
                      }}
                    >
                      <Star size={12} fill="currentColor" />
                      {avgRating}
                    </div>
                  )}
                </div>

                {/* Bio */}
                <p
                  style={{
                    fontSize: "0.825rem",
                    color: "var(--text-secondary, #475569)",
                    margin: "0 0 0.875rem",
                    lineHeight: 1.5,
                    flex: 1,
                    display: "-webkit-box",
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  {tutor.bio || "Volunteer peer tutor ready to help you master the material."}
                </p>

                {/* Tags */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem", marginBottom: "0.875rem" }}>
                  {tutor.subjects?.slice(0, 3).map((s: any) => (
                    <span
                      key={s.id}
                      style={{
                        padding: "0.2rem 0.6rem",
                        background: "var(--primary-light, #CCFBF1)",
                        color: "var(--primary-dark, #115E59)",
                        borderRadius: "var(--radius-pill, 9999px)",
                        fontSize: "0.7rem",
                        fontWeight: 600,
                      }}
                    >
                      {s.name}
                    </span>
                  ))}
                  {tutor.curricula && (
                    <span
                      style={{
                        padding: "0.2rem 0.6rem",
                        background: "var(--accent-light, #FEF3C7)",
                        color: "var(--accent-hover, #D97706)",
                        borderRadius: "var(--radius-pill, 9999px)",
                        fontSize: "0.7rem",
                        fontWeight: 600,
                      }}
                    >
                      {tutor.curricula.split(",")[0].trim()}
                    </span>
                  )}
                </div>

                {/* Footer: sessions + CTA */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    paddingTop: "0.75rem",
                    borderTop: "1px solid var(--border, #E2E8F0)",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.775rem", color: "var(--text-muted, #64748B)" }}>
                    <Users size={13} />
                    <span>
                      {completedSessions > 0 ? `${completedSessions} sessions` : `${tutor.volunteerHours || 0} hrs`}
                    </span>
                  </div>
                  <span
                    style={{
                      fontSize: "0.8rem",
                      fontWeight: 700,
                      color: "var(--primary, #0D9488)",
                    }}
                  >
                    View Profile →
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
      </div>
      </div>
    </div>
  );
}
