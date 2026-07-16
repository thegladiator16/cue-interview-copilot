"use client";

import { useState } from "react";
import { Check, Zap, RefreshCw, Coins } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { SUBSCRIPTION_PLANS, CREDIT_PACKS } from "@/lib/pricing";

const subscriptionPlans = SUBSCRIPTION_PLANS;
const creditPacks = CREDIT_PACKS;

export function Pricing() {
  const [mode, setMode] = useState<"subscription" | "credits">("subscription");
  const [billing, setBilling] = useState<"monthly" | "annual">("annual");

  return (
    <section id="pricing" className="py-24">
      <Container>
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <Badge className="mb-4">Pricing</Badge>
          <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Simple pricing, no surprise fees
          </h2>
          <p className="mt-4 text-muted">
            Go unlimited with a subscription, or pay once for a block of
            minutes. Cancel or stop anytime — nothing auto-renews without a
            reminder.
          </p>
        </div>

        <div className="mx-auto mb-12 flex w-fit gap-1 rounded-full border border-border-strong bg-surface p-1">
          <button
            onClick={() => setMode("subscription")}
            className={cn(
              "flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-colors",
              mode === "subscription"
                ? "bg-accent text-accent-foreground"
                : "text-muted hover:text-foreground"
            )}
          >
            <RefreshCw className="size-3.5" /> Subscription
          </button>
          <button
            onClick={() => setMode("credits")}
            className={cn(
              "flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-colors",
              mode === "credits"
                ? "bg-accent text-accent-foreground"
                : "text-muted hover:text-foreground"
            )}
          >
            <Coins className="size-3.5" /> Credits only
          </button>
        </div>

        {mode === "subscription" ? (
          <>
            {/* Billing period toggle */}
            <div className="mx-auto mb-8 flex w-fit items-center gap-1 rounded-full border border-border-strong bg-surface p-1">
              <button
                onClick={() => setBilling("monthly")}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-medium transition-colors",
                  billing === "monthly"
                    ? "bg-surface-3 text-foreground"
                    : "text-muted hover:text-foreground"
                )}
              >
                Monthly
              </button>
              <button
                onClick={() => setBilling("annual")}
                className={cn(
                  "flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors",
                  billing === "annual"
                    ? "bg-surface-3 text-foreground"
                    : "text-muted hover:text-foreground"
                )}
              >
                Annual
                <span className="rounded-full bg-accent px-2 py-0.5 text-xs font-semibold text-accent-foreground">
                  Save 38%
                </span>
              </button>
            </div>

            <div className="mx-auto max-w-sm">
              {billing === "annual" ? (
                // Annual plan card
                <div className="relative rounded-[var(--radius-lg)] border border-brand/40 bg-gradient-to-b from-brand/10 to-transparent p-8">
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">
                    Best deal
                  </span>
                  <p className="text-sm font-medium text-brand-2">Annual plan</p>
                  <div className="mt-3 flex items-end gap-2">
                    <span className="text-4xl font-semibold tabular-nums tracking-tight text-foreground">
                      $24
                    </span>
                    <span className="mb-1 text-sm text-muted-2">/ month</span>
                    <Badge className="mb-1.5 !border-accent/40 !text-accent">Save 38%</Badge>
                  </div>
                  <p className="mt-1 text-sm text-muted-2">
                    $290 billed annually · ₹24,067/yr
                  </p>
                  <ul className="mt-6 space-y-2.5">
                    {[
                      "Unlimited call minutes",
                      "Resume + document context",
                      "All AI models",
                      "Practice interview suite",
                      "Session summaries & analytics",
                      "Cancel anytime",
                    ].map((f) => (
                      <li key={f} className="flex items-center gap-2.5 text-sm text-foreground/85">
                        <Check className="size-4 shrink-0 text-brand-2" /> {f}
                      </li>
                    ))}
                  </ul>
                  <ButtonLink href="/signup?plan=yearly" size="lg" variant="primary" className="mt-8 w-full">
                    Get annual plan
                  </ButtonLink>
                </div>
              ) : (
                // Monthly plan card
                <div className="rounded-[var(--radius-lg)] border border-border-soft bg-surface p-8">
                  <p className="text-sm font-medium text-brand-2">Monthly plan</p>
                  <div className="mt-3 flex items-end gap-2">
                    <span className="text-4xl font-semibold tabular-nums tracking-tight text-foreground">
                      $39
                    </span>
                    <span className="mb-1 text-sm text-muted-2">/ month</span>
                  </div>
                  <p className="mt-1 text-sm text-muted-2">₹3,237/month · cancel anytime</p>
                  <ul className="mt-6 space-y-2.5">
                    {[
                      "Unlimited call minutes",
                      "Resume + document context",
                      "All AI models",
                      "Practice interview suite",
                      "Session summaries & analytics",
                    ].map((f) => (
                      <li key={f} className="flex items-center gap-2.5 text-sm text-foreground/85">
                        <Check className="size-4 shrink-0 text-brand-2" /> {f}
                      </li>
                    ))}
                  </ul>
                  <ButtonLink href="/signup?plan=monthly" size="lg" variant="secondary" className="mt-8 w-full">
                    Subscribe monthly
                  </ButtonLink>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="mx-auto grid max-w-5xl gap-5 sm:grid-cols-3">
            {creditPacks.map((pack) => (
              <div
                key={pack.id}
                className={cn(
                  "relative rounded-[var(--radius-lg)] border p-8",
                  pack.best
                    ? "border-brand/40 bg-gradient-to-b from-brand/10 to-transparent"
                    : "border-border-soft bg-surface"
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
                  <span className="text-2xl font-semibold text-foreground">
                    {pack.minutes} min
                  </span>
                </div>
                <p className="mt-3 text-3xl font-semibold text-foreground">
                  ${pack.usd}
                </p>
                <p className="mt-1 text-sm text-muted-2">
                  ₹{pack.inr.toLocaleString("en-IN")} · one-time
                </p>
                <ButtonLink
                  href={`/signup?pack=${pack.id}`}
                  size="lg"
                  variant={pack.best ? "primary" : "secondary"}
                  className="mt-8 w-full"
                >
                  Buy credits
                </ButtonLink>
              </div>
            ))}
          </div>
        )}

        <p className="mt-8 text-center text-sm text-muted-2">
          Free plan includes a 10-minute session, no card needed.
        </p>
      </Container>
    </section>
  );
}
