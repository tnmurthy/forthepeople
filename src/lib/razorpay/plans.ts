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
 * MANUAL ACTION FOR JAYANTH
 * ─────────────────────────
 * 1. Log into Razorpay dashboard → Plans → Create Plan
 * 2. Monthly billing, amount ₹999 (= 99900 paise), INR
 * 3. Copy the `plan_XXXXXXXXXXXXXX` ID
 * 4. Replace the literal "REPLACE_WITH_NEW_999_PLAN_ID" below
 *
 * Until step 4 is done, the app continues to work because subscriptions go
 * through the dynamic-plan path in create-subscription/route.ts.
 */

export const RAZORPAY_PLANS = {
  royal_india_monthly: {
    planId: process.env.RAZORPAY_PLAN_ROYAL ?? "",
    amount: 999900, // ₹9,999 in paise
    interval: "monthly" as const,
    label: "Royal Sponsor (India)",
  },
  state_champion_monthly: {
    planId: "REPLACE_WITH_NEW_999_PLAN_ID", // ⚠ Jayanth creates in dashboard
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
