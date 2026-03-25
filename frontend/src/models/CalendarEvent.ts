import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICalendarEvent extends Document {
    userId: mongoose.Types.ObjectId;
    date: string; // YYYY-MM-DD
    title: string;
    time: string;
    type: "Study" | "Collab" | "Exam" | "Task";
}

const CalendarEventSchema = new Schema<ICalendarEvent>(
    {
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        date: { type: String, required: true },
        title: { type: String, required: true },
        time: { type: String, required: true },
        type: {
            type: String,
            enum: ["Study", "Collab", "Exam", "Task"],
            required: true,
        },
    },
    { timestamps: true }
);

const CalendarEvent: Model<ICalendarEvent> =
    mongoose.models.CalendarEvent || mongoose.model<ICalendarEvent>("CalendarEvent", CalendarEventSchema);

export default CalendarEvent;
