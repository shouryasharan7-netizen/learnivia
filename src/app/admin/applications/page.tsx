import { prisma } from "@/lib/prisma";
import { approveApplication, rejectApplication, adminUpdateReportCard } from "../actions";
import { FileText, CheckCircle2, AlertCircle, FileCheck, Settings, ShieldCheck, AlertTriangle } from "lucide-react";

export default async function AdminApplicationsPage() {
  const pendingTutors = await prisma.tutorProfile.findMany({
    where: { status: "PENDING" },
    include: { 
      user: true,
      subjects: true,
      gradeLevels: true,
      trainingModules: true,
    },
    orderBy: { createdAt: "asc" }
  });

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "2rem", fontWeight: 700, color: "var(--wa-ink)", margin: 0 }}>
            Pending Tutor Applications
          </h1>
          <p style={{ color: "var(--wa-muted)", fontSize: "0.9rem", margin: "0.25rem 0 0 0" }}>
            Review applicant qualifications, verified academic report cards, and subject scores.
          </p>
        </div>
        <div style={{ background: "var(--wa-white)", border: "1px solid var(--wa-border)", color: "var(--wa-forest)", padding: "0.4rem 0.85rem", borderRadius: "6px", fontSize: "0.85rem", fontWeight: 600 }}>
          {pendingTutors.length} Pending Review
        </div>
      </div>

      {pendingTutors.length === 0 ? (
        <div style={{ background: "var(--wa-white)", padding: "3rem", borderRadius: "8px", textAlign: "center", border: "1px solid var(--wa-border)" }}>
          <p style={{ color: "var(--wa-muted)" }}>No pending applications to review.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "1.75rem" }}>
          {pendingTutors.map((tutor) => (
            <div key={tutor.id} style={{ background: "var(--wa-white)", padding: "1.75rem", borderRadius: "8px", border: "1px solid var(--wa-border)", display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "0.75rem" }}>
                <div>
                  <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "1.3rem", fontWeight: 700, color: "var(--wa-ink)", margin: 0 }}>
                    {tutor.user.name || tutor.user.email}
                  </h3>
                  <p style={{ color: "var(--wa-muted)", fontSize: "0.875rem", margin: "0.25rem 0 0 0" }}>
                    Applied on {new Date(tutor.createdAt).toLocaleDateString()} • Email: {tutor.user.email}
                  </p>
                </div>
                <span style={{ background: "var(--wa-paper)", border: "1px solid var(--wa-border)", color: "var(--wa-ochre)", padding: "0.25rem 0.75rem", borderRadius: "999px", fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase" }}>
                  Status: PENDING
                </span>
              </div>

              {/* Academic Credentials Section */}
              <div
                style={{
                  background: (tutor.reportCardStorageKey || tutor.reportCardUrl) ? "var(--wa-white)" : "var(--wa-paper)",
                  border: `1px solid ${(tutor.reportCardStorageKey || tutor.reportCardUrl) ? "var(--wa-border)" : "var(--wa-border)"}`,
                  borderRadius: "8px",
                  padding: "1.25rem",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.75rem",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.5rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <FileText size={18} style={{ color: "var(--wa-forest)" }} aria-hidden="true" />
                    <strong style={{ color: "var(--wa-ink)", fontSize: "0.95rem" }}>
                      Academic Credentials &amp; Report Card
                    </strong>
                  </div>
                  {(tutor.reportCardStorageKey || tutor.reportCardUrl) ? (
                    <span style={{ color: "var(--wa-forest)", background: "var(--wa-paper)", border: "1px solid var(--wa-border)", padding: "0.2rem 0.6rem", borderRadius: "999px", fontSize: "0.75rem", fontWeight: 600, display: "inline-flex", alignItems: "center", gap: "0.25rem" }}>
                      <CheckCircle2 size={12} aria-hidden="true" /> Document Attached
                    </span>
                  ) : (
                    <span style={{ color: "var(--wa-terracotta)", background: "var(--wa-paper)", border: "1px solid var(--wa-border)", padding: "0.2rem 0.6rem", borderRadius: "999px", fontSize: "0.75rem", fontWeight: 600, display: "inline-flex", alignItems: "center", gap: "0.25rem" }}>
                      <AlertCircle size={12} aria-hidden="true" /> No Document Uploaded
                    </span>
                  )}
                </div>

                <div style={{ fontSize: "0.9rem", color: "var(--wa-ink)" }}>
                  <strong>Verified Scores / Results:</strong>{" "}
                  {tutor.academicScores ? (
                    <span style={{ color: "var(--wa-forest)", fontWeight: 700 }}>{tutor.academicScores}</span>
                  ) : (
                    <span style={{ color: "var(--wa-muted)", fontStyle: "italic" }}>Not provided yet</span>
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
                        background: "var(--wa-forest)",
                        color: "var(--wa-paper)",
                        padding: "0.55rem 1.1rem",
                        borderRadius: "6px",
                        fontSize: "0.85rem",
                        fontWeight: 600,
                        textDecoration: "none",
                      }}
                    >
                      <FileCheck size={16} aria-hidden="true" /> Open &amp; Verify Report Card / Marksheet ({tutor.reportCardName || "Document"}) ↗
                    </a>
                  ) : (
                    <div style={{ fontSize: "0.8rem", color: "var(--wa-terracotta)" }}>
                      Applicant has not uploaded a report card document yet. You can attach one below if received externally.
                    </div>
                  )}
                </div>

                {/* Admin Quick Attach/Edit Report Card */}
                <details style={{ marginTop: "0.5rem" }}>
                  <summary style={{ fontSize: "0.8rem", color: "var(--wa-forest)", cursor: "pointer", fontWeight: 600, display: "inline-flex", alignItems: "center", gap: "0.3rem" }}>
                    <Settings size={13} aria-hidden="true" /> Attach / Update Report Card or Scores on behalf of applicant
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

              {/* Safeguarding & Tutor Training Modules Verification Box */}
              <div
                style={{
                  background: tutor.trainingModules.length === 5 ? "#F0FDF4" : "#FFFBEB",
                  border: `1.5px solid ${tutor.trainingModules.length === 5 ? "#86EFAC" : "#FCD34D"}`,
                  borderRadius: "10px",
                  padding: "1.25rem",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.75rem",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.5rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <ShieldCheck size={18} style={{ color: "var(--wa-forest)" }} aria-hidden="true" />
                    <strong style={{ color: "var(--wa-ink)", fontSize: "0.95rem" }}>
                      Safeguarding &amp; Tutor Training Modules
                    </strong>
                  </div>
                  <span
                    style={{
                      color: tutor.trainingModules.length === 5 ? "var(--wa-forest)" : "var(--wa-terracotta)",
                      background: "var(--wa-paper)",
                      border: "1px solid var(--wa-border)",
                      padding: "0.2rem 0.65rem",
                      borderRadius: "999px",
                      fontSize: "0.75rem",
                      fontWeight: 600,
                    }}
                  >
                    {tutor.trainingModules.length === 5
                      ? "5/5 Completed (Ready for Approval)"
                      : `${tutor.trainingModules.length}/5 Completed`}
                  </span>
                </div>

                <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                  {[
                    { id: 1, title: "Tutoring Basics & Encouragement" },
                    { id: 2, title: "Supporting Different Learning Styles" },
                    { id: 3, title: "Online Zoom Best Practices" },
                    { id: 4, title: "Safety, Boundaries & Safeguarding" },
                    { id: 5, title: "Volunteer Hours & Rules" },
                  ].map((m) => {
                    const completed = tutor.trainingModules.some((tm) => tm.moduleId === m.id && tm.quizPassed);
                    return (
                      <span
                        key={m.id}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "0.3rem",
                          fontSize: "0.75rem",
                          padding: "0.25rem 0.6rem",
                          borderRadius: "6px",
                          background: completed ? "var(--wa-paper)" : "var(--wa-white)",
                          color: completed ? "var(--wa-forest)" : "var(--wa-muted)",
                          fontWeight: completed ? 600 : 500,
                          border: `1px solid ${completed ? "var(--wa-forest)" : "var(--wa-border)"}`,
                        }}
                        title={m.title}
                      >
                        {completed ? "✓" : "○"} M{m.id}: {m.title}
                      </span>
                    );
                  })}
                </div>
              </div>

              {/* Subjects & Grade levels */}
              <div>
                <strong style={{ fontSize: "0.8rem", color: "var(--wa-ink)", display: "block", marginBottom: "0.35rem" }}>
                  Subjects &amp; Grade Levels Applied For:
                </strong>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                  {tutor.subjects.map(s => (
                    <span key={s.id} style={{ background: "var(--wa-paper)", color: "var(--wa-forest)", border: "1px solid var(--wa-border)", padding: "0.25rem 0.65rem", borderRadius: "999px", fontSize: "0.8rem", fontWeight: 600 }}>
                      {s.name}
                    </span>
                  ))}
                  {tutor.gradeLevels.map(g => (
                    <span key={g.id} style={{ background: "var(--wa-white)", color: "var(--wa-ink)", border: "1px solid var(--wa-border)", padding: "0.25rem 0.65rem", borderRadius: "999px", fontSize: "0.8rem", fontWeight: 600 }}>
                      {g.name}
                    </span>
                  ))}
                </div>
              </div>
              
              <div style={{ background: "var(--wa-paper)", border: "1px solid var(--wa-border)", padding: "1.25rem", borderRadius: "6px", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                <div>
                  <h4 style={{ fontSize: "0.875rem", fontWeight: 700, color: "var(--wa-ink)", marginBottom: "0.25rem" }}>Applicant Bio</h4>
                  <p style={{ fontSize: "0.875rem", color: "var(--wa-ink)", whiteSpace: "pre-wrap", margin: 0 }}>{tutor.bio || "No bio provided."}</p>
                </div>
                {tutor.experience && (
                  <div>
                    <h4 style={{ fontSize: "0.875rem", fontWeight: 700, color: "var(--wa-ink)", marginBottom: "0.25rem" }}>Relevant Experience</h4>
                    <p style={{ fontSize: "0.875rem", color: "var(--wa-ink)", whiteSpace: "pre-wrap", margin: 0 }}>{tutor.experience}</p>
                  </div>
                )}
              </div>

              {/* Action buttons */}
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginTop: "0.5rem", borderTop: "1px solid var(--wa-border)", paddingTop: "1.25rem" }}>
                {tutor.trainingModules.length < 5 && (
                  <div style={{ fontSize: "0.8rem", color: "var(--wa-terracotta)", background: "var(--wa-paper)", padding: "0.5rem 0.75rem", borderRadius: "6px", border: "1px solid var(--wa-border)", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                    <AlertTriangle size={14} aria-hidden="true" />
                    <span><strong>Advisory:</strong> Applicant has completed {tutor.trainingModules.length}/5 training modules. You may approve if offline/direct orientation was provided.</span>
                  </div>
                )}
                <div style={{ display: "flex", gap: "1rem" }}>
                  <form action={approveApplication.bind(null, tutor.id)}>
                    <button type="submit" style={{ background: "var(--wa-forest)", color: "var(--wa-paper)", border: "none", padding: "0.65rem 1.5rem", borderRadius: "6px", fontWeight: 600, fontSize: "0.85rem", cursor: "pointer" }}>
                      Approve Tutor Application
                    </button>
                  </form>
                  <form action={rejectApplication.bind(null, tutor.id)}>
                    <button type="submit" style={{ background: "var(--wa-white)", color: "var(--wa-terracotta)", border: "1px solid var(--wa-border)", padding: "0.65rem 1.5rem", borderRadius: "6px", fontWeight: 600, fontSize: "0.85rem", cursor: "pointer" }}>
                      Reject Application
                    </button>
                  </form>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
