// api/stripe-webhook.js
// Requires env: STRIPE_WEBHOOK_SECRET, STRIPE_SECRET_KEY
// Update Supabase profile plan on checkout completion.
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

export const config = { api: { bodyParser: false } };

export default async function handler(req, res) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const sig = req.headers['stripe-signature'];
  let event;
  try {
    const raw = await buffer(req);
    event = stripe.webhooks.constructEvent(raw, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    // If you pass user_id as metadata when creating the session, use it here:
    const userId = session.metadata?.user_id;
    if (userId) {
      const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
      await supabase.from('profiles').update({ plan: 'premium' }).eq('user_id', userId);
    }
  }

  res.json({ received: true });
}

function buffer(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', (c)=>chunks.push(c));
    req.on('end', ()=>resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}
