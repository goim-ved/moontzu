import { notFound } from "next/navigation"
import { createClient } from "@/utils/supabase/server"
import { createService } from "./actions"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Field } from "@/components/ui/field"

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ domain: string }>
}) {
  const domain = (await params).domain
  const supabase = await createClient()

  // 1. Fetch Tenant and Services
  const { data: tenant, error: tenantError } = await supabase
    .from("tenants")
    .select("id, name")
    .eq("slug", domain)
    .single()

  if (tenantError || !tenant) {
    return notFound()
  }

  const { data: services, error: servicesError } = await supabase
    .from("services")
    .select("*")
    .eq("tenant_id", tenant.id)
    .order("created_at", { ascending: false })

  if (servicesError) {
    throw new Error(servicesError.message)
  }

  // 2. Wrap Action for domain
  const boundAction = createService.bind(null, domain)

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-black tracking-tightest mb-2">Service Management</h1>
        <p className="text-muted-foreground">Define what services your business offers to customers.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Create Service Form */}
        <Card className="lg:col-span-1 shadow-lg border-2 border-primary/5">
          <CardHeader>
            <CardTitle>Create New Service</CardTitle>
            <CardDescription>Add a new offering to your booking portal.</CardDescription>
          </CardHeader>
          <form action={boundAction}>
            <CardContent className="space-y-4">
              <Field>
                <Label htmlFor="name">Service Name</Label>
                <Input id="name" name="name" placeholder="E.g. Consultation" required />
              </Field>
              <Field>
                <Label htmlFor="description">Description (Optional)</Label>
                <Input id="description" name="description" placeholder="Short summary" />
              </Field>
              <div className="grid grid-cols-2 gap-4">
                <Field>
                  <Label htmlFor="duration">Duration (min)</Label>
                  <Input id="duration" name="duration" type="number" defaultValue={60} required />
                </Field>
                <Field>
                  <Label htmlFor="price">Price ($)</Label>
                  <Input id="price" name="price" type="number" step="0.01" defaultValue={0} required />
                </Field>
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full font-bold">Add Service</Button>
            </CardFooter>
          </form>
        </Card>

        {/* Services List */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
          {services?.map((service) => (
            <Card key={service.id} className="shadow hover:shadow-md transition-shadow border-2 border-transparent hover:border-primary/20">
              <CardHeader className="flex flex-row justify-between items-start space-y-0">
                <div>
                  <CardTitle className="text-lg">{service.name}</CardTitle>
                  <CardDescription>{service.description}</CardDescription>
                </div>
                <div className="bg-primary/10 text-primary font-bold px-2 py-1 rounded text-sm">
                  ${service.price}
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
                   <div className="size-2 bg-primary rounded-full" />
                   {service.duration_minutes} minutes
                </div>
              </CardContent>
            </Card>
          ))}
          {services?.length === 0 && (
            <div className="md:col-span-2 p-12 text-center rounded-3xl border-2 border-dashed border-muted flex flex-col items-center gap-2">
               <div className="size-16 bg-muted rounded-full animate-bounce" />
               <p className="text-muted-foreground font-medium">No services defined yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
