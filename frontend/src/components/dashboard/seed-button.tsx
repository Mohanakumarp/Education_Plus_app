"use client";

import { Button } from "@/components/ui/button";
import { Database } from "lucide-react";
import { seedMockData } from "@/actions/admin";
import { useState } from "react";

export function SeedDataButton() {
    const [loading, setLoading] = useState(false);

    const handleSeed = async () => {
        if (!confirm("This will add mock data to your account. Continue?")) return;
        setLoading(true);
        const res = await seedMockData();
        setLoading(false);
        if (res.success) {
            alert("Database seeded successfully! Refreshing...");
            window.location.reload();
        } else {
            alert("Error: " + res.error);
        }
    };

    return (
        <Button
            variant="outline"
            size="sm"
            onClick={handleSeed}
            disabled={loading}
            className="rounded-xl border-slate-200 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-indigo-600 transition-colors"
        >
            <Database size={12} className="mr-2" />
            {loading ? "Seeding..." : "Seed Mock Data"}
        </Button>
    );
}
