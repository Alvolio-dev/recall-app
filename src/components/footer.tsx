"use client";

export function Footer() {
  return (
    <footer className="bg-zinc-900 py-10 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row items-start justify-between gap-8 mb-8 pb-8 border-b border-white/10">
          <div className="text-lg font-semibold tracking-tight text-white">
            re<span className="text-emerald-400 italic">call</span>
          </div>
          <div className="max-w-xs w-full">
            <label htmlFor="footer-email" className="text-sm font-medium text-white mb-2 block">Get product updates</label>
            <div className="flex items-center bg-white/[0.06] border border-white/10 rounded-xl overflow-hidden focus-within:border-emerald-500/40 focus-within:shadow-[0_0_0_3px_rgba(16,185,129,0.15)] transition-all">
              <input
                id="footer-email"
                type="email"
                placeholder="you@email.com"
                className="flex-1 min-w-0 bg-transparent px-3 py-2.5 text-sm text-white placeholder:text-zinc-500 outline-none"
              />
              <button className="m-1 px-4 py-2 bg-emerald-500 text-white text-xs font-medium rounded-lg hover:bg-emerald-600 transition-colors whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-900">
                Subscribe
              </button>
            </div>
          </div>
        </div>
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex gap-6">
            <a href="/privacy" className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors">Privacy</a>
            <a href="/terms" className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors">Terms</a>
            <a href="/support" className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors">Support</a>
          </div>
          <p className="text-sm text-zinc-500">&copy; 2026 Recall. Made in Sydney.</p>
        </div>
      </div>
    </footer>
  );
}
