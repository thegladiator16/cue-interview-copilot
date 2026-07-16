"use client"

import { useState } from "react"
import Link from "next/link"
import { questions } from "@/data/questions"
import type { Question } from "@/data/questions"
import { Search, BookOpen } from "lucide-react"

const CATEGORIES = ["all", "behavioral", "technical", "system-design", "product", "leadership"]
const COMPANIES = ["all", "google", "meta", "amazon", "microsoft", "apple", "netflix", "stripe", "general"]

export default function QuestionBankPage() {
  const [category, setCategory] = useState("all")
  const [company, setCompany] = useState("all")
  const [search, setSearch] = useState("")

  const filtered = questions.filter(q => {
    if (category !== "all" && q.category !== category) return false
    if (company !== "all" && q.company !== company) return false
    if (search && !q.text.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  return (
    <div className="mx-auto max-w-5xl px-8 py-10">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <BookOpen className="size-5 text-brand-2" />
          <h1 className="text-2xl font-semibold text-foreground">Question Bank</h1>
        </div>
        <p className="text-muted">{questions.length}+ real interview questions from top companies</p>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-2" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search questions…"
          className="w-full rounded-[var(--radius-lg)] border border-border-strong bg-surface pl-11 pr-4 py-3 text-sm text-foreground outline-none focus:border-brand placeholder:text-muted-2"
        />
      </div>

      {/* Category tabs */}
      <div className="flex gap-2 flex-wrap mb-4">
        {CATEGORIES.map(c => (
          <button key={c} onClick={() => setCategory(c)}
            className={"rounded-full px-4 py-1.5 text-xs font-medium transition-colors " + (category === c ? "bg-accent text-accent-foreground" : "border border-border-soft text-muted hover:text-foreground")}>
            {c === "all" ? "All" : c.charAt(0).toUpperCase() + c.slice(1).replace("-", " ")}
          </button>
        ))}
      </div>

      {/* Company chips */}
      <div className="flex gap-2 flex-wrap mb-8">
        {COMPANIES.map(c => (
          <button key={c} onClick={() => setCompany(c)}
            className={"rounded-full px-3 py-1 text-xs transition-colors " + (company === c ? "bg-brand/20 text-brand-2 border border-brand/30" : "border border-border-soft text-muted-2 hover:text-foreground")}>
            {c === "all" ? "All companies" : c.charAt(0).toUpperCase() + c.slice(1)}
          </button>
        ))}
      </div>

      {/* Count */}
      <p className="text-sm text-muted-2 mb-4">{filtered.length} questions</p>

      {/* Grid */}
      <div className="grid gap-4 sm:grid-cols-2">
        {filtered.map(q => (
          <QuestionCard key={q.id} q={q} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-20 text-muted">No questions match your filters.</div>
      )}
    </div>
  )
}

function QuestionCard({ q }: { q: Question }) {
  return (
    <div className="rounded-[var(--radius-lg)] border border-border-soft bg-surface p-5 flex flex-col gap-3">
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs px-2 py-0.5 rounded-full bg-brand/10 text-brand-2 font-medium">
          {q.category.replace("-", " ")}
        </span>
        {q.company && q.company !== "general" && (
          <span className="text-xs px-2 py-0.5 rounded-full border border-border-soft text-muted-2 capitalize">
            {q.company}
          </span>
        )}
        <span className={"ml-auto text-xs " + (q.difficulty === "hard" ? "text-red-600" : q.difficulty === "medium" ? "text-amber-600" : "text-green-600")}>
          {q.difficulty}
        </span>
      </div>
      <p className="text-sm text-foreground leading-relaxed">{q.text}</p>
      <Link href={"/dashboard/practice/" + q.category + "?q=" + q.id}
        className="mt-auto inline-flex items-center gap-1.5 text-xs font-medium text-brand-2 hover:underline">
        Practice this question →
      </Link>
    </div>
  )
}
