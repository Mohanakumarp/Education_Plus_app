"use client";

import { useEffect, useMemo, useState } from "react";
import {
    format,
    addMonths,
    startOfMonth,
    endOfMonth,
    startOfWeek,
    endOfWeek,
    isSameMonth,
    isSameDay,
    addDays,
} from "date-fns";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Plus, Filter, Sparkles, BookOpen } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { getEvents, addEvent, deleteEvent } from "@/actions/calendar";

interface CalendarEvent {
    id: string;
    date: string;
    title: string;
    time: string;
    type: "Study" | "Collab" | "Exam" | "Task";
}

export default function CalendarPage() {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [events, setEvents] = useState<CalendarEvent[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAddEventOpen, setIsAddEventOpen] = useState(false);
    const [newEventTitle, setNewEventTitle] = useState("");
    const [newEventTime, setNewEventTime] = useState("09:00");
    const [newEventType, setNewEventType] = useState<CalendarEvent["type"]>("Study");

    useEffect(() => {
        const fetchEvents = async () => {
            setLoading(true);
            const res = await getEvents();
            if (res.events) {
                setEvents(res.events as any);
            }
            setLoading(false);
        };
        fetchEvents();
    }, []);

    const selectedDateKey = useMemo(() => format(selectedDate, "yyyy-MM-dd"), [selectedDate]);
    const selectedDateEvents = useMemo(
        () => events
            .filter((event) => event.date === selectedDateKey)
            .sort((a, b) => a.time.localeCompare(b.time)),
        [events, selectedDateKey]
    );

    const getEventsForDay = (date: Date) => {
        const dayKey = format(date, "yyyy-MM-dd");
        return events.filter((event) => event.date === dayKey).sort((a, b) => a.time.localeCompare(b.time));
    };

    const handleAddEvent = async (e: React.FormEvent) => {
        e.preventDefault();
        const trimmedTitle = newEventTitle.trim();
        if (!trimmedTitle) return;

        const res = await addEvent({
            date: selectedDateKey,
            title: trimmedTitle,
            time: newEventTime,
            type: newEventType,
        });

        if (res.event) {
            setEvents((prev) => [...prev, res.event as any]);
            setNewEventTitle("");
            setNewEventTime("09:00");
            setNewEventType("Study");
            setIsAddEventOpen(false);
        } else if (res.error) {
            alert(res.error);
        }
    };

    const removeEvent = async (eventId: string) => {
        const res = await deleteEvent(eventId);
        if (res.success) {
            setEvents((prev) => prev.filter((event) => event.id !== eventId));
        } else if (res.error) {
            alert(res.error);
        }
    };

    const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
    const prevMonth = () => setCurrentMonth(addMonths(currentMonth, -1));

    const renderHeader = () => {
        return (
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-4xl font-black tracking-tight text-slate-900">
                        Study Calendar
                    </h1>
                    <p className="text-slate-500 mt-2 font-medium">
                        Your academic schedule at a glance.
                    </p>
                </div>
                <div className="flex items-center gap-2 bg-white p-2 rounded-2xl shadow-sm border border-slate-100">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={prevMonth}
                        className="rounded-xl hover:bg-slate-50"
                    >
                        <ChevronLeft size={20} />
                    </Button>
                    <div className="px-4 font-black text-lg text-slate-800 uppercase tracking-tighter w-[150px] text-center">
                        {format(currentMonth, "MMMM yyyy")}
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={nextMonth}
                        className="rounded-xl hover:bg-slate-50"
                    >
                        <ChevronRight size={20} />
                    </Button>
                </div>
            </div>
        );
    };

    const renderDays = () => {
        const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        return (
            <div className="grid grid-cols-7 mb-4">
                {days.map((day, i) => (
                    <div key={i} className="text-center text-[10px] font-black text-slate-400 uppercase tracking-widest py-2">
                        {day}
                    </div>
                ))}
            </div>
        );
    };

    const renderCells = () => {
        const monthStart = startOfMonth(currentMonth);
        const monthEnd = endOfMonth(monthStart);
        const startDate = startOfWeek(monthStart);
        const endDate = endOfWeek(monthEnd);

        const rows = [];
        let daysResult = [];
        let day = startDate;

        while (day <= endDate) {
            for (let i = 0; i < 7; i++) {
                const formattedDate = format(day, "d");
                const cloneDay = day;
                const dayEvents = getEventsForDay(day);

                daysResult.push(
                    <div
                        key={day.toString()}
                        className={cn(
                            "relative aspect-square md:aspect-[4/3] border-[0.5px] border-slate-50 p-2 lg:p-4 group transition-all duration-200 cursor-pointer overflow-hidden flex flex-col items-start gap-1",
                            !isSameMonth(day, monthStart) ? "bg-slate-50/50 text-slate-300 pointer-events-none" : "hover:bg-indigo-50/10 text-slate-900",
                            isSameDay(day, selectedDate) ? "bg-indigo-50/30 text-indigo-700 ring-2 ring-indigo-600 ring-inset" : ""
                        )}
                        onClick={() => setSelectedDate(cloneDay)}
                    >
                        <span className={cn(
                            "text-sm font-bold flex items-center justify-center w-8 h-8 rounded-full mb-1",
                            isSameDay(day, new Date()) ? "bg-indigo-600 text-white shadow-lg" : ""
                        )}>
                            {formattedDate}
                        </span>

                        <div className="space-y-1 w-full flex-1">
                            {dayEvents.slice(0, 2).map((event) => (
                                <div key={event.id} className="flex items-center gap-1.5 p-1 rounded-md overflow-hidden bg-white/50 backdrop-blur shadow-sm group-hover:shadow-md transition-shadow">
                                    <div className={cn(
                                        "w-1 h-3 rounded-full shrink-0",
                                        event.type === "Study" ? "bg-indigo-500" :
                                            event.type === "Collab" ? "bg-emerald-500" :
                                                event.type === "Exam" ? "bg-rose-500" : "bg-amber-500"
                                    )} />
                                    <span className="text-[10px] font-bold text-slate-700 truncate">{event.title}</span>
                                </div>
                            ))}
                            {dayEvents.length > 2 && (
                                <p className="text-[10px] font-bold text-slate-400">+{dayEvents.length - 2} more</p>
                            )}
                        </div>
                    </div>
                );
                day = addDays(day, 1);
            }
            rows.push(
                <div className="grid grid-cols-7" key={day.toString()}>
                    {daysResult}
                </div>
            );
            daysResult = [];
        }
        return <div className="bg-white rounded-[2rem] overflow-hidden shadow-xl shadow-slate-200/50 border border-slate-100">{rows}</div>;
    };

    return (
        <div className="space-y-8 pb-12">
            {renderHeader()}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                <div className="lg:col-span-8">
                    {renderDays()}
                    {renderCells()}
                </div>

                <div className="lg:col-span-4 space-y-8">
                    <Card className="border-none shadow-sm rounded-3xl overflow-hidden">
                        <CardHeader className="p-8 pb-2">
                            <CardTitle className="text-xl font-bold">Schedule for {format(selectedDate, "MMM d")}</CardTitle>
                            <CardDescription>Plan your day effectively.</CardDescription>
                        </CardHeader>
                        <CardContent className="p-8 space-y-4">
                            {selectedDateEvents.length === 0 && (
                                <div className="p-4 rounded-2xl border border-dashed border-slate-200 text-sm font-medium text-slate-500">
                                    No events for this date yet.
                                </div>
                            )}

                            {selectedDateEvents.map((event) => (
                                <div key={event.id} className="flex items-start gap-4 p-4 rounded-2xl border border-slate-50 hover:bg-slate-50 transition-colors">
                                    <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600 group-hover:scale-110 transition-transform">
                                        <BookOpen size={20} />
                                    </div>
                                    <div className="flex-1">
                                        <h5 className="font-bold text-slate-800 text-sm">{event.title}</h5>
                                        <p className="text-xs font-medium text-slate-500">{event.type} • {event.time}</p>
                                    </div>
                                    <button
                                        className="p-1 rounded-full text-slate-400 hover:text-rose-600"
                                        onClick={() => removeEvent(event.id)}
                                        aria-label={`Delete ${event.title}`}
                                        title={`Delete ${event.title}`}
                                    >
                                        <Plus size={16} className="rotate-45" />
                                    </button>
                                </div>
                            ))}
                            <Button
                                variant="ghost"
                                className="w-full mt-4 text-indigo-600 font-bold hover:bg-indigo-50 rounded-xl h-12"
                                onClick={() => setIsAddEventOpen(true)}
                            >
                                <Plus className="mr-2 h-4 w-4" /> Add Event
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <Dialog open={isAddEventOpen} onOpenChange={setIsAddEventOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add Event</DialogTitle>
                        <DialogDescription>
                            Create an event for {format(selectedDate, "MMMM d, yyyy")}.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleAddEvent} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="event-title">Title</Label>
                            <Input
                                id="event-title"
                                placeholder="e.g. Revision Session"
                                value={newEventTitle}
                                onChange={(e) => setNewEventTitle(e.target.value)}
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-2">
                                <Label htmlFor="event-time">Time</Label>
                                <Input
                                    id="event-time"
                                    type="time"
                                    value={newEventTime}
                                    onChange={(e) => setNewEventTime(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="event-type">Type</Label>
                                <select
                                    id="event-type"
                                    value={newEventType}
                                    onChange={(e) => setNewEventType(e.target.value as CalendarEvent["type"])}
                                    aria-label="Event type"
                                    title="Event type"
                                    className="h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm"
                                >
                                    <option value="Study">Study</option>
                                    <option value="Collab">Collab</option>
                                    <option value="Exam">Exam</option>
                                    <option value="Task">Task</option>
                                </select>
                            </div>
                        </div>

                        <DialogFooter>
                            <Button
                                type="submit"
                                className="bg-indigo-600 text-white hover:bg-indigo-700"
                            >
                                Save Event
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
