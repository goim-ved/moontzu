import { redirect } from "next/navigation"
import { createClient } from "@/utils/supabase/server"
import { createTenant } from "./actions"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Field } from "@/components/ui/field"

export default async function OnboardingPage() {
  const supabase = await createClient()

  // 1. Verify Authentication
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) {
    redirect("/login?error=Unauthorized")
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-muted/50">
      <Card className="w-full max-w-lg shadow-2xl">
        <CardHeader className="space-y-1">
          <CardTitle className="text-3xl font-extrabold tracking-tight">Create your business</CardTitle>
          <CardDescription>
            Enter your business details to setup your branded booking subdomain.
          </CardDescription>
        </CardHeader>
        <form action={createTenant}>
          <CardContent className="space-y-6">
            <Field>
              <Label htmlFor="name">Business Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="Acme Clinic"
                required
                className="text-lg py-6"
              />
            </Field>
            <Field>
              <Label htmlFor="slug">Desired Subdomain</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="slug"
                  name="slug"
                  placeholder="acme"
                  required
                  className="text-lg py-6"
                />
                <span className="text-muted-foreground font-medium text-lg">.localhost:3000</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1.5 px-1">
                Letters, numbers, and hyphens only. This will be your public URL.
              </p>
            </Field>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full py-6 text-lg font-bold">
              Construct My Platform
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
