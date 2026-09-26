"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

const VALID_GRADES = [
  "Kindergarten",
  "Grade 1",
  "Grade 2",
  "Grade 3",
  "Grade 4",
  "Grade 5",
  "Grade 6",
  "Grade 7",
  "Grade 8",
  "Grade 9",
  "Grade 10",
];

export async function createChildProfile(formData: FormData) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return {
        success: false,
        error: "You must be signed in to manage child profiles.",
      };
    }

    const firstName = ((formData.get("firstName") as string) || "").trim();
    let lastInitial = ((formData.get("lastInitial") as string) || "")
      .trim()
      .toUpperCase();
    const grade = ((formData.get("grade") as string) || "").trim();
    const ageRaw = formData.get("age") as string;
    const notes = ((formData.get("notes") as string) || "").trim();
    const preferences = (
      (formData.get("learningPreferences") as string) || ""
    ).trim();

    if (!firstName) {
      return { success: false, error: "First name is required." };
    }

    if (!lastInitial) {
      return {
        success: false,
        error:
          "Last initial is required for child privacy protection (never full surname).",
      };
    }

    // Format last initial as single uppercase letter or single letter with dot
    lastInitial = lastInitial.charAt(0) + ".";

    if (!VALID_GRADES.includes(grade)) {
      return {
        success: false,
        error: "Please select a valid K-10 grade level.",
      };
    }

    let age: number | undefined = undefined;
    if (ageRaw) {
      const parsedAge = parseInt(ageRaw, 10);
      if (isNaN(parsedAge) || parsedAge < 4 || parsedAge > 17) {
        return {
          success: false,
          error: "Student age must be between 4 and 17.",
        };
      }
      age = parsedAge;
    }

    const profile = await prisma.childProfile.create({
      data: {
        parentId: session.user.id,
        firstName,
        lastInitial,
        grade,
        age,
        learningPreferences: preferences || null,
        notes: notes || null,
      },
    });

    revalidatePath("/dashboard");
    return { success: true, profile };
  } catch (error: any) {
    console.error("Failed to create child profile:", error);
    return {
      success: false,
      error: error.message || "Failed to create child profile.",
    };
  }
}

export async function deleteChildProfile(childId: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return {
        success: false,
        error: "You must be signed in to delete a child profile.",
      };
    }

    const child = await prisma.childProfile.findUnique({
      where: { id: childId },
    });

    if (!child) {
      return { success: false, error: "Child profile not found." };
    }

    // Enforce ownership: only the parent or an admin can delete
    if (
      child.parentId !== session.user.id &&
      (session.user as any).role !== "ADMIN"
    ) {
      return {
        success: false,
        error:
          "Unauthorized: You can only manage your own children's profiles.",
      };
    }

    await prisma.childProfile.delete({
      where: { id: childId },
    });

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error: any) {
    console.error("Failed to delete child profile:", error);
    return {
      success: false,
      error: error.message || "Failed to delete child profile.",
    };
  }
}
