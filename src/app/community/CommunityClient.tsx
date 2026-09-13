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
  Newspaper,
  ShieldCheck,
  Lock,
  Trash2,
  Flag,
  HelpCircle,
  Lightbulb,
  Send,
  CheckCircle2,
  Heart,
  Sparkles,
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

const LEARNIVIA_CHANNELS = [
  {
    label: "Announcements",
    desc: "Official updates, system schedules, and announcements from Learnivia staff.",
    icon: Megaphone,
  },
  {
    label: "Introductions",
    desc: "Introduce yourself, share your grade, subjects of interest, and study goals.",
    icon: UserPlus,
  },
];

const COMMUNITY_CHANNELS = [
  {
    label: "General",
    desc: "Academic discussions, peer advice, study questions, and general community chat.",
    icon: MessageSquare,
  },
  {
    label: "K–10 Homework Help",
    desc: "Ask questions, share solutions, and help fellow K–10 learners.",
    icon: BookOpen,
  },
  {
    label: "Math & Science Circles",
    desc: "Peer study groups, visual explanations, and homework collaboration.",
    icon: Atom,
  },
  {
    label: "Study Circles",
    desc: "Find study partners, group Zoom rooms, and accountability buddies.",
    icon: Users,
  },
];

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
        setSuccessMsg("Message posted to community.");
        setTimeout(() => setSuccessMsg(""), 3000);
      } else {
        setErrorMsg(data.error || "Failed to post message.");
      }
    } catch {
      setErrorMsg("Connection error. Please check your network and try again.");
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
      <aside className={styles.channelNav} aria-label="Community study channels">
        <button
          onClick={() => setActiveChannel("Home")}
          className={`${styles.channelHome} ${activeChannel === "Home" ? styles.channelHomeActive : ""}`}
        >
          <MessageSquare size={16} aria-hidden="true" />
          <span>All Channels Feed</span>
        </button>

        {/* Learnivia Channels */}
        <div className={styles.channelGroup}>
          <div className={styles.channelGroupHeader}>
            <span>LEARNIVIA CHANNELS</span>
          </div>
          {LEARNIVIA_CHANNELS.map((c) => {
            const isSelected = activeChannel.toLowerCase() === c.label.toLowerCase();
            const Icon = c.icon;
            return (
              <button
                key={c.label}
                onClick={() => setActiveChannel(c.label)}
                className={`${styles.channelItem} ${isSelected ? styles.channelItemActive : ""}`}
              >
                <span className={styles.channelIcon}>
                  <Icon size={15} aria-hidden="true" />
                </span>
                <span className={styles.channelNameText}>{c.label}</span>
              </button>
            );
          })}
        </div>

        {/* Community Channels */}
        <div className={styles.channelGroup}>
          <div className={styles.channelGroupHeader}>
            <span>COMMUNITY CHANNELS</span>
          </div>
          {COMMUNITY_CHANNELS.map((c) => {
            const isSelected = normalizedActive === c.label.toLowerCase();
            const Icon = c.icon;
            return (
              <button
                key={c.label}
                onClick={() => setActiveChannel(c.label)}
                className={`${styles.channelItem} ${isSelected ? styles.channelItemActive : ""}`}
              >
                <span className={styles.channelIcon}>
                  <Icon size={15} aria-hidden="true" />
                </span>
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
          <Link href={ROUTES.stories} className={styles.topCard}>
            <span className={styles.topCardIcon} style={{ background: "var(--wa-contrast, #F3EFE8)", color: "var(--wa-ink, #1C1917)" }}>
              <BookOpen size={15} aria-hidden="true" />
            </span>
            <span>Learner Stories</span>
          </Link>
          <Link href={ROUTES.about} className={styles.topCard}>
            <span className={styles.topCardIcon} style={{ background: "var(--wa-contrast, #F3EFE8)", color: "var(--wa-ink, #1C1917)" }}>
              <Newspaper size={15} aria-hidden="true" />
            </span>
            <span>Platform Updates</span>
          </Link>
          <Link href={ROUTES.learner.mySessions} className={styles.topCard}>
            <span className={styles.topCardIcon} style={{ background: "var(--wa-contrast, #F3EFE8)", color: "var(--wa-ink, #1C1917)" }}>
              <Award size={15} aria-hidden="true" />
            </span>
            <span>Active Study Circles</span>
          </Link>
        </div>

        {/* Admin Moderation Banner */}
        {currentUser?.isAdmin && (
          <div className={styles.adminModerationBanner}>
            <span className={styles.modBadge}>
              <ShieldCheck size={16} aria-hidden="true" />
              <span><strong>Admin Moderation Active:</strong> You can delete any message instantly and review safety reports.</span>
            </span>
            <Link href={ROUTES.admin.reports} className={styles.modLink}>
              Incident Reports Dashboard →
            </Link>
          </div>
        )}

        {/* Toast / Notification Banner */}
        {successMsg && (
          <div style={{
            background: "var(--wa-green-light, #EAF2EE)",
            border: "1px solid #C6DEC6",
            color: "var(--wa-green, #1B4D3E)",
            padding: "0.75rem 1.25rem",
            borderRadius: "var(--wa-radius-sm, 8px)",
            fontSize: "0.875rem",
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            gap: "0.5rem"
          }}>
            <CheckCircle2 size={16} aria-hidden="true" />
            <span>{successMsg}</span>
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
              {currentChannelInfo?.desc || "Explore community discussions, study advice, and questions from fellow learners."}
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
                    <HelpCircle size={12} aria-hidden="true" />
                    <span>Question</span>
                  </button>
                  <button
                    type="button"
                    className={styles.quickTag}
                    onClick={() => setInputText((prev) => prev + (prev ? " " : "") + "Study Tip: ")}
                  >
                    <Lightbulb size={12} aria-hidden="true" />
                    <span>Study Tip</span>
                  </button>
                  <button
                    type="button"
                    className={styles.quickTag}
                    onClick={() => setInputText((prev) => prev + (prev ? " " : "") + "Looking for study partner: ")}
                  >
                    <Users size={12} aria-hidden="true" />
                    <span>Study Partner</span>
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
                <div style={{
                  fontSize: "0.75rem",
                  color: "var(--wa-muted, #78716C)",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.35rem",
                }}>
                  <ShieldCheck size={14} aria-hidden="true" />
                  <span>Classroom standards apply. Moderated for child safety.</span>
                </div>

                <div className={styles.composerActions}>
                  <span className={styles.shortcutHint}>⌘+Enter</span>
                  <button
                    type="submit"
                    disabled={!inputText.trim() || isSubmitting}
                    className={styles.postBtn}
                  >
                    <Send size={13} aria-hidden="true" />
                    <span>{isSubmitting ? "Posting..." : "Post Message"}</span>
                  </button>
                </div>
              </div>

              {errorMsg && <p className={styles.errorText}>{errorMsg}</p>}
            </form>
          ) : (
            <div className={styles.readOnlyNotice}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", fontWeight: 700, color: "var(--wa-ink, #1C1917)", marginBottom: "0.25rem" }}>
                <Lock size={15} aria-hidden="true" />
                <span>Read-Only Channel</span>
              </div>
              <div>Official announcements are published exclusively by verified Learnivia staff.</div>
              <div style={{ fontSize: "0.75rem", color: "var(--wa-muted, #78716C)", marginTop: "0.35rem" }}>
                To ask questions or collaborate, switch to <strong>#General</strong> or <strong>#Study Circles</strong>.
              </div>
            </div>
          )
        ) : (
          <div className={styles.guestPromptCard}>
            <div>
              <h3>Join the conversation in #{activeChannel === "Random" ? "General" : activeChannel}</h3>
              <p>Sign in to post questions, share resources, and connect with peer tutors.</p>
            </div>
            <button
              onClick={() => signIn("google", { callbackUrl: "/community" })}
              className={styles.guestSignInBtn}
            >
              Sign In to Participate
            </button>
          </div>
        )}

        {/* Live Messages Feed */}
        <div className={styles.feedList}>
          {filteredMessages.length === 0 ? (
            <div className={styles.emptyFeed}>
              <MessageSquare size={32} strokeWidth={1.5} className={styles.emptyFeedIcon} aria-hidden="true" />
              <h3>No messages in #{activeChannel === "Random" ? "General" : activeChannel} yet</h3>
              <p>Be the first to start an academic discussion or share a study tip.</p>
            </div>
          ) : (
            filteredMessages.map((msg) => {
              const isAuthor = !!(currentUser?.email && msg.authorEmail.toLowerCase() === currentUser.email.toLowerCase());
              const canDelete = currentUser?.isAdmin || isAuthor;

              return (
                <article key={msg.id} className={styles.messageCard}>
                  <div className={styles.messageAvatar} style={{ background: msg.authorColor || "var(--wa-green, #1B4D3E)" }}>
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
                            <Trash2 size={12} aria-hidden="true" />
                            <span>Delete</span>
                          </button>
                        )}
                        {currentUser && !isAuthor && (
                          <button
                            type="button"
                            className={styles.reportPostBtn}
                            onClick={() => handleReportMessage(msg.id)}
                            title="Report this post to platform moderators"
                          >
                            <Flag size={12} aria-hidden="true" />
                            <span>Report</span>
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
                        title="Helpful"
                      >
                        <Heart size={12} fill="#DC2626" color="#DC2626" aria-hidden="true" />
                        <span className={styles.reactionCount}>{msg.reactions.heart}</span>
                      </button>
                      <button
                        type="button"
                        className={styles.reactionBtn}
                        onClick={() => handleReaction(msg.id, "bulb")}
                        title="Insightful"
                      >
                        <Lightbulb size={12} color="#D97706" aria-hidden="true" />
                        <span className={styles.reactionCount}>{msg.reactions.bulb}</span>
                      </button>
                      <button
                        type="button"
                        className={styles.reactionBtn}
                        onClick={() => handleReaction(msg.id, "fire")}
                        title="Inspiring"
                      >
                        <Sparkles size={12} color="var(--wa-green, #1B4D3E)" aria-hidden="true" />
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
