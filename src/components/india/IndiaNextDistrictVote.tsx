/**
 * ForThePeople.in — Your District. Your Data. Your Right.
 * © 2026 Jayanth M B. MIT License with Attribution.
 *
 * "Vote for the next district" block for /[locale]/india.
 *
 * Server component wrapper that fetches DistrictRequest rows, filters
 * out any already-active districts, and feeds the existing
 * NextDistrictLeaderboard client component (do NOT duplicate the
 * leaderboard UI — file 31 §2 + Phase 3 spec say to import + reuse).
 *
 * Mirrors the data layer used by /en/india-detail's existing block so
 * the visual continuity is identical when users land on /en/india after
 * the redirect.
 */

import { prisma } from "@/lib/db";
import {
  NextDistrictLeaderboard,
  type LeaderboardRow,
} from "@/components/home/NextDistrictLeaderboard";
import { INDIA_DESIGN } from "@/lib/india/india-design";

export default async function IndiaNextDistrictVote({ locale }: { locale: string }) {
  const [activeDistricts, requests] = await Promise.all([
    prisma.district.findMany({
      where: { active: true },
      select: { name: true },
    }),
    prisma.districtRequest.findMany({
      orderBy: { requestCount: "desc" },
      take: 20,
    }),
  ]);

  const activeNamesLower = new Set(activeDistricts.map((d) => d.name.toLowerCase()));
  const items: LeaderboardRow[] = requests
    .filter((r) => !activeNamesLower.has(r.districtName.toLowerCase()))
    .slice(0, 3)
    .map((r) => ({
      districtName: r.districtName,
      stateName: r.stateName,
      requestCount: r.requestCount,
    }));

  if (items.length === 0) return null;

  return (
    <section
      style={{
        padding: "16px 16px 8px",
        maxWidth: INDIA_DESIGN.sectionMaxWidth,
        margin: "0 auto",
      }}
    >
      <NextDistrictLeaderboard
        locale={locale}
        items={items}
        seeAllHref={`/${locale}#request`}
      />
    </section>
  );
}
