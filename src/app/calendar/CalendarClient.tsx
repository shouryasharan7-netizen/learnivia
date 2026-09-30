"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Calendar as CalendarIcon,
  Video,
  Clock,
  User,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";
import { CalendarEmptyIllustration } from "./CalendarEmptyIllustration";

export interface CalendarSessionItem {
  id: string;
  title: string;
  subject: string;
  startTime: string;
  endTime: string;
  tutorName: string;
  tutorImage?: string | null;
  tutorSchool?: string | null;
  zoomLink?: string | null;
  status: "UPCOMING" | "COMPLETED" | "CANCELLED";
  isWorkshop?: boolean;
}

interface CalendarClientProps {
  upcomingSessions: CalendarSessionItem[];
  pastSessions: CalendarSessionItem[];
  defaultTab?: "upcoming" | "past";
}

export default function CalendarClient({
  upcomingSessions,
  pastSessions,
  defaultTab = "upcoming",
}: CalendarClientProps) {
  const [activeTab, setActiveTab] = useState<"upcoming" | "past">(defaultTab);

  return (
    <div
      style={{
        maxWidth: 1040,
        margin: "0 auto",
        padding: "1.5rem 1.5rem 4rem",
        fontFamily: "var(--font-sans, sans-serif)",
      }}
    >
      {/* Tab Navigation Matching Image 4 */}
      <div
        style={{
          display: "flex",
          gap: "2rem",
          borderBottom: "1px solid #E2E8F0",
          marginBottom: "2.5rem",
        }}
        role="tablist"
      >
        <button
          role="tab"
          aria-selected={activeTab === "upcoming"}
          onClick={() => setActiveTab("upcoming")}
          style={{
            background: "none",
            border: "none",
            padding: "0.75rem 0.25rem",
            fontSize: "1rem",
            fontWeight: activeTab === "upcoming" ? 700 : 500,
            color: activeTab === "upcoming" ? "#0F766E" : "#64748B",
            cursor: "pointer",
            position: "relative",
            transition: "color 150ms",
          }}
        >
          Upcoming
          {activeTab === "upcoming" && (
            <div
              style={{
                position: "absolute",
                bottom: -1,
                left: 0,
                right: 0,
                height: "3px",
                background: "#0D9488",
                borderRadius: "2px 2px 0 0",
              }}
            />
          )}
        </button>

        <button
          role="tab"
          aria-selected={activeTab === "past"}
          onClick={() => setActiveTab("past")}
          style={{
            background: "none",
            border: "none",
            padding: "0.75rem 0.25rem",
            fontSize: "1rem",
            fontWeight: activeTab === "past" ? 700 : 500,
            color: activeTab === "past" ? "#0F766E" : "#64748B",
            cursor: "pointer",
            position: "relative",
            transition: "color 150ms",
          }}
        >
          Past
          {activeTab === "past" && (
            <div
              style={{
                position: "absolute",
                bottom: -1,
                left: 0,
                right: 0,
                height: "3px",
                background: "#0D9488",
                borderRadius: "2px 2px 0 0",
              }}
            />
          )}
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === "upcoming" ? (
        upcomingSessions.length === 0 ? (
          /* Exact Empty State Matching Image 4 */
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "4rem 1rem 5rem",
              textAlign: "center",
            }}
          >
            <CalendarEmptyIllustration />

            <h1
              style={{
                fontSize: "1.35rem",
                fontWeight: 800,
                color: "#0F172A",
                margin: "1.5rem 0 0.5rem",
                letterSpacing: "-0.01em",
              }}
            >
              You don&apos;t have any upcoming sessions.
            </h1>

            <p
              style={{
                color: "#64748B",
                fontSize: "0.95rem",
                maxWidth: 420,
                lineHeight: 1.5,
                margin: "0 0 1.75rem",
              }}
            >
              Book a free 1-on-1 tutoring session with high school and university peers or explore group study workshops.
            </p>

            <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", justifyContent: "center" }}>
              <Link
                href="/find"
                style={{
                  background: "#0D9488",
                  color: "#FFFFFF",
                  padding: "0.7rem 1.4rem",
                  borderRadius: "8px",
                  fontWeight: 700,
                  fontSize: "0.9rem",
                  textDecoration: "none",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.4rem",
                }}
              >
                Find a Tutor <ArrowRight size={16} />
              </Link>

              <Link
                href="/find"
                style={{
                  background: "#FFFFFF",
                  border: "1px solid #CBD5E1",
                  color: "#334155",
                  padding: "0.7rem 1.4rem",
                  borderRadius: "8px",
                  fontWeight: 600,
                  fontSize: "0.9rem",
                  textDecoration: "none",
                }}
              >
                Explore Workshops
              </Link>
            </div>
          </div>
        ) : (
          /* Upcoming Sessions List */
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {upcomingSessions.map((session) => (
              <div
                key={session.id}
                style={{
                  background: "#FFFFFF",
                  borderRadius: "12px",
                  border: "1px solid #E2E8F0",
                  padding: "1.5rem",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                  flexWrap: "wrap",
                  gap: "1rem",
                }}
              >
                <div style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: "10px",
                      background: session.isWorkshop ? "#EFF6FF" : "#F0FDFA",
                      color: session.isWorkshop ? "#2563EB" : "#0D9488",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <BookOpen size={24} />
                  </div>

                  <div>
                    <span
                      style={{
                        fontSize: "0.75rem",
                        fontWeight: 700,
                        textTransform: "uppercase",
                        padding: "2px 8px",
                        borderRadius: "4px",
                        background: session.isWorkshop ? "#DBEAFE" : "#CCFBF1",
                        color: session.isWorkshop ? "#1E40AF" : "#0F766E",
                      }}
                    >
                      {session.isWorkshop ? "Group Workshop" : "1-on-1 Tutoring"}
                    </span>
                    <h3
                      style={{
                        margin: "0.4rem 0 0.2rem",
                        fontSize: "1.1rem",
                        fontWeight: 700,
                        color: "#0F172A",
                      }}
                    >
                      {session.title}
                    </h3>
                    <p style={{ margin: 0, fontSize: "0.85rem", color: "#64748B" }}>
                      Tutor: <strong>{session.tutorName}</strong> {session.tutorSchool ? `• ${session.tutorSchool}` : ""}
                    </p>
                    <p
                      style={{
                        margin: "0.4rem 0 0",
                        fontSize: "0.85rem",
                        color: "#0F766E",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.35rem",
                        fontWeight: 600,
                      }}
                    >
                      <Clock size={14} />
                      {new Date(session.startTime).toLocaleString(undefined, {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  {session.zoomLink ? (
                    <a
                      href={session.zoomLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        background: "#0D9488",
                        color: "#FFFFFF",
                        padding: "0.6rem 1.2rem",
                        borderRadius: "8px",
                        fontWeight: 700,
                        fontSize: "0.875rem",
                        textDecoration: "none",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.4rem",
                      }}
                    >
                      <Video size={16} /> Join Zoom
                    </a>
                  ) : (
                    <Link
                      href={`/sessions/${session.id}`}
                      style={{
                        background: "#0D9488",
                        color: "#FFFFFF",
                        padding: "0.6rem 1.2rem",
                        borderRadius: "8px",
                        fontWeight: 700,
                        fontSize: "0.875rem",
                        textDecoration: "none",
                      }}
                    >
                      View Details
                    </Link>
                  )}

                  <Link
                    href={`/messages`}
                    style={{
                      background: "#FFFFFF",
                      border: "1px solid #CBD5E1",
                      color: "#334155",
                      padding: "0.6rem 1rem",
                      borderRadius: "8px",
                      fontWeight: 600,
                      fontSize: "0.875rem",
                      textDecoration: "none",
                    }}
                  >
                    Chat
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        /* Past Tab Content */
        pastSessions.length === 0 ? (
          <div
            style={{
              padding: "4rem 1rem",
              textAlign: "center",
              color: "#64748B",
            }}
          >
            <CheckCircle2 size={44} color="#CBD5E1" style={{ margin: "0 auto 1rem" }} />
            <h2 style={{ fontSize: "1.2rem", fontWeight: 700, color: "#1E293B", margin: 0 }}>
              No completed sessions yet
            </h2>
            <p style={{ fontSize: "0.9rem", color: "#94A3B8", marginTop: "0.35rem" }}>
              Sessions you attend will be recorded here for volunteer verification and service credits.
            </p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {pastSessions.map((session) => (
              <div
                key={session.id}
                style={{
                  background: "#FFFFFF",
                  borderRadius: "12px",
                  border: "1px solid #E2E8F0",
                  padding: "1.25rem 1.5rem",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: "0.75rem",
                }}
              >
                <div>
                  <h3 style={{ margin: 0, fontSize: "1.05rem", fontWeight: 700, color: "#0F172A" }}>
                    {session.title}
                  </h3>
                  <p style={{ margin: "0.2rem 0 0", fontSize: "0.85rem", color: "#64748B" }}>
                    Tutor: {session.tutorName} • Completed on{" "}
                    {new Date(session.startTime).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>

                <span
                  style={{
                    background: "#F1F5F9",
                    color: "#475569",
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    padding: "4px 10px",
                    borderRadius: "9999px",
                  }}
                >
                  COMPLETED
                </span>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
}
