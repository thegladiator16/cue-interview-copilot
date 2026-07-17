"use client"

import { useState, useEffect } from "react"
import { Settings, Save, Loader2, User, Bell, Sliders, Trash2, Shield } from "lucide-react"
import { useRouter } from "next/navigation"

type UserSettings = {
  name: string
  email: string
  defaultFormat: string
  defaultTone: string
  defaultLength: string
  autoAnswer: boolean
  emailNotifications: boolean
  autoDeleteAfterDays: number
  plan: string
}

export default function SettingsPage() {
  const router = useRouter()
  const [settings, setSettings] = useState<UserSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState(false)

  useEffect(() => {
    fetch("/api/users/settings")
      .then(r => r.json())
      .then(data => { setSettings(data); setLoading(false) })
      .catch(() => { setError("Failed to load settings"); setLoading(false) })
  }, [])

  async function save() {
    if (!settings) return
    setSaving(true)
    setSaved(false)
    setError(null)
    try {
      const res = await fetch("/api/users/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: settings.name,
          defaultFormat: settings.defaultFormat,
          defaultTone: settings.defaultTone,
          defaultLength: settings.defaultLength,
          autoAnswer: settings.autoAnswer,
          emailNotifications: settings.emailNotifications,
          autoDeleteAfterDays: settings.autoDeleteAfterDays,
        }),
      })
      if (!res.ok) throw new Error()
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch {
      setError("Failed to save settings")
    } finally {
      setSaving(false)
    }
  }

  async function deleteAccount() {
    if (!confirm("This will permanently delete your account and all data. Are you sure?")) return
    await fetch("/api/auth/logout", { method: "POST" })
    router.push("/")
  }

  if (loading) return (
    <div className="mx-auto max-w-2xl px-8 py-10">
      <div className="skeleton h-8 w-48 mb-8" />
      <div className="space-y-4">
        <div className="skeleton h-24 w-full rounded-xl" />
        <div className="skeleton h-24 w-full rounded-xl" />
        <div className="skeleton h-24 w-full rounded-xl" />
      </div>
    </div>
  )

  if (!settings) return null

  return (
    <div className="mx-auto max-w-2xl px-8 py-10">
      <div className="flex items-center gap-2 mb-2">
        <Settings className="size-5 text-brand-2" />
        <h1 className="text-2xl font-semibold text-foreground">Settings</h1>
      </div>
      <p className="text-muted mb-8">Manage your account and default preferences.</p>

      {/* Profile */}
      <section className="rounded-[var(--radius-lg)] border border-border-soft bg-surface p-6 mb-6">
        <h2 className="text-sm font-medium text-foreground mb-4 flex items-center gap-2">
          <User className="size-4 text-brand-2" /> Profile
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-muted-2 mb-1.5">Display name</label>
            <input
              value={settings.name}
              onChange={e => setSettings({ ...settings, name: e.target.value })}
              className="w-full rounded-lg border border-border-strong bg-surface-2 px-3 py-2 text-sm text-foreground outline-none focus:border-brand"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-muted-2 mb-1.5">Email</label>
            <input
              value={settings.email}
              disabled
              className="w-full rounded-lg border border-border-soft bg-surface-2 px-3 py-2 text-sm text-muted-2 cursor-not-allowed"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-muted-2 mb-1.5">Plan</label>
            <p className="text-sm text-foreground capitalize">{settings.plan === "free" ? "Free plan" : settings.plan + " plan"}</p>
          </div>
        </div>
      </section>

      {/* Default Preferences */}
      <section className="rounded-[var(--radius-lg)] border border-border-soft bg-surface p-6 mb-6">
        <h2 className="text-sm font-medium text-foreground mb-4 flex items-center gap-2">
          <Sliders className="size-4 text-brand-2" /> Default Preferences
        </h2>
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-muted-2 mb-1.5">Answer format</label>
              <select
                value={settings.defaultFormat}
                onChange={e => setSettings({ ...settings, defaultFormat: e.target.value })}
                className="w-full rounded-lg border border-border-strong bg-surface-2 px-3 py-2 text-sm text-foreground outline-none focus:border-brand"
              >
                <option value="paragraph">Paragraph</option>
                <option value="star">STAR format</option>
                <option value="bullet">Bullet points</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-2 mb-1.5">Tone</label>
              <select
                value={settings.defaultTone}
                onChange={e => setSettings({ ...settings, defaultTone: e.target.value })}
                className="w-full rounded-lg border border-border-strong bg-surface-2 px-3 py-2 text-sm text-foreground outline-none focus:border-brand"
              >
                <option value="professional">Professional</option>
                <option value="conversational">Conversational</option>
                <option value="direct">Direct</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-2 mb-1.5">Length</label>
              <select
                value={settings.defaultLength}
                onChange={e => setSettings({ ...settings, defaultLength: e.target.value })}
                className="w-full rounded-lg border border-border-strong bg-surface-2 px-3 py-2 text-sm text-foreground outline-none focus:border-brand"
              >
                <option value="balanced">Balanced</option>
                <option value="brief">Brief</option>
                <option value="thorough">Thorough</option>
              </select>
            </div>
          </div>
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="text-sm text-foreground">Auto-generate answers</p>
              <p className="text-xs text-muted-2">Automatically generate AI answers when a question is detected</p>
            </div>
            <button
              onClick={() => setSettings({ ...settings, autoAnswer: !settings.autoAnswer })}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors ${settings.autoAnswer ? "bg-brand" : "bg-surface-3"}`}
            >
              <span className={`inline-block size-5 transform rounded-full bg-white shadow-sm transition-transform ${settings.autoAnswer ? "translate-x-5" : "translate-x-0.5"} mt-0.5`} />
            </button>
          </div>
        </div>
      </section>

      {/* Notifications */}
      <section className="rounded-[var(--radius-lg)] border border-border-soft bg-surface p-6 mb-6">
        <h2 className="text-sm font-medium text-foreground mb-4 flex items-center gap-2">
          <Bell className="size-4 text-brand-2" /> Notifications
        </h2>
        <div className="flex items-center justify-between py-2">
          <div>
            <p className="text-sm text-foreground">Email notifications</p>
            <p className="text-xs text-muted-2">Receive session summaries and product updates</p>
          </div>
          <button
            onClick={() => setSettings({ ...settings, emailNotifications: !settings.emailNotifications })}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors ${settings.emailNotifications ? "bg-brand" : "bg-surface-3"}`}
          >
            <span className={`inline-block size-5 transform rounded-full bg-white shadow-sm transition-transform ${settings.emailNotifications ? "translate-x-5" : "translate-x-0.5"} mt-0.5`} />
          </button>
        </div>
      </section>

      {/* Privacy & Data */}
      <section className="rounded-[var(--radius-lg)] border border-border-soft bg-surface p-6 mb-6">
        <h2 className="text-sm font-medium text-foreground mb-4 flex items-center gap-2">
          <Shield className="size-4 text-brand-2" /> Privacy & Data
        </h2>
        <div>
          <label className="block text-xs font-medium text-muted-2 mb-1.5">Auto-delete session transcripts</label>
          <select
            value={settings.autoDeleteAfterDays}
            onChange={e => setSettings({ ...settings, autoDeleteAfterDays: Number(e.target.value) })}
            className="w-full max-w-xs rounded-lg border border-border-strong bg-surface-2 px-3 py-2 text-sm text-foreground outline-none focus:border-brand"
          >
            <option value={0}>Never (keep forever)</option>
            <option value={7}>After 7 days</option>
            <option value={30}>After 30 days</option>
            <option value={90}>After 90 days</option>
          </select>
          <p className="mt-1.5 text-xs text-muted-2">
            Ended session transcripts and messages will be permanently deleted after this period.
          </p>
        </div>
      </section>

      {/* Save button */}
      <div className="flex items-center gap-3 mb-10">
        <button
          onClick={save}
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground disabled:opacity-40"
        >
          {saving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
          {saving ? "Saving…" : "Save changes"}
        </button>
        {saved && <span className="text-sm text-green-600">Settings saved</span>}
        {error && <span className="text-sm text-danger">{error}</span>}
      </div>

      {/* Danger zone */}
      <section className="rounded-[var(--radius-lg)] border border-danger/20 bg-danger/5 p-6">
        <h2 className="text-sm font-medium text-danger mb-2">Danger zone</h2>
        <p className="text-xs text-muted mb-4">Permanently delete your account and all associated data. This action cannot be undone.</p>
        {!deleteConfirm ? (
          <button
            onClick={() => setDeleteConfirm(true)}
            className="inline-flex items-center gap-2 rounded-lg border border-danger/30 px-4 py-2 text-sm text-danger hover:bg-danger/10"
          >
            <Trash2 className="size-3.5" /> Delete account
          </button>
        ) : (
          <div className="flex items-center gap-3">
            <button
              onClick={deleteAccount}
              className="inline-flex items-center gap-2 rounded-lg bg-danger px-4 py-2 text-sm font-semibold text-white"
            >
              Yes, delete my account
            </button>
            <button onClick={() => setDeleteConfirm(false)} className="text-sm text-muted hover:text-foreground">
              Cancel
            </button>
          </div>
        )}
      </section>
    </div>
  )
}
