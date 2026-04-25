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
import { prisma } from "@/lib/db";

const NEW_DISTRICT_DAYS = 45;
const FUTURE_GRACE_MS = 24 * 60 * 60 * 1000;

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

  // Session 5 — bottom inline summaries data (server-side, parallel).
  const [recentDistricts, voteRequests, activeForVoteFilter] = await Promise.all([
    prisma.district.findMany({
      where: { active: true },
      select: {
        slug: true, name: true, goLiveDate: true,
        state: { select: { slug: true } },
      },
    }),
    prisma.districtRequest.findMany({
      orderBy: { requestCount: "desc" },
      take: 20,
    }),
    prisma.district.findMany({
      where: { active: true },
      select: { name: true },
    }),
  ]);

  const recentlyLaunched = recentDistricts
    .filter((d) => {
      if (!d.goLiveDate) return false;
      const ms = Date.now() - d.goLiveDate.getTime();
      return ms >= -FUTURE_GRACE_MS && ms < NEW_DISTRICT_DAYS * 24 * 60 * 60 * 1000;
    })
    .sort((a, b) => (b.goLiveDate?.getTime() ?? 0) - (a.goLiveDate?.getTime() ?? 0))
    .slice(0, 3);

  const activeNamesLower = new Set(activeForVoteFilter.map((d) => d.name.toLowerCase()));
  const voteNext = voteRequests
    .filter((r) => !activeNamesLower.has(r.districtName.toLowerCase()))
    .slice(0, 3);

  return (
    <>
      {/* SEO H1 — visually hidden, essential for page identity */}
      <h1 className="sr-only">
        ForThePeople.in — India&apos;s Citizen Transparency Platform. District-level government data: crop prices, dam levels, schemes, budget, and more.
      </h1>
      <MarketTickerClient />
      <TopTierShowcase locale={locale} />

      {/* Session 5 kicker + India-detail CTA — single subtle line above
          the existing HomepageStats hero (which lives inside HomeDrilldown).
          Restraint pass: stats hero is the visual lead; this is a kicker. */}
      <div style={{ textAlign: "center", padding: "16px 16px 0" }}>
        <h2
          style={{
            margin: 0,
            fontSize: 13,
            fontWeight: 600,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "#374151",
            lineHeight: 1.5,
          }}
          className="md:text-[15px]"
        >
          Your district.{" "}
          <span style={{ color: "#9CA3AF" }}>Your data.</span>{" "}
          <span style={{ color: "#2563EB" }}>Your right.</span>
        </h2>
        <div
          style={{
            marginTop: 10,
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            alignItems: "center",
            gap: 8,
          }}
        >
          {/* India view (existing) */}
          <Link
            href={`/${locale}/india-detail`}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "5px 12px",
              borderRadius: 999,
              background: "#EFF6FF",
              border: "1px solid #BFDBFE",
              color: "#1D4ED8",
              fontSize: 12,
              fontWeight: 500,
              textDecoration: "none",
              minHeight: 28,
            }}
          >
            <span aria-hidden="true">🇮🇳</span>
            View India in one page →
            <NewPill slug="india-detail" />
          </Link>

          {/* Find your district (Session 7) — emerald palette to distinguish
              from the blue India pill; routes to /en#request which scrolls
              to the existing district search/request flow via the global
              hash-scroll Script in src/app/layout.tsx. */}
          <Link
            href={`/${locale}#request`}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "5px 12px",
              borderRadius: 999,
              background: "#F0FDF4",
              border: "1px solid #BBF7D0",
              color: "#15803D",
              fontSize: 12,
              fontWeight: 500,
              textDecoration: "none",
              minHeight: 28,
            }}
          >
            <span aria-hidden="true">📍</span>
            Find your district →
          </Link>
        </div>
      </div>

      <HomeDrilldown locale={locale} tickerShown />

      {/* Session 5 — bottom inline summaries: two single-line strips,
          subordinate to main content. Fetched from Prisma above. */}
      {(recentlyLaunched.length > 0 || voteNext.length > 0) && (
        <section
          style={{
            borderTop: "1px solid #F0F0EC",
            background: "#FAFAF8",
            padding: "16px 0",
          }}
        >
          <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 16px", display: "flex", flexDirection: "column", gap: 10 }}>
            {/* Recently launched */}
            {recentlyLaunched.length > 0 && (
              <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 6, fontSize: 13 }}>
                <span style={{ fontWeight: 600, color: "#374151", marginRight: 2 }}>
                  <span aria-hidden="true">🆕</span> Recently launched:
                </span>
                {recentlyLaunched.map((d, i) => (
                  <span key={d.slug} style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                    <Link
                      href={`/${locale}/${d.state.slug}/${d.slug}`}
                      style={{ color: "#2563EB", textDecoration: "none", fontWeight: 500 }}
                    >
                      {d.name}
                    </Link>
                    {i < recentlyLaunched.length - 1 && (
                      <span style={{ color: "#D1D5DB" }} aria-hidden="true">·</span>
                    )}
                  </span>
                ))}
                <Link
                  href={`/${locale}/india-detail`}
                  style={{ marginLeft: "auto", color: "#6B7280", textDecoration: "none", fontSize: 12 }}
                >
                  View India in one page →
                </Link>
              </div>
            )}
            {/* Vote next */}
            {voteNext.length > 0 && (
              <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 6, fontSize: 13 }}>
                <span style={{ fontWeight: 600, color: "#374151", marginRight: 2 }}>
                  <span aria-hidden="true">🗳️</span> Vote next:
                </span>
                {voteNext.map((r, i) => (
                  <span key={`${r.stateName}-${r.districtName}`} style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                    <span style={{ color: "#1A1A1A" }}>
                      {r.districtName}{" "}
                      <span style={{ color: "#9CA3AF", fontSize: 11, fontFamily: "var(--font-mono, ui-monospace, monospace)" }}>
                        {r.requestCount}
                      </span>
                    </span>
                    {i < voteNext.length - 1 && (
                      <span style={{ color: "#D1D5DB" }} aria-hidden="true">·</span>
                    )}
                  </span>
                ))}
                <Link
                  href={`/${locale}#request`}
                  style={{ marginLeft: "auto", color: "#6B7280", textDecoration: "none", fontSize: 12 }}
                >
                  Request your district →
                </Link>
              </div>
            )}
          </div>
        </section>
      )}

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
