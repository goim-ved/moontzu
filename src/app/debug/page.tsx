import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";

export default async function DebugPage() {
  const supabase = await createClient();
  const headerList = await headers();
  const host = headerList.get("host");
  const forwardedHost = headerList.get("x-forwarded-host");
  
  const hasUrl = !!process.env.NEXT_PUBLIC_SUPABASE_URL;
  const hasKey = !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || "Not set (using default: localhost:3000)";

  // Attempt to select 1 row from tenants (to check RLS and connectivity)
  const { error } = await supabase
    .from("tenants")
    .select("count", { count: "exact", head: true });

  const status = error ? `Error: ${error.message}` : "Connected & Operational ✅";

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-10 font-mono">
      <div className="w-full max-w-2xl bg-zinc-900 border border-zinc-800 rounded-xl p-8 shadow-2xl">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent mb-8">
          MoonTzu Diagnostics
        </h1>
        
        <div className="space-y-4 text-sm">
          <div className="grid grid-cols-2 gap-4 border-b border-zinc-800 pb-2">
            <span className="text-zinc-500">Host Header</span>
            <span className="text-white truncate">{host || "Missing"}</span>
          </div>
          
          <div className="grid grid-cols-2 gap-4 border-b border-zinc-800 pb-2">
            <span className="text-zinc-500">Forwarded Host</span>
            <span className="text-white truncate">{forwardedHost || "None"}</span>
          </div>

          <div className="grid grid-cols-2 gap-4 border-b border-zinc-800 pb-2">
            <span className="text-zinc-500">ROOT_DOMAIN Env</span>
            <span className="text-blue-400 truncate">{rootDomain}</span>
          </div>

          <div className="grid grid-cols-2 gap-4 border-b border-zinc-800 pb-2">
            <span className="text-zinc-500">Supabase Config</span>
            <span className={hasUrl && hasKey ? "text-emerald-400" : "text-red-400"}>
              {hasUrl && hasKey ? "Fully Loaded" : "Partial/Missing"}
            </span>
          </div>

          <div className="mt-8 p-4 bg-zinc-950 rounded-lg border border-zinc-800">
            <p className="text-xs text-zinc-500 uppercase tracking-widest mb-2 font-bold">Database Connectivity</p>
            <p className={`text-lg font-bold ${error ? "text-red-400" : "text-emerald-400"}`}>
              {status}
            </p>
          </div>

          <div className="mt-4 p-4 bg-blue-950/20 rounded-lg border border-blue-900/30">
            <p className="text-xs text-blue-400 uppercase tracking-widest mb-2 font-bold">Local Dev Tip</p>
            <p className="text-xs text-zinc-300">
              If subdomains (<code>lvh.me</code>) are failing, try appending:<br/>
              <code className="text-white">?_dev_subdomain=yourname</code> to any URL.
            </p>
          </div>
        </div>
      </div>
      <p className="mt-6 text-zinc-600 text-[10px]">
        Diagnostic tool active. Delete <code>src/app/debug/page.tsx</code> before production.
      </p>
    </div>
  );
}
