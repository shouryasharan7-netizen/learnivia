"use client";

import { useState } from "react";
import Link from "next/link";
import { adminUpdateBookingStatus, adminCancelWorkshop } from "../actions";
import { getMeetingUrls } from "@/lib/meetingUrl";
import { CheckCircle2, XCircle, Video, Trash2 } from "lucide-react";

interface BookingItem {
  id: string;
  subject: string;
  startTime: string;
  endTime: string;
  status: string;
  studentAttended?: boolean;
  hoursCredited?: boolean;
  zoomLink: string | null;
  tutor: { id: string; user: { name: string | null; email: string | null } };
  student: { id: string; name: string | null; email: string | null };
}

interface WorkshopItem {
  id: string;
  title: string;
  startTime: string;
  durationMinutes: number;
  capacity: number;
  zoomLink: string | null;
  tutor: { id: string; user: { name: string | null; email: string | null } };
  enrollmentCount: number;
}

interface Props {
  initialBookings: BookingItem[];
  initialWorkshops: WorkshopItem[];
}

export default function AdminSessionsClient({ initialBookings, initialWorkshops }: Props) {
  const [bookings, setBookings] = useState<BookingItem[]>(initialBookings);
  const [workshops, setWorkshops] = useState<WorkshopItem[]>(initialWorkshops);
  const [isUpdating, setIsUpdating] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState("");

  function showToast(msg: string) {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 3500);
  }

  async function handleBookingStatus(bookingId: string, newStatus: "CONFIRMED" | "COMPLETED" | "CANCELED") {
    if (!confirm(`Change session status to ${newStatus}?`)) return;

    setIsUpdating(bookingId);
    try {
      await adminUpdateBookingStatus(bookingId, newStatus);
      setBookings((prev) =>
        prev.map((b) => (b.id === bookingId ? { ...b, status: newStatus } : b))
      );
      showToast(`Session status updated to ${newStatus}.`);
    } catch (err: any) {
      alert(err?.message || "Failed to update booking status.");
    } finally {
      setIsUpdating(null);
    }
  }

  async function handleDeleteWorkshop(workshopId: string, title: string) {
    if (!confirm(`Permanently cancel and delete workshop "${title}"?`)) return;

    setIsUpdating(workshopId);
    try {
      await adminCancelWorkshop(workshopId);
      setWorkshops((prev) => prev.filter((w) => w.id !== workshopId));
      showToast("Workshop removed from platform.");
    } catch (err: any) {
      alert(err?.message || "Failed to remove workshop.");
    } finally {
      setIsUpdating(null);
    }
  }

  return (
    <div>
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "1.75rem", fontWeight: 800, color: "#0F172A", marginBottom: "0.5rem" }}>
          Platform Tutoring Sessions &amp; Workshops
        </h1>
        <p style={{ color: "#64748B", fontSize: "0.95rem", margin: 0 }}>
          Master control over all scheduled 1-on-1 tutoring sessions and live group study circles.
        </p>
      </div>

      {toastMsg && (
        <div
          style={{
            background: "#ECFDF5",
            border: "1px solid #A7F3D0",
            color: "#065F46",
            padding: "0.75rem 1.25rem",
            borderRadius: "10px",
            marginBottom: "1.5rem",
            fontWeight: 600,
            fontSize: "0.875rem",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          <CheckCircle2 size={16} aria-hidden="true" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* 1-on-1 Sessions Table */}
      <div style={{ background: "#FFFFFF", borderRadius: "14px", border: "1px solid #E2E8F0", padding: "1.5rem", marginBottom: "2.5rem" }}>
        <h2 style={{ fontSize: "1.25rem", fontWeight: 700, color: "#0F172A", marginBottom: "1rem" }}>
          1-on-1 Tutoring Bookings ({bookings.length})
        </h2>

        {bookings.length === 0 ? (
          <p style={{ color: "#64748B", fontStyle: "italic" }}>No bookings recorded yet.</p>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.875rem" }}>
              <thead>
                <tr style={{ background: "#F8FAFC", borderBottom: "1px solid #E2E8F0", textAlign: "left" }}>
                  <th style={{ padding: "0.75rem" }}>Date &amp; Time</th>
                  <th style={{ padding: "0.75rem" }}>Subject</th>
                  <th style={{ padding: "0.75rem" }}>Tutor</th>
                  <th style={{ padding: "0.75rem" }}>Learner</th>
                  <th style={{ padding: "0.75rem" }}>Status</th>
                  <th style={{ padding: "0.75rem" }}>Meeting</th>
                  <th style={{ padding: "0.75rem", textAlign: "right" }}>Admin Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => {
                  const { joinUrl } = getMeetingUrls(b.zoomLink);
                  const isBusy = isUpdating === b.id;

                  return (
                    <tr key={b.id} style={{ borderBottom: "1px solid #F1F5F9" }}>
                      <td style={{ padding: "0.75rem", whiteSpace: "nowrap" }}>
                        {new Date(b.startTime).toLocaleDateString()} {new Date(b.startTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </td>
                      <td style={{ padding: "0.75rem", fontWeight: 600 }}>{b.subject}</td>
                      <td style={{ padding: "0.75rem" }}>
                        <Link href={`/tutor/${b.tutor.id}`} style={{ color: "#0E8345", fontWeight: 600, textDecoration: "none" }}>
                          {b.tutor.user.name || "Tutor"}
                        </Link>
                      </td>
                      <td style={{ padding: "0.75rem" }}>{b.student.name || b.student.email}</td>
                      <td style={{ padding: "0.75rem" }}>
                        <span
                          style={{
                            display: "inline-block",
                            padding: "0.2rem 0.5rem",
                            borderRadius: "999px",
                            fontSize: "0.75rem",
                            fontWeight: 700,
                            backgroundColor:
                              b.status === "COMPLETED"
                                ? b.hoursCredited
                                  ? "#D1FAE5"
                                  : "#FEF3C7"
                                : b.status === "CONFIRMED"
                                ? "#B5D9C5"
                                : "#FEE2E2",
                            color:
                              b.status === "COMPLETED"
                                ? b.hoursCredited
                                  ? "#065F46"
                                  : "#92400E"
                                : b.status === "CONFIRMED"
                                ? "#1E40AF"
                                : "#991B1B",
                          }}
                        >
                          {b.status === "COMPLETED"
                            ? b.hoursCredited
                              ? "Completed (Verified)"
                              : "Completed (Pending Attendance)"
                            : b.status}
                        </span>
                      </td>
                      <td style={{ padding: "0.75rem" }}>
                        {joinUrl ? (
                          <a
                            href={joinUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ color: "#2563EB", fontWeight: 600, textDecoration: "underline" }}
                          >
                            Open Zoom
                          </a>
                        ) : (
                          "—"
                        )}
                      </td>
                      <td style={{ padding: "0.75rem", textAlign: "right" }}>
                        <div style={{ display: "inline-flex", gap: "0.35rem" }}>
                          {b.status !== "COMPLETED" && (
                            <button
                              type="button"
                              disabled={isBusy}
                              onClick={() => handleBookingStatus(b.id, "COMPLETED")}
                              style={{
                                background: "#ECFDF5",
                                color: "#065F46",
                                border: "1px solid #A7F3D0",
                                padding: "0.25rem 0.5rem",
                                borderRadius: "6px",
                                fontSize: "0.75rem",
                                fontWeight: 700,
                                cursor: "pointer",
                              }}
                              title="Mark session completed and credit tutor hours"
                            >
                              Complete
                            </button>
                          )}
                          {b.status === "COMPLETED" && !b.hoursCredited && (
                            <button
                              type="button"
                              disabled={isBusy}
                              onClick={() => handleBookingStatus(b.id, "COMPLETED")}
                              style={{
                                background: "#EFF6FF",
                                color: "#1E40AF",
                                border: "1px solid #BFDBFE",
                                padding: "0.25rem 0.5rem",
                                borderRadius: "6px",
                                fontSize: "0.75rem",
                                fontWeight: 700,
                                cursor: "pointer",
                              }}
                              title="Verify student attendance and credit tutor volunteer hours"
                            >
                              Verify &amp; Credit Hours
                            </button>
                          )}
                          {b.status !== "CANCELED" && (
                            <button
                              type="button"
                              disabled={isBusy}
                              onClick={() => handleBookingStatus(b.id, "CANCELED")}
                              style={{
                                background: "#FEF2F2",
                                color: "#991B1B",
                                border: "1px solid #FECACA",
                                padding: "0.25rem 0.5rem",
                                borderRadius: "6px",
                                fontSize: "0.75rem",
                                fontWeight: 700,
                                cursor: "pointer",
                              }}
                              title="Cancel session"
                            >
                              Cancel
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Group Workshops Table */}
      <div style={{ background: "#FFFFFF", borderRadius: "14px", border: "1px solid #E2E8F0", padding: "1.5rem" }}>
        <h2 style={{ fontSize: "1.25rem", fontWeight: 700, color: "#0F172A", marginBottom: "1rem" }}>
          Group Workshops &amp; Study Circles ({workshops.length})
        </h2>

        {workshops.length === 0 ? (
          <p style={{ color: "#64748B", fontStyle: "italic" }}>No workshops created yet.</p>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.875rem" }}>
              <thead>
                <tr style={{ background: "#F8FAFC", borderBottom: "1px solid #E2E8F0", textAlign: "left" }}>
                  <th style={{ padding: "0.75rem" }}>Date &amp; Time</th>
                  <th style={{ padding: "0.75rem" }}>Workshop Title</th>
                  <th style={{ padding: "0.75rem" }}>Host Tutor</th>
                  <th style={{ padding: "0.75rem" }}>Enrolled / Capacity</th>
                  <th style={{ padding: "0.75rem" }}>Meeting</th>
                  <th style={{ padding: "0.75rem", textAlign: "right" }}>Admin Actions</th>
                </tr>
              </thead>
              <tbody>
                {workshops.map((w) => {
                  const { joinUrl, hostUrl } = getMeetingUrls(w.zoomLink);
                  const activeUrl = hostUrl || joinUrl;
                  const isBusy = isUpdating === w.id;

                  return (
                    <tr key={w.id} style={{ borderBottom: "1px solid #F1F5F9" }}>
                      <td style={{ padding: "0.75rem", whiteSpace: "nowrap" }}>
                        {new Date(w.startTime).toLocaleDateString()} {new Date(w.startTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        <div style={{ fontSize: "0.75rem", color: "#64748B" }}>{w.durationMinutes} mins</div>
                      </td>
                      <td style={{ padding: "0.75rem", fontWeight: 600 }}>{w.title}</td>
                      <td style={{ padding: "0.75rem" }}>
                        <Link href={`/tutor/${w.tutor.id}`} style={{ color: "#0E8345", fontWeight: 600, textDecoration: "none" }}>
                          {w.tutor.user.name || "Tutor"}
                        </Link>
                      </td>
                      <td style={{ padding: "0.75rem" }}>
                        <strong>{w.enrollmentCount}</strong> / {w.capacity} seats
                      </td>
                      <td style={{ padding: "0.75rem" }}>
                        {activeUrl ? (
                          <a
                            href={activeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ color: "var(--wa-forest)", fontWeight: 600, textDecoration: "underline", display: "inline-flex", alignItems: "center", gap: "0.3rem" }}
                          >
                            <Video size={13} aria-hidden="true" />
                            <span>Open Zoom</span>
                          </a>
                        ) : (
                          "—"
                        )}
                      </td>
                      <td style={{ padding: "0.75rem", textAlign: "right" }}>
                        <button
                          type="button"
                          disabled={isBusy}
                          onClick={() => handleDeleteWorkshop(w.id, w.title)}
                          style={{
                            background: "#FEE2E2",
                            color: "#991B1B",
                            border: "1px solid #FECACA",
                            padding: "0.25rem 0.55rem",
                            borderRadius: "6px",
                            fontSize: "0.75rem",
                            fontWeight: 600,
                            cursor: "pointer",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "0.3rem",
                          }}
                          title="Cancel and remove this workshop"
                        >
                          <Trash2 size={13} aria-hidden="true" />
                          <span>Delete</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
