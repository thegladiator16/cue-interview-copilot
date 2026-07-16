import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { getCurrentUser } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

const schema = z.object({
  category: z.string(),
  company: z.string().optional(),
  questionText: z.string().min(1),
})

export async function GET() {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const sessions = await prisma.practiceSession.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: 20,
  })

  return NextResponse.json({ sessions })
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const body = await req.json().catch(() => null)
  const parsed = schema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 })

  const { category, company, questionText } = parsed.data

  const session = await prisma.practiceSession.create({
    data: {
      userId: user.id,
      category,
      company,
      questionText,
    },
  })

  return NextResponse.json({ session }, { status: 201 })
}
