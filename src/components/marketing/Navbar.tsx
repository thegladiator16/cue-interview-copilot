"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, ArrowRight } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { Logo } from "@/components/ui/Logo";

const links = [
  { href: "/#features", label: "Features" },
  { href: "/#privacy", label: "Privacy" },
  { href: "/#reviews", label: "Reviews" },
  { href: "/pricing", label: "Pricing" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border-soft bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-muted transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/login"
            className="text-sm text-muted transition-colors hover:text-foreground"
          >
            Sign in
          </Link>
          <ButtonLink href="/signup" size="sm">
            Try for free <ArrowRight className="size-3.5" />
          </ButtonLink>
        </div>

        <button
          onClick={() => setOpen((v) => !v)}
          className="p-2 text-foreground md:hidden"
          aria-label="Toggle menu"
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {open && (
        <div className="flex flex-col gap-1 border-t border-border-soft px-6 py-4 md:hidden">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="rounded-lg px-2 py-2.5 text-sm text-muted hover:bg-black/5 hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
          <div className="mt-2 flex gap-2 px-2">
            <ButtonLink href="/login" variant="secondary" size="sm" className="flex-1">
              Sign in
            </ButtonLink>
            <ButtonLink href="/signup" size="sm" className="flex-1">
              Try for free
            </ButtonLink>
          </div>
        </div>
      )}
    </header>
  );
}
