import { requireAdmin } from "@/lib/auth-user";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import type { Metadata } from "next";
import {
  SUBJECT_TAXONOMY,
  CANONICAL_GRADES,
  ALL_SUBJECTS,
  SUBJECT_CATEGORY_MAP,
} from "@/lib/subject-taxonomy";

export const metadata: Metadata = {
  title: "Admin | Subject & Grade Configuration | Learnivia",
};

export const dynamic = "force-dynamic";

export default async function AdminSubjectsPage() {
  try {
    await requireAdmin();
  } catch {
    redirect("/dashboard");
  }

  const [subjects, gradeLevels] = await Promise.all([
    prisma.subject.findMany({ orderBy: { name: "asc" } }),
    prisma.gradeLevel.findMany({ orderBy: { name: "asc" } }),
  ]);

  const dbSubjectNames = subjects.map((s) => s.name);
  const missingSubjects = ALL_SUBJECTS.filter(
    (s) => !dbSubjectNames.some((n) => n.toLowerCase() === s.toLowerCase())
  );
  const nonCanonical = subjects.filter(
    (s) => !ALL_SUBJECTS.some((c) => c.toLowerCase() === s.name.toLowerCase())
  );

  const dbGradeNames = gradeLevels.map((g) => g.name);
  const missingGrades = CANONICAL_GRADES.filter(
    (g) => !dbGradeNames.some((n) => n.toLowerCase() === g.name.toLowerCase())
  );

  const categoryColors: Record<string, { bg: string; border: string; text: string; badge: string; badgeText: string }> = {
    "Core Academics (K-12)": {
      bg: "#F0FDF4", border: "#BBF7D0", text: "#0D683B",
      badge: "#BBF7D0", badgeText: "#065F46",
    },
    "Standardized Testing": {
      bg: "#EFF6FF", border: "#BFDBFE", text: "#1D4ED8",
      badge: "#BFDBFE", badgeText: "#1E3A5F",
    },
    "Advanced Academics (AP)": {
      bg: "#FDF4FF", border: "#E9D5FF", text: "#7E22CE",
      badge: "#E9D5FF", badgeText: "#581C87",
    },
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "var(--surface-subtle, #F8FAFC)",
        padding: "2rem 1.5rem",
        fontFamily: "var(--font-body, Inter, sans-serif)",
      }}
    >
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "1rem",
            marginBottom: "1.5rem",
          }}
        >
          <Link
            href="/admin"
            style={{ color: "#6B7280", textDecoration: "none", fontSize: "0.875rem" }}
          >
            ← Admin Center
          </Link>
          <h1
            style={{
              fontSize: "1.5rem",
              fontWeight: 800,
              color: "var(--text-primary, #0C1B33)",
              margin: 0,
            }}
          >
            Subject &amp; Grade Configuration
          </h1>
        </div>

        {/* Scope Banner */}
        <div
          style={{
            background: "#EFF6FF",
            border: "1px solid #BFDBFE",
            borderRadius: "0.75rem",
            padding: "1rem 1.25rem",
            marginBottom: "2rem",
            fontSize: "0.875rem",
            color: "#1E3A5F",
          }}
        >
          <strong>Platform Scope:</strong> Learnivia supports <strong>K–12 Core Academics</strong>,{" "}
          <strong>Standardized Testing (SAT, ACT, TOEFL, IELTS, GRE)</strong>, and{" "}
          <strong>Advanced Academics (AP courses)</strong>. Tutors may list subjects
          from all three categories. Run{" "}
          <code style={{ background: "#DBEAFE", padding: "0.1rem 0.4rem", borderRadius: "4px" }}>
            npx tsx scripts/seed-subjects-canonical.ts
          </code>{" "}
          to sync the database with the canonical taxonomy.
        </div>

        {/* Health Summary */}
        {(missingSubjects.length > 0 || nonCanonical.length > 0 || missingGrades.length > 0) && (
          <div
            style={{
              background: "#FFFBEB",
              border: "1px solid #FDE68A",
              borderRadius: "0.75rem",
              padding: "1rem 1.25rem",
              marginBottom: "2rem",
              fontSize: "0.875rem",
              color: "#92400E",
            }}
          >
            <strong>DB Health Warning:</strong>{" "}
            {missingSubjects.length > 0 && `${missingSubjects.length} canonical subject(s) missing from DB. `}
            {nonCanonical.length > 0 && `${nonCanonical.length} non-canonical subject(s) in DB (may need cleanup). `}
            {missingGrades.length > 0 && `${missingGrades.length} grade level(s) missing. `}
            Run the seed script to resolve.
          </div>
        )}

        {/* Subject Taxonomy — 3 category sections */}
        <section
          style={{
            background: "var(--surface-raised, #FFFFFF)",
            border: "1px solid #E5E7EB",
            borderRadius: "1rem",
            padding: "1.5rem",
            marginBottom: "2rem",
          }}
        >
          <h2
            style={{
              fontSize: "1.125rem",
              fontWeight: 800,
              color: "var(--text-primary, #0C1B33)",
              marginBottom: "0.25rem",
            }}
          >
            Subject Catalog
          </h2>
          <p style={{ fontSize: "0.8125rem", color: "#6B7280", marginBottom: "1.5rem" }}>
            {subjects.length} subjects in DB &bull; {ALL_SUBJECTS.length} canonical subjects &bull; {missingSubjects.length} missing
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
            {(Object.entries(SUBJECT_TAXONOMY) as [string, readonly string[]][]).map(([category, canonicalList]) => {
              const colors = categoryColors[category] ?? {
                bg: "#F9FAFB", border: "#E5E7EB", text: "#374151",
                badge: "#E5E7EB", badgeText: "#374151",
              };
              return (
                <div key={category}>
                  <h3
                    style={{
                      fontSize: "0.9375rem",
                      fontWeight: 700,
                      color: colors.text,
                      marginBottom: "0.75rem",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                    }}
                  >
                    {category}
                    <span
                      style={{
                        background: colors.badge,
                        color: colors.badgeText,
                        padding: "0.1rem 0.5rem",
                        borderRadius: "9999px",
                        fontSize: "0.7rem",
                        fontWeight: 700,
                      }}
                    >
                      {canonicalList.length} subjects
                    </span>
                  </h3>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
                    {canonicalList.map((subjectName) => {
                      const inDB = dbSubjectNames.some(
                        (n) => n.toLowerCase() === subjectName.toLowerCase()
                      );
                      return (
                        <span
                          key={subjectName}
                          title={inDB ? "In database" : "Missing from database — run seed"}
                          style={{
                            padding: "0.25rem 0.65rem",
                            background: inDB ? colors.bg : "#FEF9C3",
                            color: inDB ? colors.text : "#92400E",
                            borderRadius: "6px",
                            fontSize: "0.8rem",
                            fontWeight: 600,
                            border: `1px solid ${inDB ? colors.border : "#FDE68A"}`,
                            cursor: "default",
                          }}
                        >
                          {subjectName}
                          {!inDB && " ⚠"}
                        </span>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Non-canonical subjects in DB */}
          {nonCanonical.length > 0 && (
            <div style={{ marginTop: "1.5rem", paddingTop: "1.5rem", borderTop: "1px solid #F3F4F6" }}>
              <p style={{ fontSize: "0.8125rem", color: "#DC2626", fontWeight: 700, marginBottom: "0.5rem" }}>
                Non-canonical subjects in DB (review / cleanup needed):
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
                {nonCanonical.map((s) => (
                  <span
                    key={s.id}
                    style={{
                      padding: "0.25rem 0.65rem",
                      background: "#FEF2F2",
                      color: "#DC2626",
                      borderRadius: "6px",
                      fontSize: "0.8rem",
                      fontWeight: 600,
                      border: "1px solid #FECACA",
                    }}
                  >
                    {s.name} — Unknown
                  </span>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* Grade Levels */}
        <section
          style={{
            background: "var(--surface-raised, #FFFFFF)",
            border: "1px solid #E5E7EB",
            borderRadius: "1rem",
            padding: "1.5rem",
            marginBottom: "2rem",
          }}
        >
          <h2
            style={{
              fontSize: "1.125rem",
              fontWeight: 800,
              color: "var(--text-primary, #0C1B33)",
              marginBottom: "0.25rem",
            }}
          >
            Grade Levels
          </h2>
          <p style={{ fontSize: "0.8125rem", color: "#6B7280", marginBottom: "1.25rem" }}>
            {gradeLevels.length} in DB &bull; {CANONICAL_GRADES.length} canonical (Kindergarten – Grade 12) &bull; {missingGrades.length} missing
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
            {CANONICAL_GRADES.map((g) => {
              const existsInDb = dbGradeNames.some(
                (n) => n.toLowerCase() === g.name.toLowerCase()
              );
              return (
                <div
                  key={g.name}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "0.4rem 0.75rem",
                    background: existsInDb ? "#F0FDF4" : "#FFFBEB",
                    border: `1px solid ${existsInDb ? "#BBF7D0" : "#FDE68A"}`,
                    borderRadius: "0.5rem",
                  }}
                >
                  <div>
                    <span style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--text-primary, #0C1B33)" }}>
                      {g.name}
                    </span>
                    <span style={{ fontSize: "0.75rem", color: "#6B7280", marginLeft: "0.5rem" }}>
                      {g.category}
                    </span>
                  </div>
                  <span
                    style={{
                      fontSize: "0.7rem",
                      fontWeight: 700,
                      color: existsInDb ? "#0D683B" : "#B45309",
                    }}
                  >
                    {existsInDb ? "Active in DB" : "Missing — run seed"}
                  </span>
                </div>
              );
            })}
          </div>
        </section>

        {/* Seed Command Panel */}
        <div
          style={{
            background: "var(--surface-raised, #FFFFFF)",
            border: "1px solid #E5E7EB",
            borderRadius: "1rem",
            padding: "1.5rem",
          }}
        >
          <h2
            style={{
              fontSize: "1.125rem",
              fontWeight: 800,
              color: "var(--text-primary, #0C1B33)",
              marginBottom: "0.5rem",
            }}
          >
            Sync Database with Canonical Taxonomy
          </h2>
          <p style={{ fontSize: "0.875rem", color: "#6B7280", marginBottom: "1rem" }}>
            Run the following command to upsert all canonical subjects and grade levels
            (Kindergarten – Grade 12, K-12 academics, standardized tests, AP courses). This is idempotent.
          </p>
          <div
            style={{
              background: "#111827",
              color: "#D1FAE5",
              padding: "1rem 1.25rem",
              borderRadius: "0.5rem",
              fontFamily: "monospace",
              fontSize: "0.875rem",
            }}
          >
            npx tsx scripts/seed-subjects-canonical.ts
          </div>
        </div>
      </div>
    </main>
  );
}
