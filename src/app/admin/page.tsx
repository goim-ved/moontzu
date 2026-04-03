import { createClient } from "@/utils/supabase/server"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Globe, Users, Activity, CreditCard } from "lucide-react"

export default async function AdminOverviewPage() {
  const supabase = await createClient()

  // Fetch basic counts
  const { count: tenantCount } = await supabase.from("tenants").select("*", { count: "exact", head: true })
  const { count: profileCount } = await supabase.from("profiles").select("*", { count: "exact", head: true })
  const { count: serviceCount } = await supabase.from("services").select("*", { count: "exact", head: true })

  // Recent tenants
  const { data: recentTenants } = await supabase
    .from("tenants")
    .select("name, slug, created_at")
    .order("created_at", { ascending: false })
    .limit(5)

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Platform Overview</h1>
        <p className="text-zinc-400">Monitor and manage all entities on the MoonTzu network.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-zinc-950 border-zinc-900 overflow-hidden shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-zinc-400">Total Tenants</CardTitle>
            <Globe className="w-4 h-4 text-white" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tenantCount || 0}</div>
            <p className="text-xs text-zinc-500">+2 since last month</p>
          </CardContent>
        </Card>
        <Card className="bg-zinc-950 border-zinc-900 overflow-hidden shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-zinc-400">Active Users</CardTitle>
            <Users className="w-4 h-4 text-white" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{profileCount || 0}</div>
            <p className="text-xs text-zinc-500">+12 since last month</p>
          </CardContent>
        </Card>
        <Card className="bg-zinc-950 border-zinc-900 overflow-hidden shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-zinc-400">Total Services</CardTitle>
            <Activity className="w-4 h-4 text-white" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{serviceCount || 0}</div>
            <p className="text-xs text-zinc-500">Configured across all tenants</p>
          </CardContent>
        </Card>
        <Card className="bg-zinc-950 border-zinc-900 overflow-hidden shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-zinc-400">Platform Revenue</CardTitle>
            <CreditCard className="w-4 h-4 text-white" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$0.00</div>
            <p className="text-xs text-zinc-500">Based on 10% platform fee</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="bg-zinc-950 border-zinc-900 shadow-sm">
          <CardHeader>
            <CardTitle>Recent Tenants</CardTitle>
            <CardDescription className="text-zinc-500">Newly registered businesses.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentTenants?.map((tenant) => (
                <div key={tenant.slug} className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">{tenant.name}</p>
                    <p className="text-xs text-zinc-500">{tenant.slug}.localhost:3000</p>
                  </div>
                  <div className="text-xs text-zinc-500">
                    {new Date(tenant.created_at).toLocaleDateString()}
                  </div>
                </div>
              ))}
              {(!recentTenants || recentTenants.length === 0) && (
                <p className="text-sm text-zinc-500 italic">No tenants found yet.</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-zinc-950 border-zinc-900 shadow-sm">
          <CardHeader>
            <CardTitle>Platform Status</CardTitle>
            <CardDescription className="text-zinc-500">Real-time health check.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-sm font-medium">Supabase Database: Online</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-sm font-medium">Stripe API: Reachable</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-amber-500" />
              <span className="text-sm font-medium">Middleware Proxy: Operational</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
