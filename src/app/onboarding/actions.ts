"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export async function completeOnboarding(formData: FormData) {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const primaryGoal = formData.get("primaryGoal") as string;
  
  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      onboardingCompleted: true,
      primaryGoal,
    }
  });

  // Return success to the client so it can handle the redirect
  return { success: true };
}
