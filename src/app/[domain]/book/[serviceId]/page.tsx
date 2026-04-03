import { notFound } from "next/navigation"
import { createClient } from "@/utils/supabase/server"
import { createAppointment } from "../actions"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Field } from "@/components/ui/field"

export default async function BookServicePage({
  params,
}: {
  params: Promise<{ domain: string; serviceId: string }>
}) {
  const { domain, serviceId } = await params
  const supabase = await createClient()

  // 1. Fetch Service and Tenant for confirmation
  const { data: service, error: serviceError } = await supabase
    .from("services")
    .select("*, tenants!inner(name)")
    .eq("id", serviceId)
    .single()

  if (serviceError || !service) {
    return notFound()
  }

  // 2. Bind server action
  const boundAction = createAppointment.bind(null, domain, serviceId)

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6 bg-background">
      <div className="w-full max-w-lg space-y-6">
        <div className="text-center space-y-2 mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Checkout</h1>
          <p className="text-zinc-400 font-medium">
            {(service as any).tenants.name}
          </p>
        </div>
        
        <Card className="border-zinc-900 bg-zinc-950/50 shadow-2xl rounded-2xl overflow-hidden">
          <CardHeader className="bg-zinc-900/30 border-b border-zinc-900/50 pb-6">
            <div className="flex justify-between items-start">
               <div>
                  <CardTitle className="text-xl font-bold">{service.name}</CardTitle>
                  <CardDescription className="text-zinc-400 mt-1">
                     {service.duration_minutes} Minutes
                  </CardDescription>
               </div>
               <span className="text-xl font-bold">${service.price}</span>
            </div>
          </CardHeader>
          <form action={boundAction}>
            <CardContent className="space-y-6 pt-8">
              <Field className="space-y-2">
                <Label htmlFor="customer_name" className="text-zinc-300">Full Name</Label>
                <Input 
                  id="customer_name" 
                  name="customer_name" 
                  placeholder="John Doe" 
                  required 
                  className="bg-zinc-950 border-zinc-800 focus-visible:ring-1 focus-visible:ring-zinc-500 rounded-xl h-12"
                />
              </Field>
              <Field className="space-y-2">
                <Label htmlFor="customer_email" className="text-zinc-300">Email Address</Label>
                <Input 
                  id="customer_email" 
                  name="customer_email" 
                  type="email" 
                  placeholder="john@example.com" 
                  required 
                  className="bg-zinc-950 border-zinc-800 focus-visible:ring-1 focus-visible:ring-zinc-500 rounded-xl h-12"
                />
              </Field>
              <Field className="space-y-2 pt-2">
                <Label htmlFor="start_time" className="text-zinc-300">Select Date & Time</Label>
                <Input 
                  id="start_time" 
                  name="start_time" 
                  type="datetime-local" 
                  required 
                  className="bg-zinc-950 border-zinc-800 focus-visible:ring-1 focus-visible:ring-zinc-500 rounded-xl h-12"
                  style={{ colorScheme: "dark" }}
                />
              </Field>
            </CardContent>
            <CardFooter className="border-t border-zinc-900/50 pt-6 pb-8">
              <Button type="submit" className="w-full h-12 text-base font-semibold rounded-xl bg-white text-black hover:bg-zinc-200">
                 Continue to Payment
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}
