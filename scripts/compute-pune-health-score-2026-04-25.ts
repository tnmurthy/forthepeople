/**
 * Compute and store DistrictHealthScore for Pune.
 *
 * Why: Pune launched 2026-04-25 but the nightly/weekly health-score cron
 * hadn't run against it yet, leaving the /en/india tile without a grade
 * badge. This triggers the same calculation path other districts use,
 * via calculateDistrictHealthScore(districtId).
 *
 * Idempotent — the function upserts DistrictHealthScore by districtId.
 * Running again simply recomputes from current DB state.
 */

import { PrismaClient } from "../src/generated/prisma";
import { PrismaPg } from "@prisma/adapter-pg";
import { calculateDistrictHealthScore } from "../src/lib/health-score";
import "dotenv/config";

async function main() {
  const p = new PrismaClient({
    adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }),
  });

  const pune = await p.district.findFirstOrThrow({ where: { slug: "pune" } });
  console.log(`Computing DistrictHealthScore for ${pune.name} (${pune.id})...`);

  await calculateDistrictHealthScore(pune.id);

  const result = await p.districtHealthScore.findUnique({ where: { districtId: pune.id } });
  console.log(`✓ Computed: grade=${result?.grade} overall=${result?.overallScore}`);

  await p.$disconnect();
}

main().catch((e) => { console.error(e); process.exit(1); });
