"use server";

import { auth } from "@/auth";
import connectDB from "@/lib/db";
import Subject from "@/models/Subject";
import Note from "@/models/Note";
import Task from "@/models/Task";
import User from "@/models/User";
import QuizHistory from "@/models/QuizHistory";
import StudySession from "@/models/StudySession";
import CalendarEvent from "@/models/CalendarEvent";
import { revalidatePath } from "next/cache";

export async function seedMockData() {
    const session = await auth();
    if (!session?.user?.id) {
        return { error: "Login required" };
    }

    await connectDB();
    const userId = session.user.id;

    try {
        const subjects = [
            { name: "Applied Physics", color: "bg-indigo-500", description: "Mechanical properties and thermodynamics." },
            { name: "Data Structures", color: "bg-rose-500", description: "Algorithms and efficient data handling." },
            { name: "Digital Circuits", color: "bg-teal-500", description: "Boolean logic and gate design." },
            { name: "Mathematics IV", color: "bg-amber-500", description: "Complex analysis and vector calculus." },
        ];

        for (const sub of subjects) {
            const createdSub = await Subject.create({ ...sub, userId });

            await Note.create({
                title: `Introduction to ${sub.name}`,
                content: `<p>This is a starting note for ${sub.name}. Start adding your lecture notes here!</p>`,
                userId,
                subjectId: createdSub._id,
                tags: ["intro", "getting-started"]
            });

            await Task.create({
                title: `Review ${sub.name} Syllabus`,
                userId,
                subjectId: createdSub._id,
                subject: sub.name,
                status: "done",
                priority: "medium"
            });

            await Task.create({
                title: `${sub.name} Assignment 1`,
                userId,
                subjectId: createdSub._id,
                subject: sub.name,
                status: "todo",
                priority: "high",
                dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
            });

            // Seed Quiz History
            await QuizHistory.create({
                userId,
                subjectId: createdSub._id,
                score: Math.floor(Math.random() * 5) + 1,
                totalQuestions: 5,
                topic: sub.name
            });

            // Seed Study Sessions (last 7 days)
            for (let i = 0; i < 7; i++) {
                const day = new Date();
                day.setDate(day.getDate() - i);
                const duration = Math.floor(Math.random() * 120) + 30; // 30-150 mins
                await StudySession.create({
                    userId,
                    subjectId: createdSub._id,
                    durationMinutes: duration,
                    startTime: day,
                    endTime: new Date(day.getTime() + duration * 60000)
                });
            }

            // Seed Calendar Events
            await CalendarEvent.create({
                userId,
                date: new Date().toISOString().split('T')[0],
                title: `${sub.name} Group Study`,
                time: "14:00",
                type: "Collab"
            });
            await CalendarEvent.create({
                userId,
                date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                title: `${sub.name} Quiz`,
                time: "10:00",
                type: "Exam"
            });
        }

        revalidatePath("/dashboard");
        return { success: true };
    } catch (e) {
        console.error(e);
        return { error: "Seeding failed" };
    }
}
