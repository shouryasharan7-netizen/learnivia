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
  Calendar,
} from "lucide-react";
import FindFiltersClient from "./FindFiltersClient";
import { enrollInWorkshop } from "@/app/actions/workshops";


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

  let tutors: any[] = [];
  let workshops: any[] = [];

  // Build Workshop Query
  const workshopWhere: any = {
    status: "UPCOMING",
    startTime: { gte: new Date() },
  };
  
  if (q && q.trim()) {
    workshopWhere.title = { contains: q.trim(), mode: "insensitive" };
  }
  if (subject && subject.trim() && subject !== "All") {
    workshopWhere.subject = { contains: subject.trim(), mode: "insensitive" };
  }
  if (activeGrade && activeGrade.trim()) {
    workshopWhere.grade = { contains: activeGrade.replace(/[^a-zA-Z0-9\s]/g, "").trim(), mode: "insensitive" };
  }

  try {
    const results = await Promise.all([
      prisma.tutorProfile.findMany({
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
      }),
      prisma.workshop.findMany({
        where: workshopWhere,
        include: {
          tutor: { include: { user: true } },
          enrollments: true,
        },
        orderBy: { startTime: "asc" },
        take: 12,
      })
    ]);

    // Prioritize tutors who have the most completed classes/sessions
    tutors = results[0];
    tutors.sort((a, b) => {
      const aCompleted = (a._count?.tutorBookings || 0) + (a._count?.workshops || 0);
      const bCompleted = (b._count?.tutorBookings || 0) + (b._count?.workshops || 0);
      if (bCompleted !== aCompleted) {
        return bCompleted - aCompleted;
      }
      return (b.volunteerHours || 0) - (a.volunteerHours || 0);
    });

    workshops = results[1];
  } catch (err) {
    console.warn("Find page tutor lookup fallback triggered:", (err as Error)?.message);
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
          Find a Peer Tutor &amp; Sessions
        </h1>
        <p style={{ fontSize: "0.95rem", color: "var(--text-secondary, #475569)", margin: 0, maxWidth: 600 }}>
          Connect with verified volunteer tutors for 1-on-1 sessions, or join upcoming live group workshops matching your criteria.
        </p>
      </div>

      <div className={styles.pageLayout}>
        {/* ── Left Sidebar Filters ── */}
        <FindFiltersClient />

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

          {/* ── Upcoming Group Sessions ── */}
          {workshops.length > 0 && (
            <div style={{ marginBottom: "3rem" }}>
              <h2 style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--wa-ink)", marginBottom: "1rem" }}>
                Live Group Sessions Matching Your Search
              </h2>
              <div className={styles.tutorGrid} style={{ gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))" }}>
                {workshops.map((w) => {
                  const seatsLeft = w.maxCapacity - w.enrollments.length;
                  const isEnrolled = session?.user?.id
                    ? w.enrollments.some((e: any) => e.studentId === session.user.id)
                    : false;

                  return (
                    <div key={w.id} className={styles.tutorCard} style={{ display: "flex", flexDirection: "column" }}>
                      <div className={styles.cardHeader} style={{ background: "#F8FAFC", borderBottom: "1px solid #E2E8F0" }}>
                        <div>
                          <h3 className={styles.tutorName} style={{ fontSize: "1.1rem" }}>{w.title}</h3>
                          <p className={styles.tutorBio} style={{ margin: "0.25rem 0 0" }}>
                            Hosted by <strong>{w.tutor.user.name}</strong>
                          </p>
                        </div>
                      </div>
                      <div className={styles.cardBody} style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                        <div style={{ marginBottom: "1rem", display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                          <span className={styles.tag}>{w.subject}</span>
                          <span className={styles.tag} style={{ background: seatsLeft > 0 ? "#DCFCE7" : "#FEE2E2", color: seatsLeft > 0 ? "#166534" : "#991B1B" }}>
                            {seatsLeft > 0 ? `${seatsLeft} seats left` : "Full"}
                          </span>
                        </div>
                        <p style={{ fontSize: "0.85rem", color: "var(--wa-muted)", marginBottom: "1rem", flex: 1 }}>
                          {w.description}
                        </p>
                        <div style={{ fontSize: "0.85rem", color: "var(--wa-forest)", fontWeight: 600, display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "1rem" }}>
                          <Calendar size={14} />
                          <span>
                            {new Date(w.startTime).toLocaleDateString()} at {new Date(w.startTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </span>
                        </div>

                        {!session?.user ? (
                          <Link href="/signin?callbackUrl=/find" className={styles.secondaryBtn} style={{ textAlign: "center" }}>
                            Sign In to Register
                          </Link>
                        ) : isEnrolled ? (
                          <div style={{ textAlign: "center", padding: "0.75rem", background: "#F0FDF4", color: "#166534", borderRadius: "6px", fontSize: "0.85rem", fontWeight: 600 }}>
                            <CheckCircle2 size={14} style={{ display: "inline", verticalAlign: "middle", marginRight: "0.25rem" }} />
                            Registered
                          </div>
                        ) : seatsLeft > 0 ? (
                          <form action={enrollInWorkshop}>
                            <input type="hidden" name="workshopId" value={w.id} />
                            <button type="submit" className={styles.primaryBtn} style={{ width: "100%", justifyContent: "center" }}>
                              Register Free Seat
                            </button>
                          </form>
                        ) : (
                          <button disabled className={styles.secondaryBtn} style={{ width: "100%", opacity: 0.5, cursor: "not-allowed" }}>
                            Workshop Full
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── Tutor Grid (3-col Schoolhouse card layout) ── */}
          <h2 style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--wa-ink)", marginBottom: "1rem" }}>
            Available 1-on-1 Tutors
          </h2>
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
