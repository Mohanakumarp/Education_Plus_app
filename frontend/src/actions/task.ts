"use server";

import { auth } from "@/auth";
import connectDB from "@/lib/db";
import Task from "@/models/Task";
import { revalidatePath } from "next/cache";

export async function getTasks() {
    const session = await auth();
    if (!session?.user?.id) return { error: "Unauthorized" };

    await connectDB();

    try {
        const tasks = await Task.find({ userId: session.user.id }).sort({ createdAt: -1 }).lean();
        return {
            tasks: tasks.map(t => ({
                id: (t as any)._id.toString(),
                title: (t as any).title,
                status: (t as any).status,
                priority: (t as any).priority,
                subject: (t as any).subject
            }))
        };
    } catch (e) {
        return { error: "Failed to fetch tasks" };
    }
}

export async function getCalendarData() {
    const session = await auth();
    if (!session?.user?.id) return { error: "Unauthorized" };

    await connectDB();

    try {
        const tasks = await Task.find({
            userId: session.user.id,
            dueDate: { $ne: null }
        }).lean();

        return {
            tasks: tasks.map(t => ({
                _id: t._id.toString(),
                title: t.title,
                dueDate: (t as any).dueDate?.toISOString(),
                subject: (t as any).subject,
                priority: (t as any).priority
            }))
        };
    } catch (e) {
        console.error(e);
        return { error: "Failed to fetch calendar data" };
    }
}

export async function createTask(formData: FormData) {
    const session = await auth();
    if (!session?.user?.id) return { error: "Unauthorized" };

    const title = formData.get("title") as string;
    const status = formData.get("status") as "todo" | "doing" | "done" || "todo";
    const priority = formData.get("priority") as "low" | "medium" | "high" || "medium";
    const subject = formData.get("subject") as string || "General";

    if (!title) return { error: "Title is required" };

    await connectDB();

    try {
        await Task.create({
            title,
            userId: session.user.id,
            status,
            priority,
            subject,
        });
        revalidatePath("/dashboard");
        revalidatePath("/dashboard/tasks");
        return { success: true };
    } catch (e) {
        return { error: "Failed to create task" };
    }
}

export async function updateTask(taskId: string, data: any) {
    const session = await auth();
    if (!session?.user?.id) return { error: "Unauthorized" };

    await connectDB();

    try {
        await Task.findByIdAndUpdate(taskId, { ...data }, { new: true });
        revalidatePath("/dashboard");
        revalidatePath("/dashboard/tasks");
        return { success: true };
    } catch (e) {
        return { error: "Failed to update task" };
    }
}

export async function deleteTask(taskId: string) {
    const session = await auth();
    if (!session?.user?.id) return { error: "Unauthorized" };

    await connectDB();

    try {
        await Task.findByIdAndDelete(taskId);
        revalidatePath("/dashboard");
        revalidatePath("/dashboard/tasks");
        return { success: true };
    } catch (e) {
        return { error: "Failed to delete task" };
    }
}

export async function toggleTaskStatus(taskId: string, currentStatus: string) {
    const session = await auth();
    if (!session?.user?.id) return { error: "Unauthorized" };

    const nextStatus: Record<string, string> = {
        todo: "doing",
        doing: "done",
        done: "todo",
    };

    await connectDB();

    try {
        await Task.findByIdAndUpdate(taskId, { status: nextStatus[currentStatus] || "todo" });
        revalidatePath("/dashboard");
        revalidatePath("/dashboard/tasks");
        return { success: true };
    } catch (e) {
        return { error: "Failed to toggle status" };
    }
}
