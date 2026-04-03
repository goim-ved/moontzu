"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/utils/supabase/server"

export async function createService(domain: string, formData: FormData) {
  const supabase = await createClient()

  const name = formData.get("name") as string
  const description = formData.get("description") as string
  const duration = parseInt(formData.get("duration") as string)
  const price = parseFloat(formData.get("price") as string)

  // 1. Resolve tenant by slug
  const { data: tenant, error: tenantError } = await supabase
    .from("tenants")
    .select("id")
    .eq("slug", domain)
    .single()

  if (tenantError || !tenant) {
    throw new Error("Tenant not found")
  }

  // 2. Insert service (RLS will verify user is a member)
  const { error } = await supabase
    .from("services")
    .insert([{
      tenant_id: tenant.id,
      name,
      description,
      duration_minutes: duration,
      price
    }])

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath(`/${domain}/services`)
}
