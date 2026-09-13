import { prisma } from "@/lib/prisma";
import { approveApplication, rejectApplication, adminUpdateReportCard } from "../actions";

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
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h1 style={{ fontSize: "2rem", fontWeight: 800, color: "var(--color-navy)", margin: 0 }}>
            Pending Tutor Applications
          </h1>
          <p style={{ color: "var(--color-text-muted)", fontSize: "0.9rem", margin: "0.25rem 0 0 0" }}>
            Review applicant qualifications, verified academic report cards, and subject scores.
          </p>
        </div>
        <div style={{ background: "#EFF6FF", border: "1px solid #BFDBFE", color: "#1E40AF", padding: "0.4rem 0.85rem", borderRadius: "8px", fontSize: "0.85rem", fontWeight: 700 }}>
          {pendingTutors.length} Pending Review
        </div>
      </div>

      {pendingTutors.length === 0 ? (
        <div style={{ background: "white", padding: "3rem", borderRadius: "1rem", textAlign: "center", border: "1px solid var(--color-border)" }}>
          <p style={{ color: "var(--color-text-muted)" }}>No pending applications to review.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "1.75rem" }}>
          {pendingTutors.map((tutor) => (
            <div key={tutor.id} style={{ background: "white", padding: "1.75rem", borderRadius: "1rem", border: "1.5px solid var(--color-border)", display: "flex", flexDirection: "column", gap: "1.25rem", boxShadow: "0 4px 12px rgba(0,0,0,0.03)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "0.75rem" }}>
                <div>
                  <h3 style={{ fontSize: "1.3rem", fontWeight: 800, color: "var(--color-navy)", margin: 0 }}>
                    {tutor.user.name || tutor.user.email}
                  </h3>
                  <p style={{ color: "var(--color-text-muted)", fontSize: "0.875rem", margin: "0.25rem 0 0 0" }}>
                    {tutor.user.email} • Applied on {new Date(tutor.createdAt).toLocaleDateString()}
                    {tutor.school ? ` • Affiliation: ${tutor.school}` : ""}
                    {tutor.user.grade ? ` • Enrolled: ${tutor.user.grade}${tutor.user.curriculum ? ` (${tutor.user.curriculum})` : ""}` : ""}
                  </p>
                </div>
                <span style={{ background: "#FEF3C7", color: "#92400E", padding: "0.35rem 0.85rem", borderRadius: "999px", fontSize: "0.75rem", fontWeight: 800, textTransform: "uppercase" }}>
                  🟡 {tutor.status} REVIEW
                </span>
              </div>

              {/* Academic Grades & Report Card Verification Box */}
              <div
                style={{
                  background: (tutor.reportCardStorageKey || tutor.reportCardUrl) ? "#F0FDF4" : "#FFFBEB",
                  border: `1.5px solid ${(tutor.reportCardStorageKey || tutor.reportCardUrl) ? "#86EFAC" : "#FCD34D"}`,
                  borderRadius: "10px",
                  padding: "1.25rem",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.75rem",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.5rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                    <span style={{ fontSize: "1.2rem" }}>📑</span>
                    <strong style={{ color: "var(--color-navy)", fontSize: "0.95rem" }}>
                      Academic Credentials &amp; Report Card
                    </strong>
                  </div>
                  {(tutor.reportCardStorageKey || tutor.reportCardUrl) ? (
                    <span style={{ color: "#065F46", background: "#D1FAE5", padding: "0.2rem 0.6rem", borderRadius: "999px", fontSize: "0.75rem", fontWeight: 700 }}>
                      ✓ Document Attached
                    </span>
                  ) : (
                    <span style={{ color: "#92400E", background: "#FEF3C7", padding: "0.2rem 0.6rem", borderRadius: "999px", fontSize: "0.75rem", fontWeight: 700 }}>
                      ⚠️ No Document Uploaded
                    </span>
                  )}
                </div>

                <div style={{ fontSize: "0.9rem", color: "var(--color-navy)" }}>
                  <strong>Verified Scores / Results:</strong>{" "}
                  {tutor.academicScores ? (
                    <span style={{ color: "#0E8345", fontWeight: 700 }}>{tutor.academicScores}</span>
                  ) : (
                    <span style={{ color: "var(--color-text-muted)", fontStyle: "italic" }}>Not provided yet</span>
                  )}
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap", marginTop: "0.25rem" }}>
                  {(tutor.reportCardStorageKey || tutor.reportCardUrl) ? (
                    <a
                      href={`/api/admin/report-card/${tutor.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.4rem",
                        background: "#0E8345",
                        color: "white",
                        padding: "0.55rem 1.1rem",
                        borderRadius: "8px",
                        fontSize: "0.85rem",
                        fontWeight: 700,
                        textDecoration: "none",
                        boxShadow: "0 2px 6px rgba(14, 131, 69, 0.2)",
                      }}
                    >
                      📄 Open &amp; Verify Report Card / Marksheet ({tutor.reportCardName || "Document"}) ↗
                    </a>
                  ) : (
                    <div style={{ fontSize: "0.8rem", color: "#B45309" }}>
                      Applicant has not uploaded a report card document yet. You can attach one below if received externally.
                    </div>
                  )}
                </div>

                {/* Admin Quick Attach/Edit Report Card */}
                <details style={{ marginTop: "0.5rem" }}>
                  <summary style={{ fontSize: "0.8rem", color: "var(--color-primary)", cursor: "pointer", fontWeight: 600 }}>
                    ⚙️ Attach / Update Report Card or Scores on behalf of applicant
                  </summary>
                  <form
                    action={adminUpdateReportCard.bind(null, tutor.id)}
                    style={{
                      marginTop: "0.75rem",
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.5rem",
                      background: "white",
                      padding: "1rem",
                      borderRadius: "8px",
                      border: "1px solid var(--color-border)",
                    }}
                  >
                    <div>
                      <label style={{ fontSize: "0.75rem", fontWeight: 700, display: "block", marginBottom: "0.25rem" }}>
                        Scores / Grade Summary:
                      </label>
                      <input
                        type="text"
                        name="academicScores"
                        defaultValue={tutor.academicScores || ""}
                        placeholder="e.g. Class 10 CGPA: 8.7"
                        style={{ width: "100%", padding: "0.4rem", borderRadius: "4px", border: "1px solid var(--color-border)", fontSize: "0.8rem" }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: "0.75rem", fontWeight: 700, display: "block", marginBottom: "0.25rem" }}>
                        Document URL (Google Drive / Cloud Share):
                      </label>
                      <input
                        type="url"
                        name="reportCardLink"
                        defaultValue={tutor.reportCardUrl?.startsWith("http") ? tutor.reportCardUrl : ""}
                        placeholder="https://drive.google.com/..."
                        style={{ width: "100%", padding: "0.4rem", borderRadius: "4px", border: "1px solid var(--color-border)", fontSize: "0.8rem" }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: "0.75rem", fontWeight: 700, display: "block", marginBottom: "0.25rem" }}>
                        Or Upload PDF/Image:
                      </label>
                      <input
                        type="file"
                        name="reportCardFile"
                        accept=".pdf,image/*"
                        style={{ fontSize: "0.75rem" }}
                      />
                    </div>
                    <button
                      type="submit"
                      style={{
                        background: "var(--color-navy)",
                        color: "white",
                        border: "none",
                        padding: "0.4rem 0.8rem",
                        borderRadius: "6px",
                        fontSize: "0.75rem",
                        fontWeight: 700,
                        alignSelf: "flex-start",
                        cursor: "pointer",
                      }}
                    >
                      Save Report Card
                    </button>
                  </form>
                </details>
              </div>

              {/* Subjects & Grade levels */}
              <div>
                <strong style={{ fontSize: "0.8rem", color: "var(--color-navy)", display: "block", marginBottom: "0.35rem" }}>
                  Subjects &amp; Grade Levels Applied For:
                </strong>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                  {tutor.subjects.map(s => (
                    <span key={s.id} style={{ background: "var(--color-sky)", color: "var(--color-primary)", padding: "0.25rem 0.65rem", borderRadius: "999px", fontSize: "0.8rem", fontWeight: 600 }}>
                      📚 {s.name}
                    </span>
                  ))}
                  {tutor.gradeLevels.map(g => (
                    <span key={g.id} style={{ background: "var(--color-cream)", color: "var(--color-navy)", border: "1px solid var(--color-border)", padding: "0.25rem 0.65rem", borderRadius: "999px", fontSize: "0.8rem", fontWeight: 600 }}>
                      🎓 {g.name}
                    </span>
                  ))}
                </div>
              </div>
              
              <div style={{ background: "var(--color-cream)", padding: "1.25rem", borderRadius: "0.75rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                <div>
                  <h4 style={{ fontSize: "0.875rem", fontWeight: 700, color: "var(--color-navy)", marginBottom: "0.25rem" }}>Applicant Bio</h4>
                  <p style={{ fontSize: "0.875rem", color: "var(--color-text)", whiteSpace: "pre-wrap", margin: 0 }}>{tutor.bio || "No bio provided."}</p>
                </div>
                {tutor.experience && (
                  <div>
                    <h4 style={{ fontSize: "0.875rem", fontWeight: 700, color: "var(--color-navy)", marginBottom: "0.25rem" }}>Relevant Experience</h4>
                    <p style={{ fontSize: "0.875rem", color: "var(--color-text)", whiteSpace: "pre-wrap", margin: 0 }}>{tutor.experience}</p>
                  </div>
                )}
              </div>

              {/* Action buttons */}
              <div style={{ display: "flex", gap: "1rem", marginTop: "0.5rem", borderTop: "1px solid var(--color-border)", paddingTop: "1.25rem" }}>
                <form action={approveApplication.bind(null, tutor.id)}>
                  <button type="submit" style={{ background: "var(--color-teal)", color: "white", border: "none", padding: "0.75rem 1.75rem", borderRadius: "8px", fontWeight: 700, fontSize: "0.9rem", cursor: "pointer" }}>
                    ✓ Approve Tutor Application
                  </button>
                </form>
                <form action={rejectApplication.bind(null, tutor.id)}>
                  <button type="submit" style={{ background: "white", color: "var(--color-error)", border: "1px solid var(--color-error)", padding: "0.75rem 1.5rem", borderRadius: "8px", fontWeight: 600, fontSize: "0.9rem", cursor: "pointer" }}>
                    Reject Application
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
