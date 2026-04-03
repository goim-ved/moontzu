"use server"

import { redirect } from "next/navigation"
import { createClient } from "@/utils/supabase/server"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_placeholder", {
  apiVersion: "2024-12-18.acacia",
})

export async function createAppointment(domain: string, serviceId: string, formData: FormData) {
  const supabase = await createClient()

  const customerName = formData.get("customer_name") as string
  const customerEmail = formData.get("customer_email") as string
  const startTime = formData.get("start_time") as string

  // 1. Resolve tenant with Stripe info
  const { data: tenant, error: tenantError } = await supabase
    .from("tenants")
    .select("id, stripe_account_id")
    .eq("slug", domain)
    .single()

  if (tenantError || !tenant) {
    throw new Error("Tenant not found")
  }

  // 2. Fetch service details
  const { data: service, error: serviceError } = await supabase
    .from("services")
    .select("*")
    .eq("id", serviceId)
    .single()

  if (serviceError || !service) {
    throw new Error("Service not found")
  }

  // 3. Optional: Verify Stripe Connection
  if (!tenant.stripe_account_id) {
    throw new Error("This business is not currently accepting payments.")
  }

  // 4. Create appointment FIRST to get its ID (Pending status)
  const start = new Date(startTime)
  const end = new Date(start.getTime() + service.duration_minutes * 60000)

  const { data: appointment, error: appointmentError } = await supabase
    .from("appointments")
    .insert([{
      tenant_id: tenant.id,
      service_id: serviceId,
      customer_name: customerName,
      customer_email: customerEmail,
      start_time: start.toISOString(),
      end_time: end.toISOString(),
      status: "pending"
    }])
    .select("id")
    .single()

  if (appointmentError || !appointment) {
    throw new Error("Failed to create pending appointment.")
  }

  // 5. Create a Stripe Checkout Session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: service.name,
            description: service.description || undefined,
          },
          unit_amount: Math.round(service.price * 100), // Stripe uses cents
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `http://${domain}.localhost:3000/?success=true`,
    cancel_url: `http://${domain}.localhost:3000/book/${serviceId}?cancelled=true`,
    payment_intent_data: {
      application_fee_amount: Math.round(service.price * 100 * 0.1), // 10% Platform Fee
      transfer_data: {
        destination: tenant.stripe_account_id,
      },
    },
    metadata: {
      tenant_id: tenant.id,
      service_id: serviceId,
      appointment_id: appointment.id,
    },
  })

  if (session.url) {
    redirect(session.url)
  } else {
    throw new Error("Failed to generate checkout session.")
  }
}
