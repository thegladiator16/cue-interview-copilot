"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, ArrowRight, Briefcase, Phone, FileText, Sparkles, Loader2, CheckCircle } from "lucide-react"
import Link from "next/link"

type Resume = { id: string; filename: string }

const INTERVIEW_TYPES = [
  { id: "behavioral", label: "Behavioral", desc: "STAR-format experience questions" },
  { id: "technical", label: "Technical", desc: "CS fundamentals & coding concepts" },
  { id: "system-design", label: "System Design", desc: "Architecture & scalability" },
  { id: "hr", label: "HR / General", desc: "Culture fit, salary, motivation" },
  { id: "mixed", label: "Mixed", desc: "Combination of all types" },
]

export default function NewSessionPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [type, setType] = useState<"interview" | "call">("interview")
  const [company, setCompany] = useState("")
  const [role, setRole] = useState("")
  const [interviewType, setInterviewType] = useState("mixed")
  const [resumeId, setResumeId] = useState("")
  const [extraContext, setExtraContext] = useState("")
  const [resumes, setResumes] = useState<Resume[]>([])

  useEffect(() => {
    fetch("/api/resumes").then(r => r.json()).then(d => setResumes(d.resumes ?? []))
  }, [])

  async function createSession() {
    setCreating(true)
    setError(null)
    try {
      const res = await fetch("/api/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          company: company || undefined,
          role: role || undefined,
          resumeId: resumeId || undefined,
          extraContext: extraContext || undefined,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? "Couldn't create session")
        setCreating(false)
        return
      }
      router.push(`/dashboard/sessions/${data.session.id}`)
    } catch {
      setError("Network error")
      setCreating(false)
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-8 py-10">
      <Link href="/dashboard/sessions" className="text-sm text-muted-2 hover:text-foreground mb-6 inline-block">
        ← Back to sessions
      </Link>

      <h1 className="text-2xl font-semibold text-foreground mb-2">New Session</h1>
      <p className="text-muted mb-8">Set up your interview session in a few steps.</p>

      {/* Step indicator */}
      <div className="flex items-center gap-2 mb-8">
        {[1, 2, 3].map(s => (
          <div key={s} className="flex items-center gap-2">
            <button
              onClick={() => s < step && setStep(s)}
              className={`flex size-8 items-center justify-center rounded-full text-xs font-semibold transition-colors ${
                s === step ? "bg-accent text-accent-foreground" : s < step ? "bg-brand/20 text-brand-2" : "bg-surface-3 text-muted-2"
              }`}
            >
              {s < step ? <CheckCircle className="size-4" /> : s}
            </button>
            {s < 3 && <div className={`h-px w-12 ${s < step ? "bg-brand/30" : "bg-surface-3"}`} />}
          </div>
        ))}
        <span className="ml-3 text-xs text-muted-2">
          {step === 1 ? "Session type" : step === 2 ? "Details & context" : "Review & start"}
        </span>
      </div>

      {/* Step 1: Session Type */}
      {step === 1 && (
        <div className="space-y-6 animate-fade-up">
          <div>
            <label className="block text-sm font-medium text-foreground mb-3">What type of session?</label>
            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => setType("interview")}
                className={`flex items-center gap-3 rounded-[var(--radius-lg)] border p-5 text-left transition-colors ${
                  type === "interview" ? "border-brand bg-brand/5" : "border-border-soft bg-surface hover:border-brand/30"
                }`}>
                <Briefcase className={`size-5 ${type === "interview" ? "text-brand-2" : "text-muted-2"}`} />
                <div>
                  <p className="text-sm font-medium text-foreground">Interview</p>
                  <p className="text-xs text-muted-2">Job interview with AI assist</p>
                </div>
              </button>
              <button onClick={() => setType("call")}
                className={`flex items-center gap-3 rounded-[var(--radius-lg)] border p-5 text-left transition-colors ${
                  type === "call" ? "border-brand bg-brand/5" : "border-border-soft bg-surface hover:border-brand/30"
                }`}>
                <Phone className={`size-5 ${type === "call" ? "text-brand-2" : "text-muted-2"}`} />
                <div>
                  <p className="text-sm font-medium text-foreground">Regular call</p>
                  <p className="text-xs text-muted-2">Any conversation with AI notes</p>
                </div>
              </button>
            </div>
          </div>

          {type === "interview" && (
            <div>
              <label className="block text-sm font-medium text-foreground mb-3">Interview type</label>
              <div className="space-y-2">
                {INTERVIEW_TYPES.map(t => (
                  <button key={t.id} onClick={() => setInterviewType(t.id)}
                    className={`w-full flex items-center gap-3 rounded-lg border px-4 py-3 text-left transition-colors ${
                      interviewType === t.id ? "border-brand bg-brand/5" : "border-border-soft hover:border-brand/30"
                    }`}>
                    <div className={`size-3 rounded-full border-2 ${interviewType === t.id ? "border-brand bg-brand" : "border-muted-2"}`} />
                    <div>
                      <p className="text-sm font-medium text-foreground">{t.label}</p>
                      <p className="text-xs text-muted-2">{t.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-end">
            <button onClick={() => setStep(2)}
              className="inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground">
              Next <ArrowRight className="size-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Details & Context */}
      {step === 2 && (
        <div className="space-y-5 animate-fade-up">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-muted-2 mb-1.5">Company</label>
              <input value={company} onChange={e => setCompany(e.target.value)} placeholder="e.g., Google"
                className="w-full rounded-lg border border-border-strong bg-surface-2 px-3 py-2.5 text-sm text-foreground outline-none focus:border-brand" />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-2 mb-1.5">Role</label>
              <input value={role} onChange={e => setRole(e.target.value)} placeholder="e.g., Senior SWE"
                className="w-full rounded-lg border border-border-strong bg-surface-2 px-3 py-2.5 text-sm text-foreground outline-none focus:border-brand" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-muted-2 mb-1.5">
              <FileText className="inline size-3 mr-1" /> Resume
            </label>
            <select value={resumeId} onChange={e => setResumeId(e.target.value)}
              className="w-full rounded-lg border border-border-strong bg-surface-2 px-3 py-2.5 text-sm text-foreground outline-none focus:border-brand">
              <option value="">No resume selected</option>
              {resumes.map(r => <option key={r.id} value={r.id}>{r.filename}</option>)}
            </select>
            {resumes.length === 0 && (
              <Link href="/dashboard/resumes" className="text-xs text-brand-2 hover:underline mt-1 inline-block">
                Upload a resume first →
              </Link>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium text-muted-2 mb-1.5">
              Extra context (optional)
            </label>
            <textarea value={extraContext} onChange={e => setExtraContext(e.target.value)} rows={5}
              placeholder="Paste the job description, talking points, specific projects to highlight, or any other notes Cue should know…"
              className="w-full rounded-lg border border-border-strong bg-surface-2 px-3 py-2.5 text-sm text-foreground outline-none focus:border-brand resize-none" />
          </div>

          <div className="flex justify-between">
            <button onClick={() => setStep(1)}
              className="inline-flex items-center gap-2 text-sm text-muted hover:text-foreground">
              <ArrowLeft className="size-4" /> Back
            </button>
            <button onClick={() => setStep(3)}
              className="inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground">
              Next <ArrowRight className="size-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Review & Start */}
      {step === 3 && (
        <div className="space-y-5 animate-fade-up">
          <div className="rounded-[var(--radius-lg)] border border-border-soft bg-surface p-6">
            <h2 className="text-sm font-medium text-foreground mb-4 flex items-center gap-2">
              <Sparkles className="size-4 text-brand-2" /> Session summary
            </h2>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-lg bg-surface-2 p-3">
                <p className="text-xs text-muted-2 mb-0.5">Type</p>
                <p className="text-foreground capitalize">{type}</p>
              </div>
              {type === "interview" && (
                <div className="rounded-lg bg-surface-2 p-3">
                  <p className="text-xs text-muted-2 mb-0.5">Interview type</p>
                  <p className="text-foreground capitalize">{interviewType.replace("-", " ")}</p>
                </div>
              )}
              <div className="rounded-lg bg-surface-2 p-3">
                <p className="text-xs text-muted-2 mb-0.5">Company</p>
                <p className="text-foreground">{company || "—"}</p>
              </div>
              <div className="rounded-lg bg-surface-2 p-3">
                <p className="text-xs text-muted-2 mb-0.5">Role</p>
                <p className="text-foreground">{role || "—"}</p>
              </div>
              <div className="rounded-lg bg-surface-2 p-3">
                <p className="text-xs text-muted-2 mb-0.5">Resume</p>
                <p className="text-foreground">{resumes.find(r => r.id === resumeId)?.filename || "None"}</p>
              </div>
              <div className="rounded-lg bg-surface-2 p-3">
                <p className="text-xs text-muted-2 mb-0.5">AI Model</p>
                <p className="text-foreground">Claude Sonnet</p>
              </div>
            </div>
            {extraContext && (
              <div className="mt-3 rounded-lg bg-surface-2 p-3">
                <p className="text-xs text-muted-2 mb-0.5">Extra context</p>
                <p className="text-xs text-muted leading-relaxed">{extraContext.slice(0, 200)}{extraContext.length > 200 ? "…" : ""}</p>
              </div>
            )}
          </div>

          {error && (
            <p className="rounded-lg border border-danger/30 bg-danger/10 px-3 py-2 text-sm text-danger">{error}</p>
          )}

          <div className="flex justify-between">
            <button onClick={() => setStep(2)}
              className="inline-flex items-center gap-2 text-sm text-muted hover:text-foreground">
              <ArrowLeft className="size-4" /> Back
            </button>
            <button onClick={createSession} disabled={creating}
              className="inline-flex items-center gap-2 rounded-lg bg-accent px-6 py-2.5 text-sm font-semibold text-accent-foreground disabled:opacity-40">
              {creating ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
              {creating ? "Creating…" : "Start session"}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
