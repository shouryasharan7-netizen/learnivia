"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateSettings(formData: FormData) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return { success: false, error: "Not authenticated" };
    }

    const name = formData.get("name") as string;
    const timezone = formData.get("timezone") as string;
    const primaryGoal = formData.get("primaryGoal") as string;
    const grade = formData.get("grade") as string;
    
    // Tutor specific fields
    const bio = formData.get("bio") as string;
    const school = formData.get("school") as string;

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { tutorProfile: true }
    });

    if (!user) {
      return { success: false, error: "User not found" };
    }

    // Update base User
    await prisma.user.update({
      where: { id: user.id },
      data: {
        name: name?.trim() || undefined,
        timezone: timezone || undefined,
        primaryGoal: primaryGoal || undefined,
        grade: grade || undefined,
      },
    });

    // Update TutorProfile if they have one and provided tutor fields
    if (user.tutorProfile && (bio !== null || school !== null)) {
      await prisma.tutorProfile.update({
        where: { userId: user.id },
        data: {
          bio: bio?.trim() || undefined,
          school: school?.trim() || undefined,
        }
      });
    }

    revalidatePath("/settings");
    revalidatePath("/dashboard");
    revalidatePath("/tutor");
    
    return { success: true };
  } catch (error: any) {
    console.error("Settings update error:", error);
    return { success: false, error: error.message || "Failed to update settings" };
  }
}
