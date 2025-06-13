import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import Stripe from 'https://esm.sh/stripe@14.21.0'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2025-05-28.basil',
  httpClient: Stripe.createFetchHttpClient(),
})

const cryptoProvider = Stripe.createSubtleCryptoProvider()

console.log("Stripe webhook function loaded")

serve(async (request) => {
  const signature = request.headers.get('Stripe-Signature')
  const body = await request.text()
  
  if (!signature) {
    return new Response('No signature', { status: 400 })
  }

  try {
    const receivedEvent = await stripe.webhooks.constructEventAsync(
      body,
      signature,
      Deno.env.get('STRIPE_WEBHOOK_SECRET')!,
      undefined,
      cryptoProvider
    )

    console.log(`🔔 Webhook received: ${receivedEvent.type}`)

    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Handle the event
    switch (receivedEvent.type) {
      case 'checkout.session.completed': {
        const session = receivedEvent.data.object as Stripe.Checkout.Session
        console.log(`💰 Checkout session completed: ${session.id}`)
        
        if (session.mode === 'subscription') {
          const subscriptionId = session.subscription as string
          const customerId = session.customer as string
          const userId = session.metadata?.user_id

          if (!userId) {
            console.error('No user_id in session metadata')
            break
          }

          // Get the subscription details
          const subscription = await stripe.subscriptions.retrieve(subscriptionId)
          const priceId = subscription.items.data[0]?.price.id

          // Map price ID to plan name
          let planName = 'free'
          if (priceId === Deno.env.get('STRIPE_PRICE_ID_PRO')) {
            planName = 'pro'
          } else if (priceId === Deno.env.get('STRIPE_PRICE_ID_TEAM')) {
            planName = 'team'
          }

          // Update subscription in database
          const { error } = await supabaseClient
            .from('subscriptions')
            .upsert({
              user_id: userId,
              stripe_customer_id: customerId,
              stripe_subscription_id: subscriptionId,
              plan_name: planName,
              status: subscription.status,
              current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
              current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
              updated_at: new Date().toISOString(),
            })

          if (error) {
            console.error('Error updating subscription:', error)
          } else {
            console.log(`✅ Subscription updated for user ${userId}`)
          }
        }
        break
      }

      case 'customer.subscription.updated': {
        const subscription = receivedEvent.data.object as Stripe.Subscription
        console.log(`🔄 Subscription updated: ${subscription.id}`)

        const customerId = subscription.customer as string
        const priceId = subscription.items.data[0]?.price.id

        // Map price ID to plan name
        let planName = 'free'
        if (priceId === Deno.env.get('STRIPE_PRICE_ID_PRO')) {
          planName = 'pro'
        } else if (priceId === Deno.env.get('STRIPE_PRICE_ID_TEAM')) {
          planName = 'team'
        }

        // Update subscription in database
        const { error } = await supabaseClient
          .from('subscriptions')
          .update({
            plan_name: planName,
            status: subscription.status,
            current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
            current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq('stripe_subscription_id', subscription.id)

        if (error) {
          console.error('Error updating subscription:', error)
        } else {
          console.log(`✅ Subscription updated: ${subscription.id}`)
        }
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = receivedEvent.data.object as Stripe.Subscription
        console.log(`❌ Subscription deleted: ${subscription.id}`)

        // Update subscription status to canceled
        const { error } = await supabaseClient
          .from('subscriptions')
          .update({
            plan_name: 'free',
            status: 'canceled',
            updated_at: new Date().toISOString(),
          })
          .eq('stripe_subscription_id', subscription.id)

        if (error) {
          console.error('Error updating subscription:', error)
        } else {
          console.log(`✅ Subscription canceled: ${subscription.id}`)
        }
        break
      }

      case 'invoice.payment_failed': {
        const invoice = receivedEvent.data.object as Stripe.Invoice
        console.log(`💳 Payment failed for invoice: ${invoice.id}`)

        if (invoice.subscription) {
          // Update subscription status
          const { error } = await supabaseClient
            .from('subscriptions')
            .update({
              status: 'past_due',
              updated_at: new Date().toISOString(),
            })
            .eq('stripe_subscription_id', invoice.subscription)

          if (error) {
            console.error('Error updating subscription status:', error)
          } else {
            console.log(`✅ Subscription marked as past_due: ${invoice.subscription}`)
          }
        }
        break
      }

      default:
        console.log(`🤷‍♀️ Unhandled event type: ${receivedEvent.type}`)
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (err) {
    console.error(`❌ Error processing webhook: ${err.message}`)
    return new Response(`Webhook Error: ${err.message}`, { status: 400 })
  }
})
