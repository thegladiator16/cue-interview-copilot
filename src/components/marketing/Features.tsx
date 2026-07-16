import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { Mic, Brain, FileText, Check, GraduationCap } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

type Feature = {
  eyebrow: string;
  icon: LucideIcon;
  title: string;
  description: string;
  points: string[];
  visual: ReactNode;
};

function TranscriptionVisual() {
  return (
    <div className="flex h-full flex-col justify-center gap-4 p-8">
      <div className="flex items-center gap-3 rounded-xl border border-border-soft bg-surface-2 p-4">
        <div className="flex size-9 items-center justify-center rounded-full bg-brand/15">
          <Mic className="size-4 text-brand-2" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-foreground">Interviewer</p>
          <p className="text-xs text-muted-2">Speaking…</p>
        </div>
        <div className="flex items-end gap-0.5">
          {[6, 14, 9, 18, 11, 16, 7].map((h, i) => (
            <span
              key={i}
              className="w-1 rounded-full bg-brand-2"
              style={{ height: `${h}px` }}
            />
          ))}
        </div>
      </div>
      <p className="rounded-xl border border-border-soft bg-surface-2 p-4 text-sm leading-relaxed text-muted">
        “...so tell me about a time you had to debug a production issue under
        pressure, and how you—”
      </p>
    </div>
  );
}

function AccuracyVisual() {
  return (
    <div className="flex h-full flex-col justify-center gap-3 p-8">
      <div className="ml-auto max-w-[85%] rounded-xl rounded-tr-sm bg-surface-2 border border-border-soft p-3.5 text-sm text-foreground/90">
        Are you familiar with distributed caching strategies?
      </div>
      <div className="max-w-[85%] rounded-xl rounded-tl-sm border border-brand/30 bg-gradient-to-br from-brand/10 to-brand-2/5 p-3.5 text-sm text-foreground">
        Yes — I&apos;ve used write-through caching with Redis for session data,
        and cache-aside for expensive read-heavy queries.
      </div>
      <div className="mt-1 flex items-center gap-2 text-xs text-muted-2">
        <Check className="size-3.5 text-brand-2" /> Grounded in your resume
      </div>
    </div>
  );
}

function ResumeVisual() {
  return (
    <div className="flex h-full flex-col justify-center gap-3 p-8">
      <div className="flex items-center gap-3 rounded-xl border border-border-soft bg-surface-2 p-3.5">
        <FileText className="size-4 text-brand-2" />
        <p className="text-sm text-foreground/90">resume_shashank_2026.pdf</p>
        <Badge className="ml-auto !py-0.5 !text-[10px]">Attached</Badge>
      </div>
      <div className="flex items-center gap-3 rounded-xl border border-border-soft bg-surface-2 p-3.5">
        <FileText className="size-4 text-brand-2" />
        <p className="text-sm text-foreground/90">job_description.txt</p>
        <Badge className="ml-auto !py-0.5 !text-[10px]">Attached</Badge>
      </div>
      <p className="rounded-xl border border-border-soft bg-surface-2 p-3.5 text-sm text-muted">
        Cue references both when answering — no generic, made-up experience.
      </p>
    </div>
  );
}

function PracticeVisual() {
  return (
    <div className="flex h-full flex-col justify-center gap-4 p-8">
      <div className="rounded-xl border border-border-soft bg-surface-2 p-4">
        <p className="text-xs font-medium text-brand-2 mb-2">SYSTEM DESIGN · HARD</p>
        <p className="text-sm text-foreground leading-relaxed">Design a URL shortener that handles 100M URLs and 10B clicks/day.</p>
      </div>
      <div className="rounded-xl border border-green-500/20 bg-green-500/5 p-4">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-medium text-green-600">AI Feedback</p>
          <span className="text-xs font-bold text-green-600 bg-green-500/10 px-2 py-0.5 rounded-full">8/10</span>
        </div>
        <p className="text-xs text-muted leading-relaxed">Strong approach on hashing. Add a discussion of cache invalidation and read/write replica strategies.</p>
      </div>
    </div>
  )
}

const features: Feature[] = [
  {
    eyebrow: "Speech recognition",
    icon: Mic,
    title: "Transcription that keeps up with real conversation",
    description:
      "A low-latency streaming model captures every word the moment it's spoken — interruptions, cross-talk, and accents included.",
    points: [
      "Sub-second streaming transcription",
      "Automatically detects who's speaking",
      "Works over your mic or system audio",
    ],
    visual: <TranscriptionVisual />,
  },
  {
    eyebrow: "AI answers",
    icon: Brain,
    title: "Answers that sound like you, not a script",
    description:
      "Cue drafts a natural, first-person answer in real time — grounded in your background, not a generic template.",
    points: [
      "Choose from leading models",
      "Concise, interview-ready phrasing",
      "Follows up in context, turn after turn",
    ],
    visual: <AccuracyVisual />,
  },
  {
    eyebrow: "Context",
    icon: FileText,
    title: "It actually knows your resume",
    description:
      "Upload your resume and the job description once. Every answer is grounded in what you've actually done.",
    points: [
      "Resume + job post + custom notes",
      "No repeated copy-pasting",
      "Reused automatically for every session",
    ],
    visual: <ResumeVisual />,
  },
  {
    eyebrow: "Practice",
    icon: GraduationCap,
    title: "Practice before you perform",
    description: "Run mock interviews with real questions from Google, Meta, Amazon, and 100+ companies. Get AI feedback on every answer, track your scores, and build genuine confidence.",
    points: [
      "110+ questions across 5 categories",
      "AI scoring and STAR-format feedback",
      "Track your improvement session by session",
    ],
    visual: <PracticeVisual />,
  },
];

export function Features() {
  return (
    <section id="features" className="py-24">
      <Container>
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <Badge className="mb-4">How it works</Badge>
          <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Everything you need to walk in prepared
          </h2>
          <p className="mt-4 text-muted">
            Three parts working together in real time, so you never have to
            think about the tool — just the conversation.
          </p>
        </div>

        <div className="space-y-8">
          {features.map((feature, i) => (
            <div
              key={feature.title}
              className="grid overflow-hidden rounded-[var(--radius-lg)] border border-border-soft bg-surface lg:grid-cols-2"
            >
              <div
                className={`flex flex-col justify-center p-10 sm:p-14 ${
                  i % 2 === 1 ? "lg:order-2" : ""
                }`}
              >
                <div className="mb-4 flex size-10 items-center justify-center rounded-xl bg-brand/15">
                  <feature.icon className="size-5 text-brand-2" />
                </div>
                <p className="mb-2 text-xs font-medium uppercase tracking-wide text-brand-2">
                  {feature.eyebrow}
                </p>
                <h3 className="text-2xl font-semibold tracking-tight text-foreground">
                  {feature.title}
                </h3>
                <p className="mt-3 text-muted">{feature.description}</p>
                <ul className="mt-6 space-y-2.5">
                  {feature.points.map((point) => (
                    <li
                      key={point}
                      className="flex items-center gap-2.5 text-sm text-foreground/85"
                    >
                      <Check className="size-4 shrink-0 text-brand-2" />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="border-t border-border-soft bg-surface-2/50 lg:border-t-0 lg:border-l">
                {feature.visual}
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
