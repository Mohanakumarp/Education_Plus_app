import { Suspense } from "react";
import connectDB from "@/lib/db";
import Task from "@/models/Task";
import { ChartSkeleton } from "@/components/skeletons";

interface QuickTasksDataProps {
  userId: string;
}

async function QuickTasksDataContent({ userId }: QuickTasksDataProps) {
  await connectDB();

  const quickTasksRaw = await Task.find({ userId })
    .sort({ createdAt: -1 })
    .limit(3);

  const quickTasks = quickTasksRaw.map((t) => ({
    _id: t._id.toString(),
    title: t.title,
    status: t.status,
  }));

  return <>{JSON.stringify(quickTasks)}</>;
}

export function QuickTasksData({ userId }: QuickTasksDataProps) {
  return (
    <Suspense fallback={<ChartSkeleton />}>
      <QuickTasksDataContent userId={userId} />
    </Suspense>
  );
}
