// /api/create-checkout-session.js
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  try {
    const { plan, user_id } = req.body || {};
    if (!user_id || !plan) return res.status(400).json({ error: 'missing_params' });

    // Stripe + Supabase (service role)
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    // Find user profile
    const { data: profile, error: pErr } = await supabase
      .from('profiles')
      .select('email, stripe_customer_id')
      .eq('user_id', user_id)
      .maybeSingle();

    if (pErr) throw pErr;
    if (!profile?.email) return res.status(400).json({ error: 'no_profile_email' });

    // Ensure Stripe customer
    let customerId = profile.stripe_customer_id;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: profile.email,
        metadata: { sb_user_id: user_id }
      });
      customerId = customer.id;
      await supabase.from('profiles')
        .update({ stripe_customer_id: customerId })
        .eq('user_id', user_id);
    }

    // Your price IDs (from Vercel env)
    const priceId =
      plan === 'family'
        ? process.env.STRIPE_PRICE_FAMILY
        : process.env.STRIPE_PRICE_PREMIUM;

    if (!priceId) return res.status(500).json({ error: 'missing_price_id' });

    const seats = plan === 'family' ? 4 : 1;

    // 5-day trial
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      customer: customerId,
      line_items: [{ price: priceId, quantity: 1 }],
      subscription_data: {
        trial_period_days: 5,
        metadata: {
          plan,            // 'premium' | 'family'
          sb_user_id: user_id,
          seats
        }
      },
      metadata: { plan, sb_user_id: user_id, seats },
      allow_promotion_codes: true,
      success_url: `${process.env.PUBLIC_SITE_URL}/stories.html?subscribe=ok`,
      cancel_url: `${process.env.PUBLIC_SITE_URL}/landing.html?subscribe=cancel`
    });

    res.json({ url: session.url });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'session_failed', message: e.message });
  }
}
