/**
 * ForThePeople.in — Your District. Your Data. Your Right.
 * © 2026 Jayanth M B. MIT License with Attribution.
 * https://github.com/jayanthmb14/forthepeople
 *
 * Session 12 v7 — slim 36px financial marquee with structured row:
 *   [LIVE pill]  ←—— scrolling tickers ——→  [Updated Xm ago]
 *
 * The marquee track lives inside a flex-1 viewport so the LIVE pill +
 * Updated label stay anchored at the edges instead of getting pushed
 * off-screen by long ticker content.
 *
 * Pulls from /api/data/market-ticker (existing endpoint, no schema/API
 * changes). Renders ONCE — fixes the legacy double-mount bug.
 *
 * Animation: 60s linear marquee, items duplicated for seamless loop.
 * Hover pauses. prefers-reduced-motion → static row, horizontal scroll.
 */

"use client";

import { useEffect, useState } from "react";
import { timeAgoLabel } from "@/lib/utils/timeAgo";

type TickerItem = {
  symbol: string;
  label: string;
  value: string;
  change: string;
  changePct: number;
  direction: "up" | "down" | "flat";
  unit: string;
};

type TickerResponse = { items?: TickerItem[]; tickers?: TickerItem[] };

export default function FinancialTicker() {
  const [items, setItems] = useState<TickerItem[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [mostRecentAt, setMostRecentAt] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function fetchTicker() {
      try {
        const res = await fetch("/api/data/market-ticker");
        if (!res.ok) return;
        const data = (await res.json()) as TickerResponse;
        if (cancelled) return;
        const list =
          data.items ??
          data.tickers ??
          (Array.isArray(data) ? (data as unknown as TickerItem[]) : []);
        setItems(list.filter(Boolean));
      } catch {
        /* ignore */
      } finally {
        if (!cancelled) setLoaded(true);
      }
    }
    async function fetchUpdated() {
      try {
        const res = await fetch("/api/data/homepage-stats");
        if (!res.ok) return;
        const data = (await res.json()) as { mostRecentAt?: string | null };
        if (!cancelled) setMostRecentAt(data.mostRecentAt ?? null);
      } catch {
        /* ignore */
      }
    }
    fetchTicker();
    fetchUpdated();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loaded && items.length === 0) return null;

  const loop = items.length > 0 ? [...items, ...items] : [];
  const updated = timeAgoLabel(mostRecentAt);

  return (
    <div
      className="ftp-financial-ticker"
      role="region"
      aria-label="Live financial ticker"
    >
      <style>{`
        .ftp-financial-ticker {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 8px 24px;
          background: #FFFFFF;
          border-bottom: 0.5px solid #E5E7EB;
          font-size: 12px;
          height: 36px;
        }
        .ftp-ticker-live-pill {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          background: #DC2626;
          color: #FFFFFF;
          padding: 2px 8px;
          border-radius: 3px;
          font-size: 9px;
          font-weight: 600;
          letter-spacing: 0.5px;
          flex-shrink: 0;
        }
        .ftp-ticker-live-pill .ftp-pulse-dot-white {
          width: 5px; height: 5px;
          background: #FFFFFF;
          border-radius: 50%;
          animation: ftp-ticker-pulse 2s ease-in-out infinite;
        }
        @keyframes ftp-ticker-pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%      { opacity: 0.5; transform: scale(0.8); }
        }
        .ftp-financial-viewport {
          flex: 1;
          overflow: hidden;
          min-width: 0;
          position: relative;
        }
        .ftp-financial-track {
          display: inline-flex;
          gap: 28px;
          align-items: center;
          font-size: 12px;
          color: #6B7280;
          white-space: nowrap;
          will-change: transform;
          animation: ftp-financial-marquee 60s linear infinite;
        }
        .ftp-financial-ticker:hover .ftp-financial-track {
          animation-play-state: paused;
        }
        @keyframes ftp-financial-marquee {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .ftp-ticker-updated {
          font-size: 10px;
          color: #9B9B9B;
          flex-shrink: 0;
          white-space: nowrap;
        }
        .ftp-financial-item { display: inline-flex; align-items: center; gap: 6px; }
        .ftp-financial-item strong { font-weight: 600; color: #1A1A1A; }
        .ftp-financial-item .v {
          font-family: var(--font-mono, ui-monospace, monospace);
          font-variant-numeric: tabular-nums;
        }
        .ftp-financial-item .up   { color: #16A34A; }
        .ftp-financial-item .down { color: #DC2626; }
        .ftp-financial-item .flat { color: #9B9B9B; }
        @media (prefers-reduced-motion: reduce) {
          .ftp-financial-track { animation: none; }
          .ftp-pulse-dot-white { animation: none; }
          .ftp-financial-viewport { overflow-x: auto; -webkit-overflow-scrolling: touch; }
          .ftp-financial-viewport::-webkit-scrollbar { display: none; }
        }
        @media (max-width: 767px) {
          .ftp-ticker-updated { display: none; }
          .ftp-financial-ticker { padding: 8px 12px; font-size: 11px; }
        }
      `}</style>

      <span className="ftp-ticker-live-pill" aria-label="Live financial data">
        <span className="ftp-pulse-dot-white" aria-hidden="true" />
        LIVE
      </span>

      <div className="ftp-financial-viewport">
        {loop.length === 0 ? (
          <span style={{ fontSize: 12, color: "#9B9B9B" }}>Loading market data…</span>
        ) : (
          <div className="ftp-financial-track">
            {loop.map((it, i) => (
              <span key={`${it.symbol}-${i}`} className="ftp-financial-item">
                <strong>{it.label}</strong>
                <span className="v">{it.value}</span>
                <span className={`v ${it.direction}`}>
                  {it.direction === "up" ? "▲" : it.direction === "down" ? "▼" : "•"}{" "}
                  {it.change}
                  {it.changePct !== 0 ? ` (${it.changePct.toFixed(2)}%)` : ""}
                </span>
              </span>
            ))}
          </div>
        )}
      </div>

      <span className="ftp-ticker-updated">
        {updated.isLive ? "Updated continuously" : `Updated ${updated.label}`}
      </span>
    </div>
  );
}
