"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Play } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { DemoPanel } from "@/components/marketing/DemoPanel";

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-20 pb-24 sm:pt-28 sm:pb-32">
      <div className="glow-brand absolute inset-x-0 top-0 -z-10 h-[600px]" />
      <div className="bg-grid pointer-events-none absolute inset-0 -z-20 [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,black,transparent)]" />

      <Container className="grid items-center gap-16 lg:grid-cols-[1.05fr_1fr]">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <Badge className="mb-6">
            <Sparkles className="size-3.5 text-brand-2" />
            Real-time AI interview copilot
          </Badge>

          <h1 className="text-4xl font-semibold leading-[1.08] tracking-tight text-foreground sm:text-6xl">
            Never blank out
            <br />
            in an interview <span className="text-gradient">again.</span>
          </h1>

          <p className="mt-6 max-w-lg text-lg leading-relaxed text-muted">
            Cue listens in real time and gives you the answer before you finish reading the question — quietly, privately, and grounded in your actual resume. Practice first, perform better.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
            <ButtonLink href="/signup" size="lg">
              Try Cue for free <ArrowRight className="size-4" />
            </ButtonLink>
            <ButtonLink href="#features" variant="secondary" size="lg">
              <Play className="size-4" /> See how it works
            </ButtonLink>
          </div>

          <p className="mt-4 text-sm text-muted-2">
            No credit card required · 10 free minutes · Cancel anytime
          </p>

          <div className="mt-10 flex items-center gap-4">
            <div className="flex -space-x-3">
              {["#7c6cf6", "#4fd8c4", "#0891b2", "#ff6b6b"].map((c, i) => (
                <div
                  key={i}
                  className="size-9 rounded-full border-2 border-background"
                  style={{ background: c }}
                />
              ))}
            </div>
            <p className="text-sm text-muted">
              <span className="text-foreground">Used by candidates preparing for interviews at Google, Meta, Amazon, and 500+ companies worldwide</span>
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.15 }}
        >
          <DemoPanel />
        </motion.div>
      </Container>
    </section>
  );
}
