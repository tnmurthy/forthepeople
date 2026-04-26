/**
 * ForThePeople.in — Your District. Your Data. Your Right.
 * © 2026 Jayanth M B. MIT License with Attribution.
 * https://github.com/jayanthmb14/forthepeople
 *
 * Session 13 v8 Phases F + G — major hero restructure.
 *
 * Phase F (Fix #5): Bigger map (560px max), centered, with a floating
 * "Click a state to explore" hint at the bottom.
 *
 * Phase G (Fixes #6, #7, #8, #9): Districts move INTO the hero right
 * column as inline rows (replacing the separate LiveDistrictsList
 * section). Each row shows district name, state, 2 curated tag-bullets
 * (Sugar capital · KRS dam · etc.), and a small NEW badge (8px pill,
 * NOT a background-color change) for the 3 most-recently-launched.
 *
 * Adds the green "Explore the whole India →" CTA between the subtitle
 * and the districts list.
 *
 * Layout: 60% map LEFT / 40% text+districts RIGHT, stretch-aligned so
 * the columns share height.
 *
 * Mobile: stacks; map first; districts list show all (no scroll cap).
 */

"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { DISTRICT_META } from "@/lib/data/district-meta";
import { timeAgoLabel } from "@/lib/utils/timeAgo";

const DrillDownMap = dynamic(() => import("@/components/map/DrillDownMap"), {
  ssr: false,
  loading: () => (
    <div
      aria-hidden="true"
      style={{
        width: "100%",
        height: "100%",
        minHeight: 480,
        background: "#FAFAF8",
        borderRadius: 16,
      }}
    />
  ),
});

const NEW_BADGE_COUNT = 3;

// Live preview data per district (temperature, last-updated). The
// health-grade field is intentionally not consumed any more — the
// grade was inaccurate and removed in Session 16 Phase F (Fix #6).
interface PreviewLive {
  temp: number | null;
  mostRecentAt: string | null;
}
type PreviewMap = Record<string, PreviewLive>;

interface HomepagePreviewRow {
  slug: string;
  weather?: { temp: number | null } | null;
  // We use the freshest of news / dam / crop / weather as a "data refreshed at" hint.
  news?: { publishedAt: string } | null;
}

interface ActiveDistrict {
  slug: string;
  name: string;
  stateSlug: string;
  stateName: string;
  goLiveDate?: string | null;
}

export interface HeroSectionProps {
  locale: string;
  /** Optional during phase rollout — Phase M wires the real list. */
  districts?: ActiveDistrict[];
}

export default function HeroSection({ locale, districts = [] }: HeroSectionProps) {
  // Top N most-recently launched get the small NEW badge.
  const newSlugs = useMemo(() => {
    const sorted = [...districts].sort((a, b) => {
      const ax = a.goLiveDate ? new Date(a.goLiveDate).getTime() : 0;
      const bx = b.goLiveDate ? new Date(b.goLiveDate).getTime() : 0;
      return bx - ax;
    });
    return new Set(sorted.slice(0, NEW_BADGE_COUNT).map((d) => d.slug));
  }, [districts]);

  // Live preview enrichment (temp + last-updated) per district.
  const [preview, setPreview] = useState<PreviewMap>({});
  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch("/api/data/homepage-preview");
        if (!res.ok) return;
        const data = (await res.json()) as { districtPreviews?: HomepagePreviewRow[] };
        if (cancelled) return;
        const next: PreviewMap = {};
        for (const r of data.districtPreviews ?? []) {
          next[r.slug] = {
            temp: r.weather?.temp ?? null,
            mostRecentAt: r.news?.publishedAt ?? null,
          };
        }
        setPreview(next);
      } catch {
        /* swallow — rows render without temp/freshness */
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section
      aria-labelledby="hero-heading"
      className="ftp-section-wrap ftp-hero-wrap"
      style={{ borderBottom: "1px solid #F0F0EC" }}
    >
      <style>{`
        /* Session 16 v10 Phase E (Fixes #4, #5): map dominant 65/35 */
        .ftp-hero {
          display: grid;
          grid-template-columns: 65% 35%;
          gap: 24px;
          align-items: stretch;
          min-height: 640px;
          padding: 24px 24px;
        }
        @media (max-width: 1024px) {
          .ftp-hero { grid-template-columns: 60% 40%; }
        }
        .ftp-hero-map-col {
          display: flex;
          align-items: center;
          justify-content: center;
        }
        /* Session 15 v9 Phase B (Fix #1): light-blue container, zoomed SVG */
        .ftp-hero-map-large {
          position: relative;
          width: 100%;
          height: 100%;
          min-height: 540px;
          max-height: 640px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: #F0F7FF;
          border-radius: 12px;
          overflow: hidden;
        }
        .ftp-hero-map-large svg {
          width: 100%;
          height: 100%;
          max-height: 620px;
          transform: scale(1.15);
          transform-origin: center;
        }
        .ftp-hero-map-hint {
          position: absolute;
          bottom: 12px;
          left: 50%;
          transform: translateX(-50%);
          font-size: 11px;
          color: #6B7280;
          pointer-events: none;
          display: inline-flex;
          align-items: center;
          gap: 4px;
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(4px);
          -webkit-backdrop-filter: blur(4px);
          padding: 4px 10px;
          border-radius: 12px;
          border: 0.5px solid #E5E7EB;
        }
        .ftp-hero-map-hint::before {
          content: "👆";
          font-size: 14px;
        }

        /* Session 16 v10 Phase E (Fix #5): compact right column */
        .ftp-hero-dashboard {
          background: #FFFFFF;
          border: 1px solid #E5E7EB;
          border-radius: 12px;
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.04);
          min-width: 0;
        }
        .ftp-hero-h1 {
          margin: 0;
          font-size: 20px;
          font-weight: 700;
          line-height: 1.25;
          letter-spacing: -0.01em;
          color: #1A1A1A;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        @media (max-width: 1280px) {
          .ftp-hero-h1 { font-size: 18px; }
        }
        .ftp-flag { font-size: 0.9em; margin-left: 4px; }
        .ftp-hero-subtitle-tiny {
          margin: 0;
          font-size: 11px;
          color: #9B9B9B;
          line-height: 1.4;
        }
        .ftp-hero-explore-link {
          font-size: 13px;
          color: #2563EB;
          font-weight: 500;
          text-decoration: none;
          align-self: flex-start;
        }
        .ftp-hero-explore-link:hover {
          text-decoration: underline;
          text-underline-offset: 3px;
        }
        .ftp-hero-divider {
          height: 1px;
          background: #E5E7EB;
          margin: 4px 0;
        }
        /* Session 16 v10 Phase E: vertical separator on the map column */
        .ftp-hero-map-col {
          position: relative;
          padding-right: 12px;
        }
        .ftp-hero-map-col::after {
          content: "";
          position: absolute;
          right: 0;
          top: 10%;
          bottom: 10%;
          width: 1px;
          background: #E5E7EB;
        }

        .ftp-hero-districts-section {
          display: flex;
          flex-direction: column;
          gap: 8px;
          min-width: 0;
        }
        .ftp-hero-districts-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 4px;
        }
        .ftp-hero-districts-title {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          font-weight: 600;
          color: #1A1A1A;
        }
        .ftp-live-pill {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          background: #10B981;
          color: #FFFFFF;
          padding: 2px 7px;
          border-radius: 3px;
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 0.5px;
        }
        .ftp-live-dot {
          width: 5px; height: 5px;
          background: #FFFFFF;
          border-radius: 50%;
          animation: ftp-live-pulse 2s ease-in-out infinite;
        }
        @keyframes ftp-live-pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%      { opacity: 0.5; transform: scale(0.8); }
        }
        @media (prefers-reduced-motion: reduce) {
          .ftp-live-dot { animation: none; }
          .ftp-hero-explore-tab { transition: none; }
          .ftp-hero-explore-tab:hover { transform: none; }
        }
        .ftp-hero-districts-all {
          font-size: 12px;
          color: #6B7280;
          text-decoration: none;
        }
        .ftp-hero-districts-all:hover { color: #2563EB; }

        /* Session 15 v9 Phase D: districts scroll inside the dashboard card */
        .ftp-hero-districts-list {
          display: flex;
          flex-direction: column;
          gap: 6px;
          max-height: 380px;
          overflow-y: auto;
          padding-right: 4px;
          scrollbar-width: thin;
        }
        /* Session 16 v10 Phase F (Fixes #6, #7): no rating badge, solid hover, no bleed */
        .ftp-district-row {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          padding: 12px 14px;
          background: #FFFFFF;
          border: 1px solid #E5E7EB;
          border-radius: 8px;
          text-decoration: none;
          color: #1A1A1A;
          position: relative;
          transition: border-color 150ms ease, box-shadow 200ms ease;
          min-height: 44px;
        }
        .ftp-district-row:hover {
          background: #FFFFFF;
          border-color: #2563EB;
          box-shadow: 0 4px 16px rgba(37, 99, 235, 0.12);
          z-index: 2;
        }
        .ftp-district-row-main { flex: 1; min-width: 0; }
        .ftp-district-row-name {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 8px;
          font-size: 13px;
          font-weight: 600;
        }
        .ftp-district-row-script {
          font-size: 12px;
          color: #9B9B9B;
          font-weight: 400;
        }
        /* Session 13 v8 Fix #9: NEW as a small letter pill, NOT a background color. */
        .ftp-district-row-newbadge {
          background: #EAB308;
          color: #FFFFFF;
          font-size: 8px;
          font-weight: 700;
          padding: 1px 5px;
          border-radius: 3px;
          letter-spacing: 0.4px;
        }
        .ftp-district-row-tagline {
          font-size: 11px;
          color: #2563EB;
          font-weight: 500;
          margin-top: 2px;
        }
        .ftp-district-row-bullets {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin-top: 4px;
        }
        .ftp-district-bullet {
          font-size: 10px;
          color: #6B7280;
          line-height: 1.4;
        }
        .ftp-district-bullet:not(:last-child)::after {
          content: " · ";
          color: #D1D5DB;
          margin-left: 4px;
        }
        /* Session 16 v10 Phase F (Fix #7 supplemental): per-row meta line */
        .ftp-district-row-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-top: 4px;
          padding-top: 4px;
          border-top: 1px dashed #E5E7EB;
        }
        .ftp-district-meta-item {
          font-size: 10px;
          color: #6B7280;
          font-weight: 500;
          font-variant-numeric: tabular-nums;
        }
        @media (prefers-reduced-motion: reduce) {
          .ftp-district-row { transition: none; }
          .ftp-district-row:hover { box-shadow: none; }
        }

        /* Session 16 v10 Phase L (Fix #13): mobile reorders text → map → districts */
        @media (max-width: 767px) {
          .ftp-hero {
            grid-template-columns: 1fr;
            grid-template-areas:
              "text"
              "map"
              "districts";
            min-height: auto;
            padding: 16px 12px;
            gap: 14px;
          }
          .ftp-hero-map-col {
            grid-area: map;
            padding-right: 0;
          }
          .ftp-hero-map-col::after { display: none; }
          .ftp-hero-map-large { min-height: 320px; max-height: 400px; }
          /* Dashboard becomes a layout-flattening wrapper so its children
             can participate in the hero grid via grid-area. */
          .ftp-hero-dashboard {
            display: contents;
          }
          .ftp-hero-dashboard > .ftp-hero-h1,
          .ftp-hero-dashboard > .ftp-hero-subtitle-tiny,
          .ftp-hero-dashboard > .ftp-hero-explore-link {
            grid-area: text;
          }
          .ftp-hero-dashboard > .ftp-hero-h1 { margin-bottom: 0; }
          .ftp-hero-dashboard > .ftp-hero-subtitle-tiny { margin-top: 4px; }
          .ftp-hero-dashboard > .ftp-hero-explore-link { margin-top: 4px; }
          .ftp-hero-dashboard > .ftp-hero-divider { display: none; }
          .ftp-hero-dashboard > .ftp-hero-districts-section {
            grid-area: districts;
            background: #FFFFFF;
            border: 1px solid #E5E7EB;
            border-radius: 12px;
            padding: 12px;
          }
          .ftp-hero-h1 {
            font-size: 22px;
            white-space: normal;
            line-height: 1.25;
            text-overflow: clip;
            overflow: visible;
          }
          .ftp-hero-districts-list { max-height: none; padding-right: 0; }
          /* Mobile district row simplification (Phase L Fix #13) */
          .ftp-district-row-script { display: none; }
          .ftp-district-row { padding: 10px 12px; }
          .ftp-district-row-name { font-size: 14px; }
          .ftp-district-row-tagline { font-size: 11px; }
          .ftp-district-bullet { font-size: 10px; }
          .ftp-district-meta-item { font-size: 9px; }
        }
      `}</style>

      <div className="ftp-hero">
        {/* LEFT — Map (60%) */}
        <div className="ftp-hero-map-col">
          <div
            className="ftp-hero-map-large"
            aria-label="India map showing active states"
            role="img"
          >
            <DrillDownMap locale={locale} />
            <div className="ftp-hero-map-hint">Click a state to explore</div>
          </div>
        </div>

        {/* RIGHT — Dashboard card (35%) */}
        <div className="ftp-hero-dashboard">
          <h1 id="hero-heading" className="ftp-hero-h1">
            Your district. Your data. Your right.
            <span className="ftp-flag" aria-label="India">🇮🇳</span>
          </h1>
          <p className="ftp-hero-subtitle-tiny">
            India&apos;s first free, real-time district transparency platform.
          </p>
          <Link
            href={`/${locale}/india-detail`}
            className="ftp-hero-explore-link"
          >
            → Explore the whole India
          </Link>

          <div className="ftp-hero-divider" aria-hidden="true" />

          <div className="ftp-hero-districts-section">
            <div className="ftp-hero-districts-header">
              <span className="ftp-hero-districts-title">
                <span className="ftp-live-pill">
                  <span className="ftp-live-dot" aria-hidden="true" /> LIVE
                </span>
                <span>{districts.length} districts</span>
              </span>
              <Link
                href={`/${locale}/vote-district`}
                className="ftp-hero-districts-all"
              >
                View all →
              </Link>
            </div>

            <div className="ftp-hero-districts-list">
            {districts.map((d) => {
              const meta = DISTRICT_META[d.slug];
              const live = preview[d.slug];
              const temp = live?.temp ?? null;
              const isNew = newSlugs.has(d.slug);
              const updated = timeAgoLabel(live?.mostRecentAt ?? null);
              return (
                <Link
                  key={d.slug}
                  href={`/${locale}/${d.stateSlug}/${d.slug}`}
                  className="ftp-district-row"
                >
                  <div className="ftp-district-row-main">
                    <div className="ftp-district-row-name">
                      <span>{d.name}</span>
                      {meta?.nativeScript && (
                        <span className="ftp-district-row-script">{meta.nativeScript}</span>
                      )}
                      {isNew && (
                        <span className="ftp-district-row-newbadge">NEW</span>
                      )}
                    </div>
                    {meta?.tagline && (
                      <div className="ftp-district-row-tagline">{meta.tagline}</div>
                    )}
                    {meta?.bullets && meta.bullets.length > 0 && (
                      <div className="ftp-district-row-bullets">
                        {meta.bullets.map((b, i) => (
                          <span key={i} className="ftp-district-bullet">{b}</span>
                        ))}
                      </div>
                    )}
                    {(temp != null || live?.mostRecentAt) && (
                      <div className="ftp-district-row-meta">
                        {temp != null && (
                          <span className="ftp-district-meta-item">🌡️ {temp}°C</span>
                        )}
                        {live?.mostRecentAt && (
                          <span className="ftp-district-meta-item">
                            🕐 {updated.isLive ? "Live" : `Updated ${updated.label}`}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </Link>
              );
            })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
