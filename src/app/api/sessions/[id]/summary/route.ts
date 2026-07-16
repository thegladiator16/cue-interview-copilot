import { NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { getAnthropicClient, ANSWER_MODEL } from "@/lib/anthropic"

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params
  const session = await prisma.callSession.findUnique({
    where: { id },
    include: { messages: { orderBy: { createdAt: "asc" } } },
  })
  if (!session || session.userId !== user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  if (session.status !== "ended") {
    return NextResponse.json({ error: "Session still active" }, { status: 400 })
  }

  if (session.messages.length === 0) {
    return NextResponse.json({
      summary: {
        overview: "No messages in this session.",
        topicsDiscussed: [],
        questionsCount: 0,
        insights: [],
        suggestions: [],
      },
    })
  }

  const anthropic = getAnthropicClient()
  if (!anthropic) {
    return NextResponse.json({
      summary: {
        overview: "This session has ended. AI analysis is unavailable without ANTHROPIC_API_KEY.",
        topicsDiscussed: [],
        questionsCount: session.messages.filter((m) => m.role === "question").length,
        insights: [],
        suggestions: ["Add ANTHROPIC_API_KEY to enable AI-powered session summaries."],
      },
    })
  }

  const transcript = session.messages
    .map((m) => `${m.role === "question" ? "Q" : "A"}: ${m.content}`)
    .join("\n\n")

  let summary
  try {
    const response = await anthropic.messages.create({
      model: ANSWER_MODEL,
      max_tokens: 800,
      system:
        'You are analyzing an interview transcript. Provide a JSON response with these fields: overview (string, 2-3 sentences), topicsDiscussed (array of strings), questionsCount (number), insights (array of insight strings), suggestions (array of improvement strings). Return ONLY valid JSON.',
      messages: [
        {
          role: "user",
          content: "Here is the interview transcript:\n\n" + transcript,
        },
      ],
    })

    const text = response.content[0].type === "text" ? response.content[0].text : "{}"
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    summary = jsonMatch ? JSON.parse(jsonMatch[0]) : JSON.parse(text)
  } catch {
    summary = {
      overview: "Session completed. AI analysis could not be parsed.",
      topicsDiscussed: [],
      questionsCount: session.messages.filter((m) => m.role === "question").length,
      insights: [],
      suggestions: [],
    }
  }

  return NextResponse.json({ summary })
}
