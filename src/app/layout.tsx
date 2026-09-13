import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Newsreader } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { AppShell } from "@/components/workspace/AppShell";

const sans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const serif = Newsreader({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: {
    template: "%s | Learnivia",
    default: "Learnivia — Free Peer-to-Peer Online Tutoring",
  },
  description: "Free 1-on-1 tutoring and interactive workshops led by high school and university peers. No subscriptions, zero fees.",
  keywords: ["free tutoring", "volunteer tutor", "online tutoring", "peer learning", "homework help", "K-10 tutoring"],
  openGraph: {
    type: "website",
    siteName: "Learnivia",
    title: "Learnivia — Free Peer-to-Peer Online Tutoring",
    description: "Free 1-on-1 tutoring and interactive workshops led by high school and university peers. No subscriptions, zero fees.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${sans.variable} ${serif.variable}`}>
      <body className={sans.className}>
        <Providers>
          <AppShell>
            {children}
          </AppShell>
        </Providers>
      </body>
    </html>
  );
}
