"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Users, PlayCircle, Briefcase, Phone, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { NewSessionModal } from "@/components/dashboard/NewSessionModal";

type SessionItem = {
  id: string;
  type: string;
  company: string | null;
  role: string | null;
  status: string;
  startedAt: string;
  secondsUsed: number;
};

type StatusFilter = "all" | "active" | "ended";
type TypeFilter = "all" | "interview" | "call";

export function SessionsList({ sessions }: { sessions: SessionItem[] }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");

  const filtered = useMemo(() => {
    let result = sessions;

    if (statusFilter !== "all") {
      result = result.filter((s) => s.status === statusFilter);
    }
    if (typeFilter !== "all") {
      result = result.filter((s) => s.type === typeFilter);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (s) =>
          s.company?.toLowerCase().includes(q) ||
          s.role?.toLowerCase().includes(q)
      );
    }

    return result;
  }, [sessions, search, statusFilter, typeFilter]);

  const activeCount = sessions.filter((s) => s.status === "active").length;
  const endedCount = sessions.filter((s) => s.status === "ended").length;

  return (
    <div className="mx-auto max-w-4xl px-8 py-10">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-foreground">Call Sessions</h1>
        <Button onClick={() => setModalOpen(true)}>
          <PlayCircle className="size-4" /> Start Session
        </Button>
      </div>

      {/* Search & filters */}
      {sessions.length > 0 && (
        <div className="mb-6 space-y-3">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-2" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by company or role…"
              className="w-full rounded-xl border border-border-strong bg-surface-2 py-2.5 pl-10 pr-4 text-sm text-foreground outline-none placeholder:text-muted-2 focus:border-brand/50"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Filter className="size-3.5 text-muted-2" />

            {/* Status pills */}
            {(
              [
                { value: "all", label: `All (${sessions.length})` },
                { value: "active", label: `Active (${activeCount})` },
                { value: "ended", label: `Ended (${endedCount})` },
              ] as const
            ).map((f) => (
              <button
                key={f.value}
                onClick={() => setStatusFilter(f.value)}
                className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                  statusFilter === f.value
                    ? "bg-accent text-accent-foreground"
                    : "bg-surface-2 text-muted-2 hover:text-foreground"
                }`}
              >
                {f.label}
              </button>
            ))}

            <span className="mx-1 h-4 w-px bg-border-soft" />

            {/* Type pills */}
            {(
              [
                { value: "all", label: "All types" },
                { value: "interview", label: "Interview" },
                { value: "call", label: "Call" },
              ] as const
            ).map((f) => (
              <button
                key={f.value}
                onClick={() => setTypeFilter(f.value)}
                className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                  typeFilter === f.value
                    ? "bg-accent text-accent-foreground"
                    : "bg-surface-2 text-muted-2 hover:text-foreground"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {sessions.length === 0 ? (
        <div className="flex flex-col items-center rounded-[var(--radius-lg)] border border-dashed border-border-strong py-24 text-center">
          <Users className="mb-4 size-8 text-muted-2" />
          <p className="text-sm font-medium text-foreground">No call sessions yet</p>
          <p className="mt-1 text-sm text-muted-2">
            Your call sessions will appear here once created.
          </p>
          <Button className="mt-6" onClick={() => setModalOpen(true)}>
            Start Session
          </Button>
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center rounded-[var(--radius-lg)] border border-dashed border-border-strong py-16 text-center">
          <Search className="mb-3 size-6 text-muted-2" />
          <p className="text-sm text-muted-2">No sessions match your filters.</p>
          <button
            onClick={() => { setSearch(""); setStatusFilter("all"); setTypeFilter("all"); }}
            className="mt-3 text-sm text-brand-2 hover:underline"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((s) => (
            <Link
              key={s.id}
              href={`/dashboard/sessions/${s.id}`}
              className="flex items-center gap-4 rounded-xl border border-border-soft bg-surface px-5 py-4 hover:border-border-strong"
            >
              {s.type === "interview" ? (
                <Briefcase className="size-4 shrink-0 text-brand-2" />
              ) : (
                <Phone className="size-4 shrink-0 text-brand-2" />
              )}
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-foreground">
                  {s.company || s.role
                    ? [s.role, s.company].filter(Boolean).join(" · ")
                    : "Untitled session"}
                </p>
                <p className="text-xs text-muted-2">
                  {new Date(s.startedAt).toLocaleDateString("en-US", {
                    year: "numeric", month: "short", day: "numeric",
                    hour: "2-digit", minute: "2-digit",
                  })}
                  {s.secondsUsed > 0 && ` · ${Math.ceil(s.secondsUsed / 60)} min`}
                </p>
              </div>
              <span
                className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                  s.status === "active"
                    ? "bg-brand/15 text-brand-2"
                    : "bg-black/5 text-muted-2"
                }`}
              >
                {s.status === "active" ? "Active" : "Ended"}
              </span>
            </Link>
          ))}
        </div>
      )}

      {modalOpen && <NewSessionModal onClose={() => setModalOpen(false)} />}
    </div>
  );
}
