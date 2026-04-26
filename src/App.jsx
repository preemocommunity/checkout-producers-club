import React, { useState } from "react";
import CONFIG from "./config";

// ── Exact Prëmo design tokens (matches Creator's Compass live) ────────────────
const B = {
  navy:        "#0A1628",
  midBlue:     "#2B5C8A",
  lightBlue:   "#4A90D9",
  skyBlue:     "#E8F4FD",
  ice:         "#F0F6FC",
  white:       "#FFFFFF",
  glass:       "rgba(255,255,255,0.72)",
  glassBorder: "rgba(74,144,217,0.18)",
  glassHover:  "rgba(255,255,255,0.92)",
  shadow:      "0 8px 32px rgba(10,22,40,0.08)",
  shadowHover: "0 12px 40px rgba(10,22,40,0.14)",
  text:        "#1A2A3A",
  textMuted:   "#5A7080",
  textLight:   "#8899AA",
  green:       "#1B7A3D",
  greenBg:     "#E6F4EA",
};
const sans  = "'Montserrat', sans-serif";
const mono  = "'DM Mono', 'Courier New', monospace";
const serif = "'Cormorant Garamond', Georgia, serif";

// ── Primitives ────────────────────────────────────────────────────────────────

function GlassCard({ children, style }) {
  return (
    <div style={{
      background: B.glass, backdropFilter: "blur(20px)",
      WebkitBackdropFilter: "blur(20px)", border: `1px solid ${B.glassBorder}`,
      borderRadius: 16, boxShadow: B.shadow, ...style,
    }}>{children}</div>
  );
}

function Label({ children }) {
  return (
    <div style={{
      fontSize: 10, fontWeight: 700, letterSpacing: "1.5px",
      textTransform: "uppercase", color: B.textLight,
      fontFamily: mono, marginBottom: 14,
    }}>{children}</div>
  );
}

// ── Tier card ─────────────────────────────────────────────────────────────────

function TierCard({ tier, selected, onSelect }) {
  const [hov, setHov] = useState(false);
  const active = selected === tier.id;
  const accent = CONFIG.accent;

  return (
    <div
      onClick={() => onSelect(tier.id)}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        border:       `1.5px solid ${active ? accent : hov ? B.lightBlue : B.glassBorder}`,
        borderRadius: 12,
        padding:      "18px 20px",
        cursor:       "pointer",
        background:   active ? `${accent}09` : B.white,
        transition:   "all 0.18s",
        display:      "flex",
        alignItems:   "center",
        justifyContent: "space-between",
        gap:          12,
        boxShadow:    active ? `0 0 0 3px ${accent}18` : "none",
      }}
    >
      {/* Radio + label */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, flex: 1 }}>
        <div style={{
          width: 20, height: 20, borderRadius: "50%", flexShrink: 0,
          border: `2px solid ${active ? accent : B.glassBorder}`,
          background: active ? accent : "transparent",
          display: "flex", alignItems: "center", justifyContent: "center",
          transition: "all 0.15s",
        }}>
          {active && <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#fff" }}/>}
        </div>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 15, fontWeight: 700, color: B.navy, fontFamily: sans }}>
              {tier.label}
            </span>
            {tier.badge && (
              <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", padding: "3px 9px", borderRadius: 20, background: `${accent}18`, color: accent, fontFamily: mono }}>
                {tier.badge}
              </span>
            )}
          </div>
          <div style={{ fontSize: 11, color: B.textMuted, fontFamily: mono, marginTop: 3 }}>
            {tier.description}
          </div>
        </div>
      </div>

      {/* Price */}
      <div style={{ textAlign: "right", flexShrink: 0 }}>
        <div style={{ fontSize: 22, fontWeight: 800, color: active ? accent : B.navy, fontFamily: sans, letterSpacing: "-0.5px" }}>
          ${tier.price}{tier.interval ? (tier.interval === "year" ? "/yr" : "/mo") : ""}
        </div>
        {tier.perMonth && (
          <div style={{ fontSize: 10, color: B.green, fontFamily: mono, marginTop: 1, fontWeight: 600 }}>
            ~${tier.perMonth}/mo
          </div>
        )}
      </div>
    </div>
  );
}

// ── FAQ accordion ─────────────────────────────────────────────────────────────

function FAQ({ q, a, last }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: last ? "none" : `1px solid ${B.glassBorder}`, paddingBottom: last ? 0 : 16, marginBottom: last ? 0 : 16 }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{ width: "100%", background: "none", border: "none", padding: 0, cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, textAlign: "left" }}
      >
        <span style={{ fontSize: 14, fontWeight: 600, color: B.navy, fontFamily: sans, lineHeight: 1.5 }}>{q}</span>
        <span style={{ fontSize: 20, color: CONFIG.accent, flexShrink: 0, transition: "transform 0.2s", transform: open ? "rotate(45deg)" : "none", fontWeight: 300, lineHeight: 1 }}>+</span>
      </button>
      {open && (
        <div style={{ marginTop: 10, fontSize: 13, color: B.textMuted, fontFamily: mono, lineHeight: 1.7 }}>{a}</div>
      )}
    </div>
  );
}

// ── Order summary ─────────────────────────────────────────────────────────────

function OrderSummary({ selectedTier, onCheckout, loading }) {
  const tier = CONFIG.tiers.find(t => t.id === selectedTier);
  if (!tier) return null;
  const accent = CONFIG.accent;
  const accentDark = CONFIG.accentDark;

  return (
    <GlassCard style={{ padding: 28 }}>
      <Label>Order Summary</Label>

      {/* Product */}
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20, paddingBottom: 20, borderBottom: `1px solid ${B.glassBorder}` }}>
        <div style={{ width: 50, height: 50, borderRadius: 12, flexShrink: 0, background: `linear-gradient(135deg, ${accentDark} 0%, ${accent} 100%)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>
          {CONFIG.emoji}
        </div>
        <div>
          <div style={{ fontSize: 15, fontWeight: 700, color: B.navy, fontFamily: sans }}>{CONFIG.name}</div>
          <div style={{ fontSize: 11, color: B.textMuted, fontFamily: mono, marginTop: 2 }}>{tier.label} plan</div>
        </div>
      </div>

      {/* Price breakdown */}
      <div style={{ marginBottom: 12 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
          <span style={{ fontSize: 12, color: B.textMuted, fontFamily: mono }}>
            {CONFIG.mode === "payment" ? "One-time" : `Billed ${tier.interval === "year" ? "annually" : "monthly"}`}
          </span>
          <span style={{ fontSize: 13, fontWeight: 600, color: B.text, fontFamily: sans }}>
            ${tier.price}{tier.interval ? (tier.interval === "year" ? "/yr" : "/mo") : ""}
          </span>
        </div>
        {tier.perMonth && (
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ fontSize: 11, color: B.green, fontFamily: mono }}>Effective monthly rate</span>
            <span style={{ fontSize: 11, color: B.green, fontFamily: mono, fontWeight: 600 }}>~${tier.perMonth}/mo</span>
          </div>
        )}
      </div>

      <div style={{ borderTop: `1px solid ${B.glassBorder}`, paddingTop: 12, marginBottom: 20, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: B.text, fontFamily: sans }}>
          {CONFIG.mode === "payment" ? "Due today" : "First charge"}
        </span>
        <span style={{ fontSize: 24, fontWeight: 800, color: B.navy, fontFamily: sans, letterSpacing: "-0.5px" }}>
          ${tier.price}{tier.interval ? (tier.interval === "year" ? "/yr" : "/mo") : ""}
        </span>
      </div>

      {/* CTA button — same gradient as all Prëmo platforms */}
      <button
        onClick={onCheckout}
        disabled={loading}
        style={{
          width: "100%", padding: "15px 0",
          background: loading ? B.textLight : `linear-gradient(135deg, ${accentDark} 0%, ${accent} 100%)`,
          color: "#fff", border: "none", borderRadius: 10,
          fontSize: 15, fontWeight: 700, fontFamily: sans,
          cursor: loading ? "default" : "pointer",
          boxShadow: loading ? "none" : `0 6px 24px ${accent}44`,
          transition: "all 0.2s", letterSpacing: "0.3px",
        }}
      >
        {loading ? "Redirecting..." : CONFIG.mode === "payment" ? `Get ${CONFIG.name} →` : `Start ${tier.label} →`}
      </button>

      {/* Trust signals */}
      <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 6 }}>
        {[
          CONFIG.mode === "subscription" ? "Cancel anytime, no questions" : "Lifetime access, one payment",
          "Secured by Stripe · PCI compliant",
          "30-day money-back guarantee",
        ].map(t => (
          <div key={t} style={{ display: "flex", alignItems: "center", gap: 7 }}>
            <span style={{ fontSize: 11, color: B.green }}>✓</span>
            <span style={{ fontSize: 11, color: B.textLight, fontFamily: mono }}>{t}</span>
          </div>
        ))}
      </div>
    </GlassCard>
  );
}

// ── ROOT ──────────────────────────────────────────────────────────────────────

export default function App() {
  const defaultTier = CONFIG.tiers.find(t => t.badge) || CONFIG.tiers[0];
  const [selectedTier, setSelectedTier] = useState(defaultTier.id);
  const [loading, setLoading]           = useState(false);
  const [error, setError]               = useState(null);

  const handleCheckout = async () => {
    const tier = CONFIG.tiers.find(t => t.id === selectedTier);
    if (!tier) return;
    setLoading(true); setError(null);
    try {
      const res = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          priceId:    tier.stripePriceId,
          mode:       CONFIG.mode,
          productId:  CONFIG.name.toLowerCase().replace(/\s+/g, "-"),
          tierId:     tier.id,
          successUrl: CONFIG.successUrl,
          cancelUrl:  CONFIG.cancelUrl,
        }),
      });
      const data = await res.json();
      if (data.url) { window.location.href = data.url; }
      else throw new Error(data.error || "Something went wrong");
    } catch (e) {
      setError(e.message);
      setLoading(false);
    }
  };

  return (
    <div style={{ fontFamily: sans, minHeight: "100vh", background: `linear-gradient(165deg, ${B.white} 0%, ${B.ice} 40%, ${B.skyBlue} 100%)`, color: B.text, position: "relative", overflow: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700;800;900&family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=DM+Mono:wght@300;400&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html, body { background: #F0F6FC; }
        button { transition: all 0.18s; }
        button:hover:not(:disabled) { opacity: 0.9; transform: translateY(-1px); }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
        .fadein { animation: fadeUp 0.55s ease forwards; }
        @media (max-width: 820px) {
          .grid { grid-template-columns: 1fr !important; }
          .hero-h1 { font-size: 28px !important; }
        }
      `}</style>

      {/* Ambient blobs — same as Creator's Compass */}
      <div style={{ position:"fixed",top:"-20%",right:"-10%",width:600,height:600,borderRadius:"50%",background:`radial-gradient(circle,${CONFIG.accent}09 0%,transparent 70%)`,pointerEvents:"none",zIndex:0 }}/>
      <div style={{ position:"fixed",bottom:"-15%",left:"-5%",width:500,height:500,borderRadius:"50%",background:`radial-gradient(circle,rgba(30,58,95,0.05) 0%,transparent 70%)`,pointerEvents:"none",zIndex:0 }}/>

      {/* ── HEADER ── */}
      <header style={{
        position: "sticky", top: 0, zIndex: 100,
        background: B.glass, backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
        borderBottom: `1px solid ${B.glassBorder}`,
        padding: "14px 32px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width:38,height:38,borderRadius:10,background:`linear-gradient(135deg,${B.navy} 0%,${B.midBlue} 100%)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20 }}>
            {CONFIG.emoji}
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: B.navy, letterSpacing: "0.5px", fontFamily: sans }}>{CONFIG.name}</div>
            <div style={{ fontSize: 9, color: B.textLight, letterSpacing: "2.5px", textTransform: "uppercase", fontFamily: mono }}>Prëmo Inc. · Secure Checkout</div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
          <div style={{ width: 7, height: 7, borderRadius: "50%", background: B.green }}/>
          <span style={{ fontSize: 10, color: B.textLight, fontFamily: mono }}>Secured by Stripe</span>
        </div>
      </header>

      {/* ── MAIN ── */}
      <div style={{ position: "relative", zIndex: 1, maxWidth: 1060, margin: "0 auto", padding: "52px 24px 80px" }}>

        {/* Hero */}
        <div className="fadein" style={{ textAlign: "center", marginBottom: 52 }}>
          <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "3px", textTransform: "uppercase", color: CONFIG.accent, fontFamily: mono, marginBottom: 10 }}>
            {CONFIG.tagline}
          </div>
          <h1 className="hero-h1" style={{ fontSize: 42, fontWeight: 800, color: B.navy, letterSpacing: "-0.5px", lineHeight: 1.1, marginBottom: 16, maxWidth: 680, margin: "0 auto 16px" }}>
            {CONFIG.name}
          </h1>
          <p style={{ fontSize: 17, color: B.textMuted, lineHeight: 1.75, maxWidth: 540, margin: "0 auto", fontFamily: serif, fontStyle: "italic" }}>
            {CONFIG.description}
          </p>
        </div>

        {/* Two-column grid */}
        <div className="grid" style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 32, alignItems: "start" }}>

          {/* ── LEFT ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>

            {/* What's included */}
            <GlassCard style={{ padding: 32 }}>
              <Label>What's included</Label>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px 28px" }}>
                {CONFIG.features.map(f => (
                  <div key={f.label} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                    <div style={{ width:18,height:18,borderRadius:"50%",background:`${CONFIG.accent}18`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:1 }}>
                      <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
                        <path d="M1.5 4.5l2 2 4-4" stroke={CONFIG.accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: B.navy, fontFamily: sans, lineHeight: 1.4 }}>{f.label}</div>
                      {f.detail && <div style={{ fontSize: 11, color: B.textMuted, fontFamily: mono, marginTop: 2, lineHeight: 1.5 }}>{f.detail}</div>}
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>

            {/* Tier selector — only shown if >1 tier */}
            {CONFIG.tiers.length > 1 && (
              <GlassCard style={{ padding: 28 }}>
                <Label>{CONFIG.mode === "payment" ? "Choose your access level" : "Choose your plan"}</Label>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {CONFIG.tiers.map(t => (
                    <TierCard key={t.id} tier={t} selected={selectedTier} onSelect={setSelectedTier}/>
                  ))}
                </div>
              </GlassCard>
            )}

            {/* Testimonials */}
            {CONFIG.testimonials?.length > 0 && (
              <div>
                <Label>What people are saying</Label>
                <div style={{ display: "grid", gridTemplateColumns: CONFIG.testimonials.length > 1 ? "1fr 1fr" : "1fr", gap: 14 }}>
                  {CONFIG.testimonials.map((t, i) => (
                    <GlassCard key={i} style={{ padding: "22px 24px" }}>
                      <div style={{ fontSize: 28, color: B.lightBlue, lineHeight: 1, fontFamily: serif, marginBottom: 10 }}>"</div>
                      <p style={{ fontSize: 14, color: B.textMuted, fontFamily: serif, lineHeight: 1.8, fontStyle: "italic", marginBottom: 16 }}>{t.quote}</p>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{ width:36,height:36,borderRadius:"50%",background:B.skyBlue,fontSize:18,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}>{t.avatar}</div>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 700, color: B.navy, fontFamily: sans }}>{t.name}</div>
                          <div style={{ fontSize: 11, color: B.textLight, fontFamily: mono }}>{t.role}</div>
                        </div>
                      </div>
                    </GlassCard>
                  ))}
                </div>
              </div>
            )}

            {/* FAQ */}
            {CONFIG.faqs?.length > 0 && (
              <GlassCard style={{ padding: 28 }}>
                <Label>Common questions</Label>
                {CONFIG.faqs.map((faq, i) => (
                  <FAQ key={i} q={faq.q} a={faq.a} last={i === CONFIG.faqs.length - 1}/>
                ))}
              </GlassCard>
            )}
          </div>

          {/* ── RIGHT — sticky ── */}
          <div style={{ position: "sticky", top: 80, display: "flex", flexDirection: "column", gap: 16 }}>
            {error && (
              <div style={{ background:"#FEE2E2",border:"1px solid rgba(192,57,43,0.25)",borderRadius:10,padding:"12px 16px" }}>
                <div style={{ fontSize:12,color:"#C0392B",fontFamily:mono }}>{error}</div>
              </div>
            )}

            <OrderSummary selectedTier={selectedTier} onCheckout={handleCheckout} loading={loading}/>

            {/* Stats */}
            {CONFIG.stats?.length > 0 && (
              <GlassCard style={{ padding: "18px 24px" }}>
                <div style={{ display: "grid", gridTemplateColumns: `repeat(${CONFIG.stats.length}, 1fr)`, gap: 0 }}>
                  {CONFIG.stats.map((s, i) => (
                    <div key={i} style={{ textAlign:"center",padding:"4px 0",borderRight:i<CONFIG.stats.length-1?`1px solid ${B.glassBorder}`:"none" }}>
                      <div style={{ fontSize:20,fontWeight:800,color:CONFIG.accent,fontFamily:sans,letterSpacing:"-0.5px" }}>{s.value}</div>
                      <div style={{ fontSize:9,color:B.textLight,fontFamily:mono,marginTop:3,letterSpacing:"0.5px" }}>{s.label}</div>
                    </div>
                  ))}
                </div>
              </GlassCard>
            )}

            {/* Trust block */}
            <GlassCard style={{ padding: "20px 22px" }}>
              {[
                ["🔒","No hidden fees","Price is price. No setup fees, no surprises."],
                ["🔄","Change anytime","Upgrade, downgrade, or cancel from your account."],
                ["🌍","Built in Bali","For creators who operate globally, live intentionally."],
              ].map(([icon,title,desc]) => (
                <div key={title} style={{ display:"flex",gap:10,marginBottom:14,lastChild:{marginBottom:0} }}>
                  <span style={{ fontSize:16,flexShrink:0 }}>{icon}</span>
                  <div>
                    <div style={{ fontSize:12,fontWeight:700,color:B.navy,fontFamily:sans,marginBottom:2 }}>{title}</div>
                    <div style={{ fontSize:11,color:B.textMuted,fontFamily:mono,lineHeight:1.5 }}>{desc}</div>
                  </div>
                </div>
              ))}
            </GlassCard>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ textAlign:"center",padding:"20px 24px",fontSize:10,color:B.textLight,fontFamily:mono,letterSpacing:"1.5px",borderTop:`1px solid ${B.glassBorder}`,background:B.white,position:"relative",zIndex:1 }}>
        PRËMO INC. · CANGGU, BALI · {new Date().getFullYear()} &nbsp;·&nbsp; Payments secured by Stripe
      </div>
    </div>
  );
}
