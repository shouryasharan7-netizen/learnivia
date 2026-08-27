import { NextResponse } from "next/server"
import NextAuth from "next-auth"
import { authConfig } from "./auth.config"

const { auth } = NextAuth(authConfig)

// All routes accessible without login
const publicPaths = [
  "/",
  "/signin",
  "/find",
  "/how-it-works",
  "/about",
  "/safety",
  "/stories",
  "/parents",
  "/educators",
  "/support",
  "/privacy",
  "/terms",
  "/cookies",
  "/learn",
]

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
    // Admin check
    // @ts-ignore
    if (nextUrl.pathname.startsWith("/admin") && req.auth?.user?.role !== "ADMIN") {
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
