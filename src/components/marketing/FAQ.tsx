"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/cn";

const faqs = [
  {
    q: "Does Cue work for coding interviews?",
    a: "Yes. Cue supports both conversational interviews and coding rounds on platforms like HackerRank and LeetCode, transcribing the question and suggesting an approach or solution.",
  },
  {
    q: "Can I use my own resume and a job description?",
    a: "Yes — upload your resume and paste the job post before a session starts. Cue references both so answers reflect your real experience, not generic advice.",
  },
  {
    q: "What happens when my free minutes run out?",
    a: "Your session simply ends. You can buy a one-time credit pack or subscribe for unlimited minutes at any time from your dashboard.",
  },
  {
    q: "Can I cancel a subscription?",
    a: "Yes, anytime from Billing in your dashboard. You'll keep access until the end of the current billing period.",
  },
  {
    q: "Which languages are supported?",
    a: "Transcription and answers currently support English, with additional languages on the roadmap.",
  },
];

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="py-24">
      <Container className="max-w-3xl">
        <div className="mx-auto mb-12 text-center">
          <Badge className="mb-4">FAQ</Badge>
          <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Frequently asked questions
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div
              key={faq.q}
              className="overflow-hidden rounded-[var(--radius-md)] border border-border-soft bg-surface"
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
              >
                <span className="font-medium text-foreground">{faq.q}</span>
                <ChevronDown
                  className={cn(
                    "size-4 shrink-0 text-muted transition-transform",
                    open === i && "rotate-180"
                  )}
                />
              </button>
              {open === i && (
                <p className="px-6 pb-5 text-sm leading-relaxed text-muted">
                  {faq.a}
                </p>
              )}
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
