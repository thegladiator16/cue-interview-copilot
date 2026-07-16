import Link from "next/link"
import { getCurrentUser } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { GraduationCap, BookOpen, Code, GitBranch, Lightbulb, Users, Trophy, ArrowRight } from "lucide-react"
import { redirect } from "next/navigation"

const CATEGORIES = [
  { id: "behavioral", label: "Behavioral", icon: BookOpen, description: "STAR-format stories about your experience", count: 25, color: "text-blue-600" },
  { id: "technical", label: "Technical", icon: Code, description: "CS fundamentals, systems, and coding concepts", count: 25, color: "text-purple-600" },
  { id: "system-design", label: "System Design", icon: GitBranch, description: "Design scalable distributed systems", count: 20, color: "text-brand-2" },
  { id: "product", label: "Product", icon: Lightbulb, description: "Product strategy, metrics, and user empathy", count: 20, color: "text-amber-600" },
  { id: "leadership", label: "Leadership", icon: Users, description: "Team management and cross-functional work", count: 20, color: "text-green-600" },
]

export default async function PracticePage() {
  const user = await getCurrentUser()
  if (!user) redirect("/login")

  const [recentSessions, totalCount] = await Promise.all([
    prisma.practiceSession.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    prisma.practiceSession.count({ where: { userId: user.id } }),
  ])

  return (
    <div className="mx-auto max-w-4xl px-8 py-10">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <GraduationCap className="size-5 text-brand-2" />
          <h1 className="text-2xl font-semibold text-foreground">Practice Interview</h1>
        </div>
        <p className="text-muted">Sharpen your answers before the real thing. {totalCount > 0 && <span className="text-foreground font-medium">{totalCount} sessions completed.</span>}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-10">
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon
          return (
            <Link key={cat.id} href={"/dashboard/practice/" + cat.id}
              className="interactive-card group rounded-[var(--radius-lg)] border border-border-soft bg-surface p-6 hover:border-brand/30 hover:bg-surface-2 transition-colors">
              <Icon className={"mb-3 size-5 " + cat.color} />
              <h3 className="font-semibold text-foreground mb-1">{cat.label}</h3>
              <p className="text-sm text-muted mb-4 leading-relaxed">{cat.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-2">{cat.count} questions</span>
                <ArrowRight className="size-4 text-muted-2 group-hover:text-brand-2 group-hover:translate-x-0.5 transition-all" />
              </div>
            </Link>
          )
        })}
      </div>

      {recentSessions.length > 0 && (
        <div className="rounded-[var(--radius-lg)] border border-border-soft bg-surface p-6">
          <h2 className="text-sm font-medium text-foreground mb-4 flex items-center gap-2">
            <Trophy className="size-4 text-brand-2" /> Recent Practice
          </h2>
          <div className="space-y-3">
            {recentSessions.map((s) => (
              <div key={s.id} className="flex items-start gap-4 py-2 border-b border-border-soft last:border-0">
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground truncate">{s.questionText.slice(0, 90)}{s.questionText.length > 90 ? "…" : ""}</p>
                  <p className="text-xs text-muted-2 mt-1">{s.category}</p>
                </div>
                {s.aiScore !== null && (
                  <span className={"text-xs font-semibold px-2 py-1 rounded-full " + (s.aiScore >= 8 ? "bg-green-500/10 text-green-600" : s.aiScore >= 6 ? "bg-amber-500/10 text-amber-600" : "bg-red-500/10 text-red-600")}>
                    {s.aiScore}/10
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
