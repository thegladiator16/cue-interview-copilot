import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  type: z.enum(["interview", "call"]),
  company: z.string().max(200).optional(),
  role: z.string().max(200).optional(),
  resumeId: z.string().optional().nullable(),
  extraContext: z.string().max(4000).optional(),
});

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const sessions = await prisma.callSession.findMany({
    where: { userId: user.id },
    orderBy: { startedAt: "desc" },
  });

  return NextResponse.json({ sessions });
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 }
    );
  }

  const isUnlimited = true;

  const { type, company, role, resumeId, extraContext } = parsed.data;

  if (resumeId) {
    const resume = await prisma.resume.findUnique({ where: { id: resumeId } });
    if (!resume || resume.userId !== user.id) {
      return NextResponse.json({ error: "Resume not found." }, { status: 400 });
    }
  }

  const session = await prisma.callSession.create({
    data: {
      userId: user.id,
      type,
      company,
      role,
      resumeId: resumeId || null,
      extraContext,
      isFree: !isUnlimited && user.freeSecondsLeft > 0,
    },
  });

  return NextResponse.json({ session });
}
