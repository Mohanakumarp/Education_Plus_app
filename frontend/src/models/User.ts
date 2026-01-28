import mongoose, { Schema, Model, Document } from "mongoose";

export interface IAcademicDetails {
  school?: string;
  grade?: string;
  stream?: string; // e.g., Science, Commerce
}

export interface IUser extends Document {
  name?: string;
  email: string;
  password?: string; // For credentials provider
  image?: string;
  role: "student" | "admin" | "teacher";
  phone?: string;
  language?: string;
  isAnonymous: boolean;
  academicDetails?: IAcademicDetails;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String },
    email: { type: String, unique: true, required: true },
    password: { type: String, select: false }, // Hide by default
    image: { type: String },
    role: {
      type: String,
      enum: ["student", "admin", "teacher"],
      default: "student",
    },
    phone: { type: String },
    language: { type: String, default: "en" },
    isAnonymous: { type: Boolean, default: false },
    academicDetails: {
      school: String,
      grade: String,
      stream: String,
    },
  },
  { timestamps: true },
);

// Prevent overwrite in hot-reload
const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;
