import { auth } from "@/auth";
import { redirect } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  BookOpen,
  BrainCircuit,
  Calendar,
  Clock,
  FileText,
  PlusCircle,
  Trophy,
  ArrowUpRight,
  TrendingUp
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { PomodoroTimer } from "@/components/dashboard/pomodoro";
import { DashboardAnimationWrapper } from "@/components/dashboard/dashboard-animation-wrapper";
import { cn } from "@/lib/utils";

export default async function DashboardPage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  const stats = [
    { name: "Active Subjects", value: "4", icon: BookOpen, color: "text-indigo-600", bg: "bg-indigo-50", trend: "+2 this month" },
    { name: "Notes Taken", value: "12", icon: FileText, color: "text-indigo-600", bg: "bg-indigo-50", trend: "5 today" },
    { name: "Quizzes Done", value: "8", icon: BrainCircuit, color: "text-indigo-600", bg: "bg-indigo-50", trend: "Avg score 85%" },
    { name: "Study Hours", value: "24h", icon: Clock, color: "text-indigo-600", bg: "bg-indigo-50", trend: "On track" },
  ];

  return (
    <DashboardAnimationWrapper>
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-slate-900">
            Hi, {session.user?.name?.split(' ')[0]} 👋
          </h1>
          <p className="text-slate-500 mt-2 font-medium">
            You're doing great! Keep up the momentum.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button className="rounded-lg shadow-sm bg-indigo-600 hover:bg-indigo-700 font-semibold text-white">
            <PlusCircle className="mr-2 h-4 w-4" /> New Study Session
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.name} className="border-none shadow-sm hover:shadow-md transition-shadow rounded-xl overflow-hidden group">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className={stat.bg + " p-3 rounded-2xl " + stat.color + " group-hover:scale-110 transition-transform"}>
                  <stat.icon size={24} />
                </div>
                <div className="text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded-full flex items-center gap-1">
                  <TrendingUp size={10} /> {stat.trend}
                </div>
              </div>
              <div>
                <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">{stat.name}</p>
                <p className="text-3xl font-black text-slate-900 mt-1">{stat.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 items-start">
        {/* Recent Subjects */}
        <div className="lg:col-span-8 space-y-8">
          <Card className="border-none shadow-sm rounded-2xl overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between bg-slate-50/30 py-6 px-8 border-b border-slate-100">
              <div>
                <CardTitle className="text-lg font-semibold">Recent Subjects</CardTitle>
                <CardDescription>Pick up where you left off.</CardDescription>
              </div>
              <Button variant="ghost" className="text-indigo-600 font-semibold hover:bg-indigo-50 rounded-lg" asChild>
                <Link href="/dashboard/subjects">View All Subjects <ArrowUpRight className="ml-2 h-4 w-4" /></Link>
              </Button>
            </CardHeader>
            <CardContent className="p-8">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {[
                  { name: "Applied Physics", notes: 4, tasks: 2, color: "bg-indigo-500", progress: 65 },
                  { name: "Data Structures", notes: 6, tasks: 5, color: "bg-indigo-500", progress: 40 },
                  { name: "Digital Circuits", notes: 2, tasks: 0, color: "bg-indigo-500", progress: 85 },
                  { name: "Mathematics IV", notes: 0, tasks: 3, color: "bg-indigo-500", progress: 15 },
                ].map((subject) => (
                  <div key={subject.name} className="flex flex-col p-4 rounded-lg border border-slate-100 group hover:border-indigo-200 hover:bg-indigo-50/30 transition-all cursor-pointer">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={"w-10 h-10 rounded-lg " + subject.color + " flex items-center justify-center text-white font-semibold text-sm shadow-sm"}>
                          {subject.name.charAt(0)}
                        </div>
                        <div>
                          <h4 className="font-semibold text-slate-800 text-sm">{subject.name}</h4>
                          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">{subject.notes} notes • {subject.tasks} tasks</p>
                        </div>
                      </div>
                      <ArrowUpRight className="text-slate-300 group-hover:text-indigo-600 transition-colors" size={18} />
                    </div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div
                        className={"h-full rounded-full " + subject.color}
                        style={{ width: `${subject.progress}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-6 h-11 border-dashed hover:border-indigo-300 hover:bg-indigo-50 text-indigo-600 font-semibold rounded-lg">
                <PlusCircle className="mr-2 h-4 w-4" /> Add New Subject
              </Button>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-none shadow-sm rounded-2xl overflow-hidden">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                  <Calendar size={18} className="text-indigo-600" /> Upcoming Deadlines
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { title: "Physics Quiz", date: "Tomorrow, 10:00", type: "Exam", color: "bg-indigo-500" },
                  { title: "DS Project", date: "Fri, 23:59", type: "Assignment", color: "bg-indigo-500" },
                  { title: "Math HW 4", date: "Mon, 08:00", type: "Homework", color: "bg-indigo-500" },
                ].map((event) => (
                  <div key={event.title} className="flex items-center gap-3 p-3 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer border border-transparent hover:border-slate-100">
                    <div className={cn("w-0.5 h-8 rounded-full", event.color)} />
                    <div className="flex-1">
                      <h5 className="font-semibold text-sm text-slate-800">{event.title}</h5>
                      <p className="text-xs font-medium text-slate-500">{event.type}</p>
                    </div>
                    <div className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-1 rounded">
                      {event.date}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm rounded-2xl">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Quick Tasks</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {[
                { title: "Finish physics notes", done: false },
                { title: "Quiz on LangChain", done: true },
                { title: "Review DS Trees", done: false },
              ].map((task, i) => (
                <div key={i} className="flex items-center gap-3 p-2 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer group">
                  <div className={cn(
                    "w-5 h-5 rounded border-1.5 transition-colors",
                    task.done ? "bg-indigo-600 border-indigo-600 flex items-center justify-center" : "border-slate-200 group-hover:border-indigo-400"
                  )}>
                    {task.done && <Check size={12} className="text-white" strokeWidth={4} />}
                  </div>
                  <span className={cn(
                    "text-sm font-medium",
                    task.done ? "text-slate-400 line-through" : "text-slate-700"
                  )}>
                    {task.title}
                  </span>
                </div>
              ))}
              <Input placeholder="Add a quick task..." className="mt-3 border-dashed rounded-lg" />
            </CardContent>
          </Card>
          </div>
        </div>

        {/* Side column: Pomodoro & Tasks */}
        <div className="lg:col-span-4 space-y-8">
          <PomodoroTimer />
        </div>
      </div>
    </DashboardAnimationWrapper>
  );
}

function Check({ size, className, strokeWidth }: { size?: number, className?: string, strokeWidth?: number }) {
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
  )
}
