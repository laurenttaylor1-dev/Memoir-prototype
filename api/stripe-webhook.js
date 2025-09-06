// /api/stripe-webhook.js
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

export const config = { api: { bodyParser: false } }; // we need raw body

function buffer(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', (c) => chunks.push(c));
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const sig = req.headers['stripe-signature'];
  const buf = await buffer(req);

  let event;
  try {
    event = stripe.webhooks.constructEvent(buf, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const s = event.data.object;
        // You should include your Supabase user id in session metadata when creating the checkout.
        const user_id = s.metadata?.sb_user_id;
        const customer = s.customer;
        if (user_id && customer) {
          await supabase.from('profiles').update({
            stripe_customer_id: String(customer),
            plan: 'premium'
          }).eq('user_id', user_id);
        }
        break;
      }
      case 'customer.subscription.updated':
      case 'customer.subscription.created': {
        const sub = event.data.object;
        const customer = sub.customer;
        // Find the owner row by customer id
        const { data } = await supabase.from('profiles')
          .select('user_id').eq('stripe_customer_id', String(customer)).maybeSingle();
        if (data?.user_id) {
          await supabase.from('profiles').update({
            stripe_subscription_id: String(sub.id),
            plan: sub.status === 'active' ? 'premium' : 'free'
          }).eq('user_id', data.user_id);
        }
        break;
      }
      case 'customer.subscription.deleted': {
        const sub = event.data.object;
        const customer = sub.customer;
        const { data } = await supabase.from('profiles')
          .select('user_id').eq('stripe_customer_id', String(customer)).maybeSingle();
        if (data?.user_id) {
          await supabase.from('profiles').update({
            stripe_subscription_id: null,
            plan: 'free'
          }).eq('user_id', data.user_id);
        }
        break;
      }
      default:
        // ignore others for now
        break;
    }
    res.json({ received: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'handler_failed' });
  }
}
