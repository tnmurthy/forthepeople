/**
 * ForThePeople.in — Your District. Your Data. Your Right.
 * © 2026 Jayanth M B. MIT License with Attribution.
 * https://github.com/jayanthmb14/forthepeople
 *
 * Session 11.6 v6 — replaces DistrictExplorer + LiveDataShowcase.
 *
 * Flat 5-column grid of all active districts. The 3 most recently
 * launched districts (by goLiveDate desc) get an amber NEW badge.
 *
 * Data is server-fetched in [locale]/page.tsx and passed in via props
 * (no client roundtrip on first paint).
 */

"use client";

import Link from "next/link";
import { useMemo } from "react";

interface ActiveDistrict {
  slug: string;
  name: string;
  stateSlug: string;
  goLiveDate?: string | null;
}

export interface LiveDistrictsListProps {
  locale: string;
  activeDistricts: ActiveDistrict[];
}

export default function LiveDistrictsList({
  locale,
  activeDistricts,
}: LiveDistrictsListProps) {
  // The 3 most recently launched (by goLiveDate desc) become NEW.
  const newSlugs = useMemo(() => {
    const sorted = [...activeDistricts].sort((a, b) => {
      const ax = a.goLiveDate ? new Date(a.goLiveDate).getTime() : 0;
      const bx = b.goLiveDate ? new Date(b.goLiveDate).getTime() : 0;
      return bx - ax;
    });
    return new Set(sorted.slice(0, 3).map((d) => d.slug));
  }, [activeDistricts]);

  return (
    <section
      id="live-districts"
      aria-labelledby="districts-heading"
      className="ftp-section-wrap ftp-live-list-wrap"
      style={{ background: "#FAFAF8", borderTop: "1px solid #F0F0EC" }}
    >
      <style>{`
        .ftp-live-list-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 8px;
        }
        .ftp-live-card {
          background: #FFFFFF;
          border: 1px solid #E8E8E4;
          border-radius: 8px;
          padding: 12px 14px;
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          font-weight: 500;
          color: #1A1A1A;
          text-decoration: none;
          transition: transform 150ms ease, background 150ms ease, border-color 150ms ease;
          min-height: 44px;
        }
        .ftp-live-card:hover {
          background: #F5F5F0;
          border-color: #D1D5DB;
          transform: translateY(-1px);
        }
        @media (prefers-reduced-motion: reduce) {
          .ftp-live-card { transition: none; }
          .ftp-live-card:hover { transform: none; }
        }
        .ftp-live-card-new {
          background: #FFFBEB;
          border-color: #FDE68A;
        }
        .ftp-live-card-new:hover {
          background: #FEF3C7;
          border-color: #FCD34D;
        }
        .ftp-live-newbadge {
          background: #BA7517;
          color: #FFFFFF;
          font-size: 9px;
          font-weight: 600;
          padding: 1px 5px;
          border-radius: 3px;
          letter-spacing: 0.3px;
          margin-left: auto;
          flex-shrink: 0;
        }
        @media (max-width: 767px) {
          .ftp-live-list-grid { grid-template-columns: repeat(2, 1fr); }
        }
      `}</style>

      <div className="ftp-section-inner">
        <div style={{ marginBottom: 14 }}>
          <h2
            id="districts-heading"
            style={{ margin: 0, fontSize: 18, fontWeight: 600, color: "#1A1A1A" }}
          >
            Live districts ·{" "}
            <span style={{ color: "#6B7280", fontWeight: 400 }}>
              {activeDistricts.length} active
            </span>
          </h2>
        </div>

        <div className="ftp-live-list-grid">
          {activeDistricts.map((d) => {
            const isNew = newSlugs.has(d.slug);
            return (
              <Link
                key={d.slug}
                href={`/${locale}/${d.stateSlug}/${d.slug}`}
                className={`ftp-live-card${isNew ? " ftp-live-card-new" : ""}`}
              >
                <span style={{ minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {d.name}
                </span>
                {isNew && <span className="ftp-live-newbadge">NEW</span>}
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
