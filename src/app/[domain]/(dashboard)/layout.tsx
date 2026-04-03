import { notFound, redirect } from "next/navigation"
import { createClient } from "@/utils/supabase/server"

export default async function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ domain: string }>
}) {
  const domain = (await params).domain
  const supabase = await createClient()

  // 1. Authenticate user
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) {
    redirect("/login")
  }

  // 2. Resolve tenant by domain (slug)
  const { data: tenant, error: tenantError } = await supabase
    .from("tenants")
    .select("*")
    .eq("slug", domain)
    .single()

  if (tenantError || !tenant) {
    return notFound()
  }

  // 3. Verify user is member of this tenant
  const { data: member, error: memberError } = await supabase
    .from("tenant_members")
    .select("role")
    .eq("tenant_id", tenant.id)
    .eq("user_id", user.id)
    .single()

  // Only allow owner/admin/staff access to the dashboard
  if (memberError || !member) {
    redirect("/") // No access to dashboard if not a member
  }

  return (
    <div className="min-h-screen bg-muted/20">
      <main className="container mx-auto p-8 max-w-6xl">
        {children}
      </main>
    </div>
  )
}
