"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { updateProfile } from "@/actions/profile";
import { Check, Loader2, Sparkles, User as UserIcon, Mail, Phone, Globe, BookOpen, School } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function ProfileForm({ user }: { user: any }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (formData: FormData) => {
    setLoading(true);
    setMessage("");

    const result = await updateProfile(formData);
    if (result.error) {
      setMessage(result.error);
    } else {
      setMessage("Your profile has been successfully updated.");
    }
    setLoading(false);
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Quick Stats/Preview */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="border-none shadow-xl rounded-[2.5rem] overflow-hidden bg-gradient-to-b from-indigo-600 to-indigo-700 text-white relative">
            <div className="absolute inset-0 opacity-10">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" stroke="white" strokeWidth="0.5" fill="none" />
                <circle cx="50" cy="50" r="30" stroke="white" strokeWidth="0.5" fill="none" />
              </svg>
            </div>
            <CardContent className="p-8 pt-12 flex flex-col items-center relative z-10">
              <div className="w-24 h-24 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white mb-6 border-2 border-white/50">
                <span className="text-4xl font-black">{user.name?.charAt(0)}</span>
              </div>
              <h3 className="text-2xl font-black text-center mb-1">{user.name}</h3>
              <p className="text-indigo-100 text-sm font-medium opacity-80 mb-6">{user.email}</p>

              <div className="flex gap-4 w-full">
                <div className="flex-1 bg-white/10 rounded-2xl p-3 text-center">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-indigo-200">Credits</p>
                  <p className="text-lg font-black mt-1">1,240</p>
                </div>
                <div className="flex-1 bg-white/10 rounded-2xl p-3 text-center">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-indigo-200">Level</p>
                  <p className="text-lg font-black mt-1">Master</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm rounded-3xl overflow-hidden">
            <CardHeader>
              <CardTitle className="text-lg font-bold">Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl">
                <span className="text-xs font-bold text-slate-600 uppercase tracking-widest">Dark Mode</span>
                <div className="w-10 h-6 bg-slate-200 rounded-full relative p-1 cursor-pointer">
                  <div className="w-4 h-4 bg-white rounded-full shadow-sm" />
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl">
                <span className="text-xs font-bold text-slate-600 uppercase tracking-widest">AI Assistance</span>
                <div className="w-10 h-6 bg-indigo-600 rounded-full relative p-1 cursor-pointer">
                  <div className="w-4 h-4 bg-white rounded-full shadow-sm translate-x-4" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right: Form */}
        <div className="lg:col-span-8">
          <Card className="border-none shadow-sm rounded-[2rem] overflow-hidden bg-white">
            <CardHeader className="p-8 pb-4">
              <CardTitle className="text-2xl font-black text-slate-900 tracking-tight">Academic Profile</CardTitle>
              <CardDescription className="text-slate-500 font-medium mt-2">
                Update your academic identity to get better AI recommendations.
              </CardDescription>
            </CardHeader>
            <form action={handleSubmit}>
              <CardContent className="p-8 space-y-6 pt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-slate-400 text-[10px] font-black uppercase tracking-widest px-1">Full Name</Label>
                    <div className="relative">
                      <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                      <Input id="name" name="name" defaultValue={user.name} className="h-12 rounded-xl pl-10 bg-slate-50 border-slate-100 font-bold focus-visible:ring-indigo-600" required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-slate-400 text-[10px] font-black uppercase tracking-widest px-1">Email (Primary)</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                      <Input id="email" value={user.email} disabled className="h-12 rounded-xl pl-10 bg-slate-100 border-none font-bold text-slate-400" />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-slate-400 text-[10px] font-black uppercase tracking-widest px-1">Contact Phone</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                      <Input id="phone" name="phone" defaultValue={user.phone} placeholder="+1234567890" className="h-12 rounded-xl pl-10 bg-slate-50 border-slate-100 font-bold focus-visible:ring-indigo-600" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="language" className="text-slate-400 text-[10px] font-black uppercase tracking-widest px-1">Preferred Language</Label>
                    <div className="relative">
                      <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                      <Input id="language" name="language" defaultValue={user.language || "en"} placeholder="en, es, fr..." className="h-12 rounded-xl pl-10 bg-slate-50 border-slate-100 font-bold focus-visible:ring-indigo-600" />
                    </div>
                  </div>
                </div>

                <div className="relative py-4">
                  <div className="absolute inset-0 flex items-center px-8"><span className="w-full border-t border-slate-50" /></div>
                  <div className="relative flex justify-center text-[10px] uppercase"><span className="bg-white px-2 text-slate-300 font-bold tracking-[0.2em]">Academic Grounding</span></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="school" className="text-slate-400 text-[10px] font-black uppercase tracking-widest px-1">University / School</Label>
                    <div className="relative">
                      <School className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                      <Input id="school" name="school" defaultValue={user.academicDetails?.school} className="h-12 rounded-xl pl-10 bg-slate-50 border-slate-100 font-bold focus-visible:ring-indigo-600" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="grade" className="text-slate-400 text-[10px] font-black uppercase tracking-widest px-1">Grade / Semester</Label>
                    <div className="relative">
                      <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                      <Input id="grade" name="grade" defaultValue={user.academicDetails?.grade} className="h-12 rounded-xl pl-10 bg-slate-50 border-slate-100 font-bold focus-visible:ring-indigo-600" />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="stream" className="text-slate-400 text-[10px] font-black uppercase tracking-widest px-1">Academic Stream / Major</Label>
                  <div className="relative">
                    <Sparkles className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-400" size={16} />
                    <Input id="stream" name="stream" defaultValue={user.academicDetails?.stream} placeholder="e.g. Computer Science Engineering" className="h-12 rounded-xl pl-10 bg-slate-50 border-slate-100 font-bold focus-visible:ring-indigo-600" />
                  </div>
                </div>

                <AnimatePresence>
                  {message && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="flex items-center gap-3 bg-emerald-50 text-emerald-700 p-4 rounded-2xl border border-emerald-100"
                    >
                      <Check size={20} className="shrink-0" />
                      <p className="text-sm font-bold">{message}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
              <CardFooter className="p-8 pt-0 flex justify-between">
                <Button variant="ghost" type="button" className="rounded-xl text-slate-400 font-bold">Discard Changes</Button>
                <Button type="submit" disabled={loading} className="h-12 text-white rounded-xl px-10 shadow-lg shadow-indigo-100 bg-indigo-600 hover:bg-indigo-700 font-black transition-all active:scale-95">
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" /> SAVING...
                    </div>
                  ) : "SAVE CHANGES"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}
