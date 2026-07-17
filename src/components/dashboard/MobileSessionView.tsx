"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { Sparkles, Send, Copy, Check, RefreshCw, PhoneOff } from "lucide-react"

type Message = { id: string; role: "question" | "answer"; content: string }

export function MobileSessionView({
  sessionId,
  company,
  role,
  initialMessages,
  initialSecondsUsed,
  allowedSeconds,
  isUnlimited,
  alreadyEnded,
}: {
  sessionId: string
  company: string | null
  role: string | null
  initialMessages: Message[]
  initialSecondsUsed: number
  allowedSeconds: number
  isUnlimited: boolean
  alreadyEnded: boolean
}) {
  const router = useRouter()
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [elapsed, setElapsed] = useState(initialSecondsUsed)
  const [manualInput, setManualInput] = useState("")
  const [streamingAnswer, setStreamingAnswer] = useState("")
  const [asking, setAsking] = useState(false)
  const [ended, setEnded] = useState(alreadyEnded)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const elapsedRef = useRef(initialSecondsUsed)
  const endingRef = useRef(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  const mins = Math.floor(Math.max(0, elapsed) / 60)
  const secs = Math.max(0, elapsed) % 60

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, streamingAnswer])

  useEffect(() => {
    if (ended) return
    const interval = setInterval(() => {
      elapsedRef.current += 1
      setElapsed(elapsedRef.current)
    }, 1000)
    return () => clearInterval(interval)
  }, [ended])

  const endSession = useCallback(async () => {
    if (endingRef.current) return
    endingRef.current = true
    setEnded(true)
    await fetch(`/api/sessions/${sessionId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ secondsUsed: elapsedRef.current, status: "ended" }),
    })
    router.refresh()
  }, [sessionId, router])

  const askQuestion = useCallback(async (question: string) => {
    const trimmed = question.trim()
    if (!trimmed || asking) return
    setAsking(true)
    setStreamingAnswer("")
    const tempId = `local-${Date.now()}`
    setMessages(prev => [...prev, { id: tempId, role: "question", content: trimmed }])

    try {
      const res = await fetch(`/api/sessions/${sessionId}/answer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: trimmed, format: "paragraph", tone: "professional", length: "balanced" }),
      })
      if (!res.ok || !res.body) {
        setAsking(false)
        return
      }
      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let full = ""
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        full += decoder.decode(value, { stream: true })
        setStreamingAnswer(full)
      }
      setMessages(prev => [...prev, { id: `${tempId}-a`, role: "answer", content: full }])
      setStreamingAnswer("")
    } catch {} finally {
      setAsking(false)
    }
  }, [sessionId, asking])

  function handleCopy(id: string, content: string) {
    navigator.clipboard.writeText(content)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (manualInput.trim()) {
      askQuestion(manualInput)
      setManualInput("")
    }
  }

  const answers = messages.filter(m => m.role === "answer")
  const latestAnswer = answers[answers.length - 1]

  return (
    <div className="flex h-screen flex-col bg-background">
      {/* Compact header */}
      <header className="flex shrink-0 items-center justify-between border-b border-border-soft px-4 py-3">
        <div>
          <p className="text-sm font-semibold text-foreground">
            {[role, company].filter(Boolean).join(" · ") || "Session"}
          </p>
          {!ended && (
            <p className="tabular-nums text-xs text-danger">
              {String(mins).padStart(2, "0")}:{String(secs).padStart(2, "0")}
            </p>
          )}
        </div>
        {!ended && (
          <button onClick={endSession}
            className="flex items-center gap-1.5 rounded-lg bg-danger/10 px-3 py-1.5 text-xs font-medium text-danger">
            <PhoneOff className="size-3" /> End
          </button>
        )}
      </header>

      {/* Main content — latest answer prominently displayed */}
      <div className="flex-1 overflow-y-auto p-4">
        {latestAnswer ? (
          <div className="mb-4">
            <p className="flex items-center gap-1.5 text-xs font-medium text-brand-2 mb-2">
              <Sparkles className="size-3" /> Latest answer
            </p>
            <div className="rounded-xl border border-brand/20 bg-brand/5 p-5">
              <p className="text-base leading-relaxed text-foreground whitespace-pre-wrap">
                {latestAnswer.content}
              </p>
              <div className="flex gap-2 mt-4">
                <button onClick={() => handleCopy(latestAnswer.id, latestAnswer.content)}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-surface-2 px-3 py-1.5 text-xs text-muted hover:text-foreground">
                  {copiedId === latestAnswer.id ? <Check className="size-3" /> : <Copy className="size-3" />}
                  {copiedId === latestAnswer.id ? "Copied" : "Copy"}
                </button>
                <button onClick={() => askQuestion(messages.filter(m => m.role === "question").pop()?.content || "")}
                  disabled={asking}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-surface-2 px-3 py-1.5 text-xs text-muted hover:text-foreground disabled:opacity-40">
                  <RefreshCw className="size-3" /> Regenerate
                </button>
              </div>
            </div>
          </div>
        ) : asking ? (
          <div className="rounded-xl border border-brand/20 bg-brand/5 p-5">
            <p className="text-base leading-relaxed text-foreground whitespace-pre-wrap">
              {streamingAnswer || "Thinking…"}
              <span className="stream-cursor" />
            </p>
          </div>
        ) : (
          <div className="flex h-48 items-center justify-center text-center">
            <div>
              <Sparkles className="mx-auto size-8 text-brand/20 mb-3" />
              <p className="text-sm text-muted-2">Type a question below to get started</p>
            </div>
          </div>
        )}

        {/* Previous answers (collapsed) */}
        {answers.length > 1 && (
          <details className="mt-4">
            <summary className="cursor-pointer text-xs text-muted-2 hover:text-foreground mb-2">
              {answers.length - 1} previous answer{answers.length > 2 ? "s" : ""}
            </summary>
            <div className="space-y-3">
              {answers.slice(0, -1).reverse().map(m => (
                <div key={m.id} className="rounded-lg bg-surface-2 p-3">
                  <p className="text-sm text-muted leading-relaxed">{m.content.slice(0, 200)}{m.content.length > 200 ? "…" : ""}</p>
                </div>
              ))}
            </div>
          </details>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      {!ended && (
        <div className="shrink-0 border-t border-border-soft p-3">
          <form onSubmit={onSubmit} className="flex gap-2">
            <input
              value={manualInput}
              onChange={e => setManualInput(e.target.value)}
              placeholder="Type question…"
              className="flex-1 rounded-xl border border-border-strong bg-surface-2 px-4 py-3 text-sm text-foreground outline-none placeholder:text-muted-2 focus:border-brand/50"
            />
            <button type="submit" disabled={asking || !manualInput.trim()}
              className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-accent text-accent-foreground disabled:opacity-40">
              <Send className="size-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  )
}
