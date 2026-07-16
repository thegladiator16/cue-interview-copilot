import { NextRequest, NextResponse } from "next/server";
import { getStripeClient } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const stripe = getStripeClient();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!stripe || !webhookSecret) {
    return NextResponse.json({ error: "Webhook not configured." }, { status: 501 });
  }

  const signature = req.headers.get("stripe-signature");
  const rawBody = await req.text();

  let event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature ?? "", webhookSecret);
  } catch {
    return NextResponse.json({ error: "Invalid signature." }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const userId = session.metadata?.userId;
    if (userId) {
      if (session.metadata?.kind === "subscription") {
        const planId = session.metadata.planId === "yearly" ? "yearly" : "monthly";
        await prisma.user.update({ where: { id: userId }, data: { plan: planId } });
      } else if (session.metadata?.kind === "credits") {
        const minutes = Number(session.metadata.minutes ?? 0);
        const seconds = minutes * 60;
        await prisma.$transaction([
          prisma.user.update({
            where: { id: userId },
            data: { creditSeconds: { increment: seconds } },
          }),
          prisma.creditTransaction.create({
            data: {
              userId,
              type: "purchase",
              seconds,
              note: `Stripe checkout ${session.id}`,
            },
          }),
        ]);
      }
    }
  }

  return NextResponse.json({ received: true });
}
