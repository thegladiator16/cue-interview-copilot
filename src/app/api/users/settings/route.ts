import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  return NextResponse.json({
    name: user.name,
    email: user.email,
    avatarUrl: user.avatarUrl,
    defaultFormat: user.defaultFormat,
    defaultTone: user.defaultTone,
    defaultLength: user.defaultLength,
    autoAnswer: user.autoAnswer,
    emailNotifications: user.emailNotifications,
    autoDeleteAfterDays: user.autoDeleteAfterDays,
    plan: user.plan,
  });
}

const updateSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  defaultFormat: z.enum(["paragraph", "star", "bullet"]).optional(),
  defaultTone: z.enum(["professional", "conversational", "direct"]).optional(),
  defaultLength: z.enum(["brief", "balanced", "thorough"]).optional(),
  autoAnswer: z.boolean().optional(),
  emailNotifications: z.boolean().optional(),
  autoDeleteAfterDays: z.number().int().min(0).max(365).optional(),
});

export async function PUT(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const updated = await prisma.user.update({
    where: { id: user.id },
    data: parsed.data,
    select: {
      name: true,
      email: true,
      defaultFormat: true,
      defaultTone: true,
      defaultLength: true,
      autoAnswer: true,
      emailNotifications: true,
      autoDeleteAfterDays: true,
    },
  });

  return NextResponse.json(updated);
}
