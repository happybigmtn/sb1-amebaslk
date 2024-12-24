import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';
import Stripe from 'https://esm.sh/stripe@14.14.0';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') ?? '', {
  apiVersion: '2023-10-16',
});

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { user_id } = await req.json();
    
    // Create or get Stripe customer
    const { data: customerData } = await supabase
      .from('stripe_customers')
      .select('customer_id')
      .eq('id', user_id)
      .single();

    let customerId = customerData?.customer_id;

    if (!customerId) {
      const { data: userData } = await supabase
        .from('profiles')
        .select('email')
        .eq('id', user_id)
        .single();

      const customer = await stripe.customers.create({
        email: userData.email,
        metadata: { user_id },
      });

      customerId = customer.id;

      await supabase
        .from('stripe_customers')
        .insert({
          id: user_id,
          customer_id: customerId,
        });
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Casino Pro Subscription',
              description: 'Monthly subscription with UBI token benefits',
            },
            unit_amount: 1000, // $10.00
            recurring: {
              interval: 'month',
            },
          },
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${req.headers.get('origin')}/subscription/success`,
      cancel_url: `${req.headers.get('origin')}/subscription/cancel`,
    });

    return new Response(
      JSON.stringify({ sessionId: session.id }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    );
  }
});