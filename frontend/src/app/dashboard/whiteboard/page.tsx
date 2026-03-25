import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { WhiteboardClient } from "./whiteboard-client";
import { Button } from "@/components/ui/button";
import { Share2, Plus, Users, Layout } from "lucide-react";

export default async function WhiteboardPage({ searchParams }: { searchParams: Promise<{ boardId?: string }> }) {
    const session = await auth();

    if (!session) {
        redirect("/login");
    }

    const { boardId } = await searchParams;
    const currentBoardId = boardId || "main_board";

    return (
        <div className="space-y-8 flex flex-col h-full pb-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-black tracking-tight text-slate-900">
                        Collaborative Whiteboard 🖊️
                    </h1>
                    <p className="text-slate-500 mt-2 font-medium">
                        Visualize ideas, solve problems, and collaborate in real-time.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" className="rounded-xl border-slate-200 text-slate-600 font-bold hover:bg-slate-50">
                        <Share2 size={18} className="mr-2" /> Invite Others
                    </Button>
                    <Button className="rounded-xl shadow-lg text-white shadow-indigo-100 bg-indigo-600 hover:bg-indigo-700 font-bold">
                        <Plus size={18} className="mr-2" /> New Board
                    </Button>
                </div>
            </div>

            <div className="flex-1">
                <WhiteboardClient boardId={currentBoardId} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 bg-white rounded-3xl shadow-sm border border-slate-50 flex items-center gap-4">
                    <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
                        <Users size={24} />
                    </div>
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Collaboration</p>
                        <p className="text-sm font-bold text-slate-700">Multi-user Canvas</p>
                    </div>
                </div>
                <div className="p-6 bg-white rounded-3xl shadow-sm border border-slate-50 flex items-center gap-4">
                    <div className="p-3 bg-teal-50 text-teal-600 rounded-2xl">
                        <Plus size={24} />
                    </div>
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Tools</p>
                        <p className="text-sm font-bold text-slate-700">Rich Brush & Shape Tools</p>
                    </div>
                </div>
                <div className="p-6 bg-white rounded-3xl shadow-sm border border-slate-50 flex items-center gap-4">
                    <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl">
                        <Layout size={24} />
                    </div>
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Export</p>
                        <p className="text-sm font-bold text-slate-700">Export as SVG/Image</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
