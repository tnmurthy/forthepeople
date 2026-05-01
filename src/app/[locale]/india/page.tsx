/**
 * ForThePeople.in — Your District. Your Data. Your Right.
 * © 2026 Jayanth M B. MIT License with Attribution.
 *
 * /[locale]/india — National Dashboard (Phase 4 redesign).
 *
 * Server-rendered. The hero + 10 super-category preview bands replace
 * the prior IndiaPage rendering. Layout chrome (HeaderBar, Footer,
 * site-wide DisclaimerBanner) is provided by [locale]/layout.tsx.
 *
 * Page-level ISR window: 15 min — re-evaluated whenever the snapshot
 * cache (Redis, file 31 §17) misses.
 */

import type { Metadata } from "next";
import { IndiaHero } from "@/components/india/sections/IndiaHero";
import { IndiaKpiStrip } from "@/components/india/sections/IndiaKpiStrip";
import { IndiaInTheWorldCard } from "@/components/india/sections/IndiaInTheWorldCard";
import { SuperCategoryPreviewBand } from "@/components/india/sections/SuperCategoryPreviewBand";
import { ScrollProgressBar } from "@/components/india/primitives/ScrollProgressBar";
import { IndiaBreadcrumb } from "@/components/india/primitives/IndiaBreadcrumb";
import { PageEntryCurtain } from "@/components/india/primitives/PageEntryCurtain";
import { ScrollColorShift } from "@/components/india/primitives/ScrollColorShift";
import { MughalArchDivider } from "@/components/india/primitives/MughalArchDivider";
import {
  TricolorBadgesPanel,
  TricolorBadgesFooter,
} from "@/components/india/primitives/TricolorBadgesPanel";
import { LiveStrip } from "@/components/india/sections/LiveStrip";
import {
  getOrderedSuperCategories,
  getModulesForSuperCategory,
} from "@/lib/india/india-super-categories";
import { INDIA_MODULES } from "@/lib/india/india-modules";
import enDict from "@/dictionaries/en.json";
import knDict from "@/dictionaries/kn.json";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://forthepeople.in";

export const revalidate = 900; // 15 min

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const url = `${BASE_URL}/${locale}/india`;
  return {
    title: "India in One Page · ForThePeople.in",
    description:
      "Free national dashboard of India indicators — sourced from official " +
      "government portals under NDSAP. Independent citizen platform.",
    alternates: {
      canonical: url,
      languages: {
        en: `${BASE_URL}/en/india`,
        kn: `${BASE_URL}/kn/india`,
      },
    },
    openGraph: { url, title: "India in One Page · ForThePeople.in" },
  };
}

export default async function IndiaRoute({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const superCategories = getOrderedSuperCategories();

  // Map super-category slug → ScrollColorShift tint id (file 48 §Section 2.2).
  const TINT_BY_SC: Record<string, string> = {
    "macro-snapshot": "macro",
    "know-india": "know",
    "living-standards": "living",
    "wildlife-forests": "wildlife",
    "agriculture-livestock": "agriculture",
    "natural-resources-energy": "natural",
    infrastructure: "infra",
    governance: "governance",
    innovation: "innovation",
    culture: "culture",
  };
  const dict = locale === "kn" ? knDict : enDict;
  const indiaDict = (
    dict as {
      india?: {
        breadcrumb?: { home: string; india: string; selectModule: string };
        hero?: { eyebrow: string; motto: string; readPreamble: string };
      };
    }
  ).india;
  const breadcrumbDict = indiaDict?.breadcrumb;
  const heroDict = indiaDict?.hero;

  return (
    <main
      style={{
        // Background lives on <body> via var(--ftp-page-tint) so the
        // ScrollColorShift can transition it as the user scrolls.
        minHeight: "100vh",
        paddingBottom: "3rem",
      }}
    >
      {/* First-visit-per-session entrance curtain (saffron + green panels). */}
      <PageEntryCurtain />

      {/* Invisible client component — listens to which [data-tint-id] section
          is closest to viewport center and swaps --ftp-page-tint accordingly. */}
      <ScrollColorShift />

      {/* Sticky breadcrumb (top:56) + sticky scroll-progress bar (top:100). Both
          live above the inner padded container so they span the full viewport. */}
      <IndiaBreadcrumb locale={locale} dict={breadcrumbDict} />
      <ScrollProgressBar />

      <div style={{ width: "100%", padding: "1rem 1rem 0" }}>
        <LiveStrip />
        <div data-tint-id="hero">
          <IndiaHero locale={locale} dict={heroDict} />
        </div>

        {/* Order per file 48 §Section 2.1: hero → tricolor badges (full-width
            horizontal strip) → KPI strip → "India in the world" rankings →
            10 super-category bands. The badges panel + KPI + rankings used
            to live inside IndiaHero; v10 makes them siblings so the badges
            occupy the full row instead of a 320px right column. */}
        <div style={{ marginTop: "12px" }}>
          <TricolorBadgesPanel />
          <TricolorBadgesFooter locale={locale} />
        </div>

        <MughalArchDivider />

        <div style={{ marginTop: "1rem" }}>
          <IndiaKpiStrip />
        </div>

        <MughalArchDivider />

        <IndiaInTheWorldCard />

        <MughalArchDivider />

        <div style={{ marginTop: "2.5rem" }}>
          {superCategories.map((sc, i) => (
            <div
              key={sc.slug}
              data-tint-id={TINT_BY_SC[sc.slug] ?? sc.slug}
            >
              <SuperCategoryPreviewBand
                superCategory={sc}
                modules={getModulesForSuperCategory(sc.slug, INDIA_MODULES)}
                bandIndex={i}
                locale={locale}
              />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
