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

import Link from "next/link";
import IndiaLegalDisclaimer from "./IndiaLegalDisclaimer";
import IndiaHero, { type HeroTileData } from "./IndiaHero";
import IndiaSectionNav from "./IndiaSectionNav";
import IndiaNewDistrictsRail from "./IndiaNewDistrictsRail";
import IndiaNextDistrictVote from "./IndiaNextDistrictVote";
import IndiaNewsStrip from "./IndiaNewsStrip";
import IndiaTodaySnapshot from "./IndiaTodaySnapshot";
import IndiaSectionBand from "./IndiaSectionBand";
import IndiaMccBanner from "./IndiaMccBanner";
import IndiaModuleSuggestVote from "./IndiaModuleSuggestVote";
import IndiaComingSoonRail from "./IndiaComingSoonRail";
import IndiaDataSourcesIndex from "./IndiaDataSourcesIndex";
import IndiaRoyalContributorCard from "./IndiaRoyalContributorCard";
import { formatRelativeAge } from "@/lib/india/india-formatters";
import { INDIA_DESIGN } from "@/lib/india/india-design";
import { getLiveIndiaModules } from "@/lib/india/india-modules";
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

type Disclaimers = {
  top: string;
  defence: string;
  health: string;
  elections: string;
  justice: string;
  mcc: string;
};

interface Props {
  locale: string;
  /** Dictionary block from src/dictionaries/<locale>.json#india. */
  dict: {
    title: string;
    subtitle: string;
    disclaimers: Disclaimers;
    sources: { title: string; subtitle: string };
  };
}

export default async function IndiaPage({ locale, dict }: Props) {
  const snapshot = await fetchIndiaSnapshot();

  const heroTiles = snapshot?.hero ?? [];
  const todayTiles = snapshot?.today ?? [];
  const activeDistrictCount = getTotalActiveDistrictCount();
  const totalDataPoints = activeDistrictCount * DASHBOARDS_PER_DISTRICT;
  const liveModules = getLiveIndiaModules();
  const mccMode = process.env.NEXT_PUBLIC_ELECTION_MODE === "true";

  // Index of the first elections-category live module — drives MCC banner
  // placement. -1 if no elections modules are currently live.
  const firstElectionsIdx = liveModules.findIndex((m) => m.category === "elections");

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

        {/* All `live` module bands rendered from the registry. Each band's
            children slot is empty in this phase, so IndiaSectionBand falls
            back to <IndiaAwaitingSync sourceKey={...} /> automatically.
            Phase 5+ will inject real KPI cards / charts / leaderboards
            once IndiaIndicator has rows.

            Per-band legal disclaimer: when mod.legalNote is set, the
            corresponding text from dict.disclaimers is rendered as an
            italic muted note inside the band header. MCC banner shown
            once before the first elections band when election mode is on. */}
        {liveModules.map((mod, idx) => {
          const noteText =
            mod.legalNote && mod.legalNote in dict.disclaimers
              ? dict.disclaimers[mod.legalNote as keyof Disclaimers]
              : null;
          const showMcc = mccMode && idx === firstElectionsIdx;
          return (
            <div key={mod.slug}>
              {showMcc ? <IndiaMccBanner text={dict.disclaimers.mcc} /> : null}
              <IndiaSectionBand module={mod} legalNoteText={noteText} />
            </div>
          );
        })}

        {/* Fallback: if MCC mode is on but no elections modules are live yet
            (Session A's Correction-3 demoted all 3), still surface the
            notice once near the bottom of the bands so visitors see it. */}
        {mccMode && firstElectionsIdx === -1 ? (
          <IndiaMccBanner text={dict.disclaimers.mcc} />
        ) : null}

        <IndiaModuleSuggestVote />

        <IndiaComingSoonRail />

        <IndiaRoyalContributorCard
          locale={locale}
          activeDistrictCount={activeDistrictCount}
        />

        {/* Slim "see update log" footer link — transparency page link. */}
        <div
          style={{
            maxWidth: INDIA_DESIGN.sectionMaxWidth,
            margin: "0 auto",
            padding: "8px 16px 24px",
            textAlign: "center",
            fontSize: 12,
            color: INDIA_DESIGN.textMuted,
          }}
        >
          {snapshot?.lastUpdated ? (
            <span>Last updated {formatRelativeAge(snapshot.lastUpdated)}</span>
          ) : (
            <span>Awaiting first sync</span>
          )}
          <span style={{ margin: "0 6px", color: INDIA_DESIGN.textFaint }}>·</span>
          <Link
            href={`/${locale}/india/updates`}
            style={{
              color: INDIA_DESIGN.accentBlue,
              textDecoration: "none",
              fontWeight: 600,
            }}
          >
            See update log →
          </Link>
        </div>

        <IndiaDataSourcesIndex
          title={dict.sources.title}
          subtitle={dict.sources.subtitle}
        />
      </main>
    </>
  );
}
