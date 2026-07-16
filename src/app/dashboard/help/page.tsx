import Link from "next/link"
import { getCurrentUser } from "@/lib/auth"
import { redirect } from "next/navigation"
import { HelpCircle, MessageSquare, Mail, BookOpen, Mic, FileText, CreditCard, Keyboard } from "lucide-react"

const FAQS = [
  {
    q: "How do I start a live interview session?",
    a: "Go to Call Sessions, click \"Start Session\", choose the type (interview or regular call), optionally attach a resume and add context like the job description, then hit Start. Cue will begin listening and generating answers in real time.",
  },
  {
    q: "Does Cue work with Zoom, Google Meet, and Teams?",
    a: "Yes. Cue runs as a browser overlay alongside any video platform. It captures audio from your microphone or system audio — no plugins or integrations needed.",
  },
  {
    q: "How does the speech-to-text work?",
    a: "Cue uses your browser's built-in Web Speech API for real-time transcription. It works best in Chrome and Edge. Firefox and Safari have limited support.",
  },
  {
    q: "What file formats can I upload?",
    a: "Cue supports PDF, DOCX, DOC, TXT, Markdown, RTF, HTML, CSV, and JSON files. Uploaded resumes and documents are used as context for generating personalized answers.",
  },
  {
    q: "How are my minutes calculated?",
    a: "Minutes are counted while a call session is active (from start to end). Practice interviews don't use your call minutes. Free accounts get 10 minutes; subscriptions include unlimited minutes.",
  },
  {
    q: "Can the interviewer see Cue?",
    a: "No. Cue is a private browser tab — it doesn't inject into your video call, share your screen, or appear in screen recordings. It's invisible to everyone except you.",
  },
  {
    q: "What AI model does Cue use?",
    a: "Cue uses Claude by Anthropic to generate answers. Responses are grounded in your resume and the context you provide, so they sound like you — not a generic script.",
  },
  {
    q: "How do I cancel my subscription?",
    a: "Go to Billing in the sidebar and click \"Manage subscription\". You can cancel anytime — you'll keep access until the end of your billing period.",
  },
]

const SHORTCUTS = [
  { keys: "⌘/Ctrl + Enter", action: "Send typed question" },
  { keys: "Click mic button", action: "Toggle live listening" },
  { keys: "Settings gear icon", action: "Change answer format, tone, and length" },
]

export default async function HelpPage() {
  const user = await getCurrentUser()
  if (!user) redirect("/login")

  return (
    <div className="mx-auto max-w-3xl px-8 py-10">
      <div className="flex items-center gap-2 mb-2">
        <HelpCircle className="size-5 text-brand-2" />
        <h1 className="text-2xl font-semibold text-foreground">Help Center</h1>
      </div>
      <p className="text-muted mb-8">Everything you need to get the most out of Cue.</p>

      {/* Quick links */}
      <div className="grid gap-3 sm:grid-cols-2 mb-10">
        {[
          { href: "/dashboard/sessions", icon: Mic, label: "Start a session", desc: "Jump into a live interview" },
          { href: "/dashboard/resumes", icon: FileText, label: "Upload resume", desc: "Add context for better answers" },
          { href: "/dashboard/practice", icon: BookOpen, label: "Practice interviews", desc: "Prep with real questions" },
          { href: "/dashboard/billing", icon: CreditCard, label: "Billing & plans", desc: "Manage your subscription" },
        ].map((item) => {
          const Icon = item.icon
          return (
            <Link key={item.href} href={item.href}
              className="flex items-center gap-4 rounded-[var(--radius-lg)] border border-border-soft bg-surface p-4 hover:border-brand/30 hover:bg-surface-2 transition-colors">
              <div className="flex size-10 items-center justify-center rounded-lg bg-brand/10">
                <Icon className="size-4 text-brand-2" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">{item.label}</p>
                <p className="text-xs text-muted-2">{item.desc}</p>
              </div>
            </Link>
          )
        })}
      </div>

      {/* Keyboard shortcuts */}
      <div className="rounded-[var(--radius-lg)] border border-border-soft bg-surface p-6 mb-8">
        <h2 className="text-sm font-medium text-foreground mb-4 flex items-center gap-2">
          <Keyboard className="size-4 text-brand-2" /> Keyboard shortcuts
        </h2>
        <div className="space-y-2">
          {SHORTCUTS.map((s) => (
            <div key={s.keys} className="flex items-center justify-between py-1.5">
              <span className="text-sm text-muted">{s.action}</span>
              <kbd className="rounded-md border border-border-strong bg-surface-2 px-2.5 py-1 text-xs font-mono text-foreground">{s.keys}</kbd>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div className="mb-8">
        <h2 className="text-sm font-medium text-foreground mb-4 flex items-center gap-2">
          <MessageSquare className="size-4 text-brand-2" /> Frequently asked questions
        </h2>
        <div className="space-y-3">
          {FAQS.map((faq) => (
            <details key={faq.q} className="group rounded-[var(--radius-lg)] border border-border-soft bg-surface">
              <summary className="cursor-pointer px-5 py-4 text-sm font-medium text-foreground select-none">
                {faq.q}
              </summary>
              <div className="px-5 pb-4 text-sm text-muted leading-relaxed">
                {faq.a}
              </div>
            </details>
          ))}
        </div>
      </div>

      {/* Contact */}
      <div className="rounded-[var(--radius-lg)] border border-brand/20 bg-brand/5 p-6 text-center">
        <Mail className="mx-auto size-6 text-brand-2 mb-3" />
        <p className="text-sm font-medium text-foreground mb-1">Still need help?</p>
        <p className="text-sm text-muted mb-4">Reach out and we'll get back to you within 24 hours.</p>
        <Link href="/contact" className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground">
          Contact support
        </Link>
      </div>
    </div>
  )
}
