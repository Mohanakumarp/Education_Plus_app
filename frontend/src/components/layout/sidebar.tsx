"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  BookOpen,
  FileText,
  Calendar,
  CheckSquare,
  BarChart,
  User,
  Settings,
  LogOut
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";

const sidebarItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/subjects", label: "Subjects", icon: BookOpen },
  // { href: "/dashboard/notes", label: "All Notes", icon: FileText }, // Optional, maybe later
  { href: "/dashboard/tasks", label: "Tasks", icon: CheckSquare }, // Placeholder
  { href: "/dashboard/calendar", label: "Calendar", icon: Calendar }, // Placeholder
  { href: "/dashboard/tracker", label: "Study Tracker", icon: BarChart }, // Placeholder
  { href: "/dashboard/profile", label: "Profile", icon: User },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-full bg-white border-r border-slate-200 w-64">
      <div className="p-6 border-b border-slate-100">
        <h1 className="text-2xl font-bold text-indigo-600 flex items-center gap-2">
            <BookOpen className="w-8 h-8" />
            EduPlus
        </h1>
      </div>
      
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {sidebarItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== "/dashboard");
          
          return (
            <Link key={item.href} href={item.href}>
              <span className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                isActive 
                  ? "bg-indigo-50 text-indigo-700" 
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              )}>
                <Icon className={cn("w-5 h-5", isActive ? "text-indigo-600" : "text-slate-400")} />
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-100">
        <Button 
            variant="ghost" 
            className="w-full justify-start text-slate-600 hover:text-red-600 hover:bg-red-50"
            onClick={() => signOut()}
        >
            <LogOut className="w-5 h-5 mr-3" />
            Sign Out
        </Button>
      </div>
    </div>
  );
}
