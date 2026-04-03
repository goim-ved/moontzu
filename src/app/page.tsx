import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-black text-white selection:bg-white selection:text-black">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-8 py-6 border-b border-white/10 backdrop-blur-md sticky top-0 z-50">
        <div className="text-2xl font-black italic tracking-tighter uppercase transition-transform hover:scale-[1.02]">
          MoonTzu
        </div>
        <div className="flex gap-8 text-xs font-bold uppercase tracking-widest text-white/50">
          <Link href="/login" className="hover:text-white transition-colors">SignIn</Link>
          <Link href="/onboarding" className="text-white hover:opacity-80 transition-opacity">Launch Portal</Link>
        </div>
      </nav>

      <main className="flex-1 flex flex-col items-center justify-center px-6 py-20 text-center relative overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 -left-1/4 w-[100%] h-[100%] bg-blue-500/10 blur-[120px] -z-10 rounded-full animate-pulse" />
        <div className="absolute bottom-0 -right-1/4 w-[100%] h-[100%] bg-emerald-500/5 blur-[120px] -z-10 rounded-full" />

        <div className="max-w-4xl space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 ease-out">
          <section className="space-y-4">
            <span className="inline-block px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-white/70">
              Future of Multi-Tenant Scheduling
            </span>
            <h1 className="text-7xl md:text-9xl font-black tracking-tightest leading-[0.85] uppercase">
              Scale Your <br /> 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white/80 to-white/40">
                Empire.
              </span>
            </h1>
          </section>

          <p className="max-w-xl mx-auto text-lg md:text-xl text-white/60 font-medium leading-relaxed tracking-tight">
            MoonTzu gives you the strategic advantage of unlimited white-labeled booking portals, industrial-grade data isolation, and seamless Stripe monetization.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
            <Link href="/login" className="w-full sm:w-auto">
              <button className="w-full sm:w-56 h-14 bg-white text-black font-black uppercase text-xs tracking-widest rounded-full hover:bg-white/90 active:scale-95 transition-all shadow-xl shadow-white/10">
                Initialize Portal
              </button>
            </Link>
            <Link href="/debug" className="w-full sm:w-auto">
              <button className="w-full sm:w-56 h-14 bg-black border border-white/20 text-white font-black uppercase text-xs tracking-widest rounded-full hover:bg-white/5 active:scale-95 transition-all">
                Run Diagnostics
              </button>
            </Link>
          </div>
        </div>

        {/* Feature Grid Section */}
        <section className="mt-32 w-full max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-8 text-left border-t border-white/5 pt-20">
          <div className="space-y-4 p-8 bg-white/5 rounded-3xl border border-white/10">
            <div className="size-10 bg-white/10 rounded-xl flex items-center justify-center font-black">RLS</div>
            <h3 className="text-xl font-bold italic tracking-tight">Absolute Seclusion</h3>
            <p className="text-sm text-white/40 leading-relaxed font-medium">PostgreSQL Row-Level Security ensuring absolute data isolation for every client.</p>
          </div>
          <div className="space-y-4 p-8 bg-white/5 rounded-3xl border border-white/10">
            <div className="size-10 bg-white/10 rounded-xl flex items-center justify-center font-black">$$$</div>
            <h3 className="text-xl font-bold italic tracking-tight">Monetization Engine</h3>
            <p className="text-sm text-white/40 leading-relaxed font-medium">Native Stripe Connect integration for instant multi-party payouts and platform fees.</p>
          </div>
          <div className="space-y-4 p-8 bg-white/5 rounded-3xl border border-white/10">
             <div className="size-10 bg-white/10 rounded-xl flex items-center justify-center font-black">SUB</div>
            <h3 className="text-xl font-bold italic tracking-tight">Subdomain Routing</h3>
            <p className="text-sm text-white/40 leading-relaxed font-medium">Dynamic proxy-based white-labeling for instant, branded client portals on demand.</p>
          </div>
        </section>
      </main>

      <footer className="px-8 py-12 flex flex-col md:flex-row justify-between items-center gap-8 border-t border-white/10 text-white/30 text-[10px] uppercase font-black tracking-widest">
        <span>© 2026 MoonTzu Infrastructure</span>
        <div className="flex gap-12">
          <Link href="#" className="hover:text-white transition-colors">Privacy</Link>
          <Link href="#" className="hover:text-white transition-colors">Terms</Link>
          <Link href="#" className="hover:text-white transition-colors">Contact</Link>
        </div>
      </footer>
    </div>
  );
}
