import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Settings",
};

export default function SettingsPage() {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-zinc-900">Settings</h1>
        <p className="text-sm text-zinc-500 mt-1">
          Manage your account and subscription.
        </p>
      </div>

      {/* Account */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-6 mb-4">
        <h2 className="text-base font-semibold text-zinc-900 mb-4">Account</h2>
        <p className="text-sm text-zinc-500">Account management coming soon.</p>
      </div>

      {/* Subscription */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-6 mb-4">
        <h2 className="text-base font-semibold text-zinc-900 mb-4">Subscription</h2>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-zinc-900">Free plan</p>
            <p className="text-xs text-zinc-500 mt-0.5">Unlimited summaries, 2 follow-ups per video</p>
          </div>
          <button className="px-4 py-2 rounded-xl text-sm font-medium bg-emerald-600 text-white hover:bg-emerald-700 transition-colors">
            Upgrade to Pro
          </button>
        </div>
      </div>

      {/* Preferences */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-6">
        <h2 className="text-base font-semibold text-zinc-900 mb-4">Preferences</h2>
        <p className="text-sm text-zinc-500">Preference settings coming soon.</p>
      </div>
    </div>
  );
}
