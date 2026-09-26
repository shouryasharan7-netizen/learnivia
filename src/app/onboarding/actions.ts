"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function completeOnboarding(formData: FormData) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" };
    }

    const primaryGoal = formData.get("primaryGoal") as string;
    const rawAge = formData.get("age") as string;
    const age = rawAge ? parseInt(rawAge, 10) : undefined;
    const grade = (formData.get("grade") as string) || undefined;
    const curriculum = (formData.get("curriculum") as string) || undefined;
    const school = (formData.get("school") as string) || undefined;
    const educationLevel =
      (formData.get("educationLevel") as string) || undefined;

    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        onboardingCompleted: true,
        primaryGoal,
        age: isNaN(age as number) ? undefined : age,
        grade: educationLevel || grade,
        curriculum,
      },
    });

    if (primaryGoal === "become_tutor") {
      await prisma.tutorProfile.upsert({
        where: { userId: session.user.id },
        create: {
          userId: session.user.id,
          school: school || null,
          currentGrade: educationLevel || null,
          curricula: curriculum || null,
          status: "PENDING",
        },
        update: {
          school: school || undefined,
          currentGrade: educationLevel || undefined,
          curricula: curriculum || undefined,
        },
      });
    }

    return { success: true };
  } catch (error: any) {
    console.error("Server Action Error (completeOnboarding):", error);
    return { success: false, error: error.message || "Unknown error occurred" };
  }
}
