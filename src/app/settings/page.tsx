import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import SettingsFormClient from "./SettingsFormClient";
import type { Metadata } from "next";
import styles from "./page.module.css";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Account Settings | Learnivia",
  description:
    "Manage your Learnivia account settings, profile, and preferences.",
};

export default async function SettingsPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/signin?callbackUrl=/settings");
  }

  // Fetch full user details including TutorProfile if exists
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      tutorProfile: {
        include: {
          subjects: true,
          gradeLevels: true,
        },
      },
    },
  });

  if (!user) {
    redirect("/signin");
  }

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Account Settings</h1>
          <p className={styles.subtitle}>
            Manage your personal information, timezone, and profile visibility.
          </p>
        </div>

        <SettingsFormClient user={user} />
      </div>
    </main>
  );
}
