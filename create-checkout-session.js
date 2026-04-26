const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
module.exports = async (req, res) => {
  if (req.method !== "POST") return res.status(405).end();
  const { priceId, mode, productId, tierId, successUrl, cancelUrl } = req.body;
  if (!priceId || !mode || !successUrl || !cancelUrl) return res.status(400).json({ error: "Missing fields" });
  try {
    const session = await stripe.checkout.sessions.create({
      mode,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: successUrl,
      cancel_url: cancelUrl,
      allow_promotion_codes: true,
      billing_address_collection: "auto",
      metadata: { productId: productId || "", tierId: tierId || "" },
      ...(mode === "subscription" ? { subscription_data: { metadata: { productId, tierId } }, customer_creation: "always" } : {}),
      ...(mode === "payment" ? { payment_intent_data: { metadata: { productId, tierId } } } : {}),
    });
    res.status(200).json({ url: session.url });
  } catch (e) { res.status(500).json({ error: e.message }); }
};
