"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  ShieldCheck,
  Award,
  HeartHandshake,
  Clock,
  Sparkles,
  ArrowRight,
  BookOpen,
  Calculator,
  FlaskConical,
  Code,
  CheckCircle2,
  Users,
} from "lucide-react";

interface SubjectPreview {
  id: string;
  name: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  color: string;
  bg: string;
  targetAges: string;
  sampleTopic: string;
  sessionHighlight: string;
  mascotName: string;
  tag: string;
}

const SUBJECT_PREVIEWS: SubjectPreview[] = [
  {
    id: "math",
    name: "Mathematics",
    icon: Calculator,
    color: "#38BDF8",
    bg: "rgba(56, 189, 248, 0.12)",
    targetAges: "Grades K–10 & SAT Prep",
    sampleTopic: "Linear Equations, Quadratic Puzzles & Geometry",
    sessionHighlight: "Step-by-step whiteboard walkthroughs where tutors guide you without rushing.",
    mascotName: "Archie the Owl",
    tag: "High Demand",
  },
  {
    id: "science",
    name: "Sciences",
    icon: FlaskConical,
    color: "#34D399",
    bg: "rgba(52, 211, 153, 0.12)",
    targetAges: "Grades 5–10 (Bio, Chem, Physics)",
    sampleTopic: "Cellular Energy, Chemical Equations & Newton's Laws",
    sessionHighlight: "Intuitive real-life models that make abstract formulas feel tangible.",
    mascotName: "Pip the Curious Fox",
    tag: "Hands-on Inquiry",
  },
  {
    id: "writing",
    name: "English & Writing",
    icon: BookOpen,
    color: "#FBBF24",
    bg: "rgba(251, 191, 36, 0.12)",
    targetAges: "Grades 3–10 & PEEL Essays",
    sampleTopic: "Analytical Essays, Thesis Defense & Reading Rhythm",
    sessionHighlight: "Line-by-line constructive feedback to build persuasive, confident prose.",
    mascotName: "Barnaby the Bear",
    tag: "Writing Lab",
  },
  {
    id: "cs",
    name: "Coding & Logic",
    icon: Code,
    color: "#818CF8",
    bg: "rgba(129, 140, 248, 0.12)",
    targetAges: "Grades 6–10 & Beginners",
    sampleTopic: "Python Fundamentals, Loops & Algorithmic Puzzles",
    sessionHighlight: "Live collaborative code editor sessions with interactive debugging hints.",
    mascotName: "Sparky the Star",
    tag: "STEM Spotlight",
  },
];

const PILLARS = [
  {
    icon: ShieldCheck,
    title: "100% Free Forever",
    subtitle: "Zero Fees & No Hidden Costs",
    desc: "A genuine non-profit initiative. No subscriptions, no credit cards, and no payment gateways — ever.",
    accent: "#34D399",
  },
  {
    icon: Users,
    title: "Verified Peer Mentors",
    subtitle: "5-Tier Volunteer Screening",
    desc: "Every tutor is an accomplished high school or college scholar screened for academic strength and empathy.",
    accent: "#38BDF8",
  },
  {
    icon: HeartHandshake,
    title: "Guardian Peace of Mind",
    subtitle: "Full Parent Custody",
    desc: "Parents receive automated email attendance confirmations and can observe any live Zoom session at will.",
    accent: "#F472B6",
  },
  {
    icon: Award,
    title: "Certified Service Hours",
    subtitle: "Official Volunteer Recognition",
    desc: "Tutors earn verified service hour transcripts recognized for school graduation and honor societies.",
    accent: "#FBBF24",
  },
];

const SESSION_STAGES = [
  {
    min: "00–05 min",
    label: "Check-in & Goal Setting",
    text: "Friendly greeting, reviewing what you're stuck on, and agreeing on today's focus.",
  },
  {
    min: "05–25 min",
    label: "Interactive Guided Walkthrough",
    text: "Shared digital whiteboard, step-by-step logic, and breaking down tough concepts.",
  },
  {
    min: "25–35 min",
    label: "Active Student Practice",
    text: "You solve 2 problems with gentle, real-time guidance from your mentor.",
  },
  {
    min: "35–40 min",
    label: "Recap & Guardian Receipt",
    text: "Lesson summary saved; automated confirmation email sent to parents.",
  },
];

export default function ImpactStatsBar() {
  const [activeTab, setActiveTab] = useState<"flow" | "subjects" | "pillars">("flow");
  const [selectedSubject, setSelectedSubject] = useState<SubjectPreview>(SUBJECT_PREVIEWS[0]);

  return (
    <section
      style={{
        background: "linear-gradient(135deg, #071322 0%, #0d1e34 50%, #081628 100%)",
        padding: "5rem 2rem",
        position: "relative",
        overflow: "hidden",
        borderTop: "1px solid rgba(255, 255, 255, 0.08)",
        borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
      }}
    >
      {/* Blueprint grid background */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
          pointerEvents: "none",
        }}
      />

      <div style={{ maxWidth: "1120px", margin: "0 auto", position: "relative", zIndex: 1 }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              fontSize: "0.72rem",
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "#34D399",
              background: "rgba(52, 211, 153, 0.12)",
              border: "1px solid rgba(52, 211, 153, 0.28)",
              borderRadius: "9999px",
              padding: "0.35rem 0.9rem",
              marginBottom: "1rem",
            }}
          >
            <Sparkles size={13} />
            <span>Interactive Learning Blueprint</span>
          </div>

          <h2
            style={{
              fontSize: "clamp(1.85rem, 3.8vw, 2.6rem)",
              fontWeight: 800,
              color: "#ffffff",
              margin: "0 0 0.75rem",
              letterSpacing: "-0.03em",
              lineHeight: 1.2,
            }}
          >
            Designed for real understanding. Zero barriers.
          </h2>

          <p
            style={{
              fontSize: "1.05rem",
              color: "rgba(255, 255, 255, 0.65)",
              maxWidth: "600px",
              margin: "0 auto",
              lineHeight: 1.6,
            }}
          >
            Explore how our 1-on-1 peer sessions work, pick your subject focus, and see why families trust Learnivia for safe, compassionate learning.
          </p>
        </div>

        {/* Interactive Nav Pills */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "0.5rem",
            marginBottom: "2.5rem",
            flexWrap: "wrap",
          }}
        >
          {[
            { id: "flow", label: "⏱️ 40-Min Session Flow" },
            { id: "subjects", label: "📚 Subject Explorer" },
            { id: "pillars", label: "🛡️ 4 Non-Profit Commitments" },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                type="button"
                style={{
                  padding: "0.6rem 1.25rem",
                  borderRadius: "12px",
                  fontSize: "0.88rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 180ms ease",
                  border: isActive
                    ? "1px solid #34D399"
                    : "1px solid rgba(255, 255, 255, 0.12)",
                  background: isActive
                    ? "rgba(52, 211, 153, 0.18)"
                    : "rgba(255, 255, 255, 0.04)",
                  color: isActive ? "#ffffff" : "rgba(255, 255, 255, 0.7)",
                  boxShadow: isActive ? "0 4px 16px rgba(52, 211, 153, 0.2)" : "none",
                }}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Dynamic Interactive Content */}
        <AnimatePresence mode="wait">
          {activeTab === "flow" && (
            <motion.div
              key="flow"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                gap: "1.25rem",
              }}
            >
              {SESSION_STAGES.map((stage, idx) => (
                <div
                  key={stage.label}
                  style={{
                    background: "rgba(255, 255, 255, 0.04)",
                    borderRadius: "16px",
                    padding: "1.75rem 1.5rem",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                    backdropFilter: "blur(12px)",
                    position: "relative",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: "1rem",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "0.72rem",
                        fontWeight: 700,
                        color: "#34D399",
                        background: "rgba(52, 211, 153, 0.12)",
                        border: "1px solid rgba(52, 211, 153, 0.25)",
                        borderRadius: "9999px",
                        padding: "0.2rem 0.6rem",
                        fontVariantNumeric: "tabular-nums",
                      }}
                    >
                      {stage.min}
                    </span>
                    <span style={{ fontSize: "0.72rem", color: "rgba(255, 255, 255, 0.4)", fontWeight: 600 }}>
                      PHASE 0{idx + 1}
                    </span>
                  </div>
                  <h3
                    style={{
                      fontSize: "1.05rem",
                      fontWeight: 700,
                      color: "#ffffff",
                      margin: "0 0 0.5rem",
                      lineHeight: 1.35,
                    }}
                  >
                    {stage.label}
                  </h3>
                  <p
                    style={{
                      fontSize: "0.85rem",
                      color: "rgba(255, 255, 255, 0.65)",
                      lineHeight: 1.55,
                      margin: 0,
                    }}
                  >
                    {stage.text}
                  </p>
                </div>
              ))}
            </motion.div>
          )}

          {activeTab === "subjects" && (
            <motion.div
              key="subjects"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              {/* Subject selector tabs */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                  gap: "1rem",
                  marginBottom: "1.75rem",
                }}
              >
                {SUBJECT_PREVIEWS.map((sub) => {
                  const Icon = sub.icon;
                  const isSel = selectedSubject.id === sub.id;
                  return (
                    <button
                      key={sub.id}
                      onClick={() => setSelectedSubject(sub)}
                      type="button"
                      style={{
                        background: isSel ? "rgba(255, 255, 255, 0.08)" : "rgba(255, 255, 255, 0.03)",
                        border: isSel ? `1.5px solid ${sub.color}` : "1px solid rgba(255, 255, 255, 0.08)",
                        borderRadius: "14px",
                        padding: "1rem 1.25rem",
                        textAlign: "left",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.75rem",
                        transition: "all 150ms ease",
                      }}
                    >
                      <div
                        style={{
                          width: "36px",
                          height: "36px",
                          borderRadius: "10px",
                          background: sub.bg,
                          color: sub.color,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        <Icon size={18} />
                      </div>
                      <div>
                        <div style={{ fontSize: "0.92rem", fontWeight: 700, color: "#ffffff" }}>
                          {sub.name}
                        </div>
                        <div style={{ fontSize: "0.72rem", color: "rgba(255, 255, 255, 0.5)" }}>
                          {sub.tag}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Selected Subject Preview Card */}
              <div
                style={{
                  background: "rgba(255, 255, 255, 0.04)",
                  borderRadius: "20px",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  padding: "2rem",
                  display: "grid",
                  gridTemplateColumns: "1.2fr 1fr",
                  gap: "2rem",
                  alignItems: "center",
                }}
              >
                <div>
                  <div
                    style={{
                      display: "inline-block",
                      fontSize: "0.72rem",
                      fontWeight: 700,
                      color: selectedSubject.color,
                      background: selectedSubject.bg,
                      borderRadius: "6px",
                      padding: "0.25rem 0.65rem",
                      marginBottom: "0.75rem",
                    }}
                  >
                    Target Audience: {selectedSubject.targetAges}
                  </div>
                  <h3
                    style={{
                      fontSize: "1.35rem",
                      fontWeight: 800,
                      color: "#ffffff",
                      margin: "0 0 0.5rem",
                    }}
                  >
                    {selectedSubject.sampleTopic}
                  </h3>
                  <p
                    style={{
                      fontSize: "0.92rem",
                      color: "rgba(255, 255, 255, 0.7)",
                      lineHeight: 1.6,
                      margin: "0 0 1.25rem",
                    }}
                  >
                    {selectedSubject.sessionHighlight}
                  </p>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      fontSize: "0.82rem",
                      color: "rgba(255, 255, 255, 0.55)",
                    }}
                  >
                    <CheckCircle2 size={15} color="#34D399" />
                    <span>Learning Companion: <strong>{selectedSubject.mascotName}</strong></span>
                  </div>
                </div>

                <div
                  style={{
                    background: "rgba(0, 0, 0, 0.25)",
                    borderRadius: "14px",
                    padding: "1.5rem",
                    border: "1px solid rgba(255, 255, 255, 0.06)",
                    textAlign: "center",
                  }}
                >
                  <div style={{ fontSize: "0.82rem", color: "rgba(255, 255, 255, 0.6)", marginBottom: "0.5rem" }}>
                    Ready to explore sessions in this subject?
                  </div>
                  <div
                    style={{
                      fontSize: "1.1rem",
                      fontWeight: 700,
                      color: "#ffffff",
                      marginBottom: "1.25rem",
                    }}
                  >
                    Small groups &amp; 1-on-1 • 100% Free
                  </div>
                  <Link
                    href={`/find?subject=${encodeURIComponent(selectedSubject.name)}`}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "0.5rem",
                      background: selectedSubject.color,
                      color: "#071322",
                      padding: "0.65rem 1.4rem",
                      borderRadius: "10px",
                      fontWeight: 700,
                      fontSize: "0.88rem",
                      textDecoration: "none",
                      transition: "transform 150ms ease",
                    }}
                  >
                    <span>Browse {selectedSubject.name} Workshops</span>
                    <ArrowRight size={15} />
                  </Link>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "pillars" && (
            <motion.div
              key="pillars"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                gap: "1.25rem",
              }}
            >
              {PILLARS.map((pil) => {
                const Icon = pil.icon;
                return (
                  <div
                    key={pil.title}
                    style={{
                      background: "rgba(255, 255, 255, 0.04)",
                      borderRadius: "16px",
                      padding: "1.75rem 1.5rem",
                      border: "1px solid rgba(255, 255, 255, 0.08)",
                      backdropFilter: "blur(12px)",
                    }}
                  >
                    <div
                      style={{
                        width: "42px",
                        height: "42px",
                        borderRadius: "12px",
                        background: `${pil.accent}20`,
                        color: pil.accent,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        marginBottom: "1rem",
                      }}
                    >
                      <Icon size={20} />
                    </div>
                    <h3
                      style={{
                        fontSize: "1.1rem",
                        fontWeight: 700,
                        color: "#ffffff",
                        margin: "0 0 0.3rem",
                      }}
                    >
                      {pil.title}
                    </h3>
                    <div
                      style={{
                        fontSize: "0.78rem",
                        fontWeight: 600,
                        color: pil.accent,
                        marginBottom: "0.6rem",
                      }}
                    >
                      {pil.subtitle}
                    </div>
                    <p
                      style={{
                        fontSize: "0.85rem",
                        color: "rgba(255, 255, 255, 0.65)",
                        lineHeight: 1.55,
                        margin: 0,
                      }}
                    >
                      {pil.desc}
                    </p>
                  </div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <style>{`
        @media (max-width: 768px) {
          div[style*="gridTemplateColumns: 1.2fr 1fr"] {
            grid-template-columns: 1fr !important;
            gap: 1.5rem !important;
          }
        }
      `}</style>
    </section>
  );
}
