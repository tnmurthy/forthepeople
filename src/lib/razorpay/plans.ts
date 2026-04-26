/**
 * Razorpay plan registry.
 *
 * ARCHITECTURE NOTE
 * ─────────────────
 * Subscriptions are created DYNAMICALLY in `src/app/api/payment/create-subscription/route.ts`
 * — each subscriber gets a brand-new plan at their chosen amount. So the
 * static plan IDs below are vestigial: zero active paying subscribers use
 * them. They exist only as a fallback if we ever switch from the dynamic
 * flow back to a static-plan model.
 *
 * RECONCILIATION SNAPSHOT (Session 10.6, 2026-04-26)
 * ──────────────────────────────────────────────────
 * Read-only API audit confirmed each `RAZORPAY_PLAN_*` env var resolves to
 * a real Razorpay plan_id, but the Razorpay-side amounts on the FOUNDER /
 * PATRON / STATE / DISTRICT plans do NOT match today's BadgeExplainer.tsx
 * UI labels. Specifically:
 *
 *   ENV VAR                  → Razorpay name + amount         vs UI label
 *   RAZORPAY_PLAN_FOUNDER    → "Founding Builder" ₹50,000/mo  ✓ matches
 *   RAZORPAY_PLAN_PATRON     → "All-India Patron" ₹50,000/mo  ⚠ UI says ₹10,000
 *   RAZORPAY_PLAN_STATE      → "State Champion"  ₹10,000/mo   ⚠ UI says ₹999
 *   RAZORPAY_PLAN_DISTRICT   → "District Champion" ₹2,000/mo  ⚠ UI says ₹200
 *
 * No billing harm — both `created`-status subs on these plans (PATRON,
 * STATE) are test data from Apr 10 (names "dd"/"ff", never paid). All
 * real subscribers were placed on either:
 *   (a) older legacy static plans `plan_SbraA*` — Apr 11-13 cohort,
 *       paid the amount the UI showed at THAT time
 *   (b) per-subscriber dynamic plans `plan_S{xxxxx}` — Apr 14+ cohort
 *
 * The mismatched env-var plan_ids are stale; safe to leave as-is. A
 * future cleanup could (a) rotate the env vars to point at fresh plans
 * matching current UI prices, or (b) delete the env-var indirection
 * entirely now that dynamic-plan creation is the canonical path.
 *
 * STATE CHAMPION ₹999 PLAN (current public price)
 * ───────────────────────────────────────────────
 * Created via Razorpay API in Session 10.5 (2026-04-26):
 *   POST /v1/plans → plan_Si4gHceNb9Mz4w (₹999 monthly, INR, live mode).
 * Hardcoded as a fallback so prod works immediately; env override
 * (RAZORPAY_PLAN_STATE_CHAMPION) allows future plan rotation without a
 * code change.
 */

export const RAZORPAY_PLANS = {
  royal_india_monthly: {
    planId: process.env.RAZORPAY_PLAN_ROYAL ?? "",
    amount: 999900, // ₹9,999 in paise
    interval: "monthly" as const,
    label: "Royal Sponsor (India)",
  },
  state_champion_monthly: {
    // Created via Razorpay API in Session 10.5: plan_Si4gHceNb9Mz4w (live).
    planId: process.env.RAZORPAY_PLAN_STATE_CHAMPION ?? "plan_Si4gHceNb9Mz4w",
    amount: 99900, // ₹999 in paise
    interval: "monthly" as const,
    label: "State Champion (₹999/mo)",
  },
  state_champion_monthly_legacy: {
    // RAZORPAY_PLAN_STATE → plan_Sbq807rjS75Ajp ("State Champion") at
    // ₹10,000/mo on Razorpay (verified Session 10.6). Vestigial — 0
    // active paying subs. Kept for backward compat / future rotation.
    planId: process.env.RAZORPAY_PLAN_STATE ?? "",
    amount: 1000000, // ₹10,000 in paise
    interval: "monthly" as const,
    label: "State Champion (₹10,000/mo — vestigial)",
    legacy: true as const,
  },
  district_champion_monthly: {
    // RAZORPAY_PLAN_DISTRICT → plan_Sbq7zv3srFbP15 ("District Champion")
    // at ₹2,000/mo on Razorpay (verified Session 10.6). Vestigial — 0
    // active paying subs. Today's District tier (₹99-₹200/mo) goes
    // through the dynamic-plan flow in create-subscription/route.ts.
    planId: process.env.RAZORPAY_PLAN_DISTRICT ?? "",
    amount: 200000, // ₹2,000 in paise
    interval: "monthly" as const,
    label: "District Champion (₹2,000/mo — vestigial)",
  },
} as const;

export type RazorpayPlanKey = keyof typeof RAZORPAY_PLANS;
