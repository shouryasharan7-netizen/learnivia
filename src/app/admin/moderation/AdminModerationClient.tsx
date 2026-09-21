"use client";

import { useState } from "react";
import {
  adminDeleteCommunityMessage,
  adminDeleteHomeworkRequest,
  adminBroadcastAnnouncement,
} from "../actions";
import { Megaphone, MessageSquare, HelpCircle, Trash2, CheckCircle2 } from "lucide-react";

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
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          <CheckCircle2 size={16} aria-hidden="true" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Official Announcement Publisher Card */}
      <div
        style={{
          background: "var(--wa-white)",
          borderRadius: "8px",
          border: "1px solid var(--wa-border)",
          padding: "1.5rem",
          marginBottom: "2rem",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
          <Megaphone size={18} style={{ color: "var(--wa-forest)" }} aria-hidden="true" />
          <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "1.125rem", fontWeight: 700, color: "var(--wa-ink)", margin: 0 }}>
            Broadcast Official Announcement
          </h2>
        </div>
        <p style={{ color: "var(--wa-muted)", fontSize: "0.85rem", marginBottom: "1rem" }}>
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
              borderRadius: "6px",
              border: "1px solid var(--wa-border)",
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
                background: "var(--wa-forest)",
                color: "var(--wa-paper)",
                padding: "0.5rem 1.25rem",
                borderRadius: "6px",
                fontWeight: 600,
                fontSize: "0.875rem",
                border: "none",
                cursor: !announcementText.trim() || isBroadcasting ? "not-allowed" : "pointer",
                opacity: !announcementText.trim() || isBroadcasting ? 0.6 : 1,
              }}
            >
              {isBroadcasting ? "Publishing..." : "Publish Announcement"}
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
            background: activeTab === "community" ? "var(--wa-forest)" : "var(--wa-white)",
            color: activeTab === "community" ? "var(--wa-paper)" : "var(--wa-muted)",
            border: "1px solid var(--wa-border)",
            padding: "0.5rem 1rem",
            borderRadius: "6px",
            fontWeight: 600,
            fontSize: "0.85rem",
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            gap: "0.4rem",
          }}
        >
          <MessageSquare size={14} aria-hidden="true" />
          <span>Community Messages ({messages.length})</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("homework")}
          style={{
            background: activeTab === "homework" ? "var(--wa-forest)" : "var(--wa-white)",
            color: activeTab === "homework" ? "var(--wa-paper)" : "var(--wa-muted)",
            border: "1px solid var(--wa-border)",
            padding: "0.5rem 1rem",
            borderRadius: "6px",
            fontWeight: 600,
            fontSize: "0.85rem",
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            gap: "0.4rem",
          }}
        >
          <HelpCircle size={14} aria-hidden="true" />
          <span>Homework Help Questions ({homework.length})</span>
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
                      fontWeight: 600,
                      cursor: "pointer",
                      whiteSpace: "nowrap",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.3rem",
                    }}
                    title="Delete this message immediately"
                  >
                    <Trash2 size={13} aria-hidden="true" />
                    <span>Delete</span>
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
                          background: "#EAF3ED",
                          color: "#C9922A",
                          fontSize: "0.75rem",
                          fontWeight: 700,
                          padding: "0.2rem 0.6rem",
                          borderRadius: "4px",
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
                      fontWeight: 600,
                      cursor: "pointer",
                      whiteSpace: "nowrap",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.3rem",
                    }}
                    title="Delete this question"
                  >
                    <Trash2 size={13} aria-hidden="true" />
                    <span>Delete</span>
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
