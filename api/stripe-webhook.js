// /api/stripe-webhook.js
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

export const config = { api: { bodyParser: false } };

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

  const upsertByUserId = async (user_id, fields) =>
    supabase.from('profiles').update(fields).eq('user_id', user_id);

  const updateByCustomer = async (customer, fields) => {
    const { data } = await supabase.from('profiles')
      .select('user_id').eq('stripe_customer_id', String(customer)).maybeSingle();
    if (data?.user_id) return upsertByUserId(data.user_id, fields);
  };

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const s = event.data.object;
        const user_id = s.metadata?.sb_user_id;
        const plan = s.metadata?.plan || 'individual';
        const seats = Number(s.metadata?.seats || (plan === 'family' ? 4 : 1));
        const customer = s.customer;
        if (user_id && customer) {
          await upsertByUserId(user_id, {
            stripe_customer_id: String(customer),
            plan: 'premium',
            seats
          });
        }
        break;
      }

      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const sub = event.data.object;
        const customer = sub.customer;
        // If you stored plan/seats in subscription metadata:
        const planMeta = sub.metadata?.plan || 'individual';
        const seatsMeta = Number(sub.metadata?.seats || (planMeta === 'family' ? 4 : 1));
        await updateByCustomer(customer, {
          stripe_subscription_id: String(sub.id),
          plan: sub.status === 'active' ? 'premium' : 'free',
          seats: seatsMeta
        });
        break;
      }

      case 'customer.subscription.deleted': {
        const sub = event.data.object;
        await updateByCustomer(sub.customer, {
          stripe_subscription_id: null,
          plan: 'free',
          seats: 1
        });
        break;
      }

      default: break;
    }

    res.json({ received: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'handler_failed' });
  }
}
