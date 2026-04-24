/**
 * ForThePeople.in — Your District. Your Data. Your Right.
 * © 2026 Jayanth M B. MIT License with Attribution.
 * https://github.com/jayanthmb14/forthepeople
 */

import type { Metadata } from "next";
import Link from "next/link";
import HomeDrilldown from "@/components/layout/HomeDrilldown";
import MarketTickerClient from "@/components/layout/MarketTickerClient";
import CompactContributorWallClient from "@/components/support/CompactContributorWallClient";
import TopTierShowcase from "@/components/support/TopTierShowcase";
import { NewPill } from "@/components/ui/NewPill";

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
        "en": `${BASE_URL}/en`,
        "kn": `${BASE_URL}/kn`,
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
  return (
    <>
      {/* SEO H1 — visually hidden, essential for page identity */}
      <h1 className="sr-only">
        ForThePeople.in — India&apos;s Citizen Transparency Platform. District-level government data: crop prices, dam levels, schemes, budget, and more.
      </h1>
      <MarketTickerClient />
      <TopTierShowcase locale={locale} />
      <HomeDrilldown locale={locale} tickerShown />
      <div style={{ textAlign: "center", margin: "4px auto 16px", padding: "0 16px" }}>
        <Link
          href={`/${locale}/india-detail`}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 4,
            fontSize: 13,
            color: "#2563EB",
            textDecoration: "none",
            fontWeight: 500,
          }}
        >
          View India in one page →<NewPill slug="india-detail" />
        </Link>
      </div>
      <div style={{
        maxWidth: 720,
        margin: "4px auto 12px",
        padding: "10px 14px",
        background: "#F5F3FF",
        border: "1px solid #DDD6FE",
        borderRadius: 10,
        fontSize: 13,
        color: "#5B21B6",
        textAlign: "center",
      }}>
        💬 Got an idea for a new feature or spot something wrong?{" "}
        <Link href={`/${locale}/features?tab=suggest`} style={{ color: "#7C3AED", fontWeight: 600, textDecoration: "none" }}>
          Share it with us →
        </Link>
      </div>
      <CompactContributorWallClient />
    </>
  );
}
