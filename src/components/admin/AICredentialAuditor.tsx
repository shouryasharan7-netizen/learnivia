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

      {/* Spacious, Collision-Free Audit Modal */}
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
            padding: "1rem",
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
              maxWidth: "720px",
              width: "100%",
              maxHeight: "88vh",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
          >
            {/* Modal Header */}
            <div
              style={{
                padding: "1rem 1.25rem",
                borderBottom: "1px solid var(--wa-border, #E2E8F0)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
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
                      fontSize: "1rem",
                      fontWeight: 700,
                      color: "var(--wa-ink, #0F172A)",
                      fontFamily: "var(--font-sans)",
                    }}
                  >
                    AI Credential &amp; Report Card Audit
                  </h3>
                  <div
                    style={{
                      fontSize: "0.8rem",
                      color: "var(--wa-muted, #64748B)",
                      marginTop: "1px",
                    }}
                  >
                    Applicant: <strong>{applicantName}</strong> • Automated
                    transcript verification
                  </div>
                </div>
              </div>

              <button
                onClick={() => setIsModalOpen(false)}
                style={{
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  color: "var(--wa-muted, #64748B)",
                  padding: "0.35rem",
                  borderRadius: "6px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                aria-label="Close dialog"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div
              style={{
                padding: "1.25rem",
                overflowY: "auto",
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
              }}
            >
              {/* Verdict Banner (Zero Collision Layout) */}
              <div
                style={{
                  padding: "1rem 1.15rem",
                  borderRadius: "8px",
                  background:
                    result.recommendation === "APPROVE"
                      ? "rgba(16, 185, 129, 0.08)"
                      : result.recommendation === "REVIEW"
                      ? "rgba(245, 158, 11, 0.08)"
                      : "rgba(239, 68, 68, 0.08)",
                  border: `1px solid ${
                    result.recommendation === "APPROVE"
                      ? "rgba(16, 185, 129, 0.3)"
                      : result.recommendation === "REVIEW"
                      ? "rgba(245, 158, 11, 0.3)"
                      : "rgba(239, 68, 68, 0.3)"
                  }`,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    gap: "1rem",
                    flexWrap: "wrap",
                  }}
                >
                  {/* Left Column: Recommendation & Summary */}
                  <div
                    style={{
                      flex: "1 1 320px",
                      minWidth: 0,
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.4rem",
                    }}
                  >
                    <div
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.4rem",
                        fontWeight: 800,
                        fontSize: "0.875rem",
                        letterSpacing: "0.02em",
                        color:
                          result.recommendation === "APPROVE"
                            ? "#065F46"
                            : result.recommendation === "REVIEW"
                            ? "#92400E"
                            : "#991B1B",
                      }}
                    >
                      {result.recommendation === "APPROVE" ? (
                        <CheckCircle2 size={18} color="#059669" />
                      ) : result.recommendation === "REVIEW" ? (
                        <AlertTriangle size={18} color="#D97706" />
                      ) : (
                        <XCircle size={18} color="#DC2626" />
                      )}
                      <span>
                        {result.recommendation === "APPROVE"
                          ? "AI RECOMMENDATION: APPROVE APPLICANT"
                          : result.recommendation === "REVIEW"
                          ? "AI RECOMMENDATION: MANUAL REVIEW REQUIRED"
                          : "AI RECOMMENDATION: APPLICATION NOT RECOMMENDED"}
                      </span>
                    </div>

                    <p
                      style={{
                        margin: "0.25rem 0 0",
                        fontSize: "0.875rem",
                        lineHeight: 1.55,
                        color: "var(--wa-ink, #0F172A)",
                        wordBreak: "break-word",
                      }}
                    >
                      {result.summary}
                    </p>
                  </div>

                  {/* Right Column: High-contrast Score Box */}
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: "0.65rem 1rem",
                      borderRadius: "8px",
                      background: "#FFFFFF",
                      border: "1px solid rgba(0, 0, 0, 0.08)",
                      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.04)",
                      flexShrink: 0,
                      minWidth: "120px",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "1.4rem",
                        fontWeight: 900,
                        lineHeight: 1,
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
                    <div
                      style={{
                        fontSize: "0.7rem",
                        fontWeight: 700,
                        color: "var(--wa-muted, #64748B)",
                        textTransform: "uppercase",
                        marginTop: "0.3rem",
                        letterSpacing: "0.03em",
                      }}
                    >
                      Score ({result.confidence}% conf.)
                    </div>
                  </div>
                </div>
              </div>

              {/* Extracted Academic Credentials */}
              <div>
                <div
                  style={{
                    fontSize: "0.8rem",
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
                    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                    gap: "0.6rem",
                  }}
                >
                  <div
                    style={{
                      background: "var(--surface-raised, #F8FAFC)",
                      border: "1px solid var(--wa-border, #E2E8F0)",
                      borderRadius: "6px",
                      padding: "0.6rem 0.85rem",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "0.725rem",
                        color: "var(--wa-muted, #64748B)",
                        textTransform: "uppercase",
                        fontWeight: 700,
                      }}
                    >
                      Detected GPA / Standing
                    </div>
                    <div
                      style={{
                        fontSize: "1rem",
                        fontWeight: 800,
                        color: "var(--wa-forest, #234B3B)",
                        marginTop: "2px",
                      }}
                    >
                      {result.extractedScores.gpa || academicScores || "Unspecified"}
                    </div>
                  </div>

                  {result.extractedScores.standardizedTests &&
                    result.extractedScores.standardizedTests.length > 0 && (
                      <div
                        style={{
                          background: "var(--surface-raised, #F8FAFC)",
                          border: "1px solid var(--wa-border, #E2E8F0)",
                          borderRadius: "6px",
                          padding: "0.6rem 0.85rem",
                        }}
                      >
                        <div
                          style={{
                            fontSize: "0.725rem",
                            color: "var(--wa-muted, #64748B)",
                            textTransform: "uppercase",
                            fontWeight: 700,
                          }}
                        >
                          Exam Scores
                        </div>
                        <div
                          style={{
                            fontSize: "0.875rem",
                            fontWeight: 600,
                            color: "var(--wa-ink, #0F172A)",
                            marginTop: "2px",
                          }}
                        >
                          {result.extractedScores.standardizedTests.join(", ")}
                        </div>
                      </div>
                    )}

                  {result.extractedScores.apIbCourses &&
                    result.extractedScores.apIbCourses.length > 0 && (
                      <div
                        style={{
                          background: "var(--surface-raised, #F8FAFC)",
                          border: "1px solid var(--wa-border, #E2E8F0)",
                          borderRadius: "6px",
                          padding: "0.6rem 0.85rem",
                        }}
                      >
                        <div
                          style={{
                            fontSize: "0.725rem",
                            color: "var(--wa-muted, #64748B)",
                            textTransform: "uppercase",
                            fontWeight: 700,
                          }}
                        >
                          AP / IB Coursework
                        </div>
                        <div
                          style={{
                            fontSize: "0.875rem",
                            fontWeight: 600,
                            color: "var(--wa-ink, #0F172A)",
                            marginTop: "2px",
                          }}
                        >
                          {result.extractedScores.apIbCourses.join(", ")}
                        </div>
                      </div>
                    )}
                </div>
              </div>

              {/* 5-Check Safeguarding & Academic Matrix */}
              <div
                style={{
                  background: "#FFFFFF",
                  border: "1px solid var(--wa-border, #E2E8F0)",
                  borderRadius: "8px",
                  padding: "0.85rem 1rem",
                }}
              >
                <div
                  style={{
                    fontSize: "0.8rem",
                    fontWeight: 700,
                    color: "var(--wa-ink, #0F172A)",
                    textTransform: "uppercase",
                    letterSpacing: "0.04em",
                    marginBottom: "0.6rem",
                  }}
                >
                  Automated Safeguarding &amp; Academic Checks
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  {result.checks.map((chk) => (
                    <div
                      key={chk.id}
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: "0.6rem",
                        fontSize: "0.825rem",
                      }}
                    >
                      {chk.passed ? (
                        <CheckCircle2
                          size={16}
                          color="#059669"
                          style={{ flexShrink: 0, marginTop: "2px" }}
                        />
                      ) : (
                        <AlertTriangle
                          size={16}
                          color="#D97706"
                          style={{ flexShrink: 0, marginTop: "2px" }}
                        />
                      )}
                      <div style={{ minWidth: 0 }}>
                        <span
                          style={{
                            fontWeight: 700,
                            color: chk.passed
                              ? "var(--wa-ink, #0F172A)"
                              : "#92400E",
                          }}
                        >
                          {chk.name}:{" "}
                        </span>
                        <span style={{ color: "var(--wa-muted, #475569)" }}>
                          {chk.details}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Strengths & Red Flags */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                  gap: "0.75rem",
                }}
              >
                <div
                  style={{
                    background: "#F0FDF4",
                    border: "1px solid #BBF7D0",
                    borderRadius: "8px",
                    padding: "0.75rem 1rem",
                    fontSize: "0.8125rem",
                  }}
                >
                  <div
                    style={{
                      fontWeight: 700,
                      color: "#166534",
                      marginBottom: "0.35rem",
                    }}
                  >
                    Key Strengths:
                  </div>
                  <ul
                    style={{
                      margin: 0,
                      paddingLeft: "1.1rem",
                      color: "#15803D",
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.25rem",
                    }}
                  >
                    {result.strengths.map((s, idx) => (
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
                    borderRadius: "8px",
                    padding: "0.75rem 1rem",
                    fontSize: "0.8125rem",
                  }}
                >
                  <div
                    style={{
                      fontWeight: 700,
                      color:
                        result.flags.length > 0 ? "#92400E" : "#475569",
                      marginBottom: "0.35rem",
                    }}
                  >
                    Review Flags:
                  </div>
                  {result.flags.length > 0 ? (
                    <ul
                      style={{
                        margin: 0,
                        paddingLeft: "1.1rem",
                        color: "#B45309",
                        display: "flex",
                        flexDirection: "column",
                        gap: "0.25rem",
                      }}
                    >
                      {result.flags.map((f, idx) => (
                        <li key={idx}>{f}</li>
                      ))}
                    </ul>
                  ) : (
                    <span style={{ color: "#64748B" }}>
                      No flags detected. All safeguarding and academic criteria
                      satisfied.
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Modal Actions Footer */}
            <div
              style={{
                padding: "0.85rem 1.25rem",
                borderTop: "1px solid var(--wa-border, #E2E8F0)",
                background: "var(--surface-raised, #F8FAFC)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: "0.75rem",
              }}
            >
              <button
                onClick={() => setIsModalOpen(false)}
                style={{
                  background: "#FFFFFF",
                  border: "1px solid var(--wa-border, #E2E8F0)",
                  color: "var(--wa-ink, #0F172A)",
                  padding: "0.5rem 0.9rem",
                  borderRadius: "6px",
                  fontSize: "0.8125rem",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Close
              </button>

              <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                <button
                  onClick={handleReject}
                  disabled={actionLoading}
                  style={{
                    background: "transparent",
                    border: "1px solid var(--wa-border, #E2E8F0)",
                    color: "var(--wa-crimson, #b91c1c)",
                    padding: "0.5rem 0.9rem",
                    borderRadius: "6px",
                    fontSize: "0.8125rem",
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
                    padding: "0.5rem 1.1rem",
                    borderRadius: "6px",
                    fontSize: "0.8125rem",
                    fontWeight: 600,
                    cursor: "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.4rem",
                    boxShadow: "0 1px 2px rgba(0,0,0,0.08)",
                  }}
                >
                  <CheckCircle2 size={15} />
                  <span>Approve Tutor (AI Verified)</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
