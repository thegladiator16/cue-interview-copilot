import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";

export function CTA() {
  return (
    <section className="py-24">
      <Container>
        <div className="glow-brand relative overflow-hidden rounded-[var(--radius-lg)] border border-border-soft bg-surface px-8 py-16 text-center sm:px-16">
          <h2 className="mx-auto max-w-xl text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Walk into your next interview ready for anything
          </h2>
          <p className="mx-auto mt-4 max-w-md text-muted">
            Set up takes two minutes. Your first 10 minutes are on us.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <ButtonLink href="/signup" size="lg">
              Try Cue for free <ArrowRight className="size-4" />
            </ButtonLink>
            <ButtonLink href="/pricing" variant="secondary" size="lg">
              See pricing
            </ButtonLink>
          </div>
        </div>
      </Container>
    </section>
  );
}
