"use client";

import React, { useState } from "react";
import {
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  FileCheck,
  ChevronDown,
  ChevronUp,
  Brain,
  ShieldCheck,
  Award,
} from "lucide-react";
import type { CredentialAuditResult } from "@/lib/ai-credential-verifier";
import { approveApplication, rejectApplication } from "@/app/admin/actions";

interface Props {
  tutorId: string;
  applicantName: string;
  hasDocument: boolean;
  academicScores?: string | null;
  onStatusUpdated?: () => void;
}

export function AICredentialAuditor({
  tutorId,
  applicantName,
  hasDocument,
  academicScores,
  onStatusUpdated,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CredentialAuditResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const runAudit = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/audit-credentials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tutorId }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to audit credentials");
      }
      setResult(data.audit);
      setIsOpen(true);
    } catch (err: any) {
      setError(err?.message || "Audit failed");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    if (!confirm(`Confirm AI-assisted approval for ${applicantName}?`)) return;
    setActionLoading(true);
    try {
      const fd = new FormData();
      fd.append("reason", `AI Credential Audit Approved (Score: ${result?.validityScore || 0}/100)`);
      await approveApplication(tutorId, fd);
      if (onStatusUpdated) onStatusUpdated();
      window.location.reload();
    } catch (err) {
      alert("Failed to approve application");
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    const reason = prompt("Enter rejection reason for applicant:", "Academic requirements or verification criteria not met.");
    if (!reason) return;
    setActionLoading(true);
    try {
      const fd = new FormData();
      fd.append("reason", reason);
      await rejectApplication(tutorId, fd);
      if (onStatusUpdated) onStatusUpdated();
      window.location.reload();
    } catch (err) {
      alert("Failed to reject application");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div
      style={{
        marginTop: "0.75rem",
        padding: "0.85rem 1rem",
        background: "linear-gradient(135deg, rgba(30, 58, 138, 0.04) 0%, rgba(13, 148, 136, 0.05) 100%)",
        border: "1px solid var(--wa-border)",
        borderRadius: "8px",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "0.75rem",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <div
            style={{
              width: "28px",
              height: "28px",
              borderRadius: "6px",
              background: "var(--primary-light, #E6F4F1)",
              color: "var(--primary, #0D9488)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Brain size={16} />
          </div>
          <div>
            <div style={{ fontSize: "0.875rem", fontWeight: 700, color: "var(--wa-ink)" }}>
              AI Credential &amp; Report Card Auditor
            </div>
            <div style={{ fontSize: "0.75rem", color: "var(--wa-muted)" }}>
              Analyzes marksheets, GPA, AP/IB records &amp; validity for tutoring
            </div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          {!result ? (
            <button
              onClick={runAudit}
              disabled={loading}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.4rem",
                background: "var(--primary, #0D9488)",
                color: "#fff",
                border: "none",
                padding: "0.45rem 0.9rem",
                borderRadius: "6px",
                fontSize: "0.8125rem",
                fontWeight: 600,
                cursor: loading ? "wait" : "pointer",
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              }}
            >
              <Sparkles size={14} className={loading ? "animate-spin" : ""} />
              <span>{loading ? "Analyzing Marksheet..." : "Run AI Audit"}</span>
            </button>
          ) : (
            <button
              onClick={() => setIsOpen(!isOpen)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.3rem",
                background: "var(--wa-white, #fff)",
                border: "1px solid var(--wa-border)",
                color: "var(--wa-ink)",
                padding: "0.4rem 0.75rem",
                borderRadius: "6px",
                fontSize: "0.8125rem",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              <span>{isOpen ? "Hide Report" : "View AI Audit"}</span>
              {isOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
          )}
        </div>
      </div>

      {error && (
        <div
          style={{
            marginTop: "0.5rem",
            fontSize: "0.8rem",
            color: "var(--wa-crimson, #b91c1c)",
            display: "flex",
            alignItems: "center",
            gap: "0.3rem",
          }}
        >
          <AlertTriangle size={14} />
          <span>{error}</span>
        </div>
      )}

      {result && isOpen && (
        <div
          style={{
            marginTop: "1rem",
            paddingTop: "1rem",
            borderTop: "1px solid var(--wa-border)",
          }}
        >
          {/* Verdict Banner */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0.75rem 1rem",
              borderRadius: "6px",
              background:
                result.recommendation === "APPROVE"
                  ? "rgba(16, 185, 129, 0.1)"
                  : result.recommendation === "REVIEW"
                    ? "rgba(245, 158, 11, 0.1)"
                    : "rgba(239, 68, 68, 0.1)",
              border: `1px solid ${
                result.recommendation === "APPROVE"
                  ? "rgba(16, 185, 129, 0.3)"
                  : result.recommendation === "REVIEW"
                    ? "rgba(245, 158, 11, 0.3)"
                    : "rgba(239, 68, 68, 0.3)"
              }`,
              marginBottom: "0.75rem",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              {result.recommendation === "APPROVE" ? (
                <CheckCircle2 size={18} color="#059669" />
              ) : result.recommendation === "REVIEW" ? (
                <AlertTriangle size={18} color="#D97706" />
              ) : (
                <XCircle size={18} color="#DC2626" />
              )}
              <div>
                <span
                  style={{
                    fontWeight: 700,
                    fontSize: "0.875rem",
                    color:
                      result.recommendation === "APPROVE"
                        ? "#065F46"
                        : result.recommendation === "REVIEW"
                          ? "#92400E"
                          : "#991B1B",
                  }}
                >
                  {result.recommendation === "APPROVE"
                    ? "AI RECOMMENDATION: APPROVE APPLICANT"
                    : result.recommendation === "REVIEW"
                      ? "AI RECOMMENDATION: MANUAL VERIFICATION RECOMMENDED"
                      : "AI RECOMMENDATION: APPLICATION NOT RECOMMENDED"}
                </span>
                <p
                  style={{
                    margin: "0.2rem 0 0",
                    fontSize: "0.8125rem",
                    color: "var(--wa-text)",
                  }}
                >
                  {result.summary}
                </p>
              </div>
            </div>

            <div style={{ textAlign: "right", flexShrink: 0 }}>
              <div
                style={{
                  fontSize: "1.2rem",
                  fontWeight: 800,
                  color:
                    result.recommendation === "APPROVE"
                      ? "#059669"
                      : result.recommendation === "REVIEW"
                        ? "#D97706"
                        : "#DC2626",
                }}
              >
                {result.validityScore}/100
              </div>
              <div style={{ fontSize: "0.7rem", color: "var(--wa-muted)", textTransform: "uppercase" }}>
                Score ({result.confidence}% conf.)
              </div>
            </div>
          </div>

          {/* Extracted Academic Credentials */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: "0.5rem",
              marginBottom: "0.75rem",
            }}
          >
            {result.extractedScores.gpa && (
              <div
                style={{
                  background: "#fff",
                  border: "1px solid var(--wa-border)",
                  borderRadius: "6px",
                  padding: "0.5rem 0.75rem",
                }}
              >
                <div style={{ fontSize: "0.7rem", color: "var(--wa-muted)", textTransform: "uppercase", fontWeight: 700 }}>
                  Detected GPA / Standing
                </div>
                <div style={{ fontSize: "0.95rem", fontWeight: 700, color: "var(--wa-forest)" }}>
                  {result.extractedScores.gpa}
                </div>
              </div>
            )}

            {result.extractedScores.standardizedTests && result.extractedScores.standardizedTests.length > 0 && (
              <div
                style={{
                  background: "#fff",
                  border: "1px solid var(--wa-border)",
                  borderRadius: "6px",
                  padding: "0.5rem 0.75rem",
                }}
              >
                <div style={{ fontSize: "0.7rem", color: "var(--wa-muted)", textTransform: "uppercase", fontWeight: 700 }}>
                  Exam Scores
                </div>
                <div style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--wa-ink)" }}>
                  {result.extractedScores.standardizedTests.join(", ")}
                </div>
              </div>
            )}

            {result.extractedScores.apIbCourses && result.extractedScores.apIbCourses.length > 0 && (
              <div
                style={{
                  background: "#fff",
                  border: "1px solid var(--wa-border)",
                  borderRadius: "6px",
                  padding: "0.5rem 0.75rem",
                }}
              >
                <div style={{ fontSize: "0.7rem", color: "var(--wa-muted)", textTransform: "uppercase", fontWeight: 700 }}>
                  AP / IB Coursework
                </div>
                <div style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--wa-ink)" }}>
                  {result.extractedScores.apIbCourses.join(", ")}
                </div>
              </div>
            )}
          </div>

          {/* 5-Check Audit Matrix */}
          <div
            style={{
              background: "#fff",
              border: "1px solid var(--wa-border)",
              borderRadius: "6px",
              padding: "0.75rem",
              marginBottom: "0.75rem",
            }}
          >
            <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--wa-ink)", marginBottom: "0.5rem" }}>
              Automated Safeguarding &amp; Academic Checks:
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
              {result.checks.map((chk) => (
                <div
                  key={chk.id}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "0.5rem",
                    fontSize: "0.8rem",
                  }}
                >
                  {chk.passed ? (
                    <CheckCircle2 size={15} color="#059669" style={{ flexShrink: 0, marginTop: "2px" }} />
                  ) : (
                    <AlertTriangle size={15} color="#D97706" style={{ flexShrink: 0, marginTop: "2px" }} />
                  )}
                  <div>
                    <span style={{ fontWeight: 600, color: chk.passed ? "var(--wa-ink)" : "#92400E" }}>
                      {chk.name}:{" "}
                    </span>
                    <span style={{ color: "var(--wa-text)" }}>{chk.details}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Strengths & Red Flags */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "0.5rem",
              marginBottom: "0.75rem",
            }}
          >
            <div
              style={{
                background: "#F0FDF4",
                border: "1px solid #BBF7D0",
                borderRadius: "6px",
                padding: "0.6rem 0.75rem",
                fontSize: "0.78rem",
              }}
            >
              <div style={{ fontWeight: 700, color: "#166534", marginBottom: "0.25rem" }}>Key Strengths:</div>
              <ul style={{ margin: 0, paddingLeft: "1.1rem", color: "#15803D" }}>
                {result.strengths.map((s, idx) => (
                  <li key={idx}>{s}</li>
                ))}
              </ul>
            </div>

            <div
              style={{
                background: result.flags.length > 0 ? "#FFFBEB" : "#F8FAFC",
                border: `1px solid ${result.flags.length > 0 ? "#FDE68A" : "#E2E8F0"}`,
                borderRadius: "6px",
                padding: "0.6rem 0.75rem",
                fontSize: "0.78rem",
              }}
            >
              <div style={{ fontWeight: 700, color: result.flags.length > 0 ? "#92400E" : "#475569", marginBottom: "0.25rem" }}>
                Review Flags:
              </div>
              {result.flags.length > 0 ? (
                <ul style={{ margin: 0, paddingLeft: "1.1rem", color: "#B45309" }}>
                  {result.flags.map((f, idx) => (
                    <li key={idx}>{f}</li>
                  ))}
                </ul>
              ) : (
                <span style={{ color: "#64748B" }}>No flags detected. All criteria satisfied.</span>
              )}
            </div>
          </div>

          {/* Action Row */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              gap: "0.5rem",
              paddingTop: "0.5rem",
            }}
          >
            <button
              onClick={handleReject}
              disabled={actionLoading}
              style={{
                background: "transparent",
                border: "1px solid var(--wa-border)",
                color: "var(--wa-crimson, #b91c1c)",
                padding: "0.45rem 0.85rem",
                borderRadius: "6px",
                fontSize: "0.8rem",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Reject / Request Details
            </button>
            <button
              onClick={handleApprove}
              disabled={actionLoading}
              style={{
                background: "var(--wa-forest, #234B3B)",
                color: "#fff",
                border: "none",
                padding: "0.45rem 1rem",
                borderRadius: "6px",
                fontSize: "0.8rem",
                fontWeight: 600,
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.35rem",
              }}
            >
              <CheckCircle2 size={14} />
              <span>Approve Tutor (AI Verified)</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
