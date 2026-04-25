/**
 * VOTE FOR THE NEXT DISTRICT band — server component for /en.
 *
 * Wraps the existing presentational NextDistrictLeaderboard (Session 3),
 * fetching DistrictRequest top-3 (excluding already-active districts).
 */

import { prisma } from "@/lib/db";
import { NextDistrictLeaderboard, type LeaderboardRow } from "./NextDistrictLeaderboard";

export async function VoteNextDistrictBand({ locale }: { locale: string }) {
  const [requests, activeDistricts] = await Promise.all([
    prisma.districtRequest.findMany({
      orderBy: { requestCount: "desc" },
      take: 20,
    }),
    prisma.district.findMany({
      where: { active: true },
      select: { name: true },
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
        maxWidth: 1100,
        margin: "0 auto",
      }}
    >
      <NextDistrictLeaderboard
        locale={locale}
        items={items}
        seeAllHref={`/${locale}/features?tab=vote`}
      />
    </section>
  );
}
