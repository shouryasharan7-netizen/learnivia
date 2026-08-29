import styles from "./page.module.css";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";

export const dynamic = "force-dynamic";

type Props = {
  searchParams: Promise<{ q?: string; grade?: string; subject?: string }>;
};

export default async function FindTutorPage({ searchParams }: Props) {
  const { q, grade, subject } = await searchParams;

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

  if (grade && grade.trim()) {
    conditions.push({
      gradeLevels: {
        some: {
          name: { contains: grade.trim(), mode: "insensitive" },
        },
      },
    });
  }

  if (subject && subject.trim()) {
    conditions.push({
      subjects: {
        some: {
          name: { contains: subject.trim(), mode: "insensitive" },
        },
      },
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

  return (
    <main className={styles.main}>
      <div className={styles.header}>
        <Image src="/images/find-a-tutor.png" alt="Find a tutor mascot" width={120} height={150} className={styles.mascotImg} priority />
        <h1 className={styles.title}>Find a Volunteer Tutor</h1>
        <p className={styles.subtitle}>Browse certified volunteer tutors and book a free, one-on-one or small group session.</p>
      </div>

      {/* Functional Server-Side Search & Filters */}
      <form method="GET" action="/find" className={styles.filters}>
        <input
          type="text"
          name="q"
          defaultValue={q || ""}
          placeholder="Search by tutor name, subject, or school..."
          className={styles.searchInput}
        />
        <select name="grade" defaultValue={grade || ""} className={styles.filterSelect}>
          <option value="">All Grade Levels</option>
          <option value="Primary">Primary (Years 1–6)</option>
          <option value="Secondary">Lower Secondary (Years 7–9)</option>
          <option value="GCSE">GCSE / O-Level</option>
          <option value="A-Level">A-Level / AP</option>
          <option value="University">University</option>
        </select>
        <button type="submit" className={styles.searchBtn}>Search</button>
        {(q || grade || subject) && (
          <Link href="/find" className={styles.clearBtn}>Clear Filters</Link>
        )}
      </form>

      <div className={styles.tutorGrid}>
        {tutors.length === 0 ? (
          <div className={styles.noTutors}>
            <p>No tutors matched your search criteria.</p>
            {(q || grade || subject) && (
              <Link href="/find" className={styles.clearBtn} style={{ marginTop: "1rem" }}>
                Reset search filters
              </Link>
            )}
          </div>
        ) : (
          tutors.map(tutor => {
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
                    tutor.subjects.slice(0, 3).map(s => (
                      <span key={s.id} className={styles.tag}>{s.name}</span>
                    ))
                  ) : (
                    <span className={styles.tag}>General Support</span>
                  )}
                  {tutor.gradeLevels.slice(0, 1).map(g => (
                    <span key={g.id} className={styles.tag} style={{ background: "var(--color-cream)", color: "var(--color-navy)" }}>
                      {g.name}
                    </span>
                  ))}
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
