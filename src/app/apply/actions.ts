"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export async function submitApplication(formData: FormData) {
  const session = await auth();
  
  if (!session?.user?.id) {
    throw new Error("You must be logged in to apply.");
  }

  const bio = formData.get("bio") as string;
  const timezone = formData.get("timezone") as string;
  const grades = formData.getAll("grades") as string[];

  // 1. Update User timezone
  await prisma.user.update({
    where: { id: session.user.id },
    data: { timezone },
  });

  // 2. Create Tutor Profile (Status defaults to PENDING)
  // We handle grades later, but for now we just create the profile.
  // We need to map the grades and subjects nicely, but for MVP we will store it simply or relate it.
  
  const profile = await prisma.tutorProfile.upsert({
    where: { userId: session.user.id },
    update: {
      bio,
      status: "PENDING",
    },
    create: {
      userId: session.user.id,
      bio,
      status: "PENDING",
    },
  });

  // Redirect to success page or dashboard
  redirect("/dashboard");
}
