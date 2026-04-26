/**
 * ForThePeople.in — Your District. Your Data. Your Right.
 * © 2026 Jayanth M B. MIT License with Attribution.
 * https://github.com/jayanthmb14/forthepeople
 *
 * timeAgoLabel — uniform "Xm ago / Xh ago / just now / Live" formatter.
 *
 * "Live" semantics:
 *   - Returned when timestamp is null, invalid, or older than `staleThresholdMinutes`
 *     (default 120 = 2h).
 *   - Rationale: showing "12h ago" or "5d ago" on a homepage pill makes
 *     visitors think the platform is dead. A pulsing "Live" pill with
 *     the friendly understanding that the upstream cron may be lagging
 *     is more honest about the user-facing experience.
 *   - Local-dev databases that don't get cron updates → always "Live".
 *   - Production with healthy crons → real "Xm ago" / "Xh ago" labels.
 */

export interface TimeAgoResult {
  /** Display text. Either "Live", "just now", "Xm ago", or "Xh ago". */
  label: string;
  /** True when the timestamp is older than the stale threshold (or missing). */
  isStale: boolean;
  /** True when the label is "Live" (i.e. stale fallback fired). */
  isLive: boolean;
}

export interface TimeAgoOptions {
  /** Minutes after which the result becomes "Live". Default 120 (2h). */
  staleThresholdMinutes?: number;
  /** Pass a fixed "now" (ms epoch) for testability. Default Date.now(). */
  nowMs?: number;
}

const LIVE: TimeAgoResult = { label: "Live", isStale: true, isLive: true };

export function timeAgoLabel(
  date: string | Date | null | undefined,
  opts?: TimeAgoOptions,
): TimeAgoResult {
  const stale = opts?.staleThresholdMinutes ?? 120;
  if (!date) return LIVE;

  const ts = typeof date === "string" ? new Date(date) : date;
  if (Number.isNaN(ts.getTime())) return LIVE;

  const now = opts?.nowMs ?? Date.now();
  const minutesAgo = (now - ts.getTime()) / 60000;

  if (minutesAgo < 0) {
    // Future timestamps shouldn't happen but treat as fresh.
    return { label: "just now", isStale: false, isLive: false };
  }
  if (minutesAgo < 1) {
    return { label: "just now", isStale: false, isLive: false };
  }
  if (minutesAgo < 60) {
    return {
      label: `${Math.round(minutesAgo)}m ago`,
      isStale: false,
      isLive: false,
    };
  }
  if (minutesAgo < stale) {
    return {
      label: `${Math.round(minutesAgo / 60)}h ago`,
      isStale: false,
      isLive: false,
    };
  }
  return LIVE;
}
