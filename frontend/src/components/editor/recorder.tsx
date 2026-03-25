"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Mic, Square } from "lucide-react";
import { Card } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface RecorderProps {
    onTranscription: (text: string, isComplete: boolean) => void;
}

export function Recorder({ onTranscription }: RecorderProps) {
    const [isRecording, setIsRecording] = useState(false);
    const [isTranscribing, setIsTranscribing] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);
    const mediaRecorder = useRef<MediaRecorder | null>(null);
    const ws = useRef<WebSocket | null>(null);
    const timerInterval = useRef<NodeJS.Timeout | null>(null);
    const streamRef = useRef<MediaStream | null>(null);

    // Initialize WebSocket connection
    useEffect(() => {
        connectWebSocket();
        return () => {
            if (ws.current && ws.current.readyState === WebSocket.OPEN) {
                ws.current.close();
            }
        };
    }, []);

    const connectWebSocket = () => {
        try {
            const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
            const wsUrl = `${protocol}//${window.location.hostname}:8000/ws/transcribe`;
            
            console.log("🔌 Attempting to connect WebSocket to:", wsUrl);
            ws.current = new WebSocket(wsUrl);
            
            ws.current.onopen = () => {
                console.log("✅ WebSocket connected successfully");
            };

            ws.current.onmessage = (event) => {
                console.log("📨 WebSocket onmessage triggered with raw data:", event.data);
                
                // Clear any pending transcription timeout
                if ((ws.current as any).transcriptionTimeout) {
                    clearTimeout((ws.current as any).transcriptionTimeout);
                    (ws.current as any).transcriptionTimeout = null;
                }
                
                try {
                    const data = JSON.parse(event.data);
                    console.log("✅ Parsed JSON from WebSocket:", data);
                    
                    if (data.text) {
                        console.log("📝 Found text in message:", data.text);
                        console.log("🔄 About to call onTranscription callback");
                        onTranscription(data.text, data.complete || false);
                        console.log("✅ onTranscription callback called successfully");
                        
                        // If transcription is complete, reset isTranscribing state
                        if (data.complete) {
                            setIsTranscribing(false);
                            console.log("✅ Transcription complete, state reset");
                        }
                    } else {
                        console.warn("⚠️ No text field in WebSocket message:", data);
                    }
                } catch (err) {
                    console.error("❌ Error parsing WebSocket message:", err);
                    console.error("Raw event data:", event.data);
                }
            };

            ws.current.onerror = (error) => {
                console.error("❌ WebSocket error:", error);
                setIsTranscribing(false);
            };

            ws.current.onclose = () => {
                console.log("🔌 WebSocket disconnected");
            };
        } catch (err) {
            console.error("❌ Failed to create WebSocket:", err);
        }
    };

    const startRecording = async () => {
        try {
            // Reconnect if WebSocket is closed
            if (!ws.current || ws.current.readyState === WebSocket.CLOSED) {
                console.log("🔄 Reconnecting WebSocket...");
                connectWebSocket();
                await new Promise(resolve => setTimeout(resolve, 500));
            }

            if (typeof window === "undefined") {
                alert("Microphone access is not supported on server-side.");
                return;
            }

            console.log("🎤 Requesting microphone access...");
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            streamRef.current = stream;
            console.log("✅ Microphone access granted");

            mediaRecorder.current = new MediaRecorder(stream, {
                mimeType: "audio/webm;codecs=opus",
            });

            mediaRecorder.current.ondataavailable = (event) => {
                if (event.data.size > 0 && ws.current?.readyState === WebSocket.OPEN) {
                    console.log(`📤 Sending audio chunk (${event.data.size} bytes)`);
                    ws.current.send(event.data);
                }
            };

            mediaRecorder.current.onstop = () => {
                console.log("🛑 Recording stopped, sending end_stream signal");
                if (ws.current?.readyState === WebSocket.OPEN) {
                    ws.current.send(JSON.stringify({ type: "end_stream" }));
                    console.log("✅ end_stream sent");
                } else {
                    console.warn("⚠️ WebSocket not open, cannot send end_stream");
                }
                if (streamRef.current) {
                    streamRef.current.getTracks().forEach(track => track.stop());
                }
            };

            mediaRecorder.current.start(2000); // 2 second chunks
            setIsRecording(true);
            setIsTranscribing(true);
            setRecordingTime(0);

            timerInterval.current = setInterval(() => {
                setRecordingTime(prev => prev + 1);
            }, 1000);

            console.log("🎙️ Recording started");
        } catch (err) {
            console.error("❌ Recording error:", err);
            if ((err as DOMException).name === "NotAllowedError") {
                alert("Microphone permission denied. Please allow microphone access.");
            } else if ((err as DOMException).name === "NotFoundError") {
                alert("No microphone found. Please connect a microphone.");
            } else {
                alert("Could not access microphone: " + (err instanceof Error ? err.message : String(err)));
            }
            setIsTranscribing(false);
        }
    };

    const stopRecording = () => {
        if (mediaRecorder.current && isRecording) {
            console.log("⏹️ Stopping recording...");
            mediaRecorder.current.stop();
            setIsRecording(false);
            if (timerInterval.current) clearInterval(timerInterval.current);
            
            console.log("⏳ Waiting for transcription result from backend...");
            
            // Set a timeout to stop waiting after 30 seconds
            const timeout = setTimeout(() => {
                if (isTranscribing) {
                    console.warn("⚠️ Transcription timeout - no response from backend after 30 seconds");
                    setIsTranscribing(false);
                }
            }, 30000);
            
            // Store timeout so we can clear it if we get a response
            if (!(ws.current as any).transcriptionTimeout) {
                (ws.current as any).transcriptionTimeout = timeout;
            }
        }
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
                        <p className="text-xs font-black uppercase tracking-widest text-slate-400">Live Transcribe</p>
                        <p className="text-sm font-bold text-slate-700">
                            {isRecording ? "Recording... (real-time transcription)" : isTranscribing ? "Processing..." : "Click record to start."}
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
                                <div className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                                <span className="text-xs font-black text-white tabular-nums">{formatTime(recordingTime)}</span>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <Button
                        onClick={isRecording ? stopRecording : startRecording}
                        className={cn(
                            "rounded-xl h-12 px-6 font-bold transition-all",
                            isRecording
                                ? "bg-rose-600 hover:bg-rose-700 text-white"
                                : "bg-indigo-600 hover:bg-indigo-700 text-white"
                        )}
                    >
                        {isRecording ? (
                            <>
                                <Square size={18} className="mr-2" /> Stop Recording
                            </>
                        ) : (
                            <>
                                <Mic size={18} className="mr-2" /> Start Recording
                            </>
                        )}
                    </Button>
                </div>
            </div>
        </Card>
    );
}
