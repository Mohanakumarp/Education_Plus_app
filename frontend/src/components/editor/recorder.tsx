"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Mic, Square, Loader2, FileType, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface RecorderProps {
    onTranscription: (text: string) => void;
}

export function Recorder({ onTranscription }: RecorderProps) {
    const [isRecording, setIsRecording] = useState(false);
    const [isTranscribing, setIsTranscribing] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);
    const mediaRecorder = useRef<MediaRecorder | null>(null);
    const chunks = useRef<Blob[]>([]);
    const timerInterval = useRef<NodeJS.Timeout | null>(null);

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorder.current = new MediaRecorder(stream);
            chunks.current = [];

            mediaRecorder.current.ondataavailable = (e) => {
                if (e.data.size > 0) chunks.current.push(e.data);
            };

            mediaRecorder.current.onstop = async () => {
                const audioBlob = new Blob(chunks.current, { type: "audio/wav" });
                await transcribeAudio(audioBlob);
            };

            mediaRecorder.current.start();
            setIsRecording(true);
            setRecordingTime(0);
            timerInterval.current = setInterval(() => {
                setRecordingTime(prev => prev + 1);
            }, 1000);
        } catch (err) {
            console.error("Recording error:", err);
            alert("Could not access microphone.");
        }
    };

    const stopRecording = () => {
        if (mediaRecorder.current && isRecording) {
            mediaRecorder.current.stop();
            mediaRecorder.current.stream.getTracks().forEach(track => track.stop());
            setIsRecording(false);
            if (timerInterval.current) clearInterval(timerInterval.current);
        }
    };

    const transcribeAudio = async (blob: Blob) => {
        setIsTranscribing(true);
        const formData = new FormData();
        formData.append("file", blob, "lecture_audio.wav");

        try {
            const res = await fetch("http://localhost:8000/transcribe", {
                method: "POST",
                body: formData,
            });

            if (res.ok) {
                const data = await res.json();
                onTranscription(data.text);
            } else {
                throw new Error("Transcription failed");
            }
        } catch (err) {
            console.error(err);
            alert("Failed to transcribe session.");
        }
        setIsTranscribing(false);
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, "0")}`;
    };

    return (
        <Card className="p-4 bg-white/50 backdrop-blur-md rounded-2xl border-none shadow-lg mt-6 ring-1 ring-slate-100 group">
            <div className="flex items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                    <div className={cn(
                        "p-3 rounded-xl transition-all",
                        isRecording ? "bg-rose-100 text-rose-600 animate-pulse" : "bg-slate-50 text-slate-400 group-hover:bg-slate-100"
                    )}>
                        <Mic size={20} />
                    </div>
                    <div>
                        <p className="text-xs font-black uppercase tracking-widest text-slate-400">Lecture Transcribe</p>
                        <p className="text-sm font-bold text-slate-700">
                            {isRecording ? "Capturing class audio..." : isTranscribing ? "Transcribing session..." : "Click record to start."}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <AnimatePresence>
                        {(isRecording || isTranscribing) && (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="px-4 py-2 bg-slate-900 rounded-xl flex items-center gap-3 shadow-lg"
                            >
                                {isRecording ? (
                                    <>
                                        <div className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                                        <span className="text-xs font-black text-white tabular-nums">{formatTime(recordingTime)}</span>
                                    </>
                                ) : (
                                    <>
                                        <Loader2 className="w-3 h-3 text-indigo-400 animate-spin" />
                                        <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Processing...</span>
                                    </>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {isRecording ? (
                        <Button className="rounded-xl h-12 px-6 bg-rose-600 hover:bg-rose-700 shadow-lg shadow-rose-100 font-bold" onClick={stopRecording}>
                            <Square size={18} className="mr-2" /> Stop Recording
                        </Button>
                    ) : (
                        <Button
                            className="rounded-xl h-12 px-6 text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-100 font-bold"
                            onClick={startRecording}
                            disabled={isTranscribing}
                        >
                            <Mic size={18} className="mr-2" /> Start Recording
                        </Button>
                    )}
                </div>
            </div>
        </Card>
    );
}
