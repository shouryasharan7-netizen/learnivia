"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Search,
  MoreVertical,
  ChevronDown,
  Smile,
  Image as ImageIcon,
  Type,
  Mic,
  Send,
  Users,
  Shield,
  X,
  MessageSquare,
  Lock,
  ThumbsUp,
  Sparkles,
} from "lucide-react";
import type { MessageThread, ChatMessageItem } from "@/app/actions/messages";
import { sendThreadMessage, getThreadMessages } from "@/app/actions/messages";

interface MessagesClientProps {
  initialThreads: MessageThread[];
  currentUserId?: string;
}

export default function MessagesClient({
  initialThreads,
  currentUserId,
}: MessagesClientProps) {
  const [threads, setThreads] = useState<MessageThread[]>(initialThreads);
  const [selectedThreadId, setSelectedThreadId] = useState<string>(
    initialThreads[0]?.id || "",
  );
  const [messages, setMessages] = useState<ChatMessageItem[]>([]);
  const [inputText, setInputText] = useState("");
  const [filter, setFilter] = useState<"open" | "all">("open");
  const [searchQuery, setSearchQuery] = useState("");
  const [showBanner, setShowBanner] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const selectedThread = threads.find((t) => t.id === selectedThreadId);

  // Load messages whenever selectedThreadId changes
  useEffect(() => {
    if (!selectedThreadId) return;
    let active = true;
    setLoadingMessages(true);

    getThreadMessages(selectedThreadId)
      .then((res) => {
        if (active && res.success) {
          setMessages(res.messages);
        }
      })
      .finally(() => {
        if (active) setLoadingMessages(false);
      });

    return () => {
      active = false;
    };
  }, [selectedThreadId]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !selectedThreadId || sending) return;

    const text = inputText;
    setInputText("");
    setSending(true);

    // Optimistic message
    const tempId = `temp-${Date.now()}`;
    const optimisticMsg: ChatMessageItem = {
      id: tempId,
      authorName: "You",
      authorRole: "Student",
      authorInitials: "ME",
      authorColor: "#0D9488",
      content: text,
      createdAt: new Date().toISOString(),
      isCurrentUser: true,
    };
    setMessages((prev) => [...prev, optimisticMsg]);

    const res = await sendThreadMessage(selectedThreadId, text);
    setSending(false);

    if (res.success && res.message) {
      setMessages((prev) =>
        prev.map((m) => (m.id === tempId ? res.message! : m)),
      );
    } else if (res.error) {
      alert(res.error);
      setMessages((prev) => prev.filter((m) => m.id !== tempId));
    }
  };

  const handleAddReaction = (messageId: string, emoji: string) => {
    setMessages((prev) =>
      prev.map((msg) => {
        if (msg.id !== messageId) return msg;
        const current = msg.reactions || {};
        const count = current[emoji] || 0;
        return {
          ...msg,
          reactions: { ...current, [emoji]: count + 1 },
        };
      }),
    );
  };

  // Filter threads
  const filteredThreads = threads.filter((t) => {
    if (filter === "open" && t.isClosed) return false;
    if (searchQuery) {
      return (
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.lastMessageSnippet?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return true;
  });

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "calc(100vh - 52px)",
        background: "#F8FAFC",
        fontFamily: "var(--font-sans, sans-serif)",
      }}
    >
      {/* Top Yellow Announcement Banner Matching Image 3 */}
      {showBanner && (
        <div
          style={{
            background: "#FEF08A",
            borderBottom: "1px solid #FDE047",
            padding: "0.5rem 1.25rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "0.85rem",
            fontWeight: 500,
            color: "#854D0E",
            position: "relative",
          }}
        >
          <span>
            Register for the upcoming peer study sessions before spots fill up!{" "}
            <Link
              href="/find"
              style={{
                color: "#1E3A8A",
                fontWeight: 700,
                textDecoration: "underline",
                marginLeft: "0.25rem",
              }}
            >
              Browse Now
            </Link>
          </span>
          <button
            onClick={() => setShowBanner(false)}
            aria-label="Dismiss banner"
            style={{
              position: "absolute",
              right: "1rem",
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#854D0E",
              display: "flex",
              alignItems: "center",
            }}
          >
            <X size={15} />
          </button>
        </div>
      )}

      {/* Main Two-Pane Split Layout */}
      <div
        style={{
          display: "flex",
          flex: 1,
          overflow: "hidden",
        }}
      >
        {/* Left Column: My Messages & Threads List */}
        <aside
          style={{
            width: "360px",
            minWidth: "320px",
            maxWidth: "400px",
            background: "#FFFFFF",
            borderRight: "1px solid #E2E8F0",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: "1rem 1.25rem 0.75rem",
              borderBottom: "1px solid #F1F5F9",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <h1
              style={{
                fontSize: "1.25rem",
                fontWeight: 800,
                color: "#0F172A",
                margin: 0,
              }}
            >
              My Messages
            </h1>

            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as "open" | "all")}
                style={{
                  padding: "0.25rem 0.6rem",
                  fontSize: "0.8rem",
                  borderRadius: "6px",
                  border: "1px solid #CBD5E1",
                  background: "#FFFFFF",
                  color: "#334155",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                <option value="open">open</option>
                <option value="all">all</option>
              </select>

              <button
                aria-label="Options"
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#64748B",
                  padding: "4px",
                }}
              >
                <MoreVertical size={16} />
              </button>
            </div>
          </div>

          {/* Search Box */}
          <div style={{ padding: "0.75rem 1.25rem", borderBottom: "1px solid #F1F5F9" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                background: "#F1F5F9",
                borderRadius: "8px",
                padding: "0.4rem 0.75rem",
                gap: "0.5rem",
              }}
            >
              <Search size={15} color="#94A3B8" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search conversations..."
                style={{
                  border: "none",
                  background: "transparent",
                  outline: "none",
                  fontSize: "0.85rem",
                  width: "100%",
                  color: "#0F172A",
                }}
              />
            </div>
          </div>

          {/* Thread List */}
          <div
            style={{
              flex: 1,
              overflowY: "auto",
            }}
          >
            {filteredThreads.length === 0 ? (
              <div
                style={{
                  padding: "3rem 1.5rem",
                  textAlign: "center",
                  color: "#64748B",
                }}
              >
                <MessageSquare size={36} color="#CBD5E1" style={{ margin: "0 auto 0.75rem" }} />
                <p style={{ fontWeight: 600, fontSize: "0.9rem", margin: 0 }}>
                  No messages found
                </p>
                <p style={{ fontSize: "0.8rem", color: "#94A3B8", marginTop: "0.25rem" }}>
                  Chats are created when you book a session or message a tutor.
                </p>
              </div>
            ) : (
              filteredThreads.map((thread) => {
                const isSelected = thread.id === selectedThreadId;
                return (
                  <div
                    key={thread.id}
                    onClick={() => setSelectedThreadId(thread.id)}
                    style={{
                      padding: "0.875rem 1.25rem",
                      borderBottom: "1px solid #F1F5F9",
                      background: isSelected ? "#F0FDFA" : "#FFFFFF",
                      cursor: "pointer",
                      display: "flex",
                      gap: "0.75rem",
                      transition: "background 150ms ease",
                      borderLeft: isSelected ? "3px solid #0D9488" : "3px solid transparent",
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected) e.currentTarget.style.background = "#F8FAFC";
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected) e.currentTarget.style.background = "#FFFFFF";
                    }}
                  >
                    {/* Badge Icon */}
                    <div
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: "8px",
                        background:
                          thread.type === "workshop"
                            ? "#EFF6FF"
                            : thread.type === "session"
                              ? "#F0FDFA"
                              : "#FAF5FF",
                        border: `1px solid ${
                          thread.type === "workshop"
                            ? "#BFDBFE"
                            : thread.type === "session"
                              ? "#99F6E4"
                              : "#E9D5FF"
                        }`,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        color:
                          thread.type === "workshop"
                            ? "#1D4ED8"
                            : thread.type === "session"
                              ? "#0F766E"
                              : "#7E22CE",
                        fontSize: "0.625rem",
                        fontWeight: 800,
                      }}
                    >
                      <span>{thread.badgeText}</span>
                    </div>

                    {/* Content */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "baseline",
                          justifyContent: "space-between",
                          marginBottom: "0.2rem",
                        }}
                      >
                        <h2
                          style={{
                            margin: 0,
                            fontSize: "0.875rem",
                            fontWeight: 700,
                            color: "#0F172A",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            maxWidth: "180px",
                          }}
                        >
                          {thread.title}
                        </h2>
                        <span
                          style={{
                            fontSize: "0.7rem",
                            color: "#94A3B8",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {thread.lastMessageAt
                            ? new Date(thread.lastMessageAt).toLocaleDateString(undefined, {
                                month: "short",
                                day: "numeric",
                              })
                            : ""}
                        </span>
                      </div>

                      <p
                        style={{
                          margin: 0,
                          fontSize: "0.8rem",
                          color: isSelected ? "#0F766E" : "#64748B",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {thread.lastMessageAuthor ? `${thread.lastMessageAuthor}: ` : ""}
                        {thread.lastMessageSnippet || "No messages yet"}
                      </p>
                    </div>

                    {/* Unread / Status dot */}
                    {!thread.isClosed && (
                      <div
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          background: "#10B981",
                          alignSelf: "center",
                          flexShrink: 0,
                        }}
                      />
                    )}
                  </div>
                );
              })
            )}
          </div>
        </aside>

        {/* Right Column: Chat Conversation Stream Matching Image 3 */}
        <main
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            background: "#FFFFFF",
          }}
        >
          {selectedThread ? (
            <>
              {/* Chat Header */}
              <div
                style={{
                  height: "58px",
                  padding: "0 1.5rem",
                  borderBottom: "1px solid #E2E8F0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  background: "#FFFFFF",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: "6px",
                      background: "#0D9488",
                      color: "#FFFFFF",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 700,
                      fontSize: "0.75rem",
                    }}
                  >
                    {selectedThread.title.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h2
                      style={{
                        margin: 0,
                        fontSize: "0.95rem",
                        fontWeight: 800,
                        color: "#0F172A",
                      }}
                    >
                      {selectedThread.title}
                    </h2>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "0.875rem" }}>
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.3rem",
                      fontSize: "0.8rem",
                      color: "#64748B",
                      fontWeight: 600,
                    }}
                  >
                    <Users size={15} /> {selectedThread.memberCount}
                  </span>
                  <button
                    aria-label="Thread Settings"
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "#64748B",
                      padding: "4px",
                    }}
                  >
                    <MoreVertical size={18} />
                  </button>
                </div>
              </div>

              {/* Safety Disclaimer Banner Matching Image 3 */}
              <div
                style={{
                  background: "#F8FAFC",
                  borderBottom: "1px solid #F1F5F9",
                  padding: "0.55rem 1rem",
                  textAlign: "center",
                  fontSize: "0.75rem",
                  color: "#64748B",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.4rem",
                }}
              >
                <Shield size={13} color="#0D9488" />
                <span>
                  Messages are monitored by our volunteer safety team. Please do not share any personal
                  information including full name, email, location, and social media handles!
                </span>
              </div>

              {/* Scrollable Message History */}
              <div
                style={{
                  flex: 1,
                  overflowY: "auto",
                  padding: "1.25rem 1.5rem",
                  display: "flex",
                  flexDirection: "column",
                  gap: "1rem",
                }}
              >
                {loadingMessages ? (
                  <div
                    style={{
                      textAlign: "center",
                      padding: "2rem",
                      color: "#94A3B8",
                      fontSize: "0.85rem",
                    }}
                  >
                    Loading conversation...
                  </div>
                ) : messages.length === 0 ? (
                  <div
                    style={{
                      textAlign: "center",
                      padding: "3rem 1rem",
                      color: "#64748B",
                    }}
                  >
                    <Sparkles size={32} color="#0D9488" style={{ margin: "0 auto 0.5rem" }} />
                    <p style={{ fontWeight: 700, margin: 0 }}>Start the conversation</p>
                    <p style={{ fontSize: "0.8rem", color: "#94A3B8", marginTop: "0.25rem" }}>
                      Ask questions, coordinate session materials, or share study notes safely.
                    </p>
                  </div>
                ) : (
                  messages.map((msg) => (
                    <div
                      key={msg.id}
                      style={{
                        display: "flex",
                        gap: "0.75rem",
                        alignItems: "flex-start",
                      }}
                    >
                      {/* Avatar initials circle */}
                      <div
                        style={{
                          width: 34,
                          height: 34,
                          borderRadius: "50%",
                          background: msg.authorColor || "#2563EB",
                          color: "#FFFFFF",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "0.75rem",
                          fontWeight: 700,
                          flexShrink: 0,
                        }}
                      >
                        {msg.authorInitials || "U"}
                      </div>

                      {/* Content block */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "baseline",
                            gap: "0.5rem",
                            marginBottom: "0.25rem",
                          }}
                        >
                          <span
                            style={{
                              fontWeight: 700,
                              fontSize: "0.85rem",
                              color: "#0F172A",
                            }}
                          >
                            {msg.authorName}
                          </span>
                          <span
                            style={{
                              fontSize: "0.7rem",
                              color: "#94A3B8",
                            }}
                          >
                            {new Date(msg.createdAt).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>

                        {/* Message Bubble */}
                        <div
                          style={{
                            display: "inline-block",
                            background: msg.isCurrentUser ? "#F0FDFA" : "#F1F5F9",
                            border: `1px solid ${msg.isCurrentUser ? "#CCFBF1" : "#E2E8F0"}`,
                            borderRadius: "10px",
                            padding: "0.6rem 0.85rem",
                            fontSize: "0.875rem",
                            color: "#1E293B",
                            lineHeight: 1.5,
                            maxWidth: "85%",
                            wordBreak: "break-word",
                          }}
                        >
                          {msg.content}
                        </div>

                        {/* Emoji Reactions below bubble */}
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.35rem",
                            marginTop: "0.35rem",
                          }}
                        >
                          {msg.reactions &&
                            Object.entries(msg.reactions).map(([emoji, count]) => (
                              <button
                                key={emoji}
                                onClick={() => handleAddReaction(msg.id, emoji)}
                                style={{
                                  background: "#FFFFFF",
                                  border: "1px solid #E2E8F0",
                                  borderRadius: "12px",
                                  padding: "2px 6px",
                                  fontSize: "0.75rem",
                                  display: "inline-flex",
                                  alignItems: "center",
                                  gap: "0.25rem",
                                  cursor: "pointer",
                                }}
                              >
                                <span>{emoji}</span>
                                <span style={{ fontWeight: 700, color: "#475569" }}>{count}</span>
                              </button>
                            ))}
                          <button
                            onClick={() => handleAddReaction(msg.id, "👍")}
                            title="React with 👍"
                            style={{
                              background: "none",
                              border: "none",
                              cursor: "pointer",
                              color: "#94A3B8",
                              padding: "2px",
                              display: "inline-flex",
                              alignItems: "center",
                            }}
                          >
                            <ThumbsUp size={13} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Chat Input or Closed Status Banner Matching Image 3 */}
              {selectedThread.isClosed ? (
                <div
                  style={{
                    padding: "1rem",
                    textAlign: "center",
                    borderTop: "1px solid #E2E8F0",
                    background: "#F8FAFC",
                    color: "#64748B",
                    fontSize: "0.85rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.5rem",
                  }}
                >
                  <Lock size={15} />
                  <span>This chat has been closed.</span>
                </div>
              ) : (
                <form
                  onSubmit={handleSendMessage}
                  style={{
                    padding: "0.75rem 1.25rem",
                    borderTop: "1px solid #E2E8F0",
                    background: "#FFFFFF",
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.5rem",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      background: "#F8FAFC",
                      border: "1px solid #CBD5E1",
                      borderRadius: "8px",
                      padding: "0.5rem 0.75rem",
                      gap: "0.5rem",
                    }}
                  >
                    <input
                      type="text"
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      placeholder="Type a message..."
                      style={{
                        flex: 1,
                        border: "none",
                        background: "transparent",
                        outline: "none",
                        fontSize: "0.875rem",
                        color: "#0F172A",
                      }}
                    />

                    {/* Action buttons matching Image 3 toolbar */}
                    <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                      <button
                        type="button"
                        onClick={() => setInputText((prev) => prev + " 😊")}
                        aria-label="Add emoji"
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          color: "#64748B",
                          padding: "2px",
                        }}
                      >
                        <Smile size={18} />
                      </button>
                      <button
                        type="button"
                        aria-label="Attach file"
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          color: "#64748B",
                          padding: "2px",
                        }}
                      >
                        <ImageIcon size={18} />
                      </button>
                      <button
                        type="button"
                        aria-label="Text formatting"
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          color: "#64748B",
                          padding: "2px",
                        }}
                      >
                        <Type size={18} />
                      </button>
                      <button
                        type="button"
                        aria-label="Voice note"
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          color: "#64748B",
                          padding: "2px",
                        }}
                      >
                        <Mic size={18} />
                      </button>
                      <button
                        type="submit"
                        disabled={!inputText.trim() || sending}
                        aria-label="Send message"
                        style={{
                          background: inputText.trim() ? "#0D9488" : "#E2E8F0",
                          color: inputText.trim() ? "#FFFFFF" : "#94A3B8",
                          border: "none",
                          borderRadius: "6px",
                          width: 32,
                          height: 32,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: inputText.trim() ? "pointer" : "default",
                          transition: "background 150ms",
                        }}
                      >
                        <Send size={15} />
                      </button>
                    </div>
                  </div>
                </form>
              )}
            </>
          ) : (
            <div
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                color: "#64748B",
                padding: "2rem",
              }}
            >
              <MessageSquare size={48} color="#CBD5E1" style={{ marginBottom: "1rem" }} />
              <h2 style={{ fontSize: "1.1rem", fontWeight: 700, margin: 0, color: "#1E293B" }}>
                Select a conversation
              </h2>
              <p style={{ fontSize: "0.85rem", color: "#94A3B8", marginTop: "0.25rem" }}>
                Choose a session group chat or tutor conversation to start messaging.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
