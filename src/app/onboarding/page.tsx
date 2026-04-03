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
    <div className="flex min-h-screen flex-col items-center justify-center p-6 bg-background">
      <div className="w-full max-w-lg space-y-8">
        <div className="space-y-2 text-center">
          <h1 className="text-4xl font-bold tracking-tight">Create your domain</h1>
          <p className="text-zinc-400">
            Configure your white-labeled booking portal
          </p>
        </div>
        
        <Card className="border-zinc-900 bg-zinc-950/50 shadow-2xl rounded-2xl">
          <form action={createTenant}>
            <CardContent className="space-y-8 pt-8">
              <Field className="space-y-3">
                <Label htmlFor="name" className="text-zinc-300 font-medium">Business Name</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Acme Aesthetics"
                  required
                  className="bg-zinc-950 border-zinc-800 h-14 text-lg px-4 rounded-xl focus-visible:ring-1 focus-visible:ring-zinc-500"
                />
              </Field>
              <Field className="space-y-3">
                <Label htmlFor="slug" className="text-zinc-300 font-medium">Desired Subdomain</Label>
                <div className="flex items-center gap-3">
                  <Input
                    id="slug"
                    name="slug"
                    placeholder="acme"
                    required
                    className="bg-zinc-950 border-zinc-800 h-14 text-lg px-4 rounded-xl focus-visible:ring-1 focus-visible:ring-zinc-500 font-mono"
                  />
                  <span className="text-zinc-500 font-medium text-lg">
                    .{process.env.NEXT_PUBLIC_ROOT_DOMAIN || "localhost:3000"}
                  </span>
                </div>
                <p className="text-xs text-zinc-500 mt-2">
                  Letters, numbers, and hyphens only.
                </p>
              </Field>
            </CardContent>
            <CardFooter className="border-t border-zinc-900/50 pt-6 pb-8">
              <Button type="submit" className="w-full h-14 rounded-xl text-lg font-semibold bg-white text-black hover:bg-zinc-200">
                Initialize Instance
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}
