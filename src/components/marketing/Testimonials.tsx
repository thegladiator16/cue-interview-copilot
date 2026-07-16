import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Priya N.",
    role: "Backend Engineer, hired at a fintech startup",
    quote:
      "I didn't need to lean on it much, but having the answer ready the moment I blanked on a system design question kept my confidence up the whole call.",
    color: "#7c6cf6",
  },
  {
    name: "Marcus O.",
    role: "Product Manager",
    quote:
      "Set up took two minutes — uploaded my resume, started the session. The suggestions actually sounded like something I'd say, not a script.",
    color: "#4fd8c4",
  },
  {
    name: "Ananya R.",
    role: "New grad, SWE",
    quote:
      "First technical interview out of college and I was terrified. Cue kept the transcript scrolling and I never lost my place.",
    color: "#d9ff5b",
  },
  {
    name: "Devon K.",
    role: "Sales lead",
    quote:
      "Used it for a panel interview with four people talking over each other. It still kept up and attributed answers to the right question.",
    color: "#ff8a6b",
  },
  {
    name: "Sara L.",
    role: "Data Analyst",
    quote:
      "The resume-aware answers are the actual differentiator — most of these tools give you a textbook answer that doesn't sound like your background.",
    color: "#6ba8ff",
  },
  {
    name: "Wei T.",
    role: "DevOps Engineer",
    quote:
      "Ran it through a two-hour onsite loop across five interviewers. Battery held up, and it never once mixed up who asked what.",
    color: "#f6a6d0",
  },
];

export function Testimonials() {
  return (
    <section id="reviews" className="py-24">
      <Container>
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <Badge className="mb-4">Reviews</Badge>
          <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            People walk in calmer
          </h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="flex flex-col rounded-[var(--radius-md)] border border-border-soft bg-surface p-6"
            >
              <div className="mb-3 flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="size-3.5 fill-accent text-accent" />
                ))}
              </div>
              <p className="flex-1 text-sm leading-relaxed text-foreground/85">
                “{t.quote}”
              </p>
              <div className="mt-5 flex items-center gap-3">
                <div
                  className="flex size-9 items-center justify-center rounded-full text-xs font-semibold text-black/80"
                  style={{ background: t.color }}
                >
                  {t.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{t.name}</p>
                  <p className="text-xs text-muted-2">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
