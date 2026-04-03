import { notFound } from "next/navigation"

export default async function TenantPage({
  params,
}: {
  params: Promise<{ domain: string }>
}) {
  const domain = (await params).domain

  if (!domain) {
    return notFound()
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-muted/50 p-6">
      <div className="bg-background rounded-lg shadow-xl p-8 max-w-xl text-center">
        <h1 className="text-4xl font-bold tracking-tight mb-4">Welcome to {domain}</h1>
        <p className="text-muted-foreground text-lg mb-8 italic">
          Middleware rewrite successful. This is the dynamic route for the subdomain.
        </p>
        <div className="p-4 bg-primary/10 rounded-md border border-primary/20 text-primary font-mono select-all">
          Subdomain context: {domain}
        </div>
      </div>
    </div>
  )
}
