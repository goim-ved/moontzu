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
    <div className="flex min-h-screen items-center justify-center p-6 bg-muted/30">
      <Card className="w-full max-w-xl shadow-2xl border-2 border-primary/5">
        <CardHeader className="text-center pb-8 border-b bg-primary/5">
          <CardTitle className="text-3xl font-black">{service.name}</CardTitle>
          <CardDescription className="text-lg">
             Booking for {(service as any).tenants.name}
          </CardDescription>
          <div className="flex justify-center gap-4 mt-4 text-sm font-bold uppercase tracking-widest text-muted-foreground">
             <span>{service.duration_minutes} Mins</span>
             <span>•</span>
             <span className="text-primary">${service.price}</span>
          </div>
        </CardHeader>
        <form action={boundAction}>
          <CardContent className="space-y-6 pt-10">
            <Field>
              <Label htmlFor="customer_name">Your Full Name</Label>
              <Input id="customer_name" name="customer_name" placeholder="John Doe" required />
            </Field>
            <Field>
              <Label htmlFor="customer_email">Your Email Address</Label>
              <Input id="customer_email" name="customer_email" type="email" placeholder="john@example.com" required />
            </Field>
            <Field>
              <Label htmlFor="start_time">Select Date & Time</Label>
              <Input id="start_time" name="start_time" type="datetime-local" required />
              <p className="text-xs text-muted-foreground mt-2">
                 Staff availability will be confirmed upon submission.
              </p>
            </Field>
          </CardContent>
          <CardFooter className="pb-8">
            <Button type="submit" className="w-full py-8 text-xl font-black rounded-2xl group transition-all">
               Confirm Appointment
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
