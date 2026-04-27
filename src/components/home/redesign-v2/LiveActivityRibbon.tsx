/**
 * ForThePeople.in — Your District. Your Data. Your Right.
 * © 2026 Jayanth M B. MIT License with Attribution.
 * https://github.com/jayanthmb14/forthepeople
 *
 * Session 13 v8 Phase E (Fix #4) — StatsBar dashboard-style redesign
 * (filename retained as LiveActivityRibbon.tsx for import-path stability;
 * the export is still `StatsBar`).
 *
 * 5-tile dashboard grid with vertical dividers, hover states, count-up:
 *   [Districts live] | [Dashboards/district] | [Data points] | [Coming] | [Last updated]
 *
 * Bigger numbers, real visual presence — not a thin one-line strip.
 * Drops the LIVE pill prefix entirely (last-updated tile carries that signal).
 *
 * Stats are passed in as props (server-fetched in [locale]/page.tsx)
 * to avoid a client roundtrip on first paint.
 */

"use client";

import { useCountUp } from "@/lib/hooks/useCountUp";
import { timeAgoLabel } from "@/lib/utils/timeAgo";

export interface StatsBarProps {
  /** All optional — sensible defaults render if page.tsx hasn't wired props yet. */
  activeDistricts?: number;
  dashboardsPerDistrict?: number;
  totalDataPoints?: number;
  comingDistricts?: number;
  mostRecentAt?: string | null;
}

function StatTile({
  target,
  label,
  refresh,
}: {
  target: number;
  label: string;
  refresh: string;
}) {
  const { value, ref } = useCountUp<HTMLDivElement>(target);
  return (
    <div className="ftp-stat-tile">
      <div className="ftp-stat-num" ref={ref}>
        {value.toLocaleString("en-IN")}
      </div>
      <div className="ftp-stat-label">{label}</div>
      <div className="ftp-stat-refresh">{refresh}</div>
    </div>
  );
}

export default function StatsBar({
  activeDistricts = 10,
  dashboardsPerDistrict = 32,
  totalDataPoints = 0,
  comingDistricts = 770,
  mostRecentAt,
}: StatsBarProps) {
  const updated = timeAgoLabel(mostRecentAt ?? null);
  const updatedDisplay = updated.isLive ? "Live" : updated.label;

  return (
    <div className="ftp-stats-bar" role="status" aria-live="polite">
      <style>{`
        /* Session 16 v10 Phase D (Fix #3): outlined tile cards with gaps (replaces solid grid) */
        .ftp-stats-bar {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 12px;
          background: transparent;
          border: none;
          padding: 0 24px;
          max-width: 1200px;
          margin: 0 auto 24px;
        }
        .ftp-stat-tile {
          padding: 22px 24px;
          text-align: center;
          background: #FFFFFF;
          border: 1px solid #E5E7EB;
          border-radius: 8px;
          display: flex;
          flex-direction: column;
          gap: 6px;
          transition: border-color 150ms ease, transform 150ms ease, box-shadow 200ms ease;
        }
        .ftp-stat-tile:hover {
          border-color: #2563EB;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(37, 99, 235, 0.08);
        }
        .ftp-stat-num {
          font-size: 28px;
          font-weight: 700;
          line-height: 1;
          color: #2563EB;
          font-variant-numeric: tabular-nums;
          letter-spacing: -0.02em;
        }
        .ftp-stat-num-updated {
          font-size: 14px;
          font-weight: 600;
          color: #2563EB;
          line-height: 1.2;
        }
        .ftp-stat-label {
          font-size: 11px;
          color: #4B5563;
          text-transform: uppercase;
          letter-spacing: 0.6px;
          font-weight: 500;
        }
        /* Session 17 v11 Phase E (Fix #5): per-metric refresh frequency caption */
        .ftp-stat-refresh {
          font-size: 9px;
          color: #9B9B9B;
          text-transform: uppercase;
          letter-spacing: 0.4px;
          margin-top: 2px;
          font-style: italic;
        }
        @media (max-width: 767px) {
          .ftp-stats-bar {
            grid-template-columns: repeat(2, 1fr);
            gap: 8px;
            padding: 0 16px;
            margin-bottom: 16px;
          }
          .ftp-stat-tile { padding: 14px 16px; }
          .ftp-stat-num { font-size: 22px; }
          .ftp-stat-tile:last-child { grid-column: 1 / -1; }
        }
        @media (prefers-reduced-motion: reduce) {
          .ftp-stat-tile { transition: none; }
          .ftp-stat-tile:hover { transform: none; }
        }
      `}</style>

      <StatTile
        target={activeDistricts}
        label="Districts live"
        refresh="as launched"
      />
      <StatTile
        target={dashboardsPerDistrict}
        label="Dashboards / district"
        refresh="static"
      />
      <StatTile
        target={totalDataPoints}
        label="Data points tracked"
        refresh="every 5–30 min"
      />
      <StatTile
        target={comingDistricts}
        label="Districts coming"
        refresh="as launched"
      />

      {/* Last-updated tile uses the same visual rhythm but renders text, not a number. */}
      <div className="ftp-stat-tile">
        <div className="ftp-stat-num-updated">{updatedDisplay}</div>
        <div className="ftp-stat-label">Last refresh</div>
        <div className="ftp-stat-refresh">every cron cycle</div>
      </div>
    </div>
  );
}
