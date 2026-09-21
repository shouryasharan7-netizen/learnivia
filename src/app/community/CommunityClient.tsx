"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { CommunityMessage } from "@/lib/community-store";
import { ROUTES } from "@/lib/routes";
import {
  Megaphone,
  UserPlus,
  MessageSquare,
  BookOpen,
  Atom,
  Users,
  Award,
  ShieldCheck,
  Lock,
  Trash2,
  Flag,
  Lightbulb,
  Send,
  CheckCircle2,
  Heart,
  Bookmark,
  Calculator,
  Clock,
  Compass,
  ArrowRight,
} from "lucide-react";
import styles from "./page.module.css";

interface Props {
  initialMessages: CommunityMessage[];
  currentUser: {
    id: string;
    name?: string | null;
    email?: string | null;
    role?: string;
    isAdmin?: boolean;
  } | null;
  initialChannel?: string;
}

interface TopicFilter {
  id: string;
  label: string;
  channel: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  description: string;
}

const TOPIC_FILTERS: TopicFilter[] = [
  {
    id: "all",
    label: "All Discussions",
    channel: "All",
    icon: MessageSquare,
    description: "Explore peer questions, study routines, and insights from across the student community.",
  },
  {
    id: "general",
    label: "General Discussion",
    channel: "General",
    icon: MessageSquare,
    description: "Open academic conversations, peer advice, and daily study reflections.",
  },
  {
    id: "math-science",
    label: "Math & Science",
    channel: "Math & Science Circles",
    icon: Calculator,
    description: "Peer problem-solving for mathematics, chemistry, physics, and biology.",
  },
  {
    id: "homework",
    label: "Homework Help",
    channel: "K-10 Homework Help",
    icon: BookOpen,
    description: "Ask questions, share walkthrough steps, and collaborate on assignments.",
  },
  {
    id: "study-circles",
    label: "Study Circles",
    channel: "Study Circles",
    icon: Users,
    description: "Connect with study partners, accountability groups, and review tables.",
  },
  {
    id: "introductions",
    label: "Introductions",
    channel: "Introductions",
    icon: UserPlus,
    description: "Introduce yourself, share your grade, and outline your study goals.",
  },
  {
    id: "announcements",
    label: "Announcements",
    channel: "Announcements",
    icon: Megaphone,
    description: "Official community updates, system schedules, and workshops from Learnivia.",
  },
];

export default function CommunityClient({
  initialMessages,
  currentUser,
  initialChannel = "All",
}: Props) {
  const [activeFilterId, setActiveFilterId] = useState<string>(() => {
    const match = TOPIC_FILTERS.find(
      (t) => t.channel.toLowerCase() === initialChannel.toLowerCase()
    );
    return match ? match.id : "all";
  });

  const [messages, setMessages] = useState<CommunityMessage[]>(initialMessages);
  const [inputText, setInputText] = useState("");
  const [postChannel, setPostChannel] = useState("General");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const activeTopic =
    TOPIC_FILTERS.find((t) => t.id === activeFilterId) || TOPIC_FILTERS[0];

  const filteredMessages =
    activeTopic.channel === "All"
      ? messages
      : messages.filter(
          (m) =>
            m.channel.toLowerCase() === activeTopic.channel.toLowerCase() ||
            (activeTopic.channel.toLowerCase() === "general" &&
              m.channel.toLowerCase() === "random")
        );

  const isAnnouncementsActive = activeTopic.channel.toLowerCase() === "announcements";
  const canPostInCurrentChannel = !isAnnouncementsActive || !!currentUser?.isAdmin;

  async function handleSendMessage(e?: React.FormEvent) {
    if (e) e.preventDefault();
    if (!inputText.trim() || isSubmitting) return;

    if (!currentUser) {
      setErrorMsg("Please sign in to post in the student community.");
      return;
    }

    const targetChannel =
      isAnnouncementsActive && currentUser.isAdmin
        ? "Announcements"
        : postChannel || "General";

    if (targetChannel.toLowerCase() === "announcements" && !currentUser.isAdmin) {
      setErrorMsg("Only platform administrators are permitted to post in Announcements.");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const res = await fetch("/api/community", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          channel: targetChannel,
          content: inputText.trim(),
        }),
      });

      const data = await res.json();
      if (res.ok && data.message) {
        setMessages((prev) => [data.message, ...prev]);
        setInputText("");
        setSuccessMsg("Discussion published to the community.");
        setTimeout(() => setSuccessMsg(""), 3000);
      } else {
        setErrorMsg(data.error || "Failed to post discussion.");
      }
    } catch {
      setErrorMsg("Connection error. Please check your network and try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDeleteMessage(messageId: string) {
    if (!confirm("Are you sure you want to delete this discussion post?")) {
      return;
    }

    const previousList = [...messages];
    setMessages((prev) => prev.filter((m) => m.id !== messageId));

    try {
      const res = await fetch(`/api/community?messageId=${encodeURIComponent(messageId)}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json();
        alert(data.error || "Failed to delete post.");
        setMessages(previousList);
      } else {
        setSuccessMsg("Post removed successfully.");
        setTimeout(() => setSuccessMsg(""), 3000);
      }
    } catch {
      alert("Network error while deleting post.");
      setMessages(previousList);
    }
  }

  async function handleReportMessage(messageId: string) {
    if (!currentUser) {
      alert("Please sign in to report inappropriate content.");
      return;
    }

    const reason = prompt(
      "Report Discussion to Learnivia Moderation:\nPlease specify why this post should be reviewed (e.g., spam, contact sharing, inappropriate language):"
    );

    if (!reason || !reason.trim()) return;

    try {
      const res = await fetch("/api/community", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "report",
          messageId,
          reason: reason.trim(),
        }),
      });

      const data = await res.json();
      if (res.ok) {
        alert("Thank you. This post has been submitted to platform moderators for review.");
      } else {
        alert(data.error || "Failed to submit report.");
      }
    } catch {
      alert("Network error while submitting report.");
    }
  }

  async function handleReaction(
    messageId: string,
    reactionType: "heart" | "clap" | "bulb" | "fire"
  ) {
    setMessages((prev) =>
      prev.map((msg) => {
        if (msg.id === messageId) {
          return {
            ...msg,
            reactions: {
              ...msg.reactions,
              [reactionType]: msg.reactions[reactionType] + 1,
            },
          };
        }
        return msg;
      })
    );

    try {
      await fetch("/api/community", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messageId, reactionType }),
      });
    } catch (err) {
      console.error("Reaction failed:", err);
    }
  }

  return (
    <div className={styles.academicContainer}>
      {/* 1. Academic Header */}
      <div className={styles.academicHeader}>
        <div>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.4rem",
              background: "#EFF6FF",
              color: "#2563EB",
              padding: "0.2rem 0.6rem",
              borderRadius: "4px",
              fontSize: "0.75rem",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            <ShieldCheck size={13} />
            <span>Student Discussion &amp; Peer Exchange</span>
          </div>
          <h1 className={styles.academicTitle}>Student Community Discussions</h1>
          <p className={styles.academicSubtitle}>
            Ask questions, collaborate on problem-solving steps, share study routines, and explore weekly academic topics in a safe, peer-moderated space.
          </p>
        </div>

        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", alignItems: "center" }}>
          <Link
            href={ROUTES.find}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.4rem",
              background: "var(--wa-white, #FFFFFF)",
              border: "1px solid var(--wa-border, #CBD5E1)",
              color: "var(--wa-ink, #0F172A)",
              padding: "0.5rem 1rem",
              borderRadius: "8px",
              fontSize: "0.8125rem",
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            <Compass size={14} color="#2563EB" />
            <span>Find a Tutor</span>
          </Link>
          <Link
            href={ROUTES.homeworkHelp}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.4rem",
              background: "var(--wa-forest, #2563EB)",
              color: "#FFFFFF",
              padding: "0.5rem 1rem",
              borderRadius: "8px",
              fontSize: "0.8125rem",
              fontWeight: 700,
              textDecoration: "none",
              boxShadow: "0 2px 8px rgba(37, 99, 235, 0.2)",
            }}
          >
            <span>Ask Homework Help</span>
            <ArrowRight size={13} />
          </Link>
        </div>
      </div>

      {/* Admin Moderation Notice */}
      {currentUser?.isAdmin && (
        <div className={styles.adminModerationBanner}>
          <span className={styles.modBadge}>
            <ShieldCheck size={16} aria-hidden="true" />
            <span>
              <strong>Moderator Oversight Active:</strong> You have full moderation rights to review and remove inappropriate posts.
            </span>
          </span>
          <Link href={ROUTES.admin.reports} className={styles.modLink}>
            Incident Reports Dashboard →
          </Link>
        </div>
      )}

      {/* Toast Notification */}
      {successMsg && (
        <div
          style={{
            background: "#F0FDF4",
            border: "1px solid #BBF7D0",
            color: "#16A34A",
            padding: "0.75rem 1.25rem",
            borderRadius: "8px",
            fontSize: "0.875rem",
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          <CheckCircle2 size={16} aria-hidden="true" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* 2. Topic Filter Tabs Bar */}
      <div className={styles.topicScrollRow} role="tablist" aria-label="Discussion Topics">
        {TOPIC_FILTERS.map((t) => {
          const Icon = t.icon;
          const isActive = activeFilterId === t.id;
          return (
            <button
              key={t.id}
              role="tab"
              aria-selected={isActive}
              onClick={() => {
                setActiveFilterId(t.id);
                if (t.channel !== "All") {
                  setPostChannel(t.channel);
                }
              }}
              className={`${styles.topicChip} ${isActive ? styles.topicChipActive : ""}`}
            >
              <Icon size={14} />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* 3. Main Two-Column Salon Grid */}
      <div className={styles.academicGrid}>
        {/* Left / Center: Main Discussion Feed Column */}
        <div className={styles.feedColumn}>
          {/* Pinned Socratic Roundtable Topic of the Week */}
          <div
            style={{
              background: "linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)",
              border: "1px solid #BFDBFE",
              borderRadius: "12px",
              padding: "1.25rem 1.5rem",
              display: "flex",
              flexDirection: "column",
              gap: "0.75rem",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.5rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <span
                  style={{
                    background: "#2563EB",
                    color: "#FFFFFF",
                    fontSize: "0.6875rem",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    padding: "0.2rem 0.55rem",
                    borderRadius: "4px",
                    letterSpacing: "0.05em",
                  }}
                >
                  Roundtable Topic of the Week
                </span>
                <span style={{ fontSize: "0.75rem", color: "#1E40AF", fontWeight: 600 }}>
                  Curated by Volunteer Mentors
                </span>
              </div>
              <span style={{ fontSize: "0.75rem", color: "#3B82F6", fontWeight: 600 }}>
                Weekly Prompt
              </span>
            </div>

            <div style={{ fontSize: "1.05rem", fontWeight: 700, color: "#1E3A8A", lineHeight: 1.45 }}>
              &ldquo;When tackling complex multi-step problems in math, science, or essay writing, what is your most effective method to trace errors without starting over?&rdquo;
            </div>

            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", alignItems: "center" }}>
              <button
                type="button"
                onClick={() => {
                  setInputText("On error tracing: I verify units and signs at each intermediate step: ");
                  setPostChannel("Math & Science Circles");
                }}
                style={{
                  background: "#FFFFFF",
                  color: "#1E40AF",
                  border: "1px solid #BFDBFE",
                  padding: "0.35rem 0.75rem",
                  borderRadius: "6px",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Reply with Unit Tracing
              </button>
              <button
                type="button"
                onClick={() => {
                  setInputText("My strategy: I explain each equation aloud using the Feynman Technique: ");
                  setPostChannel("General");
                }}
                style={{
                  background: "#FFFFFF",
                  color: "#1E40AF",
                  border: "1px solid #BFDBFE",
                  padding: "0.35rem 0.75rem",
                  borderRadius: "6px",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Reply with Feynman Method
              </button>
              <button
                type="button"
                onClick={() => {
                  setInputText("I test extreme boundary numbers (0, 1, or extremes) to verify the formula: ");
                  setPostChannel("Math & Science Circles");
                }}
                style={{
                  background: "#FFFFFF",
                  color: "#1E40AF",
                  border: "1px solid #BFDBFE",
                  padding: "0.35rem 0.75rem",
                  borderRadius: "6px",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Reply with Boundary Testing
              </button>
            </div>
          </div>

          {/* Interactive Discussion Composer */}
          {currentUser ? (
            canPostInCurrentChannel ? (
              <form onSubmit={handleSendMessage} className={styles.composerCard}>
                <div className={styles.composerHeader}>
                  <div className={styles.composerUser}>
                    <div className={styles.composerAvatar}>
                      {currentUser.name
                        ? currentUser.name
                            .split(" ")
                            .map((n) => n[0])
                            .slice(0, 2)
                            .join("")
                            .toUpperCase()
                        : "ME"}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <span className={styles.composerPrompt}>
                        Posting to
                      </span>
                      <select
                        value={postChannel}
                        onChange={(e) => setPostChannel(e.target.value)}
                        style={{
                          fontSize: "0.8125rem",
                          fontWeight: 600,
                          color: "var(--wa-ink, #0F172A)",
                          background: "#F1F5F9",
                          border: "1px solid #CBD5E1",
                          borderRadius: "6px",
                          padding: "0.2rem 0.5rem",
                          outline: "none",
                        }}
                      >
                        <option value="General">General Discussion</option>
                        <option value="Math & Science Circles">Math &amp; Science</option>
                        <option value="K-10 Homework Help">Homework Help</option>
                        <option value="Study Circles">Study Circles</option>
                        <option value="Introductions">Introductions</option>
                        {currentUser.isAdmin && <option value="Announcements">Announcements</option>}
                      </select>
                    </div>
                  </div>

                  <div className={styles.composerQuickTags}>
                    <button
                      type="button"
                      className={styles.quickTag}
                      onClick={() => setInputText((prev) => (prev ? `${prev} [Question]` : "[Question] "))}
                    >
                      <Lightbulb size={12} />
                      <span>Question</span>
                    </button>
                    <button
                      type="button"
                      className={styles.quickTag}
                      onClick={() => setInputText((prev) => (prev ? `${prev} [Study Tip]` : "[Study Tip] "))}
                    >
                      <Bookmark size={12} />
                      <span>Study Tip</span>
                    </button>
                    <button
                      type="button"
                      className={styles.quickTag}
                      onClick={() => setInputText((prev) => (prev ? `${prev} [Walkthrough]` : "[Walkthrough] "))}
                    >
                      <BookOpen size={12} />
                      <span>Walkthrough</span>
                    </button>
                  </div>
                </div>

                <textarea
                  className={styles.composerTextarea}
                  placeholder={`Share a concept question, study tip, or reflection on today's learning...`}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  rows={3}
                  onKeyDown={(e) => {
                    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
                      handleSendMessage();
                    }
                  }}
                />

                <div className={styles.composerFooter}>
                  <div
                    style={{
                      fontSize: "0.75rem",
                      color: "var(--wa-muted, #64748B)",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.35rem",
                    }}
                  >
                    <ShieldCheck size={14} aria-hidden="true" />
                    <span>Safe academic space. Never share phone numbers or personal contacts.</span>
                  </div>

                  <div className={styles.composerActions}>
                    <span className={styles.shortcutHint}>⌘+Enter</span>
                    <button
                      type="submit"
                      disabled={!inputText.trim() || isSubmitting}
                      className={styles.postBtn}
                    >
                      <Send size={13} aria-hidden="true" />
                      <span>{isSubmitting ? "Publishing..." : "Publish Discussion"}</span>
                    </button>
                  </div>
                </div>

                {errorMsg && <p className={styles.errorText}>{errorMsg}</p>}
              </form>
            ) : (
              <div className={styles.readOnlyNotice}>
                <div style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", fontWeight: 700, color: "var(--wa-ink, #0F172A)", marginBottom: "0.25rem" }}>
                  <Lock size={15} aria-hidden="true" />
                  <span>Official Announcements Channel</span>
                </div>
                <div>Official platform announcements are published exclusively by verified Learnivia staff.</div>
                <div style={{ fontSize: "0.75rem", color: "var(--wa-muted, #64748B)", marginTop: "0.35rem" }}>
                  To start a discussion or ask questions, switch to <strong>General Discussion</strong> or <strong>Math &amp; Science</strong>.
                </div>
              </div>
            )
          ) : (
            <div className={styles.guestPromptCard}>
              <div>
                <h3 style={{ margin: "0 0 0.25rem", fontSize: "1.05rem" }}>Join the Student Discussions</h3>
                <p style={{ margin: 0, fontSize: "0.875rem", color: "var(--wa-muted, #64748B)" }}>
                  Sign in to post questions, share study tips, and collaborate with peer tutors.
                </p>
              </div>
              <button
                onClick={() => signIn("google", { callbackUrl: "/community" })}
                className={styles.guestSignInBtn}
              >
                Sign In to Participate
              </button>
            </div>
          )}

          {/* Discussions Feed List */}
          <div className={styles.feedList}>
            {filteredMessages.length === 0 ? (
              <div className={styles.emptyFeed}>
                <MessageSquare size={32} strokeWidth={1.5} className={styles.emptyFeedIcon} aria-hidden="true" />
                <h3 style={{ margin: "0.5rem 0 0.25rem" }}>No discussions yet in {activeTopic.label}</h3>
                <p style={{ margin: 0 }}>Be the first student to post a question, study tip, or reflection.</p>
              </div>
            ) : (
              filteredMessages.map((msg) => {
                const isAuthor = !!(
                  currentUser?.email &&
                  msg.authorEmail.toLowerCase() === currentUser.email.toLowerCase()
                );
                const canDelete = currentUser?.isAdmin || isAuthor;

                return (
                  <article key={msg.id} className={styles.messageCard}>
                    <div
                      className={styles.messageAvatar}
                      style={{ background: msg.authorColor || "var(--wa-green, #2563EB)" }}
                    >
                      {msg.authorInitials}
                    </div>

                    <div className={styles.messageBody}>
                      <div className={styles.messageMeta}>
                        <span className={styles.messageAuthor}>{msg.authorName}</span>
                        <span className={styles.messageRole}>{msg.authorRole}</span>
                        <span className={styles.messageChannelTag}>
                          {msg.channel === "Random" ? "General" : msg.channel}
                        </span>
                        <span className={styles.messageTime}>
                          <Clock size={11} style={{ display: "inline", verticalAlign: "middle", marginRight: "3px" }} />
                          {msg.timestamp}
                        </span>

                        {/* Moderation Actions */}
                        <div className={styles.modActionsRow}>
                          {canDelete && (
                            <button
                              type="button"
                              className={styles.deletePostBtn}
                              onClick={() => handleDeleteMessage(msg.id)}
                              title="Delete this message"
                            >
                              <Trash2 size={12} aria-hidden="true" />
                              <span>Delete</span>
                            </button>
                          )}
                          {currentUser && !isAuthor && (
                            <button
                              type="button"
                              className={styles.reportPostBtn}
                              onClick={() => handleReportMessage(msg.id)}
                              title="Report this post to moderators"
                            >
                              <Flag size={12} aria-hidden="true" />
                              <span>Report</span>
                            </button>
                          )}
                        </div>
                      </div>

                      <div className={styles.messageContent}>{msg.content}</div>

                      {/* Reaction and Feedback Row */}
                      <div className={styles.reactionsRow}>
                        <button
                          type="button"
                          className={styles.reactionBtn}
                          onClick={() => handleReaction(msg.id, "bulb")}
                          title="Helpful"
                        >
                          <Lightbulb size={13} color="#D97706" aria-hidden="true" />
                          <span className={styles.reactionCount}>Helpful {msg.reactions.bulb > 0 ? `(${msg.reactions.bulb})` : ""}</span>
                        </button>
                        <button
                          type="button"
                          className={styles.reactionBtn}
                          onClick={() => handleReaction(msg.id, "heart")}
                          title="Thank Author"
                        >
                          <Heart size={13} fill="#DC2626" color="#DC2626" aria-hidden="true" />
                          <span className={styles.reactionCount}>Thank {msg.reactions.heart > 0 ? `(${msg.reactions.heart})` : ""}</span>
                        </button>
                        <button
                          type="button"
                          className={styles.reactionBtn}
                          onClick={() => handleReaction(msg.id, "fire")}
                          title="Inspiring"
                        >
                          <Award size={13} color="var(--wa-crimson, #2563EB)" aria-hidden="true" />
                          <span className={styles.reactionCount}>Inspiring {msg.reactions.fire > 0 ? `(${msg.reactions.fire})` : ""}</span>
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })
            )}
          </div>
        </div>

        {/* Right: Study Desk Sidebar */}
        <aside className={styles.sideColumn} aria-label="Community principles and study tools">
          {/* Card 1: Discussion Principles */}
          <div
            style={{
              background: "var(--wa-white, #FFFFFF)",
              border: "1px solid var(--wa-border, #E2E8F0)",
              borderRadius: "14px",
              padding: "1.25rem",
              boxShadow: "var(--wa-shadow-sm)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem" }}>
              <ShieldCheck size={18} color="#2563EB" />
              <h3 style={{ fontSize: "0.95rem", fontWeight: 700, color: "var(--wa-ink, #0F172A)", margin: 0 }}>
                Discussion Principles
              </h3>
            </div>
            <ul style={{ margin: 0, paddingLeft: "1.1rem", fontSize: "0.8125rem", color: "var(--wa-muted, #64748B)", lineHeight: 1.6, display: "flex", flexDirection: "column", gap: "0.4rem" }}>
              <li><strong>Be Patient &amp; Kind:</strong> Every student learns at their own pace. Encourage fellow peers.</li>
              <li><strong>Show Your Work:</strong> Share reasoning and steps, not just the final number or answer.</li>
              <li><strong>Protect Your Privacy:</strong> Never share phone numbers, social handles, or physical addresses.</li>
            </ul>
          </div>

          {/* Card 2: Need 1-on-1 Guidance */}
          <div
            style={{
              background: "var(--wa-white, #FFFFFF)",
              border: "1px solid var(--wa-border, #E2E8F0)",
              borderRadius: "14px",
              padding: "1.25rem",
              boxShadow: "var(--wa-shadow-sm)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
              <Compass size={18} color="#2563EB" />
              <h3 style={{ fontSize: "0.95rem", fontWeight: 700, color: "var(--wa-ink, #0F172A)", margin: 0 }}>
                Need 1-on-1 Help?
              </h3>
            </div>
            <p style={{ fontSize: "0.8125rem", color: "var(--wa-muted, #64748B)", margin: "0 0 0.85rem", lineHeight: 1.5 }}>
              Book a private, free 1-on-1 session with a certified high school or university peer tutor.
            </p>
            <Link
              href={ROUTES.find}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.35rem",
                fontSize: "0.8125rem",
                fontWeight: 700,
                color: "#2563EB",
                textDecoration: "none",
              }}
            >
              <span>Explore Tutor Directory</span>
              <ArrowRight size={13} />
            </Link>
          </div>

          {/* Card 3: Homework Help Queue */}
          <div
            style={{
              background: "var(--wa-white, #FFFFFF)",
              border: "1px solid var(--wa-border, #E2E8F0)",
              borderRadius: "14px",
              padding: "1.25rem",
              boxShadow: "var(--wa-shadow-sm)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
              <BookOpen size={18} color="#2563EB" />
              <h3 style={{ fontSize: "0.95rem", fontWeight: 700, color: "var(--wa-ink, #0F172A)", margin: 0 }}>
                Stuck on a Specific Problem?
              </h3>
            </div>
            <p style={{ fontSize: "0.8125rem", color: "var(--wa-muted, #64748B)", margin: "0 0 0.85rem", lineHeight: 1.5 }}>
              Submit your homework question to receive written step-by-step walkthroughs from certified tutors.
            </p>
            <Link
              href={ROUTES.homeworkHelp}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.35rem",
                fontSize: "0.8125rem",
                fontWeight: 700,
                color: "#2563EB",
                textDecoration: "none",
              }}
            >
              <span>Ask Homework Help</span>
              <ArrowRight size={13} />
            </Link>
          </div>

          {/* Card 4: Study Guides & Formula Sheets */}
          <div
            style={{
              background: "var(--wa-white, #FFFFFF)",
              border: "1px solid var(--wa-border, #E2E8F0)",
              borderRadius: "14px",
              padding: "1.25rem",
              boxShadow: "var(--wa-shadow-sm)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
              <Award size={18} color="#2563EB" />
              <h3 style={{ fontSize: "0.95rem", fontWeight: 700, color: "var(--wa-ink, #0F172A)", margin: 0 }}>
                Free Study Guides &amp; Tools
              </h3>
            </div>
            <p style={{ fontSize: "0.8125rem", color: "var(--wa-muted, #64748B)", margin: "0 0 0.85rem", lineHeight: 1.5 }}>
              Download formula cheat sheets, periodic tables, and essay outlines curated by peer tutors.
            </p>
            <Link
              href={ROUTES.resources}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.35rem",
                fontSize: "0.8125rem",
                fontWeight: 700,
                color: "#2563EB",
                textDecoration: "none",
              }}
            >
              <span>View Study Guides</span>
              <ArrowRight size={13} />
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
