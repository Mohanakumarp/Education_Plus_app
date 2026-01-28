"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { useState, useEffect, useRef } from "react";
import { updateNote } from "@/actions/note";
import { summarizeText, generateQuiz } from "@/actions/ai";
import { Toolbar } from "./toolbar";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, Loader2, Sparkles, BrainCircuit } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

interface EditorProps {
  note: {
    _id: string;
    title: string;
    content: string;
  };
}

export function Editor({ note }: EditorProps) {
  const [title, setTitle] = useState(note.title);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  
  // AI States
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [summary, setSummary] = useState("");
  const [showSummary, setShowSummary] = useState(false);

  const [isGeneratingQuiz, setIsGeneratingQuiz] = useState(false);
  const [quiz, setQuiz] = useState<any[]>([]);
  const [showQuiz, setShowQuiz] = useState(false);
  
  const pendingSave = useRef(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: "Start typing your notes here...",
      }),
    ],
    content: note.content,
    editorProps: {
        attributes: {
            class: "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl m-5 focus:outline-none min-h-[500px]"
        }
    },
    onUpdate: () => {
        pendingSave.current = true;
    }
  });

  const handleSummarize = async () => {
      if (!editor) return;
      setIsSummarizing(true);
      const text = editor.getText();
      const result = await summarizeText(text);
      if (result.summary) {
          setSummary(result.summary);
          setShowSummary(true);
      } else if (result.error) {
          alert(result.error);
      }
      setIsSummarizing(false);
  };

  const handleQuiz = async () => {
      if (!editor) return;
      setIsGeneratingQuiz(true);
      const text = editor.getText();
      const result = await generateQuiz(text);
      if (result.quiz) {
          setQuiz(result.quiz);
          setShowQuiz(true);
      } else if (result.error) {
          alert(result.error);
      }
      setIsGeneratingQuiz(false);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setTitle(e.target.value);
      pendingSave.current = true;
  };

  // Debounced Auto-save
  useEffect(() => {
    const handler = setTimeout(async () => {
        if (pendingSave.current) {
            setIsSaving(true);
            const content = editor?.getHTML() || "";
            await updateNote(note._id, { title, content });
            pendingSave.current = false;
            setIsSaving(false);
            setLastSaved(new Date());
        }
    }, 1500); 

    return () => clearTimeout(handler);
  }, [title, editor?.state.doc.content.size, editor]); 

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
            {isSaving ? (
                <Badge variant="outline" className="text-muted-foreground">
                    <Loader2 className="w-3 h-3 mr-1 animate-spin" /> Saving...
                </Badge>
            ) : lastSaved ? (
                <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">
                    <Check className="w-3 h-3 mr-1" /> Saved {lastSaved.toLocaleTimeString()}
                </Badge>
            ) : null}
        </div>
        <div className="flex gap-2">
            <Button 
                variant="outline" 
                size="sm" 
                onClick={handleQuiz} 
                disabled={isGeneratingQuiz || !editor || editor.isEmpty}
                className="text-amber-600 border-amber-200 hover:bg-amber-50"
            >
                {isGeneratingQuiz ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <BrainCircuit className="w-4 h-4 mr-2" />}
                Generate Quiz
            </Button>
            <Button 
                variant="outline" 
                size="sm" 
                onClick={handleSummarize} 
                disabled={isSummarizing || !editor || editor.isEmpty}
                className="text-indigo-600 border-indigo-200 hover:bg-indigo-50"
            >
                {isSummarizing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Sparkles className="w-4 h-4 mr-2" />}
                Summarize
            </Button>
        </div>
      </div>

      <Input 
        value={title} 
        onChange={handleTitleChange}
        className="text-4xl font-bold border-none shadow-none px-0 mb-4 focus-visible:ring-0 h-auto"
        placeholder="Note Title"
      />

      <Toolbar editor={editor} />
      
      <div className="border rounded-md min-h-[500px] bg-white p-4">
        <EditorContent editor={editor} />
      </div>

      {/* Summary Dialog */}
      <Dialog open={showSummary} onOpenChange={setShowSummary}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Note Summary</DialogTitle>
                <DialogDescription>AI-generated summary of your note.</DialogDescription>
            </DialogHeader>
            <div className="p-4 bg-slate-50 rounded-md text-sm leading-relaxed max-h-[60vh] overflow-y-auto">
                {summary}
            </div>
        </DialogContent>
      </Dialog>

      {/* Quiz Dialog */}
      <Dialog open={showQuiz} onOpenChange={setShowQuiz}>
        <DialogContent className="max-w-xl">
            <DialogHeader>
                <DialogTitle>Test Your Knowledge</DialogTitle>
                <DialogDescription>Auto-generated questions from your notes.</DialogDescription>
            </DialogHeader>
            <div className="max-h-[60vh] overflow-y-auto pr-2">
                {quiz.length === 0 ? (
                    <p className="text-center text-muted-foreground">Not enough content to generate a quiz.</p>
                ) : (
                    <Accordion type="single" collapsible className="w-full">
                        {quiz.map((q, i) => (
                            <AccordionItem value={`item-${i}`} key={i}>
                                <AccordionTrigger className="text-left">{i+1}. {q.question}</AccordionTrigger>
                                <AccordionContent className="text-green-600 font-medium">
                                    Answer: {q.answer}
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                )}
            </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
