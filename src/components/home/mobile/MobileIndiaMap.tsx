/**
 * ForThePeople.in — Your District. Your Data. Your Right.
 * © 2026 Jayanth M B. MIT License with Attribution.
 *
 * Session M1 Phase E: full-width India map section for mobile,
 * lazy-loaded via next/dynamic so it doesn't block the carousel paint.
 */

"use client";

import dynamic from "next/dynamic";

const DrillDownMap = dynamic(
  () => import("@/components/map/DrillDownMap"),
  {
    ssr: false,
    loading: () => <div className="ftp-m-map-loading">Loading map…</div>,
  },
);

interface Props {
  locale: string;
}

export function MobileIndiaMap({ locale }: Props) {
  return (
    <section
      className="ftp-m-section ftp-m-map-section"
      aria-labelledby="m-map-heading"
    >
      <header className="ftp-m-section-head">
        <h2 id="m-map-heading">🗺 EXPLORE INDIA</h2>
      </header>
      <div className="ftp-m-map-frame">
        <DrillDownMap locale={locale} />
      </div>
      <p className="ftp-m-map-hint">👆 Tap any state to explore</p>
    </section>
  );
}
