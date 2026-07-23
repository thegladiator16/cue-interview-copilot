import { notFound } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { MobileSessionView } from "@/components/dashboard/MobileSessionView"

export default async function MobileSessionPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const user = await getCurrentUser()
  if (!user) return null

  const { id } = await params
  const session = await prisma.callSession.findUnique({
    where: { id },
    include: { messages: { orderBy: { createdAt: "asc" } } },
  })

  if (!session || session.userId !== user.id) notFound()

  const isUnlimited = true
  const allowedSeconds = 4 * 60 * 60

  return (
    <MobileSessionView
      sessionId={session.id}
      company={session.company}
      role={session.role}
      initialMessages={session.messages.map(m => ({
        id: m.id,
        role: m.role as "question" | "answer",
        content: m.content,
      }))}
      initialSecondsUsed={session.secondsUsed}
      allowedSeconds={allowedSeconds}
      isUnlimited={isUnlimited}
      alreadyEnded={session.status === "ended"}
    />
  )
}
