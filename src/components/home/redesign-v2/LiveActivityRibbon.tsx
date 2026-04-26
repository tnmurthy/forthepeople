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

function StatTile({ target, label }: { target: number; label: string }) {
  const { value, ref } = useCountUp<HTMLDivElement>(target);
  return (
    <div className="ftp-stat-tile">
      <div className="ftp-stat-num" ref={ref}>
        {value.toLocaleString("en-IN")}
      </div>
      <div className="ftp-stat-label">{label}</div>
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
        .ftp-stats-bar {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 0;
          background: #FFFFFF;
          border-top: 0.5px solid #E5E7EB;
          border-bottom: 0.5px solid #E5E7EB;
        }
        .ftp-stat-tile {
          padding: 18px 24px;
          text-align: center;
          border-right: 0.5px solid #E5E7EB;
          display: flex;
          flex-direction: column;
          gap: 6px;
          transition: background 150ms ease;
        }
        .ftp-stat-tile:last-child { border-right: none; }
        .ftp-stat-tile:hover { background: #FAFAF8; }
        .ftp-stat-num {
          font-size: 24px;
          font-weight: 600;
          line-height: 1;
          color: #1A1A1A;
          font-variant-numeric: tabular-nums;
          letter-spacing: -0.02em;
        }
        .ftp-stat-num-updated {
          font-size: 14px;
          font-weight: 500;
          color: #16A34A;
          line-height: 1.2;
        }
        .ftp-stat-label {
          font-size: 11px;
          color: #6B7280;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          font-weight: 600;
        }
        @media (max-width: 767px) {
          .ftp-stats-bar { grid-template-columns: repeat(2, 1fr); }
          .ftp-stat-tile {
            padding: 14px 16px;
            border-bottom: 0.5px solid #E5E7EB;
          }
          .ftp-stat-tile:nth-child(odd) { border-right: 0.5px solid #E5E7EB; }
          .ftp-stat-tile:nth-child(even) { border-right: none; }
          .ftp-stat-num { font-size: 20px; }
          /* Last (5th) tile spans full width on mobile */
          .ftp-stat-tile:last-child {
            grid-column: 1 / -1;
            border-right: none;
            border-bottom: none;
          }
        }
      `}</style>

      <StatTile target={activeDistricts} label="Districts live" />
      <StatTile target={dashboardsPerDistrict} label="Dashboards per district" />
      <StatTile target={totalDataPoints} label="Data points tracked" />
      <StatTile target={comingDistricts} label="Districts coming" />

      {/* Last-updated tile uses the same visual rhythm but renders text, not a number. */}
      <div className="ftp-stat-tile">
        <div className="ftp-stat-num-updated">{updatedDisplay}</div>
        <div className="ftp-stat-label">Last updated</div>
      </div>
    </div>
  );
}
