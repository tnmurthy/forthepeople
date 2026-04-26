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
import { useMemo } from "react";

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

// ── Curated rich intros (2-3 tags per district) ──
// Design copy only — not data. Used to fill the inline district rows.
const DISTRICT_INTROS: Record<string, { tags: string[] }> = {
  "mandya":           { tags: ["Sugar capital", "KRS dam", "Cauvery basin"] },
  "bengaluru-urban":  { tags: ["Silicon Valley of India", "IT capital", "Garden city"] },
  "mysuru":           { tags: ["Heritage city", "Mysuru Palace", "Cultural capital"] },
  "mumbai":           { tags: ["Financial capital", "Bollywood", "Gateway of India"] },
  "pune":             { tags: ["Auto + IT hub", "Oxford of the East", "Khadakwasla"] },
  "lucknow":          { tags: ["City of Nawabs", "Awadhi culture", "Capital of UP"] },
  "hyderabad":        { tags: ["Cyberabad", "IT + biotech hub", "Charminar"] },
  "new-delhi":        { tags: ["National capital", "India Gate", "Government seat"] },
  "chennai":          { tags: ["Detroit of India", "IT hub", "Marina Beach"] },
  "kolkata":          { tags: ["Cultural capital", "City of Joy", "Howrah Bridge"] },
};

const NEW_BADGE_COUNT = 3;

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

  return (
    <section
      aria-labelledby="hero-heading"
      className="ftp-section-wrap ftp-hero-wrap"
      style={{ background: "#FFFFFF", borderBottom: "1px solid #F0F0EC" }}
    >
      <style>{`
        /* Session 14 v8.1 Phase D+E (Fixes #8, #9): bigger map + room for one-line tagline */
        .ftp-hero {
          display: grid;
          grid-template-columns: 56% 44%;
          gap: 28px;
          align-items: stretch;
          min-height: 640px;
          padding: 24px 24px;
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

        .ftp-hero-right {
          display: flex;
          flex-direction: column;
          gap: 14px;
          padding: 8px 0;
          min-width: 0;
        }
        .ftp-hero-h1 {
          margin: 0;
          font-size: 28px;
          font-weight: 700;
          line-height: 1.15;
          letter-spacing: -0.02em;
          color: #1A1A1A;
          white-space: nowrap;
        }
        @media (max-width: 1280px) {
          .ftp-hero-h1 { font-size: 24px; white-space: normal; }
        }
        .ftp-hero-subtitle {
          margin: 0;
          font-size: 14px;
          color: #4B5563;
          line-height: 1.5;
        }
        .ftp-hero-cta-explore {
          display: inline-block;
          align-self: flex-start;
          background: #10B981;
          color: #FFFFFF;
          padding: 10px 18px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          text-decoration: none;
          transition: transform 200ms ease, background 150ms ease;
        }
        .ftp-hero-cta-explore:hover {
          background: #059669;
          transform: scale(1.02);
        }

        .ftp-hero-districts-header {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          margin-top: 8px;
          padding-top: 12px;
          border-top: 0.5px solid #E5E7EB;
        }
        .ftp-hero-districts-title {
          font-size: 13px;
          font-weight: 600;
          color: #1A1A1A;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .ftp-hero-districts-all {
          font-size: 12px;
          color: #6B7280;
          text-decoration: none;
        }
        .ftp-hero-districts-all:hover { color: #2563EB; }

        /* Session 14 v8.1 Phase F (Fix #10): outlined rows, more padding, all 3 tags, all 10 visible */
        .ftp-hero-districts-list {
          display: flex;
          flex-direction: column;
          gap: 6px;
          /* No max-height / overflow — all 10 rows visible; page scrolls naturally if needed. */
        }
        .ftp-district-row {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 14px;
          background: #FFFFFF;
          border: 1px solid #E5E7EB;
          border-radius: 8px;
          text-decoration: none;
          color: #1A1A1A;
          transition: background 150ms ease, border-color 150ms ease, transform 150ms ease, box-shadow 200ms ease;
          min-height: 44px;
        }
        .ftp-district-row:hover {
          background: #FAFAF8;
          border-color: #2563EB;
          transform: translateX(2px);
          box-shadow: 0 2px 8px rgba(37, 99, 235, 0.08);
        }
        .ftp-district-row-main { flex: 1; min-width: 0; }
        .ftp-district-row-name {
          font-size: 13px;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 6px;
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
        .ftp-district-row-tags {
          font-size: 11px;
          color: #6B7280;
          margin-top: 2px;
          white-space: normal;
          line-height: 1.4;
        }
        .ftp-district-row-arrow {
          font-size: 12px;
          color: #9B9B9B;
          flex-shrink: 0;
        }
        @media (prefers-reduced-motion: reduce) {
          .ftp-district-row { transition: none; }
          .ftp-district-row:hover { transform: none; box-shadow: none; }
        }

        @media (max-width: 767px) {
          .ftp-hero {
            grid-template-columns: 1fr;
            min-height: auto;
            padding: 16px 12px;
            gap: 16px;
          }
          .ftp-hero-map-col { order: -1; min-height: 320px; }
          .ftp-hero-map-large { min-height: 320px; max-height: 400px; }
          .ftp-hero-right { padding: 0; }
          .ftp-hero-h1 { font-size: 22px; white-space: normal; }
        }
        @media (prefers-reduced-motion: reduce) {
          .ftp-hero-cta-explore { transition: none; }
          .ftp-hero-cta-explore:hover { transform: none; }
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

        {/* RIGHT — Tagline + CTA + districts list (40%) */}
        <div className="ftp-hero-right">
          <h1 id="hero-heading" className="ftp-hero-h1">
            Your district.{" "}
            <span style={{ color: "#9CA3AF" }}>Your data.</span>{" "}
            <span style={{ color: "#2563EB" }}>Your right.</span>{" "}
            <span style={{ fontSize: "0.85em" }} aria-label="India">🇮🇳</span>
          </h1>
          <p className="ftp-hero-subtitle">
            India&apos;s first free, real-time district transparency platform.
          </p>

          <Link
            href={`/${locale}/india-detail`}
            className="ftp-hero-cta-explore"
          >
            Explore the whole India →
          </Link>

          <div className="ftp-hero-districts-header">
            <span className="ftp-hero-districts-title">
              {districts.length} districts live
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
              const intro = DISTRICT_INTROS[d.slug];
              const isNew = newSlugs.has(d.slug);
              const tags = (intro?.tags ?? []).join(" · ");
              return (
                <Link
                  key={d.slug}
                  href={`/${locale}/${d.stateSlug}/${d.slug}`}
                  className="ftp-district-row"
                >
                  <div className="ftp-district-row-main">
                    <div className="ftp-district-row-name">
                      {d.name}
                      {isNew && (
                        <span className="ftp-district-row-newbadge">NEW</span>
                      )}
                      <span style={{ color: "#9CA3AF", fontWeight: 400, fontSize: 11 }}>
                        · {d.stateName}
                      </span>
                    </div>
                    {tags && <div className="ftp-district-row-tags">{tags}</div>}
                  </div>
                  <span className="ftp-district-row-arrow">→</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
