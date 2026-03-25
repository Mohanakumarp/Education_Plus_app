"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { useState, useEffect, useRef } from "react";
import { updateNote } from "@/actions/note";
import { summarizeText, generateQuiz, getRecommendations } from "@/actions/ai";
import { Toolbar } from "./toolbar";
import { Recorder } from "./recorder";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Check,
    Loader2,
    Sparkles,
    BrainCircuit,
    ChevronLeft,
    Save,
    Bookmark,
    BookmarkCheck,
    Tag,
    X,
    Library,
    ExternalLink,
    BookOpen,
    ArrowUpRight
} from "lucide-react";
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
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface EditorProps {
    note: {
        _id: string;
        title: string;
        content: string;
        subjectId: string;
        isBookmarked?: boolean;
        tags?: string[];
    };
}

export function Editor({ note }: EditorProps) {
    const [title, setTitle] = useState(note.title);
    const [isBookmarked, setIsBookmarked] = useState(note.isBookmarked || false);
    const [tags, setTags] = useState<string[]>(note.tags || []);
    const [tagInput, setTagInput] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const [lastSaved, setLastSaved] = useState<Date | null>(null);
    const [contentVersion, setContentVersion] = useState(0);

    // AI States
    const [isSummarizing, setIsSummarizing] = useState(false);
    const [summary, setSummary] = useState("");
    const [showSummary, setShowSummary] = useState(false);

    const [isGeneratingQuiz, setIsGeneratingQuiz] = useState(false);
    const [quiz, setQuiz] = useState<any[]>([]);
    const [showQuiz, setShowQuiz] = useState(false);

    const [isGettingRecommendations, setIsGettingRecommendations] = useState(false);
    const [recommendations, setRecommendations] = useState<any[]>([]);
    const [showRecommendations, setShowRecommendations] = useState(false);
    const [liveTranscription, setLiveTranscription] = useState("");
    const currentParagraphRef = useRef<boolean>(false);

    const pendingSave = useRef(false);

    const editor = useEditor({
        extensions: [
            StarterKit,
            Placeholder.configure({
                placeholder: "Start typing your notes here...",
            }),
        ],
        immediatelyRender: false,
        content: note.content,
        editorProps: {
            attributes: {
                class: "prose prose-sm sm:prose lg:prose-lg xl:prose-xl m-5 focus:outline-none min-h-[600px] max-w-none"
            }
        },
        onUpdate: () => {
            pendingSave.current = true;
            setContentVersion((prev) => prev + 1);
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

    const handleRecommendations = async () => {
        if (!editor) return;
        setIsGettingRecommendations(true);
        const text = editor.getText();
        const result = await getRecommendations(text);
        if (result.recommendations) {
            setRecommendations(result.recommendations);
            setShowRecommendations(true);
        } else if (result.error) {
            alert(result.error);
        }
        setIsGettingRecommendations(false);
    };

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTitle(e.target.value);
        pendingSave.current = true;
    };

    const toggleBookmark = () => {
        setIsBookmarked(!isBookmarked);
        pendingSave.current = true;
    };

    const addTag = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && tagInput.trim()) {
            if (!tags.includes(tagInput.trim())) {
                setTags([...tags, tagInput.trim()]);
                pendingSave.current = true;
            }
            setTagInput("");
        }
    };

    const removeTag = (tag: string) => {
        setTags(tags.filter(t => t !== tag));
        pendingSave.current = true;
    };

    const handleTranscription = (text: string, isComplete: boolean) => {
        if (!editor) return;

        // Append to live transcription
        setLiveTranscription(prev => prev + (prev ? " " : "") + text);

        if (isComplete) {
            // When transcription chunk is complete, insert into editor
            if (!currentParagraphRef.current) {
                // Start a new paragraph
                editor.commands.insertContent(`<p>${text}</p>`);
                currentParagraphRef.current = true;
            } else {
                // Append to existing paragraph - find the last paragraph and update it
                const { $anchor } = editor.state.selection;
                const lastNode = editor.state.doc.lastChild;
                
                if (lastNode?.type.name === 'paragraph') {
                    // Add to existing paragraph
                    editor.commands.insertContent(` ${text}`);
                } else {
                    // Create new paragraph if last node isn't a paragraph
                    editor.commands.insertContent(`<p>${text}</p>`);
                    currentParagraphRef.current = false;
                }
            }

            // Auto-save after each complete chunk
            pendingSave.current = true;
            setContentVersion((prev) => prev + 1);
        }
    };

    // Debounced Auto-save
    useEffect(() => {
        const handler = setTimeout(async () => {
            if (pendingSave.current) {
                setIsSaving(true);
                const content = editor?.getHTML() || "";
                await updateNote(note._id, {
                    title,
                    content,
                    isBookmarked,
                    tags
                });
                pendingSave.current = false;
                setIsSaving(false);
                setLastSaved(new Date());
            }
        }, 2000);

        return () => clearTimeout(handler);
    }, [title, isBookmarked, tags, contentVersion, editor, note._id]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-5xl mx-auto py-8 px-4"
        >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                <div className="flex items-center gap-4">
                    <Link href={`/dashboard/subjects/${note.subjectId}`}>
                        <Button variant="ghost" size="icon" className="rounded-full">
                            <ChevronLeft size={20} />
                        </Button>
                    </Link>
                    <div className="flex items-center gap-3">
                        <AnimatePresence mode="wait">
                            {isSaving ? (
                                <motion.div
                                    key="saving"
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                >
                                    <Badge variant="outline" className="bg-indigo-50 text-indigo-600 border-indigo-100 px-3 py-1 flex items-center gap-2">
                                        <Loader2 className="w-3 h-3 animate-spin" />
                                        <span className="text-[11px] font-bold uppercase tracking-wider">Saving</span>
                                    </Badge>
                                </motion.div>
                            ) : lastSaved ? (
                                <motion.div
                                    key="saved"
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                >
                                    <Badge variant="outline" className="bg-emerald-50 text-emerald-600 border-emerald-100 px-3 py-1 flex items-center gap-2">
                                        <Check className="w-3 h-3" />
                                        <span className="text-[11px] font-bold uppercase tracking-wider">Saved</span>
                                    </Badge>
                                </motion.div>
                            ) : (
                                <Badge variant="outline" className="text-slate-400 border-slate-200 px-3 py-1">
                                    <Save className="w-3 h-3 mr-2" />
                                    <span className="text-[11px] font-bold uppercase tracking-wider">Draft</span>
                                </Badge>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {/* Bookmark Button */}
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={toggleBookmark}
                        className={cn(
                            "rounded-xl transition-all",
                            isBookmarked ? "text-amber-500 bg-amber-50" : "text-slate-400 hover:bg-slate-50"
                        )}
                    >
                        {isBookmarked ? <BookmarkCheck size={20} fill="currentColor" /> : <Bookmark size={20} />}
                    </Button>

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleRecommendations}
                        disabled={isGettingRecommendations || !editor || editor.isEmpty}
                        className="relative overflow-hidden group border-emerald-200 text-emerald-700 hover:bg-emerald-50 rounded-xl"
                    >
                        <div className="flex items-center gap-2 relative z-10">
                            {isGettingRecommendations ? <Loader2 className="w-4 h-4 animate-spin" /> : <Library className="w-4 h-4 transition-transform group-hover:scale-110" />}
                            <span>Resource Suggest</span>
                        </div>
                    </Button>

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleQuiz}
                        disabled={isGeneratingQuiz || !editor || editor.isEmpty}
                        className="relative overflow-hidden group border-amber-200 text-amber-700 hover:bg-amber-50 rounded-xl"
                    >
                        <div className="flex items-center gap-2 relative z-10">
                            {isGeneratingQuiz ? <Loader2 className="w-4 h-4 animate-spin" /> : <BrainCircuit className="w-4 h-4 transition-transform group-hover:scale-110" />}
                            <span>Generate Quiz</span>
                        </div>
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleSummarize}
                        disabled={isSummarizing || !editor || editor.isEmpty}
                        className="relative overflow-hidden group border-indigo-200 text-indigo-700 hover:bg-indigo-50 rounded-xl"
                    >
                        <div className="flex items-center gap-2 relative z-10">
                            {isSummarizing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4 transition-transform group-hover:scale-110" />}
                            <span>Summarize AI</span>
                        </div>
                    </Button>
                </div>
            </div>

            <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/40 border border-slate-100 overflow-hidden ring-1 ring-slate-100">
                <div className="p-10 pb-6 space-y-4">
                    <Input
                        value={title}
                        onChange={handleTitleChange}
                        className="text-6xl font-black border-none shadow-none px-0 mb-2 focus-visible:ring-0 h-auto placeholder:text-slate-100 tracking-tighter"
                        placeholder="Unforgettable Title..."
                    />

                    <div className="flex items-center flex-wrap gap-2">
                        <div className="flex items-center gap-2 text-slate-400 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
                            <Tag size={12} />
                            <Input
                                placeholder="Add tag..."
                                value={tagInput}
                                onChange={(e) => setTagInput(e.target.value)}
                                onKeyDown={addTag}
                                className="border-none shadow-none focus-visible:ring-0 h-4 p-0 w-20 text-[10px] font-bold uppercase tracking-widest bg-transparent"
                            />
                        </div>
                        {tags.map((tag, idx) => (
                            <Badge key={idx} variant="secondary" className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 border-none font-bold text-[10px] uppercase tracking-widest flex items-center gap-1 group">
                                {tag}
                                <button
                                    onClick={() => removeTag(tag)}
                                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                                    aria-label={`Remove tag ${tag}`}
                                    title={`Remove tag ${tag}`}
                                >
                                    <X size={10} />
                                </button>
                            </Badge>
                        ))}
                    </div>
                </div>

                <div className="px-10 flex items-center border-b border-slate-50 overflow-x-auto no-scrollbar py-2 bg-slate-50/20">
                    <Toolbar editor={editor} />
                </div>

                <div className="p-4 md:p-10 min-h-[600px]">
                    <EditorContent editor={editor} />
                </div>
            </div>

            <div className="mt-8">
                <Recorder onTranscription={handleTranscription} />
            </div>

            {/* Content Dialogs */}
            <Dialog open={showSummary} onOpenChange={setShowSummary}>
                <DialogContent className="max-w-2xl rounded-[2.5rem] p-0 overflow-hidden border-none shadow-2xl">
                    <div className="bg-indigo-600 p-10 text-white relative">
                        <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -translate-y-16 translate-x-16 blur-3xl animate-pulse" />
                        <Sparkles className="w-16 h-16 mb-6 opacity-80" />
                        <DialogTitle className="text-4xl font-black tracking-tight">AI Insights</DialogTitle>
                        <DialogDescription className="text-indigo-100 mt-2 text-lg font-medium opacity-80">
                            Your lecture notes, condensed for brilliance.
                        </DialogDescription>
                    </div>
                    <div className="p-10 bg-white">
                        <div className="prose prose-indigo max-w-none text-slate-700 leading-relaxed font-serif text-xl italic bg-slate-50/50 p-8 rounded-3xl border border-slate-100">
                            "{summary}"
                        </div>
                        <div className="mt-8 flex justify-end">
                            <Button onClick={() => setShowSummary(false)} className="rounded-2xl h-12 px-10 bg-indigo-600 hover:bg-indigo-700 font-bold text-white shadow-lg shadow-indigo-100">Got it!</Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            <Dialog open={showQuiz} onOpenChange={setShowQuiz}>
                <DialogContent className="max-w-2xl rounded-[2.5rem] p-0 overflow-hidden border-none shadow-2xl">
                    <div className="bg-amber-500 p-10 text-white relative">
                        <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -translate-y-16 translate-x-16 blur-3xl animate-pulse" />
                        <BrainCircuit className="w-16 h-16 mb-6 opacity-80" />
                        <DialogTitle className="text-4xl font-black tracking-tight">Brain Hack</DialogTitle>
                        <DialogDescription className="text-amber-50 mt-2 text-lg font-medium opacity-80">
                            Let's see how much you actually remembered.
                        </DialogDescription>
                    </div>
                    <div className="p-10 bg-white max-h-[60vh] overflow-y-auto custom-scrollbar">
                        {quiz.length === 0 ? (
                            <div className="text-center py-20 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                                <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-xs">Not enough data to crunch</p>
                            </div>
                        ) : (
                            <Accordion type="single" collapsible className="w-full space-y-6">
                                {quiz.map((q, i) => (
                                    <AccordionItem value={`item-${i}`} key={i} className="border-none rounded-[2rem] px-8 bg-slate-50/70 hover:bg-slate-100/70 transition-colors">
                                        <AccordionTrigger className="text-left font-black text-slate-800 hover:no-underline py-6 text-lg tracking-tight">
                                            <span className="mr-6 text-amber-500 font-serif italic text-2xl opacity-50">#0{i + 1}</span>
                                            {q.question}
                                        </AccordionTrigger>
                                        <AccordionContent className="pb-8 pt-0">
                                            <div className="flex items-start gap-4 bg-emerald-50 text-emerald-700 p-6 rounded-2xl border border-emerald-100 shadow-sm">
                                                <div className="bg-emerald-500 text-white p-1 rounded-full">
                                                    <Check size={14} strokeWidth={4} />
                                                </div>
                                                <div>
                                                    <span className="text-[10px] uppercase font-black tracking-[0.2em] block mb-2 opacity-60">Master Answer</span>
                                                    <span className="font-black text-lg">{q.answer}</span>
                                                </div>
                                            </div>
                                        </AccordionContent>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        )}
                        <div className="mt-10 flex justify-end">
                            <Button onClick={() => setShowQuiz(false)} variant="outline" className="rounded-2xl h-12 px-10 border-slate-200 text-slate-600 font-bold hover:bg-slate-50">Later</Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            <Dialog open={showRecommendations} onOpenChange={setShowRecommendations}>
                <DialogContent className="max-w-2xl rounded-[2.5rem] p-0 overflow-hidden border-none shadow-2xl">
                    <div className="bg-emerald-600 p-10 text-white relative">
                        <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -translate-y-16 translate-x-16 blur-3xl animate-pulse" />
                        <Library className="w-16 h-16 mb-6 opacity-80" />
                        <DialogTitle className="text-4xl font-black tracking-tight">Resource Deep Dive</DialogTitle>
                        <DialogDescription className="text-emerald-50 mt-2 text-lg font-medium opacity-80">
                            Hand-picked suggestions to sharpen your understanding.
                        </DialogDescription>
                    </div>
                    <div className="p-10 bg-white space-y-4">
                        {recommendations.length === 0 ? (
                            <div className="text-center py-10">
                                <p className="text-slate-400 font-bold italic">"No extra resources found yet. Try writing more!"</p>
                            </div>
                        ) : (
                            recommendations.map((rec: any, i: number) => (
                                <div key={i} className="flex items-center justify-between p-5 rounded-3xl bg-slate-50 hover:bg-slate-100 transition-colors border border-slate-100 group">
                                    <div className="flex items-center gap-4">
                                        <div className={cn(
                                            "p-3 rounded-2xl",
                                            rec.type === 'youtube' ? "bg-rose-50 text-rose-600" :
                                                rec.type === 'book' ? "bg-amber-50 text-amber-600" :
                                                    "bg-blue-50 text-blue-600"
                                        )}>
                                            {rec.type === 'youtube' ? <ArrowUpRight size={20} /> : <BookOpen size={20} />}
                                        </div>
                                        <div>
                                            <h5 className="font-bold text-slate-800 leading-tight">{rec.title}</h5>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">{rec.type}</p>
                                        </div>
                                    </div>
                                    <a
                                        href={rec.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label={`Open ${rec.title}`}
                                        title={`Open ${rec.title}`}
                                        className="p-3 rounded-full bg-white text-slate-400 hover:text-indigo-600 shadow-sm opacity-0 group-hover:opacity-100 transition-all active:scale-90"
                                    >
                                        <ExternalLink size={18} />
                                    </a>
                                </div>
                            ))
                        )}
                        <div className="mt-8 flex justify-end pt-4">
                            <Button onClick={() => setShowRecommendations(false)} className="rounded-2xl h-12 px-10 bg-emerald-600 hover:bg-emerald-700 font-bold text-white shadow-lg shadow-emerald-100">Close Resources</Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </motion.div>
    );
}
