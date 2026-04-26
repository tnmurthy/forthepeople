/**
 * Razorpay plan registry — ₹999 State Champion migration.
 *
 * ARCHITECTURE NOTE
 * ─────────────────
 * Subscriptions are created DYNAMICALLY in `src/app/api/payment/create-subscription/route.ts`
 * — each subscriber gets a one-off plan at their chosen amount. So the static
 * plan IDs below are NOT used by new subscribers. They exist only to:
 *
 *   1. Document which legacy plan IDs are grandfathered (pre-2026-04-24 ₹1,999
 *      State Champion subscribers must continue on `state_champion_monthly_legacy`
 *      — NEVER migrate them to the new ₹999 plan).
 *   2. Provide a target `planId` string for Jayanth to paste after manually
 *      creating a ₹999 monthly plan in the Razorpay dashboard (if we ever
 *      switch from dynamic to static plan-based subscriptions).
 *
 * LEGACY PLAN IDS
 * ───────────────
 * Historical `RAZORPAY_PLAN_STATE` env var points at the old ₹1,999 plan.
 * Do NOT read it here — existing subscribers on that plan keep charging at
 * ₹1,999/mo until they cancel and resubscribe.
 *
 * STATE CHAMPION ₹999 PLAN
 * ────────────────────────
 * Created via Razorpay API in Session 10.5 (2026-04-26):
 *   POST /v1/plans → plan_Si4gHceNb9Mz4w (₹999 monthly, INR, live mode).
 * Hardcoded as a fallback so prod works immediately; env override
 * (RAZORPAY_PLAN_STATE_CHAMPION) allows future plan rotation without a
 * code change.
 *
 * Until/unless Jayanth pastes RAZORPAY_PLAN_STATE_CHAMPION on Vercel, the
 * hardcoded plan_Si4gHceNb9Mz4w is what gets used on prod. Either path
 * keeps the dynamic-plan flow in create-subscription/route.ts unaffected.
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
    planId: process.env.RAZORPAY_PLAN_STATE ?? "", // old ₹1,999 plan — grandfathered
    amount: 199900, // ₹1,999 in paise
    interval: "monthly" as const,
    label: "State Champion (₹1,999/mo — legacy)",
    legacy: true as const,
  },
  district_champion_monthly: {
    planId: process.env.RAZORPAY_PLAN_DISTRICT ?? "",
    amount: 9900, // ₹99 in paise
    interval: "monthly" as const,
    label: "District Champion",
  },
} as const;

export type RazorpayPlanKey = keyof typeof RAZORPAY_PLANS;
