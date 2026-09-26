"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Clock, History, X } from "lucide-react";

interface AdjustHoursButtonProps {
  tutorProfileId: string;
  tutorName: string;
  currentHours: number;
}

interface AuditRecord {
  id: string;
  adjustedBy: string;
  oldHours: number;
  newHours: number;
  reason: string;
  createdAt: string;
}

export default function AdjustHoursButton({
  tutorProfileId,
  tutorName,
  currentHours,
}: AdjustHoursButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [newHours, setNewHours] = useState(currentHours.toString());
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [audits, setAudits] = useState<AuditRecord[] | null>(null);
  const [loadingAudits, setLoadingAudits] = useState(false);

  const router = useRouter();

  const handleOpen = () => {
    setIsOpen(true);
    setErrorMsg("");
    setSuccessMsg("");
    setNewHours(currentHours.toString());
    setReason("");
    fetchAudits();
  };

  const fetchAudits = async () => {
    setLoadingAudits(true);
    try {
      const res = await fetch(`/api/admin/hours?tutorId=${tutorProfileId}`);
      if (res.ok) {
        const data = await res.json();
        setAudits(data.audits || []);
      }
    } catch (e) {
      console.error("Failed to load audit history:", e);
    } finally {
      setLoadingAudits(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) {
      setErrorMsg("A detailed reason is required for the audit trail.");
      return;
    }

    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const res = await fetch("/api/admin/hours", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tutorProfileId,
          newHours: parseFloat(newHours),
          reason: reason.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        setErrorMsg(data.error || "Failed to adjust hours.");
      } else {
        setSuccessMsg(`Hours updated to ${data.newHours} hrs.`);
        await fetchAudits();
        router.refresh();
      }
    } catch (e: any) {
      setErrorMsg(e.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={handleOpen}
        type="button"
        style={{
          background: "var(--surface-subtle, #F8FAFC)",
          border: "1px solid var(--border, #E2E8F0)",
          color: "#334155",
          padding: "0.25rem 0.55rem",
          borderRadius: "6px",
          fontSize: "0.72rem",
          fontWeight: 700,
          cursor: "pointer",
          marginTop: "0.35rem",
          display: "inline-flex",
          alignItems: "center",
          gap: "0.25rem",
        }}
      >
        <Clock size={13} aria-hidden="true" /> Adjust Hours
      </button>

      {isOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(15, 23, 42, 0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            padding: "1rem",
          }}
        >
          <div
            style={{
              background: "var(--surface-raised, #FFFFFF)",
              borderRadius: "14px",
              padding: "1.5rem",
              maxWidth: "500px",
              width: "100%",
              boxShadow:
                "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
              maxHeight: "90vh",
              overflowY: "auto",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "1rem",
              }}
            >
              <h3
                style={{
                  margin: 0,
                  fontSize: "1.15rem",
                  fontWeight: 800,
                  color: "var(--text-primary, #0C1B33)",
                }}
              >
                Adjust Volunteer Hours
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                style={{
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  color: "var(--text-muted, #94A3B8)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "0.25rem",
                }}
                aria-label="Close"
              >
                <X size={18} aria-hidden="true" />
              </button>
            </div>

            <div
              style={{
                background: "var(--surface-subtle, #F8FAFC)",
                padding: "0.75rem",
                borderRadius: "8px",
                marginBottom: "1rem",
                fontSize: "0.85rem",
              }}
            >
              <div>
                <strong>Tutor:</strong> {tutorName}
              </div>
              <div style={{ marginTop: "0.25rem" }}>
                <strong>Current Recorded Hours:</strong>{" "}
                {currentHours.toFixed(1)} hrs
              </div>
            </div>

            {errorMsg && (
              <div
                style={{
                  background: "var(--error-bg, #FEF2F2)",
                  border: "1px solid #FCA5A5",
                  color: "var(--error, #DC2626)",
                  padding: "0.6rem 0.75rem",
                  borderRadius: "6px",
                  fontSize: "0.8rem",
                  marginBottom: "0.75rem",
                }}
              >
                {errorMsg}
              </div>
            )}

            {successMsg && (
              <div
                style={{
                  background: "var(--success-bg, #ECFDF5)",
                  border: "1px solid #86EFAC",
                  color: "#15803D",
                  padding: "0.6rem 0.75rem",
                  borderRadius: "6px",
                  fontSize: "0.8rem",
                  marginBottom: "0.75rem",
                }}
              >
                {successMsg}
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.85rem",
              }}
            >
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.8rem",
                    fontWeight: 700,
                    color: "#334155",
                    marginBottom: "0.25rem",
                  }}
                >
                  New Volunteer Hours Total *
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="10000"
                  value={newHours}
                  onChange={(e) => setNewHours(e.target.value)}
                  required
                  style={{
                    width: "100%",
                    padding: "0.55rem 0.75rem",
                    borderRadius: "6px",
                    border: "1px solid var(--border, #E2E8F0)",
                    fontSize: "0.9rem",
                  }}
                />
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.8rem",
                    fontWeight: 700,
                    color: "#334155",
                    marginBottom: "0.25rem",
                  }}
                >
                  Reason for Adjustment (Audit Log Required) *
                </label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="e.g. Credit for offline curriculum prep workshop; verified by principal."
                  required
                  rows={2}
                  style={{
                    width: "100%",
                    padding: "0.55rem 0.75rem",
                    borderRadius: "6px",
                    border: "1px solid var(--border, #E2E8F0)",
                    fontSize: "0.85rem",
                    fontFamily: "inherit",
                  }}
                />
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "0.5rem",
                  marginTop: "0.5rem",
                }}
              >
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  style={{
                    background: "transparent",
                    border: "1px solid var(--border, #E2E8F0)",
                    padding: "0.45rem 0.85rem",
                    borderRadius: "6px",
                    fontSize: "0.8rem",
                    fontWeight: 600,
                    color: "var(--text-secondary, #475569)",
                    cursor: "pointer",
                  }}
                >
                  Close
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    background: "#0E8345",
                    color: "#FFFFFF",
                    border: "none",
                    padding: "0.45rem 1rem",
                    borderRadius: "6px",
                    fontSize: "0.8rem",
                    fontWeight: 700,
                    cursor: loading ? "not-allowed" : "pointer",
                    opacity: loading ? 0.7 : 1,
                  }}
                >
                  {loading ? "Saving..." : "Save Adjustment"}
                </button>
              </div>
            </form>

            {/* Audit Trail History */}
            <div
              style={{
                marginTop: "1.5rem",
                borderTop: "1px solid var(--border, #E2E8F0)",
                paddingTop: "1rem",
              }}
            >
              <div
                style={{
                  fontSize: "0.85rem",
                  fontWeight: 700,
                  color: "var(--text-primary, #0C1B33)",
                  marginBottom: "0.5rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.4rem",
                }}
              >
                <History size={14} aria-hidden="true" />
                <span>Audit Trail History</span>
              </div>
              {loadingAudits ? (
                <div style={{ fontSize: "0.75rem", color: "var(--text-secondary, #475569)" }}>
                  Loading audit log...
                </div>
              ) : audits && audits.length > 0 ? (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.5rem",
                  }}
                >
                  {audits.map((a) => (
                    <div
                      key={a.id}
                      style={{
                        background: "var(--surface-subtle, #F8FAFC)",
                        border: "1px solid var(--border, #E2E8F0)",
                        borderRadius: "6px",
                        padding: "0.5rem 0.75rem",
                        fontSize: "0.75rem",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          color: "#334155",
                          fontWeight: 700,
                        }}
                      >
                        <span>
                          {a.oldHours.toFixed(1)} hrs → {a.newHours.toFixed(1)}{" "}
                          hrs
                        </span>
                        <span style={{ color: "var(--text-secondary, #475569)", fontWeight: 400 }}>
                          {new Date(a.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div style={{ color: "var(--text-secondary, #475569)", marginTop: "0.2rem" }}>
                        {a.reason}
                      </div>
                      <div
                        style={{
                          color: "var(--text-muted, #94A3B8)",
                          fontSize: "0.7rem",
                          marginTop: "0.2rem",
                        }}
                      >
                        By: {a.adjustedBy}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ fontSize: "0.75rem", color: "var(--text-muted, #94A3B8)" }}>
                  No manual hour adjustments recorded yet.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
