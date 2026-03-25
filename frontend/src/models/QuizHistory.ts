import mongoose, { Schema, Document, Model } from "mongoose";

export interface IQuizHistory extends Document {
    userId: mongoose.Types.ObjectId;
    subjectId?: mongoose.Types.ObjectId;
    score: number;
    totalQuestions: number;
    topic?: string;
    createdAt: Date;
}

const QuizHistorySchema = new Schema<IQuizHistory>(
    {
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        subjectId: { type: Schema.Types.ObjectId, ref: "Subject" },
        score: { type: Number, required: true },
        totalQuestions: { type: Number, required: true },
        topic: { type: String },
    },
    { timestamps: { createdAt: true, updatedAt: false } },
);

const QuizHistory: Model<IQuizHistory> =
    mongoose.models.QuizHistory || mongoose.model<IQuizHistory>("QuizHistory", QuizHistorySchema);

export default QuizHistory;
