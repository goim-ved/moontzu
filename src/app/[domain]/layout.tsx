import { notFound } from "next/navigation"

export default async function TenantLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ domain: string }>
}) {
  const domain = (await params).domain

  if (!domain) {
    return notFound()
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Dynamic branding header would go here later */}
      <main>{children}</main>
    </div>
  )
}
