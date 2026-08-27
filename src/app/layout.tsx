import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Providers } from "@/components/Providers";

export const metadata: Metadata = {
  title: {
    template: "%s | Learnivia",
    default: "Learnivia — Free Peer-to-Peer Online Tutoring",
  },
  description: "Find a volunteer tutor for free. Browse subjects, choose a time, and meet one-on-one through Zoom. Completely free, always.",
  keywords: ["free tutoring", "volunteer tutor", "online tutoring", "peer learning", "homework help"],
  openGraph: {
    type: "website",
    siteName: "Learnivia",
    title: "Learnivia — Free Peer-to-Peer Online Tutoring",
    description: "Find a volunteer tutor for free. Browse subjects, choose a time, and meet one-on-one through Zoom.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Navbar />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
