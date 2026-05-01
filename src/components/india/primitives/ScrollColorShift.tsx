"use client";

/**
 * ScrollColorShift — temporarily disabled.
 *
 * The body-tint scroll journey was reverted at the start of the v4
 * super-category redesign sweep so each band can be designed against
 * a static neutral page background. Will be revisited once all 10
 * super-category bands are finalised.
 *
 * Component renders nothing and registers no listeners. Kept as a
 * named export so callers don't need to be torn down in the same
 * commit; the page already imports it. Restoring the behaviour later
 * is a 1-file change.
 */

export function ScrollColorShift() {
  return null;
}

export default ScrollColorShift;
