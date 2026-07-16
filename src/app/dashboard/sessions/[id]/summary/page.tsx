import { notFound, redirect } from "next/navigation"
import Link from "next/link"
import { getCurrentUser } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { getAnthropicClient, ANSWER_MODEL } from "@/lib/anthropic"
import { BarChart2, MessageSquare, Lightbulb, ArrowRight, Clock } from "lucide-react"

export default async function SessionSummaryPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser()
  if (!user) redirect("/login")

  const { id } = await params
  const session = await prisma.callSession.findUnique({
    where: { id },
    include: { messages: { orderBy: { createdAt: "asc" } } },
  })

  if (!session || session.userId !== user.id) notFound()
  if (session.status !== "ended") {
    return (
      <div className="mx-auto max-w-3xl px-8 py-20 text-center">
        <p className="text-foreground font-medium mb-2">Session still active</p>
        <p className="text-muted text-sm mb-4">End the session first to view the summary.</p>
        <Link href={"/dashboard/sessions/" + id} className="text-brand-2 hover:underline text-sm">Back to session →</Link>
      </div>
    )
  }

  const questions = session.messages.filter(m => m.role === "question")
  const answers = session.messages.filter(m => m.role === "answer")
  const durationMin = Math.ceil((session.secondsUsed || 0) / 60)

  // Generate AI summary if anthropic is available
  let summary: { overview: string; topicsDiscussed: string[]; insights: string[]; suggestions: string[] } = {
    overview: "Session completed.",
    topicsDiscussed: [],
    insights: [],
    suggestions: [],
  }

  const anthropic = getAnthropicClient()
  if (anthropic && session.messages.length > 0) {
    try {
      const transcript = session.messages
        .map(m => (m.role === "question" ? "Q: " : "A: ") + m.content)
        .join("\n\n")

      const response = await anthropic.messages.create({
        model: ANSWER_MODEL,
        max_tokens: 500,
        system: "You are an interview coach analyzing a completed interview transcript. Return ONLY a JSON object with: overview (string), topicsDiscussed (array of strings), insights (array of 2-3 strength observations), suggestions (array of 2-3 specific improvement suggestions). No other text.",
        messages: [{ role: "user", content: "Analyze this interview transcript:\n\n" + transcript.slice(0, 4000) }],
      })
      const text = response.content[0].type === "text" ? response.content[0].text : ""
      const jsonMatch = text.match(/\{[\s\S]*\}/)
      if (jsonMatch) summary = { ...summary, ...JSON.parse(jsonMatch[0]) }
    } catch {
      // use default summary
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-8 py-10">
      <div className="flex items-center gap-3 mb-8">
        <Link href="/dashboard/sessions" className="text-sm text-muted-2 hover:text-foreground">← Sessions</Link>
        <span className="text-muted-2">/</span>
        <span className="text-sm text-foreground">Summary</span>
      </div>

      {/* Session header */}
      <div className="rounded-[var(--radius-lg)] border border-border-soft bg-surface p-6 mb-6">
        <h1 className="text-xl font-semibold text-foreground mb-2">
          {[session.role, session.company].filter(Boolean).join(" · ") || "Interview Session"}
        </h1>
        <div className="flex items-center gap-6 text-sm text-muted-2">
          <span className="flex items-center gap-1.5"><Clock className="size-3.5" /> {durationMin} min</span>
          <span className="flex items-center gap-1.5"><MessageSquare className="size-3.5" /> {questions.length} questions</span>
        </div>
      </div>

      {/* AI Overview */}
      {summary.overview && (
        <div className="rounded-[var(--radius-lg)] border border-brand/20 bg-brand/5 p-6 mb-6">
          <p className="text-xs font-medium uppercase tracking-wide text-brand-2 mb-2 flex items-center gap-1.5">
            <BarChart2 className="size-3.5" /> AI Overview
          </p>
          <p className="text-sm text-foreground leading-relaxed">{summary.overview}</p>
        </div>
      )}

      {/* Stats grid */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          ["Questions asked", questions.length],
          ["Duration", durationMin + " min"],
          ["Topics covered", summary.topicsDiscussed.length || "—"],
        ].map(([label, val]) => (
          <div key={String(label)} className="rounded-[var(--radius-md)] border border-border-soft bg-surface p-4 text-center">
            <p className="text-xl font-semibold text-foreground">{val}</p>
            <p className="text-xs text-muted-2 mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Topics */}
      {summary.topicsDiscussed.length > 0 && (
        <div className="rounded-[var(--radius-lg)] border border-border-soft bg-surface p-6 mb-6">
          <p className="text-sm font-medium text-foreground mb-3">Topics discussed</p>
          <div className="flex flex-wrap gap-2">
            {summary.topicsDiscussed.map((t: string) => (
              <span key={t} className="text-xs px-3 py-1 rounded-full bg-surface-2 text-foreground">{t}</span>
            ))}
          </div>
        </div>
      )}

      {/* Insights */}
      {summary.insights.length > 0 && (
        <div className="rounded-[var(--radius-lg)] border border-green-500/20 bg-green-500/5 p-6 mb-6">
          <p className="text-xs font-medium text-green-600 mb-3 uppercase tracking-wide">Strengths</p>
          <ul className="space-y-2">
            {summary.insights.map((i: string) => (
              <li key={i} className="text-sm text-foreground flex gap-2"><span className="text-green-600">✓</span> {i}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Suggestions */}
      {summary.suggestions.length > 0 && (
        <div className="rounded-[var(--radius-lg)] border border-yellow-500/20 bg-yellow-500/5 p-6 mb-6">
          <p className="text-xs font-medium text-amber-600 mb-3 uppercase tracking-wide flex items-center gap-1.5"><Lightbulb className="size-3.5" /> Areas to improve</p>
          <ul className="space-y-2">
            {summary.suggestions.map((s: string) => (
              <li key={s} className="text-sm text-foreground flex gap-2"><span className="text-amber-600">→</span> {s}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Transcript */}
      <div className="rounded-[var(--radius-lg)] border border-border-soft bg-surface p-6 mb-8">
        <p className="text-sm font-medium text-foreground mb-4">Full transcript</p>
        <div className="space-y-4">
          {questions.map((q, i) => {
            const a = answers[i]
            return (
              <div key={q.id}>
                <p className="text-xs font-medium text-muted-2 mb-1">Q{i + 1}</p>
                <p className="text-sm text-foreground bg-surface-2 rounded-lg p-3 mb-2">{q.content}</p>
                {a && <p className="text-sm text-muted leading-relaxed pl-3 border-l-2 border-brand/30">{a.content.slice(0, 200)}{a.content.length > 200 ? "…" : ""}</p>}
              </div>
            )
          })}
          {questions.length === 0 && <p className="text-sm text-muted-2">No questions were recorded in this session.</p>}
        </div>
      </div>

      {/* CTA */}
      <Link href="/dashboard/practice" className="inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground">
        Practice similar questions <ArrowRight className="size-4" />
      </Link>
    </div>
  )
}
