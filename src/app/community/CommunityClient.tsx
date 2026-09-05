"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { CommunityMessage } from "@/lib/community-store";
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

const LEARNIVIA_CHANNELS = [
  { label: "Announcements", desc: "Official updates, system schedules, and announcements from Learnivia staff.", icon: "📢" },
  { label: "Introductions", desc: "Introduce yourself, share your grade, subjects of interest, and study goals.", icon: "👋" },
];

const COMMUNITY_CHANNELS = [
  { label: "General", desc: "Academic discussions, peer advice, study questions, and general community chat.", icon: "💬" },
  { label: "Ku201310 Homework Help", desc: "Ask questions, share solutions, and help fellow Ku201310 learners.", icon: "📚" },
  { label: "College Admissions Workshop Learners", desc: "College list curation, personal essay reviews, and admissions advice.", icon: "🎓" },
  { label: "Study Circles", desc: "Find study partners, group Zoom rooms, and accountability buddies.", icon: "📚" },
];

const EMOJI_SHORTCUTS = ["👍", "❤️", "📚", "🚀", "💡", "🔥", "🙌"];

export default function CommunityClient({ initialMessages, currentUser, initialChannel = "Announcements" }: Props) {
  const [activeChannel, setActiveChannel] = useState(initialChannel);
  const [messages, setMessages] = useState<CommunityMessage[]>(initialMessages);
  const [inputText, setInputText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const normalizedActive = activeChannel.toLowerCase() === "random" ? "general" : activeChannel.toLowerCase();

  const filteredMessages = activeChannel === "Home" 
    ? messages 
    : messages.filter((m) => {
        const mc = m.channel.toLowerCase() === "random" ? "general" : m.channel.toLowerCase();
        return mc === normalizedActive;
      });

  const currentChannelInfo = [...LEARNIVIA_CHANNELS, ...COMMUNITY_CHANNELS].find(
    (c) => c.label.toLowerCase() === normalizedActive || c.label.toLowerCase() === activeChannel.toLowerCase()
  );

  const isAnnouncements = activeChannel.toLowerCase() === "announcements";
  const canPostInCurrentChannel = !isAnnouncements || !!currentUser?.isAdmin;

  async function handleSendMessage(e?: React.FormEvent) {
    if (e) e.preventDefault();
    if (!inputText.trim() || isSubmitting) return;

    if (!currentUser) {
      setErrorMsg("Please sign in to post messages in the community.");
      return;
    }

    if (isAnnouncements && !currentUser.isAdmin) {
      setErrorMsg("Only platform administrators are permitted to post in #Announcements.");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg("");
    setSuccessMsg("");

    const targetChannel = activeChannel === "Home" ? "General" : (activeChannel === "Random" ? "General" : activeChannel);

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
        setSuccessMsg("Message posted.");
        setTimeout(() => setSuccessMsg(""), 3000);
      } else {
        setErrorMsg(data.error || "Failed to post message.");
      }
    } catch {
      setErrorMsg("Connection error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDeleteMessage(messageId: string) {
    if (!confirm("Are you sure you want to delete this message? This action is permanent.")) {
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
        alert(data.error || "Failed to delete message.");
        setMessages(previousList);
      } else {
        setSuccessMsg("Message removed successfully.");
        setTimeout(() => setSuccessMsg(""), 3000);
      }
    } catch {
      alert("Network error while deleting message.");
      setMessages(previousList);
    }
  }

  async function handleReportMessage(messageId: string) {
    if (!currentUser) {
      alert("Please sign in to report inappropriate content.");
      return;
    }

    const reason = prompt(
      "Report Message to Learnivia Moderation:\nPlease specify why this message should be reviewed (e.g., spam, contact sharing, inappropriate language, harassment):"
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
        alert("Thank you. This incident has been submitted to platform administrators for immediate review.");
      } else {
        alert(data.error || "Failed to submit report.");
      }
    } catch {
      alert("Network error while submitting report.");
    }
  }

  async function handleReaction(messageId: string, reactionType: "heart" | "clap" | "bulb" | "fire") {
    // Optimistic update
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
    <div className={styles.layout}>
      {/* Left Sub-Navigation */}
      <aside className={styles.channelNav} aria-label="Community channels">
        <button
          onClick={() => setActiveChannel("Home")}
          className={`${styles.channelHome} ${activeChannel === "Home" ? styles.channelHomeActive : ""}`}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
            <polyline points="9 22 9 12 15 12 15 22"/>
          </svg>
          Home Feed
        </button>

        {/* Learnivia Channels */}
        <div className={styles.channelGroup}>
          <div className={styles.channelGroupHeader}>
            <span>LEARNIVIA CHANNELS</span>
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M4 10l4-4 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          {LEARNIVIA_CHANNELS.map((c) => {
            const isSelected = activeChannel.toLowerCase() === c.label.toLowerCase();
            return (
              <button
                key={c.label}
                onClick={() => setActiveChannel(c.label)}
                className={`${styles.channelItem} ${isSelected ? styles.channelItemActive : ""}`}
              >
                <span className={styles.channelIcon}>{c.icon}</span>
                <span className={styles.channelNameText}>{c.label}</span>
              </button>
            );
          })}
        </div>

        {/* Community Channels */}
        <div className={styles.channelGroup}>
          <div className={styles.channelGroupHeader}>
            <span>COMMUNITY CHANNELS</span>
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M4 10l4-4 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          {COMMUNITY_CHANNELS.map((c) => {
            const isSelected = normalizedActive === c.label.toLowerCase();
            return (
              <button
                key={c.label}
                onClick={() => setActiveChannel(c.label)}
                className={`${styles.channelItem} ${isSelected ? styles.channelItemActive : ""}`}
              >
                <span className={styles.channelIcon}>{c.icon}</span>
                <span className={styles.channelNameText}>{c.label}</span>
              </button>
            );
          })}
        </div>
      </aside>

      {/* Main Live Content Feed */}
      <div className={styles.content}>
        {/* Top 3 Quick-Access Cards */}
        <div className={styles.topCards}>
          <Link href="/stories" className={styles.topCard}>
            <span className={styles.topCardIcon} style={{ background: "#FEF2F2", color: "#DC2626" }}>
              🪶
            </span>
            <span>Community Stories</span>
          </Link>
          <Link href="/about" className={styles.topCard}>
            <span className={styles.topCardIcon} style={{ background: "#EFF6FF", color: "#2563EB" }}>
              📰
            </span>
            <span>Learnivia Blog</span>
          </Link>
          <Link href="/sessions" className={styles.topCard}>
            <span className={styles.topCardIcon} style={{ background: "#FFFBEB", color: "#D97706" }}>
              🏆
            </span>
            <span>Active Study Circles</span>
          </Link>
        </div>

        {/* Admin Moderation Banner */}
        {currentUser?.isAdmin && (
          <div className={styles.adminModerationBanner}>
            <span className={styles.modBadge}>
              🛡️ <strong>Admin Moderation Active:</strong> You can delete any message instantly and review safety reports.
            </span>
            <Link href="/admin/reports" className={styles.modLink}>
              Incident Reports Dashboard →
            </Link>
          </div>
        )}

        {/* Toast / Notification Banner */}
        {successMsg && (
          <div style={{
            background: "#ECFDF5",
            border: "1px solid #A7F3D0",
            color: "#065F46",
            padding: "0.75rem 1.25rem",
            borderRadius: "12px",
            fontSize: "0.875rem",
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            gap: "0.5rem"
          }}>
            <span>✓</span> {successMsg}
          </div>
        )}

        {/* Channel Banner */}
        <div className={styles.channelBanner}>
          <div className={styles.bannerInfo}>
            <div className={styles.bannerTitleRow}>
              <span className={styles.channelHashtag}>#</span>
              <h1 className={styles.bannerTitle}>{activeChannel === "Random" ? "General" : activeChannel}</h1>
              <span className={styles.liveIndicator}>
                <span className={styles.liveDot} /> LIVE
              </span>
            </div>
            <p className={styles.bannerDesc}>
              {currentChannelInfo?.desc || "Explore all community discussions, questions, and updates."}
            </p>
          </div>
        </div>

        {/* Composer Card or Read-only Notice */}
        {currentUser ? (
          canPostInCurrentChannel ? (
            <form onSubmit={handleSendMessage} className={styles.composerCard}>
              <div className={styles.composerHeader}>
                <div className={styles.composerUser}>
                  <div className={styles.composerAvatar}>
                    {currentUser.name
                      ? currentUser.name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()
                      : "ME"}
                  </div>
                  <span className={styles.composerPrompt}>
                    Posting to <strong>#{activeChannel === "Home" ? "General" : (activeChannel === "Random" ? "General" : activeChannel)}</strong>
                  </span>
                </div>

                <div className={styles.composerQuickTags}>
                  <button
                    type="button"
                    className={styles.quickTag}
                    onClick={() => setInputText((prev) => prev + (prev ? " " : "") + "Question: ")}
                  >
                    ❓ Question
                  </button>
                  <button
                    type="button"
                    className={styles.quickTag}
                    onClick={() => setInputText((prev) => prev + (prev ? " " : "") + "Study Tip: ")}
                  >
                    💡 Tip
                  </button>
                  <button
                    type="button"
                    className={styles.quickTag}
                    onClick={() => setInputText((prev) => prev + (prev ? " " : "") + "Anyone want to study together for: ")}
                  >
                    🤝 Study Partner
                  </button>
                </div>
              </div>

              <textarea
                className={styles.composerTextarea}
                placeholder={`Share what you're working on, ask for advice, or post a resource in #${activeChannel === "Random" ? "General" : activeChannel}...`}
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
                <div className={styles.emojiShortcuts}>
                  {EMOJI_SHORTCUTS.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      className={styles.emojiBtn}
                      onClick={() => setInputText((prev) => prev + emoji)}
                      title={`Add ${emoji}`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>

                <div className={styles.composerActions}>
                  <span className={styles.shortcutHint}>Press ⌘+Enter to post</span>
                  <button
                    type="submit"
                    disabled={!inputText.trim() || isSubmitting}
                    className={styles.postBtn}
                  >
                    {isSubmitting ? "Posting..." : "Post Message 🚀"}
                  </button>
                </div>
              </div>

              <div style={{
                fontSize: "0.75rem",
                color: "#64748B",
                display: "flex",
                alignItems: "center",
                gap: "0.35rem",
                paddingTop: "0.5rem",
                borderTop: "1px solid #F1F5F9"
              }}>
                <span>🛡️</span>
                <span>Classroom standards apply. Moderated for member safety — no contact sharing, offensive language, or spam.</span>
              </div>

              {errorMsg && <p className={styles.errorText}>{errorMsg}</p>}
            </form>
          ) : (
            <div className={styles.readOnlyNotice}>
              🔒 <strong>Read-Only Channel:</strong> Official announcements are published exclusively by verified Learnivia staff.
              <br />
              <span style={{ fontSize: "0.8rem", color: "#64748B" }}>
                To ask questions, share tips, or discuss topics, switch to <strong>#General</strong> or <strong>#Study Circles</strong>.
              </span>
            </div>
          )
        ) : (
          <div className={styles.guestPromptCard}>
            <div>
              <h3>Join the conversation in #{activeChannel === "Random" ? "General" : activeChannel}</h3>
              <p>Sign in with Google to post questions, share resources, and connect with peer tutors.</p>
            </div>
            <button
              onClick={() => signIn("google", { callbackUrl: "/community" })}
              className={styles.guestSignInBtn}
            >
              Sign In to Post
            </button>
          </div>
        )}

        {/* Live Messages Feed */}
        <div className={styles.feedList}>
          {filteredMessages.length === 0 ? (
            <div className={styles.emptyFeed}>
              <div className={styles.emptyFeedIcon}>💬</div>
              <h3>No messages in #{activeChannel === "Random" ? "General" : activeChannel} yet</h3>
              <p>Be the first to start an academic discussion or share a study tip!</p>
            </div>
          ) : (
            filteredMessages.map((msg) => {
              const isAuthor = !!(currentUser?.email && msg.authorEmail.toLowerCase() === currentUser.email.toLowerCase());
              const canDelete = currentUser?.isAdmin || isAuthor;

              return (
                <article key={msg.id} className={styles.messageCard}>
                  <div className={styles.messageAvatar} style={{ background: msg.authorColor }}>
                    {msg.authorInitials}
                  </div>

                  <div className={styles.messageBody}>
                    <div className={styles.messageMeta}>
                      <span className={styles.messageAuthor}>{msg.authorName}</span>
                      <span className={styles.messageRole}>{msg.authorRole}</span>
                      <span className={styles.messageChannelTag}>#{msg.channel === "Random" ? "General" : msg.channel}</span>
                      <span className={styles.messageTime}>{msg.timestamp}</span>

                      {/* Moderation Actions */}
                      <div className={styles.modActionsRow}>
                        {canDelete && (
                          <button
                            type="button"
                            className={styles.deletePostBtn}
                            onClick={() => handleDeleteMessage(msg.id)}
                            title="Delete this message permanently"
                          >
                            🗑️ Delete
                          </button>
                        )}
                        {currentUser && !isAuthor && (
                          <button
                            type="button"
                            className={styles.reportPostBtn}
                            onClick={() => handleReportMessage(msg.id)}
                            title="Report this post to platform moderators"
                          >
                            🚩 Report
                          </button>
                        )}
                      </div>
                    </div>

                    <div className={styles.messageContent}>
                      {msg.content}
                    </div>

                    {/* Reaction buttons */}
                    <div className={styles.reactionsRow}>
                      <button
                        type="button"
                        className={styles.reactionBtn}
                        onClick={() => handleReaction(msg.id, "heart")}
                        title="Love this"
                      >
                        <span>❤️</span>
                        <span className={styles.reactionCount}>{msg.reactions.heart}</span>
                      </button>
                      <button
                        type="button"
                        className={styles.reactionBtn}
                        onClick={() => handleReaction(msg.id, "clap")}
                        title="Applause"
                      >
                        <span>👏</span>
                        <span className={styles.reactionCount}>{msg.reactions.clap}</span>
                      </button>
                      <button
                        type="button"
                        className={styles.reactionBtn}
                        onClick={() => handleReaction(msg.id, "bulb")}
                        title="Insightful"
                      >
                        <span>💡</span>
                        <span className={styles.reactionCount}>{msg.reactions.bulb}</span>
                      </button>
                      <button
                        type="button"
                        className={styles.reactionBtn}
                        onClick={() => handleReaction(msg.id, "fire")}
                        title="Awesome"
                      >
                        <span>🔥</span>
                        <span className={styles.reactionCount}>{msg.reactions.fire}</span>
                      </button>
                    </div>
                  </div>
                </article>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
