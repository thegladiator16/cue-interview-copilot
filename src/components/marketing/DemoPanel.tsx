"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Radio, Sparkles } from "lucide-react";

const EXCHANGES = [
  {
    question:
      "Can you walk me through how you'd design a rate limiter for our public API?",
    answer:
      "I'd use a token bucket per API key backed by Redis — it handles bursts gracefully while enforcing a steady average rate, and it's O(1) per request.",
  },
  {
    question: "What's your experience with Agile frameworks like Scrum or Kanban?",
    answer:
      "Five years running two-week sprints with Scrum, plus a Kanban board for the support queue — I tune the ceremony to the team's actual bottleneck, not the other way around.",
  },
  {
    question: "Why do you want to leave your current role?",
    answer:
      "I've shipped everything I set out to on this team, and I'm looking for a role with more ownership over architecture decisions — which is what drew me to this position.",
  },
];

export function DemoPanel() {
  const [index, setIndex] = useState(0);
  const [typed, setTyped] = useState("");

  useEffect(() => {
    const answer = EXCHANGES[index].answer;
    let i = 0;
    const typing = setInterval(() => {
      i += 2;
      setTyped(answer.slice(0, i));
      if (i >= answer.length) clearInterval(typing);
    }, 14);

    const advance = setTimeout(() => {
      setIndex((v) => (v + 1) % EXCHANGES.length);
    }, 6000);

    return () => {
      clearInterval(typing);
      clearTimeout(advance);
    };
  }, [index]);

  const current = EXCHANGES[index];

  return (
    <div className="relative rounded-[var(--radius-lg)] border border-border-strong bg-surface/80 p-2 shadow-2xl shadow-black/40 backdrop-blur">
      <div className="flex items-center justify-between px-3 py-2">
        <div className="flex gap-1.5">
          <span className="size-2.5 rounded-full bg-[#ff5f57]" />
          <span className="size-2.5 rounded-full bg-[#febc2e]" />
          <span className="size-2.5 rounded-full bg-[#28c840]" />
        </div>
        <div className="flex items-center gap-1.5 rounded-full bg-danger/10 px-2.5 py-1 text-xs font-medium text-danger">
          <Radio className="size-3 animate-pulse" />
          Live
        </div>
      </div>

      <div className="space-y-3 rounded-[calc(var(--radius-lg)-8px)] bg-surface-2 p-4">
        <div className="rounded-xl border border-border-soft bg-surface p-4">
          <p className="mb-2 text-[11px] font-medium uppercase tracking-wide text-muted-2">
            Interviewer
          </p>
          <AnimatePresence mode="wait">
            <motion.p
              key={index}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.3 }}
              className="text-[15px] leading-relaxed text-foreground/90"
            >
              {current.question}
            </motion.p>
          </AnimatePresence>
        </div>

        <div className="rounded-xl border border-brand/30 bg-gradient-to-br from-brand/10 to-brand-2/5 p-4">
          <p className="mb-2 flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wide text-brand-2">
            <Sparkles className="size-3" />
            Cue suggests
          </p>
          <p className="min-h-[72px] text-[15px] leading-relaxed text-foreground">
            {typed}
            <span className="ml-0.5 inline-block h-4 w-[2px] animate-pulse bg-brand-2 align-middle" />
          </p>
        </div>

        <div className="flex items-center justify-between px-1 pt-1">
          <div className="flex items-center gap-2 text-xs text-muted-2">
            <span className="size-1.5 rounded-full bg-brand-2" />
            Transcribing in real time
          </div>
          <span className="text-xs text-muted-2">Claude · 340ms</span>
        </div>
      </div>
    </div>
  );
}
