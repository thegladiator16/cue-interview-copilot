import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const session = await prisma.callSession.findUnique({
    where: { id },
    include: { messages: { orderBy: { createdAt: "asc" } }, resume: true },
  });

  if (!session || session.userId !== user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ session });
}

const patchSchema = z.object({
  secondsUsed: z.number().int().min(0).max(60 * 60 * 6),
  status: z.enum(["active", "ended"]).optional(),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const session = await prisma.callSession.findUnique({ where: { id } });
  if (!session || session.userId !== user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  if (session.status === "ended") {
    return NextResponse.json({ session });
  }

  const body = await req.json().catch(() => null);
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const { secondsUsed, status } = parsed.data;
  const ending = status === "ended";

  // secondsUsed is the session's cumulative elapsed time; only the delta
  // since the last save should be newly deducted from the user's balance.
  const deltaSeconds = Math.max(0, secondsUsed - session.secondsUsed);

  const updatedSession = await prisma.callSession.update({
    where: { id },
    data: {
      secondsUsed,
      status: ending ? "ended" : session.status,
      endedAt: ending ? new Date() : session.endedAt,
    },
  });

  return NextResponse.json({ session: updatedSession });
}
