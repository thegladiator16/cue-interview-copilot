import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function generateCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "CUE-";
  for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let referralCode = user.referralCode;
  if (!referralCode) {
    referralCode = generateCode();
    await prisma.user.update({
      where: { id: user.id },
      data: { referralCode },
    });
  }

  const referrals = await prisma.referral.findMany({
    where: { referrerId: user.id },
    include: { referred: { select: { name: true, email: true, createdAt: true } } },
    orderBy: { createdAt: "desc" },
  });

  const totalCreditsEarned = referrals.reduce((sum, r) => sum + r.creditsGiven, 0);

  return NextResponse.json({
    referralCode,
    referrals,
    stats: {
      totalReferred: referrals.length,
      totalCreditsEarned,
    },
  });
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const code = body?.code?.trim();
  if (!code) return NextResponse.json({ error: "Referral code is required" }, { status: 400 });

  if (user.referredBy) {
    return NextResponse.json({ error: "You've already used a referral code" }, { status: 400 });
  }

  const referrer = await prisma.user.findFirst({ where: { referralCode: code } });
  if (!referrer) return NextResponse.json({ error: "Invalid referral code" }, { status: 404 });
  if (referrer.id === user.id) {
    return NextResponse.json({ error: "You can't use your own referral code" }, { status: 400 });
  }

  const bonusSeconds = 5 * 60;

  await prisma.$transaction([
    prisma.user.update({
      where: { id: user.id },
      data: {
        referredBy: code,
        creditSeconds: { increment: bonusSeconds },
      },
    }),
    prisma.user.update({
      where: { id: referrer.id },
      data: { creditSeconds: { increment: bonusSeconds * 2 } },
    }),
    prisma.referral.create({
      data: {
        referrerId: referrer.id,
        referredId: user.id,
        code,
        creditsGiven: bonusSeconds * 2,
      },
    }),
    prisma.creditTransaction.create({
      data: { userId: user.id, type: "grant", seconds: bonusSeconds, note: `Referral bonus (code: ${code})` },
    }),
    prisma.creditTransaction.create({
      data: { userId: referrer.id, type: "grant", seconds: bonusSeconds * 2, note: `Referral reward (referred ${user.email})` },
    }),
  ]);

  return NextResponse.json({ success: true, minutesAdded: Math.floor(bonusSeconds / 60) });
}
