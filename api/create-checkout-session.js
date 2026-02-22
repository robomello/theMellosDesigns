import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end();
  }

  const { items } = req.body;

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'No items provided' });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      shipping_address_collection: { allowed_countries: ['US'] },
      line_items: items.map(item => ({
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.title,
            images: [item.image_url],
          },
          unit_amount: Math.round(parseFloat(item.price.replace('$', '')) * 100),
        },
        quantity: item.quantity,
      })),
      success_url: `${req.headers.origin}/?success=true`,
      cancel_url: `${req.headers.origin}/`,
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error('Stripe error:', err.message);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
}
