import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin - All Sessions & Workshops | Learnivia",
};

export default async function AdminSessionsPage() {
  const session = await auth();
  // @ts-ignore
  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/");
  }

  const [bookings, workshops] = await Promise.all([
    prisma.booking.findMany({
      include: {
        tutor: { include: { user: true } },
        student: true,
      },
      orderBy: { startTime: "desc" },
    }),
    prisma.workshop.findMany({
      include: {
        tutor: { include: { user: true } },
        enrollments: { include: { student: true } },
      },
      orderBy: { startTime: "desc" },
    }),
  ]);

  return (
    <div>
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "1.75rem", fontWeight: 800, color: "var(--color-navy)", marginBottom: "0.5rem" }}>
          Platform Tutoring Sessions &amp; Workshops
        </h1>
        <p style={{ color: "var(--color-text-muted)", fontSize: "0.95rem" }}>
          Real-time oversight of all scheduled 1-on-1 tutoring sessions and live group bootcamps.
        </p>
      </div>

      {/* 1-on-1 Sessions Table */}
      <div style={{ background: "white", borderRadius: "12px", border: "1px solid var(--color-border)", padding: "1.5rem", marginBottom: "2.5rem" }}>
        <h2 style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--color-navy)", marginBottom: "1rem" }}>
          1-on-1 Tutoring Bookings ({bookings.length})
        </h2>

        {bookings.length === 0 ? (
          <p style={{ color: "var(--color-text-muted)", fontStyle: "italic" }}>No bookings recorded yet.</p>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.875rem" }}>
              <thead>
                <tr style={{ borderBottom: "2px solid var(--color-border)", textAlign: "left" }}>
                  <th style={{ padding: "0.75rem" }}>Date &amp; Time</th>
                  <th style={{ padding: "0.75rem" }}>Subject</th>
                  <th style={{ padding: "0.75rem" }}>Tutor</th>
                  <th style={{ padding: "0.75rem" }}>Learner</th>
                  <th style={{ padding: "0.75rem" }}>Status</th>
                  <th style={{ padding: "0.75rem" }}>Meeting</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => (
                  <tr key={b.id} style={{ borderBottom: "1px solid var(--color-border)" }}>
                    <td style={{ padding: "0.75rem", whiteSpace: "nowrap" }}>
                      {new Date(b.startTime).toLocaleDateString()} {new Date(b.startTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </td>
                    <td style={{ padding: "0.75rem", fontWeight: 600 }}>{b.subject}</td>
                    <td style={{ padding: "0.75rem" }}>
                      <Link href={`/tutor/${b.tutorId}`} style={{ color: "var(--color-primary)", fontWeight: 600 }}>
                        {b.tutor.user.name || "Tutor"}
                      </Link>
                    </td>
                    <td style={{ padding: "0.75rem" }}>{b.student.name || b.student.email}</td>
                    <td style={{ padding: "0.75rem" }}>
                      <span
                        style={{
                          padding: "0.25rem 0.6rem",
                          borderRadius: "99px",
                          fontSize: "0.75rem",
                          fontWeight: 700,
                          backgroundColor:
                            b.status === "COMPLETED"
                              ? "var(--color-success-bg)"
                              : b.status === "CONFIRMED"
                              ? "var(--color-info-bg)"
                              : "var(--color-error-bg)",
                          color:
                            b.status === "COMPLETED"
                              ? "var(--color-success)"
                              : b.status === "CONFIRMED"
                              ? "var(--color-primary)"
                              : "var(--color-error)",
                        }}
                      >
                        {b.status}
                      </span>
                    </td>
                    <td style={{ padding: "0.75rem" }}>
                      {b.zoomLink ? (
                        <a href={b.zoomLink} target="_blank" rel="noopener noreferrer" style={{ color: "var(--color-primary)", textDecoration: "underline" }}>
                          Open Zoom
                        </a>
                      ) : (
                        "—"
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Group Workshops Table */}
      <div style={{ background: "white", borderRadius: "12px", border: "1px solid var(--color-border)", padding: "1.5rem" }}>
        <h2 style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--color-navy)", marginBottom: "1rem" }}>
          Group Workshops &amp; Study Rooms ({workshops.length})
        </h2>

        {workshops.length === 0 ? (
          <p style={{ color: "var(--color-text-muted)", fontStyle: "italic" }}>No workshops created yet.</p>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.875rem" }}>
              <thead>
                <tr style={{ borderBottom: "2px solid var(--color-border)", textAlign: "left" }}>
                  <th style={{ padding: "0.75rem" }}>Date &amp; Time</th>
                  <th style={{ padding: "0.75rem" }}>Workshop Title</th>
                  <th style={{ padding: "0.75rem" }}>Host Tutor</th>
                  <th style={{ padding: "0.75rem" }}>Enrolled / Capacity</th>
                  <th style={{ padding: "0.75rem" }}>Status</th>
                  <th style={{ padding: "0.75rem" }}>Meeting</th>
                </tr>
              </thead>
              <tbody>
                {workshops.map((w) => (
                  <tr key={w.id} style={{ borderBottom: "1px solid var(--color-border)" }}>
                    <td style={{ padding: "0.75rem", whiteSpace: "nowrap" }}>
                      {new Date(w.startTime).toLocaleDateString()} {new Date(w.startTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </td>
                    <td style={{ padding: "0.75rem", fontWeight: 600 }}>{w.title}</td>
                    <td style={{ padding: "0.75rem" }}>
                      <Link href={`/tutor/${w.tutorId}`} style={{ color: "var(--color-primary)", fontWeight: 600 }}>
                        {w.tutor.user.name || "Tutor"}
                      </Link>
                    </td>
                    <td style={{ padding: "0.75rem" }}>
                      {w.enrollments.length} / {w.maxCapacity} seats
                    </td>
                    <td style={{ padding: "0.75rem" }}>
                      <span
                        style={{
                          padding: "0.25rem 0.6rem",
                          borderRadius: "99px",
                          fontSize: "0.75rem",
                          fontWeight: 700,
                          backgroundColor:
                            w.status === "COMPLETED"
                              ? "var(--color-success-bg)"
                              : w.status === "UPCOMING"
                              ? "var(--color-info-bg)"
                              : "var(--color-error-bg)",
                          color:
                            w.status === "COMPLETED"
                              ? "var(--color-success)"
                              : w.status === "UPCOMING"
                              ? "var(--color-primary)"
                              : "var(--color-error)",
                        }}
                      >
                        {w.status}
                      </span>
                    </td>
                    <td style={{ padding: "0.75rem" }}>
                      {w.zoomLink ? (
                        <a href={w.zoomLink} target="_blank" rel="noopener noreferrer" style={{ color: "var(--color-primary)", textDecoration: "underline" }}>
                          Open Zoom
                        </a>
                      ) : (
                        "—"
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
