/**
 * ForThePeople.in — Your District. Your Data. Your Right.
 * © 2026 Jayanth M B. MIT License with Attribution.
 * https://github.com/jayanthmb14/forthepeople
 *
 * Session 11 redesign — slim 40px-tall financial marquee.
 *
 * Drop-in replacement for the legacy MarketTickerClient on the homepage.
 * Pulls from /api/data/market-ticker (existing endpoint, no schema/API
 * changes). Renders ONCE — fixes the legacy bug where the same ticker
 * mounted twice on the homepage.
 *
 * Animation: 60s linear marquee, items duplicated for seamless loop.
 * Hover pauses. prefers-reduced-motion → static row with horizontal scroll.
 */

"use client";

import { useEffect, useState } from "react";

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

  useEffect(() => {
    let cancelled = false;
    async function fetchTicker() {
      try {
        const res = await fetch("/api/data/market-ticker");
        if (!res.ok) return;
        const data = (await res.json()) as TickerResponse;
        if (cancelled) return;
        // Be tolerant of either shape: { items: [...] } or { tickers: [...] } or array
        const list =
          data.items ??
          data.tickers ??
          (Array.isArray(data) ? (data as unknown as TickerItem[]) : []);
        setItems(list.filter(Boolean));
      } catch {
        /* ignore — keep empty */
      } finally {
        if (!cancelled) {
          setLoaded(true);
        }
      }
    }
    fetchTicker();
    return () => {
      cancelled = true;
    };
  }, []);

  // Don't reserve vertical space until we know we have items (avoids
  // empty 40px gap on routes where market-ticker is unavailable).
  if (loaded && items.length === 0) return null;

  // Duplicate for seamless loop. Render only once on mount.
  const loop = items.length > 0 ? [...items, ...items] : [];

  return (
    <div
      className="ftp-financial-ticker"
      role="region"
      aria-label="Live financial ticker"
      style={{
        background: "#FFFFFF",
        borderTop: "1px solid #E8E8E4",
        borderBottom: "1px solid #E8E8E4",
        height: 40,
        overflow: "hidden",
        position: "relative",
        display: "flex",
        alignItems: "center",
      }}
    >
      <style>{`
        .ftp-financial-track {
          display: inline-flex;
          gap: 28px;
          padding: 0 16px;
          align-items: center;
          font-size: 12px;
          color: #6B6B6B;
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
        @media (prefers-reduced-motion: reduce) {
          .ftp-financial-ticker { overflow-x: auto; -webkit-overflow-scrolling: touch; }
          .ftp-financial-ticker::-webkit-scrollbar { display: none; }
          .ftp-financial-track { animation: none; }
        }
        .ftp-financial-item { display: inline-flex; align-items: center; gap: 6px; }
        .ftp-financial-item strong { font-weight: 600; color: #1A1A1A; }
        .ftp-financial-item .v { font-family: var(--font-mono, ui-monospace, monospace); font-variant-numeric: tabular-nums; }
        .ftp-financial-item .up   { color: #16A34A; }
        .ftp-financial-item .down { color: #DC2626; }
        .ftp-financial-item .flat { color: #9B9B9B; }
      `}</style>

      {loop.length === 0 ? (
        <span style={{ padding: "0 16px", fontSize: 12, color: "#9B9B9B" }}>
          Loading market data…
        </span>
      ) : (
        <div className="ftp-financial-track" aria-hidden={false}>
          {loop.map((it, i) => (
            <span key={`${it.symbol}-${i}`} className="ftp-financial-item">
              <strong>{it.label}</strong>
              <span className="v">{it.value}</span>
              <span className={`v ${it.direction}`}>
                {it.direction === "up" ? "▲" : it.direction === "down" ? "▼" : "•"} {it.change}
                {it.changePct !== 0 ? ` (${it.changePct.toFixed(2)}%)` : ""}
              </span>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
