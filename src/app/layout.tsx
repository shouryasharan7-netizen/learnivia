import type { Metadata } from "next";
import { Poppins, Playfair_Display, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { AppShell } from "@/components/workspace/AppShell";
import { Analytics } from "@vercel/analytics/react";

const serif = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
  preload: true,
});

const sans = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
  preload: true,
});

const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  title: {
    template: "%s | Learnivia",
    default: "Learnivia - Free Peer-to-Peer Online Tutoring",
  },
  description:
    "Free 1-on-1 tutoring and interactive workshops led by high school and university peers. No subscriptions, zero fees.",
  keywords: [
    "free tutoring",
    "volunteer tutor",
    "online tutoring",
    "peer learning",
    "homework help",
    "K-10 tutoring",
  ],
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/images/logo.png",
  },
  openGraph: {
    type: "website",
    siteName: "Learnivia",
    title: "Learnivia - Free Peer-to-Peer Online Tutoring",
    description:
      "Free 1-on-1 tutoring and interactive workshops led by high school and university peers. No subscriptions, zero fees.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-theme="light"
      suppressHydrationWarning
      className={`${serif.variable} ${sans.variable} ${mono.variable}`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var saved = localStorage.getItem('learnivia-theme');
                  if (saved === 'dark' || saved === 'light') {
                    document.documentElement.setAttribute('data-theme', saved);
                  } else {
                    document.documentElement.setAttribute('data-theme', 'light');
                  }
                } catch (e) {
                  document.documentElement.setAttribute('data-theme', 'light');
                }
              })();
            `,
          }}
        />
      </head>
      <body
        className={sans.className}
        style={{ fontFamily: "'Proxima Nova', var(--font-sans)" }}
      >
        <Providers>
          <AppShell>
            {children}
            <Analytics />
          </AppShell>
        </Providers>
      </body>
    </html>
  );
}
