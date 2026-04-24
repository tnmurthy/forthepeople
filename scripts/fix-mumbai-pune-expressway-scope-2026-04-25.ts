/**
 * Fix Mumbai-Pune Expressway cross-state leak.
 *
 * Audit found 5 duplicate rows — Mumbai, Pune, Kolkata, Chennai, Mandya —
 * each with scope="NATIONAL". The Kolkata/Chennai/Mandya anchors are
 * cross-state leaks (projects that aren't in those states at all).
 *
 * InfraProject schema has NO stateId field — scope is STATE/NATIONAL/DISTRICT
 * + districtId. The state-aware surfacing is done at UI level via the
 * district's state relation.
 *
 * Fix:
 *   1. Delete the 3 cross-state duplicates (Kolkata, Chennai, Mandya).
 *   2. Retain Mumbai + Pune anchors (both legitimate endpoints of the
 *      expressway).
 *   3. Change scope NATIONAL → STATE on the remaining 2 rows.
 *
 * Idempotent — finds by exact slug + current scope + current name.
 */

import { PrismaClient } from "../src/generated/prisma";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

const LEAK_DISTRICT_SLUGS = ["kolkata", "chennai", "mandya"];
const KEEP_DISTRICT_SLUGS = ["mumbai", "pune"];
const NAME_MATCH = "Mumbai–Pune Expressway"; // en-dash (U+2013)

async function main() {
  const p = new PrismaClient({
    adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }),
  });

  // Step 1: Delete cross-state leaks.
  const leakDistricts = await p.district.findMany({
    where: { slug: { in: LEAK_DISTRICT_SLUGS } },
    select: { id: true, slug: true },
  });
  const leakIds = leakDistricts.map((d) => d.id);

  const toDelete = await p.infraProject.findMany({
    where: { name: NAME_MATCH, districtId: { in: leakIds } },
    select: { id: true, districtId: true },
  });

  for (const row of toDelete) {
    await p.infraProject.delete({ where: { id: row.id } });
    const d = leakDistricts.find((x) => x.id === row.districtId);
    console.log(`  🗑️  Deleted leak: "${NAME_MATCH}" from ${d?.slug ?? row.districtId}`);
  }

  // Step 2: Change scope NATIONAL → STATE on the kept anchors.
  const keepDistricts = await p.district.findMany({
    where: { slug: { in: KEEP_DISTRICT_SLUGS } },
    select: { id: true, slug: true },
  });
  const keepIds = keepDistricts.map((d) => d.id);

  const toUpdate = await p.infraProject.findMany({
    where: { name: NAME_MATCH, districtId: { in: keepIds }, scope: "NATIONAL" },
    select: { id: true, districtId: true, scope: true },
  });

  for (const row of toUpdate) {
    await p.infraProject.update({
      where: { id: row.id },
      data: { scope: "STATE" },
    });
    const d = keepDistricts.find((x) => x.id === row.districtId);
    console.log(`  ✅ Updated: "${NAME_MATCH}" on ${d?.slug ?? row.districtId}: scope NATIONAL → STATE`);
  }

  console.log(`\nDeleted: ${toDelete.length} cross-state leaks | Updated: ${toUpdate.length} anchors → STATE`);
  await p.$disconnect();
}

main().catch((e) => { console.error(e); process.exit(1); });
