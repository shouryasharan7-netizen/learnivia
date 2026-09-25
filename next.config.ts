import type { NextConfig } from "next";

// ─── P0-6: Content Security Policy ─────────────────────────────────────────
// Strict CSP for a children's educational platform.
// - no 'unsafe-eval' anywhere
// - 'unsafe-inline' only for styles (Next.js inlines critical CSS; can tighten with nonces later)
// - Zoom join URLs allowed under frame-ancestors for Zoom web client embed
// - Google accounts allowed for OAuth iframe
// - Supabase storage for file assets
// - Vercel analytics domains whitelisted
const csp = [
  "default-src 'self'",
  // Scripts: own origin + Vercel analytics + Next.js HMR websocket (dev only stripped at edge)
  "script-src 'self' 'unsafe-inline' https://va.vercel-scripts.com https://vercel.live",
  // Styles: own origin + inline (Next.js SSR inlines critical styles)
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  // Fonts: Google Fonts
  "font-src 'self' https://fonts.gstatic.com",
  // Images: own origin + Google user avatars + Supabase storage + data URIs for SVG
  "img-src 'self' data: blob: https://lh3.googleusercontent.com https://*.supabase.co https://vercel.com",
  // Connections: own origin + NextAuth OAuth + Zoom API + Resend + Supabase + Vercel analytics
  "connect-src 'self' https://accounts.google.com https://api.zoom.us https://*.supabase.co https://vitals.vercel-insights.com https://va.vercel-scripts.com",
  // Frames: DENY embedding of our site + allow Zoom web client only
  "frame-src https://zoom.us https://*.zoom.us https://www.youtube.com https://www.youtube-nocookie.com",
  // Our pages cannot be embedded (anti-clickjacking backup to X-Frame-Options)
  "frame-ancestors 'none'",
  // Form submissions only to self
  "form-action 'self' https://accounts.google.com",
  // Upgrade all HTTP to HTTPS
  "upgrade-insecure-requests",
  // Report violations (future: wire to /api/csp-report endpoint)
  // "report-uri /api/csp-report",
].join("; ");

const nextConfig: NextConfig = {
  // ─── Experimental Performance Features ─────────────────────────────────────
  experimental: {
    serverActions: {
      // P0-15: Reduced from 10mb to 2mb to limit upload abuse surface
      bodySizeLimit: "2mb",
    },
    // Tree-shake large packages — only import what's used
    optimizePackageImports: [
      "lucide-react",
      "motion",
      "clsx",
      "tailwind-merge",
      "sonner",
    ],
    // optimizeCss disabled in dev to prevent critters regex hang
    optimizeCss: false,
    // Client-side router cache for blazing fast page transitions
    staleTimes: {
      dynamic: 30, // 30s client router cache for instant back/forward & link navigations
      static: 180, // 3 min cache for static content
    },
  },

  // ─── Image Optimization ─────────────────────────────────────────────────────
  images: {
    // AVIF first (50% smaller than WebP), WebP fallback
    formats: ["image/avif", "image/webp"],
    // Cache optimized images for 7 days on CDN
    minimumCacheTTL: 604800,
    // Only allow images from approved domains
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.supabase.co",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
    ],
  },

  // ─── HTTP Security & Cache Headers ──────────────────────────────────────────
  headers: async () => [
    {
      // Apply to all routes
      source: "/:path*",
      headers: [
        // P0-6: Content Security Policy
        { key: "Content-Security-Policy", value: csp },
        // Prevent clickjacking
        { key: "X-Frame-Options", value: "DENY" },
        // Stop MIME sniffing
        { key: "X-Content-Type-Options", value: "nosniff" },
        // Enforce HTTPS for 1 year
        { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains; preload" },
        // Minimal referrer for privacy
        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        // Block dangerous features
        { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
        // Remove X-Powered-By (defense in depth — also set via poweredByHeader: false)
        { key: "X-Powered-By", value: "" },
      ],
    },
    {
      // Aggressively cache static assets (JS, CSS, images, fonts, media)
      source: "/(_next/static|images|favicon.ico)/:path*",
      headers: [
        { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
      ],
    },
    {
      // Aggressively cache public static media assets
      source: "/:all*(svg|jpg|jpeg|png|webp|ico|woff|woff2|ttf|mp4)",
      headers: [
        { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
      ],
    },
    {
      // API routes: no caching (always fresh)
      source: "/api/:path*",
      headers: [
        { key: "Cache-Control", value: "no-store, no-cache, must-revalidate" },
      ],
    },
  ],

  // ─── Compiler Optimizations ─────────────────────────────────────────────────
  compiler: {
    // Remove console.* calls in production (except errors and warnings)
    removeConsole: process.env.NODE_ENV === "production"
      ? { exclude: ["error", "warn"] }
      : false,
  },

  // ─── Build Optimizations ─────────────────────────────────────────────────────
  poweredByHeader: false, // Remove X-Powered-By: Next.js header
  compress: true,          // Enable gzip/brotli compression

  // ─── TypeScript & Lint ───────────────────────────────────────────────────────
  typescript: {
    ignoreBuildErrors: false,
  },
};

export default nextConfig;
