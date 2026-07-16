"use client"

import { useState, useEffect, useRef } from "react"
import { useParams } from "next/navigation"
import { questions, getQuestionsByCategory } from "@/data/questions"
import { ArrowRight, CheckCircle, RefreshCw, Mic, MicOff } from "lucide-react"
import Link from "next/link"

export default function PracticeSessionPage() {
  const params = useParams()
  const category = params.category as string
  const pool = getQuestionsByCategory(category)

  const [currentIdx, setCurrentIdx] = useState(() => Math.floor(Math.random() * pool.length))
  const [userAnswer, setUserAnswer] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [feedback, setFeedback] = useState<{ feedback: string; score: number | null } | null>(null)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [elapsed, setElapsed] = useState(0)
  const [timing, setTiming] = useState(false)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const currentQ = pool[currentIdx]

  useEffect(() => {
    if (timing) {
      timerRef.current = setInterval(() => setElapsed(e => e + 1), 1000)
    } else {
      if (timerRef.current) clearInterval(timerRef.current)
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [timing])

  function startTimer() { setTiming(true) }

  async function submitAnswer() {
    if (!userAnswer.trim()) return
    setSubmitting(true)
    setTiming(false)
    try {
      let sid = sessionId
      if (!sid) {
        const createRes = await fetch("/api/practice/sessions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ category, questionText: currentQ.text, company: currentQ.company }),
        })
        const createData = await createRes.json()
        sid = createData.session?.id
        setSessionId(sid)
      }
      if (sid) {
        const res = await fetch("/api/practice/sessions/" + sid + "/feedback", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userAnswer }),
        })
        const data = await res.json()
        setFeedback({ feedback: data.feedback, score: data.score })
      }
    } catch {
      setFeedback({ feedback: "Could not get feedback. Check your AI API key.", score: null })
    } finally {
      setSubmitting(false)
    }
  }

  function nextQuestion() {
    setCurrentIdx(Math.floor(Math.random() * pool.length))
    setUserAnswer("")
    setFeedback(null)
    setSessionId(null)
    setElapsed(0)
    setTiming(false)
  }

  const mins = Math.floor(elapsed / 60)
  const secs = elapsed % 60

  const categoryLabel = category.charAt(0).toUpperCase() + category.slice(1).replace("-", " ")

  return (
    <div className="mx-auto max-w-3xl px-8 py-10">
      <div className="flex items-center gap-3 mb-8">
        <Link href="/dashboard/practice" className="text-sm text-muted-2 hover:text-foreground">← Practice</Link>
        <span className="text-muted-2">/</span>
        <span className="text-sm text-foreground font-medium">{categoryLabel}</span>
      </div>

      {/* Question */}
      <div className="rounded-[var(--radius-lg)] border border-border-soft bg-surface p-8 mb-6">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-medium uppercase tracking-wide text-brand-2">{categoryLabel}</span>
          {currentQ && currentQ.company && <span className="text-xs text-muted-2 capitalize">{currentQ.company}</span>}
        </div>
        {currentQ && <p className="text-lg font-medium text-foreground leading-relaxed">{currentQ.text}</p>}
        {!timing && !feedback && (
          <button onClick={startTimer} className="mt-4 text-sm text-brand-2 hover:underline">
            Start timer when ready →
          </button>
        )}
        {timing && (
          <p className="mt-4 text-sm text-muted-2">
            {String(mins).padStart(2, "0")}:{String(secs).padStart(2, "0")} — take your time
          </p>
        )}
      </div>

      {/* Answer area */}
      {!feedback && (
        <div className="mb-6">
          <textarea
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            onFocus={startTimer}
            placeholder="Type your answer here. Try to use the STAR format: Situation → Task → Action → Result."
            rows={8}
            className="w-full rounded-[var(--radius-lg)] border border-border-strong bg-surface px-5 py-4 text-sm text-foreground leading-relaxed outline-none focus:border-brand resize-none placeholder:text-muted-2"
          />
          <div className="flex justify-end mt-3">
            <button
              onClick={submitAnswer}
              disabled={!userAnswer.trim() || submitting}
              className="inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground disabled:opacity-40"
            >
              {submitting ? "Getting feedback…" : "Submit for feedback"}
              <ArrowRight className="size-4" />
            </button>
          </div>
        </div>
      )}

      {/* Feedback */}
      {feedback && (
        <div className="space-y-4">
          <div className="flex items-center gap-4 rounded-[var(--radius-lg)] border border-border-soft bg-surface p-5">
            <CheckCircle className="size-6 text-brand-2 shrink-0" />
            <div>
              <p className="text-sm font-medium text-foreground">Answer submitted</p>
              {feedback.score !== null && (
                <p className={"text-xs mt-1 font-semibold " + (feedback.score >= 8 ? "text-green-600" : feedback.score >= 6 ? "text-amber-600" : "text-red-600")}>
                  Score: {feedback.score}/10
                </p>
              )}
            </div>
          </div>

          <div className="rounded-[var(--radius-lg)] border border-border-soft bg-surface p-6">
            <p className="text-xs font-medium uppercase tracking-wide text-brand-2 mb-3">AI Feedback</p>
            <div className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">{feedback.feedback}</div>
          </div>

          <button
            onClick={nextQuestion}
            className="inline-flex items-center gap-2 rounded-lg border border-border-soft bg-surface px-5 py-2.5 text-sm font-medium text-foreground hover:bg-surface-2"
          >
            <RefreshCw className="size-4" /> Next question
          </button>
        </div>
      )}

      {pool.length === 0 && (
        <div className="text-center py-20 text-muted">
          No questions found for this category. <Link href="/dashboard/practice" className="text-brand-2 hover:underline">Go back</Link>
        </div>
      )}
    </div>
  )
}
