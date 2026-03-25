import mongoose, { Schema, Document, Model } from "mongoose";

export interface ITask extends Document {
    title: string;
    userId: mongoose.Types.ObjectId;
    subjectId?: mongoose.Types.ObjectId;
    subject?: string;
    status: "todo" | "doing" | "done";
    priority: "low" | "medium" | "high";
    dueDate?: Date;
    createdAt: Date;
    updatedAt: Date;
}

const TaskSchema = new Schema<ITask>(
    {
        title: { type: String, required: true },
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        subjectId: { type: Schema.Types.ObjectId, ref: "Subject" },
        subject: { type: String, default: "General" },
        status: {
            type: String,
            enum: ["todo", "doing", "done"],
            default: "todo",
        },
        priority: {
            type: String,
            enum: ["low", "medium", "high"],
            default: "medium",
        },
        dueDate: { type: Date },
    },
    { timestamps: true },
);

const Task: Model<ITask> =
    mongoose.models.Task || mongoose.model<ITask>("Task", TaskSchema);

export default Task;
