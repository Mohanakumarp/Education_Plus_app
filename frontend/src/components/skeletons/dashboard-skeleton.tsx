import { StatCardSkeleton, ChartSkeleton, SubjectCardSkeleton, TaskItemSkeleton } from "./skeletons";

export function DashboardSkeleton() {
  return (
    <div className="space-y-6 pb-12">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <StatCardSkeleton key={i} />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Tasks */}
          <ChartSkeleton />

          {/* Recent Activity */}
          <ChartSkeleton />
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Pomodoro Timer */}
          <ChartSkeleton />

          {/* Study Streak */}
          <ChartSkeleton />
        </div>
      </div>

      {/* Recent Subjects */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <SubjectCardSkeleton key={i} />
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartSkeleton />
        <ChartSkeleton />
      </div>
    </div>
  );
}
