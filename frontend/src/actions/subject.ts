"use server";

import { auth } from "@/auth";
import connectDB from "@/lib/db";
import Subject from "@/models/Subject";
import { revalidatePath } from "next/cache";
import fs from "fs";

export async function createSubject(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized" };

  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const color = formData.get("color") as string;

  if (!name) return { error: "Name is required" };

  await connectDB();

  try {
    await Subject.create({
      name,
      description,
      color: color || "#4f46e5",
      userId: session.user.id,
    });
    revalidatePath("/dashboard/subjects");
    return { success: "Subject created successfully" };
  } catch (e) {
    return { error: "Failed to create subject" };
  }
}

export async function deleteSubject(subjectId: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized" };

  await connectDB();

  try {
    const subject = await Subject.findOneAndDelete({
      _id: subjectId,
      userId: session.user.id,
    });

    if (!subject) return { error: "Subject not found or unauthorized" };

    revalidatePath("/dashboard/subjects");
    return { success: "Subject deleted" };
  } catch (e) {
    return { error: "Failed to delete subject" };
  }
}


