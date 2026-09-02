import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { updateReportStatus } from "@/app/actions/reports";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin - Safety & Moderation Queue | Learnivia",
};

export default async function AdminReportsPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/");
  }

  const reports = await prisma.incidentReport.findMany({
    include: {
      reporter: true,
      reportedUser: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "1.75rem", fontWeight: 800, color: "var(--color-navy)", marginBottom: "0.5rem" }}>
          🛡️ Safety &amp; Safeguarding Reports ({reports.length})
        </h1>
        <p style={{ color: "var(--color-text-muted)", fontSize: "0.95rem" }}>
          Review incident reports filed by learners, guardians, or volunteer tutors. Investigate and take moderation action.
        </p>
      </div>

      {reports.length === 0 ? (
        <div style={{ background: "white", padding: "3rem", borderRadius: "12px", textAlign: "center", border: "1px solid var(--color-border)" }}>
          <p style={{ color: "var(--color-text-muted)" }}>✓ No safety incidents reported. The platform is clean and safe!</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {reports.map((report) => (
            <div
              key={report.id}
              style={{
                background: "white",
                padding: "1.5rem",
                borderRadius: "12px",
                border: "1px solid var(--color-border)",
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "0.5rem" }}>
                <div>
                  <span
                    style={{
                      background: "var(--color-error-bg)",
                      color: "var(--color-error)",
                      padding: "0.25rem 0.6rem",
                      borderRadius: "99px",
                      fontSize: "0.8rem",
                      fontWeight: 700,
                    }}
                  >
                    {report.category}
                  </span>
                  <span style={{ fontSize: "0.8rem", color: "var(--color-text-muted)", marginLeft: "0.75rem" }}>
                    Filed on {new Date(report.createdAt).toLocaleString()}
                  </span>
                </div>

                <span
                  style={{
                    padding: "0.25rem 0.65rem",
                    borderRadius: "99px",
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    backgroundColor:
                      report.status === "PENDING"
                        ? "var(--color-warning-bg)"
                        : report.status === "RESOLVED"
                        ? "var(--color-success-bg)"
                        : "var(--color-bg)",
                    color:
                      report.status === "PENDING"
                        ? "var(--color-warning)"
                        : report.status === "RESOLVED"
                        ? "var(--color-success)"
                        : "var(--color-text-muted)",
                  }}
                >
                  Status: {report.status}
                </span>
              </div>

              <div style={{ fontSize: "0.875rem", color: "var(--color-navy)" }}>
                <strong>Reporter:</strong> {report.reporter ? `${report.reporter.name} (${report.reporter.email})` : "Anonymous Guest"}
                {report.bookingId && <span> • <strong>Booking ID:</strong> <code>{report.bookingId}</code></span>}
              </div>

              <div style={{ background: "var(--color-bg)", padding: "1rem", borderRadius: "8px", fontSize: "0.9rem", color: "var(--color-text)", lineHeight: 1.5 }}>
                <strong>Description:</strong>
                <p style={{ marginTop: "0.25rem", whiteSpace: "pre-wrap" }}>{report.description}</p>
              </div>

              {report.adminNotes && (
                <div style={{ fontSize: "0.85rem", color: "var(--color-text-muted)", fontStyle: "italic" }}>
                  <strong>Admin Notes:</strong> {report.adminNotes}
                </div>
              )}

              {/* Action form */}
              <form action={updateReportStatus} style={{ borderTop: "1px solid var(--color-border)", paddingTop: "1rem", display: "flex", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
                <input type="hidden" name="reportId" value={report.id} />
                {report.reportedUserId && <input type="hidden" name="suspendTutorId" value={report.reportedUserId} />}

                <input
                  type="text"
                  name="adminNotes"
                  placeholder="Investigation notes..."
                  defaultValue={report.adminNotes || ""}
                  style={{ flex: 1, minWidth: "200px", padding: "0.5rem", borderRadius: "6px", border: "1px solid #ddd", fontSize: "0.85rem" }}
                />

                <select name="status" defaultValue={report.status} style={{ padding: "0.5rem", borderRadius: "6px", border: "1px solid #ddd", fontSize: "0.85rem" }}>
                  <option value="PENDING">PENDING</option>
                  <option value="REVIEWED">REVIEWED</option>
                  <option value="RESOLVED">RESOLVED</option>
                  <option value="DISMISSED">DISMISSED</option>
                </select>

                <button
                  type="submit"
                  style={{
                    backgroundColor: "var(--color-navy)",
                    color: "white",
                    padding: "0.5rem 1rem",
                    borderRadius: "6px",
                    border: "none",
                    fontWeight: 600,
                    fontSize: "0.85rem",
                    cursor: "pointer",
                  }}
                >
                  Update Report
                </button>
              </form>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
