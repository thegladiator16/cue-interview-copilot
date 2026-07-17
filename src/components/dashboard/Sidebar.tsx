"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Home,
  PlayCircle,
  UserCircle,
  FileText,
  HelpCircle,
  Video,
  CreditCard,
  LogOut,
  GraduationCap,
  BookOpen,
  BookMarked,
  Settings,
  Gift,
} from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { cn } from "@/lib/cn";

const nav = [
  { href: "/dashboard", label: "Home", icon: Home },
  { href: "/dashboard/sessions", label: "Call Sessions", icon: PlayCircle },
  { href: "/dashboard/practice", label: "Practice", icon: GraduationCap },
  { href: "/dashboard/questions", label: "Question Bank", icon: BookOpen },
  { href: "/dashboard/stories", label: "Story Studio", icon: BookMarked },
  { href: "/dashboard/resumes", label: "CVs & Resumes", icon: UserCircle },
  { href: "/dashboard/documents", label: "Documents", icon: FileText },
  { href: "/dashboard/referrals", label: "Referrals", icon: Gift },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export function Sidebar({
  user,
  minutesLeft,
  isFree,
}: {
  user: { name: string; email: string };
  minutesLeft: number;
  isFree: boolean;
}) {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  return (
    <aside className="flex h-screen w-64 shrink-0 flex-col border-r border-border-soft bg-surface">
      <div className="border-b border-border-soft p-5">
        <Link href="/dashboard">
          <Logo />
        </Link>
      </div>

      <nav className="flex-1 space-y-1 p-3">
        {nav.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
                active
                  ? "bg-black/6 text-foreground"
                  : "text-muted hover:bg-black/5 hover:text-foreground"
              )}
            >
              <Icon className="size-4" />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="space-y-1 border-t border-border-soft p-3">
        <Link
          href="/dashboard/help"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted hover:bg-black/5 hover:text-foreground"
        >
          <HelpCircle className="size-4" /> Get help
        </Link>
        <Link
          href="/dashboard/tutorials"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted hover:bg-black/5 hover:text-foreground"
        >
          <Video className="size-4" /> Tutorials
        </Link>
      </div>

      <div className="border-t border-border-soft p-4">
        <div className="rounded-xl border border-border-soft bg-surface-2 p-4">
          <div className="mb-2 flex items-center justify-between">
            <p className="flex items-center gap-1.5 text-sm font-medium text-foreground">
              <CreditCard className="size-3.5 text-brand-2" />
              {isFree ? "Free Plan" : "Your Plan"}
            </p>
          </div>
          <p className="text-xs text-muted-2">
            {minutesLeft > 0
              ? `${minutesLeft} min available`
              : "No minutes left"}
          </p>
          <Link
            href="/dashboard/billing"
            className="mt-3 block w-full rounded-lg bg-accent px-3 py-2 text-center text-xs font-semibold text-accent-foreground"
          >
            {isFree ? "Upgrade" : "Buy more minutes"}
          </Link>
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-border-soft p-4">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-foreground">
            {user.name}
          </p>
          <p className="truncate text-xs text-muted-2">{user.email}</p>
        </div>
        <button
          onClick={logout}
          className="rounded-lg p-2 text-muted hover:bg-black/5 hover:text-danger"
          title="Sign out"
        >
          <LogOut className="size-4" />
        </button>
      </div>
    </aside>
  );
}
