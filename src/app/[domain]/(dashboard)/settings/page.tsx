import { notFound, redirect } from "next/navigation"
import { createClient } from "@/utils/supabase/server"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { connectStripe } from "./actions"

export default async function SettingsPage({
  params,
}: {
  params: Promise<{ domain: string }>
}) {
  const domain = (await params).domain
  const supabase = await createClient()

  // 1. Fetch Tenant
  const { data: tenant, error } = await supabase
    .from("tenants")
    .select("*")
    .eq("slug", domain)
    .single()

  if (error || !tenant) {
    return notFound()
  }

  const isStripeConnected = !!tenant.stripe_account_id

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-black tracking-tightest mb-2">Business Settings</h1>
        <p className="text-muted-foreground">Manage your business configuration and integrations.</p>
      </div>

      <Card className="shadow-lg border-2 border-primary/5 max-w-2xl">
        <CardHeader>
          <CardTitle>Stripe Connect</CardTitle>
          <CardDescription>
            Integrate your Stripe account to receive payments from bookings.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isStripeConnected ? (
            <div className="flex items-center gap-2 p-4 bg-green-50 border border-green-200 text-green-700 rounded-md">
              <div className="size-2 bg-green-500 rounded-full" />
              Connected to Stripe: {tenant.stripe_account_id}
            </div>
          ) : (
            <div className="p-4 bg-muted border border-muted-foreground/10 rounded-md text-sm">
              Your business is not yet connected to Stripe. Connect your account to enable client bookings.
            </div>
          )}
        </CardContent>
        <CardFooter>
          {!isStripeConnected && (
            <form action={connectStripe.bind(null, domain)}>
              <Button type="submit" className="font-bold">
                 Initialize Stripe Connection
              </Button>
            </form>
          )}
          {isStripeConnected && (
            <Button variant="outline" disabled>
              Stripe Account Connected
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}
