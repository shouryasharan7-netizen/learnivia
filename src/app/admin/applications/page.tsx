import { prisma } from "@/lib/prisma";
import { approveApplication, rejectApplication } from "../actions";

export default async function AdminApplicationsPage() {
  const pendingTutors = await prisma.tutorProfile.findMany({
    where: { status: "PENDING" },
    include: { user: true },
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
                  <p style={{ color: "var(--color-text-muted)", fontSize: "0.875rem" }}>{tutor.user.email} • Applied {new Date(tutor.createdAt).toLocaleDateString()}</p>
                </div>
                <span style={{ background: "var(--color-warning-bg)", color: "var(--color-warning)", padding: "0.25rem 0.75rem", borderRadius: "999px", fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase" }}>
                  {tutor.status}
                </span>
              </div>
              
              <div style={{ background: "var(--color-cream)", padding: "1rem", borderRadius: "0.5rem" }}>
                <h4 style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--color-navy)", marginBottom: "0.5rem" }}>Bio</h4>
                <p style={{ fontSize: "0.875rem", color: "var(--color-text-muted)", whiteSpace: "pre-wrap" }}>{tutor.bio}</p>
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
