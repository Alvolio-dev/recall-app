import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#fafafa]">
      <nav className="sticky top-0 z-50 flex items-center justify-between px-6 md:px-8 h-16 bg-[#fafafa]/80 backdrop-blur-xl border-b border-zinc-200/60">
        <Link href="/" className="text-lg font-semibold tracking-tight text-zinc-900">
          re<span className="text-emerald-600 italic">call</span>
        </Link>
        <Link href="/" className="flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-900 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to home
        </Link>
      </nav>

      <article className="max-w-2xl mx-auto px-6 py-16">
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-zinc-900 mb-4">Privacy Policy</h1>
        <p className="text-sm text-zinc-400 mb-10">Last updated: March 28, 2026</p>

        <div className="space-y-8 text-zinc-600 leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-zinc-900 mb-3">1. Information we collect</h2>
            <p>When you use Recall, we collect the YouTube URLs you submit for summarisation. If you create an account, we also collect your email address and basic profile information. We do not collect passwords — authentication is handled via secure third-party providers.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-zinc-900 mb-3">2. How we use your information</h2>
            <p>We use the URLs you provide to generate summaries via our AI processing pipeline. Your email is used for account management, weekly digests (if enabled), and important service updates. We never sell your personal data to third parties.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-zinc-900 mb-3">3. Data storage and security</h2>
            <p>Your data is stored on encrypted servers. Summaries and library content are tied to your account and accessible only to you. We use industry-standard security practices including TLS encryption for all data in transit and AES-256 encryption for data at rest.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-zinc-900 mb-3">4. Cookies and analytics</h2>
            <p>We use essential cookies to maintain your session and preferences. We use privacy-respecting analytics to understand how Recall is used, without tracking individual behaviour across other websites. You can disable non-essential cookies at any time.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-zinc-900 mb-3">5. Third-party services</h2>
            <p>Recall uses YouTube&apos;s public transcript data to generate summaries. We also use third-party AI providers for processing. These providers do not retain your data beyond the processing window. We do not share your personal information with advertisers.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-zinc-900 mb-3">6. Your rights</h2>
            <p>You can request a copy of your data, correct inaccuracies, or delete your account and all associated data at any time. To make a request, contact us at <a href="/support" className="text-emerald-600 hover:underline">our support page</a>. We will respond within 30 days.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-zinc-900 mb-3">7. Data retention</h2>
            <p>Free account summaries are retained for 30 days. Pro account data is retained for as long as your subscription is active, plus 90 days after cancellation. You can delete individual summaries or your entire account at any time.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-zinc-900 mb-3">8. Changes to this policy</h2>
            <p>We may update this policy from time to time. If we make significant changes, we&apos;ll notify you via email or a prominent notice on the site. Continued use of Recall after changes constitutes acceptance of the updated policy.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-zinc-900 mb-3">9. Contact</h2>
            <p>If you have questions about this privacy policy, please reach out via our <a href="/support" className="text-emerald-600 hover:underline">support page</a>.</p>
          </section>
        </div>
      </article>
    </div>
  );
}
