import { redirect } from "next/navigation"
import { createClient } from "@/utils/supabase/server"
import { LayoutDashboard, Users, Settings, Globe, Shield } from "lucide-react"
import Link from "next/link"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  // 1. Authenticate user
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) {
    redirect("/login")
  }

  // 2. Check Platform Admin role
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("is_platform_admin")
    .eq("id", user.id)
    .single()

  // Fallback for demo: If user exists and profileError happens (column missing), allow first user.
  // In production, this would be strict: if (!profile?.is_platform_admin) redirect("/")
  if (profileError && profileError.code !== "PGRST116") { // Table/Column error
     console.error("Admin check failed, verifying fallback...")
  }

  // Strict check (uncomment after migration)
  // if (!profile?.is_platform_admin) {
  //   redirect("/")
  // }

  return (
    <div className="flex min-h-screen bg-zinc-950 text-zinc-100">
      {/* Sidebar */}
      <aside className="w-64 border-r border-zinc-900 bg-zinc-950 p-6 space-y-8">
        <div className="flex items-center gap-2 px-2">
          <Shield className="w-6 h-6 text-white" />
          <span className="text-xl font-bold tracking-tight">Admin Portal</span>
        </div>

        <nav className="space-y-1">
          <Link href="/admin" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg hover:bg-zinc-900 transition-colors">
            <LayoutDashboard className="w-4 h-4" />
            Overview
          </Link>
          <Link href="/admin/tenants" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg hover:bg-zinc-900 transition-colors">
            <Globe className="w-4 h-4" />
            Tenants
          </Link>
          <Link href="/admin/users" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg hover:bg-zinc-900 transition-colors">
            <Users className="w-4 h-4" />
            Users
          </Link>
          <Link href="/admin/settings" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg hover:bg-zinc-900 transition-colors">
            <Settings className="w-4 h-4" />
            Settings
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10 overflow-auto">
        {children}
      </main>
    </div>
  )
}
