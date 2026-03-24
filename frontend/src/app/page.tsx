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
  GraduationCap,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 pt-16">
        {/* Hero Section */}
        <section className="relative overflow-hidden px-6 py-24 sm:py-32 lg:px-8">
          <div className="absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-[radial-gradient(45rem_50rem_at_top,theme(colors.indigo.100),theme(colors.white))]" />
            <svg
              className="absolute left-[50%] top-0 -z-10 h-[64rem] w-[128rem] -translate-x-[50%] stroke-gray-200 [mask-image:radial-gradient(64rem_64rem_at_top,white,transparent)]"
              aria-hidden="true"
            >
              <defs>
                <pattern
                  id="e813992c-7d03-4cc4-a2bd-151760b470a0"
                  width={200}
                  height={200}
                  x="50%"
                  y={-1}
                  patternUnits="userSpaceOnUse"
                >
                  <path d="M100 200V.5M.5 .5H200" fill="none" />
                </pattern>
              </defs>
              <rect
                width="100%"
                height="100%"
                strokeWidth={0}
                fill="url(#e813992c-7d03-4cc4-a2bd-151760b470a0)"
              />
            </svg>
          </div>

          <div className="mx-auto max-w-7xl">
            <div className="grid grid-cols-1 gap-y-16 lg:grid-cols-2 lg:items-center lg:gap-x-16">
              <div className="max-w-2xl text-center lg:text-left">
                <div className="mb-6 flex justify-center lg:justify-start">
                  <span className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-4 py-1.5 text-sm font-semibold text-indigo-600 ring-1 ring-inset ring-indigo-600/20">
                    <Sparkles size={16} />
                    <span>AI-Powered Academic Excellence</span>
                  </span>
                </div>
                <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                  Master Your Studies with <span className="text-indigo-600">Education Plus</span>
                </h1>
                <p className="mt-6 text-lg leading-8 text-gray-600">
                  The all-in-one workspace for students. Organize your subjects, take rich-text notes, and leverage AI to summarize lectures and generate practice quizzes.
                </p>
                <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row lg:justify-start">
                  <Button size="lg" className="h-12 px-8 rounded-full" asChild>
                    <Link href="/register">
                      Get Started Free <ArrowRight className="ml-2" size={18} />
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" className="h-12 px-8 rounded-full" asChild>
                    <Link href="/about">Learn More</Link>
                  </Button>
                </div>
                <div className="mt-10 flex items-center justify-center gap-x-6 lg:justify-start">
                  <div className="flex -space-x-2 overflow-hidden">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="inline-block h-8 w-8 rounded-full ring-2 ring-white bg-indigo-100 flex items-center justify-center text-[10px] font-bold text-indigo-600">
                        U{i}
                      </div>
                    ))}
                  </div>
                  <p className="text-sm font-semibold leading-6 text-gray-600">
                    Trusted by <span className="text-indigo-600">1,000+</span> students
                  </p>
                </div>
              </div>

              <div className="relative mx-auto max-w-xl lg:max-w-none">
                <div className="rounded-2xl bg-white p-2 shadow-md ring-1 ring-gray-900/5">
                  <div className="relative rounded-xl overflow-hidden bg-slate-900 aspect-[4/3] flex items-center justify-center text-white">
                    {/* Dashboard Preview Mockup */}
                    <div className="absolute inset-0 opacity-20 pointer-events-none">
                      <div className="p-4 flex flex-col gap-4">
                        <div className="h-8 w-1/3 bg-slate-700 rounded" />
                        <div className="grid grid-cols-2 gap-4">
                          <div className="h-32 bg-slate-700 rounded" />
                          <div className="h-32 bg-slate-700 rounded" />
                        </div>
                        <div className="h-64 bg-slate-700 rounded" />
                      </div>
                    </div>
                    <div className="z-10 text-center p-8">
                      <div className="mb-4 inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-600 text-white shadow-lg">
                        <LayoutDashboard size={32} />
                      </div>
                      <h3 className="text-2xl font-bold mb-2">Smart Dashboard</h3>
                      <p className="text-slate-400">Manage everything in one powerful, intuitive interface designed for academic success.</p>
                    </div>
                  </div>
                </div>
                {/* Decorative Elements */}
                <div className="absolute -top-6 -right-6 h-24 w-24 rounded-full bg-indigo-400/10 blur-2xl" />
                <div className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-indigo-600/10 blur-3xl" />
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 sm:py-32 bg-white">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-base font-semibold leading-7 text-indigo-600">Elevate Your Learning</h2>
              <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Everything you need to excel in your academics
              </p>
              <p className="mt-6 text-lg leading-8 text-gray-600">
                A seamless integration of organizational tools and artificial intelligence to help you study smarter, not harder.
              </p>
            </div>
            <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
              <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
                {[
                  {
                    name: "Note Taking Engine",
                    description: "Advanced rich-text editor with support for Markdown, equations, and code snippets.",
                    icon: BookOpen,
                  },
                  {
                    name: "AI Summarization",
                    description: "Automatically summarize long lectures, PDFs, or your own notes in seconds.",
                    icon: BrainCircuit,
                  },
                  {
                    name: "Smart Quiz Generator",
                    description: "Generate practice tests and flashcards from your study materials using AI.",
                    icon: Sparkles,
                  },
                  {
                    name: "Study Management",
                    description: "Organize your academic life by subjects, tracks, and semester deadlines.",
                    icon: LayoutDashboard,
                  },
                  {
                    name: "Pomodoro Timer",
                    description: "Built-in productivity timer to keep you focused and prevent burnout.",
                    icon: Clock,
                  },
                  {
                    name: "Collaborative Learning",
                    description: "Share notes and work together with your peers in real-time.",
                    icon: Users,
                  },
                ].map((feature) => (
                  <Card key={feature.name} className="border-none shadow-none hover:shadow-md transition-shadow">
                    <CardContent className="pt-6">
                      <dt className="flex flex-col items-center text-center lg:items-start lg:text-left gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-600 text-white">
                          <feature.icon className="h-6 w-6" aria-hidden="true" />
                        </div>
                        <span className="text-lg font-bold leading-7 text-gray-900">{feature.name}</span>
                        <dd className="text-base leading-7 text-gray-600">{feature.description}</dd>
                      </dt>
                    </CardContent>
                  </Card>
                ))}
              </dl>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative isolate py-24 px-6 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Ready to transform your study habits?
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-gray-600">
              Join thousands of students who are achieving more with Education Plus. Start your journey today!
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Button size="lg" className="h-12 px-8 rounded-full" asChild>
                <Link href="/register">Create Account</Link>
              </Button>
              <Link href="/login" className="text-sm font-semibold leading-6 text-gray-900">
                Already have an account? <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t bg-white py-12">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-primary p-1 text-primary-foreground">
                <GraduationCap size={20} />
              </div>
              <span className="text-lg font-bold tracking-tight">EduPlus</span>
            </div>
            <p className="text-sm text-gray-500">
              © 2024 Education Plus. All rights reserved. Built with ❤️ for students.
            </p>
            <div className="flex gap-6">
              <Link href="#" className="text-sm text-gray-500 hover:text-indigo-600">Privacy Policy</Link>
              <Link href="#" className="text-sm text-gray-500 hover:text-indigo-600">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
