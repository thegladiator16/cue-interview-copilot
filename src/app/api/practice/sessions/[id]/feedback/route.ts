import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { getCurrentUser } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { getAnthropicClient, ANSWER_MODEL } from "@/lib/anthropic"

const schema = z.object({ userAnswer: z.string().min(1) })

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params
  const session = await prisma.practiceSession.findUnique({ where: { id } })
  if (!session || session.userId !== user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  const body = await req.json().catch(() => null)
  const parsed = schema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 })

  const { userAnswer } = parsed.data

  const anthropic = getAnthropicClient()
  if (!anthropic) {
    return NextResponse.json({ error: "AI not configured. Add ANTHROPIC_API_KEY." }, { status: 501 })
  }

  const response = await anthropic.messages.create({
    model: ANSWER_MODEL,
    max_tokens: 800,
    system: "You are an expert interview coach evaluating a candidate's practice answer. Start your response with 'Score: X/10' on the first line. Then provide: specific feedback on what was done well, what could be improved, and a STAR-format version of an ideal answer. Be specific and constructive.",
    messages: [{ role: "user", content: "Question: " + session.questionText + "\n\nCandidate's answer: " + userAnswer }],
  })

  const feedbackText = response.content[0].type === "text" ? response.content[0].text : ""
  const scoreMatch = feedbackText.match(/score[:\s]+([0-9]+)/i)
  const aiScore = scoreMatch ? Math.min(10, Math.max(1, parseInt(scoreMatch[1]))) : null

  const updated = await prisma.practiceSession.update({
    where: { id },
    data: { userAnswer, aiFeedback: feedbackText, aiScore },
  })

  return NextResponse.json({ feedback: feedbackText, score: aiScore, message: updated })
}
