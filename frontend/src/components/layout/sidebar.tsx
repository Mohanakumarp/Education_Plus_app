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
  LogOut,
  Sparkles,
  PenTool,
  ShieldCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { signOut, useSession } from "next-auth/react";
import { motion } from "framer-motion";

const sidebarItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/subjects", label: "Subjects", icon: BookOpen },
  { href: "/dashboard/tasks", label: "Tasks", icon: CheckSquare },
  { href: "/dashboard/calendar", label: "Calendar", icon: Calendar },
  { href: "/dashboard/tracker", label: "Study Tracker", icon: BarChart },
  { href: "/dashboard/whiteboard", label: "Whiteboard", icon: PenTool },
  { href: "/dashboard/profile", label: "Profile", icon: User },
];

export function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const isAdmin = (session?.user as any)?.role === "admin";

  return (
    <div className="flex flex-col h-full bg-white border-r border-slate-200 w-64 shadow-sm">
      <div className="p-6">
        <Link href="/dashboard" className="flex items-center gap-3 group">
          <h1 className="text-xl font-bold tracking-tight text-indigo-600">
            EduPlus
          </h1>
        </Link>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-1.5 overflow-y-auto mt-2">
        <div className="mb-4">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 mb-2">Main Menu</p>
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== "/dashboard");

            return (
              <Link key={item.href} href={item.href}>
                <div className={cn(
                  "relative flex items-center gap-6 my-3 px-3 py-3 rounded-lg text-sm font-medium transition-all duration-200 group",
                  isActive
                    ? "bg-indigo-50 text-indigo-700 shadow-sm"
                    : "text-slate-600 hover:bg-slate-50 hover:text-indigo-600"
                )}>
                  {isActive && (
                    <motion.div
                      layoutId="sidebar-active"
                      className="absolute left-0 w-0.5 h-6 bg-indigo-600 rounded-r-full"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                  <Icon className={cn("w-5 h-5 transition-colors", isActive ? "text-indigo-600" : "text-slate-400 group-hover:text-indigo-500")} />
                  {item.label}
                </div>
              </Link>
            );
          })}
        </div>

        {isAdmin && (
          <div className="pt-4 mt-4 border-t border-slate-100">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 mb-2">Administration</p>
            <Link href="/dashboard/admin">
              <div className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                pathname === "/dashboard/admin"
                  ? "bg-indigo-50 text-indigo-700 shadow-sm"
                  : "text-slate-600 hover:bg-slate-50 hover:text-indigo-600"
              )}>
                <ShieldCheck size={20} className={cn(pathname === "/dashboard/admin" ? "text-indigo-600" : "text-slate-400")} />
                Admin Panel
              </div>
            </Link>
          </div>
        )}

        <div className="pt-4 mt-4 border-t border-slate-100">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 mb-2">Support</p>
          <Link href="/dashboard/settings">
            <div className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
              pathname === "/dashboard/settings"
                ? "bg-indigo-50 text-indigo-700"
                : "text-slate-600 hover:bg-slate-50 hover:text-indigo-600"
            )}>
              <Settings className="w-5 h-5 text-slate-400" />
              Settings
            </div>
          </Link>
        </div>
      </nav>

      <div className="p-4 mt-auto">
        {/* <div className="bg-slate-900 rounded-2xl p-4 text-white mb-4 relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-20 h-20 bg-indigo-600/20 rounded-full blur-xl group-hover:bg-indigo-600/40 transition-colors" />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles size={14} className="text-indigo-400" />
              <p className="text-xs font-semibold text-indigo-100">Pro Plan</p>
            </div>
            <p className="text-[10px] text-slate-400 mb-3 leading-relaxed">Unlock advanced AI and unlimited storage.</p>
            <Button size="sm" className="w-full bg-white text-slate-900 hover:bg-indigo-50 h-8 rounded-lg text-xs font-bold">
              Upgrade Now
            </Button>
          </div>
        </div> */}

        <Button
          variant="ghost"
          className="w-full justify-start text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-xl px-3"
          onClick={() => signOut()}
        >
          <LogOut className="w-5 h-5 mr-3" />
          Sign Out
        </Button>
      </div>
    </div>
  );
}
