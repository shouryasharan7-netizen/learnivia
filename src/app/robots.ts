import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/dashboard", "/api", "/onboarding", "/settings"],
    },
    sitemap: "https://learnivia-green.vercel.app/sitemap.xml",
  };
}
