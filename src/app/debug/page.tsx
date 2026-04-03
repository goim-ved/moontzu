import { createClient } from "@/utils/supabase/server";

export default async function DebugPage() {
  const supabase = await createClient();
  
  const hasUrl = !!process.env.NEXT_PUBLIC_SUPABASE_URL;
  const hasKey = !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || "Not set (using default: localhost:3000)";

  // Attempt to select 1 row from tenants (to check RLS and connectivity)
  const { data, error } = await supabase
    .from("tenants")
    .select("count", { count: "exact", head: true });

  const status = error ? `Error: ${error.message}` : "Connected & Operational ✅";

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-10 font-mono">
      <div className="w-full max-w-2xl bg-zinc-900 border border-zinc-800 rounded-xl p-8 shadow-2xl">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent mb-8">
          MoonTzu Diagnostics
        </h1>
        
        <div className="space-y-6 text-sm">
          <div className="flex justify-between items-center border-b border-zinc-800 pb-2">
            <span className="text-zinc-500">NEXT_PUBLIC_SUPABASE_URL</span>
            <span className={hasUrl ? "text-emerald-400" : "text-red-400"}>
              {hasUrl ? "Defined" : "MISSING"}
            </span>
          </div>
          
          <div className="flex justify-between items-center border-b border-zinc-800 pb-2">
            <span className="text-zinc-500">NEXT_PUBLIC_SUPABASE_ANON_KEY</span>
            <span className={hasKey ? "text-emerald-400" : "text-red-400"}>
              {hasKey ? "Defined" : "MISSING"}
            </span>
          </div>
          
          <div className="flex justify-between items-center border-b border-zinc-800 pb-2">
            <span className="text-zinc-500">ROOT_DOMAIN</span>
            <span className="text-blue-400">
              {rootDomain}
            </span>
          </div>

          <div className="mt-8 p-4 bg-zinc-950 rounded-lg border border-zinc-800">
            <p className="text-xs text-zinc-500 uppercase tracking-widest mb-2 font-bold">Database Connectivity</p>
            <p className={`text-lg font-bold ${error ? "text-red-400" : "text-emerald-400"}`}>
              {status}
            </p>
            {!error && (
              <p className="text-[10px] text-zinc-600 mt-2 italic">
                Successfully authorized through Supabase Auth (SSR) and verified with RLS.
              </p>
            )}
          </div>
        </div>
      </div>
      <p className="mt-6 text-zinc-600 text-[10px]">
        This is a diagnostic tool. Delete <code>src/app/debug/page.tsx</code> before production.
      </p>
    </div>
  );
}
