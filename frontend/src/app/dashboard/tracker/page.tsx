import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { TrackerCharts } from "@/components/dashboard/tracker-charts";
import { Button } from "@/components/ui/button";
import { Download, Share2 } from "lucide-react";

import { getTrackerData } from "@/actions/tracker";

export default async function StudyTrackerPage() {
    const session = await auth();

    if (!session) {
        redirect("/login");
    }

    const data = await getTrackerData();

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-black tracking-tight text-slate-900">
                        Study Tracker
                    </h1>
                    <p className="text-slate-500 mt-2 font-medium">
                        Visualize your progress and optimize your learning routines.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" className="rounded-xl border-slate-200 text-slate-600 font-bold hover:bg-slate-50">
                        <Share2 size={18} className="mr-2" /> Share Insights
                    </Button>
                    <Button className="rounded-xl shadow-lg text-white shadow-indigo-100 bg-indigo-600 hover:bg-indigo-700 font-bold">
                        <Download size={18} className="mr-2" /> Export PDF
                    </Button>
                </div>
            </div>

            <TrackerCharts
                initialData={data.chartData || []}
                subjectsData={data.subjectsData || []}
                stats={data.stats || {
                    totalFocus: "0h",
                    knowledgeEq: "0%",
                    maxStreak: "0 Days",
                    targetGap: "0h"
                }}
            />
        </div>
    );
}
