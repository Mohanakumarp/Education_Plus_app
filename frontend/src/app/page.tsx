"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Navbar } from "@/components/layout/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  BookOpen,
  BrainCircuit,
  Clock,
  LayoutDashboard,
  Sparkles,
  Users,
  ArrowRight,
  CheckCircle2,
  WandSparkles,
  Target,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const featureItems = [
  {
    name: "Note Taking Engine",
    description: "Advanced rich-text editor with support for Markdown, equations, and code snippets.",
    icon: BookOpen,
    tone: "bg-indigo-100 text-indigo-700",
  },
  {
    name: "AI Summarization",
    description: "Turn dense lectures into clean, revision-ready summaries instantly.",
    icon: BrainCircuit,
    tone: "bg-emerald-100 text-emerald-700",
  },
  {
    name: "Smart Quiz Generator",
    description: "Generate focused practice questions from your own learning material.",
    icon: Sparkles,
    tone: "bg-amber-100 text-amber-700",
  },
  {
    name: "Study Management",
    description: "Track subjects, deadlines, and study priorities in one place.",
    icon: LayoutDashboard,
    tone: "bg-indigo-100 text-indigo-700",
  },
  {
    name: "Pomodoro Timer",
    description: "Stay in flow with structured sessions and guided breaks.",
    icon: Clock,
    tone: "bg-amber-100 text-amber-700",
  },
  {
    name: "Collaborative Learning",
    description: "Share notes and work with peers without losing context.",
    icon: Users,
    tone: "bg-emerald-100 text-emerald-700",
  },
];

const flowItems = [
  {
    title: "Capture",
    text: "Bring lectures, textbook notes, and ideas into one workspace.",
    icon: WandSparkles,
    color: "text-indigo-700",
    bg: "bg-indigo-100",
  },
  {
    title: "Understand",
    text: "Use AI summaries and quiz generation to reinforce concepts quickly.",
    icon: BrainCircuit,
    color: "text-emerald-700",
    bg: "bg-emerald-100",
  },
  {
    title: "Execute",
    text: "Plan your sessions, hit deadlines, and build consistent momentum.",
    icon: Target,
    color: "text-amber-700",
    bg: "bg-amber-100",
  },
];

export default function Home() {
  const prefersReducedMotion = useReducedMotion();

  const staggerContainer = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: prefersReducedMotion ? 0 : 0.09,
        delayChildren: prefersReducedMotion ? 0 : 0.1,
      },
    },
  };

  const itemFade = {
    hidden: { opacity: 0, y: prefersReducedMotion ? 0 : 18 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: prefersReducedMotion ? 0 : 0.55, ease: "easeOut" as const },
    },
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 pt-16">
        <section className="relative overflow-hidden px-6 pb-20 pt-16 sm:pb-28 sm:pt-20 lg:px-8">
          <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
            <motion.div
              className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-indigo-300/30 blur-3xl"
              animate={prefersReducedMotion ? undefined : { x: [0, 18, 0], y: [0, 12, 0] }}
              transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute right-[-4rem] top-12 h-80 w-80 rounded-full bg-amber-200/35 blur-3xl"
              animate={prefersReducedMotion ? undefined : { x: [0, -22, 0], y: [0, 18, 0] }}
              transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute bottom-[-6rem] left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-emerald-200/25 blur-3xl"
              animate={prefersReducedMotion ? undefined : { y: [0, -20, 0] }}
              transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
            />
            <div className="absolute inset-0 bg-[radial-gradient(60rem_45rem_at_50%_0%,rgba(79,70,229,0.09),transparent)]" />
          </div>

          <div className="mx-auto max-w-7xl">
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 items-start gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-10"
            >
              <motion.div variants={itemFade} className="text-center lg:text-left">
                <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-indigo-200/70 bg-white/80 px-4 py-1.5 text-sm font-semibold text-indigo-700">
                  <Sparkles size={16} />
                  <span>Learning OS for focused students</span>
                </div>

                <h1 className="text-balance text-4xl font-bold tracking-tight text-slate-900 sm:text-6xl">
                  A study space that <span className="text-indigo-600">moves with your mind</span>
                </h1>
                <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-600 lg:mx-0">
                  From note capture to revision practice, Education Plus turns scattered academic work into one guided flow — calm, smart, and consistent.
                </p>

                <div className="mt-9 flex flex-col items-center gap-4 sm:flex-row lg:justify-start">
                  <motion.div whileHover={prefersReducedMotion ? undefined : { scale: 1.03 }} whileTap={prefersReducedMotion ? undefined : { scale: 0.97 }}>
                    <Button size="lg" className="h-12 rounded-lg px-8" asChild>
                      <Link href="/register">
                        Start Studying Smarter <ArrowRight className="ml-2" size={18} />
                      </Link>
                    </Button>
                  </motion.div>
                  <motion.div whileHover={prefersReducedMotion ? undefined : { scale: 1.02 }} whileTap={prefersReducedMotion ? undefined : { scale: 0.98 }}>
                    <Button size="lg" variant="outline" className="h-12 rounded-lg border-indigo-200 bg-white/80 px-8 text-indigo-700 hover:bg-indigo-50" asChild>
                      <Link href="/dashboard">View Live Dashboard</Link>
                    </Button>
                  </motion.div>
                </div>

                <div className="mt-8 flex flex-wrap items-center justify-center gap-3 text-sm lg:justify-start">
                  {[
                    "AI summaries",
                    "Quiz generation",
                    "Pomodoro flow",
                    "Subject planner",
                  ].map((chip) => (
                    <span key={chip} className="inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-1.5 text-slate-700 ring-1 ring-slate-200">
                      <CheckCircle2 size={14} className="text-emerald-600" />
                      {chip}
                    </span>
                  ))}
                </div>
              </motion.div>

              <motion.div variants={itemFade} className="relative">
                <div className="relative rounded-3xl border border-slate-200/70 bg-white/85 p-4 shadow-sm backdrop-blur-sm">
                  <div className="rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-900 p-5 text-white">
                    <div className="flex items-center justify-between">
                      <div className="inline-flex items-center gap-2 rounded-lg bg-white/10 px-3 py-1.5 text-xs font-semibold text-indigo-100">
                        <Image src="/education-plus-logo.svg" alt="Education Plus logo" width={18} height={18} />
                        Focus Session
                      </div>
                      <span className="rounded-md bg-emerald-400/20 px-2 py-1 text-xs font-semibold text-emerald-200">ACTIVE</span>
                    </div>

                    <div className="mt-6 grid gap-3">
                      <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                        <p className="text-xs text-indigo-200">Current Subject</p>
                        <p className="mt-1 text-sm font-semibold">Data Structures · Trees & Graphs</p>
                      </div>
                      <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                        <p className="text-xs text-indigo-200">Next AI Action</p>
                        <p className="mt-1 text-sm font-semibold">Generate quiz from last 2 lecture notes</p>
                      </div>
                    </div>

                    <div className="mt-6">
                      <div className="mb-2 flex items-center justify-between text-xs text-indigo-200">
                        <span>Session Progress</span>
                        <span>72%</span>
                      </div>
                      <div className="h-2 rounded-full bg-white/15">
                        <motion.div
                          className="h-full rounded-full bg-gradient-to-r from-indigo-300 via-amber-300 to-emerald-300"
                          initial={{ width: 0 }}
                          animate={{ width: "72%" }}
                          transition={{ duration: prefersReducedMotion ? 0 : 1, ease: "easeOut", delay: prefersReducedMotion ? 0 : 0.35 }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <motion.div
                  className="absolute -left-6 top-16 hidden rounded-xl border border-indigo-100 bg-white/95 p-3 shadow-sm lg:block"
                  animate={prefersReducedMotion ? undefined : { y: [0, -6, 0] }}
                  transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
                >
                  <p className="text-xs font-semibold text-indigo-700">Focus Streak</p>
                  <p className="mt-1 text-lg font-bold text-slate-900">12 days</p>
                </motion.div>

                <motion.div
                  className="absolute -right-5 bottom-8 hidden rounded-xl border border-amber-100 bg-amber-50/95 p-3 shadow-sm lg:block"
                  animate={prefersReducedMotion ? undefined : { y: [0, 6, 0] }}
                  transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
                >
                  <p className="text-xs font-semibold text-amber-700">Quiz Readiness</p>
                  <p className="mt-1 text-lg font-bold text-slate-900">85%</p>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        <section className="bg-white/80 px-6 py-16 sm:py-20 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.2 }}
              className="grid grid-cols-1 gap-4 md:grid-cols-3"
            >
              {flowItems.map((item) => (
                <motion.div key={item.title} variants={itemFade} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className={`mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg ${item.bg} ${item.color}`}>
                    <item.icon size={18} />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{item.text}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        <section className="bg-gradient-to-b from-slate-50 to-white px-6 py-24 sm:py-28 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <motion.div
              className="mx-auto max-w-2xl text-center"
              initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.55, ease: "easeOut" }}
            >
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-indigo-600">Capabilities</p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                Built to support real academic momentum
              </h2>
            </motion.div>

            <div className="mt-14 grid max-w-xl grid-cols-1 gap-6 lg:mx-0 lg:max-w-none lg:grid-cols-3">
              {featureItems.map((feature, idx) => (
                <motion.div
                  key={feature.name}
                  initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: prefersReducedMotion ? 0 : 0.5, ease: "easeOut", delay: prefersReducedMotion ? 0 : idx * 0.05 }}
                >
                  <Card className="h-full border-slate-200/80 bg-white shadow-sm transition-shadow hover:shadow-md">
                    <CardContent className="pt-6">
                      <div className={`inline-flex h-11 w-11 items-center justify-center rounded-lg ${feature.tone}`}>
                        <feature.icon className="h-5 w-5" aria-hidden="true" />
                      </div>
                      <h3 className="mt-4 text-lg font-semibold text-slate-900">{feature.name}</h3>
                      <p className="mt-2 text-sm leading-6 text-slate-600">{feature.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="relative isolate overflow-hidden px-6 py-24 sm:py-28 lg:px-8">
          <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(30rem_30rem_at_75%_0%,rgba(251,191,36,0.25),transparent),radial-gradient(34rem_30rem_at_25%_100%,rgba(79,70,229,0.16),transparent)]" />
          <motion.div
            className="mx-auto max-w-4xl rounded-3xl border border-slate-200 bg-white/90 px-8 py-12 text-center shadow-sm backdrop-blur-sm"
            initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.55, ease: "easeOut" }}
          >
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Ready to turn effort into steady results?
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-600">
              Build a reliable study rhythm with planning, notes, and AI assistance in one place.
            </p>
            <div className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6">
              <motion.div whileHover={prefersReducedMotion ? undefined : { scale: 1.03 }} whileTap={prefersReducedMotion ? undefined : { scale: 0.97 }}>
                <Button size="lg" className="h-12 rounded-lg px-8" asChild>
                  <Link href="/register">Create Account</Link>
                </Button>
              </motion.div>
              <Link href="/login" className="text-sm font-semibold leading-6 text-slate-900 hover:text-indigo-700">
                Already have an account? <span aria-hidden="true">→</span>
              </Link>
            </div>
          </motion.div>
        </section>
      </main>

      <footer className="border-t bg-white py-12">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div className="flex items-center gap-3">
              <Image src="/education-plus-logo.svg" alt="Education Plus logo" width={28} height={28} />
              <span className="text-lg font-semibold tracking-tight">EduPlus</span>
            </div>
            <p className="text-sm text-slate-500">© 2026 Education Plus. All rights reserved.</p>
            <div className="flex gap-6">
              <Link href="#" className="text-sm text-slate-500 hover:text-indigo-600">Privacy Policy</Link>
              <Link href="#" className="text-sm text-slate-500 hover:text-indigo-600">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
