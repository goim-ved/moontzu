import Link from "next/link"
import { notFound } from "next/navigation"
import { createClient } from "@/utils/supabase/server"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default async function TenantPage({
  params,
}: {
  params: Promise<{ domain: string }>
}) {
  const domain = (await params).domain
  const supabase = await createClient()

  // 1. Fetch Tenant and Services
  console.log(`[Portal] Fetching tenant for slug: ${domain}`)
  const { data: tenant, error: tenantError } = await supabase
    .from("tenants")
    .select("*")
    .eq("slug", domain)
    .single()

  if (tenantError || !tenant) {
    console.error(`[Portal] Tenant error/not found for ${domain}:`, tenantError)
    return notFound()
  }

  const { data: services } = await supabase
    .from("services")
    .select("*")
    .eq("tenant_id", tenant.id)
    .order("name")

  return (
    <div className="flex min-h-screen flex-col items-center p-6 sm:p-12 bg-background">
      <div className="w-full max-w-4xl space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <header className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-zinc-900 pb-8 gap-4">
          <div className="space-y-2">
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
              {tenant.name}
            </h1>
            <p className="text-zinc-400 font-medium text-lg">
              Official Booking Portal
            </p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-medium text-zinc-300">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            Accepting Appointments
          </div>
        </header>

        <main className="space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Available Offerings</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {services?.map((service) => (
              <Card key={service.id} className="group relative border-zinc-900 bg-zinc-950/50 hover:bg-zinc-900/50 transition-colors shadow-none rounded-2xl overflow-hidden flex flex-col">
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-start gap-4">
                     <CardTitle className="text-xl font-bold tracking-tight">{service.name}</CardTitle>
                     <span className="text-lg font-bold text-white bg-zinc-900 px-3 py-1 rounded-lg">${service.price}</span>
                  </div>
                  <CardDescription className="text-zinc-400 line-clamp-2 mt-2 font-medium">
                    {service.description || "High-quality professional service offering."}
                  </CardDescription>
                </CardHeader>
                <CardContent className="mt-auto pb-6">
                  <div className="flex items-center gap-2 mb-6 text-sm text-zinc-500 font-medium">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    {service.duration_minutes} Minutes
                  </div>
                  <Link href={`/book/${service.id}`} className="block w-full">
                     <Button className="w-full rounded-xl bg-white text-black hover:bg-zinc-200 font-semibold h-12">
                       Secure Spot
                     </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
            {(!services || services.length === 0) && (
              <div className="col-span-full py-20 text-center border border-zinc-900 border-dashed rounded-3xl bg-zinc-950/30">
                <p className="text-zinc-500 font-medium">No services currently listed. Check back soon.</p>
              </div>
            )}
          </div>
        </main>

        <footer className="pt-8 border-t border-zinc-900 text-center">
          <p className="text-xs text-zinc-600 font-medium uppercase tracking-widest">
            Powered by MoonTzu SaaS Infrastructure
          </p>
        </footer>
      </div>
    </div>
  )
}
