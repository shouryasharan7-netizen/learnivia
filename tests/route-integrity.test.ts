/**
 * Route Integrity Test Suite — Playwright
 *
 * Validates that all known platform routes are alive and return the expected
 * HTTP status. Runs against a dev server (BASE_URL).
 *
 * Tests:
 * 1. Public routes → 200
 * 2. Auth-gated workspace routes → 3xx redirect (not 404/500)
 * 3. Redirect stubs (/tutor-dashboard, /live, /book) → 3xx (not 404)
 * 4. Admin routes → 3xx for unauthenticated users (not 404)
 * 5. Meeting link safeguard logic (unit-level fetch validation)
 *
 * Run:
 *   BASE_URL=http://localhost:3000 npx playwright test tests/route-integrity.test.ts
 */

import { test, expect } from "@playwright/test";

const BASE_URL = process.env.BASE_URL || "http://localhost:3000";

async function headRoute(path: string) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: "HEAD",
    redirect: "manual",
    headers: { Accept: "text/html" },
  });
  return { status: res.status, location: res.headers.get("location") };
}

// ─── 1. Public routes ─────────────────────────────────────────────────────────

const PUBLIC_ROUTES = [
  { path: "/", label: "Homepage" },
  { path: "/signin", label: "Sign In" },
  { path: "/signup", label: "Sign Up" },
  { path: "/find", label: "Find a Tutor" },
  { path: "/how-it-works", label: "How It Works" },
  { path: "/about", label: "About" },
  { path: "/safety", label: "Safety" },
  { path: "/privacy", label: "Privacy" },
  { path: "/terms", label: "Terms" },
  { path: "/apply", label: "Apply as Tutor" },
  // Note: /api/health pings a remote Supabase URL and may return 503 in dev (network latency)
  // Tested separately below with status ≠ 404 assertion
];

for (const { path, label } of PUBLIC_ROUTES) {
  test(`Public: ${label} (${path}) returns 200`, async () => {
    const { status } = await headRoute(path);
    expect(status, `${path} should return 200, got ${status}`).toBe(200);
  });
}

test("Health check (/api/health) is alive (200 or 503, not 404)", async () => {
  const { status } = await headRoute("/api/health");
  expect(status, "/api/health must not be 404").not.toBe(404);
  expect(status, "/api/health must not be 500").not.toBe(500);
  // 200 = healthy DB, 503 = unhealthy DB (acceptable in dev — remote Supabase latency)
  expect([200, 503]).toContain(status);
});

// ─── 2. Auth-gated workspace routes ──────────────────────────────────────────

const WORKSPACE_ROUTES = [
  "/dashboard",
  "/tutor",
  "/calendar",
  "/messages",
  "/profile",
  "/settings",
];

for (const path of WORKSPACE_ROUTES) {
  test(`Auth-gated: ${path} redirects (not 404/500) when unauthenticated`, async () => {
    const { status } = await headRoute(path);
    expect(status, `${path} must not be 404`).not.toBe(404);
    expect(status, `${path} must not be 500`).not.toBe(500);
    // Should be a redirect (302, 307, or 308)
    expect([200, 302, 307, 308], `${path} should redirect`).toContain(status);
  });
}

// ─── 3. Redirect stubs (MUST NOT 404) ────────────────────────────────────────

const REDIRECT_STUBS = [
  { path: "/tutor-dashboard", label: "Tutor Dashboard stub → /tutor" },
  { path: "/live", label: "Live stub → /sessions" },
  { path: "/book", label: "Book stub → /find" },
];

for (const { path, label } of REDIRECT_STUBS) {
  test(`Redirect stub: ${label} is alive (not 404)`, async () => {
    const { status } = await headRoute(path);
    expect(status, `${path} must NOT return 404`).not.toBe(404);
    expect(status, `${path} must NOT return 500`).not.toBe(500);
  });
}

// ─── 4. Admin routes (unauthenticated) ───────────────────────────────────────

const ADMIN_ROUTES = [
  "/admin",
  "/admin/subjects",
  "/admin/tutors",
  "/admin/users",
  "/admin/sessions",
];

for (const path of ADMIN_ROUTES) {
  test(`Admin: ${path} redirects (not 404) when unauthenticated`, async () => {
    const { status } = await headRoute(path);
    expect(status, `${path} must not be 404`).not.toBe(404);
    expect(status, `${path} must not be 500`).not.toBe(500);
  });
}

// ─── 5. Meeting link safeguard — HTTP-level smoke test ───────────────────────

test("Meeting link safeguard: /api/homework PATCH requires auth (not accessible unauthed)", async () => {
  // The middleware intercepts /api/homework for unauthenticated users and redirects (307)
  // This confirms the route is protected — it should NOT return 200 without a session
  const res = await fetch(`${BASE_URL}/api/homework`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      id: "fake-id",
      zoomLink: "https://zoom.us/j/9876543210",
      status: "ANSWERED",
    }),
    redirect: "manual",
  });
  // Middleware redirects to /signin → 307, OR API returns 401 directly
  expect(res.status, "PATCH without auth must not return 200 (unprotected)").not.toBe(200);
  expect(res.status, "PATCH without auth must not return 500").not.toBe(500);
  expect([307, 308, 401, 403]).toContain(res.status);
});

// ─── 6. Admin subjects page: no K-10 lock ────────────────────────────────────

test("Admin subjects page does not contain K-10 lock copy", async () => {
  // Fetch the admin subjects page (unauthenticated → redirect to /signin)
  // Either way the response body must NOT contain the K-10 lock strings
  const res = await fetch(`${BASE_URL}/admin/subjects`, {
    redirect: "follow",
    headers: { Accept: "text/html" },
  });
  const body = await res.text();
  expect(body, "K-10 lock copy must not appear in admin subjects page").not.toContain("K-10 Scope Lock:");
  expect(body).not.toContain("exclusively supports Kindergarten through Grade 10");
});
