"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { createNote, deleteNote } from "@/actions/note";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, FileText, Trash, Calendar } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface Note {
  _id: string;
  title: string;
  content: string;
  updatedAt: string;
}

export function NotesList({ notes, subjectId }: { notes: Note[]; subjectId: string }) {
  const router = useRouter();

  const handleCreate = async () => {
    const res = await createNote(subjectId);
    if (res.success && res.noteId) {
      router.push(`/dashboard/notes/${res.noteId}`);
    }
  };

  const handleDelete = async (e: React.MouseEvent, noteId: string) => {
    e.preventDefault(); // Prevent link navigation
    e.stopPropagation();
    if (confirm("Delete this note?")) {
      await deleteNote(noteId, subjectId);
      router.refresh();
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
      <Card 
        className="flex flex-col items-center justify-center min-h-[200px] cursor-pointer hover:bg-slate-50 border-dashed border-2"
        onClick={handleCreate}
      >
        <div className="bg-primary/10 p-4 rounded-full mb-4">
            <Plus className="w-8 h-8 text-primary" />
        </div>
        <p className="font-medium text-muted-foreground">Create New Note</p>
      </Card>

      {notes.map((note) => (
        <Link href={`/dashboard/notes/${note._id}`} key={note._id}>
          <Card className="h-[200px] hover:shadow-lg transition-shadow relative group flex flex-col justify-between">
            <CardHeader>
              <CardTitle className="line-clamp-2 leading-tight text-lg">
                {note.title || "Untitled Note"}
              </CardTitle>
              <CardDescription className="flex items-center mt-2 text-xs">
                <Calendar className="w-3 h-3 mr-1" />
                {formatDistanceToNow(new Date(note.updatedAt), { addSuffix: true })}
              </CardDescription>
            </CardHeader>
            <CardFooter className="flex justify-between items-center text-muted-foreground text-sm">
                <div className="flex items-center">
                    <FileText className="w-4 h-4 mr-1" /> Note
                </div>
                <Button 
                    variant="ghost" 
                    size="icon" 
                    className="opacity-0 group-hover:opacity-100 hover:bg-red-50 hover:text-red-600 transition-opacity"
                    onClick={(e) => handleDelete(e, note._id)}
                >
                    <Trash className="w-4 h-4" />
                </Button>
            </CardFooter>
          </Card>
        </Link>
      ))}
    </div>
  );
}
