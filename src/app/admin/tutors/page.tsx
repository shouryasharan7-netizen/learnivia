import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth-user";
import { redirect } from "next/navigation";
import Link from "next/link";
import { suspendTutor, reactivateTutor, approveApplication, adminUpdateReportCard } from "../actions";
import AdjustHoursButton from "./AdjustHoursButton";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin - Tutors & Volunteer Transcripts | Learnivia",
};

export default async function AdminTutorsPage() {
  const user = await getCurrentUser();
  if (!user || !user.isAdmin) {
    redirect("/dashboard");
  }

  const tutors = await prisma.tutorProfile.findMany({
    include: {
      user: true,
      subjects: true,
      gradeLevels: true,
      tutorBookings: {
        where: { status: "COMPLETED" },
      },
      workshops: {
        where: { status: "COMPLETED" },
      },
      reviews: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "1.75rem", fontWeight: 800, color: "var(--color-navy)", marginBottom: "0.5rem" }}>
          Tutor Directory &amp; Transcripts
        </h1>
        <p style={{ color: "var(--color-text-muted)", fontSize: "0.95rem" }}>
          Manage all approved and registered volunteer tutors, audit real-time service hours, and view academic grades and verified transcripts.
        </p>
      </div>

      <div style={{ background: "white", borderRadius: "12px", border: "1px solid var(--color-border)", padding: "1.5rem" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.875rem" }}>
            <thead>
              <tr style={{ borderBottom: "2px solid var(--color-border)", textAlign: "left" }}>
                <th style={{ padding: "0.75rem" }}>Tutor</th>
                <th style={{ padding: "0.75rem" }}>Affiliation</th>
                <th style={{ padding: "0.75rem" }}>Subjects</th>
                <th style={{ padding: "0.75rem" }}>Real-Time Service Hours</th>
                <th style={{ padding: "0.75rem" }}>Status</th>
                <th style={{ padding: "0.75rem" }}>Academic Grades &amp; Transcript</th>
                <th style={{ padding: "0.75rem" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {tutors.map((tutor) => {
                const bookingMinutes = (tutor.tutorBookings || []).reduce((sum, b) => {
                  const dur = Math.max(15, (new Date(b.endTime).getTime() - new Date(b.startTime).getTime()) / (1000 * 60));
                  return sum + dur;
                }, 0);
                const workshopMinutes = (tutor.workshops || []).reduce((sum, w) => {
                  const dur = Math.max(15, (new Date(w.endTime).getTime() - new Date(w.startTime).getTime()) / (1000 * 60));
                  return sum + dur;
                }, 0);
                const completedCount = (tutor.tutorBookings?.length || 0) + (tutor.workshops?.length || 0);
                const realVolunteerHours = Math.round(((bookingMinutes + workshopMinutes) / 60) * 10) / 10;

                return (
                  <tr key={tutor.id} style={{ borderBottom: "1px solid var(--color-border)" }}>
                    <td style={{ padding: "0.75rem" }}>
                      <div style={{ fontWeight: 700, color: "var(--color-navy)" }}>{tutor.user.name || "Tutor"}</div>
                      <div style={{ fontSize: "0.8rem", color: "var(--color-text-muted)" }}>{tutor.user.email}</div>
                    </td>
                    <td style={{ padding: "0.75rem" }}>
                      <span style={{ fontWeight: 600, color: tutor.school === "Learnivia Core Team" ? "#0E8345" : "inherit" }}>
                        {tutor.school || "Independent"}
                      </span>
                    </td>
                    <td style={{ padding: "0.75rem" }}>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.25rem" }}>
                        {tutor.subjects.slice(0, 3).map((s) => (
                          <span key={s.id} style={{ background: "var(--color-sky)", color: "var(--color-primary)", padding: "0.15rem 0.4rem", borderRadius: "4px", fontSize: "0.75rem" }}>
                            {s.name}
                          </span>
                        ))}
                        {tutor.subjects.length > 3 && (
                          <span style={{ fontSize: "0.75rem", color: "var(--color-text-muted)" }}>+{tutor.subjects.length - 3}</span>
                        )}
                      </div>
                    </td>
                    <td style={{ padding: "0.75rem" }}>
                      <strong>{realVolunteerHours.toFixed(1)} hrs</strong>
                      <div style={{ fontSize: "0.75rem", color: "var(--color-text-muted)" }}>
                        {completedCount} completed
                      </div>
                      <AdjustHoursButton
                        tutorProfileId={tutor.id}
                        tutorName={tutor.user.name || "Tutor"}
                        currentHours={tutor.volunteerHours || realVolunteerHours}
                      />
                    </td>
                    <td style={{ padding: "0.75rem" }}>
                      <span
                        style={{
                          padding: "0.25rem 0.6rem",
                          borderRadius: "99px",
                          fontSize: "0.75rem",
                          fontWeight: 700,
                          backgroundColor:
                            tutor.status === "APPROVED"
                              ? "var(--color-success-bg)"
                              : tutor.status === "PENDING"
                              ? "var(--color-warning-bg)"
                              : "var(--color-error-bg)",
                          color:
                            tutor.status === "APPROVED"
                              ? "var(--color-success)"
                              : tutor.status === "PENDING"
                              ? "var(--color-warning)"
                              : "var(--color-error)",
                        }}
                      >
                        {tutor.status}
                      </span>
                    </td>
                    <td style={{ padding: "0.75rem" }}>
                      <div>
                        {tutor.user.grade ? (
                          <div style={{ fontWeight: 700, color: "var(--color-navy)" }}>
                            🎓 {tutor.user.grade}
                            {tutor.user.curriculum ? ` (${tutor.user.curriculum})` : ""}
                          </div>
                        ) : tutor.school === "Learnivia Core Team" ? (
                          <div style={{ fontWeight: 700, color: "var(--color-navy)" }}>
                            🛡️ Core Team Educator
                          </div>
                        ) : (
                          <div style={{ fontWeight: 600, color: "var(--color-navy)" }}>
                            🎓 {tutor.school || "Student Tutor"}
                          </div>
                        )}

                        {tutor.academicScores && (
                          <div style={{ fontSize: "0.75rem", color: "#1E3A8A", background: "#EFF6FF", border: "1px solid #DBEAFE", padding: "0.2rem 0.45rem", borderRadius: "4px", marginTop: "0.25rem", fontWeight: 700 }}>
                            📊 Scores: {tutor.academicScores}
                          </div>
                        )}

                        {/* Official Report Card / Academic Transcript */}
                        {tutor.reportCardUrl ? (
                          <div style={{ marginTop: "0.3rem" }}>
                            <a
                              href={tutor.reportCardUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "0.3rem",
                                color: "#065F46",
                                background: "#D1FAE5",
                                border: "1px solid #A7F3D0",
                                padding: "0.25rem 0.55rem",
                                borderRadius: "6px",
                                fontWeight: 700,
                                fontSize: "0.75rem",
                                textDecoration: "none",
                              }}
                            >
                              📄 View Report Card / Transcript ↗
                            </a>
                          </div>
                        ) : (
                          <div style={{ marginTop: "0.25rem" }}>
                            <span style={{ fontSize: "0.7rem", color: "#B45309", background: "#FEF3C7", padding: "0.15rem 0.45rem", borderRadius: "4px", fontWeight: 600 }}>
                              ⚠️ Report Card Pending
                            </span>
                          </div>
                        )}

                        {tutor.gradeLevels.length > 0 && (
                          <div style={{ fontSize: "0.75rem", color: "var(--color-text-muted)", marginTop: "0.25rem" }}>
                            Teaching: {tutor.gradeLevels.map((g) => g.name).join(", ")}
                          </div>
                        )}

                        {tutor.status === "APPROVED" && (
                          <div style={{ marginTop: "0.35rem" }}>
                            <Link
                              href={`/tutor/${tutor.id}/transcript`}
                              target="_blank"
                              style={{
                                color: "var(--color-primary)",
                                fontWeight: 600,
                                textDecoration: "underline",
                                fontSize: "0.75rem",
                              }}
                            >
                              📜 Service Hours Record ({realVolunteerHours.toFixed(1)} hrs)
                            </Link>
                          </div>
                        )}

                        {/* Admin Quick Report Card Attachment */}
                        <details style={{ marginTop: "0.35rem" }}>
                          <summary style={{ fontSize: "0.7rem", color: "var(--color-primary)", cursor: "pointer", fontWeight: 600 }}>
                            ⚙️ Attach / Edit Report Card
                          </summary>
                          <form
                            action={adminUpdateReportCard.bind(null, tutor.id)}
                            style={{
                              marginTop: "0.4rem",
                              display: "flex",
                              flexDirection: "column",
                              gap: "0.3rem",
                              background: "#F8FAFC",
                              padding: "0.5rem",
                              borderRadius: "6px",
                              border: "1px solid var(--color-border)",
                            }}
                          >
                            <input
                              type="text"
                              name="academicScores"
                              defaultValue={tutor.academicScores || ""}
                              placeholder="Academic scores (e.g. CGPA 8.7)"
                              style={{ padding: "0.3rem", fontSize: "0.7rem", borderRadius: "4px", border: "1px solid var(--color-border)" }}
                            />
                            <input
                              type="url"
                              name="reportCardLink"
                              defaultValue={tutor.reportCardUrl?.startsWith("http") ? tutor.reportCardUrl : ""}
                              placeholder="Report Card Link (Drive URL)"
                              style={{ padding: "0.3rem", fontSize: "0.7rem", borderRadius: "4px", border: "1px solid var(--color-border)" }}
                            />
                            <button
                              type="submit"
                              style={{
                                background: "var(--color-navy)",
                                color: "white",
                                border: "none",
                                padding: "0.25rem 0.5rem",
                                borderRadius: "4px",
                                fontSize: "0.7rem",
                                fontWeight: 700,
                                cursor: "pointer",
                                alignSelf: "flex-start",
                              }}
                            >
                              Save
                            </button>
                          </form>
                        </details>
                      </div>
                    </td>
                    <td style={{ padding: "0.75rem" }}>
                      {tutor.status === "APPROVED" && (
                        <form action={suspendTutor.bind(null, tutor.id)}>
                          <button
                            type="submit"
                            style={{
                              background: "none",
                              border: "1px solid var(--color-error)",
                              color: "var(--color-error)",
                              padding: "0.35rem 0.75rem",
                              borderRadius: "6px",
                              fontSize: "0.75rem",
                              cursor: "pointer",
                              fontWeight: 600,
                            }}
                          >
                            Suspend
                          </button>
                        </form>
                      )}

                      {tutor.status === "PENDING" && (
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                          <form action={approveApplication.bind(null, tutor.id)}>
                            <button
                              type="submit"
                              style={{
                                background: "var(--color-teal)",
                                border: "none",
                                color: "white",
                                padding: "0.4rem 0.8rem",
                                borderRadius: "6px",
                                fontSize: "0.75rem",
                                cursor: "pointer",
                                fontWeight: 700,
                                width: "100%",
                              }}
                            >
                              ✓ Approve Tutor
                            </button>
                          </form>
                          <Link
                            href="/admin/applications"
                            style={{
                              display: "inline-block",
                              textAlign: "center",
                              border: "1px solid var(--color-border)",
                              color: "var(--color-navy)",
                              background: "white",
                              padding: "0.25rem 0.5rem",
                              borderRadius: "6px",
                              fontSize: "0.7rem",
                              fontWeight: 600,
                              textDecoration: "none",
                            }}
                          >
                            Review Details
                          </Link>
                        </div>
                      )}

                      {tutor.status === "SUSPENDED" && (
                        <form action={reactivateTutor.bind(null, tutor.id)}>
                          <button
                            type="submit"
                            style={{
                              background: "var(--color-success)",
                              border: "none",
                              color: "white",
                              padding: "0.35rem 0.75rem",
                              borderRadius: "6px",
                              fontSize: "0.75rem",
                              cursor: "pointer",
                              fontWeight: 600,
                            }}
                          >
                            Reactivate
                          </button>
                        </form>
                      )}

                      {tutor.status === "REJECTED" && (
                        <form action={approveApplication.bind(null, tutor.id)}>
                          <button
                            type="submit"
                            style={{
                              background: "var(--color-navy)",
                              border: "none",
                              color: "white",
                              padding: "0.35rem 0.75rem",
                              borderRadius: "6px",
                              fontSize: "0.75rem",
                              cursor: "pointer",
                              fontWeight: 600,
                            }}
                          >
                            Re-evaluate &amp; Approve
                          </button>
                        </form>
                      )}
                    </td>
                  </tr>
              );
            })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
