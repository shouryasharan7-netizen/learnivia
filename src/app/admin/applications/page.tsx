import { prisma } from "@/lib/prisma";
import { approveApplication, rejectApplication } from "../actions";

export default async function AdminApplicationsPage() {
  const pendingTutors = await prisma.tutorProfile.findMany({
    where: { status: "PENDING" },
    include: { 
      user: true,
      subjects: true,
      gradeLevels: true,
    },
    orderBy: { createdAt: "asc" }
  });

  return (
    <div>
      <h1 style={{ fontSize: "2rem", fontWeight: 800, color: "var(--color-navy)", marginBottom: "2rem" }}>
        Pending Applications
      </h1>

      {pendingTutors.length === 0 ? (
        <div style={{ background: "white", padding: "3rem", borderRadius: "1rem", textAlign: "center", border: "1px solid var(--color-border)" }}>
          <p style={{ color: "var(--color-text-muted)" }}>No pending applications to review.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {pendingTutors.map((tutor) => (
            <div key={tutor.id} style={{ background: "white", padding: "1.5rem", borderRadius: "1rem", border: "1px solid var(--color-border)", display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <h3 style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--color-navy)" }}>{tutor.user.name || tutor.user.email}</h3>
                  <p style={{ color: "var(--color-text-muted)", fontSize: "0.875rem" }}>
                    {tutor.user.email} • Applied {new Date(tutor.createdAt).toLocaleDateString()}
                    {tutor.school ? ` • ${tutor.school}` : ""}
                  </p>
                </div>
                <span style={{ background: "var(--color-warning-bg)", color: "var(--color-warning)", padding: "0.25rem 0.75rem", borderRadius: "999px", fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase" }}>
                  {tutor.status}
                </span>
              </div>

              {/* Subjects & Grade levels */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                {tutor.subjects.map(s => (
                  <span key={s.id} style={{ background: "var(--color-sky)", color: "var(--color-primary)", padding: "0.2rem 0.6rem", borderRadius: "999px", fontSize: "0.75rem", fontWeight: 600 }}>
                    📚 {s.name}
                  </span>
                ))}
                {tutor.gradeLevels.map(g => (
                  <span key={g.id} style={{ background: "var(--color-cream)", color: "var(--color-text-muted)", border: "1px solid var(--color-border)", padding: "0.2rem 0.6rem", borderRadius: "999px", fontSize: "0.75rem", fontWeight: 600 }}>
                    🎓 {g.name}
                  </span>
                ))}
              </div>
              
              <div style={{ background: "var(--color-cream)", padding: "1rem", borderRadius: "0.5rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                <div>
                  <h4 style={{ fontSize: "0.875rem", fontWeight: 700, color: "var(--color-navy)", marginBottom: "0.25rem" }}>Bio</h4>
                  <p style={{ fontSize: "0.875rem", color: "var(--color-text)", whiteSpace: "pre-wrap" }}>{tutor.bio || "No bio provided."}</p>
                </div>
                {tutor.experience && (
                  <div>
                    <h4 style={{ fontSize: "0.875rem", fontWeight: 700, color: "var(--color-navy)", marginBottom: "0.25rem" }}>Relevant Experience</h4>
                    <p style={{ fontSize: "0.875rem", color: "var(--color-text)", whiteSpace: "pre-wrap" }}>{tutor.experience}</p>
                  </div>
                )}
              </div>

              <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
                <form action={approveApplication.bind(null, tutor.id)}>
                  <button type="submit" style={{ background: "var(--color-teal)", color: "white", border: "none", padding: "0.75rem 1.5rem", borderRadius: "0.5rem", fontWeight: 600, cursor: "pointer" }}>
                    Approve
                  </button>
                </form>
                <form action={rejectApplication.bind(null, tutor.id)}>
                  <button type="submit" style={{ background: "white", color: "var(--color-error)", border: "1px solid var(--color-error)", padding: "0.75rem 1.5rem", borderRadius: "0.5rem", fontWeight: 600, cursor: "pointer" }}>
                    Reject
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
