import Link from "next/link";
import { Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fafafa] px-6">
      <div className="text-center">
        <p className="text-6xl font-bold text-zinc-200 mb-4">404</p>
        <h1 className="text-xl font-semibold text-zinc-900 mb-2">
          Page not found
        </h1>
        <p className="text-sm text-zinc-500 mb-6 max-w-sm mx-auto">
          The page you are looking for does not exist or has been moved.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium bg-zinc-900 text-white hover:bg-zinc-800 transition-colors"
        >
          <Home className="w-4 h-4" />
          Go home
        </Link>
      </div>
    </div>
  );
}
