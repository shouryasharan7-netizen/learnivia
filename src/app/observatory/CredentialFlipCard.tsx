"use client";

import React, { useState } from "react";
import { CheckCircle2, ShieldCheck, Award, GraduationCap, Sparkles, RefreshCw } from "lucide-react";

export interface TutorCardData {
  id: string;
  name: string;
  school: string;
  subjects: string[];
  gpa: string;
  apScores: string[];
  hours: number;
  auditScore: number;
  confidence: number;
  safeguardingPassed: boolean;
}

interface Props {
  tutor: TutorCardData;
}

export function CredentialFlipCard({ tutor }: Props) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rX = ((y - centerY) / centerY) * -7;
    const rY = ((x - centerX) / centerX) * 7;
    setRotateX(rX);
    setRotateY(rY);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <div
      style={{
        perspective: "1200px",
        width: "100%",
        maxWidth: "340px",
        height: "440px",
        cursor: "pointer",
        margin: "0 auto",
      }}
      onClick={() => setIsFlipped(!isFlipped)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          position: "relative",
          transformStyle: "preserve-3d",
          transition: "transform 400ms cubic-bezier(0.16, 1, 0.3, 1)",
          transform: `rotateX(${rotateX}deg) rotateY(${isFlipped ? rotateY + 180 : rotateY}deg)`,
        }}
      >
        {/* ================= FRONT SIDE ================= */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            borderRadius: "14px",
            background: "linear-gradient(145deg, #1E293B, #0F172A)",
            border: "1px solid rgba(45, 212, 191, 0.25)",
            boxShadow: "0 15px 35px -5px rgba(0, 0, 0, 0.4)",
            padding: "1.5rem",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            color: "#FFFFFF",
          }}
        >
          {/* Top Bar */}
          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "1rem",
              }}
            >
              <span
                style={{
                  fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
                  fontSize: "0.68rem",
                  fontWeight: 700,
                  color: "#2DD4BF",
                  letterSpacing: "0.06em",
                  background: "rgba(45, 212, 191, 0.12)",
                  padding: "0.2rem 0.5rem",
                  borderRadius: "4px",
                  border: "1px solid rgba(45, 212, 191, 0.3)",
                }}
              >
                [ VERIFIED MENTOR ]
              </span>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.3rem",
                  fontSize: "0.75rem",
                  color: "#94A3B8",
                }}
              >
                <RefreshCw size={12} />
                <span>Click to Flip</span>
              </div>
            </div>

            {/* Avatar & Identity */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.85rem", marginBottom: "1rem" }}>
              <div
                style={{
                  width: "52px",
                  height: "52px",
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #0D9488, #059669)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#FFFFFF",
                  fontWeight: 800,
                  fontSize: "1.25rem",
                  border: "2px solid rgba(255, 255, 255, 0.2)",
                  boxShadow: "0 4px 12px rgba(13, 148, 136, 0.3)",
                }}
              >
                {tutor.name.charAt(0)}
              </div>
              <div>
                <h3
                  style={{
                    margin: 0,
                    fontSize: "1.15rem",
                    fontWeight: 800,
                    fontFamily: "var(--font-sans)",
                    color: "#FFFFFF",
                  }}
                >
                  {tutor.name}
                </h3>
                <div style={{ fontSize: "0.82rem", color: "#94A3B8", marginTop: "2px" }}>
                  {tutor.school}
                </div>
              </div>
            </div>

            {/* Subjects Tags */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem", marginBottom: "1rem" }}>
              {tutor.subjects.map((sub, idx) => (
                <span
                  key={idx}
                  style={{
                    fontSize: "0.72rem",
                    fontWeight: 600,
                    padding: "0.2rem 0.55rem",
                    borderRadius: "4px",
                    background: "rgba(255, 255, 255, 0.08)",
                    border: "1px solid rgba(255, 255, 255, 0.12)",
                    color: "#E2E8F0",
                  }}
                >
                  {sub}
                </span>
              ))}
            </div>
          </div>

          {/* Quick Metrics */}
          <div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "0.5rem",
                padding: "0.75rem",
                borderRadius: "8px",
                background: "rgba(15, 23, 42, 0.5)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                marginBottom: "0.75rem",
              }}
            >
              <div>
                <div style={{ fontSize: "0.68rem", color: "#94A3B8", textTransform: "uppercase" }}>
                  Standing
                </div>
                <div style={{ fontSize: "0.95rem", fontWeight: 700, color: "#2DD4BF" }}>
                  {tutor.gpa} GPA
                </div>
              </div>
              <div>
                <div style={{ fontSize: "0.68rem", color: "#94A3B8", textTransform: "uppercase" }}>
                  Volunteer Time
                </div>
                <div style={{ fontSize: "0.95rem", fontWeight: 700, color: "#FFFFFF" }}>
                  {tutor.hours} Hours
                </div>
              </div>
            </div>

            <div
              style={{
                fontSize: "0.75rem",
                textAlign: "center",
                color: "rgba(255, 255, 255, 0.5)",
                fontFamily: "ui-monospace, monospace",
              }}
            >
              CLICK TO VIEW AI MARKSHEET AUDIT ↷
            </div>
          </div>
        </div>

        {/* ================= BACK SIDE (AUDIT SPECIMEN) ================= */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            borderRadius: "14px",
            background: "#FFFFFF",
            border: "2px solid #059669",
            boxShadow: "0 15px 35px -5px rgba(0, 0, 0, 0.4)",
            padding: "1.25rem",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            color: "#0F172A",
          }}
        >
          {/* Back Header */}
          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderBottom: "1px dashed #CBD5E1",
                paddingBottom: "0.6rem",
                marginBottom: "0.85rem",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                <Sparkles size={16} color="#059669" />
                <span
                  style={{
                    fontFamily: "ui-monospace, monospace",
                    fontSize: "0.75rem",
                    fontWeight: 800,
                    color: "#059669",
                    letterSpacing: "0.04em",
                  }}
                >
                  AI CREDENTIAL AUDIT
                </span>
              </div>
              <div
                style={{
                  fontSize: "0.85rem",
                  fontWeight: 900,
                  color: "#059669",
                  background: "#ECFDF5",
                  padding: "0.15rem 0.5rem",
                  borderRadius: "4px",
                }}
              >
                {tutor.auditScore}/100
              </div>
            </div>

            {/* Audit Details */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
              <div>
                <div style={{ fontSize: "0.7rem", color: "#64748B", textTransform: "uppercase", fontWeight: 700 }}>
                  Verified Exam Mastery
                </div>
                <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#0F172A", marginTop: "1px" }}>
                  {tutor.apScores.join(" • ")}
                </div>
              </div>

              <div>
                <div style={{ fontSize: "0.7rem", color: "#64748B", textTransform: "uppercase", fontWeight: 700 }}>
                  5-Stage Safeguarding Seal
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.35rem",
                    color: "#059669",
                    fontSize: "0.825rem",
                    fontWeight: 700,
                    marginTop: "2px",
                  }}
                >
                  <ShieldCheck size={16} /> Child Protection Certified
                </div>
              </div>

              <div>
                <div style={{ fontSize: "0.7rem", color: "#64748B", textTransform: "uppercase", fontWeight: 700 }}>
                  PVSA Recognized Hours
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.35rem",
                    color: "#0F172A",
                    fontSize: "0.825rem",
                    fontWeight: 700,
                    marginTop: "2px",
                  }}
                >
                  <Award size={16} color="#D97706" /> {tutor.hours} Hours Dual-Confirmed
                </div>
              </div>
            </div>
          </div>

          {/* Verification Barcode / Footer */}
          <div
            style={{
              borderTop: "1px dashed #CBD5E1",
              paddingTop: "0.75rem",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div
              style={{
                fontFamily: "ui-monospace, monospace",
                fontSize: "0.65rem",
                color: "#64748B",
              }}
            >
              HASH: 0x9F4A...7C2B
              <br />
              CONFIDENCE: {tutor.confidence}%
            </div>
            <div
              style={{
                fontFamily: "ui-monospace, monospace",
                fontSize: "0.72rem",
                color: "#059669",
                fontWeight: 700,
              }}
            >
              [ VALIDATED ]
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
