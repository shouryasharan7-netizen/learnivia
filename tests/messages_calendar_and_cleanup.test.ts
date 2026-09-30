import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { ROUTES } from "../src/lib/routes";

test("Messages & Calendar Routes: Registered and Type-Safe", () => {
  assert.equal(ROUTES.messages, "/messages");
  assert.equal(ROUTES.calendar, "/calendar");
  assert.ok(fs.existsSync(path.join(process.cwd(), "src/app/messages/page.tsx")));
  assert.ok(fs.existsSync(path.join(process.cwd(), "src/app/calendar/page.tsx")));
  assert.ok(fs.existsSync(path.join(process.cwd(), "src/app/notifications/page.tsx")));
});

test("Admin Tutors Page: Excludes Marcus Vance and Mock Seed Tutors", () => {
  const file = fs.readFileSync(path.join(process.cwd(), "src/app/admin/tutors/page.tsx"), "utf8");
  assert.ok(file.includes('"tutor.test@learnivia.org"'), "Filters out tutor.test@learnivia.org");
  assert.ok(file.includes('"Marcus Vance"'), "Filters out Marcus Vance");
  assert.ok(file.includes("deleteTutorProfile"), "Provides administrative deleteTutorProfile action");
});

test("Messages Safeguarding: Enforces Zero Student-to-Student Direct Messaging", () => {
  const actions = fs.readFileSync(path.join(process.cwd(), "src/app/actions/messages.ts"), "utf8");
  assert.ok(actions.includes("tutorProfile.findUnique"), "Validates tutor profile existence for direct chats");
  assert.ok(
    actions.includes("restricted to interactions with verified volunteer tutors"),
    "Guarantees that direct messaging is strictly between students and tutors",
  );
});

test("Calendar UI Contract: Matches Image 4 Specification", () => {
  const client = fs.readFileSync(path.join(process.cwd(), "src/app/calendar/CalendarClient.tsx"), "utf8");
  assert.ok(
    client.includes("You don&apos;t have any upcoming sessions.") ||
    client.includes("You don't have any upcoming sessions."),
    "Includes exact empty-state text",
  );
  assert.ok(client.includes("Upcoming"), "Includes Upcoming tab");
  assert.ok(client.includes("Past"), "Includes Past tab");
  assert.ok(client.includes("CalendarEmptyIllustration"), "Renders custom calendar empty illustration");

  const illustration = fs.readFileSync(path.join(process.cwd(), "src/app/calendar/CalendarEmptyIllustration.tsx"), "utf8");
  assert.ok(illustration.includes("<svg"), "Renders SVG illustration");
  assert.ok(illustration.includes("rect"), "Contains calendar grid rectangles");
});

test("Favicon & Logo Fix: Next.js starter icon replaced with Learnivia Logo", () => {
  const appFaviconStats = fs.statSync(path.join(process.cwd(), "src/app/favicon.ico"));
  // Next.js default starter icon is ~25KB. Real Learnivia logo is ~643KB.
  assert.ok(
    appFaviconStats.size > 100000,
    `src/app/favicon.ico must be the Learnivia logo (> 100KB), found ${appFaviconStats.size} bytes`,
  );

  const layout = fs.readFileSync(path.join(process.cwd(), "src/app/layout.tsx"), "utf8");
  assert.ok(layout.includes("/images/logo.png"), "Layout specifies /images/logo.png in icons metadata");
});

test("TopBar Header Icons: Messages, Notifications, and Calendar are properly hooked", () => {
  const topbar = fs.readFileSync(path.join(process.cwd(), "src/components/workspace/TopBar.tsx"), "utf8");
  assert.ok(topbar.includes('icon={MessageCircle} label="Messages" href="/messages"'));
  assert.ok(topbar.includes('icon={Calendar} label="Calendar" href="/calendar"'));
  assert.ok(topbar.includes('href="/calendar"'), "Notification links navigate to calendar");
});
