"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Mic,
  MicOff,
  Send,
  PhoneOff,
  Sparkles,
  AlertTriangle,
  Settings,
  Copy,
  Check,
  ArrowRight,
  Globe,
  Keyboard,
} from "lucide-react";
import { Button } from "@/components/ui/Button";

type Message = { id: string; role: "question" | "answer"; content: string };
type AnswerFormat = "star" | "bullet" | "paragraph";
type AnswerTone = "professional" | "conversational" | "direct";
type AnswerLength = "brief" | "balanced" | "thorough";
type SessionMode = "general" | "behavioral" | "technical" | "system-design";

interface SpeechRecognitionResultLike {
  0: { transcript: string };
  isFinal: boolean;
}
interface SpeechRecognitionEventLike {
  resultIndex: number;
  results: ArrayLike<SpeechRecognitionResultLike>;
}
interface SpeechRecognitionLike extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
}
type SpeechRecognitionCtor = new () => SpeechRecognitionLike;

function getSpeechRecognitionCtor(): SpeechRecognitionCtor | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as {
    SpeechRecognition?: SpeechRecognitionCtor;
    webkitSpeechRecognition?: SpeechRecognitionCtor;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

const starLabels: Record<string, string> = {
  Situation: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  Task: "bg-purple-500/10 text-purple-600 border-purple-500/20",
  Action: "bg-brand/10 text-brand-2 border-brand/20",
  Result: "bg-green-500/10 text-green-600 border-green-500/20",
};

const LANGUAGES = [
  { code: "en-US", label: "English (US)" },
  { code: "en-GB", label: "English (UK)" },
  { code: "hi-IN", label: "Hindi" },
  { code: "es-ES", label: "Spanish" },
  { code: "fr-FR", label: "French" },
  { code: "de-DE", label: "German" },
  { code: "zh-CN", label: "Chinese (Mandarin)" },
  { code: "ja-JP", label: "Japanese" },
  { code: "ko-KR", label: "Korean" },
  { code: "pt-BR", label: "Portuguese (BR)" },
  { code: "ar-SA", label: "Arabic" },
  { code: "it-IT", label: "Italian" },
  { code: "nl-NL", label: "Dutch" },
  { code: "ru-RU", label: "Russian" },
];

function renderAnswer(content: string, format: AnswerFormat) {
  if (format !== "star") {
    return (
      <p className="text-sm leading-relaxed text-foreground/90 whitespace-pre-wrap">
        {content}
      </p>
    );
  }

  const starPattern = /\*\*(Situation|Task|Action|Result):\*\*/g;
  const parts = content.split(starPattern);

  if (parts.length <= 1) {
    return (
      <p className="text-sm leading-relaxed text-foreground/90 whitespace-pre-wrap">
        {content}
      </p>
    );
  }

  const sections: Array<{ label: string; text: string } | { label: null; text: string }> = [];
  if (parts[0].trim()) {
    sections.push({ label: null, text: parts[0].trim() });
  }
  let i = 1;
  while (i < parts.length - 1) {
    sections.push({ label: parts[i], text: parts[i + 1].trim() });
    i += 2;
  }

  return (
    <div className="space-y-3">
      {sections.map((section, idx) => {
        if (section.label === null) {
          return (
            <p key={idx} className="text-sm leading-relaxed text-foreground/90">
              {section.text}
            </p>
          );
        }
        const labelClass = starLabels[section.label] ?? "bg-surface-2 text-muted-2 border-border-soft";
        return (
          <div key={idx} className="animate-fade-up" style={{ animationDelay: `${idx * 40}ms` }}>
            <span className={`mb-1.5 inline-block rounded-md border px-2 py-0.5 text-xs font-semibold ${labelClass}`}>
              {section.label}
            </span>
            <p className="text-sm leading-relaxed text-foreground/90">{section.text}</p>
          </div>
        );
      })}
    </div>
  );
}

const SESSION_MODES: { id: SessionMode; label: string }[] = [
  { id: "general", label: "General" },
  { id: "behavioral", label: "Behavioral" },
  { id: "technical", label: "Technical" },
  { id: "system-design", label: "System Design" },
];

export function CallSessionRoom({
  sessionId,
  company,
  role,
  initialMessages,
  initialSecondsUsed,
  allowedSeconds,
  isUnlimited,
  alreadyEnded,
}: {
  sessionId: string;
  company: string | null;
  role: string | null;
  initialMessages: Message[];
  initialSecondsUsed: number;
  allowedSeconds: number;
  isUnlimited: boolean;
  alreadyEnded: boolean;
}) {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [elapsed, setElapsed] = useState(initialSecondsUsed);
  const [listening, setListening] = useState(false);
  const [interim, setInterim] = useState("");
  const [manualInput, setManualInput] = useState("");
  const [streamingAnswer, setStreamingAnswer] = useState("");
  const [asking, setAsking] = useState(false);
  const [ended, setEnded] = useState(alreadyEnded);
  const [notice, setNotice] = useState<string | null>(null);
  const [speechSupported] = useState(() => getSpeechRecognitionCtor() !== null);

  const [answerFormat, setAnswerFormat] = useState<AnswerFormat>("paragraph");
  const [answerTone, setAnswerTone] = useState<AnswerTone>("professional");
  const [answerLength, setAnswerLength] = useState<AnswerLength>("balanced");
  const [showSettings, setShowSettings] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [sessionMode, setSessionMode] = useState<SessionMode>("general");
  const [speechLang, setSpeechLang] = useState("en-US");
  const [showShortcuts, setShowShortcuts] = useState(false);

  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const elapsedRef = useRef(initialSecondsUsed);
  const endingRef = useRef(false);
  const transcriptEndRef = useRef<HTMLDivElement>(null);
  const answersEndRef = useRef<HTMLDivElement>(null);
  const listeningRef = useRef(false);

  const timeLeft = isUnlimited ? Infinity : allowedSeconds - elapsed;
  const mins = Math.floor(Math.max(0, elapsed) / 60);
  const secs = Math.max(0, elapsed) % 60;
  const minsLeft = Math.max(0, Math.floor(timeLeft / 60));

  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, interim]);

  useEffect(() => {
    answersEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [streamingAnswer, messages]);

  const endSession = useCallback(
    async (reason?: string) => {
      if (endingRef.current) return;
      endingRef.current = true;
      recognitionRef.current?.stop?.();
      setListening(false);
      listeningRef.current = false;
      setEnded(true);
      if (reason) setNotice(reason);

      await fetch(`/api/sessions/${sessionId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ secondsUsed: elapsedRef.current, status: "ended" }),
      });
      router.refresh();
    },
    [sessionId, router]
  );

  // Timer
  useEffect(() => {
    if (ended) return;
    const interval = setInterval(() => {
      elapsedRef.current += 1;
      setElapsed(elapsedRef.current);

      if (!isUnlimited && elapsedRef.current >= allowedSeconds) {
        endSession("You're out of minutes — this session has ended.");
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [ended, isUnlimited, allowedSeconds, endSession]);

  // Autosave
  useEffect(() => {
    if (ended) return;
    const interval = setInterval(() => {
      fetch(`/api/sessions/${sessionId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ secondsUsed: elapsedRef.current }),
      }).catch(() => {});
    }, 20000);
    return () => clearInterval(interval);
  }, [ended, sessionId]);

  const askQuestion = useCallback(
    async (question: string) => {
      const trimmed = question.trim();
      if (!trimmed || asking) return;

      setAsking(true);
      setStreamingAnswer("");
      const tempId = `local-${Date.now()}`;
      setMessages((prev) => [...prev, { id: tempId, role: "question", content: trimmed }]);

      try {
        const res = await fetch(`/api/sessions/${sessionId}/answer`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            question: trimmed,
            format: answerFormat,
            tone: answerTone,
            length: answerLength,
            mode: sessionMode,
          }),
        });

        if (!res.ok || !res.body) {
          const data = await res.json().catch(() => null);
          setNotice(data?.error ?? "Couldn't generate an answer.");
          setAsking(false);
          return;
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let full = "";
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          full += decoder.decode(value, { stream: true });
          setStreamingAnswer(full);
        }

        setMessages((prev) => [
          ...prev,
          { id: `${tempId}-a`, role: "answer", content: full },
        ]);
        setStreamingAnswer("");
      } catch {
        setNotice("Network error while generating an answer.");
      } finally {
        setAsking(false);
      }
    },
    [sessionId, asking, answerFormat, answerTone, answerLength, sessionMode]
  );

  // Speech recognition — recreate when language changes
  useEffect(() => {
    const SpeechRecognitionImpl = getSpeechRecognitionCtor();
    if (!SpeechRecognitionImpl) return;

    const recognition = new SpeechRecognitionImpl();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = speechLang;

    recognition.onresult = (event) => {
      let interimText = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          askQuestion(result[0].transcript);
          setInterim("");
        } else {
          interimText += result[0].transcript;
        }
      }
      if (interimText) setInterim(interimText);
    };

    recognition.onerror = () => setListening(false);
    recognition.onend = () => {
      if (listeningRef.current && !endingRef.current) {
        try { recognition.start(); } catch { setListening(false); listeningRef.current = false; }
      } else {
        setListening(false);
        listeningRef.current = false;
      }
    };

    recognitionRef.current = recognition;

    if (listeningRef.current) {
      try { recognition.start(); } catch { /* already running */ }
    }

    return () => {
      recognition.onresult = null;
      recognition.onerror = null;
      recognition.onend = null;
      recognition.stop?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [speechLang]);

  function toggleListening() {
    if (!recognitionRef.current) return;
    if (listening) {
      recognitionRef.current.stop();
      setListening(false);
      listeningRef.current = false;
    } else {
      try {
        recognitionRef.current.start();
        setListening(true);
        listeningRef.current = true;
      } catch {
        // already started
      }
    }
  }

  function copyLastAnswer() {
    const answers = messages.filter((m) => m.role === "answer");
    const last = answers[answers.length - 1];
    if (!last) return;
    navigator.clipboard.writeText(last.content);
    setCopiedId(last.id);
    setTimeout(() => setCopiedId(null), 2000);
  }

  // Keyboard shortcuts
  useEffect(() => {
    function handler(e: KeyboardEvent) {
      const meta = e.metaKey || e.ctrlKey;

      // Cmd/Ctrl+Enter → send typed question
      if (meta && e.key === "Enter") {
        if (manualInput.trim()) {
          askQuestion(manualInput);
          setManualInput("");
        }
        return;
      }

      // Cmd/Ctrl+M → toggle mic
      if (meta && e.key === "m") {
        e.preventDefault();
        if (!ended) toggleListening();
        return;
      }

      // Cmd/Ctrl+Shift+C → copy last answer
      if (meta && e.shiftKey && e.key === "C") {
        e.preventDefault();
        copyLastAnswer();
        return;
      }

      // Cmd/Ctrl+E → end session
      if (meta && e.key === "e") {
        e.preventDefault();
        if (!ended) endSession();
        return;
      }

      // Escape → close panels
      if (e.key === "Escape") {
        setShowSettings(false);
        setShowShortcuts(false);
        return;
      }

      // ? → toggle shortcuts help
      if (e.key === "/" && meta) {
        e.preventDefault();
        setShowShortcuts((v) => !v);
      }
    }
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [manualInput, asking, ended, listening]);

  function onManualSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (manualInput.trim()) {
      askQuestion(manualInput);
      setManualInput("");
    }
  }

  function handleCopy(id: string, content: string) {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  }

  return (
    <div className="flex h-screen flex-col bg-background">
      {/* ── Header ── */}
      <header className="flex shrink-0 items-center justify-between border-b border-border-soft bg-surface/80 px-6 py-3 backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-sm font-semibold text-foreground">
              {[role, company].filter(Boolean).join(" · ") || "Call session"}
            </h1>
            <div className="mt-0.5 flex items-center gap-2">
              {!ended ? (
                <>
                  <span className="live-beacon" />
                  <span className="tabular-nums text-xs text-danger">
                    {String(mins).padStart(2, "0")}:{String(secs).padStart(2, "0")}
                  </span>
                  {!isUnlimited && (
                    <span className="text-xs text-muted-2">· {minsLeft} min left</span>
                  )}
                </>
              ) : (
                <span className="text-xs text-muted-2">Session ended</span>
              )}
            </div>
          </div>

          {/* Mode switcher */}
          {!ended && (
            <div className="ml-4 hidden items-center gap-1 rounded-lg border border-border-soft bg-surface-2 p-0.5 sm:flex">
              {SESSION_MODES.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setSessionMode(m.id)}
                  className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${
                    sessionMode === m.id
                      ? "bg-surface-3 text-foreground shadow-sm"
                      : "text-muted hover:text-foreground"
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Language selector */}
          {!ended && speechSupported && (
            <label className="flex items-center gap-1.5 text-xs text-muted-2">
              <Globe className="size-3.5" />
              <select
                value={speechLang}
                onChange={(e) => setSpeechLang(e.target.value)}
                className="rounded-lg border border-border-soft bg-surface-2 px-2 py-1.5 text-xs text-foreground outline-none focus:border-brand/50"
              >
                {LANGUAGES.map((l) => (
                  <option key={l.code} value={l.code}>{l.label}</option>
                ))}
              </select>
            </label>
          )}

          {/* Shortcuts help */}
          <button
            onClick={() => setShowShortcuts((v) => !v)}
            className="rounded-lg p-1.5 text-muted-2 hover:bg-surface-2 hover:text-foreground"
            title="Keyboard shortcuts (⌘/)"
          >
            <Keyboard className="size-4" />
          </button>

          {ended && (
            <Link
              href={`/dashboard/sessions/${sessionId}/summary`}
              className="inline-flex items-center gap-2 rounded-lg border border-brand/30 bg-brand/10 px-3 py-1.5 text-sm font-medium text-brand-2 transition-colors hover:bg-brand/20"
            >
              View summary <ArrowRight className="size-3.5" />
            </Link>
          )}
          {!ended && (
            <Button
              variant="secondary"
              onClick={() => endSession()}
              className="flex items-center gap-2 text-sm"
            >
              <PhoneOff className="size-3.5" /> End
            </Button>
          )}
        </div>
      </header>

      {/* Shortcuts overlay */}
      {showShortcuts && (
        <div className="mx-6 mt-3 shrink-0 rounded-lg border border-border-soft bg-surface p-4 animate-fade-up">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-2">Keyboard shortcuts</p>
            <button onClick={() => setShowShortcuts(false)} className="text-xs text-muted-2 hover:text-foreground">✕</button>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {[
              ["⌘/Ctrl + Enter", "Send typed question"],
              ["⌘/Ctrl + M", "Toggle microphone"],
              ["⌘/Ctrl + Shift + C", "Copy last answer"],
              ["⌘/Ctrl + E", "End session"],
              ["⌘/Ctrl + /", "Toggle this panel"],
              ["Escape", "Close panels"],
            ].map(([key, desc]) => (
              <div key={key} className="flex items-center justify-between rounded-lg bg-surface-2 px-3 py-2">
                <span className="text-muted-2">{desc}</span>
                <kbd className="ml-2 rounded bg-surface-3 px-2 py-0.5 font-mono text-[10px] text-foreground">{key}</kbd>
              </div>
            ))}
          </div>
        </div>
      )}

      {notice && (
        <div className="mx-6 mt-3 flex shrink-0 items-center gap-2 rounded-lg border border-amber-500/30 bg-amber-500/8 px-4 py-2.5 text-sm text-amber-700 animate-fade-up">
          <AlertTriangle className="size-4 shrink-0" />
          {notice}
          <button
            onClick={() => setNotice(null)}
            className="ml-auto text-xs text-amber-500 hover:text-amber-700"
          >
            ✕
          </button>
        </div>
      )}

      {/* ── Two-column room ── */}
      <div className="flex min-h-0 flex-1 gap-0">
        {/* Transcript panel */}
        <div className="flex w-1/2 flex-col border-r border-border-soft">
          <div className="flex shrink-0 items-center justify-between border-b border-border-soft px-5 py-2.5">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-2">
              Transcript
            </p>
            {listening && (
              <span className="flex items-center gap-1.5 text-xs text-danger">
                <span className="live-beacon" /> Listening
              </span>
            )}
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-2.5">
              {messages
                .filter((m) => m.role === "question")
                .map((m, i) => (
                  <div
                    key={m.id}
                    className="animate-fade-up rounded-xl bg-surface-2 px-4 py-3 text-sm text-foreground/90"
                    style={{ animationDelay: `${i * 20}ms` }}
                  >
                    {m.content}
                  </div>
                ))}

              {interim && (
                <div className="rounded-xl border border-dashed border-border-strong px-4 py-3 text-sm italic text-muted-2">
                  {interim}
                  <span className="stream-cursor" />
                </div>
              )}

              {messages.filter((m) => m.role === "question").length === 0 && !interim && (
                <div className="flex h-32 flex-col items-center justify-center text-center">
                  <p className="text-sm text-muted-2">
                    {speechSupported
                      ? "Click the mic or press ⌘M to start listening."
                      : "Your browser doesn't support live transcription — type questions below."}
                  </p>
                </div>
              )}
              <div ref={transcriptEndRef} />
            </div>
          </div>

          {/* Input bar */}
          <div className="shrink-0 border-t border-border-soft p-3">
            <div className="flex gap-2">
              {speechSupported && (
                <button
                  onClick={toggleListening}
                  disabled={ended}
                  title={listening ? "Stop listening (⌘M)" : "Start listening (⌘M)"}
                  className={`flex size-10 shrink-0 items-center justify-center rounded-full transition-colors disabled:opacity-40 ${
                    listening
                      ? "bg-danger text-white shadow-[0_0_12px_rgba(255,107,107,0.4)]"
                      : "bg-surface-2 text-muted hover:bg-surface-3 hover:text-foreground"
                  }`}
                >
                  {listening ? <MicOff className="size-4" /> : <Mic className="size-4" />}
                </button>
              )}
              <form onSubmit={onManualSubmit} className="flex flex-1 gap-2">
                <input
                  value={manualInput}
                  onChange={(e) => setManualInput(e.target.value)}
                  disabled={ended}
                  placeholder="Type question… (⌘↵ to send)"
                  className="flex-1 rounded-xl border border-border-strong bg-surface-2 px-4 py-2 text-sm text-foreground outline-none placeholder:text-muted-2 focus:border-brand/50 focus:ring-1 focus:ring-brand/20 disabled:opacity-40"
                />
                <button
                  type="submit"
                  disabled={ended || asking || !manualInput.trim()}
                  className="flex size-10 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground transition-opacity disabled:opacity-40"
                >
                  <Send className="size-4" />
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Cue Suggests panel */}
        <div className="flex w-1/2 flex-col">
          <div className="flex shrink-0 items-center justify-between border-b border-border-soft px-5 py-2.5">
            <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-brand-2">
              <Sparkles className="size-3.5" /> Cue Suggests
            </p>
            <button
              onClick={() => setShowSettings((v) => !v)}
              className={`rounded-lg p-1.5 transition-colors ${
                showSettings
                  ? "bg-brand/15 text-brand-2"
                  : "text-muted-2 hover:bg-surface-2 hover:text-foreground"
              }`}
              title="Answer settings"
            >
              <Settings className="size-3.5" />
            </button>
          </div>

          {/* Settings bar */}
          {showSettings && (
            <div className="shrink-0 border-b border-border-soft bg-surface-2/60 px-5 py-3">
              <div className="flex flex-wrap items-center gap-4">
                {[
                  {
                    label: "Format",
                    value: answerFormat,
                    onChange: (v: string) => setAnswerFormat(v as AnswerFormat),
                    options: [
                      { value: "paragraph", label: "Paragraph" },
                      { value: "star", label: "STAR" },
                      { value: "bullet", label: "Bullet points" },
                    ],
                  },
                  {
                    label: "Tone",
                    value: answerTone,
                    onChange: (v: string) => setAnswerTone(v as AnswerTone),
                    options: [
                      { value: "professional", label: "Professional" },
                      { value: "conversational", label: "Conversational" },
                      { value: "direct", label: "Direct" },
                    ],
                  },
                  {
                    label: "Length",
                    value: answerLength,
                    onChange: (v: string) => setAnswerLength(v as AnswerLength),
                    options: [
                      { value: "balanced", label: "Balanced" },
                      { value: "brief", label: "Brief" },
                      { value: "thorough", label: "Thorough" },
                    ],
                  },
                ].map(({ label, value, onChange, options }) => (
                  <label key={label} className="flex items-center gap-2 text-xs text-muted-2">
                    <span className="shrink-0">{label}</span>
                    <select
                      value={value}
                      onChange={(e) => onChange(e.target.value)}
                      className="rounded-lg border border-border-strong bg-surface px-2 py-1 text-xs text-foreground outline-none focus:border-brand/50"
                    >
                      {options.map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                  </label>
                ))}
              </div>
            </div>
          )}

          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-4">
              {messages
                .filter((m) => m.role === "answer")
                .map((m) => (
                  <div
                    key={m.id}
                    className="group relative rounded-xl border border-border-soft bg-surface-2/50 p-4 animate-fade-up"
                  >
                    {renderAnswer(m.content, answerFormat)}
                    <button
                      onClick={() => handleCopy(m.id, m.content)}
                      className="absolute right-3 top-3 rounded-lg p-1.5 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-surface-3"
                      title="Copy answer"
                    >
                      {copiedId === m.id ? (
                        <Check className="size-3.5 text-success" />
                      ) : (
                        <Copy className="size-3.5 text-muted-2" />
                      )}
                    </button>
                  </div>
                ))}

              {asking && (
                <div className="rounded-xl border border-brand/20 bg-brand/5 p-4">
                  <p className="text-sm leading-relaxed text-foreground/90 whitespace-pre-wrap">
                    {streamingAnswer || "Thinking…"}
                    <span className="stream-cursor" />
                  </p>
                </div>
              )}

              {messages.filter((m) => m.role === "answer").length === 0 && !asking && (
                <div className="flex h-32 flex-col items-center justify-center text-center">
                  <Sparkles className="mb-2 size-6 text-brand/30" />
                  <p className="text-sm text-muted-2">
                    Answers grounded in your resume will appear here.
                  </p>
                </div>
              )}
              <div ref={answersEndRef} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
