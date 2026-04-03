"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createClient } from "@/utils/supabase/server"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_placeholder", {
  apiVersion: "2024-12-18.acacia", // Use latest stable
})

export async function connectStripe(domain: string) {
  const supabase = await createClient()

  // 1. Resolve tenant
  const { data: tenant, error: tenantError } = await supabase
    .from("tenants")
    .select("*")
    .eq("slug", domain)
    .single()

  if (tenantError || !tenant) {
    throw new Error("Tenant not found")
  }

  // 2. Check if account already exists
  let stripeAccountId = tenant.stripe_account_id

  if (!stripeAccountId) {
    // Create a new connected account
    try {
      const account = await stripe.accounts.create({
        type: "standard",
        email: "placeholder@example.com", // In real world, use user email
        business_type: "individual",
        company: { name: tenant.name },
      })
      stripeAccountId = account.id

      // 3. Update database
      const { error: updateError } = await supabase
        .from("tenants")
        .update({ stripe_account_id: stripeAccountId })
        .eq("id", tenant.id)

      if (updateError) {
        throw new Error(updateError.message)
      }
    } catch (err) {
      console.error("Stripe Account Creation Error:", err)
      throw new Error("Failed to create Stripe Account.")
    }
  }

  // 4. Create Account Link for onboarding
  try {
    const accountLink = await stripe.accountLinks.create({
      account: stripeAccountId as string,
      refresh_url: `http://${domain}.localhost:3000/settings`,
      return_url: `http://${domain}.localhost:3000/settings`,
      type: "account_onboarding",
    })

    redirect(accountLink.url)
  } catch (err) {
    console.error("Stripe Account Link Error:", err)
    throw new Error("Failed to generate Stripe Onboarding Link.")
  }
}
