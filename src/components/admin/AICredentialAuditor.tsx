"use client";

import React, { useState, useEffect } from "react";
import {
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  FileCheck,
  Brain,
  ShieldCheck,
  Award,
  X,
  ExternalLink,
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // Close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isModalOpen) {
        setIsModalOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isModalOpen]);

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
      setIsModalOpen(true);
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
      fd.append(
        "reason",
        `AI Credential Audit Approved (Score: ${result?.validityScore || 0}/100)`
      );
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
    const reason = prompt(
      "Enter rejection reason for applicant:",
      "Academic requirements or verification criteria not met."
    );
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
    <div style={{ marginTop: "0.5rem" }}>
      {/* Compact Trigger Bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          flexWrap: "wrap",
        }}
      >
        {!result ? (
          <button
            onClick={runAudit}
            disabled={loading}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.4rem",
              background: "var(--wa-forest, #234B3B)",
              color: "#fff",
              border: "none",
              padding: "0.4rem 0.75rem",
              borderRadius: "6px",
              fontSize: "0.775rem",
              fontWeight: 600,
              cursor: loading ? "wait" : "pointer",
              boxShadow: "0 1px 2px rgba(0,0,0,0.06)",
              transition: "background 0.2s ease",
            }}
          >
            <Sparkles size={13} className={loading ? "animate-spin" : ""} />
            <span>{loading ? "Auditing Credentials..." : "Run AI Marksheet Audit"}</span>
          </button>
        ) : (
          <button
            onClick={() => setIsModalOpen(true)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.4rem",
              background:
                result.recommendation === "APPROVE"
                  ? "#ECFDF5"
                  : result.recommendation === "REVIEW"
                  ? "#FFFBEB"
                  : "#FEF2F2",
              border: `1px solid ${
                result.recommendation === "APPROVE"
                  ? "#A7F3D0"
                  : result.recommendation === "REVIEW"
                  ? "#FDE68A"
                  : "#FECACA"
              }`,
              color:
                result.recommendation === "APPROVE"
                  ? "#065F46"
                  : result.recommendation === "REVIEW"
                  ? "#92400E"
                  : "#991B1B",
              padding: "0.35rem 0.65rem",
              borderRadius: "6px",
              fontSize: "0.775rem",
              fontWeight: 700,
              cursor: "pointer",
              boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
            }}
          >
            {result.recommendation === "APPROVE" ? (
              <CheckCircle2 size={14} color="#059669" />
            ) : result.recommendation === "REVIEW" ? (
              <AlertTriangle size={14} color="#D97706" />
            ) : (
              <XCircle size={14} color="#DC2626" />
            )}
            <span>
              AI Audit: {result.validityScore}/100 ({result.recommendation}) ↗
            </span>
          </button>
        )}
      </div>

      {error && (
        <div
          style={{
            marginTop: "0.4rem",
            fontSize: "0.75rem",
            color: "var(--wa-crimson, #b91c1c)",
            display: "flex",
            alignItems: "center",
            gap: "0.3rem",
          }}
        >
          <AlertTriangle size={13} />
          <span>{error}</span>
        </div>
      )}

      {/* Zero-Scroll Dual-Column Audit Modal */}
      {result && isModalOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(15, 23, 42, 0.65)",
            backdropFilter: "blur(4px)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "0.75rem",
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsModalOpen(false);
          }}
        >
          <div
            style={{
              background: "#FFFFFF",
              borderRadius: "12px",
              border: "1px solid var(--wa-border, #E2E8F0)",
              boxShadow: "0 20px 45px -10px rgba(0, 0, 0, 0.25)",
              maxWidth: "1000px",
              width: "95vw",
              maxHeight: "90vh",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
          >
            {/* Modal Header with Prominent Decision Controls */}
            <div
              style={{
                padding: "0.85rem 1.25rem",
                borderBottom: "1px solid var(--wa-border, #E2E8F0)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "0.75rem",
                flexWrap: "wrap",
                background: "var(--surface-raised, #F8FAFC)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                <div
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "8px",
                    background: "var(--primary-light, #E6F4F1)",
                    color: "var(--primary, #0D9488)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <Brain size={18} />
                </div>
                <div>
                  <h3
                    style={{
                      margin: 0,
                      fontSize: "0.95rem",
                      fontWeight: 700,
                      color: "var(--wa-ink, #0F172A)",
                      fontFamily: "var(--font-sans)",
                    }}
                  >
                    AI Marksheet &amp; Credential Audit
                  </h3>
                  <div
                    style={{
                      fontSize: "0.775rem",
                      color: "var(--wa-muted, #64748B)",
                      marginTop: "1px",
                    }}
                  >
                    Applicant: <strong>{applicantName}</strong>
                  </div>
                </div>
              </div>

              {/* Status Badge & Actions in Header (Zero Scroll Required) */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  flexWrap: "wrap",
                }}
              >
                {/* Recommendation & Score Pill */}
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.35rem",
                    padding: "0.3rem 0.65rem",
                    borderRadius: "6px",
                    fontSize: "0.775rem",
                    fontWeight: 700,
                    background:
                      result.recommendation === "APPROVE"
                        ? "#ECFDF5"
                        : result.recommendation === "REVIEW"
                        ? "#FFFBEB"
                        : "#FEF2F2",
                    border: `1px solid ${
                      result.recommendation === "APPROVE"
                        ? "#A7F3D0"
                        : result.recommendation === "REVIEW"
                        ? "#FDE68A"
                        : "#FECACA"
                    }`,
                    color:
                      result.recommendation === "APPROVE"
                        ? "#065F46"
                        : result.recommendation === "REVIEW"
                        ? "#92400E"
                        : "#991B1B",
                  }}
                >
                  {result.recommendation === "APPROVE" ? (
                    <CheckCircle2 size={14} color="#059669" />
                  ) : result.recommendation === "REVIEW" ? (
                    <AlertTriangle size={14} color="#D97706" />
                  ) : (
                    <XCircle size={14} color="#DC2626" />
                  )}
                  <span>
                    {result.recommendation}: {result.validityScore}/100 ({result.confidence}% conf.)
                  </span>
                </div>

                {/* Primary Quick Decision Buttons */}
                <button
                  onClick={handleReject}
                  disabled={actionLoading}
                  style={{
                    background: "#FFFFFF",
                    border: "1px solid #FECACA",
                    color: "#DC2626",
                    padding: "0.35rem 0.75rem",
                    borderRadius: "6px",
                    fontSize: "0.775rem",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Reject / Flags
                </button>
                <button
                  onClick={handleApprove}
                  disabled={actionLoading}
                  style={{
                    background: "var(--wa-forest, #234B3B)",
                    color: "#FFFFFF",
                    border: "none",
                    padding: "0.35rem 0.85rem",
                    borderRadius: "6px",
                    fontSize: "0.775rem",
                    fontWeight: 600,
                    cursor: "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.35rem",
                  }}
                >
                  <CheckCircle2 size={13} />
                  <span>Approve Tutor</span>
                </button>

                <button
                  onClick={() => setIsModalOpen(false)}
                  style={{
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    color: "var(--wa-muted, #64748B)",
                    padding: "0.25rem",
                    borderRadius: "6px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  aria-label="Close dialog"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Modal Body: High-Density Side-by-Side Dual Column (Fits in Viewport) */}
            <div
              style={{
                padding: "1rem 1.25rem",
                overflowY: "auto",
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))",
                gap: "1rem",
                alignItems: "start",
              }}
            >
              {/* Left Column: Summary & 5-Check Safeguarding Matrix */}
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {/* Executive Verdict Summary */}
                <div
                  style={{
                    padding: "0.75rem 1rem",
                    borderRadius: "8px",
                    background:
                      result.recommendation === "APPROVE"
                        ? "rgba(16, 185, 129, 0.08)"
                        : result.recommendation === "REVIEW"
                        ? "rgba(245, 158, 11, 0.08)"
                        : "rgba(239, 68, 68, 0.08)",
                    border: `1px solid ${
                      result.recommendation === "APPROVE"
                        ? "rgba(16, 185, 129, 0.25)"
                        : result.recommendation === "REVIEW"
                        ? "rgba(245, 158, 11, 0.25)"
                        : "rgba(239, 68, 68, 0.25)"
                    }`,
                  }}
                >
                  <div
                    style={{
                      fontSize: "0.725rem",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.04em",
                      color:
                        result.recommendation === "APPROVE"
                          ? "#065F46"
                          : result.recommendation === "REVIEW"
                          ? "#92400E"
                          : "#991B1B",
                      marginBottom: "0.25rem",
                    }}
                  >
                    AI Audit Assessment
                  </div>
                  <p
                    style={{
                      margin: 0,
                      fontSize: "0.825rem",
                      lineHeight: 1.5,
                      color: "var(--wa-ink, #0F172A)",
                    }}
                  >
                    {result.summary}
                  </p>
                </div>

                {/* Verification Matrix */}
                <div
                  style={{
                    background: "#FFFFFF",
                    border: "1px solid var(--wa-border, #E2E8F0)",
                    borderRadius: "8px",
                    padding: "0.75rem 0.95rem",
                  }}
                >
                  <div
                    style={{
                      fontSize: "0.725rem",
                      fontWeight: 700,
                      color: "var(--wa-ink, #0F172A)",
                      textTransform: "uppercase",
                      letterSpacing: "0.04em",
                      marginBottom: "0.5rem",
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <span>Safeguarding &amp; Academic Checks</span>
                    <span style={{ color: "var(--wa-muted, #64748B)" }}>
                      {result.checks.filter((c) => c.passed).length}/{result.checks.length} Passed
                    </span>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.45rem" }}>
                    {result.checks.map((chk) => (
                      <div
                        key={chk.id}
                        style={{
                          display: "flex",
                          alignItems: "flex-start",
                          gap: "0.5rem",
                          fontSize: "0.8rem",
                          padding: "0.25rem 0",
                          borderBottom: "1px solid #F1F5F9",
                        }}
                      >
                        {chk.passed ? (
                          <CheckCircle2
                            size={15}
                            color="#059669"
                            style={{ flexShrink: 0, marginTop: "1px" }}
                          />
                        ) : (
                          <AlertTriangle
                            size={15}
                            color="#D97706"
                            style={{ flexShrink: 0, marginTop: "1px" }}
                          />
                        )}
                        <div style={{ minWidth: 0, lineHeight: 1.4 }}>
                          <strong
                            style={{
                              color: chk.passed
                                ? "var(--wa-ink, #0F172A)"
                                : "#92400E",
                            }}
                          >
                            {chk.name}:{" "}
                          </strong>
                          <span style={{ color: "var(--wa-muted, #475569)" }}>
                            {chk.details}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: Extracted Credentials, Strengths & Flags */}
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {/* Detected Academic Credentials */}
                <div
                  style={{
                    background: "var(--surface-raised, #F8FAFC)",
                    border: "1px solid var(--wa-border, #E2E8F0)",
                    borderRadius: "8px",
                    padding: "0.75rem 0.95rem",
                  }}
                >
                  <div
                    style={{
                      fontSize: "0.725rem",
                      fontWeight: 700,
                      color: "var(--wa-ink, #0F172A)",
                      textTransform: "uppercase",
                      letterSpacing: "0.04em",
                      marginBottom: "0.5rem",
                    }}
                  >
                    Detected Academic Credentials
                  </div>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
                      gap: "0.5rem",
                    }}
                  >
                    <div
                      style={{
                        background: "#FFFFFF",
                        border: "1px solid var(--wa-border, #E2E8F0)",
                        borderRadius: "6px",
                        padding: "0.5rem 0.75rem",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "0.675rem",
                          color: "var(--wa-muted, #64748B)",
                          textTransform: "uppercase",
                          fontWeight: 700,
                        }}
                      >
                        GPA / Standing
                      </div>
                      <div
                        style={{
                          fontSize: "0.95rem",
                          fontWeight: 800,
                          color: "var(--wa-forest, #234B3B)",
                          marginTop: "2px",
                        }}
                      >
                        {result.extractedScores.gpa || academicScores || "Unspecified"}
                      </div>
                    </div>

                    <div
                      style={{
                        background: "#FFFFFF",
                        border: "1px solid var(--wa-border, #E2E8F0)",
                        borderRadius: "6px",
                        padding: "0.5rem 0.75rem",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "0.675rem",
                          color: "var(--wa-muted, #64748B)",
                          textTransform: "uppercase",
                          fontWeight: 700,
                        }}
                      >
                        Standardized Tests
                      </div>
                      <div
                        style={{
                          fontSize: "0.8rem",
                          fontWeight: 600,
                          color: "var(--wa-ink, #0F172A)",
                          marginTop: "2px",
                        }}
                      >
                        {result.extractedScores.standardizedTests &&
                        result.extractedScores.standardizedTests.length > 0
                          ? result.extractedScores.standardizedTests.join(", ")
                          : "None detected"}
                      </div>
                    </div>

                    <div
                      style={{
                        background: "#FFFFFF",
                        border: "1px solid var(--wa-border, #E2E8F0)",
                        borderRadius: "6px",
                        padding: "0.5rem 0.75rem",
                        gridColumn: "1 / -1",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "0.675rem",
                          color: "var(--wa-muted, #64748B)",
                          textTransform: "uppercase",
                          fontWeight: 700,
                        }}
                      >
                        AP / IB / Advanced Coursework
                      </div>
                      <div
                        style={{
                          fontSize: "0.8rem",
                          fontWeight: 600,
                          color: "var(--wa-ink, #0F172A)",
                          marginTop: "2px",
                        }}
                      >
                        {result.extractedScores.apIbCourses &&
                        result.extractedScores.apIbCourses.length > 0
                          ? result.extractedScores.apIbCourses.join(", ")
                          : "None detected"}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Strengths & Red Flags in Compact Micro-Cards */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "0.5rem",
                  }}
                >
                  <div
                    style={{
                      background: "#F0FDF4",
                      border: "1px solid #BBF7D0",
                      borderRadius: "6px",
                      padding: "0.6rem 0.75rem",
                      fontSize: "0.775rem",
                    }}
                  >
                    <div
                      style={{
                        fontWeight: 700,
                        color: "#166534",
                        marginBottom: "0.25rem",
                        fontSize: "0.725rem",
                        textTransform: "uppercase",
                      }}
                    >
                      Key Strengths
                    </div>
                    <ul
                      style={{
                        margin: 0,
                        paddingLeft: "1rem",
                        color: "#15803D",
                        display: "flex",
                        flexDirection: "column",
                        gap: "0.2rem",
                      }}
                    >
                      {result.strengths.slice(0, 3).map((s, idx) => (
                        <li key={idx}>{s}</li>
                      ))}
                    </ul>
                  </div>

                  <div
                    style={{
                      background: result.flags.length > 0 ? "#FFFBEB" : "#F8FAFC",
                      border: `1px solid ${
                        result.flags.length > 0 ? "#FDE68A" : "#E2E8F0"
                      }`,
                      borderRadius: "6px",
                      padding: "0.6rem 0.75rem",
                      fontSize: "0.775rem",
                    }}
                  >
                    <div
                      style={{
                        fontWeight: 700,
                        color:
                          result.flags.length > 0 ? "#92400E" : "#475569",
                        marginBottom: "0.25rem",
                        fontSize: "0.725rem",
                        textTransform: "uppercase",
                      }}
                    >
                      Review Flags
                    </div>
                    {result.flags.length > 0 ? (
                      <ul
                        style={{
                          margin: 0,
                          paddingLeft: "1rem",
                          color: "#B45309",
                          display: "flex",
                          flexDirection: "column",
                          gap: "0.2rem",
                        }}
                      >
                        {result.flags.slice(0, 3).map((f, idx) => (
                          <li key={idx}>{f}</li>
                        ))}
                      </ul>
                    ) : (
                      <span style={{ color: "#64748B", fontSize: "0.75rem" }}>
                        All safeguarding criteria met.
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Bottom Sub-Bar */}
            <div
              style={{
                padding: "0.6rem 1.25rem",
                borderTop: "1px solid var(--wa-border, #E2E8F0)",
                background: "var(--surface-raised, #F8FAFC)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                fontSize: "0.75rem",
                color: "var(--wa-muted, #64748B)",
              }}
            >
              <span>Audit powered by Learnivia AI Verifier • Compliant with FERPA &amp; COPPA guidelines</span>
              <button
                onClick={() => setIsModalOpen(false)}
                style={{
                  background: "#FFFFFF",
                  border: "1px solid var(--wa-border, #E2E8F0)",
                  color: "var(--wa-ink, #0F172A)",
                  padding: "0.3rem 0.75rem",
                  borderRadius: "5px",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
