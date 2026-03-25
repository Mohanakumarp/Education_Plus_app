import { auth } from "@/auth";
import { redirect } from "next/navigation";
import connectDB from "@/lib/db";
import User from "@/models/User";
import Note from "@/models/Note";
import Subject from "@/models/Subject";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
    Users,
    FileText,
    BookOpen,
    Activity,
    ShieldCheck,
    AlertCircle,
    ArrowUpRight,
    Settings,
    MoreVertical
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { SeedDataBtn } from "./seed-btn";

export default async function AdminPage() {
    const session = await auth();

    // Basic role check
    if (!session || (session.user as any).role !== "admin") {
        // For demo purposes, we allow viewing if no actual admin is set, 
        // but in real app we'd redirect or show error.
        // Let's just redirect for now to follow security best practices.
        redirect("/dashboard");
    }

    await connectDB();

    // Fetch stats
    const [userCount, noteCount, subjectCount, recentUsers] = await Promise.all([
        User.countDocuments(),
        Note.countDocuments(),
        Subject.countDocuments(),
        User.find().sort({ createdAt: -1 }).limit(5).lean(),
    ]);

    // AI Service health check
    let aiStatus = "offline";
    try {
        const res = await fetch("http://localhost:8000/health", { cache: 'no-store' });
        if (res.ok) aiStatus = "online";
    } catch (e) { }

    return (
        <div className="space-y-8 pb-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <ShieldCheck className="text-indigo-600" size={20} />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600">Admin Command Center</span>
                    </div>
                    <h1 className="text-4xl font-black tracking-tight text-slate-900">
                        System Overview 🛠️
                    </h1>
                    <p className="text-slate-500 mt-2 font-medium">
                        Monitor platform health and user activity globally.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <SeedDataBtn />
                    <Button variant="outline" className="rounded-xl border-slate-200 text-slate-600 font-bold hover:bg-slate-50">
                        <Settings size={18} className="mr-2" /> Settings
                    </Button>
                    <Button className="rounded-xl shadow-lg shadow-indigo-100 bg-indigo-600 hover:bg-indigo-700 font-bold">
                        Generate System Report
                    </Button>
                </div>
                活跃度: LOW
                状态: ACTIVE
                角色: EDITOR
                文件: page.tsx
                代码:                 <div className="flex items-center gap-3">
                    <Button variant="outline" className="rounded-xl border-slate-200 text-slate-600 font-bold hover:bg-slate-50">
                        <Settings size={18} className="mr-2" /> Settings
                    </Button>
                    <Button className="rounded-xl shadow-lg shadow-indigo-100 bg-indigo-600 hover:bg-indigo-700 font-bold">
                        Generate System Report
                    </Button>
                </div>
            </div>

            {/* Admin Stats Grid */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {[
                    { label: "Total Students", value: userCount, icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
                    { label: "Total Notes", value: noteCount, icon: FileText, color: "text-indigo-600", bg: "bg-indigo-50" },
                    { label: "Total Subjects", value: subjectCount, icon: BookOpen, color: "text-teal-600", bg: "bg-teal-50" },
                    {
                        label: "AI Engine Status",
                        value: aiStatus.toUpperCase(),
                        icon: Activity,
                        color: aiStatus === "online" ? "text-emerald-600" : "text-rose-600",
                        bg: aiStatus === "online" ? "bg-emerald-50" : "bg-rose-50"
                    },
                ].map((stat, i) => (
                    <Card key={i} className="border-none shadow-sm rounded-2xl overflow-hidden group">
                        <CardContent className="p-6">
                            <div className="flex items-center gap-4">
                                <div className={cn("p-4 rounded-2xl transition-transform group-hover:scale-110", stat.bg, stat.color)}>
                                    <stat.icon size={24} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
                                    <p className="text-2xl font-black text-slate-900 mt-1">{stat.value}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Recent Users Table */}
                <Card className="lg:col-span-8 border-none shadow-sm rounded-3xl overflow-hidden">
                    <CardHeader className="p-8 pb-4">
                        <CardTitle className="text-xl font-bold">Recent User Registrations</CardTitle>
                        <CardDescription>View and manage the latest members.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-8 pt-0">
                        <div className="divide-y divide-slate-50">
                            {recentUsers.map((user: any) => (
                                <div key={user._id.toString()} className="flex items-center justify-between py-4 group hover:bg-slate-50/50 transition-colors rounded-xl px-4 -mx-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-500">
                                            {user.name?.charAt(0) || "U"}
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-800">{user.name || "Anonymous User"}</p>
                                            <p className="text-xs text-slate-400 font-medium">{user.email}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <Badge variant="outline" className={cn(
                                            "rounded-full px-3 py-0.5 text-[10px] uppercase font-black tracking-widest",
                                            user.role === "admin" ? "bg-indigo-50 text-indigo-600 border-indigo-100" : "bg-slate-50 text-slate-500 border-slate-100"
                                        )}>
                                            {user.role}
                                        </Badge>
                                        <button className="text-slate-300 hover:text-slate-600 transition-colors">
                                            <MoreVertical size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <Button variant="ghost" className="w-full mt-6 text-indigo-600 font-bold hover:bg-indigo-50 rounded-xl h-12">
                            View All Users <ArrowUpRight className="ml-2 h-4 w-4" />
                        </Button>
                    </CardContent>
                </Card>

                {/* System Health */}
                <div className="lg:col-span-4 space-y-8">
                    <Card className="border-none shadow-sm rounded-3xl overflow-hidden bg-slate-900 text-white relative">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/20 rounded-full -translate-y-12 translate-x-12 blur-2xl" />
                        <CardHeader className="p-8">
                            <CardTitle className="text-lg font-bold">Infrustructure Status</CardTitle>
                            <CardDescription className="text-slate-400">Real-time health monitoring.</CardDescription>
                        </CardHeader>
                        <CardContent className="p-8 pt-0 space-y-6">
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Main API</span>
                                    <Badge className="bg-emerald-500 text-white font-black text-[10px] rounded-full border-none px-2 py-0">RUNNING</Badge>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">AI Service</span>
                                    <Badge className={cn(
                                        "font-black text-[10px] rounded-full border-none px-2 py-0",
                                        aiStatus === "online" ? "bg-emerald-500 text-white" : "bg-rose-500 text-white"
                                    )}>
                                        {aiStatus === "online" ? "OPERATIONAL" : "FAILURE"}
                                    </Badge>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Database (Atlas)</span>
                                    <Badge className="bg-emerald-500 text-white font-black text-[10px] rounded-full border-none px-2 py-0">CONNECTED</Badge>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-white/10 space-y-2">
                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Avg Response Time</p>
                                <div className="flex items-end gap-1 h-8">
                                    {[20, 35, 15, 45, 25, 40, 10, 50, 30].map((h, i) => (
                                        <div key={i} className="flex-1 bg-indigo-500/30 rounded-t-sm" style={{ height: `${h}%` }} />
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-sm rounded-3xl overflow-hidden">
                        <CardHeader className="p-8">
                            <CardTitle className="text-lg font-bold flex items-center gap-2">
                                <AlertCircle size={20} className="text-amber-500" /> Maintenance
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-8 pt-0">
                            <p className="text-xs text-slate-500 font-medium leading-relaxed mb-6">
                                Schedule a maintenance window to perform database migrations or AI model updates.
                            </p>
                            <Button variant="outline" className="w-full rounded-xl border-slate-200 text-slate-600 font-bold hover:bg-slate-50">
                                Enter Maintenance Mode
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
