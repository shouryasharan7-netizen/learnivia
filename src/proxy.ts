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

  const isPublicPath =
    publicPaths.some(path => nextUrl.pathname === path || nextUrl.pathname.startsWith(path + "/")) ||
    nextUrl.pathname.startsWith("/api/auth") ||
    nextUrl.pathname.startsWith("/tutors/")  // public tutor profiles

  const isOnboardingPath = onboardingPaths.some(path => nextUrl.pathname.startsWith(path))

  if (isLoggedIn) {
    // If logged in and visiting signin or signup, redirect immediately to dashboard
    if (nextUrl.pathname === "/signin" || nextUrl.pathname === "/signup") {
      return NextResponse.redirect(new URL("/dashboard", req.url))
    }

    // Admin check
    const userEmail = req.auth?.user?.email?.trim().toLowerCase();
    const isUserAdmin = req.auth?.user?.role === "ADMIN" || (userEmail ? ADMIN_EMAILS.has(userEmail) : false);
    if (nextUrl.pathname.startsWith("/admin") && !isUserAdmin) {
      return NextResponse.redirect(new URL("/dashboard", req.url))
    }

    if (!isOnboardingCompleted && !isOnboardingPath && nextUrl.pathname !== "/api/auth/signout") {
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
