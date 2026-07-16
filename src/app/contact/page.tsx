import { Navbar } from "@/components/marketing/Navbar";
import { Footer } from "@/components/marketing/Footer";
import { Container } from "@/components/ui/Container";
import { Mail, MessageSquare, Clock } from "lucide-react";

const channels = [
  {
    icon: Mail,
    title: "Email us",
    body: "For billing questions, account issues, or anything that needs a human.",
    action: "hello@cue.so",
    href: "mailto:hello@cue.so",
  },
  {
    icon: MessageSquare,
    title: "Feature requests",
    body: "Have an idea that would make Cue better? We read every message.",
    action: "ideas@cue.so",
    href: "mailto:ideas@cue.so",
  },
  {
    icon: Clock,
    title: "Response time",
    body: "We typically respond within one business day. Urgent billing issues within a few hours.",
    action: null,
    href: null,
  },
];

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main>
        <section className="py-24 text-center">
          <div className="bg-grid pointer-events-none absolute inset-0 -z-10 [mask-image:radial-gradient(ellipse_60%_40%_at_50%_0%,black,transparent)]" />
          <Container>
            <p className="mb-4 text-sm font-medium text-brand-2">Contact</p>
            <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
              Get in touch
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-lg text-muted">
              We&apos;re a small team and we read everything. If something is
              broken, unclear, or could be better — tell us.
            </p>
          </Container>
        </section>

        <section className="border-t border-border-soft py-20">
          <Container>
            <div className="mx-auto grid max-w-3xl gap-6 sm:grid-cols-3">
              {channels.map((c) => (
                <div
                  key={c.title}
                  className="rounded-[var(--radius-lg)] border border-border-soft bg-surface p-7"
                >
                  <c.icon className="mb-4 size-5 text-brand-2" />
                  <h3 className="mb-2 font-semibold text-foreground">{c.title}</h3>
                  <p className="mb-4 text-sm text-muted leading-relaxed">{c.body}</p>
                  {c.href && c.action && (
                    <a
                      href={c.href}
                      className="text-sm font-medium text-brand-2 hover:underline"
                    >
                      {c.action}
                    </a>
                  )}
                </div>
              ))}
            </div>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  );
}
