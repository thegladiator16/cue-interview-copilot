import Link from "next/link";
import { Navbar } from "@/components/marketing/Navbar";
import { Footer } from "@/components/marketing/Footer";

const GITHUB_RELEASES =
  "https://github.com/thegladiator16/cue-interview-copilot/releases/latest";

const platforms = [
  {
    os: "Windows",
    icon: (
      <svg className="size-8" viewBox="0 0 24 24" fill="currentColor">
        <path d="M0 3.449L9.75 2.1v9.451H0m10.949-9.602L24 0v11.4H10.949M0 12.6h9.75v9.451L0 20.699M10.949 12.6H24V24l-12.9-1.801" />
      </svg>
    ),
    file: "Cue-Setup-0.1.0.exe",
    label: "Download for Windows",
    detail: "Windows 10 or later • 64-bit • ~233 MB",
    recommended: true,
    available: true,
  },
  {
    os: "macOS",
    icon: (
      <svg className="size-8" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
      </svg>
    ),
    file: "Cue-0.1.0.dmg",
    label: "Coming Soon",
    detail: "macOS 11 or later • Intel & Apple Silicon",
    recommended: false,
    available: false,
  },
  {
    os: "Linux",
    icon: (
      <svg className="size-8" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12.504 0c-.155 0-.315.008-.48.021-4.226.333-3.105 4.807-3.17 6.298-.076 1.092-.3 1.953-1.05 3.02-.885 1.051-2.127 2.75-2.716 4.521-.278.832-.41 1.684-.287 2.489a.424.424 0 00-.11.135c-.26.268-.45.6-.663.839-.199.199-.485.267-.797.4-.313.136-.658.269-.864.68-.09.189-.136.394-.132.602 0 .199.027.4.055.536.058.399.116.728.04.97-.249.68-.28 1.145-.106 1.484.174.334.535.47.94.601.81.2 1.91.135 2.774.6.926.466 1.866.67 2.616.47.526-.116.97-.464 1.208-.946.587-.003 1.23-.269 2.26-.334.699-.058 1.574.267 2.577.2.025.134.063.198.114.333l.003.003c.391.778 1.113 1.132 1.884 1.071.771-.06 1.592-.536 2.257-1.306.631-.765 1.683-1.084 2.378-1.503.348-.199.629-.469.649-.853.023-.4-.2-.811-.714-1.376v-.097l-.003-.003c-.17-.2-.25-.535-.338-.926-.2-.868-.267-2.14-.204-3.756.12-1.397-.86-3.028-1.838-4.17v-.003c-.26-.334-.5-.6-.766-.98-.59-.852-1.183-1.975-1.336-3.5v-.003c-.16-1.334-.233-2.75-.656-3.7-.21-.476-.467-.885-.821-1.191-.354-.303-.785-.47-1.27-.5l-.003-.01a2.544 2.544 0 00-.123-.003z" />
      </svg>
    ),
    file: "Cue-0.1.0.AppImage",
    label: "Coming Soon",
    detail: "Ubuntu 20.04+ / Fedora 36+ • 64-bit",
    recommended: false,
    available: false,
  },
];

const steps = [
  {
    num: "1",
    title: "Download & Install",
    desc: "Download the installer for your platform. Run it — Cue installs in seconds with no complex setup.",
  },
  {
    num: "2",
    title: "Sign In",
    desc: "Open Cue and sign in with your account. The compact overlay connects to your dashboard securely.",
  },
  {
    num: "3",
    title: "Create a Session",
    desc: "Enter the company name and job description. Attach your resume for personalized answers.",
  },
  {
    num: "4",
    title: "Start Your Interview",
    desc: "Cue floats on top of your video call. It listens, transcribes, and gives you real-time answers.",
  },
];

export default function DownloadPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden border-b border-border-soft bg-gradient-to-b from-background to-surface-2 py-20">
          <div className="mx-auto max-w-4xl px-6 text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border-soft bg-surface px-4 py-1.5 text-sm text-muted">
              <span className="inline-block size-2 rounded-full bg-green-500" />
              v0.1.0 — Free to use
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              Download Cue for Desktop
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-muted">
              A compact floating overlay that sits on top of your video calls.
              Get real-time AI answers during interviews — invisible to
              interviewers.
            </p>
          </div>
        </section>

        {/* Download Cards */}
        <section className="py-16">
          <div className="mx-auto grid max-w-4xl gap-6 px-6 md:grid-cols-3">
            {platforms.map((p) => (
              <div
                key={p.os}
                className={`relative rounded-2xl border p-6 text-center transition-all hover:shadow-lg ${
                  p.recommended
                    ? "border-brand/30 bg-brand/[0.03] shadow-md"
                    : "border-border-soft bg-surface"
                }`}
              >
                {p.recommended && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-brand px-3 py-1 text-xs font-semibold text-white">
                    Recommended
                  </span>
                )}
                <div className="mb-4 flex justify-center text-foreground">
                  {p.icon}
                </div>
                <h3 className="text-lg font-semibold text-foreground">
                  {p.os}
                </h3>
                <p className="mt-1 text-xs text-muted">{p.detail}</p>
                {p.available ? (
                  <a
                    href={`${GITHUB_RELEASES}/download/${p.file}`}
                    className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-foreground px-5 py-3 text-sm font-semibold text-background transition-colors hover:bg-foreground/90"
                  >
                    <svg
                      className="size-4"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="7 10 12 15 17 10" />
                      <line x1="12" y1="15" x2="12" y2="3" />
                    </svg>
                    {p.label}
                  </a>
                ) : (
                  <span className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-muted/20 px-5 py-3 text-sm font-semibold text-muted cursor-not-allowed">
                    {p.label}
                  </span>
                )}
              </div>
            ))}
          </div>

          <p className="mt-8 text-center text-sm text-muted">
            Or use{" "}
            <Link
              href="/dashboard"
              className="font-medium text-brand-2 underline underline-offset-2"
            >
              Cue in your browser
            </Link>{" "}
            — no download needed.
          </p>
        </section>

        {/* How it works */}
        <section className="border-t border-border-soft bg-surface-2 py-16">
          <div className="mx-auto max-w-4xl px-6">
            <h2 className="mb-12 text-center text-2xl font-bold text-foreground">
              How It Works
            </h2>
            <div className="grid gap-8 sm:grid-cols-2">
              {steps.map((s) => (
                <div key={s.num} className="flex gap-4">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-brand text-sm font-bold text-white">
                    {s.num}
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{s.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-muted">
                      {s.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="border-t border-border-soft py-16">
          <div className="mx-auto max-w-4xl px-6">
            <h2 className="mb-10 text-center text-2xl font-bold text-foreground">
              Why the Desktop App?
            </h2>
            <div className="grid gap-6 sm:grid-cols-3">
              {[
                {
                  icon: (
                    <svg className="size-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="2" y="3" width="20" height="14" rx="2" />
                      <line x1="8" y1="21" x2="16" y2="21" />
                      <line x1="12" y1="17" x2="12" y2="21" />
                    </svg>
                  ),
                  title: "Always on Top",
                  desc: "Floats above Zoom, Teams, Google Meet — always visible without switching tabs.",
                },
                {
                  icon: (
                    <svg className="size-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    </svg>
                  ),
                  title: "Completely Invisible",
                  desc: "Desktop apps can't be detected by screen sharing. Your copilot stays private.",
                },
                {
                  icon: (
                    <svg className="size-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                    </svg>
                  ),
                  title: "System Tray Access",
                  desc: "Quick-launch from your taskbar. Start a new session in one click without opening the browser.",
                },
              ].map((f) => (
                <div
                  key={f.title}
                  className="rounded-xl border border-border-soft bg-surface p-5"
                >
                  <div className="mb-3 text-brand-2">{f.icon}</div>
                  <h3 className="font-semibold text-foreground">{f.title}</h3>
                  <p className="mt-1 text-sm text-muted">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
