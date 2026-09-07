import { prisma } from "./prisma";

export interface UserStats {
  learningMinutes: number;
  tutoringMinutes: number;
  volunteerHours: number;
  completedSessions: number;
  upcomingSessions: number;
  points: number;
  rank: number;
  totalUsers: number;
  grade?: string | null;
  age?: number | null;
  curriculum?: string | null;
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  name: string;
  initials: string;
  role: string;
  grade?: string | null;
  school?: string | null;
  points: number;
  learningMinutes: number;
  volunteerHours: number;
  completedSessions: number;
}

// Fast memory cache for ranking and leaderboard to eliminate heavy relational DB scans
let cachedUserScores: { id: string; points: number }[] | null = null;
let lastUserScoresFetch = 0;
const SCORES_CACHE_TTL = 120_000; // 2 minutes — ranking barely changes within 30s

let cachedLeaderboard: LeaderboardEntry[] | null = null;
let lastLeaderboardFetch = 0;
const LEADERBOARD_CACHE_TTL = 300_000; // 5 minutes — leaderboard is stable

// Per-user stats cache: avoids re-querying the same user within a warm serverless instance
const userStatsCache = new Map<string, { data: UserStats; fetchedAt: number }>();
const USER_STATS_TTL = 60_000; // 1 minute per-user stats cache

/**
 * Calculates genuine real-time statistics for any user without any mock/fabricated data.
 * Results are cached per-user for USER_STATS_TTL ms within a warm serverless instance.
 */
export async function calculateUserStats(userId: string): Promise<UserStats> {
  const now = new Date();

  // Check per-user in-memory cache first
  const cached = userStatsCache.get(userId);
  if (cached && Date.now() - cached.fetchedAt < USER_STATS_TTL) {
    return cached.data;
  }

  // Fetch the user with all learning activity relations
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      studentBookings: {
        include: { tutor: { include: { user: true } } },
      },
      workshopEnrollments: {
        include: { workshop: { include: { tutor: { include: { user: true } } } } },
      },
      reviewsGiven: true,
      homeworkRequests: true,
      tutorProfile: {
        include: {
          tutorBookings: true,
          workshops: true,
        },
      },
    },
  });


  if (!user) {
    return {
      learningMinutes: 0,
      tutoringMinutes: 0,
      volunteerHours: 0,
      completedSessions: 0,
      upcomingSessions: 0,
      points: 0,
      rank: 1,
      totalUsers: 1,
    };
  }

  // 1. Calculate Learning Minutes from 1-on-1 Student Bookings
  let completed1on1 = 0;
  let upcoming1on1 = 0;
  let studentBookingMinutes = 0;

  for (const b of user.studentBookings) {
    if (b.status === "CANCELED") continue;

    const start = new Date(b.startTime).getTime();
    const end = new Date(b.endTime).getTime();
    const durationMins = Math.max(15, Math.round((end - start) / (1000 * 60)));

    if (b.status === "COMPLETED" || (b.status === "CONFIRMED" && new Date(b.endTime) < now)) {
      completed1on1 += 1;
      studentBookingMinutes += durationMins;
    } else if (b.status === "CONFIRMED" && new Date(b.endTime) >= now) {
      upcoming1on1 += 1;
    }
  }

  // 2. Calculate Learning Minutes from Enrolled Workshops
  let completedWorkshops = 0;
  let upcomingWorkshops = 0;
  let workshopMinutes = 0;

  for (const e of user.workshopEnrollments) {
    const w = e.workshop;
    if (w.status === "CANCELED") continue;

    const start = new Date(w.startTime).getTime();
    const end = new Date(w.endTime).getTime();
    const durationMins = Math.max(15, Math.round((end - start) / (1000 * 60)));

    if (w.status === "COMPLETED" || (w.status === "UPCOMING" && new Date(w.endTime) < now)) {
      completedWorkshops += 1;
      workshopMinutes += durationMins;
    } else if (w.status === "UPCOMING" && new Date(w.endTime) >= now) {
      upcomingWorkshops += 1;
    }
  }

  const learningMinutes = studentBookingMinutes + workshopMinutes;
  const completedSessions = completed1on1 + completedWorkshops;
  const upcomingSessions = upcoming1on1 + upcomingWorkshops;

  // 3. Calculate Tutor Statistics (if applicable)
  let tutoringMinutes = 0;
  let completedTutorWorkshops = 0;

  if (user.tutorProfile) {
    for (const b of user.tutorProfile.tutorBookings) {
      if (b.status === "CANCELED") continue;
      const start = new Date(b.startTime).getTime();
      const end = new Date(b.endTime).getTime();
      const durationMins = Math.max(15, Math.round((end - start) / (1000 * 60)));

      if (b.status === "COMPLETED" || (b.status === "CONFIRMED" && new Date(b.endTime) < now)) {
        tutoringMinutes += durationMins;
      }
    }

    for (const w of user.tutorProfile.workshops) {
      if (w.status === "CANCELED") continue;
      const start = new Date(w.startTime).getTime();
      const end = new Date(w.endTime).getTime();
      const durationMins = Math.max(15, Math.round((end - start) / (1000 * 60)));

      if (w.status === "COMPLETED" || (w.status === "UPCOMING" && new Date(w.endTime) < now)) {
        tutoringMinutes += durationMins;
        completedTutorWorkshops += 1;
      }
    }
  }

  const volunteerHours = Math.round((tutoringMinutes / 60) * 10) / 10;

  // 4. Calculate Real-Time Study Points (SP)
  // - 1 SP per 2 minutes learned
  // - 20 SP per attended completed session
  // - 15 SP per review submitted
  // - 10 SP per homework help interaction
  // - 50 SP per workshop hosted (for tutors)
  // - 1 SP per 2 minutes volunteered (for tutors)
  const basePoints = user.points || 0;
  const learningPoints = Math.floor(learningMinutes / 2);
  const sessionPoints = completedSessions * 20;
  const reviewPoints = user.reviewsGiven.length * 15;
  const homeworkPoints = user.homeworkRequests.length * 10;
  const tutorPoints = (completedTutorWorkshops * 50) + Math.floor(tutoringMinutes / 2);

  const totalPoints = basePoints + learningPoints + sessionPoints + reviewPoints + homeworkPoints + tutorPoints;

  // 5. Calculate Real-Time Rank across all registered users in DB (fast indexed count)
  let rank = 1;
  let totalUsers = 1;

  try {
    const [higherScoreUsers, totalUsersCount] = await Promise.all([
      prisma.user.count({
        where: {
          points: { gt: totalPoints },
        },
      }),
      prisma.user.count(),
    ]);
    rank = higherScoreUsers + 1;
    totalUsers = Math.max(totalUsersCount, 1);
  } catch {
    rank = 1;
    totalUsers = 1;
  }

  // Update user's synced points in DB in the background if changed
  if (user.points !== totalPoints) {
    prisma.user.update({
      where: { id: userId },
      data: { points: totalPoints },
    }).catch(() => {});
  }

  const result: UserStats = {
    learningMinutes,
    tutoringMinutes,
    volunteerHours,
    completedSessions,
    upcomingSessions,
    points: totalPoints,
    rank,
    totalUsers,
    grade: user.grade,
    age: user.age,
    curriculum: user.curriculum,
  };

  // Store in per-user cache
  userStatsCache.set(userId, { data: result, fetchedAt: Date.now() });

  return result;
}

/**
 * Returns the verified real-time platform leaderboard.
 */
export async function getLeaderboard(limit = 25): Promise<LeaderboardEntry[]> {
  const isStale = !cachedLeaderboard || (Date.now() - lastLeaderboardFetch > LEADERBOARD_CACHE_TTL);
  if (!isStale && cachedLeaderboard) {
    return cachedLeaderboard.slice(0, limit);
  }

  const now = new Date();

  const users = await prisma.user.findMany({
    take: 100,
    include: {
      studentBookings: {
        where: {
          OR: [
            { status: "COMPLETED" },
            { status: "CONFIRMED", endTime: { lt: now } },
          ],
        },
      },
      workshopEnrollments: {
        where: {
          workshop: {
            OR: [
              { status: "COMPLETED" },
              { status: "UPCOMING", endTime: { lt: now } },
            ],
          },
        },
        include: { workshop: true },
      },
      reviewsGiven: true,
      homeworkRequests: true,
      tutorProfile: {
        include: {
          tutorBookings: {
            where: {
              OR: [
                { status: "COMPLETED" },
                { status: "CONFIRMED", endTime: { lt: now } },
              ],
            },
          },
          workshops: {
            where: {
              OR: [
                { status: "COMPLETED" },
                { status: "UPCOMING", endTime: { lt: now } },
              ],
            },
          },
        },
      },
    },
  });

  const entries: LeaderboardEntry[] = users.map((u) => {
    let learningMinutes = 0;
    let completedSessions = 0;

    for (const b of u.studentBookings) {
      learningMinutes += Math.max(15, Math.round((new Date(b.endTime).getTime() - new Date(b.startTime).getTime()) / 60000));
      completedSessions += 1;
    }

    for (const e of u.workshopEnrollments) {
      learningMinutes += Math.max(15, Math.round((new Date(e.workshop.endTime).getTime() - new Date(e.workshop.startTime).getTime()) / 60000));
      completedSessions += 1;
    }

    let tutoringMinutes = 0;
    let tutorWorkshops = 0;

    if (u.tutorProfile) {
      for (const b of u.tutorProfile.tutorBookings) {
        tutoringMinutes += Math.max(15, Math.round((new Date(b.endTime).getTime() - new Date(b.startTime).getTime()) / 60000));
      }
      for (const w of u.tutorProfile.workshops) {
        tutoringMinutes += Math.max(15, Math.round((new Date(w.endTime).getTime() - new Date(w.startTime).getTime()) / 60000));
        tutorWorkshops += 1;
      }
    }

    const volunteerHours = Math.round((tutoringMinutes / 60) * 10) / 10;
    const pts = (u.points || 0) +
      Math.floor(learningMinutes / 2) +
      (completedSessions * 20) +
      (u.reviewsGiven.length * 15) +
      (u.homeworkRequests.length * 10) +
      (tutorWorkshops * 50) +
      Math.floor(tutoringMinutes / 2);

    const displayName = u.name || (u.email ? u.email.split("@")[0] : "Learner");
    const initials = displayName
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();

    return {
      rank: 1,
      userId: u.id,
      name: displayName,
      initials,
      role: u.role === "TUTOR" || u.tutorProfile?.status === "APPROVED" ? "Verified Tutor" : "Student",
      grade: u.grade || u.tutorProfile?.currentGrade || null,
      school: u.tutorProfile?.school || null,
      points: pts,
      learningMinutes,
      volunteerHours,
      completedSessions,
    };
  });

  entries.sort((a, b) => b.points - a.points || b.learningMinutes - a.learningMinutes);

  entries.forEach((entry, idx) => {
    entry.rank = idx + 1;
  });

  cachedLeaderboard = entries;
  lastLeaderboardFetch = Date.now();

  return entries.slice(0, limit);
}
