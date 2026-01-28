"use server";

import { auth } from "@/auth";
import connectDB from "@/lib/db";
import User from "@/models/User";
import { revalidatePath } from "next/cache";

export async function updateProfile(formData: FormData) {
  const session = await auth();
  if (!session || !session.user?.email) {
    return { error: "Unauthorized" };
  }

  const name = formData.get("name") as string;
  const phone = formData.get("phone") as string;
  const language = formData.get("language") as string;
  const school = formData.get("school") as string;
  const grade = formData.get("grade") as string;
  const stream = formData.get("stream") as string;

  await connectDB();

  try {
    await User.updateOne(
      { email: session.user.email },
      {
        name,
        phone,
        language,
        academicDetails: {
          school,
          grade,
          stream,
        },
      },
    );
    revalidatePath("/dashboard/profile");
    return { success: "Profile updated successfully" };
  } catch (e) {
    console.error(e);
    return { error: "Failed to update profile" };
  }
}
