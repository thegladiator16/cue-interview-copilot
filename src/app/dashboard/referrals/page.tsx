"use client"

import { useState, useEffect } from "react"
import { Gift, Copy, Check, Users, Award, ArrowRight } from "lucide-react"

type ReferralData = {
  referralCode: string
  referrals: Array<{
    id: string
    creditsGiven: number
    createdAt: string
    referred: { name: string; email: string; createdAt: string }
  }>
  stats: { totalReferred: number; totalCreditsEarned: number }
}

export default function ReferralsPage() {
  const [data, setData] = useState<ReferralData | null>(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)
  const [applyCode, setApplyCode] = useState("")
  const [applying, setApplying] = useState(false)
  const [applyMessage, setApplyMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  useEffect(() => { loadData() }, [])

  async function loadData() {
    const res = await fetch("/api/referrals")
    const json = await res.json()
    setData(json)
    setLoading(false)
  }

  function copyCode() {
    if (!data) return
    navigator.clipboard.writeText(data.referralCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function copyLink() {
    if (!data) return
    navigator.clipboard.writeText(`${window.location.origin}/signup?ref=${data.referralCode}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  async function applyReferral() {
    if (!applyCode.trim()) return
    setApplying(true)
    setApplyMessage(null)
    try {
      const res = await fetch("/api/referrals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: applyCode.trim() }),
      })
      const json = await res.json()
      if (res.ok) {
        setApplyMessage({ type: "success", text: `${json.minutesAdded} bonus minutes added!` })
        setApplyCode("")
        loadData()
      } else {
        setApplyMessage({ type: "error", text: json.error })
      }
    } catch {
      setApplyMessage({ type: "error", text: "Something went wrong" })
    } finally {
      setApplying(false)
    }
  }

  if (loading) return (
    <div className="mx-auto max-w-3xl px-8 py-10">
      <div className="skeleton h-8 w-48 mb-8" />
      <div className="skeleton h-40 w-full rounded-xl mb-6" />
      <div className="skeleton h-32 w-full rounded-xl" />
    </div>
  )

  if (!data) return null

  return (
    <div className="mx-auto max-w-3xl px-8 py-10">
      <div className="flex items-center gap-2 mb-2">
        <Gift className="size-5 text-brand-2" />
        <h1 className="text-2xl font-semibold text-foreground">Referrals</h1>
      </div>
      <p className="text-muted mb-8">Invite friends and earn free interview minutes.</p>

      {/* How it works */}
      <div className="rounded-[var(--radius-lg)] border border-brand/20 bg-brand/5 p-6 mb-6">
        <h2 className="text-sm font-medium text-foreground mb-3">How it works</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { step: "1", title: "Share your code", desc: "Send your unique code to a friend" },
            { step: "2", title: "They sign up", desc: "They apply your code and get 5 bonus minutes" },
            { step: "3", title: "You earn too", desc: "You get 10 bonus minutes when they join" },
          ].map(s => (
            <div key={s.step} className="flex items-start gap-3">
              <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-brand text-xs font-bold text-white">{s.step}</span>
              <div>
                <p className="text-sm font-medium text-foreground">{s.title}</p>
                <p className="text-xs text-muted-2">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Your code */}
      <div className="rounded-[var(--radius-lg)] border border-border-soft bg-surface p-6 mb-6">
        <h2 className="text-sm font-medium text-foreground mb-4">Your referral code</h2>
        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 rounded-lg border border-border-strong bg-surface-2 px-4 py-3 font-mono text-lg font-semibold text-foreground tracking-wider">
            {data.referralCode}
          </div>
          <button onClick={copyCode}
            className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-3 text-sm font-semibold text-accent-foreground">
            {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
        <button onClick={copyLink} className="text-sm text-brand-2 hover:underline">
          Copy invite link instead →
        </button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 mb-6">
        <div className="rounded-[var(--radius-lg)] border border-border-soft bg-surface p-5">
          <Users className="size-4 text-brand-2 mb-2" />
          <p className="text-2xl font-semibold text-foreground tabular-nums">{data.stats.totalReferred}</p>
          <p className="text-xs text-muted-2">Friends referred</p>
        </div>
        <div className="rounded-[var(--radius-lg)] border border-border-soft bg-surface p-5">
          <Award className="size-4 text-brand-2 mb-2" />
          <p className="text-2xl font-semibold text-foreground tabular-nums">{Math.floor(data.stats.totalCreditsEarned / 60)}</p>
          <p className="text-xs text-muted-2">Bonus minutes earned</p>
        </div>
      </div>

      {/* Apply a code */}
      <div className="rounded-[var(--radius-lg)] border border-border-soft bg-surface p-6 mb-6">
        <h2 className="text-sm font-medium text-foreground mb-3">Have a referral code?</h2>
        <div className="flex gap-3">
          <input
            value={applyCode}
            onChange={e => setApplyCode(e.target.value.toUpperCase())}
            placeholder="CUE-XXXXXX"
            className="flex-1 rounded-lg border border-border-strong bg-surface-2 px-3 py-2 text-sm font-mono text-foreground outline-none focus:border-brand placeholder:text-muted-2"
          />
          <button onClick={applyReferral} disabled={applying || !applyCode.trim()}
            className="inline-flex items-center gap-2 rounded-lg bg-surface-3 px-4 py-2 text-sm font-medium text-foreground hover:bg-surface-3/70 disabled:opacity-40">
            {applying ? "Applying…" : "Apply"}
            <ArrowRight className="size-3.5" />
          </button>
        </div>
        {applyMessage && (
          <p className={`mt-3 text-sm ${applyMessage.type === "success" ? "text-green-600" : "text-danger"}`}>
            {applyMessage.text}
          </p>
        )}
      </div>

      {/* Referral history */}
      {data.referrals.length > 0 && (
        <div className="rounded-[var(--radius-lg)] border border-border-soft bg-surface p-6">
          <h2 className="text-sm font-medium text-foreground mb-4">Referral history</h2>
          <div className="space-y-3">
            {data.referrals.map(r => (
              <div key={r.id} className="flex items-center justify-between py-2 border-b border-border-soft last:border-0">
                <div>
                  <p className="text-sm text-foreground">{r.referred.name}</p>
                  <p className="text-xs text-muted-2">{new Date(r.createdAt).toLocaleDateString()}</p>
                </div>
                <span className="text-xs font-medium text-green-600">+{Math.floor(r.creditsGiven / 60)} min</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
