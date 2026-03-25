"use server";

import { auth } from "@/auth";
import connectDB from "@/lib/db";
import CalendarEvent from "@/models/CalendarEvent";
import { revalidatePath } from "next/cache";

export async function getEvents() {
    const session = await auth();
    if (!session?.user?.id) return { error: "Unauthorized" };

    await connectDB();
    try {
        const events = await CalendarEvent.find({ userId: session.user.id }).sort({ time: 1 }).lean();
        return {
            events: events.map(e => ({
                id: (e as any)._id.toString(),
                date: (e as any).date,
                title: (e as any).title,
                time: (e as any).time,
                type: (e as any).type
            }))
        };
    } catch (e) {
        return { error: "Failed to fetch events" };
    }
}

export async function addEvent(data: {
    date: string;
    title: string;
    time: string;
    type: "Study" | "Collab" | "Exam" | "Task";
}) {
    const session = await auth();
    if (!session?.user?.id) return { error: "Unauthorized" };

    await connectDB();
    try {
        const event = await CalendarEvent.create({
            ...data,
            userId: session.user.id
        });
        revalidatePath("/dashboard/calendar");
        return {
            event: {
                id: (event as any)._id.toString(),
                date: (event as any).date,
                title: (event as any).title,
                time: (event as any).time,
                type: (event as any).type
            }
        };
    } catch (e) {
        return { error: "Failed to create event" };
    }
}

export async function deleteEvent(id: string) {
    const session = await auth();
    if (!session?.user?.id) return { error: "Unauthorized" };

    await connectDB();
    try {
        await CalendarEvent.deleteOne({ _id: id, userId: session.user.id });
        revalidatePath("/dashboard/calendar");
        return { success: true };
    } catch (e) {
        return { error: "Failed to delete event" };
    }
}
