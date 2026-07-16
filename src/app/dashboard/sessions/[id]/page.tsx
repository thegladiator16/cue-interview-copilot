import { notFound } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { CallSessionRoom } from "@/components/dashboard/CallSessionRoom";

export default async function SessionRoomPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) return null;

  const { id } = await params;
  const session = await prisma.callSession.findUnique({
    where: { id },
    include: { messages: { orderBy: { createdAt: "asc" } } },
  });

  if (!session || session.userId !== user.id) notFound();

  const isUnlimited = user.plan === "monthly" || user.plan === "yearly";
  const allowedSeconds = isUnlimited
    ? 4 * 60 * 60
    : session.secondsUsed + user.freeSecondsLeft + user.creditSeconds;

  return (
    <CallSessionRoom
      sessionId={session.id}
      company={session.company}
      role={session.role}
      initialMessages={session.messages.map((m) => ({
        id: m.id,
        role: m.role as "question" | "answer",
        content: m.content,
      }))}
      initialSecondsUsed={session.secondsUsed}
      allowedSeconds={allowedSeconds}
      isUnlimited={isUnlimited}
      alreadyEnded={session.status === "ended"}
    />
  );
}
