"use client";

import { useState, memo } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { createTask, toggleTaskStatus } from "@/actions/task";
import { Loader2 } from "lucide-react";

interface QuickTasksProps {
    initialTasks: any[];
}

function QuickTasksComponent({ initialTasks }: QuickTasksProps) {
    const [tasks, setTasks] = useState(initialTasks);
    const [loading, setLoading] = useState<string | null>(null);
    const [newTitle, setNewTitle] = useState("");
    const [isAdding, setIsAdding] = useState(false);

    const handleToggle = async (taskId: string, currentStatus: string) => {
        setLoading(taskId);
        const res = await toggleTaskStatus(taskId, currentStatus);
        if (res.success) {
            // Optimistic update
            const nextStatus: Record<string, string> = {
                todo: "doing",
                doing: "done",
                done: "todo",
            };
            setTasks(tasks.map(t => t._id === taskId ? { ...t, status: nextStatus[currentStatus] } : t));
        }
        setLoading(null);
    };

    const handleAdd = async (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && newTitle.trim()) {
            setIsAdding(true);
            const formData = new FormData();
            formData.append("title", newTitle);
            const res = await createTask(formData);
            if (res.success) {
                setNewTitle("");
                // We rely on revalidatePath for the full list, but we could optimistic add if we want
                // For simplicity on dashboard, revalidate is enough as it's a server action
            }
            setIsAdding(false);
        }
    };

    return (
        <div className="space-y-2">
            {tasks.map((task) => (
                <div
                    key={task._id}
                    onClick={() => handleToggle(task._id, task.status)}
                    className="flex items-center gap-3 p-2 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer group"
                >
                    <div className={cn(
                        "w-5 h-5 rounded border-1.5 transition-colors flex items-center justify-center",
                        task.status === "done" ? "bg-indigo-600 border-indigo-600" : "border-slate-200 group-hover:border-indigo-400"
                    )}>
                        {loading === task._id ? (
                            <Loader2 size={10} className="text-white animate-spin" />
                        ) : task.status === "done" && (
                            <CheckIcon size={12} className="text-white" strokeWidth={4} />
                        )}
                    </div>
                    <span className={cn(
                        "text-sm font-medium transition-all",
                        task.status === "done" ? "text-slate-400 line-through" : "text-slate-700"
                    )}>
                        {task.title}
                    </span>
                </div>
            ))}
            <div className="relative">
                <Input
                    placeholder="Add a quick task..."
                    className="mt-3 border-dashed rounded-lg"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    onKeyDown={handleAdd}
                    disabled={isAdding}
                />
                {isAdding && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <Loader2 size={14} className="text-indigo-400 animate-spin" />
                    </div>
                )}
            </div>
        </div>
    );
}

function CheckIcon({ size, className, strokeWidth }: { size?: number, className?: string, strokeWidth?: number }) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth || 2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <polyline points="20 6 9 17 4 12" />
        </svg>
    );
}

// Memoize to prevent unnecessary re-renders
export const QuickTasks = memo(QuickTasksComponent);

