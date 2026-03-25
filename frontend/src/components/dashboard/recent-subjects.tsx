import { Suspense } from "react";
import connectDB from "@/lib/db";
import Subject from "@/models/Subject";
import Note from "@/models/Note";
import Task from "@/models/Task";
import { ChartSkeleton } from "@/components/skeletons";

interface RecentSubjectsProps {
  userId: string;
}

async function RecentSubjectsContent({ userId }: RecentSubjectsProps) {
  await connectDB();

  // Fetch Recent Subjects with metrics - parallel queries
  const recentSubjectsRaw = await Subject.find({ userId })
    .sort({ updatedAt: -1 })
    .limit(4);

  const recentSubjects = await Promise.all(
    recentSubjectsRaw.map(async (s) => {
      const [noteCount, taskCount, doneTaskCount] = await Promise.all([
        Note.countDocuments({ subjectId: s._id }),
        Task.countDocuments({ subjectId: s._id }),
        Task.countDocuments({ subjectId: s._id, status: "done" }),
      ]);

      const progress =
        taskCount > 0
          ? Math.round((doneTaskCount / taskCount) * 100)
          : noteCount > 0
          ? 30
          : 0;

      return {
        _id: s._id.toString(),
        name: s.name,
        notes: noteCount,
        tasks: taskCount,
        color: "bg-indigo-500",
        progress,
      };
    })
  );

  return <>{JSON.stringify(recentSubjects)}</>;
}

export function RecentSubjects({ userId }: RecentSubjectsProps) {
  return (
    <Suspense fallback={<ChartSkeleton />}>
      <RecentSubjectsContent userId={userId} />
    </Suspense>
  );
}
