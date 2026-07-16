import Link from "next/link"
import { getCurrentUser } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Video, PlayCircle, Mic, FileText, GraduationCap, Settings, ArrowRight } from "lucide-react"

const TUTORIALS = [
  {
    icon: PlayCircle,
    title: "Your first live session",
    duration: "3 min read",
    steps: [
      "Go to Call Sessions and click \"Start Session\".",
      "Choose \"Interview\" or \"Regular call\" depending on your use case.",
      "Optionally select a resume and paste the job description as extra context.",
      "Click Start — Cue opens a two-panel view: transcript on the left, AI answers on the right.",
      "Click the mic button or type questions manually. Cue generates answers in real time.",
      "When you're done, click End to save the session and view your summary.",
    ],
  },
  {
    icon: Mic,
    title: "Using speech recognition",
    duration: "2 min read",
    steps: [
      "Click the mic button in the bottom-left of the session room.",
      "Grant microphone permission when your browser asks.",
      "Cue will transcribe speech in real time — interim text appears in italics.",
      "When a sentence is finalized, it's automatically sent as a question to the AI.",
      "You can type questions manually at any time, even while the mic is active.",
      "Works best in Chrome or Edge. Firefox and Safari have limited speech API support.",
    ],
  },
  {
    icon: FileText,
    title: "Uploading your resume",
    duration: "1 min read",
    steps: [
      "Go to CVs & Resumes in the sidebar.",
      "Click Upload and select your file (PDF, DOCX, TXT, or other supported formats).",
      "Cue extracts the text content and stores it securely.",
      "When starting a session, select your resume — answers will reference your actual experience.",
      "You can upload multiple resumes and pick the right one for each session.",
    ],
  },
  {
    icon: GraduationCap,
    title: "Practice interviews",
    duration: "2 min read",
    steps: [
      "Go to Practice in the sidebar and pick a category (Behavioral, Technical, System Design, etc.).",
      "A random question from that category appears. Click \"Start timer\" when ready.",
      "Type your answer in the text area — aim for STAR format on behavioral questions.",
      "Click \"Submit for feedback\" — the AI scores your answer out of 10 and gives specific suggestions.",
      "Click \"Next question\" to keep practicing. Your history is saved under Recent Practice.",
    ],
  },
  {
    icon: Settings,
    title: "Customizing answers",
    duration: "1 min read",
    steps: [
      "During a live session, click the gear icon in the \"Cue Suggests\" panel header.",
      "Choose your preferred Format: Paragraph, STAR (for behavioral), or Bullet points.",
      "Set the Tone: Professional, Conversational, or Direct.",
      "Adjust the Length: Brief (2-3 sentences), Balanced, or Thorough (detailed).",
      "Use the mode switcher in the header bar to switch between General, Behavioral, Technical, and System Design modes — each tailors the AI's approach.",
    ],
  },
]

export default async function TutorialsPage() {
  const user = await getCurrentUser()
  if (!user) redirect("/login")

  return (
    <div className="mx-auto max-w-3xl px-8 py-10">
      <div className="flex items-center gap-2 mb-2">
        <Video className="size-5 text-brand-2" />
        <h1 className="text-2xl font-semibold text-foreground">Tutorials</h1>
      </div>
      <p className="text-muted mb-8">Step-by-step guides to help you get the most out of every feature.</p>

      <div className="space-y-4">
        {TUTORIALS.map((tut) => {
          const Icon = tut.icon
          return (
            <details key={tut.title} className="group rounded-[var(--radius-lg)] border border-border-soft bg-surface">
              <summary className="flex cursor-pointer items-center gap-4 px-6 py-5 select-none">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-brand/10">
                  <Icon className="size-4 text-brand-2" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{tut.title}</p>
                  <p className="text-xs text-muted-2">{tut.duration}</p>
                </div>
                <ArrowRight className="size-4 text-muted-2 transition-transform group-open:rotate-90" />
              </summary>
              <div className="px-6 pb-5">
                <ol className="space-y-3 border-l-2 border-brand/20 pl-5">
                  {tut.steps.map((step, i) => (
                    <li key={i} className="relative text-sm text-muted leading-relaxed">
                      <span className="absolute -left-[25px] flex size-5 items-center justify-center rounded-full bg-brand/10 text-[10px] font-semibold text-brand-2">
                        {i + 1}
                      </span>
                      {step}
                    </li>
                  ))}
                </ol>
              </div>
            </details>
          )
        })}
      </div>

      <div className="mt-8 rounded-[var(--radius-lg)] border border-border-soft bg-surface-2 p-6 text-center">
        <p className="text-sm text-muted mb-3">Have a question not covered here?</p>
        <Link href="/dashboard/help" className="text-sm font-medium text-brand-2 hover:underline">
          Visit the Help Center →
        </Link>
      </div>
    </div>
  )
}
