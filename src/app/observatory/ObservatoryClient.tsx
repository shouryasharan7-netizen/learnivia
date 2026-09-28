"use client";

import React, { useState } from "react";
import Link from "next/link";
import { CurriculumScrubber, CurriculumLevel } from "./CurriculumScrubber";
import { CredentialFlipCard, TutorCardData } from "./CredentialFlipCard";
import { KnowledgeReactorCanvas } from "./KnowledgeReactorCanvas";
import { ArrowLeft, Sparkles, Compass, ShieldCheck, Award } from "lucide-react";

const SAMPLE_TUTORS: Record<CurriculumLevel, TutorCardData[]> = {
  FOUNDATIONAL: [
    {
      id: "t1",
      name: "Sophia Lin",
      school: "Princeton Early Literacy Fellow",
      subjects: ["Elementary Reading", "Phonics", "Fractions"],
      gpa: "3.98",
      apScores: ["AP Eng Lit (5)", "AP Psychology (5)"],
      hours: 68.5,
      auditScore: 100,
      confidence: 99,
      safeguardingPassed: true,
    },
    {
      id: "t2",
      name: "David Kim",
      school: "Thomas Jefferson High School for Science & Tech",
      subjects: ["Pre-Algebra", "Middle School STEM", "Geometry"],
      gpa: "4.0",
      apScores: ["AP Calc BC (5)", "AP Chemistry (5)"],
      hours: 54.0,
      auditScore: 98,
      confidence: 97,
      safeguardingPassed: true,
    },
    {
      id: "t3",
      name: "Amara Patel",
      school: "Stuyvesant High School",
      subjects: ["Grammar Foundations", "Creative Writing", "Earth Science"],
      gpa: "3.95",
      apScores: ["AP Lang (5)", "AP Biology (5)"],
      hours: 46.0,
      auditScore: 97,
      confidence: 96,
      safeguardingPassed: true,
    },
  ],
  BALANCED: [
    {
      id: "t4",
      name: "Marcus Sterling",
      school: "Columbia University Undergraduate",
      subjects: ["Honors Algebra II", "Chemistry", "PEEL Rhetoric"],
      gpa: "4.0",
      apScores: ["AP Chemistry (5)", "AP Physics 1 (5)", "AP Calc BC (5)"],
      hours: 82.0,
      auditScore: 100,
      confidence: 98,
      safeguardingPassed: true,
    },
    {
      id: "t5",
      name: "Elena Vasquez",
      school: "Bronx High School of Science",
      subjects: ["AP European History", "Biology", "French"],
      gpa: "3.97",
      apScores: ["AP Euro (5)", "AP Bio (5)", "AP French (5)"],
      hours: 61.5,
      auditScore: 99,
      confidence: 98,
      safeguardingPassed: true,
    },
    {
      id: "t6",
      name: "Liam O'Connor",
      school: "Boston Latin School",
      subjects: ["Geometry", "World History", "Spanish"],
      gpa: "3.94",
      apScores: ["AP US History (5)", "AP Spanish (5)"],
      hours: 39.0,
      auditScore: 96,
      confidence: 95,
      safeguardingPassed: true,
    },
  ],
  OLYMPIAD: [
    {
      id: "t7",
      name: "Alexander Chen",
      school: "MIT Mathematics & EECS",
      subjects: ["AP Calculus BC", "AMC/AIME Math", "AP Physics C"],
      gpa: "4.0",
      apScores: ["AP Calc BC (5)", "AP Physics C (5)", "AP Comp Sci A (5)"],
      hours: 114.0,
      auditScore: 100,
      confidence: 99,
      safeguardingPassed: true,
    },
    {
      id: "t8",
      name: "Zoe Al-Mansoor",
      school: "Stanford University Physics",
      subjects: ["USAPhO Physics", "Multivariable Calculus", "Linear Algebra"],
      gpa: "4.0",
      apScores: ["AP Physics C Mech (5)", "AP Physics C E&M (5)", "AP Calc BC (5)"],
      hours: 95.5,
      auditScore: 100,
      confidence: 99,
      safeguardingPassed: true,
    },
    {
      id: "t9",
      name: "Rohan Gupta",
      school: "Carnegie Mellon Computer Science",
      subjects: ["USACO Algorithms", "Data Structures", "AP Statistics"],
      gpa: "3.99",
      apScores: ["AP Comp Sci A (5)", "AP Stats (5)", "AP Micro (5)"],
      hours: 78.0,
      auditScore: 98,
      confidence: 98,
      safeguardingPassed: true,
    },
  ],
};

export default function ObservatoryClient() {
  const [level, setLevel] = useState<CurriculumLevel>("BALANCED");
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);

  const activeTutors = SAMPLE_TUTORS[level];

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#020617",
        color: "#FFFFFF",
        fontFamily: "var(--font-sans, system-ui, sans-serif)",
        paddingBottom: "5rem",
      }}
    >
      {/* Top Blueprint Bar */}
      <div
        style={{
          borderBottom: "1px dashed rgba(45, 212, 191, 0.25)",
          background: "rgba(15, 23, 42, 0.8)",
          backdropFilter: "blur(10px)",
          padding: "0.75rem 2rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "1rem",
        }}
      >
        <Link
          href="/"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.4rem",
            color: "#2DD4BF",
            textDecoration: "none",
            fontSize: "0.8rem",
            fontWeight: 700,
            fontFamily: "ui-monospace, monospace",
          }}
        >
          <ArrowLeft size={14} />
          <span>[ RETURN TO MAIN PLATFORM ]</span>
        </Link>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "1.25rem",
            fontFamily: "ui-monospace, monospace",
            fontSize: "0.72rem",
            color: "rgba(255, 255, 255, 0.65)",
          }}
        >
          <span>BUILD: OREO-OBS-1</span>
          <span>•</span>
          <span>COORDINATES: 42°21&apos;N 71°03&apos;W</span>
          <span>•</span>
          <span style={{ color: "#2DD4BF", fontWeight: 700 }}>[ 100% NONPROFIT ]</span>
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "3rem 1.5rem" }}>
        {/* Header Title Section */}
        <div style={{ textAlign: "center", maxWidth: "800px", margin: "0 auto 3rem" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.3rem 0.85rem",
              borderRadius: "9999px",
              background: "rgba(13, 148, 136, 0.2)",
              border: "1px solid rgba(45, 212, 191, 0.4)",
              marginBottom: "1.25rem",
            }}
          >
            <Compass size={14} color="#2DD4BF" />
            <span
              style={{
                fontFamily: "ui-monospace, monospace",
                fontSize: "0.75rem",
                fontWeight: 700,
                color: "#E6FFFA",
                letterSpacing: "0.06em",
              }}
            >
              APPROACH 1 • ACADEMIC OBSERVATORY PROTOTYPE
            </span>
          </div>

          <h1
            style={{
              fontSize: "clamp(2.5rem, 5vw, 4.2rem)",
              fontWeight: 800,
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
              margin: "0 0 1rem",
              color: "#FFFFFF",
            }}
          >
            Physical Rigor.
            <br />
            <span style={{ color: "#2DD4BF", fontWeight: 600 }}>Precision Peer Learning.</span>
          </h1>

          <p
            style={{
              fontSize: "1.1rem",
              lineHeight: 1.6,
              color: "rgba(255, 255, 255, 0.75)",
              margin: 0,
            }}
          >
            Explore our interactive Knowledge Reactor, scrub curriculum difficulty levels,
            and inspect dual-sided 3D credential specimens verified by AI marksheet audits.
          </p>
        </div>

        {/* 1. Knowledge Reactor Canvas Engine */}
        <div style={{ marginBottom: "3rem" }}>
          <KnowledgeReactorCanvas
            level={level}
            onSelectSubject={(sub) => setSelectedSubject(sub)}
          />
          {selectedSubject && (
            <div
              style={{
                marginTop: "0.75rem",
                textAlign: "center",
                fontFamily: "ui-monospace, monospace",
                fontSize: "0.78rem",
                color: "#2DD4BF",
              }}
            >
              NODE ENGAGED: &ldquo;{selectedSubject}&rdquo; — Filtering matching tutors below.
            </div>
          )}
        </div>

        {/* 2. Tactile Curriculum Rigor Scrubber */}
        <div style={{ marginBottom: "4rem" }}>
          <CurriculumScrubber level={level} onChange={setLevel} />
        </div>

        {/* 3. 3D Credential Specimen Flip Cards */}
        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              borderBottom: "1px dashed rgba(45, 212, 191, 0.3)",
              paddingBottom: "1rem",
              marginBottom: "2rem",
              flexWrap: "wrap",
              gap: "1rem",
            }}
          >
            <div>
              <div
                style={{
                  fontFamily: "ui-monospace, monospace",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  color: "#2DD4BF",
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                }}
              >
                [ SPECIMEN CATALOG • 3D INTERACTIVE CARDS ]
              </div>
              <h2
                style={{
                  margin: "0.35rem 0 0",
                  fontSize: "1.75rem",
                  fontWeight: 800,
                  color: "#FFFFFF",
                }}
              >
                Verified Peer Mentors for {level === "FOUNDATIONAL" ? "Foundational Review" : level === "BALANCED" ? "Balanced Honors" : "Olympiad & AP Mastery"}
              </h2>
            </div>

            <div
              style={{
                fontFamily: "ui-monospace, monospace",
                fontSize: "0.75rem",
                color: "rgba(255, 255, 255, 0.6)",
              }}
            >
              HOVER OR CLICK ANY CARD TO FLIP &amp; AUDIT CREDENTIALS ↷
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "2rem",
            }}
          >
            {activeTutors.map((tutor) => (
              <CredentialFlipCard key={tutor.id} tutor={tutor} />
            ))}
          </div>
        </div>

        {/* Technical Blueprint Footnote (OreoAI Equation Inspired) */}
        <div
          style={{
            marginTop: "5rem",
            padding: "2rem",
            borderRadius: "12px",
            background: "rgba(15, 23, 42, 0.4)",
            border: "1px dashed rgba(255, 255, 255, 0.15)",
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontFamily: "ui-monospace, monospace",
              fontSize: "0.75rem",
              color: "#2DD4BF",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              marginBottom: "0.5rem",
            }}
          >
            [ PEER CAPABILITY EQUATION: η = (GPA × AP_MASTERY) / FRICTION ]
          </div>
          <div style={{ fontSize: "0.85rem", color: "rgba(255, 255, 255, 0.65)", maxWidth: "600px", margin: "0 auto" }}>
            Learnivia pairs high school and collegiate mentors with young scholars through
            zero-barrier, verified 1-on-1 sessions. Zero advertising, zero platform fees, 100% human connection.
          </div>
        </div>
      </div>
    </div>
  );
}
