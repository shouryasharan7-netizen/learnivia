import { requireAdmin } from "@/lib/auth-user";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin — Subject & Grade Configuration | Learnivia",
};

export const dynamic = "force-dynamic";

export default async function AdminSubjectsPage() {
  // P1-8: Use requireAdmin() — not inline email check — for consistent authorization
  try {
    await requireAdmin();
  } catch {
    redirect("/dashboard");
  }

  const [subjects, gradeLevels] = await Promise.all([
    prisma.subject.findMany({ orderBy: { name: "asc" } }),
    prisma.gradeLevel.findMany({ orderBy: { name: "asc" } }),
  ]);

  const K10_SUBJECTS = [
    "Mathematics", "Reading & Writing", "English Language Arts",
    "Science", "Biology", "Chemistry", "Social Studies",
    "Phonics & Reading", "Early Math", "Pre-Algebra",
    "Algebra I", "Geometry", "Earth Science", "Physical Science",
    "Learning Support", "Number Sense",
  ];

  const K10_GRADES = [
    { name: "Kindergarten", category: "Early Elementary" },
    { name: "Grade 1", category: "Early Elementary" },
    { name: "Grade 2", category: "Early Elementary" },
    { name: "Grade 3", category: "Elementary" },
    { name: "Grade 4", category: "Elementary" },
    { name: "Grade 5", category: "Elementary" },
    { name: "Grade 6", category: "Middle School" },
    { name: "Grade 7", category: "Middle School" },
    { name: "Grade 8", category: "Middle School" },
    { name: "Grade 9", category: "Early High School" },
    { name: "Grade 10", category: "Early High School" },
  ];

  return (
    <main style={{ minHeight: "100vh", background: "#F9FAFB", padding: "2rem 1.5rem", fontFamily: "var(--font-body, Inter, sans-serif)" }}>
      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "2rem" }}>
          <Link href="/admin" style={{ color: "#6B7280", textDecoration: "none", fontSize: "0.875rem" }}>
            ← Admin Center
          </Link>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 800, color: "#111827", margin: 0 }}>
            Subject & Grade Configuration
          </h1>
        </div>

        <div style={{ background: "#FEF9C3", border: "1px solid #FDE047", borderRadius: "0.75rem", padding: "1rem 1.25rem", marginBottom: "2rem", fontSize: "0.875rem", color: "#713F12" }}>
          <strong>K–10 Scope Lock:</strong> Learnivia exclusively supports Kindergarten through Grade 10. Do not add SAT, ACT, AP, A-Level, or college admissions subjects. Tutor applications listing out-of-scope subjects should be rejected.
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
          {/* Subjects Panel */}
          <section style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: "1rem", padding: "1.5rem" }}>
            <h2 style={{ fontSize: "1.125rem", fontWeight: 800, color: "#111827", marginBottom: "1rem" }}>
              Subjects ({subjects.length} in DB)
            </h2>

            <div style={{ marginBottom: "1rem" }}>
              <p style={{ fontSize: "0.8125rem", color: "#6B7280", marginBottom: "0.5rem" }}>
                Canonical K–10 subjects (for reference):
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
                {K10_SUBJECTS.map((s) => (
                  <span
                    key={s}
                    style={{
                      padding: "0.25rem 0.65rem",
                      background: "#F0FDF4",
                      color: "#0D683B",
                      borderRadius: "999px",
                      fontSize: "0.8rem",
                      fontWeight: 600,
                      border: "1px solid #BBF7D0",
                    }}
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <div style={{ borderTop: "1px solid #F3F4F6", paddingTop: "1rem" }}>
              <p style={{ fontSize: "0.8125rem", color: "#6B7280", marginBottom: "0.5rem" }}>
                Currently in database:
              </p>
              {subjects.length === 0 ? (
                <p style={{ color: "#9CA3AF", fontSize: "0.875rem", fontStyle: "italic" }}>
                  No subjects added yet. Subjects are added when tutors apply and list their subjects.
                </p>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                  {subjects.map((s) => {
                    const isK10 = K10_SUBJECTS.some(
                      (k) => k.toLowerCase() === s.name.toLowerCase()
                    );
                    return (
                      <div
                        key={s.id}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          padding: "0.4rem 0.75rem",
                          background: isK10 ? "#F0FDF4" : "#FEF2F2",
                          border: `1px solid ${isK10 ? "#BBF7D0" : "#FECACA"}`,
                          borderRadius: "0.5rem",
                        }}
                      >
                        <span style={{ fontSize: "0.875rem", fontWeight: 600, color: isK10 ? "#0D683B" : "#DC2626" }}>
                          {s.name}
                        </span>
                        <span
                          style={{
                            fontSize: "0.7rem",
                            padding: "0.15rem 0.5rem",
                            background: isK10 ? "#BBF7D0" : "#FECACA",
                            color: isK10 ? "#0D683B" : "#DC2626",
                            borderRadius: "999px",
                            fontWeight: 700,
                          }}
                        >
                          {isK10 ? "✓ K-10" : "⚠ Out of Scope"}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </section>

          {/* Grade Levels Panel */}
          <section style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: "1rem", padding: "1.5rem" }}>
            <h2 style={{ fontSize: "1.125rem", fontWeight: 800, color: "#111827", marginBottom: "1rem" }}>
              Grade Levels ({gradeLevels.length} in DB)
            </h2>

            <div style={{ marginBottom: "1rem" }}>
              <p style={{ fontSize: "0.8125rem", color: "#6B7280", marginBottom: "0.5rem" }}>
                Required K–10 grade levels:
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
                {K10_GRADES.map((g) => {
                  const existsInDb = gradeLevels.some(
                    (db) => db.name.toLowerCase() === g.name.toLowerCase()
                  );
                  return (
                    <div
                      key={g.name}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "0.35rem 0.75rem",
                        background: existsInDb ? "#F0FDF4" : "#FEF9C3",
                        border: `1px solid ${existsInDb ? "#BBF7D0" : "#FDE047"}`,
                        borderRadius: "0.5rem",
                      }}
                    >
                      <div>
                        <span style={{ fontSize: "0.875rem", fontWeight: 600, color: "#111827" }}>
                          {g.name}
                        </span>
                        <span style={{ fontSize: "0.75rem", color: "#6B7280", marginLeft: "0.4rem" }}>
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
                        {existsInDb ? "✓ In DB" : "Not in DB"}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        </div>

        {/* Actions */}
        <div
          style={{
            marginTop: "2rem",
            background: "#fff",
            border: "1px solid #E5E7EB",
            borderRadius: "1rem",
            padding: "1.5rem",
          }}
        >
          <h2 style={{ fontSize: "1.125rem", fontWeight: 800, color: "#111827", marginBottom: "0.5rem" }}>
            Seed Missing Grade Levels
          </h2>
          <p style={{ fontSize: "0.875rem", color: "#6B7280", marginBottom: "1rem" }}>
            If any K–10 grade levels are missing from the database, run the following seed command to add them. This is safe to run multiple times (idempotent).
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
            npx prisma db seed
          </div>
          <p style={{ fontSize: "0.8125rem", color: "#9CA3AF", marginTop: "0.75rem" }}>
            Or contact a developer to run a migration that seeds the canonical K–10 grade levels.
          </p>
        </div>
      </div>
    </main>
  );
}
