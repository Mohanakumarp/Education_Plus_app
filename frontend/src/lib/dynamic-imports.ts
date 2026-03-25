import dynamic from "next/dynamic";
import { ChartSkeleton } from "@/components/skeletons";

// Lazy load TrackerCharts component
export const TrackerChartsDynamic = dynamic(
  () => import("@/components/dashboard/tracker-charts").then((mod) => ({ default: mod.TrackerCharts })),
  {
    loading: () => <ChartSkeleton />,
    ssr: true,
  }
);

// Lazy load PomodoroTimer component
export const PomodoroTimerDynamic = dynamic(
  () => import("@/components/dashboard/pomodoro").then((mod) => ({ default: mod.PomodoroTimer })),
  {
    loading: () => <ChartSkeleton />,
    ssr: true,
  }
);

// Lazy load QuickTasks component
export const QuickTasksDynamic = dynamic(
  () => import("@/components/dashboard/quick-tasks").then((mod) => ({ default: mod.QuickTasks })),
  {
    loading: () => <div className="h-32 bg-slate-200 animate-pulse rounded-lg" />,
    ssr: true,
  }
);

// Lazy load DashboardAnimationWrapper (contains heavy framer-motion)
export const DashboardAnimationWrapperDynamic = dynamic(
  () => import("@/components/dashboard/dashboard-animation-wrapper").then((mod) => ({ default: mod.DashboardAnimationWrapper })),
  {
    loading: () => <>{/* Children passed through without animation during load */}</>,
    ssr: true,
  }
);
