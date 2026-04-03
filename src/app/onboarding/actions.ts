"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createClient } from "@/utils/supabase/server"

export async function createTenant(formData: FormData) {
  const supabase = await createClient()

  const name = formData.get("name") as string
  const slug = formData.get("slug") as string

  // 1. Get current user
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) {
    redirect("/login?error=Unauthorized")
  }

  // 2. Insert into public.tenants
  const { data: tenant, error: tenantError } = await supabase
    .from("tenants")
    .insert([{ name, slug }])
    .select()
    .single()

  if (tenantError) {
    throw new Error(tenantError.message)
  }

  // 3. Insert into public.tenant_members as owner
  const { error: memberError } = await supabase
    .from("tenant_members")
    .insert([{
      tenant_id: tenant.id,
      user_id: user.id,
      role: "owner"
    }])

  if (memberError) {
    throw new Error(memberError.message)
  }

  // 4. Redirect to new tenant's subdomain
  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || "localhost:3000"
  
  revalidatePath("/", "layout")
  redirect(`http://${slug}.${rootDomain}`)
}
