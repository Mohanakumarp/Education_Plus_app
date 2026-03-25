import mongoose, { Schema, Document, Model } from "mongoose";

export interface IStudySession extends Document {
    userId: mongoose.Types.ObjectId;
    subjectId?: mongoose.Types.ObjectId;
    durationMinutes: number;
    startTime: Date;
    endTime: Date;
}

const StudySessionSchema = new Schema<IStudySession>(
    {
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        subjectId: { type: Schema.Types.ObjectId, ref: "Subject" },
        durationMinutes: { type: Number, required: true },
        startTime: { type: Date, required: true },
        endTime: { type: Date, required: true },
    },
    { timestamps: true }
);

const StudySession: Model<IStudySession> =
    mongoose.models.StudySession || mongoose.model<IStudySession>("StudySession", StudySessionSchema);

export default StudySession;
