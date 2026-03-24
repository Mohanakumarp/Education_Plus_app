"use client";

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area,
    BarChart,
    Bar,
    Cell
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BrainCircuit, Clock, Trophy, Target } from "lucide-react";
import { cn } from "@/lib/utils";

const data = [
    { name: "Mon", study: 4, notes: 3, quizzes: 2 },
    { name: "Tue", study: 2, notes: 5, quizzes: 0 },
    { name: "Wed", study: 6, notes: 2, quizzes: 4 },
    { name: "Thu", study: 3, notes: 4, quizzes: 1 },
    { name: "Fri", study: 5, notes: 8, quizzes: 3 },
    { name: "Sat", study: 8, notes: 2, quizzes: 5 },
    { name: "Sun", study: 1, notes: 1, quizzes: 0 },
];

const subjectsData = [
    { name: "Physics", value: 35, color: "#4f46e5" },
    { name: "Data St.", value: 45, color: "#4f46e5" },
    { name: "Circuits", value: 15, color: "#4f46e5" },
    { name: "Math", value: 5, color: "#4f46e5" },
];

export function TrackerCharts() {
    return (
        <div className="space-y-8 pb-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: "Total Focus", value: "24.5h", icon: Clock, color: "text-indigo-600", bg: "bg-indigo-50" },
                    { label: "Knowledge Eq", value: "85%", icon: BrainCircuit, color: "text-indigo-600", bg: "bg-indigo-50" },
                    { label: "Max Streak", value: "12 Days", icon: Trophy, color: "text-indigo-600", bg: "bg-indigo-50" },
                    { label: "Target Gap", value: "-4h", icon: Target, color: "text-indigo-600", bg: "bg-indigo-50" },
                ].map((stat, i) => (
                    <Card key={i} className="border-none shadow-sm rounded-xl overflow-hidden group">
                        <CardContent className="p-6">
                            <div className="flex items-center gap-3">
                                <div className={cn("p-2.5 rounded-lg transition-transform group-hover:scale-105", stat.bg, stat.color)}>
                                    <stat.icon size={20} />
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{stat.label}</p>
                                    <p className="text-2xl font-bold text-slate-900 mt-0.5">{stat.value}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                <Card className="lg:col-span-8 border-none shadow-sm rounded-2xl overflow-hidden">
                    <CardHeader className="p-6 pb-0">
                        <CardTitle className="text-lg font-semibold">Study Insights</CardTitle>
                        <CardDescription>Track your weekly concentration flow.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="h-[400px] w-full mt-4">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={data}>
                                    <defs>
                                        <linearGradient id="colorStudy" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1} />
                                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis
                                        dataKey="name"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: "#94a3b8", fontSize: 12, fontWeight: 600 }}
                                        dy={10}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: "#94a3b8", fontSize: 12, fontWeight: 600 }}
                                    />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: "#fff", borderRadius: "16px", border: "none", boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)" }}
                                        itemStyle={{ color: "#6366f1", fontWeight: 700 }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="study"
                                        stroke="#6366f1"
                                        strokeWidth={4}
                                        fillOpacity={1}
                                        fill="url(#colorStudy)"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                <Card className="lg:col-span-4 border-none shadow-sm rounded-2xl overflow-hidden self-stretch flex flex-col">
                    <CardHeader className="p-6 pb-2">
                        <CardTitle className="text-lg font-semibold">Time Allocation</CardTitle>
                        <CardDescription>By Subject</CardDescription>
                    </CardHeader>
                    <CardContent className="p-6 flex-1">
                        <div className="h-[250px] w-full relative">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={subjectsData} layout="vertical">
                                    <CartesianGrid strokeDasharray="3 3" horizontal={false} vertical={false} />
                                    <XAxis type="number" hide />
                                    <YAxis
                                        dataKey="name"
                                        type="category"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: "#64748b", fontSize: 12, fontWeight: 700 }}
                                    />
                                    <Tooltip
                                        cursor={{ fill: "transparent" }}
                                        contentStyle={{ backgroundColor: "#fff", borderRadius: "12px", border: "none", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}
                                    />
                                    <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                                        {subjectsData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>

                        <div className="mt-8 space-y-4">
                            {subjectsData.map((item, i) => (
                                <div key={i} className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                                        <span className="text-xs font-bold text-slate-700">{item.name}</span>
                                    </div>
                                    <span className="text-xs font-black text-slate-400">{item.value}%</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="border-none shadow-sm rounded-2xl overflow-hidden bg-white">
                    <CardHeader className="p-6 flex flex-row items-center justify-between">
                        <CardTitle className="text-lg font-semibold">Note Activity</CardTitle>
                        <span className="text-[10px] font-semibold text-indigo-600 bg-indigo-50 px-2 py-1 rounded">Daily Goal: 5</span>
                    </CardHeader>
                    <CardContent className="p-6 pt-4">
                        <div className="h-[150px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={data}>
                                    <Bar
                                        dataKey="notes"
                                        fill="#4f46e5"
                                        radius={[8, 8, 8, 8]}
                                        barSize={36}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-sm rounded-2xl overflow-hidden bg-white">
                    <CardHeader className="p-6 flex flex-row items-center justify-between">
                        <CardTitle className="text-lg font-semibold">Quiz Performance</CardTitle>
                        <span className="text-[10px] font-semibold text-indigo-600 bg-indigo-50 px-2 py-1 rounded">Avg: 78%</span>
                    </CardHeader>
                    <CardContent className="p-6 pt-4">
                        <div className="h-[150px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={data}>
                                    <Line
                                        type="monotone"
                                        dataKey="quizzes"
                                        stroke="#4f46e5"
                                        strokeWidth={3}
                                        dot={{ r: 4, fill: "#fff", stroke: "#4f46e5", strokeWidth: 2 }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
