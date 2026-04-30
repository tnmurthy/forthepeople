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
import { SuperCategoryPreviewBand } from "@/components/india/sections/SuperCategoryPreviewBand";
import { getOrderedSuperCategories } from "@/lib/india/india-super-categories";

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

  return (
    <main
      style={{
        background: "var(--color-background)",
        minHeight: "100vh",
        padding: "1.25rem 1rem 3rem",
      }}
    >
      <div style={{ width: "100%" }}>
        <IndiaHero locale={locale} />
        <div style={{ marginTop: "2.5rem" }}>
          {superCategories.map((sc) => (
            <SuperCategoryPreviewBand key={sc.slug} superCategory={sc} locale={locale} />
          ))}
        </div>
      </div>
    </main>
  );
}
