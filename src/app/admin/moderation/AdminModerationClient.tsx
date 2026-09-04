"use client";

import { useState } from "react";
import {
  adminDeleteCommunityMessage,
  adminDeleteHomeworkRequest,
  adminBroadcastAnnouncement,
} from "../actions";

interface MessageItem {
  id: string;
  channel: string;
  authorName: string;
  authorEmail: string | null;
  authorRole: string;
  content: string;
  createdAt: string;
}

interface HomeworkItem {
  id: string;
  subject: string;
  question: string;
  status: string;
  preferredFormat: string;
  studentName: string | null;
  createdAt: string;
}

interface Props {
  initialMessages: MessageItem[];
  initialHomework: HomeworkItem[];
}

export default function AdminModerationClient({ initialMessages, initialHomework }: Props) {
  const [messages, setMessages] = useState<MessageItem[]>(initialMessages);
  const [homework, setHomework] = useState<HomeworkItem[]>(initialHomework);
  const [announcementText, setAnnouncementText] = useState("");
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [activeTab, setActiveTab] = useState<"community" | "homework">("community");
  const [toastMsg, setToastMsg] = useState("");

  function showToast(msg: string) {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 3500);
  }

  async function handleBroadcast(e: React.FormEvent) {
    e.preventDefault();
    if (!announcementText.trim() || isBroadcasting) return;

    setIsBroadcasting(true);
    try {
      await adminBroadcastAnnouncement(announcementText.trim());
      setAnnouncementText("");
      showToast("Official announcement published to #Announcements.");
    } catch (err: any) {
      alert(err?.message || "Failed to broadcast announcement.");
    } finally {
      setIsBroadcasting(false);
    }
  }

  async function handleDeleteMessage(messageId: string) {
    if (!confirm("Permanently delete this community message?")) return;

    try {
      await adminDeleteCommunityMessage(messageId);
      setMessages((prev) => prev.filter((m) => m.id !== messageId));
      showToast("Community message removed.");
    } catch (err: any) {
      alert(err?.message || "Failed to delete message.");
    }
  }

  async function handleDeleteHomework(homeworkId: string) {
    if (!confirm("Permanently delete this homework request?")) return;

    try {
      await adminDeleteHomeworkRequest(homeworkId);
      setHomework((prev) => prev.filter((h) => h.id !== homeworkId));
      showToast("Homework inquiry removed.");
    } catch (err: any) {
      alert(err?.message || "Failed to delete homework request.");
    }
  }

  return (
    <div>
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "1.75rem", fontWeight: 800, color: "#0F172A", marginBottom: "0.5rem" }}>
          Content &amp; Community Moderation
        </h1>
        <p style={{ color: "#64748B", fontSize: "0.95rem", margin: 0 }}>
          Broadcast official announcements, purge inappropriate posts, and monitor homework inquiries.
        </p>
      </div>

      {toastMsg && (
        <div
          style={{
            background: "#ECFDF5",
            border: "1px solid #A7F3D0",
            color: "#065F46",
            padding: "0.75rem 1.25rem",
            borderRadius: "10px",
            marginBottom: "1.5rem",
            fontWeight: 600,
            fontSize: "0.875rem",
          }}
        >
          ✓ {toastMsg}
        </div>
      )}

      {/* Official Announcement Publisher Card */}
      <div
        style={{
          background: "#FFFFFF",
          borderRadius: "14px",
          border: "1px solid #E2E8F0",
          padding: "1.5rem",
          marginBottom: "2rem",
          boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
          <span style={{ fontSize: "1.25rem" }}>📢</span>
          <h2 style={{ fontSize: "1.125rem", fontWeight: 700, color: "#0F172A", margin: 0 }}>
            Broadcast Official Announcement
          </h2>
        </div>
        <p style={{ color: "#64748B", fontSize: "0.85rem", marginBottom: "1rem" }}>
          Posts directly to the verified <strong>#Announcements</strong> channel seen by all learners and tutors.
        </p>

        <form onSubmit={handleBroadcast}>
          <textarea
            value={announcementText}
            onChange={(e) => setAnnouncementText(e.target.value)}
            placeholder="Type your official announcement here (e.g. platform maintenance, new study circle series, system updates)..."
            rows={3}
            style={{
              width: "100%",
              padding: "0.75rem 1rem",
              borderRadius: "8px",
              border: "1px solid #CBD5E1",
              fontSize: "0.875rem",
              outline: "none",
              fontFamily: "inherit",
              resize: "vertical",
              marginBottom: "0.75rem",
            }}
          />
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button
              type="submit"
              disabled={!announcementText.trim() || isBroadcasting}
              style={{
                background: "#0E8345",
                color: "#FFFFFF",
                padding: "0.5rem 1.25rem",
                borderRadius: "8px",
                fontWeight: 700,
                fontSize: "0.875rem",
                border: "none",
                cursor: !announcementText.trim() || isBroadcasting ? "not-allowed" : "pointer",
                opacity: !announcementText.trim() || isBroadcasting ? 0.6 : 1,
              }}
            >
              {isBroadcasting ? "Publishing..." : "Publish Announcement 📢"}
            </button>
          </div>
        </form>
      </div>

      {/* Navigation Tabs */}
      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem" }}>
        <button
          type="button"
          onClick={() => setActiveTab("community")}
          style={{
            background: activeTab === "community" ? "#0F172A" : "#FFFFFF",
            color: activeTab === "community" ? "#FFFFFF" : "#475569",
            border: "1px solid #CBD5E1",
            padding: "0.5rem 1rem",
            borderRadius: "8px",
            fontWeight: 700,
            fontSize: "0.85rem",
            cursor: "pointer",
          }}
        >
          💬 Community Messages ({messages.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("homework")}
          style={{
            background: activeTab === "homework" ? "#0F172A" : "#FFFFFF",
            color: activeTab === "homework" ? "#FFFFFF" : "#475569",
            border: "1px solid #CBD5E1",
            padding: "0.5rem 1rem",
            borderRadius: "8px",
            fontWeight: 700,
            fontSize: "0.85rem",
            cursor: "pointer",
          }}
        >
          ❓ Homework Help Questions ({homework.length})
        </button>
      </div>

      {/* Community Messages Feed */}
      {activeTab === "community" && (
        <div style={{ background: "#FFFFFF", borderRadius: "14px", border: "1px solid #E2E8F0", padding: "1.5rem" }}>
          {messages.length === 0 ? (
            <p style={{ color: "#64748B", fontStyle: "italic" }}>No community messages found.</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {messages.map((m) => (
                <div
                  key={m.id}
                  style={{
                    padding: "1rem",
                    borderRadius: "10px",
                    background: "#F8FAFC",
                    border: "1px solid #F1F5F9",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    gap: "1rem",
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.35rem", flexWrap: "wrap" }}>
                      <span style={{ fontWeight: 700, color: "#0F172A" }}>{m.authorName}</span>
                      <span style={{ fontSize: "0.75rem", color: "#64748B" }}>({m.authorEmail})</span>
                      <span
                        style={{
                          background: "#E2E8F0",
                          color: "#475569",
                          fontSize: "0.7rem",
                          fontWeight: 700,
                          padding: "0.15rem 0.5rem",
                          borderRadius: "4px",
                        }}
                      >
                        #{m.channel}
                      </span>
                      <span style={{ fontSize: "0.75rem", color: "#94A3B8" }}>
                        {new Date(m.createdAt).toLocaleDateString()} {new Date(m.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                    <div style={{ fontSize: "0.9rem", color: "#334155", whiteSpace: "pre-wrap" }}>
                      {m.content}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDeleteMessage(m.id)}
                    style={{
                      background: "#FEE2E2",
                      color: "#991B1B",
                      border: "1px solid #FECACA",
                      padding: "0.35rem 0.65rem",
                      borderRadius: "6px",
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      cursor: "pointer",
                      whiteSpace: "nowrap",
                    }}
                    title="Delete this message immediately"
                  >
                    🗑️ Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Homework Questions Feed */}
      {activeTab === "homework" && (
        <div style={{ background: "#FFFFFF", borderRadius: "14px", border: "1px solid #E2E8F0", padding: "1.5rem" }}>
          {homework.length === 0 ? (
            <p style={{ color: "#64748B", fontStyle: "italic" }}>No homework inquiries recorded.</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {homework.map((h) => (
                <div
                  key={h.id}
                  style={{
                    padding: "1rem",
                    borderRadius: "10px",
                    background: "#F8FAFC",
                    border: "1px solid #F1F5F9",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    gap: "1rem",
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.35rem", flexWrap: "wrap" }}>
                      <span
                        style={{
                          background: "#F3E8FF",
                          color: "#7C3AED",
                          fontSize: "0.75rem",
                          fontWeight: 700,
                          padding: "0.2rem 0.6rem",
                          borderRadius: "999px",
                        }}
                      >
                        {h.subject}
                      </span>
                      <span style={{ fontWeight: 700, color: "#0F172A" }}>{h.studentName}</span>
                      <span
                        style={{
                          background: h.status === "ANSWERED" ? "#D1FAE5" : "#FEF3C7",
                          color: h.status === "ANSWERED" ? "#065F46" : "#B45309",
                          fontSize: "0.7rem",
                          fontWeight: 700,
                          padding: "0.15rem 0.5rem",
                          borderRadius: "4px",
                        }}
                      >
                        {h.status}
                      </span>
                      <span style={{ fontSize: "0.75rem", color: "#94A3B8" }}>
                        {new Date(h.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div style={{ fontSize: "0.9rem", color: "#334155", whiteSpace: "pre-wrap" }}>
                      {h.question}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDeleteHomework(h.id)}
                    style={{
                      background: "#FEE2E2",
                      color: "#991B1B",
                      border: "1px solid #FECACA",
                      padding: "0.35rem 0.65rem",
                      borderRadius: "6px",
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      cursor: "pointer",
                      whiteSpace: "nowrap",
                    }}
                    title="Delete this question"
                  >
                    🗑️ Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
