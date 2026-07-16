import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { Container } from "@/components/ui/Container";

const columns = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "/#features" },
      { label: "Pricing", href: "/pricing" },
      { label: "Privacy", href: "/#privacy" },
      { label: "Reviews", href: "/#reviews" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
      { label: "Terms", href: "/terms" },
      { label: "Privacy policy", href: "/privacy-policy" },
    ],
  },
  {
    title: "Get started",
    links: [
      { label: "Sign up", href: "/signup" },
      { label: "Sign in", href: "/login" },
      { label: "Dashboard", href: "/dashboard" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-border-soft py-14">
      <Container>
        <div className="grid gap-10 sm:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Logo />
            <p className="mt-4 max-w-xs text-sm text-muted-2">
              Your real-time interview copilot. Private, fast, and grounded in
              your real experience.
            </p>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <p className="mb-4 text-sm font-medium text-foreground">
                {col.title}
              </p>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-2 transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border-soft pt-6 text-xs text-muted-2 sm:flex-row">
          <p>&copy; {new Date().getFullYear()} Cue. All rights reserved.</p>
          <p>Built for people who&apos;d rather focus on the conversation.</p>
        </div>
      </Container>
    </footer>
  );
}
