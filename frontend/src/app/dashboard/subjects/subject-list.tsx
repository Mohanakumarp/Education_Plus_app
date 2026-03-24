"use client";

import { useState } from "react";
import Link from "next/link";
import { createSubject, deleteSubject } from "@/actions/subject";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Plus, MoreVertical, Trash, BookOpen } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Subject {
  _id: string;
  name: string;
  description?: string;
  color: string;
}

export function SubjectList({ subjects }: { subjects: Subject[] }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCreate(formData: FormData) {
    setLoading(true);
    setError(null);
    const result = await createSubject(formData);
    setLoading(false);
    if (result?.error) {
      setError(result.error);
    } else {
      setOpen(false);
    }
  }

  async function handleDelete(id: string) {
    if (confirm("Are you sure? This will delete all notes in this subject.")) {
      await deleteSubject(id);
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Subjects</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" /> Add Subject
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Subject</DialogTitle>
              <DialogDescription>
                Create a container for your notes and study materials.
              </DialogDescription>
            </DialogHeader>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                await handleCreate(formData);
              }}
            >
              <div className="space-y-4 py-4">
                {error && (
                  <div className="p-3 bg-red-50 text-red-600 rounded text-sm">
                    {error}
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="name">Subject Name</Label>
                  <Input id="name" name="name" required placeholder="e.g. Mathematics" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description (Optional)</Label>
                  <Input id="description" name="description" placeholder="e.g. Calculus & Algebra" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="color">Color Code</Label>
                  <div className="flex gap-3 items-center">
                    <div className="flex-shrink-0">
                      <Input id="color" name="color" type="color" defaultValue="#4f46e5" className="w-14 h-10 p-0.5 cursor-pointer border border-input rounded opacity-100" style={{ accentColor: "#4f46e5" }} />
                    </div>
                    <span className="text-sm text-foreground">Pick a color for this subject</span>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={loading}>
                  {loading ? "Creating..." : "Create Subject"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {subjects.map((subject) => (
          <Card key={subject._id} className="relative hover:shadow-md transition-shadow">
             <div 
                className="absolute top-0 left-0 w-full h-2 rounded-t-lg" 
                style={{ backgroundColor: subject.color }} 
             />
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="truncate pr-4">
                    <Link href={`/dashboard/subjects/${subject._id}`} className="hover:underline">
                        {subject.name}
                    </Link>
                </CardTitle>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleDelete(subject._id)} className="text-red-600">
                      <Trash className="mr-2 h-4 w-4" /> Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <CardDescription className="truncate">{subject.description || "No description"}</CardDescription>
            </CardHeader>
            <CardFooter>
                 <Link href={`/dashboard/subjects/${subject._id}`} className="w-full">
                    <Button variant="outline" className="w-full">
                        <BookOpen className="mr-2 h-4 w-4" /> Open Subject
                    </Button>
                 </Link>
            </CardFooter>
          </Card>
        ))}
        
        {subjects.length === 0 && (
            <div className="col-span-full text-center py-12 text-muted-foreground">
                <p>No subjects yet. Create one to get started!</p>
            </div>
        )}
      </div>
    </div>
  );
}
