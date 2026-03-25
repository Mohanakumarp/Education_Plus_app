"use server";

import { auth } from "@/auth";
import connectDB from "@/lib/db";
import QuizHistory from "@/models/QuizHistory";
import { revalidatePath } from "next/cache";

export async function saveQuizResult(data: {
    subjectId?: string;
    score: number;
    totalQuestions: number;
    topic?: string;
}) {
    const session = await auth();
    if (!session?.user?.id) return { error: "Unauthorized" };

    await connectDB();

    try {
        await QuizHistory.create({
            userId: session.user.id,
            subjectId: data.subjectId,
            score: data.score,
            totalQuestions: data.totalQuestions,
            topic: data.topic
        });

        revalidatePath("/dashboard");
        revalidatePath("/dashboard/tracker");

        return { success: true };
    } catch (e) {
        console.error(e);
        return { error: "Failed to save quiz result" };
    }
}
