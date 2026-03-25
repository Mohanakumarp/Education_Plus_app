import { Suspense } from "react";
import connectDB from "@/lib/db";
import Subject from "@/models/Subject";
import Note from "@/models/Note";
import Task from "@/models/Task";
import QuizHistory from "@/models/QuizHistory";
import StudySession, { IStudySession } from "@/models/StudySession";
import { StatCardSkeleton } from "@/components/skeletons";

interface DashboardStatsProps {
  userId: string;
}

async function StatsContent({ userId }: DashboardStatsProps) {
  await connectDB();

  // Fetch Stats - optimized with parallel queries
  const [subjectCount, noteCount, quizCount, studySessions] = await Promise.all([
    Subject.countDocuments({ userId }),
    Note.countDocuments({ userId }),
    QuizHistory.countDocuments({ userId }),
    StudySession.find({ userId }),
  ]);

  const totalMinutes = studySessions.reduce((acc: number, s: IStudySession) => acc + s.durationMinutes, 0);
  const totalHours = (totalMinutes / 60).toFixed(1);

  return (
    <>
      {/* Stats will be rendered here */}
      {subjectCount}|{noteCount}|{quizCount}|{totalHours}
    </>
  );
}

export function DashboardStats({ userId }: DashboardStatsProps) {
  return (
    <Suspense fallback={<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">{[1, 2, 3, 4].map(i => <StatCardSkeleton key={i} />)}</div>}>
      <StatsContent userId={userId} />
    </Suspense>
  );
}
