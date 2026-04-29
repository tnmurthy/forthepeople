/**
 * ForThePeople.in — Your District. Your Data. Your Right.
 * © 2026 Jayanth M B. MIT License with Attribution.
 *
 * IndiaPage — orchestrator for /[locale]/india.
 *
 * Server component. Fetches /api/india/snapshot once at request time
 * (ISR via revalidate=900 = 15 min) and feeds the body components.
 *
 * Layout order (file 31 §9):
 *   Hero → New Districts → Vote Next District → News → Sticky Nav →
 *   Today Snapshot → Module Bands → Voting → Coming Soon → Royal →
 *   Sources Index
 *
 * Phase 3 status:
 *   ✓ Hero, Sticky Nav, Disclaimer (Phase 2)
 *   ✓ New Districts, Vote Next District, News, Today, Royal (Phase 3)
 *   • Module Bands + Coming Soon Rail + Sources Index (Phase 4)
 *   • Voting widget (Phase 6)
 *   • Per-band legal disclaimers (Phase 7)
 */

import IndiaLegalDisclaimer from "./IndiaLegalDisclaimer";
import IndiaHero, { type HeroTileData } from "./IndiaHero";
import IndiaSectionNav from "./IndiaSectionNav";
import IndiaNewDistrictsRail from "./IndiaNewDistrictsRail";
import IndiaNextDistrictVote from "./IndiaNextDistrictVote";
import IndiaNewsStrip from "./IndiaNewsStrip";
import IndiaTodaySnapshot from "./IndiaTodaySnapshot";
import IndiaRoyalContributorCard from "./IndiaRoyalContributorCard";
import { INDIA_DESIGN } from "@/lib/india/india-design";
import { DASHBOARDS_PER_DISTRICT } from "@/lib/constants";
import { getTotalActiveDistrictCount } from "@/lib/constants/districts";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://forthepeople.in";

interface IndiaSnapshotResponse {
  hero: HeroTileData[];
  today: HeroTileData[];
  newDistricts: unknown[];
  topNews: unknown[];
  lastUpdated: string | null;
  stub?: boolean;
}

async function fetchIndiaSnapshot(): Promise<IndiaSnapshotResponse | null> {
  try {
    const res = await fetch(`${BASE_URL}/api/india/snapshot`, {
      next: { revalidate: 900 }, // 15 min ISR per file 31 §17
    });
    if (!res.ok) return null;
    return (await res.json()) as IndiaSnapshotResponse;
  } catch {
    return null;
  }
}

interface Props {
  locale: string;
  /** Dictionary block from src/dictionaries/<locale>.json#india. */
  dict: {
    title: string;
    subtitle: string;
    disclaimers: { top: string };
    sources: { title: string; subtitle: string };
  };
}

export default async function IndiaPage({ locale, dict }: Props) {
  const snapshot = await fetchIndiaSnapshot();

  const heroTiles = snapshot?.hero ?? [];
  const todayTiles = snapshot?.today ?? [];
  const activeDistrictCount = getTotalActiveDistrictCount();
  const totalDataPoints = activeDistrictCount * DASHBOARDS_PER_DISTRICT;

  return (
    <>
      {/* Top legal strip — distinct from layout's site-wide DisclaimerBanner. */}
      <IndiaLegalDisclaimer text={dict.disclaimers.top} />

      <main
        role="main"
        style={{
          background: INDIA_DESIGN.bgPage,
          minHeight: "100vh",
        }}
      >
        <IndiaHero
          locale={locale}
          tiles={heroTiles}
          activeDistrictCount={activeDistrictCount}
          dashboardsPerDistrict={DASHBOARDS_PER_DISTRICT}
          totalDataPoints={totalDataPoints}
        />

        {/* Engagement blocks — preserved 1:1 from /en/india-detail. */}
        <IndiaNewDistrictsRail locale={locale} />
        <IndiaNextDistrictVote locale={locale} />
        <IndiaNewsStrip />

        {/* Sticky table of contents for the deep-dive bands below. */}
        <IndiaSectionNav />

        <IndiaTodaySnapshot tiles={todayTiles} />

        {/* Phase 4 inserts: 31 module bands here */}
        {/* Phase 6 inserts: voting widget here */}
        {/* Phase 4 inserts: Coming Soon Rail here */}

        <IndiaRoyalContributorCard
          locale={locale}
          activeDistrictCount={activeDistrictCount}
        />

        {/* Phase 4 inserts: IndiaDataSourcesIndex here */}

        <div
          style={{
            maxWidth: INDIA_DESIGN.sectionMaxWidth,
            margin: "0 auto",
            padding: "8px 16px 32px",
          }}
        >
          <p
            style={{
              fontSize: 12,
              color: INDIA_DESIGN.textFaint,
              textAlign: "center",
              fontStyle: "italic",
            }}
          >
            Module bands and the Data Sources Index land in the next build phase.
          </p>
        </div>
      </main>
    </>
  );
}
