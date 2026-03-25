"use server";

import { auth } from "@/auth";
import connectDB from "@/lib/db";
import StudySession from "@/models/StudySession";
import QuizHistory from "@/models/QuizHistory";
import Note from "@/models/Note";
import Subject from "@/models/Subject";
import { startOfWeek, endOfWeek, eachDayOfInterval, format, subDays } from "date-fns";

import { revalidatePath } from "next/cache";

export async function saveStudySession(data: {
    durationMinutes: number;
    startTime: Date;
    endTime: Date;
    subjectId?: string;
}) {
    const session = await auth();
    if (!session?.user?.id) return { error: "Unauthorized" };

    await connectDB();

    try {
        await StudySession.create({
            userId: session.user.id,
            ...data
        });
        revalidatePath("/dashboard");
        revalidatePath("/dashboard/tracker");
        return { success: true };
    } catch (e) {
        console.error(e);
        return { error: "Failed to save study session" };
    }
}

export async function getTrackerData() {
    const session = await auth();
    if (!session?.user?.id) return { error: "Unauthorized" };

    await connectDB();
    const userId = session.user.id;

    try {
        // Last 7 days for the main chart
        const start = subDays(new Date(), 6);
        const end = new Date();
        const days = eachDayOfInterval({ start, end });

        const chartData = await Promise.all(days.map(async (day) => {
            const dayStart = new Date(day.setHours(0, 0, 0, 0));
            const dayEnd = new Date(day.setHours(23, 59, 59, 999));

            const sessions = await StudySession.find({
                userId,
                startTime: { $gte: dayStart, $lte: dayEnd }
            });

            const notes = await Note.countDocuments({
                userId,
                createdAt: { $gte: dayStart, $lte: dayEnd }
            });

            const quizzes = await QuizHistory.countDocuments({
                userId,
                createdAt: { $gte: dayStart, $lte: dayEnd }
            });

            const studyHours = sessions.reduce((acc, s) => acc + (s.durationMinutes / 60), 0);

            return {
                name: format(day, "EEE"),
                study: Number(studyHours.toFixed(1)),
                notes,
                quizzes
            };
        }));

        // Subject allocation
        const subjects = await Subject.find({ userId });
        const subjectsData = await Promise.all(subjects.map(async (sub) => {
            const sessions = await StudySession.find({ userId, subjectId: sub._id });
            const totalMins = sessions.reduce((acc, s) => acc + s.durationMinutes, 0);
            return {
                name: sub.name,
                value: totalMins,
                color: sub.color || "#4f46e5"
            };
        }));

        // Calculate percentages for subject allocation
        const totalMinsAll = subjectsData.reduce((acc, s) => acc + s.value, 0);
        const subjectsDataPerc = subjectsData.map(s => ({
            ...s,
            value: totalMinsAll > 0 ? Math.round((s.value / totalMinsAll) * 100) : 0
        })).filter(s => s.value > 0);

        // Stats
        const totalSessions = await StudySession.find({ userId });
        const totalFocusMins = totalSessions.reduce((acc, s) => acc + s.durationMinutes, 0);
        const totalFocusHours = (totalFocusMins / 60).toFixed(1);

        const allQuizzes = await QuizHistory.find({ userId });
        const avgScore = allQuizzes.length > 0
            ? Math.round((allQuizzes.reduce((acc, q) => acc + (q.score / q.totalQuestions), 0) / allQuizzes.length) * 100)
            : 0;

        return {
            chartData,
            subjectsData: subjectsDataPerc,
            stats: {
                totalFocus: `${totalFocusHours}h`,
                knowledgeEq: `${avgScore}%`,
                maxStreak: "12 Days", // Placeholder for now, needs complex logic
                targetGap: "-4h" // Placeholder
            }
        };

    } catch (e) {
        console.error(e);
        return { error: "Failed to fetch tracker data" };
    }
}
