/**
 * ForThePeople.in — Your District. Your Data. Your Right.
 * © 2026 Jayanth M B. MIT License with Attribution.
 * https://github.com/jayanthmb14/forthepeople
 *
 * Session 12 v7 — StatsBar (filename retained as LiveActivityRibbon.tsx
 * for import-path stability; the export is now `StatsBar`).
 *
 * Single horizontal line:
 *   [🟢 LIVE pill] · [N districts live] · [N dashboards/district]
 *   · [N data points] · [N coming] · [Updated Xm ago]
 *
 * Each numeric stat animates 0 → final via useCountUp on first
 * scroll-into-view (cubic ease-out, ~1.2s). Respects prefers-reduced-motion.
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
  const { value, ref } = useCountUp<HTMLSpanElement>(target);
  return (
    <span className="ftp-stat-item" ref={ref}>
      <strong>{value.toLocaleString("en-IN")}</strong> {label}
    </span>
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

  return (
    <div className="ftp-stats-bar" role="status" aria-live="polite">
      <style>{`
        .ftp-stats-bar {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 10px 24px;
          background: #F0FDF4;
          border-bottom: 0.5px solid #E5E7EB;
          font-size: 12px;
          color: #1A1A1A;
        }
        .ftp-stats-live-pill {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          background: #10B981;
          color: #FFFFFF;
          padding: 2px 8px;
          border-radius: 3px;
          font-size: 9px;
          font-weight: 600;
          letter-spacing: 0.5px;
          flex-shrink: 0;
        }
        .ftp-stats-live-pill .ftp-pulse-dot {
          width: 5px; height: 5px;
          background: #FFFFFF;
          border-radius: 50%;
          animation: ftp-stats-pulse 2s ease-in-out infinite;
        }
        @keyframes ftp-stats-pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%      { opacity: 0.5; transform: scale(0.8); }
        }
        .ftp-stat-item {
          font-variant-numeric: tabular-nums;
          white-space: nowrap;
          color: #4B5563;
        }
        .ftp-stat-item strong {
          font-weight: 600;
          color: #1A1A1A;
        }
        .ftp-stat-divider {
          width: 1px; height: 14px;
          background: #D1D5DB;
        }
        .ftp-stat-spacer { flex: 1; }
        .ftp-stat-updated {
          font-size: 11px;
          color: #9B9B9B;
          flex-shrink: 0;
          white-space: nowrap;
        }
        @media (prefers-reduced-motion: reduce) {
          .ftp-pulse-dot { animation: none; }
        }
        @media (max-width: 767px) {
          .ftp-stats-bar {
            flex-wrap: wrap;
            gap: 8px;
            padding: 10px 12px;
            font-size: 11px;
          }
          .ftp-stat-divider { display: none; }
          .ftp-stat-spacer { width: 100%; height: 0; }
          .ftp-stat-updated { width: 100%; text-align: right; }
        }
      `}</style>

      <span className="ftp-stats-live-pill">
        <span className="ftp-pulse-dot" aria-hidden="true" />
        LIVE
      </span>
      <span className="ftp-stat-divider" aria-hidden="true" />
      <StatTile target={activeDistricts} label="districts live" />
      <span className="ftp-stat-divider" aria-hidden="true" />
      <StatTile target={dashboardsPerDistrict} label="dashboards/district" />
      <span className="ftp-stat-divider" aria-hidden="true" />
      <StatTile target={totalDataPoints} label="data points" />
      <span className="ftp-stat-divider" aria-hidden="true" />
      <StatTile target={comingDistricts} label="coming" />
      <span className="ftp-stat-spacer" aria-hidden="true" />
      <span className="ftp-stat-updated">
        {updated.isLive ? "Live" : `Updated ${updated.label}`}
      </span>
    </div>
  );
}
