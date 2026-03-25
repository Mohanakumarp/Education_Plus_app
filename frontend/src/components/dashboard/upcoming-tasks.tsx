import { Suspense } from "react";
import connectDB from "@/lib/db";
import Task from "@/models/Task";
import { ChartSkeleton } from "@/components/skeletons";

interface UpcomingTasksProps {
  userId: string;
}

async function UpcomingTasksContent({ userId }: UpcomingTasksProps) {
  await connectDB();

  const upcomingTasks = await Task.find({
    userId,
    status: { $ne: "done" },
  })
    .sort({ createdAt: -1 })
    .limit(3);

  return <>{JSON.stringify(upcomingTasks)}</>;
}

export function UpcomingTasks({ userId }: UpcomingTasksProps) {
  return (
    <Suspense fallback={<ChartSkeleton />}>
      <UpcomingTasksContent userId={userId} />
    </Suspense>
  );
}
