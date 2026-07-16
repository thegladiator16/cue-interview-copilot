import { Navbar } from "@/components/marketing/Navbar";
import { Footer } from "@/components/marketing/Footer";
import { Container } from "@/components/ui/Container";

const sections = [
  {
    title: "1. Acceptance of terms",
    body: `By creating an account or using Cue, you agree to these Terms of Service. If you do not agree, do not use the service. We may update these terms from time to time; continued use after an update constitutes acceptance of the revised terms.`,
  },
  {
    title: "2. What Cue is",
    body: `Cue is a real-time interview assistance tool. It transcribes audio from your device and generates AI-drafted responses to help you formulate answers during interviews and calls. Cue is a personal productivity aid — it is your responsibility to ensure your use of Cue complies with any rules or expectations set by the organizations you interview with.`,
  },
  {
    title: "3. Eligibility",
    body: `You must be at least 18 years old to use Cue. By using the service you represent that you meet this requirement and that the information you provide during registration is accurate.`,
  },
  {
    title: "4. Account security",
    body: `You are responsible for maintaining the confidentiality of your account credentials. You are responsible for all activity that occurs under your account. Notify us immediately at hello@cue.so if you suspect unauthorized access.`,
  },
  {
    title: "5. Subscriptions and credits",
    body: `Cue offers subscription plans (billed monthly or yearly) and one-time credit packs. Subscriptions auto-renew until cancelled. Credits are non-refundable and do not expire. We reserve the right to change pricing with reasonable notice. Free minutes are provided as a one-time trial and are non-transferable.`,
  },
  {
    title: "6. Acceptable use",
    body: `You may not use Cue to violate any applicable law or regulation, to impersonate any person or organization, to interfere with or disrupt the service, or to attempt to gain unauthorized access to any part of the service or its related systems. We reserve the right to suspend or terminate accounts that violate these terms.`,
  },
  {
    title: "7. Intellectual property",
    body: `Cue and its original content, features, and functionality are and will remain the exclusive property of Cue and its licensors. You retain ownership of any content you upload (resumes, documents). By uploading content you grant Cue a limited license to process that content solely for the purpose of providing the service to you.`,
  },
  {
    title: "8. Disclaimer of warranties",
    body: `Cue is provided "as is" and "as available" without warranties of any kind, express or implied. We do not guarantee that the service will be uninterrupted, error-free, or that AI-generated answers will be accurate or suitable for any particular purpose.`,
  },
  {
    title: "9. Limitation of liability",
    body: `To the fullest extent permitted by law, Cue and its team shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of or inability to use the service. Our total liability to you for any claim shall not exceed the amount you paid us in the 12 months preceding the claim.`,
  },
  {
    title: "10. Governing law",
    body: `These terms are governed by the laws of India. Any dispute arising from these terms shall be subject to the exclusive jurisdiction of the courts of India.`,
  },
  {
    title: "11. Contact",
    body: `If you have questions about these terms, email us at hello@cue.so.`,
  },
];

export default function TermsPage() {
  return (
    <>
      <Navbar />
      <main className="py-20">
        <Container>
          <div className="mx-auto max-w-3xl">
            <p className="mb-3 text-sm font-medium text-brand-2">Legal</p>
            <h1 className="text-3xl font-semibold text-foreground">
              Terms of Service
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
