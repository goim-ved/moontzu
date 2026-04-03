"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createClient } from "@/utils/supabase/server"

export async function login(formData: FormData) {
  const supabase = await createClient()

  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  }

  const { data: authData, error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    // Better handling for unconfirmed email state
    if (error.message.toLowerCase().includes("email not confirmed")) {
      redirect("/login?unconfirmed=true")
    }
    redirect("/login?error=" + encodeURIComponent(error.message))
  }

  if (authData?.user) {
    // 1. Check if platform admin
    const { data: profile } = await supabase
      .from("profiles")
      .select("is_platform_admin")
      .eq("id", authData.user.id)
      .single()

    if (profile?.is_platform_admin) {
      revalidatePath("/", "layout")
      redirect("/admin")
    }

    // 2. Check if user is a tenant member
    const { data: member } = await supabase
      .from("tenant_members")
      .select("tenants(slug)")
      .eq("user_id", authData.user.id)
      .limit(1)
      .single()

    if (member?.tenants) {
      // TypeScript safety cast since it might be an array or object initially
      const slug = (member.tenants as any).slug
      if (slug) {
        const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || "localhost:3000"
        revalidatePath("/", "layout")
        redirect(`http://${slug}.${rootDomain}`)
      }
    }
  }

  // 3. Fallback to onboarding if no tenant found
  revalidatePath("/", "layout")
  redirect("/onboarding")
}

export async function signup(formData: FormData) {
  const supabase = await createClient()

  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  }

  const { error } = await supabase.auth.signUp(data)

  if (error) {
    redirect("/login?error=" + encodeURIComponent(error.message))
  }

  // After signup, redirect to login with a success notice
  redirect("/login?signup_success=true")
}

