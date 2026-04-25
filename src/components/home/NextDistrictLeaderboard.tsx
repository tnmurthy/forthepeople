/**
 * Top 3 most-requested NOT-yet-live districts.
 *
 * Data comes from the existing DistrictRequest table (populated by the
 * "Unlock Your District" flow). Active districts are filtered out
 * upstream — this component is dumb: it just renders what it's given.
 *
 * Each row + the bottom CTA route to whatever `seeAllHref` resolves to.
 * As of Session 6 the canonical destination is /<locale>#request —
 * anchors to the existing district-search/request flow on the home page
 * (no public listing of pending requests yet, and the prior
 * /en/features?tab=vote target was a dead-end).
 *
 * Session 7.5: marked 'use client' so we can attach onClick handlers
 * that call scrollToRequestSection — same-page click handles its own
 * smooth scroll, cross-page click sets a sessionStorage flag picked up
 * by the destination /<locale> mount handler. Avoids the broken
 * scrollIntoView({smooth}) path Session 7's inline Script tried.
 */

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { scrollToRequestSection } from "@/lib/utils/scroll-to-request";

export type LeaderboardRow = {
  districtName: string;
  stateName: string;
  requestCount: number;
};

export function NextDistrictLeaderboard({
  locale,
  items,
  seeAllHref,
}: {
  locale: string;
  items: LeaderboardRow[];
  seeAllHref?: string;
}) {
  const pathname = usePathname();
  if (items.length === 0) return null;
  const href = seeAllHref ?? `/${locale}/features`;
  const isRequestHref = href.endsWith("#request");

  // Only intercept clicks when the href is the #request anchor — for any
  // other seeAllHref (e.g. a future dedicated voting page), let normal
  // Link navigation proceed without our scroll fanciness.
  const handleRequestClick = isRequestHref
    ? (e: React.MouseEvent) => {
        const handled = scrollToRequestSection(pathname, locale);
        if (handled) e.preventDefault();
      }
    : undefined;

  return (
    <div>
      <div
        style={{
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: "0.07em",
          textTransform: "uppercase",
          color: "#9B9B9B",
          marginBottom: 10,
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <span aria-hidden="true">🗳️</span> Vote for the next district
      </div>

      <div
        style={{
          background: "#FFFFFF",
          border: "1px solid #E8E8E4",
          borderRadius: 14,
          overflow: "hidden",
        }}
      >
        {items.slice(0, 3).map((row, idx) => (
          <Link
            key={`${row.stateName}-${row.districtName}`}
            href={href}
            onClick={handleRequestClick}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "12px 16px",
              textDecoration: "none",
              color: "#1A1A1A",
              borderBottom: idx === Math.min(items.length, 3) - 1 ? "none" : "1px solid #F0F0EC",
              minHeight: 48,
            }}
          >
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: "#6B6B6B",
                fontFamily: "var(--font-mono, monospace)",
                width: 18,
                flexShrink: 0,
              }}
            >
              #{idx + 1}
            </span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: "#1A1A1A", lineHeight: 1.3 }}>
                {row.districtName}
              </div>
              <div style={{ fontSize: 11, color: "#9B9B9B", marginTop: 1 }}>
                {row.stateName}
              </div>
            </div>
            <div
              style={{
                fontSize: 12,
                color: "#2563EB",
                fontWeight: 600,
                fontFamily: "var(--font-mono, monospace)",
                flexShrink: 0,
              }}
            >
              {row.requestCount.toLocaleString("en-IN")}
              <span style={{ color: "#9B9B9B", fontWeight: 400, marginLeft: 3 }}>votes</span>
            </div>
          </Link>
        ))}
      </div>

      <div style={{ marginTop: 10, textAlign: "center" }}>
        <Link
          href={href}
          onClick={handleRequestClick}
          style={{
            fontSize: 12,
            color: "#2563EB",
            textDecoration: "none",
            fontWeight: 500,
          }}
        >
          Request your district →
        </Link>
      </div>
    </div>
  );
}
