// api/checkout.js
// Requires env: STRIPE_SECRET_KEY
export default async function handler(req, res) {
  try {
    const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
    const { plan = 'premium', email } = req.body || {};

    const priceId = {
      premium: process.env.STRIPE_PRICE_PREMIUM, // e.g. price_xxx for €4.99
      family:  process.env.STRIPE_PRICE_FAMILY,  // e.g. price_yyy for €7.99
    }[plan] || process.env.STRIPE_PRICE_PREMIUM;

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      customer_email: email || undefined,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${req.headers.origin}/stories.html?sub=success`,
      cancel_url: `${req.headers.origin}/landing.html?sub=cancelled`,
    });

    res.status(200).json({ url: session.url });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
