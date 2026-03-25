import { DashboardSkeleton } from "@/components/skeletons/dashboard-skeleton";

export default function DashboardLoading() {
  return (
    <div className="space-y-6 pb-12">
      {/* Header Skeleton */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="h-10 w-48 bg-slate-200 animate-pulse rounded-md mb-4" />
          <div className="h-4 w-72 bg-slate-200 animate-pulse rounded-md" />
        </div>
        <div className="h-12 w-40 bg-slate-200 animate-pulse rounded-lg" />
      </div>

      {/* Dashboard Content */}
      <DashboardSkeleton />
    </div>
  );
}
