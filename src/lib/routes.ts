/**
 * Learnivia Type-Safe Route Registry
 * Single source of truth for all verified application routes, anchors, and deep links.
 * All internal links, CTA redirects, and navigation menus MUST use these definitions.
 */

export const ROUTES = {
  // Public Marketing & Trust Pages
  home: "/",
  about: "/about",
  howItWorks: "/how-it-works",
  parents: "/parents",
  educators: "/educators",
  safety: "/safety",
  safetyReport: "/safety/report",
  faq: "/faq",
  support: "/support",
  blog: "/blog",
  stories: "/stories",
  terms: "/terms",
  privacy: "/privacy",
  cookies: "/cookies",

  // Educational Resources
  resources: "/resources",
  resourcesStudyGuides: "/resources/study-guides",
  resourcesTools: "/resources/tools",

  // Authentication & Recovery
  auth: {
    signIn: "/signin",
    signUp: "/signup",
    forgotPassword: "/forgot-password",
    resetPassword: "/reset-password",
    verifyEmail: "/verify-email",
  },

  // Discovery & Public Listings
  find: "/find",
  sessions: "/sessions",
  sessionDetail: (id: string) => `/sessions/${id}`,
  learn: "/learn",
  learnSlug: (slug: string) => `/learn/${slug}`,
  tutorProfile: (id: string) => `/tutor/${id}`,
  tutorTranscriptPublic: (id: string, token?: string) =>
    token
      ? `/tutor/${id}/transcript?token=${encodeURIComponent(token)}`
      : `/tutor/${id}/transcript`,

  // Homework & Community
  homeworkHelp: "/homework-help",
  community: "/community",

  // Learner Workspace
  learner: {
    home: "/dashboard",
    findTutor: "/find",
    mySessions: "/sessions",
    homeworkHelp: "/homework-help",
    community: "/community",
    onboarding: "/onboarding",
    leaderboard: "/leaderboard",
  },

  // Tutor Workspace
  tutor: {
    home: "/tutor",
    availability: "/tutor#availability",
    hostSession: "/tutor#host-session",
    transcript: "/tutor/transcript",
    training: "/tutor/training",
    apply: "/apply",
  },

  // Administrator Workspace
  admin: {
    home: "/admin",
    users: "/admin/users",
    applications: "/admin/applications",
    tutors: "/admin/tutors",
    sessions: "/admin/sessions",
    reports: "/admin/reports",
    moderation: "/admin/moderation",
    stories: "/admin/stories",
    subjects: "/admin/subjects",
  },
} as const;

export type AppRoute = typeof ROUTES;

/**
 * Helper to determine the active workspace context based on the current pathname.
 */
export function getActiveWorkspace(
  pathname: string,
): "learner" | "tutor" | "admin" | "public" {
  if (pathname.startsWith("/admin")) return "admin";
  if (pathname.startsWith("/tutor")) return "tutor";
  if (
    pathname === "/dashboard" ||
    pathname.startsWith("/sessions") ||
    pathname.startsWith("/homework-help") ||
    pathname.startsWith("/community") ||
    pathname.startsWith("/leaderboard") ||
    pathname.startsWith("/onboarding")
  ) {
    return "learner";
  }
  return "public";
}
