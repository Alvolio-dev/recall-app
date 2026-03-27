import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function TermsPage() {
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
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-zinc-900 mb-4">Terms of Service</h1>
        <p className="text-sm text-zinc-400 mb-10">Last updated: March 28, 2026</p>

        <div className="space-y-8 text-zinc-600 leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-zinc-900 mb-3">1. Acceptance of terms</h2>
            <p>By using Recall, you agree to these terms. If you don&apos;t agree, please don&apos;t use the service. We may update these terms from time to time — continued use means you accept the changes.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-zinc-900 mb-3">2. What Recall does</h2>
            <p>Recall is a tool that generates AI-powered summaries of YouTube videos using publicly available transcript data. Summaries are generated for informational purposes and should not be treated as a substitute for watching the original content when accuracy is critical.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-zinc-900 mb-3">3. Your account</h2>
            <p>You don&apos;t need an account to use Recall&apos;s free features. If you create one, you&apos;re responsible for keeping your login credentials secure. You must be at least 13 years old to use Recall, or the minimum age required in your jurisdiction.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-zinc-900 mb-3">4. Free and Pro plans</h2>
            <p>Free accounts have access to unlimited summaries, all three modes, and two follow-up questions per video. Pro accounts unlock additional features including unlimited follow-ups, saved libraries, weekly digests, and export capabilities. Pro pricing is listed on our pricing page and may change with notice.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-zinc-900 mb-3">5. Billing and cancellation</h2>
            <p>Pro subscriptions are billed monthly or annually. You can cancel at any time — your access continues until the end of the current billing period. Refunds are available within the first 7 days of a new subscription. After that, no refunds are issued for partial periods.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-zinc-900 mb-3">6. Acceptable use</h2>
            <p>You agree not to use Recall to: violate any laws, infringe on intellectual property rights, attempt to reverse-engineer or exploit the service, or use automated tools to abuse the platform. We reserve the right to suspend accounts that violate these terms.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-zinc-900 mb-3">7. Content and accuracy</h2>
            <p>AI-generated summaries may contain errors or omit important context. Recall does not guarantee the accuracy, completeness, or reliability of any summary. You are responsible for verifying information before acting on it.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-zinc-900 mb-3">8. Intellectual property</h2>
            <p>Recall&apos;s interface, branding, and technology are owned by Recall. Summaries generated from your submitted URLs are yours to use, save, and export. We do not claim ownership over your generated content.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-zinc-900 mb-3">9. Limitation of liability</h2>
            <p>Recall is provided &quot;as is&quot; without warranties of any kind. We are not liable for any indirect, incidental, or consequential damages arising from your use of the service. Our total liability is limited to the amount you&apos;ve paid us in the 12 months preceding the claim.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-zinc-900 mb-3">10. Contact</h2>
            <p>Questions about these terms? Reach out via our <a href="/support" className="text-emerald-600 hover:underline">support page</a>.</p>
          </section>
        </div>
      </article>
    </div>
  );
}
