import { auth } from "@/auth";
import connectDB from "@/lib/db";
import Subject from "@/models/Subject";
import { SubjectList } from "./subject-list";
import { redirect } from "next/navigation";

export default async function SubjectsPage() {
  const session = await auth();
  if (!session) redirect("/login");

  await connectDB();
  
  // lean() returns POJOs, needed for passing to client component
  // We need to convert _id to string manually if lean doesn't handle it fully for serialization
  const subjects = await Subject.find({ userId: session.user.id })
    .sort({ createdAt: -1 })
    .lean();

  const serializedSubjects = subjects.map(s => ({
    ...s,
    _id: s._id.toString(),
    userId: s.userId.toString(),
    createdAt: s.createdAt?.toISOString(), // optional chaining in case keys missing
    updatedAt: s.updatedAt?.toISOString()
  }));

  return (
    <div className="p-8">
      <SubjectList subjects={serializedSubjects} />
    </div>
  );
}
