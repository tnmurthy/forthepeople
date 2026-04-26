/**
 * ForThePeople.in — Your District. Your Data. Your Right.
 * © 2026 Jayanth M B. MIT License with Attribution.
 * https://github.com/jayanthmb14/forthepeople
 *
 * Session 12 v7 — page.tsx swap (Phase N).
 *
 * Composition:
 *   1. FinancialTicker         — LIVE pill + scrolling marquee + updated label
 *   2. StatsBar                — count-up stats line (replaces LiveActivityRibbon)
 *   3. HeroSection             — map LEFT (60%), text RIGHT (40%)
 *   4. LiveDistrictsList       — flat 10-district grid, NEW badge on top 3 newest
 *   5. LiveDataShowcase        — RESTORED — district chip tabs + 4 module cards
 *   6. HowItWorks              — 4-step explainer (Aggregate/Process/Surface/Sustain)
 *   7. ContributorsStrip       — flat names + "View all supporters & how to join"
 *   8. VoteFeaturesCTA         — top 3 features + "Vote on features"
 *
 * UpcomingDistricts removed from the homepage — its function is now served
 * by the dedicated /vote-district route (linked from the HeaderBar district
 * autocomplete and from the StatsBar "coming districts" affordance).
 *
 * StatsBar pulls real values via the cached /api/data/homepage-stats endpoint
 * (5-min cache, SSR-safe). DASHBOARDS_PER_DISTRICT and TOTAL_INDIA_DISTRICTS
 * come from src/lib/constants.ts so the numbers stay in one place.
 */

import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import {
  DASHBOARDS_PER_DISTRICT,
  TOTAL_INDIA_DISTRICTS,
} from "@/lib/constants";

import FinancialTicker from "@/components/home/redesign-v2/FinancialTicker";
import StatsBar from "@/components/home/redesign-v2/LiveActivityRibbon";
import HeroSection from "@/components/home/redesign-v2/HeroSection";
import LiveDataShowcase from "@/components/home/redesign-v2/LiveDataShowcase";
import HowItWorks from "@/components/home/redesign-v2/HowItWorks";
import ContributorsStrip from "@/components/home/redesign-v2/ContributorsStrip";
import VoteFeaturesCTA from "@/components/home/redesign-v2/VoteFeaturesCTA";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://forthepeople.in";

interface HomepageStats {
  activeDistricts: number;
  totalDataPoints: number;
  mostRecentAt: string | null;
}

async function fetchHomepageStats(): Promise<HomepageStats | null> {
  try {
    const res = await fetch(`${BASE_URL}/api/data/homepage-stats`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return null;
    const json = (await res.json()) as Partial<HomepageStats>;
    return {
      activeDistricts: json.activeDistricts ?? 0,
      totalDataPoints: json.totalDataPoints ?? 0,
      mostRecentAt: json.mostRecentAt ?? null,
    };
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const url = `${BASE_URL}/${locale}`;
  return {
    alternates: {
      canonical: url,
      languages: {
        en: `${BASE_URL}/en`,
        kn: `${BASE_URL}/kn`,
        "x-default": `${BASE_URL}/en`,
      },
    },
    openGraph: { url },
  };
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Server-side fetch (single round trip) — feeds the body components.
  const [activeRows, statsFromApi] = await Promise.all([
    prisma.district.findMany({
      where: { active: true },
      select: {
        slug: true,
        name: true,
        nameLocal: true,
        tagline: true,
        goLiveDate: true,
        state: { select: { slug: true, name: true } },
      },
      orderBy: { name: "asc" },
    }),
    fetchHomepageStats(),
  ]);

  const activeDistricts = activeRows.map((d) => ({
    slug: d.slug,
    name: d.name,
    nameLocal: d.nameLocal,
    tagline: d.tagline,
    stateSlug: d.state.slug,
    stateName: d.state.name,
    goLiveDate: d.goLiveDate ? d.goLiveDate.toISOString() : null,
  }));

  // Stats fed into StatsBar — fall back to derivable values if the
  // homepage-stats endpoint is unreachable (cache miss + DB hiccup).
  const activeCount = statsFromApi?.activeDistricts ?? activeRows.length;
  const totalDataPoints = statsFromApi?.totalDataPoints ?? 0;
  const mostRecentAt = statsFromApi?.mostRecentAt ?? null;
  const comingDistricts = Math.max(0, TOTAL_INDIA_DISTRICTS - activeCount);

  return (
    <>
      {/* Visually hidden h1 — the visible headline lives inside HeroSection
          (h2 there, since this h1 is the SEO/page-identity anchor). */}
      <h1 className="sr-only">
        ForThePeople.in — India&apos;s Citizen Transparency Platform.
        District-level government data: crop prices, dam levels, schemes,
        budget, and more.
      </h1>

      <main role="main">
        <FinancialTicker />
        <StatsBar
          activeDistricts={activeCount}
          dashboardsPerDistrict={DASHBOARDS_PER_DISTRICT}
          totalDataPoints={totalDataPoints}
          comingDistricts={comingDistricts}
          mostRecentAt={mostRecentAt}
        />
        <HeroSection locale={locale} districts={activeDistricts} />
        <LiveDataShowcase locale={locale} districts={activeDistricts} />
        <HowItWorks />
        <ContributorsStrip locale={locale} />
        <VoteFeaturesCTA locale={locale} />
      </main>
    </>
  );
}
