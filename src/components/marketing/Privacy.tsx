import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { EyeOff, LayoutGrid, Activity, SquareStack } from "lucide-react";

const items = [
  {
    icon: EyeOff,
    title: "Invisible on screen share",
    description: "Cue's overlay is excluded from any screen or window you share.",
  },
  {
    icon: LayoutGrid,
    title: "Invisible in the dock",
    description: "Doesn't show up in your dock, taskbar, or app switcher.",
  },
  {
    icon: Activity,
    title: "Invisible in Task Manager",
    description: "Runs as a background helper process, not a visible app.",
  },
  {
    icon: SquareStack,
    title: "Invisible to tab switching",
    description: "Alt-tab and mission control skip right past it.",
  },
];

export function Privacy() {
  return (
    <section id="privacy" className="py-24">
      <Container>
        <div className="grid gap-10 rounded-[var(--radius-lg)] border border-border-soft bg-surface p-10 sm:p-14 lg:grid-cols-2 lg:items-center">
          <div>
            <Badge className="mb-4">Privacy</Badge>
            <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              A private overlay only you can see
            </h2>
            <p className="mt-4 max-w-md text-muted">
              Cue is a personal notes overlay for your own calls — like a
              teleprompter. It stays out of anything you screen-share, so it
              never interrupts what the other person sees on their end.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {items.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="rounded-xl border border-border-soft bg-surface-2 p-5"
              >
                <Icon className="mb-3 size-5 text-brand-2" />
                <p className="text-sm font-medium text-foreground">{title}</p>
                <p className="mt-1.5 text-xs leading-relaxed text-muted-2">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
