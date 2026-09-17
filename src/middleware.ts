import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import NextAuth from "next-auth"
import { authConfig } from "./auth.config"

const { auth } = NextAuth(authConfig)

// ── Rate limiting (in-memory, edge-compatible) ────────────────────────────
// NOTE: This works within a single edge instance. For production at scale,
// replace with Upstash Redis (@upstash/ratelimit) for distributed rate limiting.
// This is still meaningful protection since Vercel reuses warm instances.
interface RateLimitEntry { count: number; windowStart: number }
const rateLimitMap = new Map<string, RateLimitEntry>();

const RATE_LIMITS: Record<string, { max: number; windowMs: number }> = {
  "/signin":   { max: 10,  windowMs: 60_000 },   // 10 login attempts/min/IP
  "/signup":   { max: 5,   windowMs: 60_000 },   // 5 signups/min/IP
  "/api/community": { max: 15, windowMs: 60_000 }, // 15 community messages/min
  "/api/homework":  { max: 10, windowMs: 60_000 }, // 10 homework posts/min
};

function checkRateLimit(ip: string, path: string): boolean {
  const limit = Object.entries(RATE_LIMITS).find(([prefix]) => path.startsWith(prefix));
  if (!limit) return true; // No limit for this path

  const [, { max, windowMs }] = limit;
  const key = `${ip}:${path}`;
  const now = Date.now();
  const entry = rateLimitMap.get(key);

  if (!entry || now - entry.windowStart > windowMs) {
    rateLimitMap.set(key, { count: 1, windowStart: now });
    return true;
  }

  if (entry.count >= max) {
    return false; // Rate limit exceeded
  }

  entry.count++;
  return true;
}

// Clean up old entries to prevent memory leak (runs occasionally)
function maybePruneRateLimitMap() {
  if (rateLimitMap.size > 5000) {
    const now = Date.now();
    for (const [key, entry] of rateLimitMap.entries()) {
      if (now - entry.windowStart > 120_000) {
        rateLimitMap.delete(key);
      }
    }
  }
}

// ── Public paths (no auth required) ──────────────────────────────────────
const publicPaths = [
  "/",
  "/signin",
  "/signup",
  "/forgot-password",
  "/reset-password",
  "/verify-email",
  "/find",
  "/how-it-works",
  "/about",
  "/faq",
  "/safety",
  "/safety/report",
  "/stories",
  "/blog",
  "/parents",
  "/educators",
  "/support",
  "/privacy",
  "/terms",
  "/cookies",
  "/learn",
  "/sessions",
  "/homework-help",
  "/community",
  "/resources",
  "/apply",
  "/leaderboard",
  "/api/health",     // Health check is public
  "/api/auth",       // NextAuth callbacks
  "/api/cron",       // Cron endpoints (Vercel cron)
  "/robots.txt",
  "/sitemap.xml",
]

const onboardingPaths = ["/onboarding"]

export default auth((req) => {
  const { nextUrl } = req
  const isLoggedIn = !!req.auth

  // ── Rate limiting ──────────────────────────────────────────────────────
  // P0-4: Apply rate limiting before any auth checks
  maybePruneRateLimitMap();
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
    || req.headers.get("x-real-ip")
    || "unknown";

  if (!checkRateLimit(ip, nextUrl.pathname)) {
    return new NextResponse(
      JSON.stringify({ error: "Too many requests. Please wait a moment and try again." }),
      {
        status: 429,
        headers: {
          "Content-Type": "application/json",
          "Retry-After": "60",
        },
      }
    );
  }

  // ── Path classification ────────────────────────────────────────────────
  const isOnboardingCompleted = req.auth?.user?.onboardingCompleted

  // P0-2: Transcript pages require auth (in addition to page-level check)
  const isTranscriptPath = nextUrl.pathname.includes("/transcript");

  // Public tutor profiles (/tutor/[id]) are accessible to guests
  // BUT transcripts are now auth-required (P0-2)
  const isPublicTutorProfile =
    nextUrl.pathname.startsWith("/tutor/") &&
    !nextUrl.pathname.startsWith("/tutor/training") &&
    !nextUrl.pathname.startsWith("/tutor/transcript") &&
    !isTranscriptPath;

  const isPublicPath =
    publicPaths.some(path =>
      nextUrl.pathname === path ||
      nextUrl.pathname.startsWith(path + "/") ||
      (path === "/api/auth" && nextUrl.pathname.startsWith("/api/auth"))
    ) ||
    isPublicTutorProfile

  const isOnboardingPath = onboardingPaths.some(path => nextUrl.pathname.startsWith(path))

  if (isLoggedIn) {
    // If logged in and visiting home, signin, or signup, immediately redirect at the edge to role workspace
    if (nextUrl.pathname === "/" || nextUrl.pathname === "/signin" || nextUrl.pathname === "/signup") {
      const userRole = req.auth?.user?.role;
      const target = userRole === "TUTOR" ? "/tutor" : "/dashboard";
      return NextResponse.redirect(new URL(target, req.url));
    }

    // P0-5: Admin check exclusively via session role (set from env var in auth callbacks)
    const isUserAdmin = req.auth?.user?.role === "ADMIN";
    if (nextUrl.pathname.startsWith("/admin") && !isUserAdmin) {
      return NextResponse.redirect(new URL("/dashboard", req.url))
    }

    // Only redirect to onboarding if user is trying to access protected app routes
    if (!isOnboardingCompleted && !isOnboardingPath && !isPublicPath && nextUrl.pathname !== "/api/auth/signout") {
      return NextResponse.redirect(new URL("/onboarding", req.url))
    }
    if (isOnboardingCompleted && isOnboardingPath) {
      return NextResponse.redirect(new URL("/dashboard", req.url))
    }
  } else {
    if (!isPublicPath) {
      // Preserve the current URL as callbackUrl so user returns here after sign-in
      const signInUrl = new URL("/signin", req.url)
      signInUrl.searchParams.set("callbackUrl", nextUrl.pathname + nextUrl.search)
      return NextResponse.redirect(signInUrl)
    }
  }

  // Add request ID header for log correlation (P2-7)
  const requestId = crypto.randomUUID();
  const response = NextResponse.next();
  response.headers.set("x-request-id", requestId);
  return response;
})

export const config = {
  // Match all routes except static files and images
  matcher: ["/((?!_next/static|_next/image|favicon.ico|images/).*)",]
}
