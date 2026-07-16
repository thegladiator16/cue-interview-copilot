import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth";
import { getStripeClient } from "@/lib/stripe";
import { SUBSCRIPTION_PLANS, CREDIT_PACKS } from "@/lib/pricing";

const schema = z.discriminatedUnion("kind", [
  z.object({ kind: z.literal("subscription"), planId: z.enum(["monthly", "yearly"]) }),
  z.object({
    kind: z.literal("credits"),
    packId: z.enum(["starter", "pro", "team"]),
  }),
]);

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const stripe = getStripeClient();
  if (!stripe) {
    return NextResponse.json(
      {
        error:
          "Payments aren't configured yet. Add STRIPE_SECRET_KEY to .env to enable checkout.",
      },
      { status: 501 }
    );
  }

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const origin = req.nextUrl.origin;

  if (parsed.data.kind === "subscription") {
    const { planId } = parsed.data;
    const plan = SUBSCRIPTION_PLANS.find((p) => p.id === planId);
    if (!plan) return NextResponse.json({ error: "Unknown plan." }, { status: 400 });

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer_email: user.email,
      client_reference_id: user.id,
      line_items: [
        {
          price_data: {
            currency: "usd",
            unit_amount: plan.usd * 100,
            product_data: { name: `Cue — ${plan.label} subscription` },
            recurring: { interval: plan.id === "monthly" ? "month" : "year" },
          },
          quantity: 1,
        },
      ],
      metadata: { userId: user.id, kind: "subscription", planId: plan.id },
      success_url: `${origin}/dashboard/billing?status=success`,
      cancel_url: `${origin}/dashboard/billing?status=cancelled`,
    });

    return NextResponse.json({ url: session.url });
  }

  const { packId } = parsed.data;
  const pack = CREDIT_PACKS.find((p) => p.id === packId);
  if (!pack) return NextResponse.json({ error: "Unknown pack." }, { status: 400 });

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    customer_email: user.email,
    client_reference_id: user.id,
    line_items: [
      {
        price_data: {
          currency: "usd",
          unit_amount: pack.usd * 100,
          product_data: { name: `Cue — ${pack.label} pack (${pack.minutes} min)` },
        },
        quantity: 1,
      },
    ],
    metadata: { userId: user.id, kind: "credits", packId: pack.id, minutes: String(pack.minutes) },
    success_url: `${origin}/dashboard/billing?status=success`,
    cancel_url: `${origin}/dashboard/billing?status=cancelled`,
  });

  return NextResponse.json({ url: session.url });
}
