import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ─── Experimental Performance Features ─────────────────────────────────────
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
    // Tree-shake large packages — only import what's used
    optimizePackageImports: [
      "lucide-react",
      "@radix-ui/react-icons",
      "date-fns",
    ],
    // Optimize CSS by inlining critical styles
    optimizeCss: true,
    // Deduplicate identical fetch calls within a render
    staleTimes: {
      dynamic: 0,
      static: 180, // 3 min ISR for static content
    },
  },

  // ─── Image Optimization ─────────────────────────────────────────────────────
  images: {
    // AVIF first (50% smaller than WebP), WebP fallback
    formats: ["image/avif", "image/webp"],
    // Cache optimized images for 7 days on CDN
    minimumCacheTTL: 604800,
    // Only allow images from our own domain
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
        // Prevent clickjacking
        { key: "X-Frame-Options", value: "DENY" },
        // Stop MIME sniffing
        { key: "X-Content-Type-Options", value: "nosniff" },
        // Enforce HTTPS for 1 year
        { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains; preload" },
        // Minimal referrer for privacy
        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        // Block dangerous features (no camera/mic without explicit need)
        { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
      ],
    },
    {
      // Aggressively cache static assets (JS, CSS, images)
      source: "/(_next/static|images|favicon.ico)/:path*",
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
    // Remove console.* calls in production (except errors)
    removeConsole: process.env.NODE_ENV === "production"
      ? { exclude: ["error", "warn"] }
      : false,
  },

  // ─── Build Optimizations ─────────────────────────────────────────────────────
  poweredByHeader: false, // Remove X-Powered-By: Next.js header (minor security hardening)
  compress: true,          // Enable gzip/brotli compression

  // ─── TypeScript & Lint ───────────────────────────────────────────────────────
  typescript: {
    ignoreBuildErrors: false,
  },
};

export default nextConfig;


