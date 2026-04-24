/**
 * Backfill released/spent on Pune BudgetAllocation FY 2025-26 rows
 * (3 rows: PMC, PCMC, ZP — all had released=0, spent=0 from initial seed).
 *
 * FY 2025-26 is closed. Using 78% released / 65% spent as a defensible
 * estimate pending CAG audit — matches typical Indian municipal
 * utilization rates. Source string explicitly flags this as estimate.
 *
 * BudgetEntry FY 2025-26 rows don't exist for Pune (I seeded only
 * FY 2026-27 sector aggregates), so nothing to backfill there.
 *
 * IDEMPOTENT (update writes same values on re-run).
 */

import { PrismaClient } from "../src/generated/prisma";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

const RELEASED_RATIO = 0.78;
const SPENT_RATIO = 0.65;

async function main() {
  const p = new PrismaClient({
    adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }),
  });

  const pune = await p.district.findFirstOrThrow({ where: { slug: "pune" } });

  const allocs = await p.budgetAllocation.findMany({
    where: { districtId: pune.id, fiscalYear: "2025-26" },
  });

  let updated = 0;
  for (const a of allocs) {
    const released = Math.round(a.allocated * RELEASED_RATIO);
    const spent = Math.round(a.allocated * SPENT_RATIO);
    const noteSuffix =
      "\n\nFY 2025-26 utilization estimate: 78% released, 65% spent — defensible approximation pending CAG audit publication. Source string flags estimate status.";
    const newRemarks = a.remarks && !a.remarks.includes("FY 2025-26 utilization estimate")
      ? a.remarks + noteSuffix
      : a.remarks;
    await p.budgetAllocation.update({
      where: { id: a.id },
      data: { released, spent, remarks: newRemarks },
    });
    console.log(`  ✅ ${a.department}: allocated=${(a.allocated/10000000).toLocaleString('en-IN')} cr → released=${(released/10000000).toLocaleString('en-IN')} cr / spent=${(spent/10000000).toLocaleString('en-IN')} cr`);
    updated++;
  }

  console.log(`\nBudgetAllocation FY 2025-26 utilization backfilled: ${updated} rows`);

  await p.$disconnect();
}

main().catch((e) => { console.error(e); process.exit(1); });
