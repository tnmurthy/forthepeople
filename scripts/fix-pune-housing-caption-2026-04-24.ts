/**
 * Pre-push UX polish — extend PMAY-U HousingScheme `source` to include
 * implementation-phase caption.
 *
 * Triggered by Chrome MCP visual audit: /en/maharashtra/pune/housing
 * was rendering "Overall Completion 0.0%" prominently because PMAY-U
 * FY 2026-27 has target 4,725 but sanctioned/completed/inProgress = 0
 * (FY just started April 1, 2026). The 0.0% is accurate but reads as
 * failure to a user comparing to Mandya's 87% completion for FY 2024-25.
 *
 * Fix: extend the `source` field with narrative context so the caption
 * surfaces in the source attribution area below the cards. Does NOT
 * change any numeric data — the 0% display remains, with explanation.
 *
 * IDEMPOTENT. UPDATE by composite key (districtId, schemeName, fiscalYear).
 *
 * Refs: Forthepeople/26-Pune-Pre-Push-Fix-2026-04-24.md
 */

import { PrismaClient } from "../src/generated/prisma";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

const NEW_SOURCE =
  "Pune Municipal Corporation FY 2026-27 Budget — Hadapsar + Wadgaon allocation. " +
  "Implementation begins April 2026 — targets approved, sanctioning and construction " +
  "commence in coming months. For FY 2025-26 completion data, refer to " +
  "pmay-urban.gov.in Pune district dashboard. | " +
  "https://www.thebridgechronicle.com/pune/pune-budget-2026-27-13995-crore-roads-water-infrastructure-merged-villages-agn97";

async function main() {
  const p = new PrismaClient({
    adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }),
  });

  const pune = await p.district.findFirstOrThrow({ where: { slug: "pune" } });

  const existing = await p.housingScheme.findFirst({
    where: { districtId: pune.id, schemeName: "PMAY-U", fiscalYear: "2026-27" },
  });
  if (!existing) {
    console.log("⚠️  PMAY-U FY 2026-27 row not found — run seed-pune-housing.ts first");
    await p.$disconnect();
    process.exit(1);
  }

  await p.housingScheme.update({
    where: { id: existing.id },
    data: { source: NEW_SOURCE },
  });
  console.log("✅ Updated PMAY-U FY 2026-27 source with implementation-phase caption");
  console.log(`   New source length: ${NEW_SOURCE.length} chars`);

  await p.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
