import { cn } from "@/lib/cn";

function GoogleIcon() {
  return (
    <svg viewBox="0 0 48 48" className="size-4 shrink-0" aria-hidden="true">
      <path
        fill="#EA4335"
        d="M24 9.5c3.4 0 6.4 1.2 8.8 3.4l6.5-6.5C35.3 2.7 30 0.5 24 0.5 14.6 0.5 6.5 5.9 2.6 13.8l7.6 5.9C12.1 13.6 17.6 9.5 24 9.5z"
      />
      <path
        fill="#4285F4"
        d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.6c-.5 3-2.2 5.5-4.7 7.2l7.3 5.7c4.3-4 6.8-9.8 6.8-17.4z"
      />
      <path
        fill="#FBBC05"
        d="M10.2 19.7a14.5 14.5 0 0 0 0 8.6l-7.6 5.9a24 24 0 0 1 0-20.4z"
      />
      <path
        fill="#34A853"
        d="M24 47.5c6 0 11.3-2 15-5.4l-7.3-5.7c-2 1.4-4.6 2.2-7.7 2.2-6.4 0-11.9-4.1-13.8-9.9l-7.6 5.9C6.5 42.1 14.6 47.5 24 47.5z"
      />
    </svg>
  );
}

export function GoogleButton({
  mode,
  className,
}: {
  mode: "login" | "signup";
  className?: string;
}) {
  return (
    <a
      href="/api/auth/google"
      className={cn(
        "flex h-11 w-full items-center justify-center gap-2.5 rounded-full border border-border-strong bg-surface-2 text-sm font-medium text-foreground transition-colors hover:bg-black/5",
        className
      )}
    >
      <GoogleIcon />
      {mode === "signup" ? "Sign up with Google" : "Continue with Google"}
    </a>
  );
}
