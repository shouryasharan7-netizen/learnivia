"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export async function completeOnboarding(formData: FormData) {
  try {
    const session = await auth();
    if (!session?.user) {
      return { success: false, error: "Unauthorized" };
    }

    const primaryGoal = formData.get("primaryGoal") as string;
    
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        onboardingCompleted: true,
        primaryGoal,
      }
    });

    return { success: true };
  } catch (error: any) {
    console.error("Server Action Error (completeOnboarding):", error);
    return { success: false, error: error.message || "Unknown error occurred" };
  }
}
