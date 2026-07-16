import { Navbar } from "@/components/marketing/Navbar";
import { Footer } from "@/components/marketing/Footer";
import { Container } from "@/components/ui/Container";

const sections = [
  {
    title: "1. What we collect",
    body: `When you create an account we collect your name, email address, and a hashed version of your password (or your Google account ID if you use Google sign-in). When you use a call session we store the transcript of questions and AI-generated answers associated with your session. When you upload a resume or document we store the extracted plain-text content. We also log standard server request data (IP address, browser type, timestamp) for security and debugging.`,
  },
  {
    title: "2. What we do not collect",
    body: `We do not record audio from your microphone or system audio. Speech transcription happens in your browser using the Web Speech API — audio never leaves your device. We do not sell your personal data to third parties. We do not use your resume or session content to train AI models.`,
  },
  {
    title: "3. How we use your data",
    body: `We use the data we collect to provide the service (generate AI answers grounded in your resume), send transactional emails (account creation, billing receipts), operate billing via Stripe, and improve the reliability and quality of the service. We do not use your data for advertising.`,
  },
  {
    title: "4. Third-party services",
    body: `Cue uses the following third-party services: Anthropic (AI answer generation — your questions and resume context are sent to Anthropic's API), Stripe (payment processing — we never store your card details), Neon (PostgreSQL database hosting), and Vercel (hosting and deployment). Each of these services has its own privacy policy.`,
  },
  {
    title: "5. Data retention",
    body: `Your account data is retained until you delete your account. Session transcripts and uploaded documents are retained as long as your account is active. You can delete individual resumes, documents, or sessions from your dashboard at any time. To delete your account and all associated data, email hello@cue.so.`,
  },
  {
    title: "6. Security",
    body: `Passwords are hashed with bcrypt and are never stored in plain text. All data in transit is encrypted via TLS. Access to production systems is restricted to authorized team members. We use a serverless Postgres database with connection pooling to minimize attack surface.`,
  },
  {
    title: "7. Cookies",
    body: `We use a single session cookie (cue_session) to keep you logged in. This cookie is HttpOnly, SameSite=Lax, and Secure in production. We do not use advertising or tracking cookies.`,
  },
  {
    title: "8. Your rights",
    body: `You have the right to access, correct, or delete your personal data at any time. You can manage most data directly from your dashboard. For requests that require our help — including full account deletion — email hello@cue.so and we will respond within 5 business days.`,
  },
  {
    title: "9. Children",
    body: `Cue is not directed at children under 18. We do not knowingly collect personal data from children. If you believe a child has provided us with personal information, contact us and we will delete it.`,
  },
  {
    title: "10. Changes to this policy",
    body: `We may update this privacy policy from time to time. When we do, we will update the "Last updated" date at the top of this page. For significant changes, we will notify you by email.`,
  },
  {
    title: "11. Contact",
    body: `Questions about this policy? Email us at hello@cue.so.`,
  },
];

export default function PrivacyPolicyPage() {
  return (
    <>
      <Navbar />
      <main className="py-20">
        <Container>
          <div className="mx-auto max-w-3xl">
            <p className="mb-3 text-sm font-medium text-brand-2">Legal</p>
            <h1 className="text-3xl font-semibold text-foreground">
              Privacy Policy
            </h1>
            <p className="mt-3 text-sm text-muted-2">
              Last updated: July 2026
            </p>

            <div className="mt-12 space-y-10">
              {sections.map((s) => (
                <div key={s.title}>
                  <h2 className="mb-3 text-lg font-semibold text-foreground">
                    {s.title}
                  </h2>
                  <p className="text-muted leading-relaxed">{s.body}</p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
