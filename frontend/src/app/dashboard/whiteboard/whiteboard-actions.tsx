"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Share2, Plus } from "lucide-react";

function createBoardId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `board_${Date.now()}`;
}

export function WhiteboardActions({ boardId }: { boardId: string }) {
  const router = useRouter();
  const [copied, setCopied] = useState(false);

  const handleNewBoard = () => {
    const newBoardId = createBoardId();
    router.push(`/dashboard/whiteboard?boardId=${encodeURIComponent(newBoardId)}`);
  };

  const handleInvite = async () => {
    const inviteUrl = `${window.location.origin}/dashboard/whiteboard?boardId=${encodeURIComponent(boardId)}`;

    try {
      if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
        await navigator.share({
          title: "EduPlus Whiteboard",
          text: "Join my collaborative whiteboard",
          url: inviteUrl,
        });
        return;
      }

      await navigator.clipboard.writeText(inviteUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch (error) {
      console.error("Failed to share invite link", error);
    }
  };

  return (
    <div className="flex items-center gap-3">
      <Button
        type="button"
        variant="outline"
        onClick={handleInvite}
        className="rounded-xl border-slate-200 text-slate-600 font-bold hover:bg-slate-50"
      >
        <Share2 size={18} className="mr-2" />
        {copied ? "Invite Link Copied" : "Invite Others"}
      </Button>
      <Button
        type="button"
        onClick={handleNewBoard}
        className="rounded-xl shadow-lg text-white shadow-indigo-100 bg-indigo-600 hover:bg-indigo-700 font-bold"
      >
        <Plus size={18} className="mr-2" /> New Board
      </Button>
    </div>
  );
}
