// Full webhook — subscription lifecycle + dunning
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const { createClient } = require("@supabase/supabase-js");
const sb = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

const upsert = (cid, data) =>
  sb.from("subscriptions").upsert(
    { stripe_customer_id: cid, ...data, updated_at: new Date().toISOString() },
    { onConflict: "stripe_customer_id" }
  );

const daysSince = ts => Math.floor((Date.now() / 1000 - ts) / 86400);
const DUNNING = { graceDays: 7, suspendDays: 14, cancelDays: 30 };

module.exports = async (req, res) => {
  if (req.method !== "POST") return res.status(405).end();
  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      req.headers["stripe-signature"],
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (e) { return res.status(400).send(`Webhook Error: ${e.message}`); }

  const d = event.data.object;
  switch (event.type) {
    case "checkout.session.completed":
      await upsert(d.customer, {
        stripe_subscription_id: d.subscription || null,
        product_id: d.metadata?.productId,
        tier_id:    d.metadata?.tierId,
        status:     d.mode === "payment" ? "lifetime" : "active",
        access_level: "active",
        payment_failed_at: null,
        failed_payment_count: 0,
      });
      break;

    case "customer.subscription.updated":
    case "customer.subscription.created":
      await upsert(d.customer, {
        stripe_subscription_id: d.id,
        stripe_price_id:        d.items.data[0]?.price.id,
        status:       d.status,
        access_level: d.status === "active" ? "active" : d.status === "past_due" ? "grace" : "suspended",
        current_period_end:   d.current_period_end,
        cancel_at_period_end: d.cancel_at_period_end,
      });
      break;

    case "customer.subscription.deleted":
      await upsert(d.customer, { status: "cancelled", access_level: "cancelled" });
      break;

    case "invoice.payment_failed": {
      const { data: rec } = await sb.from("subscriptions")
        .select("payment_failed_at, failed_payment_count")
        .eq("stripe_customer_id", d.customer).single();

      const failedAt = rec?.payment_failed_at || new Date().toISOString();
      const days = daysSince(new Date(failedAt).getTime() / 1000);
      const access = days >= DUNNING.cancelDays ? "cancelled"
                   : days >= DUNNING.suspendDays ? "suspended"
                   : "grace";

      if (access === "cancelled") {
        try { await stripe.subscriptions.cancel(d.subscription); } catch (_) {}
      }

      await upsert(d.customer, {
        status: "past_due",
        access_level: access,
        payment_failed_at: failedAt,
        failed_payment_count: (rec?.failed_payment_count || 0) + 1,
      });
      // → Trigger email sequence here (Resend / Postmark / etc.)
      // Day 0: "Payment failed, please update card"
      // Day 7: "Access at risk — last chance"
      // Day 14: "Account suspended"
      // Day 30: "Subscription cancelled"
      break;
    }

    case "invoice.payment_succeeded":
      if (["subscription_cycle","subscription_create","subscription_update"].includes(d.billing_reason)) {
        await upsert(d.customer, {
          status: "active",
          access_level: "active",
          payment_failed_at: null,
          failed_payment_count: 0,
        });
      }
      break;
  }
  res.status(200).json({ received: true });
};
