import Link from "next/link";
import { auth } from "@/auth";
import styles from "./page.module.css";

export const metadata = {
  title: "Community — Learnivia",
  description: "Connect with the Learnivia learning community. Read stories, check leaderboards, and join community discussions.",
};

const SCHOOLHOUSE_CHANNELS = [
  { label: "Announcements", icon: "📢" },
  { label: "Introductions", icon: "👋" },
];

const COMMUNITY_CHANNELS = [
  { label: "Random", icon: "💬" },
  { label: "SAT Bootcamp Learners", icon: "💬" },
  { label: "College Admissions Workshop Learners", icon: "💬" },
  { label: "Study Circles", icon: "💬" },
];

export default async function CommunityPage() {
  const session = await auth();
  return (
    <main className={styles.main}>
      <div className={styles.layout}>
        {/* Left sub-navigation */}
        <aside className={styles.channelNav} aria-label="Community channels">
          {/* Home (active) */}
          <Link href="/community" className={`${styles.channelHome} ${styles.channelHomeActive}`}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
              <polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
            Home
          </Link>

          {/* Learnivia Channels */}
          <div className={styles.channelGroup}>
            <button className={styles.channelGroupHeader} aria-expanded="true">
              <span>Learnivia Channels</span>
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M4 10l4-4 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            {SCHOOLHOUSE_CHANNELS.map((c) => (
              <Link key={c.label} href="/community" className={styles.channelItem}>
                <span className={styles.channelIcon}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
                  </svg>
                </span>
                {c.label}
              </Link>
            ))}
          </div>

          {/* Community Channels */}
          <div className={styles.channelGroup}>
            <button className={styles.channelGroupHeader} aria-expanded="true">
              <span>Community Channels</span>
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M4 10l4-4 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            {COMMUNITY_CHANNELS.map((c) => (
              <Link key={c.label} href="/community" className={styles.channelItem}>
                <span className={styles.channelIcon}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
                  </svg>
                </span>
                {c.label}
              </Link>
            ))}
          </div>
        </aside>

        {/* Main content */}
        <div className={styles.content}>
          <h1 className={styles.pageTitle}>Community</h1>

          {/* Top 3 quick-access cards */}
          <div className={styles.topCards}>
            <Link href="/stories" className={styles.topCard}>
              <span className={styles.topCardIcon} style={{ background: "#FEF2F2", color: "#DC2626" }}>
                🪶
              </span>
              Community Stories
            </Link>
            <Link href="/about" className={styles.topCard}>
              <span className={styles.topCardIcon} style={{ background: "#EFF6FF", color: "#2563EB" }}>
                📰
              </span>
              Learnivia Blog
            </Link>
            <Link href="/community/leaderboards" className={styles.topCard}>
              <span className={styles.topCardIcon} style={{ background: "#FFFBEB", color: "#D97706" }}>
                🏆
              </span>
              Leaderboards
            </Link>
          </div>

          {/* Feed placeholder */}
          <div className={styles.feed}>
            <div className={styles.feedEmpty}>
              <div className={styles.feedEmptyIcon} aria-hidden="true">💬</div>
              <h2 className={styles.feedEmptyTitle}>
                {session?.user ? `Welcome, ${session.user.name?.split(" ")[0]}!` : "Welcome to the Learnivia Community!"}
              </h2>
              <p className={styles.feedEmptyDesc}>
                This is your space to connect with tutors and students, share updates, and celebrate learning milestones.
              </p>
              {session?.user ? (
                <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.5rem" }}>
                  <Link href="/sessions" className={styles.joinBtn}>
                    Explore Live Sessions →
                  </Link>
                  <Link href="/stories" className={styles.joinBtn} style={{ background: "#F1F5F9", color: "#1A1F2E" }}>
                    Read Stories
                  </Link>
                </div>
              ) : (
                <Link href="/signin" className={styles.joinBtn}>
                  Sign in to Join Community
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
