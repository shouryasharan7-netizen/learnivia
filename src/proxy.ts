import { NextResponse } from "next/server"
import NextAuth from "next-auth"
import { authConfig } from "./auth.config"

const { auth } = NextAuth(authConfig)

// All routes accessible without login
const publicPaths = [
  "/",
  "/signin",
  "/signup",
  "/find",
  "/how-it-works",
  "/about",
  "/faq",
  "/safety",
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
]

const ADMIN_EMAILS = new Set([
  "shouryasharan7@gmail.com",
  "ahmedashfaqfarooqui@gmail.com",
  ...(process.env.ADMIN_EMAILS ? process.env.ADMIN_EMAILS.split(",").map((e) => e.trim().toLowerCase()) : []),
]);

const onboardingPaths = ["/onboarding"]

export default auth((req) => {
  const { nextUrl } = req
  const isLoggedIn = !!req.auth
  const isOnboardingCompleted = req.auth?.user?.onboardingCompleted

  // Public tutor profiles (/tutor/[id], /tutor/[id]/transcript) are accessible to guests;
  // /tutor dashboard and /tutor/training require authentication
  const isPublicTutorProfile =
    nextUrl.pathname.startsWith("/tutor/") &&
    !nextUrl.pathname.startsWith("/tutor/training") &&
    !nextUrl.pathname.startsWith("/tutor/transcript");

  const isPublicPath =
    publicPaths.some(path => nextUrl.pathname === path || nextUrl.pathname.startsWith(path + "/")) ||
    nextUrl.pathname.startsWith("/api/auth") ||
    isPublicTutorProfile

  const isOnboardingPath = onboardingPaths.some(path => nextUrl.pathname.startsWith(path))

  if (isLoggedIn) {
    // If logged in and visiting signin or signup, redirect immediately to their role interface
    if (nextUrl.pathname === "/signin" || nextUrl.pathname === "/signup") {
      const userRole = req.auth?.user?.role;
      const target = userRole === "TUTOR" ? "/tutor" : (userRole === "ADMIN" ? "/admin" : "/dashboard");
      return NextResponse.redirect(new URL(target, req.url));
    }

    // Admin check
    const userEmail = req.auth?.user?.email?.trim().toLowerCase();
    const isUserAdmin = req.auth?.user?.role === "ADMIN" || (userEmail ? ADMIN_EMAILS.has(userEmail) : false);
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

  return NextResponse.next()
})

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|images).*)"],
}
