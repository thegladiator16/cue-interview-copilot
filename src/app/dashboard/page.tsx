import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Check, Circle, PlayCircle, UserCircle, Clock, ListChecks, GraduationCap, BookOpen, BookMarked, ExternalLink } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";

export default async function DashboardHome() {
  const user = await getCurrentUser();
  if (!user) return null;

  const [resumeCount, sessionCount, practiceCount] = await Promise.all([
    prisma.resume.count({ where: { userId: user.id } }),
    prisma.callSession.count({ where: { userId: user.id } }),
    prisma.practiceSession.count({ where: { userId: user.id } }),
  ]);

  const recentSessions = await prisma.callSession.findMany({
    where: { userId: user.id, status: "ended" },
    orderBy: { endedAt: "desc" },
    take: 3,
  });

  const minutesLeft = "∞";

  const steps = [
    { label: "Upload your resume", done: resumeCount > 0, href: "/dashboard/resumes" },
    { label: "Start your first session", done: sessionCount > 0, href: "/dashboard/sessions" },
    { label: "Try a practice interview", done: practiceCount > 0, href: "/dashboard/practice" },
  ];

  return (
    <div className="mx-auto max-w-4xl px-8 py-10">
      <h1 className="text-2xl font-semibold text-foreground">
        Welcome back, {user.name.split(" ")[0]}
      </h1>
      <p className="mt-1 text-muted">Here&apos;s where things stand today.</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-4">
        <StatCard icon={Clock} label="Minutes available" value={minutesLeft} />
        <StatCard icon={PlayCircle} label="Sessions run" value={String(sessionCount)} />
        <StatCard icon={UserCircle} label="Resumes on file" value={String(resumeCount)} />
        <StatCard icon={GraduationCap} label="Practice sessions" value={String(practiceCount)} />
      </div>

      <div className="mt-8 rounded-[var(--radius-lg)] border border-border-soft bg-surface p-6">
        <p className="mb-4 flex items-center gap-2 text-sm font-medium text-foreground">
          <ListChecks className="size-4 text-brand-2" />
          Getting started
        </p>
        <div className="space-y-2">
          {steps.map((step) => (
            <Link
              key={step.label}
              href={step.href}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm hover:bg-black/5"
            >
              {step.done ? (
                <Check className="size-4 text-brand-2" />
              ) : (
                <Circle className="size-4 text-muted-2" />
              )}
              <span className={step.done ? "text-muted-2 line-through" : "text-foreground"}>
                {step.label}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {recentSessions.length > 0 && (
        <div className="mt-8 rounded-[var(--radius-lg)] border border-border-soft bg-surface p-6">
          <p className="mb-4 flex items-center gap-2 text-sm font-medium text-foreground">
            <PlayCircle className="size-4 text-brand-2" />
            Recent Sessions
          </p>
          <div className="space-y-2">
            {recentSessions.map((session) => {
              const label = session.company
                ? `${session.company}${session.role ? ` · ${session.role}` : ""}`
                : "Interview session";
              const duration = Math.round(session.secondsUsed / 60);
              return (
                <Link
                  key={session.id}
                  href={`/dashboard/sessions/${session.id}/summary`}
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm hover:bg-black/5"
                >
                  <PlayCircle className="size-4 text-muted-2 shrink-0" />
                  <span className="flex-1 text-foreground">{label}</span>
                  <span className="text-muted-2">{duration}m</span>
                  <ExternalLink className="size-3.5 text-muted-2" />
                </Link>
              );
            })}
          </div>
        </div>
      )}

      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        <ButtonLink href="/dashboard/sessions">
          <PlayCircle className="size-4" /> Start live session
        </ButtonLink>
        <ButtonLink href="/dashboard/practice" variant="secondary">
          <GraduationCap className="size-4" /> Practice interview
        </ButtonLink>
        <ButtonLink href="/dashboard/questions" variant="secondary">
          <BookOpen className="size-4" /> Browse question bank
        </ButtonLink>
        <ButtonLink href="/dashboard/stories" variant="secondary">
          <BookMarked className="size-4" /> Story Studio
        </ButtonLink>
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="interactive-card rounded-[var(--radius-md)] border border-border-soft bg-surface p-5">
      <Icon className="mb-3 size-4 text-brand-2" />
      <p className="tabular-nums text-2xl font-semibold text-foreground">{value}</p>
      <p className="mt-1 text-xs text-muted-2">{label}</p>
    </div>
  );
}
