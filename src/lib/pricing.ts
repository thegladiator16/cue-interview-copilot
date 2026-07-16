export const SUBSCRIPTION_PLANS = [
  {
    id: "monthly",
    label: "Monthly",
    usd: 39,
    inr: 3237,
    per: "per month",
    best: false,
    save: null as string | null,
  },
  {
    id: "yearly",
    label: "Yearly",
    usd: 290,
    inr: 24067,
    per: "per year",
    best: true,
    save: "Save 38%" as string | null,
  },
] as const;

export const CREDIT_PACKS = [
  { id: "starter", label: "Starter", minutes: 100, usd: 19, inr: 1577, best: false },
  { id: "pro", label: "Pro", minutes: 500, usd: 69, inr: 5727, best: true },
  { id: "team", label: "Power", minutes: 1500, usd: 179, inr: 14857, best: false },
] as const;

export type SubscriptionPlanId = (typeof SUBSCRIPTION_PLANS)[number]["id"];
export type CreditPackId = (typeof CREDIT_PACKS)[number]["id"];
