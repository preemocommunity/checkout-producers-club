const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
module.exports = async (req, res) => {
  if (req.method !== "POST") return res.status(405).end();
  const { email, returnUrl } = req.body;
  try {
    const cs = await stripe.customers.list({ email, limit: 1 });
    if (!cs.data.length) return res.status(200).json({ error: "no_customer" });
    const s = await stripe.billingPortal.sessions.create({ customer: cs.data[0].id, return_url: returnUrl });
    res.status(200).json({ url: s.url });
  } catch (e) { res.status(500).json({ error: e.message }); }
};
