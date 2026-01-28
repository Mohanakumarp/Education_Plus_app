import { auth } from "@/auth";
import connectDB from "@/lib/db";
import Subject from "@/models/Subject";
import Note from "@/models/Note";
import { NotesList } from "./notes-list";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function SubjectDetailPage({ params }: { params: { subjectId: string } }) {
  const session = await auth();
  if (!session) redirect("/login");

  await connectDB();
  
  // Await params in Next.js 15+ (App Router)
  // But strictly speaking, in Next 15 params is async. In 14 it is not.
  // Next 16: params is a Promise.
  // So I should await it.
  const { subjectId } = await params;

  const subject = await Subject.findOne({ _id: subjectId, userId: session.user.id }).lean();
  
  if (!subject) {
      return <div>Subject not found</div>;
  }

  const notes = await Note.find({ subjectId, userId: session.user.id })
    .sort({ updatedAt: -1 })
    .lean();

  const serializedNotes = notes.map(n => ({
      ...n,
      _id: n._id.toString(),
      subjectId: n.subjectId.toString(),
      userId: n.userId.toString(),
      createdAt: n.createdAt?.toISOString(),
      updatedAt: n.updatedAt?.toISOString()
  }));

  return (
    <div className="p-8">
      <div className="mb-8">
        <Link href="/dashboard/subjects">
            <Button variant="ghost" className="mb-4 pl-0 hover:pl-0 hover:bg-transparent text-muted-foreground">
                <ChevronLeft className="mr-2 h-4 w-4" /> Back to Subjects
            </Button>
        </Link>
        <h1 className="text-4xl font-bold mb-2" style={{ color: subject.color }}>{subject.name}</h1>
        <p className="text-muted-foreground">{subject.description}</p>
      </div>

      <NotesList notes={serializedNotes} subjectId={subjectId} />
    </div>
  );
}
