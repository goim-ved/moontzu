import { NextResponse } from "next/server"
import { headers } from "next/headers"
import Stripe from "stripe"
import { createClient } from "@supabase/supabase-js"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_placeholder", {
  apiVersion: "2024-12-18.acacia",
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(req: Request) {
  try {
    const body = await req.text()
    const headersList = await headers()
    const signature = headersList.get("stripe-signature")

    if (!signature) {
      return NextResponse.json({ error: "No signature" }, { status: 400 })
    }

    let event: Stripe.Event
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err: any) {
      console.error(`Webhook Error: ${err.message}`)
      return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 })
    }

    // We use a service role key here as webhooks don't have user authentication
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    // NOTE: Need STRIPE_WEBHOOK_SUPABASE_SERVICE_KEY (service_role) to bypass RLS in the webhook
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session

      const appointmentId = session.metadata?.appointment_id

      if (appointmentId) {
        // Update appointment status to confirmed
        const { error } = await supabase
          .from("appointments")
          .update({ status: "confirmed" })
          .eq("id", appointmentId)

        if (error) {
          console.error(`Error updating appointment ${appointmentId}:`, error)
          return NextResponse.json({ error: "Failed to update appointment" }, { status: 500 })
        }

        console.log(`Successfully confirmed appointment ${appointmentId}`)
      }
    }

    return NextResponse.json({ received: true }, { status: 200 })
  } catch (err: any) {
    console.error("Webhook processing failed:", err.message)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
