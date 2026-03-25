import Link from "next/link";
import Image from "next/image";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen w-full font-sans bg-slate-50 relative overflow-hidden">
      {/* Decorative Orbs */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl animate-pulse delay-700" />

      <div className="flex w-full">
        {/* Left Side: Illustration / Branding (Hidden on small screens) */}
        <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 bg-indigo-600 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="grid grid-cols-8 gap-4 rotate-12 -translate-y-24">
              {Array.from({ length: 128 }).map((_, i) => (
                <div key={i} className="w-12 h-12 border border-white rounded-lg" />
              ))}
            </div>
          </div>

          <Link href="/" className="flex items-center gap-3 relative z-10 text-white">
            <Image
              src="/education-plus-logo.svg"
              alt="Education Plus logo"
              width={32}
              height={32}
              className="h-8 w-8 rounded-sm"
              priority
            />
            <span className="text-2xl font-bold tracking-tight">EduPlus</span>
          </Link>

          <div className="relative z-10 max-w-md">
            <h2 className="text-4xl font-black text-white leading-tight mb-6">
              Unlock Your Full Academic Potential with AI.
            </h2>
            <ul className="space-y-4 text-indigo-100">
              <li className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-indigo-500/50 flex items-center justify-center text-[10px] font-bold text-white">1</div>
                Modern Rich-Text Note Taking
              </li>
              <li className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-indigo-500/50 flex items-center justify-center text-[10px] font-bold text-white">2</div>
                Instant AI Summaries & Quizzes
              </li>
              <li className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-indigo-500/50 flex items-center justify-center text-[10px] font-bold text-white">3</div>
                Seamless Study Management
              </li>
            </ul>
          </div>

          <p className="text-indigo-200 text-sm relative z-10">
            Education Plus
          </p>
        </div>

        {/* Right Side: Form */}
        <div className="flex-1 flex flex-col p-6 relative z-10">
          <Link href="/" className="lg:hidden flex items-center gap-2 text-indigo-600 mb-4 self-start">
            <Image
              src="/education-plus-logo.svg"
              alt="Education Plus logo"
              width={24}
              height={24}
              className="h-6 w-6 rounded-sm"
              priority
            />
            <span className="text-xl font-bold tracking-tight">EduPlus</span>
          </Link>

          <div className="flex-1 flex items-center justify-center">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
