/**
 * ForThePeople.in — Your District. Your Data. Your Right.
 * © 2026 Jayanth M B. MIT License with Attribution.
 * https://github.com/jayanthmb14/forthepeople
 *
 * Session 11.6 — v6 simplification.
 *
 * Body sections (chrome handled by [locale]/layout.tsx — see Session 11.1):
 *   1. FinancialTicker
 *   2. LiveActivityRibbon
 *   3. HeroSection           — map LEFT (55%), text RIGHT (45%), 3-stat row
 *   4. LiveDistrictsList     — flat 10-district grid, NEW badge on 3 newest
 *   5. UpcomingDistricts     — top 2 voted + "Vote for the next district"
 *   6. ContributorsStrip     — flat names + "View all supporters & contribute"
 *   7. VoteFeaturesCTA       — top 3 features + "Vote on features"
 *
 * Six v5 components retired from the homepage but kept on disk for rollback:
 *   DistrictExplorer · LiveDataShowcase · FoundingPatronCard ·
 *   SupporterMarquee · PricingTiers · RequestAndVoteCards
 *
 * Pricing tiers continue to render on /support page from the same
 * source-of-truth (src/lib/razorpay/plans.ts) — homepage just no
 * longer competes with that flow.
 *
 * Pre-edit snapshots: page.v8.tsx
 */

import type { Metadata } from "next";
import { prisma } from "@/lib/db";

import FinancialTicker from "@/components/home/redesign-v2/FinancialTicker";
import LiveActivityRibbon from "@/components/home/redesign-v2/LiveActivityRibbon";
import HeroSection from "@/components/home/redesign-v2/HeroSection";
import LiveDistrictsList from "@/components/home/redesign-v2/LiveDistrictsList";
import UpcomingDistricts from "@/components/home/redesign-v2/UpcomingDistricts";
import ContributorsStrip from "@/components/home/redesign-v2/ContributorsStrip";
import VoteFeaturesCTA from "@/components/home/redesign-v2/VoteFeaturesCTA";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://forthepeople.in";

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
  const [activeRows, voteRequests] = await Promise.all([
    prisma.district.findMany({
      where: { active: true },
      select: {
        slug: true,
        name: true,
        goLiveDate: true,
        state: { select: { slug: true, name: true } },
      },
      orderBy: { name: "asc" },
    }),
    prisma.districtRequest.findMany({
      orderBy: { requestCount: "desc" },
      take: 10,
    }),
  ]);

  const activeDistricts = activeRows.map((d) => ({
    slug: d.slug,
    name: d.name,
    stateSlug: d.state.slug,
    stateName: d.state.name,
    goLiveDate: d.goLiveDate ? d.goLiveDate.toISOString() : null,
  }));

  const activeNamesLower = new Set(
    activeDistricts.map((d) => d.name.toLowerCase()),
  );

  // Top vote requests, excluding districts already active.
  const voteForUpcoming = voteRequests
    .filter((r) => !activeNamesLower.has(r.districtName.toLowerCase()))
    .slice(0, 2)
    .map((r) => ({
      id: r.id,
      stateName: r.stateName,
      districtName: r.districtName,
      requestCount: r.requestCount,
    }));

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
        <LiveActivityRibbon />
        <HeroSection locale={locale} />
        <LiveDistrictsList locale={locale} activeDistricts={activeDistricts} />
        <UpcomingDistricts locale={locale} voteRequests={voteForUpcoming} />
        <ContributorsStrip locale={locale} />
        <VoteFeaturesCTA locale={locale} />
      </main>
    </>
  );
}
