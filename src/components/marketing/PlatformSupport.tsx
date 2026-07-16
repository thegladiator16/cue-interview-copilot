import { Container } from "@/components/ui/Container";
import {
  Video,
  Users,
  Code2,
  MessageSquare,
  PhoneCall,
  Presentation,
} from "lucide-react";

const platforms = [
  { icon: Video, label: "Zoom" },
  { icon: Users, label: "Google Meet" },
  { icon: MessageSquare, label: "Microsoft Teams" },
  { icon: Code2, label: "HackerRank" },
  { icon: Code2, label: "LeetCode" },
  { icon: PhoneCall, label: "Phone screens" },
  { icon: Presentation, label: "In-person prep" },
];

export function PlatformSupport() {
  return (
    <section className="py-20">
      <Container>
        <div className="rounded-[var(--radius-lg)] border border-border-soft bg-surface p-10 sm:p-14">
          <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-center">
            <div>
              <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                Works with any interview platform
              </h2>
              <p className="mt-4 max-w-md text-muted">
                Cue runs alongside any video or coding platform — Zoom, Google
                Meet, Microsoft Teams, HackerRank, LeetCode, and plain phone
                screens. No plugin, no integration required.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {platforms.map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="flex items-center gap-2.5 rounded-xl border border-border-soft bg-surface-2 px-4 py-3.5 text-sm text-foreground/90 transition-colors hover:border-border-strong"
                >
                  <Icon className="size-4 text-brand-2" />
                  {label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
