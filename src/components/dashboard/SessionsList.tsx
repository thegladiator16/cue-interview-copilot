"use client";

import { useState } from "react";
import Link from "next/link";
import { Users, PlayCircle, Briefcase, Phone } from "lucide-react";
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

export function SessionsList({ sessions }: { sessions: SessionItem[] }) {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="mx-auto max-w-4xl px-8 py-10">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-foreground">Call Sessions</h1>
        <Button onClick={() => setModalOpen(true)}>
          <PlayCircle className="size-4" /> Start Session
        </Button>
      </div>

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
      ) : (
        <div className="space-y-2">
          {sessions.map((s) => (
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
                  {new Date(s.startedAt).toLocaleString()}
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
