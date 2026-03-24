"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
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
import Link from "next/link";
import { Github, Loader2, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid email or password");
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch (err) {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full max-w-md"
    >
      <Card className="border-shadow-md rounded-2xl overflow-hidden bg-white ring-1 ring-slate-200">
        <CardHeader className="space-y-4 pt-8 pb-6 text-center">
          <div className="flex justify-center flex-col items-center gap-3">
            {/* <div className="bg-indigo-600 p-2 rounded-lg text-white shadow-sm transition-transform">
              <Sparkles size={22} />
            </div> */}
            <CardTitle className="text-2xl font-bold text-slate-900 tracking-tight">Welcome Back!</CardTitle>
            <CardDescription className="text-slate-500 max-w-xs mx-auto text-sm">
              Sign in to continue managing your study routine with ease.
            </CardDescription>
          </div>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="rounded-lg h-11 bg-slate-50 border-slate-200 focus-visible:ring-indigo-600"
                  required
                />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center px-1">
                  <Label htmlFor="password">Password</Label>
                  <Link href="#" className="text-xs text-indigo-600 font-bold hover:underline">Forgot password?</Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="rounded-lg h-11 bg-slate-50 border-slate-200 focus-visible:ring-indigo-600"
                  required
                />
              </div>
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xs font-bold text-red-500 bg-red-50 p-3 rounded-lg border border-red-100"
                >
                  {error}
                </motion.p>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-6 pb-10">
            <Button className="w-full text-white h-11 rounded-lg text-base font-semibold shadow-sm bg-indigo-600 hover:bg-indigo-700 transition-all active:scale-[0.98]" type="submit" disabled={loading}>
              {loading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" /> Logging in...
                </div>
              ) : "Sign In"}
            </Button>

            <div className="relative w-full">
              <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-slate-100" /></div>
              <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-slate-400 font-bold tracking-widest">Or continue with</span></div>
            </div>

            <div className="grid grid-cols-1 w-full gap-4">
              <Button variant="outline" className="h-11 rounded-lg border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold flex items-center justify-center gap-3">
                <img src="https://www.google.com/favicon.ico" className="w-4 h-4 grayscale" alt="Google" />
                Google Account
              </Button>
            </div>

            <p className="text-sm text-center text-slate-500">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="text-indigo-600 font-semibold hover:underline">
                Create one now
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
      <div className="mt-8 text-center text-xs text-slate-400 font-medium">
        By continuing, you agree to our Terms of Service and Privacy Policy.
      </div>
    </motion.div>
  );
}
