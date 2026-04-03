import { login, signup } from "./actions"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Field } from "@/components/ui/field"

export default async function LoginPage(props: {
  searchParams: Promise<{ error?: string }>
}) {
  const searchParams = await props.searchParams

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">MoonTzu</CardTitle>
          <CardDescription className="text-center">
            Sign in to your account or create a new one to manage your bookings.
          </CardDescription>
        </CardHeader>
        <form>
          <CardContent className="space-y-4">
            {searchParams.error && (
              <div className="p-3 bg-destructive/15 border border-destructive/20 text-destructive text-sm rounded-md">
                {searchParams.error}
              </div>
            )}
            <Field>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="m@example.com"
                required
              />
            </Field>
            <Field>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
              />
            </Field>
          </CardContent>
          <CardFooter className="flex flex-col gap-2">
            <Button
              formAction={login}
              className="w-full"
            >
              Sign In
            </Button>
            <Button
              formAction={signup}
              variant="outline"
              className="w-full"
            >
              Create Account
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
