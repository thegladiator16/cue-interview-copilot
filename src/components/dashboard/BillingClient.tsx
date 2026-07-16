"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Check, Zap, RefreshCw, Coins, Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/cn";
import { SUBSCRIPTION_PLANS, CREDIT_PACKS, type SubscriptionPlanId, type CreditPackId } from "@/lib/pricing";

export function BillingClient({
  plan,
  minutesLeft,
}: {
  plan: string;
  minutesLeft: number;
}) {
  const searchParams = useSearchParams();
  const status = searchParams.get("status");

  const [mode, setMode] = useState<"subscription" | "credits">("subscription");
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function checkout(kind: "subscription" | "credits", id: SubscriptionPlanId | CreditPackId) {
    setLoadingId(id);
    setError(null);
    try {
      const res = await fetch("/api/billing/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          kind === "subscription" ? { kind, planId: id } : { kind, packId: id }
        ),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Couldn't start checkout.");
        setLoadingId(null);
        return;
      }
      window.location.assign(data.url);
    } catch {
      setError("Network error. Please try again.");
      setLoadingId(null);
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-8 py-10">
      <h1 className="text-2xl font-semibold text-foreground">Billing</h1>
      <p className="mt-1 text-muted">
        {plan === "free" ? "Free plan" : `${plan} plan`} · {minutesLeft} minutes available
      </p>

      {status === "success" && (
        <div className="mt-6 flex items-center gap-2 rounded-lg border border-brand/30 bg-brand/10 px-4 py-3 text-sm text-brand-2">
          <CheckCircle2 className="size-4" /> Payment successful — your balance will update shortly.
        </div>
      )}
      {status === "cancelled" && (
        <div className="mt-6 rounded-lg border border-border-strong bg-surface-2 px-4 py-3 text-sm text-muted">
          Checkout cancelled — no charge was made.
        </div>
      )}
      {error && (
        <div className="mt-6 rounded-lg border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
          {error}
        </div>
      )}

      <div className="mt-8 mb-8 flex w-fit gap-1 rounded-full border border-border-strong bg-surface p-1">
        <button
          onClick={() => setMode("subscription")}
          className={cn(
            "flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-colors",
            mode === "subscription" ? "bg-accent text-accent-foreground" : "text-muted"
          )}
        >
          <RefreshCw className="size-3.5" /> Subscription
        </button>
        <button
          onClick={() => setMode("credits")}
          className={cn(
            "flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-colors",
            mode === "credits" ? "bg-accent text-accent-foreground" : "text-muted"
          )}
        >
          <Coins className="size-3.5" /> Credits only
        </button>
      </div>

      {mode === "subscription" ? (
        <div className="grid gap-5 sm:grid-cols-2">
          {SUBSCRIPTION_PLANS.map((p) => (
            <div
              key={p.id}
              className={cn(
                "relative rounded-[var(--radius-lg)] border p-8",
                p.best ? "border-brand/40 bg-gradient-to-b from-brand/10 to-transparent" : "border-border-soft bg-surface"
              )}
            >
              {p.best && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">
                  Best deal
                </span>
              )}
              <p className="text-sm font-medium text-brand-2">{p.label}</p>
              <div className="mt-3 flex items-end gap-2">
                <span className="text-4xl font-semibold tracking-tight text-foreground">${p.usd}</span>
                {p.save && <Badge className="mb-1.5 !border-accent/40 !text-accent">{p.save}</Badge>}
              </div>
              <p className="mt-1 text-sm text-muted-2">₹{p.inr.toLocaleString("en-IN")} · {p.per}</p>
              <ul className="mt-6 space-y-2.5">
                {["Unlimited call minutes", "Resume + document context", "All AI models", "Cancel anytime"].map((f) => (
                  <li key={f} className="flex items-center gap-2.5 text-sm text-foreground/85">
                    <Check className="size-4 text-brand-2" /> {f}
                  </li>
                ))}
              </ul>
              <Button
                size="lg"
                variant={p.best ? "primary" : "secondary"}
                className="mt-8 w-full"
                disabled={loadingId === p.id}
                onClick={() => checkout("subscription", p.id)}
              >
                {loadingId === p.id ? <Loader2 className="size-4 animate-spin" /> : "Subscribe"}
              </Button>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-3">
          {CREDIT_PACKS.map((pack) => (
            <div
              key={pack.id}
              className={cn(
                "relative rounded-[var(--radius-lg)] border p-8",
                pack.best ? "border-brand/40 bg-gradient-to-b from-brand/10 to-transparent" : "border-border-soft bg-surface"
              )}
            >
              {pack.best && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">
                  Most popular
                </span>
              )}
              <p className="text-sm font-medium text-brand-2">{pack.label}</p>
              <div className="mt-3 flex items-center gap-2">
                <Zap className="size-5 text-accent" />
                <span className="text-2xl font-semibold text-foreground">{pack.minutes} min</span>
              </div>
              <p className="mt-3 text-3xl font-semibold text-foreground">${pack.usd}</p>
              <p className="mt-1 text-sm text-muted-2">₹{pack.inr.toLocaleString("en-IN")} · one-time</p>
              <Button
                size="lg"
                variant={pack.best ? "primary" : "secondary"}
                className="mt-8 w-full"
                disabled={loadingId === pack.id}
                onClick={() => checkout("credits", pack.id)}
              >
                {loadingId === pack.id ? <Loader2 className="size-4 animate-spin" /> : "Buy credits"}
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
