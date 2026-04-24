/**
 * Module / surface launch dates. The NEW pill auto-expires after 30 days.
 * Append a row here when a new module goes live for the first time — no
 * manual unrenaming needed.
 *
 * Format: ISO date (YYYY-MM-DD) in India time (launch day).
 */

export const MODULE_LAUNCHES: Record<string, string> = {
  "suggestions":   "2026-04-24", // Session 0 — community idea submissions
  "responsibility":"2026-04-25", // Session 2 — per-district civic actions
  "india-detail":  "2026-04-25", // Session 3 — aggregate India page
};

const NEW_WINDOW_DAYS = 30;
const MS_PER_DAY = 24 * 60 * 60 * 1000;
// Same rationale as District.goLiveDate check: UTC midnight of the launch
// day lands as 05:30 IST on the same calendar day, so Date.now() running
// earlier in the UTC day can appear "before" the launch. 24h grace.
const FUTURE_GRACE_MS = MS_PER_DAY;

export function isModuleNew(slug: string): boolean {
  const launchDate = MODULE_LAUNCHES[slug];
  if (!launchDate) return false;
  const ms = Date.now() - new Date(`${launchDate}T00:00:00Z`).getTime();
  return ms >= -FUTURE_GRACE_MS && ms < NEW_WINDOW_DAYS * MS_PER_DAY;
}

export function daysUntilNotNew(slug: string): number | null {
  if (!isModuleNew(slug)) return null;
  const launchDate = MODULE_LAUNCHES[slug];
  const ms = Date.now() - new Date(`${launchDate}T00:00:00Z`).getTime();
  const remaining = NEW_WINDOW_DAYS - ms / MS_PER_DAY;
  return Math.max(0, Math.ceil(remaining));
}
