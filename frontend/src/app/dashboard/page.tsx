import { auth } from "@/auth";
import { redirect } from "next/navigation";
import connectDB from "@/lib/db";
import Subject from "@/models/Subject";
import Note from "@/models/Note";
import Task from "@/models/Task";
import QuizHistory from "@/models/QuizHistory";
import StudySession, { IStudySession } from "@/models/StudySession";
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
  TrendingUp,
  ExternalLink
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PomodoroTimer } from "@/components/dashboard/pomodoro";
import { DashboardAnimationWrapper } from "@/components/dashboard/dashboard-animation-wrapper";
import { QuickTasks } from "@/components/dashboard/quick-tasks";
import { SeedDataButton } from "@/components/dashboard/seed-button";
import { seedMockData } from "@/actions/admin";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  await connectDB();
  const userId = session.user.id;

  // Fetch Stats
  const subjectCount = await Subject.countDocuments({ userId });
  const noteCount = await Note.countDocuments({ userId });
  const quizCount = await QuizHistory.countDocuments({ userId });

  // Calculate Study Hours
  const studySessions = await StudySession.find({ userId });
  const totalMinutes = studySessions.reduce((acc: number, s: IStudySession) => acc + s.durationMinutes, 0);
  const totalHours = (totalMinutes / 60).toFixed(1);

  // Fetch Recent Subjects with metrics
  const recentSubjectsRaw = await Subject.find({ userId }).sort({ updatedAt: -1 }).limit(4);
  const recentSubjects = await Promise.all(recentSubjectsRaw.map(async (s) => {
    const n = await Note.countDocuments({ subjectId: s._id });
    const t = await Task.countDocuments({ subjectId: s._id });
    const doneT = await Task.countDocuments({ subjectId: s._id, status: "done" });
    const progress = t > 0 ? Math.round((doneT / t) * 100) : (n > 0 ? 30 : 0); // Fake progress if no tasks but notes exist
    return {
      _id: s._id.toString(),
      name: s.name,
      notes: n,
      tasks: t,
      color: "bg-indigo-500", // Default or from s.color
      progress
    };
  }));

  // Fetch Upcoming Deadlines
  const upcomingTasks = await Task.find({
    userId,
    status: { $ne: 'done' }
  }).sort({ createdAt: -1 }).limit(3);

  // Fetch Quick Tasks
  const quickTasksRaw = await Task.find({ userId }).sort({ createdAt: -1 }).limit(3);
  const quickTasks = quickTasksRaw.map(t => ({
    _id: t._id.toString(),
    title: t.title,
    status: t.status
  }));

  const stats = [
    { name: "Active Subjects", value: subjectCount.toString(), icon: BookOpen, color: "text-indigo-600", bg: "bg-indigo-50", trend: "Total tracked" },
    { name: "Notes Taken", value: noteCount.toString(), icon: FileText, color: "text-indigo-600", bg: "bg-indigo-50", trend: `${noteCount} documents` },
    { name: "Quizzes Done", value: quizCount.toString(), icon: BrainCircuit, color: "text-indigo-600", bg: "bg-indigo-50", trend: "Persistence is key" },
    { name: "Study Hours", value: `${totalHours}h`, icon: Clock, color: "text-indigo-600", bg: "bg-indigo-50", trend: "This week" },
  ];

  return (
    <DashboardAnimationWrapper>
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-4">
            <h1 className="text-4xl font-black tracking-tight text-slate-900">
              Hi, {session.user?.name?.split(' ')[0]}
            </h1>
            {/* <SeedDataButton /> */}
          </div>
          <p className="text-slate-500 mt-2 font-medium">
            You have {upcomingTasks.length} pending tasks to crush today.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/dashboard/subjects">
            <Button className="rounded-xl shadow-lg shadow-indigo-100 bg-indigo-600 hover:bg-indigo-700 font-bold text-white h-12 px-6">
              <PlusCircle className="mr-2 h-5 w-5" /> Start Studying
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mt-8">
        {stats.map((stat) => (
          <Card key={stat.name} className="border-none shadow-sm hover:shadow-xl transition-all duration-300 rounded-[2rem] overflow-hidden group bg-white/50 backdrop-blur-sm ring-1 ring-slate-100/50">
            <CardContent className="p-8">
              <div className="flex items-start justify-between mb-6">
                <div className={cn(stat.bg, "p-4 rounded-[1.5rem]", stat.color, "group-hover:scale-110 transition-transform duration-500 shadow-sm")}>
                  <stat.icon size={24} strokeWidth={2.5} />
                </div>
                <div className="text-[10px] font-black text-slate-400 bg-slate-50 px-3 py-1.5 rounded-full flex items-center gap-1.5 uppercase tracking-widest border border-slate-100">
                  <TrendingUp size={10} /> {stat.trend}
                </div>
              </div>
              <div>
                <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{stat.name}</p>
                <p className="text-4xl font-black text-slate-900 mt-1 tabular-nums">{stat.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 items-start mt-8">
        {/* Recent Subjects */}
        <div className="lg:col-span-8 space-y-8">
          <Card className="border-none shadow-2xl shadow-slate-200/40 rounded-[2.5rem] overflow-hidden bg-white ring-1 ring-slate-100">
            <CardHeader className="flex flex-row items-center justify-between bg-slate-50/40 pt-8 px-10 border-b border-slate-50">
              <div>
                <CardTitle className="text-2xl font-black tracking-tight text-slate-800">Recent Subjects</CardTitle>
                <CardDescription className="text-slate-500 font-medium">Pick up where you left off.</CardDescription>
              </div>
              <Button variant="ghost" className="text-indigo-600 font-black hover:bg-indigo-50 rounded-2xl h-11 px-6 uppercase tracking-widest text-[10px]" asChild>
                <Link href="/dashboard/subjects">View All <ArrowUpRight className="ml-2 h-4 w-4" /></Link>
              </Button>
            </CardHeader>
            <CardContent className="p-5">
              {recentSubjects.length === 0 ? (
                <div className="text-center py-20 bg-slate-50/50 rounded-[2rem] border-2 border-dashed border-slate-100">
                  <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No subjects created yet.</p>
                  <Link href="/dashboard/subjects">
                    <Button className="mt-4 rounded-xl bg-indigo-600">Create Subject</Button>
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  {recentSubjects.map((subject) => (
                    <Link key={subject._id} href={`/dashboard/subjects/${subject._id}`}>
                      <div className="flex flex-col p-6 rounded-[2rem] border border-slate-100 group hover:border-indigo-200 hover:bg-indigo-50/30 transition-all duration-300 cursor-pointer shadow-sm hover:shadow-indigo-100/50 relative overflow-hidden bg-white">
                        <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                          <ExternalLink size={14} className="text-indigo-400" />
                        </div>
                        <div className="flex items-center gap-4 mb-4">
                          <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg ring-4 ring-white", subject.color)}>
                            {subject.name.charAt(0)}
                          </div>
                          <div>
                            <h4 className="font-bold text-slate-800 text-lg leading-tight group-hover:text-indigo-700 transition-colors uppercase tracking-tight">{subject.name}</h4>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">{subject.notes} notes • {subject.tasks} tasks</p>
                          </div>
                        </div>
                        <div className="space-y-2 mt-2">
                          <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-400">
                            <span>Subject Mastery</span>
                            <span className="text-indigo-600">{subject.progress}%</span>
                          </div>
                          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                            <div
                              className={cn("h-full rounded-full transition-all duration-1000", subject.color)}
                              style={{ width: `${subject.progress}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="border-none shadow-xl shadow-slate-200/30 rounded-[2.5rem] overflow-hidden bg-white ring-1 ring-slate-100">
              <CardHeader className="p-8 pb-4">
                <CardTitle className="flex items-center gap-3 text-xl font-black text-slate-800">
                  <div className="p-2 bg-indigo-50 rounded-xl text-indigo-600">
                    <Calendar size={20} />
                  </div>
                  Upcoming
                </CardTitle>
              </CardHeader>
              <CardContent className="px-8 pb-8 space-y-4">
                {upcomingTasks.length === 0 ? (
                  <p className="text-slate-400 text-sm font-medium italic">No upcoming deadlines. Chill out!</p>
                ) : upcomingTasks.map((event) => (
                  <div key={event._id.toString()} className="flex items-center gap-4 p-4 hover:bg-slate-50 rounded-[1.5rem] transition-all cursor-pointer border border-transparent hover:border-slate-100 group">
                    <div className={cn("w-1.5 h-10 rounded-full bg-indigo-500 group-hover:h-12 transition-all")} />
                    <div className="flex-1">
                      <h5 className="font-bold text-sm text-slate-800 group-hover:text-indigo-600 transition-colors">{event.title}</h5>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">{event.subject || 'General'}</p>
                    </div>
                    <div className="text-[9px] font-black text-slate-500 bg-slate-100 px-3 py-1.5 rounded-xl uppercase tracking-widest border border-slate-200">
                      {event.dueDate ? formatDistanceToNow(new Date(event.dueDate), { addSuffix: true }) : 'Soon'}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="border-none shadow-xl shadow-slate-200/30 rounded-[2.5rem] overflow-hidden bg-white ring-1 ring-slate-100">
              <CardHeader className="p-8 pb-4">
                <CardTitle className="flex items-center gap-3 text-xl font-black text-slate-800">
                  <div className="p-2 bg-rose-50 rounded-xl text-rose-600">
                    <Clock size={20} />
                  </div>
                  Quick Tasks
                </CardTitle>
              </CardHeader>
              <CardContent className="px-8 pb-8">
                <QuickTasks initialTasks={quickTasks} />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Side column: Pomodoro & AI Study Tip */}
        <div className="lg:col-span-4 space-y-8">
          <PomodoroTimer />
        </div>
      </div>
    </DashboardAnimationWrapper>
  );
}
