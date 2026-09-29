import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

const { auth } = NextAuth(authConfig);

import { checkRateLimit } from "@/lib/rate-limit";

// Rate Limit logic uses Upstash Redis for distributed protection across Edge instances
async function handleRateLimit(ip: string, path: string): Promise<boolean> {
  let limiterType: "auth" | "api" | "global" = "global";
  if (path.startsWith("/signin") || path.startsWith("/signup")) {
    limiterType = "auth";
  } else if (path.startsWith("/api/")) {
    limiterType = "api";
  }

  const { success } = await checkRateLimit(limiterType, ip);
  return success;
}

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
  "/observatory",
  "/api/health", // Health check is public
  "/api/auth", // NextAuth callbacks
  "/api/cron", // Cron endpoints (Vercel cron)
  "/robots.txt",
  "/sitemap.xml",
];

const onboardingPaths = ["/onboarding"];

export default auth(async (req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  // P0-4: Apply rate limiting before any auth checks
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown";

  if (!(await handleRateLimit(ip, nextUrl.pathname))) {
    const isHtml = req.headers.get("accept")?.includes("text/html");
    if (isHtml) {
      return new NextResponse(
        `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Rate Limit Exceeded - Learnivia</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: #FAFAF8;
      color: #0F172A;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      margin: 0;
      padding: 1.5rem;
      box-sizing: border-box;
    }
    .card {
      background: #FFFFFF;
      border: 1px solid #E5DFD5;
      border-radius: 12px;
      padding: 2.5rem;
      max-width: 480px;
      width: 100%;
      text-align: center;
      box-shadow: 0 4px 20px rgba(0,0,0,0.06);
    }
    h1 {
      font-family: Georgia, serif;
      font-size: 1.45rem;
      color: #1B4D3E;
      margin: 0 0 0.75rem;
    }
    p {
      color: #64748B;
      font-size: 0.95rem;
      line-height: 1.6;
      margin: 0 0 1.5rem;
    }
    .btn {
      display: inline-block;
      background: #1B4D3E;
      color: #FFFFFF;
      padding: 0.75rem 1.5rem;
      border-radius: 6px;
      text-decoration: none;
      font-weight: 600;
      font-size: 0.9rem;
      cursor: pointer;
      border: none;
    }
  </style>
</head>
<body>
  <div class="card">
    <div style="font-size: 2.5rem; margin-bottom: 0.75rem;">⏳</div>
    <h1>Too Many Requests</h1>
    <p>Please wait a moment while we process your request. Your dashboard is ready.</p>
    <a href="/tutor" class="btn">Proceed to Dashboard</a>
  </div>
</body>
</html>`,
        {
          status: 429,
          headers: {
            "Content-Type": "text/html; charset=utf-8",
            "Retry-After": "60",
          },
        }
      );
    }

    return new NextResponse(
      JSON.stringify({
        error: "Too many requests. Please wait a moment and try again.",
      }),
      {
        status: 429,
        headers: {
          "Content-Type": "application/json",
          "Retry-After": "60",
        },
      },
    );
  }

  const isOnboardingCompleted = req.auth?.user?.onboardingCompleted;

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
    publicPaths.some(
      (path) =>
        nextUrl.pathname === path ||
        nextUrl.pathname.startsWith(path + "/") ||
        (path === "/api/auth" && nextUrl.pathname.startsWith("/api/auth")),
    ) || isPublicTutorProfile;

  const isOnboardingPath = onboardingPaths.some((path) =>
    nextUrl.pathname.startsWith(path),
  );

  if (isLoggedIn) {
    // If logged in and visiting home, signin, or signup, immediately redirect at the edge to role workspace
    if (
      nextUrl.pathname === "/" ||
      nextUrl.pathname === "/signin" ||
      nextUrl.pathname === "/signup"
    ) {
      const userRole = req.auth?.user?.role;
      const target = userRole === "TUTOR" ? "/tutor" : "/dashboard";
      return NextResponse.redirect(new URL(target, req.url));
    }

    // P0-5: Admin check exclusively via session role (set from env var in auth callbacks)
    const isUserAdmin = req.auth?.user?.role === "ADMIN";
    if (nextUrl.pathname.startsWith("/admin") && !isUserAdmin) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    // Only redirect to onboarding if user is trying to access protected app routes
    if (
      !isOnboardingCompleted &&
      !isOnboardingPath &&
      !isPublicPath &&
      nextUrl.pathname !== "/api/auth/signout"
    ) {
      return NextResponse.redirect(new URL("/onboarding", req.url));
    }
    if (isOnboardingCompleted && isOnboardingPath) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  } else {
    if (!isPublicPath) {
      // Preserve the current URL as callbackUrl so user returns here after sign-in
      const signInUrl = new URL("/signin", req.url);
      signInUrl.searchParams.set(
        "callbackUrl",
        nextUrl.pathname + nextUrl.search,
      );
      return NextResponse.redirect(signInUrl);
    }
  }

  // Add request ID header for log correlation (P2-7)
  const requestId = crypto.randomUUID();
  const response = NextResponse.next();
  response.headers.set("x-request-id", requestId);
  return response;
});

export const config = {
  // Match all routes except Next.js internals, images directory, and static file extensions
  matcher: [
    "/((?!_next/static|_next/image|favicon\\.ico|images/|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff|woff2|ttf|mp4|css|js)$).*)",
  ],
};
