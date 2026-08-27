import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import NextAuth from "next-auth"
import { authConfig } from "./auth.config"

const { auth } = NextAuth(authConfig)

// Paths that require authentication but not necessarily onboarding
const publicPaths = ["/", "/signin", "/find", "/api/auth"]
const onboardingPaths = ["/onboarding"]

export default auth((req) => {
  const { nextUrl } = req
  const isLoggedIn = !!req.auth
  const isOnboardingCompleted = req.auth?.user?.onboardingCompleted

  const isPublicPath = publicPaths.some(path => nextUrl.pathname === path || nextUrl.pathname.startsWith("/api/auth"))
  const isOnboardingPath = onboardingPaths.some(path => nextUrl.pathname.startsWith(path))

  if (isLoggedIn) {
    if (!isOnboardingCompleted && !isOnboardingPath && nextUrl.pathname !== "/api/auth/signout") {
      // Force user to onboarding
      return NextResponse.redirect(new URL("/onboarding", req.url))
    }
    if (isOnboardingCompleted && isOnboardingPath) {
      // User is already onboarded, don't let them back to onboarding
      return NextResponse.redirect(new URL("/dashboard", req.url))
    }
  } else {
    if (!isPublicPath) {
      return NextResponse.redirect(new URL("/signin", req.url))
    }
  }
  
  return NextResponse.next()
})

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|images).*)"],
}
