"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { seedMockData } from "@/actions/admin";
import { Loader2, Database } from "lucide-react";

export function SeedDataBtn() {
    const [loading, setLoading] = useState(false);

    const handleSeed = async () => {
        if (!confirm("Are you sure? This will add dozens of mock documents to your current user session.")) return;
        setLoading(true);
        const res = await seedMockData();
        if (res.success) {
            alert("DB Seeded Successfully! Refreshing Dashboard...");
            window.location.href = "/dashboard";
        } else {
            alert(res.error || "Seeding failed");
        }
        setLoading(false);
    };

    return (
        <Button
            variant="outline"
            className="rounded-xl border-amber-200 text-amber-700 font-bold hover:bg-amber-50"
            onClick={handleSeed}
            disabled={loading}
        >
            {loading ? <Loader2 size={18} className="mr-2 animate-spin" /> : <Database size={18} className="mr-2" />}
            Seed Mock Data
        </Button>
    );
}