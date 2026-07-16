import { cn } from "@/lib/cn";
import type { ReactNode } from "react";

export function Badge({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-border-strong bg-black/5 px-3 py-1 text-xs font-medium text-muted",
        className
      )}
    >
      {children}
    </span>
  );
}
