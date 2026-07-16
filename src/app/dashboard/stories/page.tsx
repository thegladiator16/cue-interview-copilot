"use client"

import { useState, useEffect } from "react"
import { BookMarked, Plus, Trash2, Edit2, X, Save, Tag } from "lucide-react"

type Story = {
  id: string
  title: string
  situation: string
  task: string
  action: string
  result: string
  tags: string[]
  updatedAt: string
}

type StoryForm = Omit<Story, "id" | "updatedAt">
const EMPTY_FORM: StoryForm = { title: "", situation: "", task: "", action: "", result: "", tags: [] }

export default function StoriesPage() {
  const [stories, setStories] = useState<Story[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<StoryForm>(EMPTY_FORM)
  const [tagsInput, setTagsInput] = useState("")
  const [saving, setSaving] = useState(false)

  useEffect(() => { loadStories() }, [])

  async function loadStories() {
    const res = await fetch("/api/stories")
    const data = await res.json()
    setStories(data.stories ?? [])
    setLoading(false)
  }

  async function saveStory() {
    setSaving(true)
    const tags = tagsInput.split(",").map(t => t.trim()).filter(Boolean)
    const payload = { ...form, tags }
    if (editingId) {
      await fetch("/api/stories/" + editingId, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) })
    } else {
      await fetch("/api/stories", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) })
    }
    await loadStories()
    setShowForm(false)
    setEditingId(null)
    setForm(EMPTY_FORM)
    setTagsInput("")
    setSaving(false)
  }

  async function deleteStory(id: string) {
    if (!confirm("Delete this story?")) return
    await fetch("/api/stories/" + id, { method: "DELETE" })
    setStories(stories.filter(s => s.id !== id))
  }

  function startEdit(story: Story) {
    setForm({ title: story.title, situation: story.situation, task: story.task, action: story.action, result: story.result, tags: story.tags })
    setTagsInput(story.tags.join(", "))
    setEditingId(story.id)
    setShowForm(true)
  }

  return (
    <div className="mx-auto max-w-4xl px-8 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <BookMarked className="size-5 text-brand-2" />
            <h1 className="text-2xl font-semibold text-foreground">Story Studio</h1>
          </div>
          <p className="text-muted">Build your personal library of STAR stories for behavioral interviews.</p>
        </div>
        <button onClick={() => { setShowForm(true); setEditingId(null); setForm(EMPTY_FORM); setTagsInput("") }}
          className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground">
          <Plus className="size-4" /> New Story
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="mb-8 rounded-[var(--radius-lg)] border border-brand/30 bg-surface p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold text-foreground">{editingId ? "Edit Story" : "New STAR Story"}</h2>
            <button onClick={() => setShowForm(false)} className="text-muted-2 hover:text-foreground"><X className="size-4" /></button>
          </div>
          <div className="space-y-4">
            <Field label="Title" placeholder="e.g., Led migration to microservices" value={form.title} onChange={v => setForm(f => ({ ...f, title: v }))} />
            <Field label="Situation" placeholder="What was the context or background?" value={form.situation} onChange={v => setForm(f => ({ ...f, situation: v }))} rows={3} />
            <Field label="Task" placeholder="What was your specific responsibility?" value={form.task} onChange={v => setForm(f => ({ ...f, task: v }))} rows={2} />
            <Field label="Action" placeholder="What actions did you personally take?" value={form.action} onChange={v => setForm(f => ({ ...f, action: v }))} rows={4} />
            <Field label="Result" placeholder="What was the measurable outcome?" value={form.result} onChange={v => setForm(f => ({ ...f, result: v }))} rows={2} />
            <div>
              <label className="block text-xs font-medium text-muted-2 mb-1.5">Tags (comma-separated)</label>
              <input value={tagsInput} onChange={e => setTagsInput(e.target.value)} placeholder="leadership, conflict, technical"
                className="w-full rounded-lg border border-border-strong bg-surface-2 px-3 py-2 text-sm text-foreground outline-none focus:border-brand" />
            </div>
          </div>
          <div className="flex gap-3 mt-5">
            <button onClick={saveStory} disabled={!form.title || saving}
              className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground disabled:opacity-40">
              <Save className="size-4" /> {saving ? "Saving…" : "Save Story"}
            </button>
            <button onClick={() => setShowForm(false)} className="text-sm text-muted hover:text-foreground">Cancel</button>
          </div>
        </div>
      )}

      {/* Stories list */}
      {loading && <p className="text-muted text-sm">Loading…</p>}
      {!loading && stories.length === 0 && !showForm && (
        <div className="rounded-[var(--radius-lg)] border border-dashed border-border-soft p-12 text-center">
          <BookMarked className="mx-auto size-8 text-muted-2 mb-4" />
          <p className="font-medium text-foreground mb-2">No stories yet</p>
          <p className="text-sm text-muted mb-4">Start by adding your most impactful work story.</p>
          <button onClick={() => setShowForm(true)} className="text-sm text-brand-2 hover:underline">Add your first story →</button>
        </div>
      )}
      <div className="space-y-4">
        {stories.map(story => (
          <div key={story.id} className="rounded-[var(--radius-lg)] border border-border-soft bg-surface p-6">
            <div className="flex items-start justify-between gap-4 mb-4">
              <h3 className="font-semibold text-foreground">{story.title}</h3>
              <div className="flex gap-2 shrink-0">
                <button onClick={() => startEdit(story)} className="p-1.5 text-muted-2 hover:text-foreground rounded-lg hover:bg-black/5"><Edit2 className="size-3.5" /></button>
                <button onClick={() => deleteStory(story.id)} className="p-1.5 text-muted-2 hover:text-danger rounded-lg hover:bg-black/5"><Trash2 className="size-3.5" /></button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-4">
              {[["Situation", story.situation], ["Task", story.task], ["Action", story.action], ["Result", story.result]].map(([label, text]) => (
                <div key={label} className="rounded-lg bg-surface-2 p-3">
                  <p className="text-xs font-medium text-brand-2 mb-1">{label}</p>
                  <p className="text-xs text-muted leading-relaxed">{String(text).slice(0, 120)}{String(text).length > 120 ? "…" : ""}</p>
                </div>
              ))}
            </div>
            {story.tags.length > 0 && (
              <div className="flex items-center gap-1.5 flex-wrap">
                <Tag className="size-3 text-muted-2" />
                {story.tags.map(tag => (
                  <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-surface-2 text-muted-2">{tag}</span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

function Field({ label, placeholder, value, onChange, rows }: { label: string; placeholder: string; value: string; onChange: (v: string) => void; rows?: number }) {
  return (
    <div>
      <label className="block text-xs font-medium text-muted-2 mb-1.5">{label}</label>
      {rows ? (
        <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={rows}
          className="w-full rounded-lg border border-border-strong bg-surface-2 px-3 py-2 text-sm text-foreground outline-none focus:border-brand resize-none" />
      ) : (
        <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
          className="w-full rounded-lg border border-border-strong bg-surface-2 px-3 py-2 text-sm text-foreground outline-none focus:border-brand" />
      )}
    </div>
  )
}
