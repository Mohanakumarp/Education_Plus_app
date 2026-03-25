"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Clock, CheckCircle2, MoreVertical, Search, Filter } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

import { getTasks, createTask, toggleTaskStatus, deleteTask } from "@/actions/task";

type TaskStatus = "todo" | "doing" | "done";

interface Task {
    id: string;
    title: string;
    status: TaskStatus;
    priority: "low" | "medium" | "high";
    subject: string;
}

export default function TasksPage() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [newTask, setNewTask] = useState("");

    useEffect(() => {
        const fetchTasks = async () => {
            setLoading(true);
            const res = await getTasks();
            if (res.tasks) {
                setTasks(res.tasks as any);
            }
            setLoading(false);
        };
        fetchTasks();
    }, []);

    const addTask = async () => {
        if (!newTask.trim()) return;

        const formData = new FormData();
        formData.append("title", newTask.trim());

        const res = await createTask(formData);
        if (res.success) {
            // Re-fetch to get the new task with ID
            const updated = await getTasks();
            if (updated.tasks) setTasks(updated.tasks as any);
            setNewTask("");
        } else if (res.error) {
            alert(res.error);
        }
    };

    const handleAddTaskSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        addTask();
    };

    const handleToggleStatus = async (id: string, currentStatus: string) => {
        const res = await toggleTaskStatus(id, currentStatus);
        if (res.success) {
            setTasks((prev) => prev.map(t => {
                if (t.id === id) {
                    const nextStatus: Record<string, TaskStatus> = {
                        todo: "doing",
                        doing: "done",
                        done: "todo",
                    };
                    return { ...t, status: nextStatus[t.status] };
                }
                return t;
            }));
        }
    };

    const handleDeleteTask = async (id: string) => {
        const res = await deleteTask(id);
        if (res.success) {
            setTasks((prev) => prev.filter(t => t.id !== id));
        }
    };

    const sections: { id: TaskStatus, label: string, color: string, bg: string }[] = [
        { id: "todo", label: "To Do", color: "text-rose-600", bg: "bg-rose-50" },
        { id: "doing", label: "In Progress", color: "text-amber-600", bg: "bg-amber-50" },
        { id: "done", label: "Completed", color: "text-emerald-600", bg: "bg-emerald-50" },
    ];

    return (
        <div className="space-y-8 pb-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-black tracking-tight text-slate-900">
                        Academic Tasks 📋
                    </h1>
                    <p className="text-slate-500 mt-2 font-medium">
                        Stay on top of your assignments and milestones.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <Input placeholder="Search tasks..." className="pl-10 w-[200px] lg:w-[300px] h-10 rounded-xl" />
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 p-8">
                <form onSubmit={handleAddTaskSubmit} className="flex flex-col md:flex-row gap-4 mb-8">
                    <Input
                        placeholder="What needs to be done? e.g. Finalize lab report"
                        value={newTask}
                        onChange={(e) => setNewTask(e.target.value)}
                        className="flex-1 h-14 rounded-2xl bg-slate-50 border-slate-100 px-6 text-lg font-medium focus-visible:ring-indigo-600 focus-visible:ring-offset-0"
                    />
                    <Button type="submit" size="lg" className="h-14 rounded-2xl px-8 shadow-lg shadow-indigo-100 bg-indigo-600 hover:bg-indigo-700 font-bold transition-all active:scale-95 !text-white">
                        <Plus className="mr-2" size={24} /> ADD TASK
                    </Button>
                </form>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {sections.map((section) => (
                        <div key={section.id} className="space-y-6">
                            <div className={cn("flex items-center gap-3 px-4 py-2 rounded-2xl w-fit font-bold uppercase tracking-widest text-xs", section.bg, section.color)}>
                                <div className={cn("w-2 h-2 rounded-full", section.color.replace('text-', 'bg-'))} />
                                {section.label}
                                <span className="opacity-50 ml-2">{tasks.filter(t => t.status === section.id).length}</span>
                            </div>

                            <div className="space-y-4">
                                <AnimatePresence mode="popLayout">
                                    {tasks.filter(t => t.status === section.id).map((task) => (
                                        <motion.div
                                            key={task.id}
                                            layout
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.9 }}
                                            className="group"
                                        >
                                            <Card className="border-none shadow-sm hover:shadow-md transition-all cursor-pointer rounded-2xl overflow-hidden ring-1 ring-slate-100" onClick={() => handleToggleStatus(task.id, task.status)}>
                                                <CardContent className="p-5">
                                                    <div className="flex items-start justify-between gap-4">
                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-2 mb-2">
                                                                <Badge variant="outline" className={cn(
                                                                    "text-[10px] uppercase font-black tracking-widest px-2 py-0.5",
                                                                    task.priority === "high" ? "bg-rose-50 text-rose-600 border-rose-100" :
                                                                        task.priority === "medium" ? "bg-amber-50 text-amber-600 border-amber-100" :
                                                                            "bg-slate-50 text-slate-500 border-slate-200"
                                                                )}>
                                                                    {task.priority}
                                                                </Badge>
                                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">• {task.subject}</span>
                                                            </div>
                                                            <h4 className={cn(
                                                                "font-bold text-base leading-snug transition-all",
                                                                task.status === "done" ? "text-slate-400 line-through" : "text-slate-900"
                                                            )}>
                                                                {task.title}
                                                            </h4>
                                                        </div>
                                                        <div className="flex items-center">
                                                            <button
                                                                className="p-1.5 rounded-full hover:bg-slate-50 opacity-0 group-hover:opacity-100 transition-opacity"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleDeleteTask(task.id);
                                                                }}
                                                            >
                                                                <MoreVertical size={16} className="text-slate-400" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                                {task.status === "doing" && (
                                                    <div className="h-1 bg-amber-400 w-1/2" />
                                                )}
                                            </Card>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>

                                {tasks.filter(t => t.status === section.id).length === 0 && (
                                    <div className="py-12 border-2 border-dashed border-slate-100 rounded-[2rem] flex flex-col items-center justify-center gap-2">
                                        <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-300">
                                            {section.id === "todo" ? <Clock size={24} /> : section.id === "doing" ? <Filter size={24} /> : <CheckCircle2 size={24} />}
                                        </div>
                                        <p className="text-xs font-bold text-slate-300 uppercase tracking-widest">No tasks yet</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
