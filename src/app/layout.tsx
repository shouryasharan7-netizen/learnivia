import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Providers } from "@/components/Providers";
import { AuthShell } from "@/components/AuthShell";

export const metadata: Metadata = {
  title: {
    template: "%s | Learnivia",
    default: "Learnivia — Free Peer-to-Peer Online Tutoring",
  },
  description: "Join our peer-led community for free tutoring, homework help, and meaningful conversations with students around the globe.",
  keywords: ["free tutoring", "volunteer tutor", "online tutoring", "peer learning", "homework help", "SAT prep"],
  openGraph: {
    type: "website",
    siteName: "Learnivia",
    title: "Learnivia — Free Peer-to-Peer Online Tutoring",
    description: "Join our peer-led community for free tutoring, homework help, and meaningful conversations with students around the globe.",
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
          <AuthShell>
            {children}
          </AuthShell>
        </Providers>
      </body>
    </html>
  );
}
