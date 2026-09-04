import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth-user";
import { redirect } from "next/navigation";
import Link from "next/link";
import { suspendTutor, reactivateTutor } from "../actions";
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
      tutorBookings: {
        where: { status: "COMPLETED" },
      },
      reviews: true,
    },
    orderBy: { volunteerHours: "desc" },
  });

  return (
    <div>
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "1.75rem", fontWeight: 800, color: "var(--color-navy)", marginBottom: "0.5rem" }}>
          Tutor Directory &amp; Transcripts
        </h1>
        <p style={{ color: "var(--color-text-muted)", fontSize: "0.95rem" }}>
          Manage all approved and registered volunteer tutors, audit service hours, and view certified transcripts.
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
                <th style={{ padding: "0.75rem" }}>Service Hours</th>
                <th style={{ padding: "0.75rem" }}>Status</th>
                <th style={{ padding: "0.75rem" }}>Transcript</th>
                <th style={{ padding: "0.75rem" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {tutors.map((tutor) => (
                <tr key={tutor.id} style={{ borderBottom: "1px solid var(--color-border)" }}>
                  <td style={{ padding: "0.75rem" }}>
                    <div style={{ fontWeight: 700, color: "var(--color-navy)" }}>{tutor.user.name || "Tutor"}</div>
                    <div style={{ fontSize: "0.8rem", color: "var(--color-text-muted)" }}>{tutor.user.email}</div>
                  </td>
                  <td style={{ padding: "0.75rem" }}>{tutor.school || "Independent"}</td>
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
                    <strong>{tutor.volunteerHours.toFixed(1)} hrs</strong>
                    <div style={{ fontSize: "0.75rem", color: "var(--color-text-muted)" }}>{tutor.tutorBookings.length} completed</div>
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
                    <Link
                      href={`/tutor/${tutor.id}/transcript`}
                      target="_blank"
                      style={{ color: "var(--color-primary)", fontWeight: 600, textDecoration: "underline" }}
                    >
                      📜 View Transcript
                    </Link>
                  </td>
                  <td style={{ padding: "0.75rem" }}>
                    {tutor.status === "APPROVED" ? (
                      <form action={suspendTutor.bind(null, tutor.id)}>
                        <button
                          type="submit"
                          style={{
                            background: "none",
                            border: "1px solid var(--color-error)",
                            color: "var(--color-error)",
                            padding: "0.3rem 0.6rem",
                            borderRadius: "4px",
                            fontSize: "0.75rem",
                            cursor: "pointer",
                            fontWeight: 600,
                          }}
                        >
                          Suspend
                        </button>
                      </form>
                    ) : (
                      <form action={reactivateTutor.bind(null, tutor.id)}>
                        <button
                          type="submit"
                          style={{
                            background: "var(--color-success)",
                            border: "none",
                            color: "white",
                            padding: "0.3rem 0.6rem",
                            borderRadius: "4px",
                            fontSize: "0.75rem",
                            cursor: "pointer",
                            fontWeight: 600,
                          }}
                        >
                          Reactivate
                        </button>
                      </form>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
