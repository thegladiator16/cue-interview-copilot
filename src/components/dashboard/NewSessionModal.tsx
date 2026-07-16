"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { X, Loader2, Briefcase, Phone } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";

type Resume = { id: string; filename: string };

export function NewSessionModal({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const [type, setType] = useState<"interview" | "call">("interview");
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [resumeId, setResumeId] = useState("");
  const [extraContext, setExtraContext] = useState("");
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/resumes")
      .then((r) => r.json())
      .then((d) => setResumes(d.resumes ?? []));
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          company: company || undefined,
          role: role || undefined,
          resumeId: resumeId || undefined,
          extraContext: extraContext || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Couldn't start the session.");
        setLoading(false);
        return;
      }
      router.push(`/dashboard/sessions/${data.session.id}`);
    } catch {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div className="w-full max-w-lg rounded-[var(--radius-lg)] border border-border-strong bg-surface p-6">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">New session</h2>
          <button onClick={onClose} className="rounded-lg p-1.5 text-muted hover:bg-black/5">
            <X className="size-4" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="flex gap-2 rounded-full border border-border-strong bg-surface-2 p-1">
            <button
              type="button"
              onClick={() => setType("interview")}
              className={cn(
                "flex flex-1 items-center justify-center gap-2 rounded-full py-2 text-sm font-medium transition-colors",
                type === "interview" ? "bg-accent text-accent-foreground" : "text-muted"
              )}
            >
              <Briefcase className="size-3.5" /> Interview
            </button>
            <button
              type="button"
              onClick={() => setType("call")}
              className={cn(
                "flex flex-1 items-center justify-center gap-2 rounded-full py-2 text-sm font-medium transition-colors",
                type === "call" ? "bg-accent text-accent-foreground" : "text-muted"
              )}
            >
              <Phone className="size-3.5" /> Regular call
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted">Company</label>
              <input
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="Microsoft"
                className="w-full rounded-lg border border-border-strong bg-surface-2 px-3 py-2 text-sm text-foreground outline-none focus:border-brand"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted">Role</label>
              <input
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="Backend Engineer"
                className="w-full rounded-lg border border-border-strong bg-surface-2 px-3 py-2 text-sm text-foreground outline-none focus:border-brand"
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted">Resume</label>
            <select
              value={resumeId}
              onChange={(e) => setResumeId(e.target.value)}
              className="w-full rounded-lg border border-border-strong bg-surface-2 px-3 py-2 text-sm text-foreground outline-none focus:border-brand"
            >
              <option value="">No resume selected</option>
              {resumes.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.filename}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted">
              Extra context (optional)
            </label>
            <textarea
              value={extraContext}
              onChange={(e) => setExtraContext(e.target.value)}
              rows={3}
              placeholder="Paste the job description or anything else Cue should know…"
              className="w-full resize-none rounded-lg border border-border-strong bg-surface-2 px-3 py-2 text-sm text-foreground outline-none focus:border-brand"
            />
          </div>

          {error && (
            <p className="rounded-lg border border-danger/30 bg-danger/10 px-3 py-2 text-sm text-danger">
              {error}
            </p>
          )}

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="secondary"
              className="flex-1"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1" disabled={loading}>
              {loading ? <Loader2 className="size-4 animate-spin" /> : "Start session"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
