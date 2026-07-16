"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/ui/Logo";
import { GoogleButton } from "@/components/marketing/GoogleButton";

export function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const searchParams = useSearchParams();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(searchParams.get("error"));
  const [loading, setLoading] = useState(false);

  const isSignup = mode === "signup";

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch(`/api/auth/${mode}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(isSignup ? { name, email, password } : { email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Something went wrong.");
        setLoading(false);
        return;
      }
      // Hard navigation (not router.push) so the browser performs a real
      // top-level request to /dashboard, guaranteeing the freshly-set
      // session cookie is attached — a client-side soft navigation can
      // race with the cookie write and leave the spinner stuck forever.
      window.location.assign("/dashboard");
    } catch {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-6 py-16">
      <div className="bg-grid pointer-events-none absolute inset-0 -z-10 [mask-image:radial-gradient(ellipse_50%_50%_at_50%_0%,black,transparent)]" />

      <div className="w-full max-w-sm">
        <div className="mb-8 flex justify-center">
          <Link href="/">
            <Logo />
          </Link>
        </div>

        <div className="rounded-[var(--radius-lg)] border border-border-soft bg-surface p-8">
          <h1 className="text-xl font-semibold text-foreground">
            {isSignup ? "Create your account" : "Welcome back"}
          </h1>
          <p className="mt-1.5 text-sm text-muted">
            {isSignup
              ? "10 free minutes, no credit card required."
              : "Sign in to continue to your dashboard."}
          </p>

          <GoogleButton mode={mode} className="mt-6" />

          <div className="my-5 flex items-center gap-3">
            <div className="h-px flex-1 bg-border-soft" />
            <span className="text-xs text-muted-2">or</span>
            <div className="h-px flex-1 bg-border-soft" />
          </div>

          <form onSubmit={onSubmit} className="space-y-4">
            {isSignup && (
              <div>
                <label className="mb-1.5 block text-xs font-medium text-muted">
                  Name
                </label>
                <input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-lg border border-border-strong bg-surface-2 px-3.5 py-2.5 text-sm text-foreground outline-none focus:border-brand"
                  placeholder="Shashank Mishra"
                />
              </div>
            )}
            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted">
                Email
              </label>
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-border-strong bg-surface-2 px-3.5 py-2.5 text-sm text-foreground outline-none focus:border-brand"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted">
                Password
              </label>
              <input
                required
                type="password"
                minLength={isSignup ? 8 : undefined}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-border-strong bg-surface-2 px-3.5 py-2.5 text-sm text-foreground outline-none focus:border-brand"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <p className="rounded-lg border border-danger/30 bg-danger/10 px-3 py-2 text-sm text-danger">
                {error}
              </p>
            )}

            <Button type="submit" size="lg" className="w-full" disabled={loading}>
              {loading ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <>
                  {isSignup ? "Create account" : "Sign in"}
                  <ArrowRight className="size-4" />
                </>
              )}
            </Button>
          </form>
        </div>

        <p className="mt-6 text-center text-sm text-muted-2">
          {isSignup ? (
            <>
              Already have an account?{" "}
              <Link href="/login" className="text-foreground hover:underline">
                Sign in
              </Link>
            </>
          ) : (
            <>
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="text-foreground hover:underline">
                Sign up
              </Link>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
