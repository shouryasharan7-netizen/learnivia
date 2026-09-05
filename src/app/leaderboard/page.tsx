import styles from "./page.module.css";
import { getLeaderboard } from "@/lib/stats";
import Link from "next/link";
import { auth } from "@/auth";

export const dynamic = "force-dynamic";
export const revalidate = 60; // ISR: 60s cache

export const metadata = {
  title: "Leaderboard — Learnivia",
  description: "Live real-time peer learning leaderboard computed from verified minutes, sessions, and reviews.",
};

export default async function LeaderboardPage() {
  const session = await auth();
  const leaderboard = await getLeaderboard(50);

  const top3 = leaderboard.slice(0, 3);
  const remaining = leaderboard.slice(3);

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.liveTag}>
            <span className={styles.liveDot} />
            <span>REAL-TIME VERIFIED RANKINGS</span>
          </div>
          <h1 className={styles.title}>Learnivia Leaderboard</h1>
          <p className={styles.subtitle}>
            Rankings are computed dynamically from actual learning minutes, completed sessions, and volunteer hours recorded in PostgreSQL. Zero mock data.
          </p>
        </div>

        {/* Top 3 Podium */}
        {top3.length > 0 && (
          <div className={styles.podiumGrid}>
            {top3.map((entry, index) => {
              const medal = index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉";
              const isCurrentUser = session?.user?.id === entry.userId;

              return (
                <div
                  key={entry.userId}
                  className={`${styles.podiumCard} ${index === 0 ? styles.firstPlaceCard : ""}`}
                >
                  <div className={styles.medalIcon}>{medal}</div>
                  <div className={styles.avatarCircle}>{entry.initials}</div>
                  <h2 className={styles.podiumName}>
                    {entry.name}
                    {isCurrentUser && <span className={styles.youBadge}> (You)</span>}
                  </h2>
                  <span className={styles.roleBadge}>{entry.role}</span>

                  <div className={styles.podiumStats}>
                    <div>
                      <span className={styles.podiumStatNum}>{entry.points}</span>
                      <span className={styles.podiumStatLabel}>SP Points</span>
                    </div>
                    <div>
                      <span className={styles.podiumStatNum}>{entry.learningMinutes}</span>
                      <span className={styles.podiumStatLabel}>Minutes</span>
                    </div>
                    <div>
                      <span className={styles.podiumStatNum}>{entry.completedSessions}</span>
                      <span className={styles.podiumStatLabel}>Sessions</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Full Table */}
        <div className={styles.tableCard}>
          <div className={styles.tableHeader}>
            <h2 className={styles.tableTitle}>Global Rankings</h2>
            <span style={{ fontSize: "0.85rem", color: "#64748B" }}>
              {leaderboard.length} active learner{leaderboard.length === 1 ? "" : "s"}
            </span>
          </div>

          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th style={{ width: 70 }}>Rank</th>
                  <th>Learner / Tutor</th>
                  <th>Role</th>
                  <th>Grade / School</th>
                  <th style={{ textAlign: "right" }}>Learning Mins</th>
                  <th style={{ textAlign: "right" }}>Sessions</th>
                  <th style={{ textAlign: "right" }}>Total SP</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.map((u) => {
                  const isCurrent = session?.user?.id === u.userId;
                  return (
                    <tr key={u.userId} className={isCurrent ? styles.highlightRow : ""}>
                      <td className={styles.rankCell}>
                        {u.rank === 1 ? "🥇 1" : u.rank === 2 ? "🥈 2" : u.rank === 3 ? "🥉 3" : `#${u.rank}`}
                      </td>
                      <td className={styles.userCell}>
                        <div className={styles.tableAvatar}>{u.initials}</div>
                        <div>
                          <span className={styles.tableUserName}>{u.name}</span>
                          {isCurrent && <span className={styles.youBadge}> (You)</span>}
                        </div>
                      </td>
                      <td>
                        <span className={u.role.includes("Tutor") ? styles.tutorPill : styles.studentPill}>
                          {u.role}
                        </span>
                      </td>
                      <td style={{ color: "#64748B", fontSize: "0.85rem" }}>
                        {u.school || u.grade || "—"}
                      </td>
                      <td style={{ textAlign: "right", fontWeight: 600 }}>
                        {u.learningMinutes} min
                      </td>
                      <td style={{ textAlign: "right", color: "#64748B" }}>
                        {u.completedSessions}
                      </td>
                      <td style={{ textAlign: "right", fontWeight: 800, color: "#0E8345" }}>
                        {u.points} SP
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer actions */}
        <div style={{ marginTop: "2rem", textAlign: "center", display: "flex", gap: "1rem", justifyContent: "center" }}>
          <Link
            href="/dashboard"
            style={{
              background: "#F1F5F9",
              color: "#334155",
              padding: "0.65rem 1.5rem",
              borderRadius: "9999px",
              fontWeight: 700,
              textDecoration: "none",
            }}
          >
            ← Back to Dashboard
          </Link>
          <Link
            href="/sessions"
            style={{
              background: "#0E8345",
              color: "#FFFFFF",
              padding: "0.65rem 1.5rem",
              borderRadius: "9999px",
              fontWeight: 700,
              textDecoration: "none",
            }}
          >
            Attend Sessions to Earn SP →
          </Link>
        </div>
      </div>
    </main>
  );
}
