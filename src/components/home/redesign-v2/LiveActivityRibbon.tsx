/**
 * ForThePeople.in — Your District. Your Data. Your Right.
 * © 2026 Jayanth M B. MIT License with Attribution.
 * https://github.com/jayanthmb14/forthepeople
 *
 * Session 11 redesign — slim 40px LIVE activity marquee.
 *
 * Data shape: derived from /api/data/homepage-stats (mostRecentAt + a
 * count of total data points) + /api/data/homepage-preview (active
 * districts).
 *
 * Animation: 90s loop (slower than financial ticker). Hover pauses.
 * prefers-reduced-motion → static row, no marquee.
 */

"use client";

import { useEffect, useState } from "react";
import { timeAgoLabel } from "@/lib/utils/timeAgo";

type DistrictPreview = {
  slug: string;
  name: string;
  state?: { slug?: string; name?: string };
};

type HomepagePreview = {
  districtPreviews?: DistrictPreview[];
};

type HomepageStats = {
  mostRecentAt?: string | null;
  totalDataPoints?: number | null;
};

type Activity = {
  district: string;
  ago: string;
};

export default function LiveActivityRibbon() {
  const [items, setItems] = useState<Activity[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function fetchData() {
      try {
        const [statsRes, previewRes] = await Promise.all([
          fetch("/api/data/homepage-stats"),
          fetch("/api/data/homepage-preview"),
        ]);

        const stats: HomepageStats = statsRes.ok ? await statsRes.json() : {};
        const preview: HomepagePreview = previewRes.ok ? await previewRes.json() : {};

        if (cancelled) return;

        // Single shared "ago" for all districts — we don't have per-district
        // mostRecentAt today, so we proxy from the global stat. Friendly
        // "Live" fallback when stale (>2h) instead of misleading "12h ago".
        const ago = timeAgoLabel(stats.mostRecentAt).label;

        const districts = preview.districtPreviews ?? [];
        const acts: Activity[] = districts.map((d) => ({
          district: d.name,
          ago,
        }));

        setItems(acts);
      } catch {
        /* ignore */
      } finally {
        if (!cancelled) {
          setLoaded(true);
        }
      }
    }
    fetchData();
    return () => {
      cancelled = true;
    };
  }, []);

  // Render fallback static line if no data — preserves vertical rhythm.
  const loop = items.length > 0 ? [...items, ...items] : [];

  return (
    <div
      className="ftp-activity-ribbon"
      role="region"
      aria-label="Live district activity"
      style={{
        background: "#FAFAF8",
        borderBottom: "1px solid #E8E8E4",
        height: 40,
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        gap: 12,
        paddingLeft: 16,
      }}
    >
      <style>{`
        .ftp-activity-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 3px 10px;
          background: #DCFCE7;
          color: #166534;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          border-radius: 999px;
          flex-shrink: 0;
        }
        .ftp-activity-dot {
          display: inline-block;
          width: 7px; height: 7px; border-radius: 50%;
          background: #16A34A;
          animation: ftp-activity-pulse 2s ease-in-out infinite;
        }
        @keyframes ftp-activity-pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%      { opacity: 0.35; transform: scale(0.8); }
        }
        .ftp-activity-track {
          display: inline-flex;
          gap: 24px;
          align-items: center;
          font-size: 12px;
          color: #6B6B6B;
          white-space: nowrap;
          flex: 1;
          will-change: transform;
          animation: ftp-activity-marquee 90s linear infinite;
        }
        .ftp-activity-ribbon:hover .ftp-activity-track {
          animation-play-state: paused;
        }
        @keyframes ftp-activity-marquee {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @media (prefers-reduced-motion: reduce) {
          .ftp-activity-dot { animation: none; }
          .ftp-activity-track { animation: none; }
          .ftp-activity-ribbon { overflow-x: auto; -webkit-overflow-scrolling: touch; }
          .ftp-activity-ribbon::-webkit-scrollbar { display: none; }
        }
        .ftp-activity-item strong { color: #1A1A1A; font-weight: 600; }
        .ftp-activity-item .ago { font-family: var(--font-mono, ui-monospace, monospace); font-size: 11px; color: #9B9B9B; }
      `}</style>

      <span className="ftp-activity-pill" aria-hidden={false}>
        <span className="ftp-activity-dot" aria-hidden="true" />
        Live
      </span>

      {!loaded ? (
        <span style={{ fontSize: 12, color: "#9B9B9B" }}>Loading activity…</span>
      ) : loop.length === 0 ? (
        <span style={{ fontSize: 12, color: "#6B6B6B" }}>
          Updated continuously across active districts
        </span>
      ) : (
        <div className="ftp-activity-track">
          {loop.map((a, i) => (
            <span key={`${a.district}-${i}`} className="ftp-activity-item">
              <strong>{a.district}</strong> <span className="ago">· {a.ago}</span>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
