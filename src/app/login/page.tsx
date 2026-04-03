import { login, signup } from "./actions"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Field } from "@/components/ui/field"

export default async function LoginPage(props: {
  searchParams: Promise<{ 
    error?: string;
    unconfirmed?: string;
    signup_success?: string;
  }>
}) {
  const searchParams = await props.searchParams

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6 bg-background">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">MoonTzu</h1>
          <p className="text-sm text-zinc-400">
            Sign in to manage your empire.
          </p>
        </div>
        
        <Card className="border-zinc-900 bg-zinc-950/50 shadow-xl rounded-2xl overflow-hidden">
          <form>
            <CardContent className="space-y-5 pt-6">
              {searchParams.error && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-500 text-sm rounded-lg font-medium">
                  {searchParams.error}
                </div>
              )}
              {searchParams.unconfirmed && (
                <div className="p-3 bg-amber-500/10 border border-amber-500/20 text-amber-500 text-sm rounded-lg font-medium">
                  Email not confirmed. Please check your inbox for the verification link.
                </div>
              )}
              {searchParams.signup_success && (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-sm rounded-lg font-medium">
                  Account created! Please check your email to confirm your account before signing in.
                </div>
              )}
              <Field className="space-y-2">
                <Label htmlFor="email" className="text-zinc-300">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="m@example.com"
                  className="bg-zinc-950 border-zinc-800 focus-visible:ring-1 focus-visible:ring-zinc-500 rounded-xl h-11"
                  required
                />
              </Field>
              <Field className="space-y-2">
                <Label htmlFor="password" className="text-zinc-300">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  className="bg-zinc-950 border-zinc-800 focus-visible:ring-1 focus-visible:ring-zinc-500 rounded-xl h-11"
                  required
                />
              </Field>
            </CardContent>
            <CardFooter className="flex flex-col gap-3 pb-6 border-t border-zinc-900/50 pt-6">
              <Button formAction={login} className="w-full h-11 rounded-xl bg-white text-black hover:bg-zinc-200 font-semibold">
                Sign In
              </Button>
              <Button formAction={signup} variant="outline" className="w-full h-11 rounded-xl border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-900 font-semibold">
                Create Account
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}
