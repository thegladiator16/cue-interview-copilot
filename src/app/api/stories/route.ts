import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { getCurrentUser } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

const schema = z.object({
  title: z.string().min(1),
  situation: z.string().min(1),
  task: z.string().min(1),
  action: z.string().min(1),
  result: z.string().min(1),
  tags: z.array(z.string()).optional(),
})

export async function GET() {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const stories = await prisma.userStory.findMany({
    where: { userId: user.id },
    orderBy: { updatedAt: "desc" },
  })

  return NextResponse.json({ stories })
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const body = await req.json().catch(() => null)
  const parsed = schema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 })

  const { title, situation, task, action, result, tags } = parsed.data

  const story = await prisma.userStory.create({
    data: {
      userId: user.id,
      title,
      situation,
      task,
      action,
      result,
      tags: tags ?? [],
    },
  })

  return NextResponse.json({ story }, { status: 201 })
}
