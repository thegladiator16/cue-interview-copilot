import { Navbar } from "@/components/marketing/Navbar";
import { Footer } from "@/components/marketing/Footer";
import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";
import { ArrowRight, Mic, Sparkles, ShieldCheck } from "lucide-react";

const values = [
  {
    icon: Mic,
    title: "Real-time, not rehearsed",
    body: "Interviews are live conversations, not recitals. Cue listens alongside you and surfaces answers the moment a question lands — not before, not after.",
  },
  {
    icon: Sparkles,
    title: "Grounded in your actual experience",
    body: "Generic AI answers are easy to spot. Cue grounds every suggestion in your resume and the specific role you're interviewing for, so answers sound like you.",
  },
  {
    icon: ShieldCheck,
    title: "Private by design",
    body: "The overlay is excluded from screen share, hidden from your dock, and invisible in task switchers. What Cue shows is for your eyes only.",
  },
];

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main>
        <section className="py-24 text-center">
          <div className="bg-grid pointer-events-none absolute inset-0 -z-10 [mask-image:radial-gradient(ellipse_60%_40%_at_50%_0%,black,transparent)]" />
          <Container>
            <p className="mb-4 text-sm font-medium text-brand-2">About Cue</p>
            <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
              Built for the moments
              <br />
              <span className="text-gradient">when it counts most.</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted">
              Cue is a real-time interview copilot that listens to your
              conversations and gives you concise, grounded answers before you
              finish reading the question — privately, invisibly, instantly.
            </p>
          </Container>
        </section>

        <section className="border-t border-border-soft py-20">
          <Container>
            <div className="mx-auto max-w-3xl">
              <h2 className="mb-6 text-2xl font-semibold text-foreground">
                Why we built this
              </h2>
              <div className="space-y-5 text-muted leading-relaxed">
                <p>
                  Interviews are stressful. Even experienced engineers blank on
                  system-design questions they know cold. Even strong
                  communicators lose their thread under pressure. That moment of
                  silence — the one where you know the answer but can&apos;t
                  reach it — is what Cue is built to eliminate.
                </p>
                <p>
                  We built Cue because the tools that existed were either
                  pre-interview prep tools (flashcards, mock sessions) or
                  post-interview analysis. Nothing sat with you in the room,
                  quietly helping, grounded in your actual background.
                </p>
                <p>
                  Cue is that tool. It runs invisibly alongside your video call
                  or coding session, transcribes the conversation in real time,
                  and drafts an answer you can say out loud — one that sounds
                  like you, not a textbook.
                </p>
              </div>
            </div>
          </Container>
        </section>

        <section className="border-t border-border-soft py-20">
          <Container>
            <h2 className="mb-12 text-center text-2xl font-semibold text-foreground">
              What we believe
            </h2>
            <div className="grid gap-8 sm:grid-cols-3">
              {values.map((v) => (
                <div key={v.title} className="rounded-[var(--radius-lg)] border border-border-soft bg-surface p-7">
                  <v.icon className="mb-4 size-5 text-brand-2" />
                  <h3 className="mb-2 font-semibold text-foreground">{v.title}</h3>
                  <p className="text-sm text-muted leading-relaxed">{v.body}</p>
                </div>
              ))}
            </div>
          </Container>
        </section>

        <section className="border-t border-border-soft py-20 text-center">
          <Container>
            <h2 className="text-2xl font-semibold text-foreground">
              Ready to try it?
            </h2>
            <p className="mt-3 text-muted">
              Your first 10 minutes are free. No credit card required.
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <ButtonLink href="/signup">
                Get started <ArrowRight className="size-4" />
              </ButtonLink>
              <ButtonLink href="/pricing" variant="secondary">
                See pricing
              </ButtonLink>
            </div>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  );
}
