"use client";

import React from "react";

export type CurriculumLevel = "FOUNDATIONAL" | "BALANCED" | "OLYMPIAD";

interface Props {
  level: CurriculumLevel;
  onChange: (level: CurriculumLevel) => void;
}

const LEVELS: { id: CurriculumLevel; title: string; tValue: string; desc: string }[] = [
  {
    id: "FOUNDATIONAL",
    title: "Foundational Review",
    tValue: "T = 0.1",
    desc: "Elementary & Middle School core numeracy, early phonics & guided confidence",
  },
  {
    id: "BALANCED",
    title: "Balanced Curriculum",
    tValue: "T = 1.0",
    desc: "High School honors algebra, PEEL rhetoric, laboratory sciences & homework triage",
  },
  {
    id: "OLYMPIAD",
    title: "Olympiad & AP Mastery",
    tValue: "T = 10.0",
    desc: "AP Calculus BC, Physics C, AMC/USAMO competition math & college-ready rigor",
  },
];

export function CurriculumScrubber({ level, onChange }: Props) {
  const currentIndex = LEVELS.findIndex((l) => l.id === level);

  return (
    <div
      style={{
        background: "rgba(15, 23, 42, 0.6)",
        border: "1px solid rgba(45, 212, 191, 0.25)",
        borderRadius: "12px",
        padding: "1.25rem 1.5rem",
        backdropFilter: "blur(12px)",
        maxWidth: "680px",
        width: "100%",
        margin: "0 auto",
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
        <div
          style={{
            fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
            fontSize: "0.75rem",
            color: "rgba(45, 212, 191, 0.9)",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            fontWeight: 700,
          }}
        >
          [ CURRICULUM RIGOR PARAMETER ]
        </div>
        <div
          style={{
            fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
            fontSize: "0.75rem",
            color: "#FFFFFF",
            background: "rgba(13, 148, 136, 0.3)",
            border: "1px solid rgba(45, 212, 191, 0.4)",
            padding: "0.2rem 0.6rem",
            borderRadius: "4px",
            fontWeight: 700,
          }}
        >
          ACTIVE: {LEVELS[currentIndex].tValue}
        </div>
      </div>

      {/* Tactile 3-Position Track */}
      <div
        style={{
          position: "relative",
          height: "44px",
          display: "flex",
          alignItems: "center",
          cursor: "pointer",
        }}
      >
        {/* Track Line */}
        <div
          style={{
            position: "absolute",
            left: "5%",
            right: "5%",
            height: "2px",
            background: "rgba(255, 255, 255, 0.15)",
            borderBottom: "1px dashed rgba(45, 212, 191, 0.4)",
          }}
        />

        {/* 3 Step Targets */}
        <div
          style={{
            position: "relative",
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
            padding: "0 5%",
            zIndex: 2,
          }}
        >
          {LEVELS.map((item, idx) => {
            const isActive = item.id === level;
            return (
              <button
                key={item.id}
                onClick={() => onChange(item.id)}
                style={{
                  background: "transparent",
                  border: "none",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  cursor: "pointer",
                  padding: "0.5rem",
                  transition: "transform 140ms cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                }}
              >
                <div
                  style={{
                    width: isActive ? "20px" : "12px",
                    height: isActive ? "20px" : "12px",
                    borderRadius: "50%",
                    background: isActive ? "#2DD4BF" : "rgba(255, 255, 255, 0.3)",
                    border: isActive
                      ? "3px solid #0F172A"
                      : "1px solid rgba(255, 255, 255, 0.2)",
                    boxShadow: isActive ? "0 0 16px #2DD4BF" : "none",
                    transition: "all 200ms ease",
                  }}
                />
              </button>
            );
          })}
        </div>
      </div>

      {/* Labels Underneath */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "0.5rem",
          marginTop: "0.5rem",
          textAlign: "center",
        }}
      >
        {LEVELS.map((item) => {
          const isActive = item.id === level;
          return (
            <div
              key={item.id}
              onClick={() => onChange(item.id)}
              style={{
                cursor: "pointer",
                padding: "0.4rem 0.25rem",
                borderRadius: "6px",
                background: isActive ? "rgba(45, 212, 191, 0.08)" : "transparent",
                transition: "all 150ms ease",
              }}
            >
              <div
                style={{
                  fontSize: "0.825rem",
                  fontWeight: isActive ? 800 : 600,
                  color: isActive ? "#2DD4BF" : "rgba(255, 255, 255, 0.6)",
                  fontFamily: "var(--font-sans)",
                }}
              >
                {item.title}
              </div>
              <div
                style={{
                  fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
                  fontSize: "0.68rem",
                  color: isActive ? "#FFFFFF" : "rgba(255, 255, 255, 0.4)",
                  marginTop: "2px",
                }}
              >
                {item.tValue}
              </div>
            </div>
          );
        })}
      </div>

      {/* Dynamic Summary Footnote */}
      <div
        style={{
          marginTop: "1rem",
          paddingTop: "0.85rem",
          borderTop: "1px dashed rgba(255, 255, 255, 0.12)",
          fontSize: "0.8rem",
          color: "rgba(255, 255, 255, 0.75)",
          lineHeight: 1.5,
          fontStyle: "italic",
        }}
      >
        &ldquo;{LEVELS[currentIndex].desc}&rdquo;
      </div>
    </div>
  );
}
