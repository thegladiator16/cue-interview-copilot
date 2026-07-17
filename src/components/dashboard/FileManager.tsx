"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { FileText, Trash2, Upload, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";

type FileItem = { id: string; filename: string; createdAt: string };

export function FileManager({
  kind,
  title,
  description,
  emptyLabel,
  initialFiles,
}: {
  kind: "resumes" | "documents";
  title: string;
  description: string;
  emptyLabel: string;
  initialFiles: FileItem[];
}) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState(initialFiles);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onFileSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    setUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(`/api/${kind}`, { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Upload failed.");
        return;
      }
      const created = kind === "resumes" ? data.resume : data.document;
      setFiles((prev) => [created, ...prev]);
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setUploading(false);
    }
  }

  async function onDelete(id: string) {
    setFiles((prev) => prev.filter((f) => f.id !== id));
    await fetch(`/api/${kind}/${id}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-3xl px-8 py-10">
      <h1 className="text-2xl font-semibold text-foreground">{title}</h1>
      <p className="mt-1 text-muted">{description}</p>

      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.docx,.doc,.txt,.md,.rtf,.html,.htm,.csv,.json"
        className="hidden"
        onChange={onFileSelected}
      />

      <div className="mt-6">
        <Button onClick={() => inputRef.current?.click()} disabled={uploading}>
          {uploading ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Upload className="size-4" />
          )}
          Upload file
        </Button>
        {error && <p className="mt-2 text-sm text-danger">{error}</p>}
      </div>

      <div className="mt-8 space-y-2">
        {files.length === 0 && (
          <div className="rounded-[var(--radius-lg)] border border-dashed border-border-strong py-16 text-center">
            <p className="text-sm text-muted-2">{emptyLabel}</p>
          </div>
        )}

        {files.map((file) => (
          <div
            key={file.id}
            className="flex items-center gap-3 rounded-xl border border-border-soft bg-surface px-4 py-3.5"
          >
            <FileText className="size-4 shrink-0 text-brand-2" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm text-foreground">{file.filename}</p>
              <p className="text-xs text-muted-2">
                {new Date(file.createdAt).toLocaleDateString("en-US", {
                  year: "numeric", month: "short", day: "numeric"
                })}
              </p>
            </div>
            <button
              onClick={() => onDelete(file.id)}
              className="rounded-lg p-2 text-muted hover:bg-black/5 hover:text-danger"
              title="Delete"
            >
              <Trash2 className="size-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
