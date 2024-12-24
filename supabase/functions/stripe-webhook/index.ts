import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';
import Stripe from 'https://esm.sh/stripe@14.14.0';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') ?? '', {
  apiVersion: '2023-10-16',
});

const endpointSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET') ?? '';

serve(async (req) => {
  const signature = req.headers.get('stripe-signature');
  
  if (!signature) {
    return new Response('No signature', { status: 400 });
  }

  try {
    const body = await req.text();
    const event = stripe.webhooks.constructEvent(body, signature, endpointSecret);

    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        const subscription = event.data.object;
        await updateSubscriptionStatus(
          subscription.customer as string,
          subscription.id,
          subscription.status,
          new Date(subscription.current_period_end * 1000)
        );
        break;

      case 'customer.subscription.deleted':
        const deletedSubscription = event.data.object;
        await updateSubscriptionStatus(
          deletedSubscription.customer as string,
          deletedSubscription.id,
          'canceled',
          new Date()
        );
        break;
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 400 }
    );
  }
});

async function updateSubscriptionStatus(
  stripeCustomerId: string,
  subscriptionId: string,
  status: string,
  periodEnd: Date
) {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  );

  await supabase
    .from('stripe_customers')
    .update({
      subscription_id: subscriptionId,
      subscription_status: status,
      current_period_end: periodEnd.toISOString(),
    })
    .eq('customer_id', stripeCustomerId);
}