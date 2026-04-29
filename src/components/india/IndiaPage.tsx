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
 * Phase 2 stops at Hero + Nav. Phase 3 fills in the engagement blocks.
 * Phase 4 adds the module bands + Coming Soon + Sources. Phase 6 adds
 * the voting widget. Phase 7 wires legal disclaimers per band.
 */

import IndiaLegalDisclaimer from "./IndiaLegalDisclaimer";
import IndiaHero, { type HeroTileData } from "./IndiaHero";
import IndiaSectionNav from "./IndiaSectionNav";
import { INDIA_DESIGN } from "@/lib/india/india-design";
import {
  DASHBOARDS_PER_DISTRICT,
  TOTAL_INDIA_DISTRICTS,
} from "@/lib/constants";
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
  const activeDistrictCount = getTotalActiveDistrictCount();
  const totalDataPoints = activeDistrictCount * DASHBOARDS_PER_DISTRICT;
  // (Coming districts = TOTAL_INDIA_DISTRICTS - activeDistrictCount; rendered
  //  in subsequent phases as "districts coming" copy. Kept here so the const
  //  import is preserved when Phase 3 adds it to the new-districts strip.)
  void TOTAL_INDIA_DISTRICTS;

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

        {/* Phase 3 inserts: New Districts → Vote Next District → News here */}

        <IndiaSectionNav />

        {/* Phase 3 inserts: Today Snapshot here */}
        {/* Phase 4 inserts: 31 module bands + Coming Soon Rail + Sources Index */}
        {/* Phase 6 inserts: voting widget between bands and coming-soon rail */}
        {/* Phase 3 inserts: Royal Contributor card near the bottom */}

        <div
          style={{
            maxWidth: INDIA_DESIGN.sectionMaxWidth,
            margin: "0 auto",
            padding: "32px 16px 48px",
          }}
        >
          <p
            style={{
              fontSize: 13,
              color: INDIA_DESIGN.textMuted,
              fontStyle: "italic",
              textAlign: "center",
            }}
          >
            More sections coming online — module bands and the data sources
            index land in subsequent build phases.
          </p>
        </div>
      </main>
    </>
  );
}
