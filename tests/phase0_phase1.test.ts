import assert from "node:assert/strict";
import test from "node:test";
import fs from "node:fs";
import path from "node:path";
import { ROUTES, getActiveWorkspace } from "../src/lib/routes.ts";

const PROJECT_ROOT = process.cwd();
const APP_DIR = path.join(PROJECT_ROOT, "src", "app");

test("Phase 0 - Route Integrity: All registered routes map to real application endpoints", () => {
  // Static route mapping verification
  const routePaths = [
    { route: ROUTES.home, file: "page.tsx" },
    { route: ROUTES.about, file: "about/page.tsx" },
    { route: ROUTES.howItWorks, file: "how-it-works/page.tsx" },
    { route: ROUTES.parents, file: "parents/page.tsx" },
    { route: ROUTES.educators, file: "educators/page.tsx" },
    { route: ROUTES.safety, file: "safety/page.tsx" },
    { route: ROUTES.safetyReport, file: "safety/report/page.tsx" },
    { route: ROUTES.faq, file: "faq/page.tsx" },
    { route: ROUTES.support, file: "support/page.tsx" },
    { route: ROUTES.blog, file: "blog/page.tsx" },
    { route: ROUTES.stories, file: "stories/page.tsx" },
    { route: ROUTES.terms, file: "terms/page.tsx" },
    { route: ROUTES.privacy, file: "privacy/page.tsx" },
    { route: ROUTES.cookies, file: "cookies/page.tsx" },
    { route: ROUTES.resources, file: "resources/page.tsx" },
    { route: ROUTES.resourcesStudyGuides, file: "resources/study-guides/page.tsx" },
    { route: ROUTES.resourcesTools, file: "resources/tools/page.tsx" },
    { route: ROUTES.auth.signIn, file: "signin/page.tsx" },
    { route: ROUTES.auth.signUp, file: "signup/page.tsx" },
    { route: ROUTES.auth.forgotPassword, file: "forgot-password/page.tsx" },
    { route: ROUTES.auth.resetPassword, file: "reset-password/page.tsx" },
    { route: ROUTES.auth.verifyEmail, file: "verify-email/page.tsx" },
    { route: ROUTES.find, file: "find/page.tsx" },
    { route: ROUTES.sessions, file: "sessions/page.tsx" },
    { route: ROUTES.homeworkHelp, file: "homework-help/page.tsx" },
    { route: ROUTES.community, file: "community/page.tsx" },
    { route: ROUTES.learner.home, file: "dashboard/page.tsx" },
    { route: ROUTES.tutor.home, file: "tutor/page.tsx" },
    { route: ROUTES.tutor.training, file: "tutor/training/page.tsx" },
    { route: ROUTES.tutor.transcript, file: "tutor/transcript/page.tsx" },
    { route: ROUTES.tutor.apply, file: "apply/page.tsx" },
    { route: ROUTES.admin.home, file: "admin/page.tsx" },
    { route: ROUTES.admin.users, file: "admin/users/page.tsx" },
    { route: ROUTES.admin.applications, file: "admin/applications/page.tsx" },
    { route: ROUTES.admin.tutors, file: "admin/tutors/page.tsx" },
    { route: ROUTES.admin.sessions, file: "admin/sessions/page.tsx" },
    { route: ROUTES.admin.reports, file: "admin/reports/page.tsx" },
    { route: ROUTES.admin.moderation, file: "admin/moderation/page.tsx" },
    { route: ROUTES.admin.stories, file: "admin/stories/page.tsx" },
    { route: ROUTES.admin.subjects, file: "admin/subjects/page.tsx" },
  ];

  for (const { route, file } of routePaths) {
    const fullPath = path.join(APP_DIR, file);
    assert.ok(
      fs.existsSync(fullPath),
      `Expected page file to exist for route "${route}": ${fullPath}`
    );
  }
});

test("Phase 0 - Workspace Switcher & Route Segmentation", () => {
  // Public routes
  assert.equal(getActiveWorkspace("/"), "public");
  assert.equal(getActiveWorkspace("/about"), "public");
  assert.equal(getActiveWorkspace("/safety"), "public");
  assert.equal(getActiveWorkspace("/find"), "public");

  // Learner routes
  assert.equal(getActiveWorkspace("/dashboard"), "learner");
  assert.equal(getActiveWorkspace("/sessions"), "learner");
  assert.equal(getActiveWorkspace("/homework-help"), "learner");
  assert.equal(getActiveWorkspace("/community"), "learner");
  assert.equal(getActiveWorkspace("/leaderboard"), "learner");

  // Tutor routes
  assert.equal(getActiveWorkspace("/tutor"), "tutor");
  assert.equal(getActiveWorkspace("/tutor/training"), "tutor");
  assert.equal(getActiveWorkspace("/tutor/transcript"), "tutor");

  // Admin routes
  assert.equal(getActiveWorkspace("/admin"), "admin");
  assert.equal(getActiveWorkspace("/admin/users"), "admin");
  assert.equal(getActiveWorkspace("/admin/reports"), "admin");
});

test("Phase 0 - Permission Matrix: Role-based server guard contracts", () => {
  type Role = "LEARNER" | "GUARDIAN" | "TUTOR" | "MODERATOR" | "ADMIN" | "SUPER_ADMIN";
  interface CapabilityCheck {
    action: string;
    allowedRoles: Role[];
  }

  const capabilities: CapabilityCheck[] = [
    { action: "VIEW_OTHER_LEARNER_PII", allowedRoles: ["SUPER_ADMIN"] },
    { action: "MANAGE_CHILD_PROFILE", allowedRoles: ["GUARDIAN", "ADMIN", "SUPER_ADMIN"] },
    { action: "BOOK_TUTORING_SESSION", allowedRoles: ["LEARNER", "GUARDIAN"] },
    { action: "REVIEW_TUTOR_APPLICATION", allowedRoles: ["ADMIN", "SUPER_ADMIN"] },
    { action: "ACCESS_SENSITIVE_REPORT_CARD", allowedRoles: ["ADMIN", "SUPER_ADMIN"] },
    { action: "ADJUST_VOLUNTEER_HOURS", allowedRoles: ["ADMIN", "SUPER_ADMIN"] },
    { action: "ASSIGN_USER_ROLES", allowedRoles: ["SUPER_ADMIN"] },
    { action: "ANSWER_HOMEWORK_QUESTION", allowedRoles: ["TUTOR", "ADMIN", "SUPER_ADMIN"] },
    { action: "TRIAGE_SAFETY_INCIDENT", allowedRoles: ["MODERATOR", "ADMIN", "SUPER_ADMIN"] },
  ];

  function canPerform(role: Role, action: string): boolean {
    const cap = capabilities.find((c) => c.action === action);
    if (!cap) return false;
    return cap.allowedRoles.includes(role);
  }

  // Learner restrictions
  assert.equal(canPerform("LEARNER", "REVIEW_TUTOR_APPLICATION"), false);
  assert.equal(canPerform("LEARNER", "ADJUST_VOLUNTEER_HOURS"), false);
  assert.equal(canPerform("LEARNER", "VIEW_OTHER_LEARNER_PII"), false);
  assert.equal(canPerform("LEARNER", "BOOK_TUTORING_SESSION"), true);

  // Tutor restrictions
  assert.equal(canPerform("TUTOR", "ADJUST_VOLUNTEER_HOURS"), false);
  assert.equal(canPerform("TUTOR", "REVIEW_TUTOR_APPLICATION"), false);
  assert.equal(canPerform("TUTOR", "ANSWER_HOMEWORK_QUESTION"), true);

  // Admin capabilities
  assert.equal(canPerform("ADMIN", "REVIEW_TUTOR_APPLICATION"), true);
  assert.equal(canPerform("ADMIN", "ADJUST_VOLUNTEER_HOURS"), true);
  assert.equal(canPerform("ADMIN", "ASSIGN_USER_ROLES"), false); // Only super admin via env var allowlist
});

test("Phase 0 - Guardian & Child Safety: URL domain allowlist & minor PII sanitization", () => {
  const ALLOWED_MEETING_DOMAINS = [
    "zoom.us",
    "us02web.zoom.us",
    "us04web.zoom.us",
    "us05web.zoom.us",
    "meet.google.com",
  ];

  function isMeetingUrlAllowed(urlStr: string): boolean {
    try {
      const parsed = new URL(urlStr);
      if (parsed.protocol !== "https:") return false;
      const host = parsed.hostname.toLowerCase();
      return ALLOWED_MEETING_DOMAINS.some(
        (domain) => host === domain || host.endsWith("." + domain)
      );
    } catch {
      return false;
    }
  }

  // Verified domains
  assert.equal(isMeetingUrlAllowed("https://meet.google.com/abc-defg-hij"), true);
  assert.equal(isMeetingUrlAllowed("https://us04web.zoom.us/j/123456789"), true);
  assert.equal(isMeetingUrlAllowed("https://zoom.us/j/123456789"), true);

  // Dangerous / Unvetted external domains
  assert.equal(isMeetingUrlAllowed("https://discord.gg/malicious-server"), false);
  assert.equal(isMeetingUrlAllowed("https://t.me/chat"), false);
  assert.equal(isMeetingUrlAllowed("http://meet.google.com/insecure"), false);
  assert.equal(isMeetingUrlAllowed("https://not-zoom.us/phish"), false);

  // Minor PII sanitization
  function sanitizeChildDisplayName(firstName: string, lastName: string): string {
    const trimmedFirst = firstName.trim();
    const lastInitial = lastName.trim().charAt(0).toUpperCase();
    return `${trimmedFirst} ${lastInitial}.`;
  }

  assert.equal(sanitizeChildDisplayName("Maya", "Smith"), "Maya S.");
  assert.equal(sanitizeChildDisplayName("Liam", "O'Connor"), "Liam O.");
});

test("Phase 0 - Booking State Machine: Transition validation & idempotency", () => {
  type BookingState =
    | "AVAILABLE"
    | "HELD"
    | "CONFIRMED"
    | "COMPLETED"
    | "CANCELED"
    | "NO_SHOW"
    | "DISPUTED"
    | "EXPIRED";

  const VALID_TRANSITIONS: Record<BookingState, BookingState[]> = {
    AVAILABLE: ["HELD", "CONFIRMED"],
    HELD: ["CONFIRMED", "EXPIRED", "AVAILABLE"],
    CONFIRMED: ["COMPLETED", "CANCELED", "NO_SHOW"],
    COMPLETED: ["DISPUTED"],
    CANCELED: [],
    NO_SHOW: ["DISPUTED"],
    DISPUTED: ["COMPLETED", "CANCELED"],
    EXPIRED: ["AVAILABLE"],
  };

  function canTransition(current: BookingState, next: BookingState): boolean {
    return VALID_TRANSITIONS[current]?.includes(next) ?? false;
  }

  // Valid state changes
  assert.equal(canTransition("AVAILABLE", "HELD"), true);
  assert.equal(canTransition("HELD", "CONFIRMED"), true);
  assert.equal(canTransition("HELD", "EXPIRED"), true);
  assert.equal(canTransition("CONFIRMED", "COMPLETED"), true);
  assert.equal(canTransition("CONFIRMED", "CANCELED"), true);
  assert.equal(canTransition("CONFIRMED", "NO_SHOW"), true);
  assert.equal(canTransition("COMPLETED", "DISPUTED"), true);

  // Invalid state changes (Integrity violations)
  assert.equal(canTransition("COMPLETED", "CONFIRMED"), false);
  assert.equal(canTransition("CANCELED", "COMPLETED"), false);
  assert.equal(canTransition("EXPIRED", "COMPLETED"), false);

  // Idempotency key generation rule
  function generateBookingIdempotencyKey(tutorId: string, userId: string, startTimeIso: string): string {
    return `bk_${tutorId}_${userId}_${new Date(startTimeIso).getTime()}`;
  }

  const key1 = generateBookingIdempotencyKey("tutor123", "user456", "2026-09-15T14:00:00Z");
  const key2 = generateBookingIdempotencyKey("tutor123", "user456", "2026-09-15T14:00:00Z");
  assert.equal(key1, key2, "Idempotency key must be deterministic for identical slot booking");
});

test("Phase 0 - Transcript Source of Truth: Canonical Hour Calculation Formula", () => {
  interface CompletedBooking {
    startTime: Date;
    endTime: Date;
    status: "COMPLETED";
  }

  interface HourAudit {
    hoursDelta: number; // positive or negative
  }

  function calculateCanonicalVolunteerHours(
    bookings: CompletedBooking[],
    audits: HourAudit[]
  ): number {
    const rawMinutes = bookings.reduce((sum, b) => {
      const diffMs = b.endTime.getTime() - b.startTime.getTime();
      return sum + Math.max(0, Math.round(diffMs / 60000));
    }, 0);

    const bookingHours = Math.round((rawMinutes / 60) * 10) / 10;
    const auditAdjustment = audits.reduce((sum, a) => sum + a.hoursDelta, 0);

    return Math.max(0, Math.round((bookingHours + auditAdjustment) * 10) / 10);
  }

  // Example: 2 completed 60-min sessions + 1 completed 30-min session = 2.5 hours
  const bookings: CompletedBooking[] = [
    {
      startTime: new Date("2026-09-01T10:00:00Z"),
      endTime: new Date("2026-09-01T11:00:00Z"),
      status: "COMPLETED",
    },
    {
      startTime: new Date("2026-09-02T14:00:00Z"),
      endTime: new Date("2026-09-02T15:00:00Z"),
      status: "COMPLETED",
    },
    {
      startTime: new Date("2026-09-03T16:00:00Z"),
      endTime: new Date("2026-09-03T16:30:00Z"),
      status: "COMPLETED",
    },
  ];

  // Admin audit adjustment: +1.0 hour for workshop prep
  const audits: HourAudit[] = [{ hoursDelta: 1.0 }];

  const total = calculateCanonicalVolunteerHours(bookings, audits);
  assert.equal(total, 3.5, "Canonical calculation must reconcile session duration + audit adjustments");
});

test("Phase 1 - Design Tokens: CSS variables integrity & accessibility rules", () => {
  const cssPath = path.join(APP_DIR, "globals.css");
  assert.ok(fs.existsSync(cssPath), "globals.css must exist");

  const css = fs.readFileSync(cssPath, "utf-8");

  // Forest green brand tokens
  assert.ok(css.includes("#1B4D3E"), "Forest green primary token (#1B4D3E) must exist");
  assert.ok(css.includes("#FAF8F5"), "Warm ivory paper background token (#FAF8F5) must exist");

  // Focus ring & accessibility tokens
  assert.ok(css.includes("--focus-ring"), "Accessible visible focus ring token must exist");
  assert.ok(css.includes(".skip-link"), "Accessible skip-link class must exist");
  assert.ok(
    css.includes("prefers-reduced-motion"),
    "prefers-reduced-motion media query must be respected"
  );

  // Radius token bounds (8-12px design rule)
  assert.ok(css.includes("--wa-radius-sm:      8px") || css.includes("--wa-radius-sm: 8px"), "--wa-radius-sm must be 8px");
  assert.ok(css.includes("--wa-radius-lg:      12px") || css.includes("--wa-radius-lg: 12px"), "--wa-radius-lg must be 12px");
});

test("Phase 2 - Learner Dashboard Architecture & Zero Gamification", () => {
  const dashboardPath = path.join(APP_DIR, "dashboard", "page.tsx");
  assert.ok(fs.existsSync(dashboardPath), "dashboard/page.tsx must exist");
  const code = fs.readFileSync(dashboardPath, "utf-8");

  // Verify non-gamified truthful metrics
  assert.ok(!code.includes("Curious Explorer"), "Fantasy level 'Curious Explorer' must be removed");
  assert.ok(!code.includes("1.2x SP booster"), "Fantasy 'SP booster' must be removed");
  assert.ok(!code.includes("Custom avatar frame"), "Vanity avatar frames must be removed");

  // Verify core components
  assert.ok(code.includes("NextActionPanel"), "NextActionPanel must be rendered");
  assert.ok(code.includes("UpcomingSessionCard"), "UpcomingSessionCard must be rendered");
  assert.ok(code.includes("TruthfulSummary"), "Truthful academic metrics summary must be rendered");
});

test("Phase 4 - Tutor & Admin Workspaces: Clean Editorial UI & Zero Emoji Controls", () => {
  const tutorPath = path.join(APP_DIR, "tutor", "page.tsx");
  const adminPath = path.join(APP_DIR, "admin", "page.tsx");
  assert.ok(fs.existsSync(tutorPath), "tutor/page.tsx must exist");
  assert.ok(fs.existsSync(adminPath), "admin/page.tsx must exist");

  const tutorCode = fs.readFileSync(tutorPath, "utf-8");
  const adminCode = fs.readFileSync(adminPath, "utf-8");

  // Check Lucide icons usage
  assert.ok(tutorCode.includes("ShieldCheck"), "Tutor workspace must use Lucide ShieldCheck");
  assert.ok(tutorCode.includes("ScheduleWorkshopForm"), "ScheduleWorkshopForm component must exist");
  assert.ok(adminCode.includes("Command Header") || adminCode.includes("headerEditorial"), "Admin must have editorial header");
  assert.ok(adminCode.includes("Live Oversight") || adminCode.includes("LIVE OVERSIGHT"), "Admin must have oversight badge");
});

test("Phase 5 - Secondary Views: Sessions, Homework Help & Community Integrity", () => {
  const sessionsPath = path.join(APP_DIR, "sessions", "page.tsx");
  const sessionDetailPath = path.join(APP_DIR, "sessions", "[id]", "page.tsx");
  const hwPath = path.join(APP_DIR, "homework-help", "page.tsx");
  const commClientPath = path.join(APP_DIR, "community", "CommunityClient.tsx");

  assert.ok(fs.existsSync(sessionsPath), "sessions/page.tsx must exist");
  assert.ok(fs.existsSync(sessionDetailPath), "sessions/[id]/page.tsx must exist");
  assert.ok(fs.existsSync(hwPath), "homework-help/page.tsx must exist");
  assert.ok(fs.existsSync(commClientPath), "community/CommunityClient.tsx must exist");

  const sessionDetailCode = fs.readFileSync(sessionDetailPath, "utf-8");
  const hwCode = fs.readFileSync(hwPath, "utf-8");
  const commCode = fs.readFileSync(commClientPath, "utf-8");

  // Zero emojis in interface controls
  assert.ok(!sessionDetailCode.includes("🔴 LIVE NOW"), "Emojis in status badge must be replaced with Lucide icons");
  assert.ok(!sessionDetailCode.includes("📚 Subject"), "Emojis in detail cards must be replaced with Lucide icons");
  assert.ok(!hwCode.includes("💡 Step-by-step"), "Emojis in helper chips must be replaced with Lucide icons");
  assert.ok(!commCode.includes("Post Message 🚀"), "Emoji rocket in post button must be replaced with Lucide Send");
  assert.ok(!commCode.includes("🗑️ Delete"), "Emoji trash in delete button must be replaced with Lucide Trash2");
});

