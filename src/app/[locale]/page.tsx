/**
 * ForThePeople.in — Your District. Your Data. Your Right.
 * © 2026 Jayanth M B. MIT License with Attribution.
 * https://github.com/jayanthmb14/forthepeople
 *
 * Session 11 — homepage redesign-v2 swap.
 *
 * IMPORTANT — chrome strategy:
 *   The layout-level chrome (DisclaimerBar + Header + Footer) in
 *   src/app/[locale]/layout.tsx is INTENTIONALLY PRESERVED. The
 *   redesign-v2 DisclaimerBanner / HeaderBar / Footer are built and
 *   ready to swap into the layout, but doing so here would either (a)
 *   double-render banners on this page or (b) regress district pages
 *   that depend on the legacy Header. A future cleanup commit elevates
 *   them to the layout once district pages are also re-themed.
 *
 *   So this swap replaces only the BODY of the homepage. Visitors to /en
 *   see: legacy DisclaimerBar + legacy Header + new redesign-v2 body
 *   (FinancialTicker → LiveActivityRibbon → Hero → Explorer →
 *    LiveDataShowcase → FoundingPatron → SupporterMarquee → Pricing →
 *    RequestAndVote) + legacy Footer.
 *
 * Pre-edit snapshot: src/app/[locale]/page.v8.tsx
 */

import type { Metadata } from "next";
import { prisma } from "@/lib/db";

import FinancialTicker from "@/components/home/redesign-v2/FinancialTicker";
import LiveActivityRibbon from "@/components/home/redesign-v2/LiveActivityRibbon";
import HeroSection from "@/components/home/redesign-v2/HeroSection";
import DistrictExplorer from "@/components/home/redesign-v2/DistrictExplorer";
import LiveDataShowcase from "@/components/home/redesign-v2/LiveDataShowcase";
import FoundingPatronCard from "@/components/home/redesign-v2/FoundingPatronCard";
import SupporterMarquee from "@/components/home/redesign-v2/SupporterMarquee";
import PricingTiers from "@/components/home/redesign-v2/PricingTiers";
import RequestAndVoteCards from "@/components/home/redesign-v2/RequestAndVoteCards";

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
        nameLocal: true,
        tagline: true,
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
    nameLocal: d.nameLocal,
    tagline: d.tagline,
    stateSlug: d.state.slug,
    stateName: d.state.name,
    goLiveDate: d.goLiveDate ? d.goLiveDate.toISOString() : null,
  }));

  const activeNamesLower = new Set(
    activeDistricts.map((d) => d.name.toLowerCase()),
  );

  // Vote requests for the explorer — exclude districts already active.
  const voteForExplorer = voteRequests
    .filter((r) => !activeNamesLower.has(r.districtName.toLowerCase()))
    .slice(0, 3)
    .map((r) => ({
      id: r.id,
      stateName: r.stateName,
      districtName: r.districtName,
      requestCount: r.requestCount,
    }));

  // LiveDataShowcase wants a stable order — most-recently launched first.
  const showcaseDistricts = [...activeDistricts]
    .sort((a, b) => {
      const ax = a.goLiveDate ? new Date(a.goLiveDate).getTime() : 0;
      const bx = b.goLiveDate ? new Date(b.goLiveDate).getTime() : 0;
      return bx - ax;
    })
    .slice(0, 8);

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
        <DistrictExplorer
          locale={locale}
          activeDistricts={activeDistricts}
          voteRequests={voteForExplorer}
        />
        <LiveDataShowcase locale={locale} districts={showcaseDistricts} />
        <FoundingPatronCard />
        <SupporterMarquee locale={locale} />
        <PricingTiers locale={locale} />
        <RequestAndVoteCards locale={locale} />
      </main>
    </>
  );
}
