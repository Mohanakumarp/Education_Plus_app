import { auth } from "@/auth";
import connectDB from "@/lib/db";
import Note from "@/models/Note";
import { Editor } from "@/components/editor/editor";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

export default async function NotePage({ params }: { params: { noteId: string } }) {
  const session = await auth();
  if (!session) redirect("/login");

  const { noteId } = await params;

  await connectDB();
  const note = await Note.findOne({ _id: noteId, userId: session.user.id }).lean();

  if (!note) {
    return <div>Note not found</div>;
  }

  // Serialize
  const serializedNote = {
    ...note,
    _id: note._id.toString(),
    subjectId: note.subjectId.toString(),
    userId: note.userId.toString(),
    createdAt: note.createdAt?.toISOString(),
    updatedAt: note.updatedAt?.toISOString(),
  };

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      <Link href={`/dashboard/subjects/${serializedNote.subjectId}`}>
        <Button variant="ghost" className="mb-4 pl-0 hover:pl-0 hover:bg-transparent text-muted-foreground">
            <ChevronLeft className="mr-2 h-4 w-4" /> Back to Notes
        </Button>
      </Link>
      
      <Editor note={serializedNote} />
    </div>
  );
}
