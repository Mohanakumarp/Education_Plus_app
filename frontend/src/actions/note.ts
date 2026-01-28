"use server";

import { auth } from "@/auth";
import connectDB from "@/lib/db";
import Note from "@/models/Note";
import { revalidatePath } from "next/cache";

export async function createNote(subjectId: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized" };

  await connectDB();

  try {
    const note = await Note.create({
      title: "Untitled Note",
      content: "",
      subjectId,
      userId: session.user.id,
    });
    
    // Return the ID to redirect in client
    return { success: true, noteId: note._id.toString() };
  } catch (e) {
    return { error: "Failed to create note" };
  }
}

export async function updateNote(noteId: string, data: { title?: string; content?: string }) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized" };

  await connectDB();

  try {
    await Note.findByIdAndUpdate(
        noteId, 
        { ...data },
        { new: true }
    );
    revalidatePath(`/dashboard/notes/${noteId}`);
    return { success: true };
  } catch (e) {
    return { error: "Failed to save note" };
  }
}

export async function deleteNote(noteId: string, subjectId: string) {
    const session = await auth();
    if (!session?.user?.id) return { error: "Unauthorized" };
  
    await connectDB();
  
    try {
      await Note.findByIdAndDelete(noteId);
      revalidatePath(`/dashboard/subjects/${subjectId}`);
      return { success: true };
    } catch (e) {
      return { error: "Failed to delete note" };
    }
}
