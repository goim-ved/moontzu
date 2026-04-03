import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-black text-white selection:bg-white selection:text-black font-sans">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-8 py-6 border-b border-zinc-900 sticky top-0 z-50 bg-black/80 backdrop-blur-md">
        <div className="text-xl font-bold tracking-tight transition-transform hover:scale-[1.02]">
          MoonTzu
        </div>
        <div className="flex items-center gap-6 text-sm font-medium text-zinc-400">
          <Link href="/login" className="hover:text-white transition-colors">SignIn</Link>
          <Link href="/onboarding" className="text-white hover:opacity-80 transition-opacity">Launch Portal</Link>
        </div>
      </nav>

      <main className="flex-1 flex flex-col items-center justify-center px-6 py-24 text-center relative">
        <div className="max-w-3xl space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000 ease-out">
          <section className="space-y-6">
            <div className="inline-flex items-center justify-center px-3 py-1 text-xs font-medium rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300">
              Future of Multi-Tenant Scheduling
            </div>
            <h1 className="text-5xl sm:text-7xl font-bold tracking-tighter leading-tight">
              Scale Your Empire.
            </h1>
          </section>

          <p className="max-w-xl mx-auto text-lg text-zinc-400 leading-relaxed">
            MoonTzu gives you the strategic advantage of unlimited white-labeled booking portals, industrial-grade data isolation, and seamless Stripe monetization.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
            <Link href="/login" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-48 h-12 rounded-full font-semibold bg-white text-black hover:bg-zinc-200">
                Initialize Portal
              </Button>
            </Link>
            <Link href="/debug" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="w-full sm:w-48 h-12 rounded-full font-semibold border-zinc-800 text-white hover:bg-zinc-900 hover:text-white">
                Run Diagnostics
              </Button>
            </Link>
          </div>
        </div>

        {/* Feature Grid Section */}
        <section className="mt-32 w-full max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-6 text-left pt-20 border-t border-zinc-900">
          <div className="space-y-4 p-8 bg-zinc-950/50 rounded-2xl border border-zinc-900 hover:bg-zinc-900/50 transition-colors">
            <div className="size-10 bg-zinc-900 rounded-lg flex items-center justify-center font-bold text-sm text-zinc-300">01</div>
            <h3 className="text-lg font-semibold tracking-tight">Absolute Seclusion</h3>
            <p className="text-sm text-zinc-400 leading-relaxed text-balance">PostgreSQL Row-Level Security ensuring absolute data isolation for every client.</p>
          </div>
          <div className="space-y-4 p-8 bg-zinc-950/50 rounded-2xl border border-zinc-900 hover:bg-zinc-900/50 transition-colors">
            <div className="size-10 bg-zinc-900 rounded-lg flex items-center justify-center font-bold text-sm text-zinc-300">02</div>
            <h3 className="text-lg font-semibold tracking-tight">Monetization Engine</h3>
            <p className="text-sm text-zinc-400 leading-relaxed text-balance">Native Stripe Connect integration for instant multi-party payouts and platform fees.</p>
          </div>
          <div className="space-y-4 p-8 bg-zinc-950/50 rounded-2xl border border-zinc-900 hover:bg-zinc-900/50 transition-colors">
             <div className="size-10 bg-zinc-900 rounded-lg flex items-center justify-center font-bold text-sm text-zinc-300">03</div>
            <h3 className="text-lg font-semibold tracking-tight">Subdomain Routing</h3>
            <p className="text-sm text-zinc-400 leading-relaxed text-balance">Dynamic proxy-based white-labeling for instant, branded client portals on demand.</p>
          </div>
        </section>
      </main>

      <footer className="px-8 py-8 flex items-center justify-between border-t border-zinc-900 text-zinc-500 text-xs font-medium">
        <span>© 2026 MoonTzu Infrastructure</span>
        <div className="flex gap-6">
          <Link href="#" className="hover:text-zinc-300 transition-colors">Privacy</Link>
          <Link href="#" className="hover:text-zinc-300 transition-colors">Terms</Link>
          <Link href="#" className="hover:text-zinc-300 transition-colors">Contact</Link>
        </div>
      </footer>
    </div>
  );
}
