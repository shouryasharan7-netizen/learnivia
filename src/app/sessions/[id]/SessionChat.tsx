"use client";

import React, { useState, useEffect, useTransition } from "react";
import {
  MessageSquare,
  Send,
  BookOpen,
  FileText,
  ExternalLink,
  Plus,
  CheckCircle2,
  RefreshCw,
  FolderOpen,
} from "lucide-react";
import {
  getSessionChatMessages,
  sendSessionChatMessage,
  sharePostClassResource,
  type SessionChatMessage,
} from "@/app/actions/session-chat";

interface SessionChatProps {
  bookingId: string;
  isTutor: boolean;
  tutorName: string;
  studentName: string;
}

export function SessionChat({
  bookingId,
  isTutor,
  tutorName,
  studentName,
}: SessionChatProps) {
  const [messages, setMessages] = useState<SessionChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [inputMessage, setInputMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  // Resource sharing panel state
  const [showResourceModal, setShowResourceModal] = useState(false);
  const [resourceTitle, setResourceTitle] = useState("");
  const [resourceCategory, setResourceCategory] = useState(
    "Study Guide & Notes",
  );
  const [resourceContent, setResourceContent] = useState("");
  const [resourceError, setResourceError] = useState("");
  const [resourceSuccess, setResourceSuccess] = useState(false);

  const fetchMessages = async () => {
    try {
      const res = await getSessionChatMessages(bookingId);
      if (res.success && res.messages) {
        setMessages(res.messages);
      }
    } catch (err) {
      console.error("Failed to load session messages:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 7000);
    return () => clearInterval(interval);
  }, [bookingId]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || isPending) return;

    const textToSend = inputMessage.trim();
    setInputMessage("");

    startTransition(async () => {
      const res = await sendSessionChatMessage(bookingId, textToSend);
      if (res.success) {
        await fetchMessages();
      }
    });
  };

  const handleShareResource = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resourceTitle.trim() || !resourceContent.trim()) {
      setResourceError(
        "Please fill in both the title and the resource details or link.",
      );
      return;
    }

    setResourceError("");
    startTransition(async () => {
      const res = await sharePostClassResource(
        bookingId,
        resourceTitle,
        resourceContent,
        resourceCategory,
      );
      if (res.success) {
        setResourceSuccess(true);
        setResourceTitle("");
        setResourceContent("");
        setTimeout(() => {
          setResourceSuccess(false);
          setShowResourceModal(false);
        }, 1200);
        await fetchMessages();
      } else {
        setResourceError(res.error || "Failed to share resource");
      }
    });
  };

  const parseResourceShare = (content: string) => {
    if (!content.startsWith("[RESOURCE_SHARE]")) return null;
    const lines = content.split("\n");
    let category = "Study Resource";
    let title = "";
    let details = "";

    for (const line of lines) {
      if (line.startsWith("Category: "))
        category = line.replace("Category: ", "");
      else if (line.startsWith("Title: ")) title = line.replace("Title: ", "");
      else if (line.startsWith("Details: "))
        details = line.replace("Details: ", "");
    }

    return { category, title, details };
  };

  return (
    <div
      style={{
        background: "var(--wa-white, #FFFFFF)",
        border: "1px solid var(--wa-border, #E2E8F0)",
        borderRadius: "var(--wa-radius-md, 10px)",
        overflow: "hidden",
        boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
        marginTop: "1.5rem",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "1rem 1.25rem",
          background: "var(--wa-paper, #F8FAFC)",
          borderBottom: "1px solid var(--wa-border, #E2E8F0)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "0.75rem",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: "8px",
              background: "#EFF6FF",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--wa-green, #2563EB)",
            }}
          >
            <MessageSquare size={16} />
          </div>
          <div>
            <h3
              style={{
                fontSize: "0.9375rem",
                fontWeight: 700,
                color: "var(--wa-ink, #0F172A)",
                margin: 0,
              }}
            >
              Session Discussion &amp; Resources
            </h3>
            <p
              style={{
                fontSize: "0.75rem",
                color: "var(--wa-muted, #64748B)",
                margin: 0,
              }}
            >
              Direct private study circle for {studentName} and {tutorName}
            </p>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <button
            type="button"
            onClick={fetchMessages}
            title="Refresh messages"
            style={{
              padding: "0.4rem 0.6rem",
              background: "transparent",
              border: "1px solid var(--wa-border, #E2E8F0)",
              borderRadius: "6px",
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.35rem",
              fontSize: "0.75rem",
              color: "var(--wa-muted, #64748B)",
            }}
          >
            <RefreshCw size={13} />
            <span>Sync</span>
          </button>

          {isTutor && (
            <button
              type="button"
              onClick={() => setShowResourceModal(!showResourceModal)}
              style={{
                padding: "0.4rem 0.75rem",
                background: "var(--wa-green, #2563EB)",
                color: "#FFFFFF",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.4rem",
                fontSize: "0.75rem",
                fontWeight: 600,
              }}
            >
              <Plus size={14} />
              <span>Share Resource / Notes</span>
            </button>
          )}
        </div>
      </div>

      {/* Tutor Post-Class Resource Drawer */}
      {showResourceModal && isTutor && (
        <form
          onSubmit={handleShareResource}
          style={{
            padding: "1.25rem",
            background: "#F8FAFC",
            borderBottom: "1px solid var(--wa-border, #E2E8F0)",
            display: "flex",
            flexDirection: "column",
            gap: "0.75rem",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
            <FolderOpen size={16} color="var(--wa-green, #2563EB)" />
            <span
              style={{
                fontSize: "0.85rem",
                fontWeight: 700,
                color: "var(--wa-ink, #0F172A)",
              }}
            >
              Share Post-Class Notes &amp; Practice Materials
            </span>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "0.75rem",
            }}
          >
            <div>
              <label
                style={{
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  color: "var(--wa-muted, #64748B)",
                }}
              >
                Resource Title
              </label>
              <input
                type="text"
                value={resourceTitle}
                onChange={(e) => setResourceTitle(e.target.value)}
                placeholder="e.g. Quadratic Formula Cheat Sheet &amp; Steps"
                style={{
                  width: "100%",
                  padding: "0.45rem 0.65rem",
                  borderRadius: "6px",
                  border: "1px solid var(--wa-border, #E2E8F0)",
                  fontSize: "0.8125rem",
                  marginTop: "0.25rem",
                }}
                required
              />
            </div>

            <div>
              <label
                style={{
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  color: "var(--wa-muted, #64748B)",
                }}
              >
                Category
              </label>
              <select
                value={resourceCategory}
                onChange={(e) => setResourceCategory(e.target.value)}
                style={{
                  width: "100%",
                  padding: "0.45rem 0.65rem",
                  borderRadius: "6px",
                  border: "1px solid var(--wa-border, #E2E8F0)",
                  fontSize: "0.8125rem",
                  marginTop: "0.25rem",
                  background: "#FFFFFF",
                }}
              >
                <option value="Study Guide & Notes">
                  Study Guide &amp; Notes
                </option>
                <option value="Formula Sheet & Reference">
                  Formula Sheet &amp; Reference
                </option>
                <option value="Homework Practice Problems">
                  Homework Practice Problems
                </option>
                <option value="Recommended Video / Link">
                  Recommended Video / Link
                </option>
                <option value="Post-Session Feedback">
                  Post-Session Feedback
                </option>
              </select>
            </div>
          </div>

          <div>
            <label
              style={{
                fontSize: "0.75rem",
                fontWeight: 600,
                color: "var(--wa-muted, #64748B)",
              }}
            >
              Notes, Steps, or Resource URL
            </label>
            <textarea
              value={resourceContent}
              onChange={(e) => setResourceContent(e.target.value)}
              placeholder="Paste download links, key formulas, or specific practice questions to reinforce today's session..."
              rows={3}
              style={{
                width: "100%",
                padding: "0.5rem 0.65rem",
                borderRadius: "6px",
                border: "1px solid var(--wa-border, #E2E8F0)",
                fontSize: "0.8125rem",
                marginTop: "0.25rem",
                fontFamily: "inherit",
              }}
              required
            />
          </div>

          {resourceError && (
            <div style={{ fontSize: "0.75rem", color: "#DC2626" }}>
              {resourceError}
            </div>
          )}

          {resourceSuccess && (
            <div
              style={{
                fontSize: "0.75rem",
                color: "#166534",
                display: "flex",
                alignItems: "center",
                gap: "0.3rem",
              }}
            >
              <CheckCircle2 size={14} /> Shared with student!
            </div>
          )}

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "0.5rem",
            }}
          >
            <button
              type="button"
              onClick={() => setShowResourceModal(false)}
              style={{
                padding: "0.4rem 0.85rem",
                background: "transparent",
                border: "1px solid var(--wa-border, #E2E8F0)",
                borderRadius: "6px",
                fontSize: "0.75rem",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              style={{
                padding: "0.4rem 1rem",
                background: "var(--wa-green, #2563EB)",
                color: "#FFFFFF",
                border: "none",
                borderRadius: "6px",
                fontSize: "0.75rem",
                fontWeight: 600,
                cursor: isPending ? "not-allowed" : "pointer",
              }}
            >
              Post Resource
            </button>
          </div>
        </form>
      )}

      {/* Message Feed */}
      <div
        style={{
          padding: "1.25rem",
          minHeight: "220px",
          maxHeight: "380px",
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: "0.85rem",
          background: "#FFFFFF",
        }}
      >
        {loading ? (
          <div
            style={{
              textAlign: "center",
              padding: "2rem 0",
              color: "var(--wa-muted, #64748B)",
              fontSize: "0.8125rem",
            }}
          >
            Loading session discussion...
          </div>
        ) : messages.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "2.5rem 1rem",
              color: "var(--wa-muted, #64748B)",
            }}
          >
            <BookOpen
              size={28}
              color="#94A3B8"
              style={{ margin: "0 auto 0.5rem" }}
            />
            <div
              style={{
                fontSize: "0.875rem",
                fontWeight: 600,
                color: "var(--wa-ink, #0F172A)",
              }}
            >
              Session Discussion is Open
            </div>
            <p
              style={{
                fontSize: "0.8125rem",
                margin: "0.25rem auto 0",
                maxWidth: "380px",
                lineHeight: 1.5,
              }}
            >
              Use this private space to ask clarifying questions before class,
              share problem files, or review study notes together.
            </p>
          </div>
        ) : (
          messages.map((m) => {
            const resource = parseResourceShare(m.content);

            if (resource) {
              return (
                <div
                  key={m.id}
                  style={{
                    background: "#F0FDF4",
                    border: "1px solid #BBF7D0",
                    borderRadius: "8px",
                    padding: "1rem 1.15rem",
                    margin: "0.25rem 0",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: "0.4rem",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "0.6875rem",
                        fontWeight: 700,
                        textTransform: "uppercase",
                        color: "#166534",
                        background: "#DCFCE7",
                        padding: "0.15rem 0.5rem",
                        borderRadius: "4px",
                      }}
                    >
                      {resource.category}
                    </span>
                    <span
                      style={{
                        fontSize: "0.75rem",
                        color: "var(--wa-muted, #64748B)",
                      }}
                    >
                      Shared by {m.authorName}
                    </span>
                  </div>
                  <div
                    style={{
                      fontSize: "0.9375rem",
                      fontWeight: 700,
                      color: "#14532D",
                      marginBottom: "0.35rem",
                    }}
                  >
                    {resource.title}
                  </div>
                  <div
                    style={{
                      fontSize: "0.8125rem",
                      color: "#1E293B",
                      whiteSpace: "pre-wrap",
                      lineHeight: 1.5,
                    }}
                  >
                    {resource.details}
                  </div>
                </div>
              );
            }

            return (
              <div
                key={m.id}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: m.isCurrentUser ? "flex-end" : "flex-start",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.4rem",
                    marginBottom: "0.2rem",
                    fontSize: "0.75rem",
                    color: "var(--wa-muted, #64748B)",
                  }}
                >
                  <span
                    style={{ fontWeight: 600, color: "var(--wa-ink, #0F172A)" }}
                  >
                    {m.authorName}
                  </span>
                  <span>•</span>
                  <span>{m.authorRole}</span>
                </div>

                <div
                  style={{
                    maxWidth: "80%",
                    padding: "0.6rem 0.9rem",
                    borderRadius: m.isCurrentUser
                      ? "12px 12px 2px 12px"
                      : "12px 12px 12px 2px",
                    background: m.isCurrentUser
                      ? "var(--wa-green, #2563EB)"
                      : "#F1F5F9",
                    color: m.isCurrentUser
                      ? "#FFFFFF"
                      : "var(--wa-ink, #0F172A)",
                    fontSize: "0.85rem",
                    lineHeight: 1.45,
                    boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
                  }}
                >
                  {m.content}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Input form */}
      <form
        onSubmit={handleSendMessage}
        style={{
          padding: "0.75rem 1rem",
          background: "var(--wa-paper, #F8FAFC)",
          borderTop: "1px solid var(--wa-border, #E2E8F0)",
          display: "flex",
          alignItems: "center",
          gap: "0.6rem",
        }}
      >
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder={
            isTutor
              ? "Message your student or provide session follow-ups..."
              : "Message your tutor about homework or preparation..."
          }
          style={{
            flex: 1,
            padding: "0.6rem 0.85rem",
            borderRadius: "8px",
            border: "1px solid var(--wa-border, #E2E8F0)",
            fontSize: "0.85rem",
            outline: "none",
            background: "#FFFFFF",
          }}
        />
        <button
          type="submit"
          disabled={!inputMessage.trim() || isPending}
          style={{
            padding: "0.6rem 1.15rem",
            background: inputMessage.trim()
              ? "var(--wa-green, #2563EB)"
              : "#CBD5E1",
            color: "#FFFFFF",
            border: "none",
            borderRadius: "8px",
            fontWeight: 600,
            fontSize: "0.85rem",
            display: "inline-flex",
            alignItems: "center",
            gap: "0.4rem",
            cursor:
              inputMessage.trim() && !isPending ? "pointer" : "not-allowed",
            transition: "background 0.15s ease",
          }}
        >
          <Send size={15} />
          <span>Send</span>
        </button>
      </form>
    </div>
  );
}
