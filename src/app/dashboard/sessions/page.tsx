import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { SessionsList } from "@/components/dashboard/SessionsList";

export default async function SessionsPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const sessions = await prisma.callSession.findMany({
    where: { userId: user.id },
    orderBy: { startedAt: "desc" },
  });

  return (
    <SessionsList
      sessions={sessions.map((s) => ({
        id: s.id,
        type: s.type,
        company: s.company,
        role: s.role,
        status: s.status,
        startedAt: s.startedAt.toISOString(),
        secondsUsed: s.secondsUsed,
      }))}
    />
  );
}
