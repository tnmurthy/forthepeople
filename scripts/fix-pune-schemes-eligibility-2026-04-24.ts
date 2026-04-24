/**
 * Pre-push UX fix — rewrite the 6 existing Pune Scheme rows' eligibility
 * fields from packed " // " separator format to brief single-line format
 * matching Mumbai/Mandya convention (under ~100 chars each).
 *
 * Triggered by Chrome MCP visual audit of /en/maharashtra/pune/schemes
 * which surfaced literal "// Pune district status: ... // Secondary
 * source: ... // Disclaimer: ..." rendering as scheme eligibility text.
 *
 * IDEMPOTENT. UPDATE by name. If row not found, log warning and skip
 * (does not create a new row).
 *
 * Refs: Forthepeople/26-Pune-Pre-Push-Fix-2026-04-24.md
 */

import { PrismaClient } from "../src/generated/prisma";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

async function main() {
  const p = new PrismaClient({
    adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }),
  });

  const pune = await p.district.findFirstOrThrow({ where: { slug: "pune" } });

  const updates = [
    {
      name: "Pradhan Mantri POSHAN Shakti Nirman (PM POSHAN / Mid-Day Meal)",
      eligibility:
        "Students Class 1-8 in government schools — free mid-day meal, supplementary food weekly",
    },
    {
      name: "Mahatma Gandhi National Rural Employment Guarantee Scheme (MGNREGS)",
      eligibility:
        "Rural households — 100 days guaranteed unskilled manual wage employment per year",
    },
    {
      name: "Ayushman Bharat — Pradhan Mantri Jan Arogya Yojana (AB-PMJAY)",
      eligibility:
        "SECC-identified families + seniors 70+ — ₹5 lakh/year cashless hospital coverage",
    },
    {
      name: "Pradhan Mantri Awas Yojana — Gramin (PMAY-G)",
      eligibility:
        "Rural families without pukka house — ₹1.20 lakh (plains) / ₹1.30 lakh (hilly) construction grant",
    },
    {
      name: "Pradhan Mantri Awas Yojana — Urban (PMAY-U)",
      eligibility:
        "Urban EWS/LIG/MIG households — ₹2.67 lakh subsidy + interest-rate reduction for home purchase",
    },
    {
      name: "Jal Jeevan Mission (JJM) — Har Ghar Jal",
      eligibility:
        "Every rural household — Functional Household Tap Connection with potable water",
    },
  ];

  let updated = 0;
  let skipped = 0;
  for (const u of updates) {
    const existing = await p.scheme.findFirst({
      where: { districtId: pune.id, name: u.name },
    });
    if (!existing) {
      console.log(`  ⚠️  Not found, skipping: ${u.name}`);
      skipped++;
      continue;
    }
    await p.scheme.update({
      where: { id: existing.id },
      data: { eligibility: u.eligibility },
    });
    console.log(`  ✅ Updated: ${u.name}  (${u.eligibility.length} chars)`);
    updated++;
  }

  console.log(`\nSummary: ${updated} updated + ${skipped} skipped = ${updates.length} total target.`);

  await p.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
