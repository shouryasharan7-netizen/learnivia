"use client";

import { useState } from "react";
import { Clock, RefreshCw, CheckCircle2, AlertTriangle } from "lucide-react";

export default function RunAvailabilityAuditButton() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    total?: number;
    suspended?: number;
    reminders?: number;
    message?: string;
  } | null>(null);

  const handleRunAudit = async () => {
    if (loading) return;
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/cron/tutor-availability", {
        method: "POST",
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setResult({
          success: true,
          total: data.summary.totalInactiveWithNoSlots,
          suspended: data.summary.suspendedCount,
          reminders: data.summary.remindersSentCount,
          message: `Audit complete: ${data.summary.totalInactiveWithNoSlots} missing slots & ${data.summary.totalIncompleteTraining} incomplete training evaluated. ${data.summary.suspendedForMissingAvailability} suspended (>3 days no slots), ${data.summary.suspendedForIncompleteTraining} suspended (>15 days incomplete training). ${data.summary.remindersSentCount} reminders sent.`,
        });
      } else {
        setResult({
          success: false,
          message: data.error || "Failed to execute availability audit.",
        });
      }
    } catch (err: any) {
      setResult({
        success: false,
        message: err.message || "Network error running availability audit.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
        <button
          onClick={handleRunAudit}
          disabled={loading}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            padding: "0.55rem 1rem",
            borderRadius: "8px",
            background: "var(--wa-forest, #2563EB)",
            color: "#FFFFFF",
            border: "none",
            fontWeight: 600,
            fontSize: "0.85rem",
            cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.7 : 1,
            transition: "all 0.15s ease",
            boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
          }}
        >
          {loading ? (
            <RefreshCw size={15} style={{ animation: "spin 1s linear infinite" }} />
          ) : (
            <Clock size={15} />
          )}
          <span>{loading ? "Auditing Compliance..." : "Run Compliance & Inactivity Audit"}</span>
        </button>

        <span style={{ fontSize: "0.8rem", color: "var(--color-text-muted)" }}>
          Automatically enforces 3-day availability removal &amp; 15-day incomplete training removal.
        </span>
      </div>

      {result && (
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            padding: "0.6rem 0.9rem",
            borderRadius: "6px",
            fontSize: "0.82rem",
            fontWeight: 500,
            backgroundColor: result.success ? "#ECFDF5" : "#FEF2F2",
            border: `1px solid ${result.success ? "#A7F3D0" : "#FECACA"}`,
            color: result.success ? "#065F46" : "#991B1B",
            maxWidth: "fit-content",
          }}
        >
          {result.success ? <CheckCircle2 size={16} /> : <AlertTriangle size={16} />}
          <span>{result.message}</span>
        </div>
      )}

      <style jsx>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
