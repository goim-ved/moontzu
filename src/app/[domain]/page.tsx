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
  const { data: tenant, error: tenantError } = await supabase
    .from("tenants")
    .select("*")
    .eq("slug", domain)
    .single()

  if (tenantError || !tenant) {
    return notFound()
  }

  const { data: services } = await supabase
    .from("services")
    .select("*")
    .eq("tenant_id", tenant.id)
    .order("name")

  return (
    <div className="flex min-h-screen items-center justify-center p-6 bg-gradient-to-br from-background to-muted/30">
      <Card className="w-full max-w-3xl border-2 border-primary/10 shadow-2xl overflow-hidden">
        <div className="h-4 bg-primary" />
        <CardHeader className="space-y-4 pb-8">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-5xl font-black tracking-tightest">
                {tenant.name}
              </CardTitle>
              <CardDescription className="text-xl font-medium mt-2">
                Professional Booking Portal
              </CardDescription>
            </div>
            <div className="p-3 bg-muted rounded-xl bg-primary/5 text-primary-foreground hidden sm:block">
              <div className="size-12 bg-primary rounded-full animate-pulse" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-10 py-10">
          {/* Quick Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-6 bg-neutral/5 rounded-2xl border border-neutral/10">
              <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2">Location</h3>
              <p className="text-lg font-bold">Global Online Appointments</p>
            </div>
            <div className="p-6 bg-neutral/5 rounded-2xl border border-neutral/10">
              <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2">Availability</h3>
              <p className="text-lg font-bold">24/7 Digital Scheduling</p>
            </div>
          </div>

          {/* Services Grid */}
          <div className="space-y-6">
            <h2 className="text-2xl font-black tracking-tight underline decoration-primary/30 decoration-4 underline-offset-8">
              Available Offerings
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {services?.map((service) => (
                <Card key={service.id} className="group relative border-2 border-transparent hover:border-primary/20 transition-all shadow hover:shadow-xl bg-background rounded-3xl overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between">
                       <CardTitle className="text-xl font-bold">{service.name}</CardTitle>
                       <span className="text-primary font-black">${service.price}</span>
                    </div>
                    <CardDescription className="line-clamp-2 min-h-[3rem]">
                      {service.description || "High-quality professional service."}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pb-4">
                     <span className="text-xs font-bold bg-muted px-2 py-1 rounded-full text-muted-foreground uppercase">
                       {service.duration_minutes} MINS
                     </span>
                  </CardContent>
                  <CardFooter>
                    <Link href={`/book/${service.id}`} className="w-full">
                       <Button className="w-full rounded-2xl group-hover:scale-[1.03] transition-transform font-bold">
                         Secure Spot
                       </Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))}
              {(!services || services.length === 0) && (
                <p className="col-span-full py-12 text-center text-muted-foreground font-medium italic border-2 border-dashed rounded-3xl">
                  No services currently listed. Check back soon.
                </p>
              )}
            </div>
          </div>
        </CardContent>
        <CardFooter className="justify-center py-6 border-t bg-muted/50">
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-tighter">
            Powered by MoonTzu SaaS Infrastructure
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
