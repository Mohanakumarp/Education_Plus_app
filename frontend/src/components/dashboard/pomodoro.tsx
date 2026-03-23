"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Play, Pause, RotateCcw, Coffee, BookOpen, Volume2, VolumeX } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

type Mode = "study" | "short-break" | "long-break";

export function PomodoroTimer() {
    const [mode, setMode] = useState<Mode>("study");
    const [isActive, setIsActive] = useState(false);
    const [timeLeft, setTimeLeft] = useState(25 * 60);
    const [mute, setMute] = useState(false);
    const [sessions, setSessions] = useState(0);

    const timerRef = useRef<NodeJS.Timeout | null>(null);

    const config = {
        study: { label: "Focus", time: 25 * 60, color: "text-indigo-600", bg: "bg-indigo-50", accent: "bg-indigo-600" },
        "short-break": { label: "Quick Rest", time: 5 * 60, color: "text-indigo-600", bg: "bg-indigo-50", accent: "bg-indigo-600" },
        "long-break": { label: "Long Rest", time: 15 * 60, color: "text-indigo-600", bg: "bg-indigo-50", accent: "bg-indigo-600" },
    };

    useEffect(() => {
        if (isActive && timeLeft > 0) {
            timerRef.current = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            setIsActive(false);
            if (!mute) playBeep();

            if (mode === "study") {
                setSessions((prev) => prev + 1);
                if (sessions > 0 && sessions % 3 === 0) {
                    switchMode("long-break");
                } else {
                    switchMode("short-break");
                }
            } else {
                switchMode("study");
            }
        } else {
            if (timerRef.current) clearInterval(timerRef.current);
        }

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [isActive, timeLeft]);

    const playBeep = () => {
        // Simple audio placeholder logic
        console.log("Timer Finished! Beep!");
    };

    const toggleTimer = () => setIsActive(!isActive);

    const resetTimer = () => {
        setIsActive(false);
        setTimeLeft(config[mode].time);
    };

    const switchMode = (newMode: Mode) => {
        setIsActive(false);
        setMode(newMode);
        setTimeLeft(config[newMode].time);
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    };

    const progress = (timeLeft / config[mode].time) * 100;

    return (
        <Card className="border-none shadow-md overflow-hidden rounded-2xl group">
            <CardHeader className={cn("transition-colors duration-500 pb-2", config[mode].bg)}>
                <div className="flex justify-between items-center">
                    <CardTitle className={cn("text-sm font-bold uppercase tracking-widest", config[mode].color)}>
                        {config[mode].label}
                    </CardTitle>
                    <button
                        onClick={() => setMute(!mute)}
                        className="p-2 rounded-full hover:bg-black/5 transition-colors text-slate-400"
                    >
                        {mute ? <VolumeX size={16} /> : <Volume2 size={16} />}
                    </button>
                </div>
            </CardHeader>
            <CardContent className={cn("pt-8 flex flex-col items-center transition-colors duration-500", config[mode].bg)}>
                {/* Circular Progress (Simplified for now) */}
                <div className="relative w-48 h-48 flex items-center justify-center mb-8">
                    <svg className="absolute w-full h-full -rotate-90">
                        <circle
                            cx="50%"
                            cy="50%"
                            r="90"
                            className="stroke-slate-200 fill-none"
                            strokeWidth="8"
                        />
                        <motion.circle
                            cx="50%"
                            cy="50%"
                            r="90"
                            className={cn("fill-none", config[mode].accent.replace('bg-', 'stroke-'))}
                            strokeWidth="8"
                            strokeLinecap="round"
                            initial={{ pathLength: 1 }}
                            animate={{ pathLength: timeLeft / config[mode].time }}
                            transition={{ duration: 1, ease: "linear" }}
                        />
                    </svg>
                    <div className="text-5xl font-black text-slate-800 tracking-tighter tabular-nums leading-none">
                        {formatTime(timeLeft)}
                    </div>
                </div>

                <div className="flex gap-4 w-full justify-center mb-8">
                    <Button
                        size="icon"
                        variant="ghost"
                        className="rounded-full w-12 h-12"
                        onClick={resetTimer}
                    >
                        <RotateCcw size={20} className="text-slate-400" />
                    </Button>
                    <Button
                        size="lg"
                        className={cn("rounded-lg h-14 px-10 shadow-sm transition-all active:scale-95 text-white font-bold", config[mode].accent)}
                        onClick={toggleTimer}
                    >
                        {isActive ? (
                            <div className="flex items-center gap-2">
                                <Pause size={24} fill="currentColor" /> PAUSE
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <Play size={24} fill="currentColor" /> FOCUS NOW
                            </div>
                        )}
                    </Button>
                    <div className="w-12 h-12" /> {/* Spacer for balance */}
                </div>

                <div className="flex bg-white/50 backdrop-blur rounded-2xl p-1 w-full max-w-[240px] mb-4">
                    <button
                        onClick={() => switchMode("study")}
                        className={cn(
                            "flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all",
                            mode === "study" ? "bg-white shadow-sm text-indigo-600" : "text-slate-400 hover:text-slate-600"
                        )}
                    >
                        Focus
                    </button>
                    <button
                        onClick={() => switchMode("short-break")}
                        className={cn(
                            "flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all",
                            mode === "short-break" ? "bg-white shadow-sm text-indigo-600" : "text-slate-400 hover:text-slate-600"
                        )}
                    >
                        Rest
                    </button>
                    <button
                        onClick={() => switchMode("long-break")}
                        className={cn(
                            "flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all",
                            mode === "long-break" ? "bg-white shadow-sm text-indigo-600" : "text-slate-400 hover:text-slate-600"
                        )}
                    >
                        Long
                    </button>
                </div>

                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    SESSION {sessions + 1}
                </p>
            </CardContent>
        </Card>
    );
}
