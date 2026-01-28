import mongoose, { Schema, Document, Model } from "mongoose";

export interface INote extends Document {
  title: string;
  content: string; // Stored as HTML string
  subjectId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  isBookmarked: boolean;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const NoteSchema = new Schema<INote>(
  {
    title: { type: String, default: "Untitled Note" },
    content: { type: String, default: "" },
    subjectId: { type: Schema.Types.ObjectId, ref: "Subject", required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    isBookmarked: { type: Boolean, default: false },
    tags: [{ type: String }],
  },
  { timestamps: true },
);

const Note: Model<INote> =
  mongoose.models.Note || mongoose.model<INote>("Note", NoteSchema);

export default Note;
