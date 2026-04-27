/**
 * ForThePeople.in — Your District. Your Data. Your Right.
 * © 2026 Jayanth M B. MIT License with Attribution.
 * https://github.com/jayanthmb14/forthepeople
 *
 * Session 17 v11 — hero RESTRUCTURE.
 *
 * Phase B (Fixes #1, #2): Title block at top, full-width centered.
 *   H1 has 3 phrases each with its own 2-shade gradient (blue → purple →
 *   emerald). Banner-style "Explore the whole India" CTA pill below.
 *
 * Phase C (Fix #3): Map + districts row beneath title, 50/50 split.
 *   Map column uses aspect-ratio: 800/900 to match the SVG's natural
 *   viewBox so the map fills the frame with no empty space at top and
 *   no scale-transform-induced ocean cropping.
 *
 * Phase D (Fix #4): District rows render ALL content always (head row,
 *   tagline, bullets) at a stable min-height. overflow:hidden + zero
 *   transform/z-index on hover guarantees no content bleed onto
 *   neighboring rows. Hover only changes border + bg + soft shadow.
 *
 * Live temperature + freshness still come from /api/data/homepage-preview
 * (existing 5-min cached endpoint, no schema/API change).
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
        background: "#F0F7FF",
      }}
    />
  ),
});

const NEW_BADGE_COUNT = 3;

interface PreviewLive {
  temp: number | null;
  mostRecentAt: string | null;
}
type PreviewMap = Record<string, PreviewLive>;

interface HomepagePreviewRow {
  slug: string;
  weather?: { temp: number | null } | null;
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
  districts?: ActiveDistrict[];
}

export default function HeroSection({ locale, districts = [] }: HeroSectionProps) {
  const newSlugs = useMemo(() => {
    const sorted = [...districts].sort((a, b) => {
      const ax = a.goLiveDate ? new Date(a.goLiveDate).getTime() : 0;
      const bx = b.goLiveDate ? new Date(b.goLiveDate).getTime() : 0;
      return bx - ax;
    });
    return new Set(sorted.slice(0, NEW_BADGE_COUNT).map((d) => d.slug));
  }, [districts]);

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
    >
      <style>{`
        /* Session 17 v11 Phase B: title block on top */
        .ftp-hero-wrap {
          background: linear-gradient(to bottom, #FFFFFF 0%, #FAFAF8 100%);
          padding: 32px 0;
        }
        .ftp-hero-titleblock {
          text-align: center;
          margin-bottom: 32px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
        }
        .ftp-hero-h1 {
          margin: 0;
          font-size: 38px;
          font-weight: 800;
          line-height: 1.15;
          letter-spacing: -0.025em;
          color: #0F172A;
          text-align: center;
        }
        /* Session 18 v12 Phase E (Fix #4): single navy color + one blue accent on "data" */
        .ftp-h1-accent {
          background: linear-gradient(135deg, #3B82F6 0%, #1E40AF 100%);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          color: transparent;
        }
        .ftp-h1-flag {
          font-size: 0.9em;
          -webkit-text-fill-color: initial;
          color: initial;
        }
        .ftp-hero-subtitle {
          margin: 0;
          font-size: 14px;
          color: #6B7280;
          max-width: 540px;
          line-height: 1.5;
        }
        .ftp-hero-banner-cta {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 12px 24px;
          background: linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%);
          color: #FFFFFF;
          text-decoration: none;
          border-radius: 999px;
          font-size: 14px;
          font-weight: 600;
          box-shadow: 0 4px 16px rgba(37, 99, 235, 0.25);
          transition: transform 200ms ease, box-shadow 200ms ease;
          margin-top: 4px;
        }
        .ftp-hero-banner-cta:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(37, 99, 235, 0.35);
        }
        .ftp-banner-icon { font-size: 16px; line-height: 1; }
        .ftp-banner-arrow {
          font-size: 16px;
          transition: transform 200ms ease;
        }
        .ftp-hero-banner-cta:hover .ftp-banner-arrow { transform: translateX(3px); }

        /* Session 17 v11 Phase C: 50/50 map+districts row, map fills frame naturally */
        .ftp-hero-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
          align-items: start;
        }
        .ftp-hero-map-col {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .ftp-hero-map-frame {
          width: 100%;
          aspect-ratio: 800 / 900;
          background: #F0F7FF;
          border: 1px solid #DBEAFE;
          border-radius: 12px;
          overflow: hidden;
          position: relative;
          display: flex;
        }
        .ftp-hero-map-frame svg {
          width: 100%;
          height: 100%;
          display: block;
        }
        .ftp-hero-map-hint {
          font-size: 11px;
          color: #9B9B9B;
          text-align: center;
        }

        .ftp-hero-districts-col {
          display: flex;
          flex-direction: column;
          gap: 12px;
          background: #FFFFFF;
          border: 1px solid #E5E7EB;
          border-radius: 12px;
          padding: 16px;
        }
        .ftp-hero-districts-header {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          font-weight: 700;
          color: #1A1A1A;
          padding-bottom: 12px;
          border-bottom: 1px solid #E5E7EB;
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
          animation: ftp-pulse-dot 2s ease-in-out infinite;
        }
        @keyframes ftp-pulse-dot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%      { opacity: 0.5; transform: scale(0.85); }
        }
        .ftp-hero-districts-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        /* Session 17 v11 Phase D: stable district rows, all content always visible */
        .ftp-district-row {
          display: flex;
          flex-direction: column;
          gap: 4px;
          padding: 10px 12px;
          background: #FFFFFF;
          border: 1px solid #E5E7EB;
          border-radius: 8px;
          text-decoration: none;
          color: #1A1A1A;
          overflow: hidden;
          position: relative;
          min-height: 76px;
          transition: border-color 150ms ease, box-shadow 150ms ease, background 150ms ease;
        }
        .ftp-district-row:hover {
          background: #FAFAFA;
          border-color: #2563EB;
          box-shadow: 0 4px 12px rgba(37, 99, 235, 0.10);
        }
        .ftp-district-row-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
        }
        .ftp-district-row-name-line {
          display: flex;
          align-items: baseline;
          gap: 8px;
          flex: 1;
          min-width: 0;
          overflow: hidden;
        }
        .ftp-district-row-name {
          font-size: 14px;
          font-weight: 700;
          color: #1A1A1A;
          white-space: nowrap;
        }
        .ftp-district-row-script {
          font-size: 12px;
          color: #9B9B9B;
          font-weight: 400;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .ftp-district-row-newbadge {
          background: #EAB308;
          color: #FFFFFF;
          font-size: 8px;
          font-weight: 700;
          padding: 1px 5px;
          border-radius: 3px;
          letter-spacing: 0.4px;
          flex-shrink: 0;
        }
        .ftp-district-row-temp {
          font-size: 11px;
          color: #6B7280;
          font-weight: 600;
          flex-shrink: 0;
          white-space: nowrap;
          font-variant-numeric: tabular-nums;
        }
        .ftp-district-row-tagline {
          font-size: 11px;
          color: #2563EB;
          font-weight: 500;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .ftp-district-row-bullets {
          font-size: 10px;
          color: #6B7280;
          line-height: 1.4;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .ftp-district-row-meta {
          font-size: 9px;
          color: #9B9B9B;
          font-style: italic;
        }

        @media (max-width: 1024px) {
          .ftp-hero-row { grid-template-columns: 1fr; gap: 16px; }
        }
        @media (max-width: 767px) {
          .ftp-hero-h1 { font-size: 28px; }
          .ftp-hero-subtitle { font-size: 13px; padding: 0 16px; }
          .ftp-hero-banner-cta { padding: 10px 20px; font-size: 13px; }
          .ftp-hero-titleblock { margin-bottom: 20px; }
          .ftp-hero-map-frame { aspect-ratio: 4 / 5; }
          .ftp-district-row-script { display: none; }
          .ftp-district-row { padding: 10px 12px; min-height: 70px; }
        }
        @media (prefers-reduced-motion: reduce) {
          .ftp-hero-banner-cta { transition: none; }
          .ftp-hero-banner-cta:hover { transform: none; box-shadow: 0 4px 16px rgba(37, 99, 235, 0.25); }
          .ftp-hero-banner-cta:hover .ftp-banner-arrow { transform: none; }
          .ftp-live-dot { animation: none; }
          .ftp-district-row { transition: none; }
        }
      `}</style>

      <div className="ftp-section-inner">
        {/* TOP: Title block */}
        <div className="ftp-hero-titleblock">
          <h1 id="hero-heading" className="ftp-hero-h1">
            Your district. Your <span className="ftp-h1-accent">data</span>. Your right.{" "}
            <span className="ftp-h1-flag" aria-label="India">🇮🇳</span>
          </h1>
          <p className="ftp-hero-subtitle">
            India&apos;s first free, real-time district transparency platform.
          </p>
          <Link href={`/${locale}/india-detail`} className="ftp-hero-banner-cta">
            <span className="ftp-banner-icon" aria-hidden="true">🗺️</span>
            <span className="ftp-banner-label">Explore the whole India</span>
            <span className="ftp-banner-arrow" aria-hidden="true">→</span>
          </Link>
        </div>

        {/* BOTTOM: Map + districts row */}
        <div className="ftp-hero-row">
          {/* LEFT — Map (50%, natural aspect) */}
          <div className="ftp-hero-map-col">
            <div
              className="ftp-hero-map-frame"
              aria-label="India map showing active states"
              role="img"
            >
              <DrillDownMap locale={locale} />
            </div>
            <div className="ftp-hero-map-hint">👆 Click a state to explore</div>
          </div>

          {/* RIGHT — 10 districts (50%) */}
          <div className="ftp-hero-districts-col">
            <div className="ftp-hero-districts-header">
              <span className="ftp-live-pill">
                <span className="ftp-live-dot" aria-hidden="true" /> LIVE
              </span>
              <span>{districts.length} districts</span>
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
                    <div className="ftp-district-row-head">
                      <div className="ftp-district-row-name-line">
                        <span className="ftp-district-row-name">{d.name}</span>
                        {meta?.nativeScript && (
                          <span className="ftp-district-row-script">
                            {meta.nativeScript}
                          </span>
                        )}
                        {isNew && (
                          <span className="ftp-district-row-newbadge">NEW</span>
                        )}
                      </div>
                      {temp != null && (
                        <span className="ftp-district-row-temp" title="Latest weather reading">
                          🌡️ {temp}°C
                        </span>
                      )}
                    </div>
                    {meta?.tagline && (
                      <div className="ftp-district-row-tagline">{meta.tagline}</div>
                    )}
                    {meta?.bullets && meta.bullets.length > 0 && (
                      <div className="ftp-district-row-bullets">
                        {meta.bullets.join(" · ")}
                      </div>
                    )}
                    {live?.mostRecentAt && (
                      <div className="ftp-district-row-meta">
                        🕐 {updated.isLive ? "Live" : `Updated ${updated.label}`}
                      </div>
                    )}
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
