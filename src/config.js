// ─────────────────────────────────────────────────────────────
// config.js — THE ONLY FILE YOU EDIT TO CREATE A NEW PRODUCT PAGE
// Duplicate this repo, fill in this file, deploy. Done.
// ─────────────────────────────────────────────────────────────

const CONFIG = {
  // Product identity
  name:        "Producer's Club",
  tagline:     "Education · Community · Compass Pro",
  emoji:       "🎬",
  description: "The Producer's Club is where serious creators learn to operate like a studio. Curriculum, community, and direct access to Martin — plus Compass Pro bundled in.",

  // Accent color — one color per product
  accent:     "#4A90D9",
  accentDark: "#0A1628",

  // Billing mode: "subscription" or "payment" (one-time)
  mode: "subscription",

  // Tiers — 1, 2, or 3. Remove objects you don't need.
  tiers: [
    {
      id:           "monthly",
      label:        "Monthly",
      description:  "Full access, cancel anytime",
      price:        97,
      currency:     "usd",
      interval:     "month",        // null if one-time
      stripePriceId:"price_REPLACE_monthly",
      badge:        null,
    },
    {
      id:           "annual",
      label:        "Annual",
      description:  "2 months free — best value",
      price:        797,
      currency:     "usd",
      interval:     "year",
      perMonth:     66,             // shown as "~$66/mo effective"
      stripePriceId:"price_REPLACE_annual",
      badge:        "Save 32%",
    },
  ],

  // What's included — up to 8 features
  features: [
    { label: "Full curriculum",           detail: "12 modules, 60+ lessons" },
    { label: "Weekly live sessions",      detail: "Every Thursday, recorded" },
    { label: "Private community",         detail: "Discord + inner circle" },
    { label: "Compass Pro — included",    detail: "No separate subscription needed" },
    { label: "Creator toolkit",           detail: "Scripts, briefs, decks" },
    { label: "Direct feedback",           detail: "Monthly review calls with Martin" },
    { label: "Campaign Dashboard",        detail: "Track every brand deal" },
    { label: "Guest expert sessions",     detail: "Monthly external speakers" },
  ],

  // Social proof numbers — 3 max
  stats: [
    { value: "120+", label: "Active members" },
    { value: "3yr",  label: "Running" },
    { value: "4.9★", label: "Avg rating" },
  ],

  // Testimonials — 1 or 2
  testimonials: [
    {
      quote:  "The Club changed everything. I went from guessing to operating. Doubled my brand deal rate in 90 days.",
      name:   "Karim R.",
      role:   "Fitness creator, Canggu",
      avatar: "💪",
    },
    {
      quote:  "Having Compass Pro bundled in made this a no-brainer. I was paying for both separately before.",
      name:   "Lea M.",
      role:   "Food creator, Ubud",
      avatar: "🥘",
    },
  ],

  // FAQs — 3 to 5
  faqs: [
    {
      q: "Does this include Compass Pro?",
      a: "Yes. Compass Pro is fully bundled. No separate subscription — it activates automatically when you join.",
    },
    {
      q: "Can I cancel anytime?",
      a: "Yes. Cancel before your next billing date with one click. No contracts, no questions.",
    },
    {
      q: "Is there a free trial?",
      a: "No trial, but a 30-day money-back guarantee. If the Club isn't the right fit in 30 days, we refund you in full.",
    },
    {
      q: "What platform is the community on?",
      a: "Skool. Curriculum, discussions, live sessions, and replays all in one place.",
    },
  ],

  // URLs — update for each deployed instance
  successUrl: "https://checkout.premo.inc/success?session_id={CHECKOUT_SESSION_ID}",
  cancelUrl:  "https://checkout.premo.inc/producersclub",
};

export default CONFIG;
