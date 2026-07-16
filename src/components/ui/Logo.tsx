import { cn } from "@/lib/cn";

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="relative flex size-8 items-center justify-center rounded-xl bg-gradient-to-br from-brand to-brand-2 shadow-lg shadow-brand/20">
        <span className="text-sm font-bold text-white">C</span>
      </div>
      <span className="text-[15px] font-semibold tracking-tight text-foreground">
        Cue
      </span>
    </div>
  );
}
