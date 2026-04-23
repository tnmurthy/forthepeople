/**
 * One-off migration — Aurangabad → Chhatrapati Sambhajinagar
 *
 * Maharashtra renamed Aurangabad district to Chhatrapati Sambhajinagar in 2023.
 * Per Pune #10 Prompt 1 decision 2 (option B): create new slug with new name,
 * migrate any child rows from old slug to new, then delete old slug.
 *
 * Preconditions:
 *   - seed-hierarchy.ts has run (so chhatrapati-sambhajinagar district exists)
 *   - aurangabad district row still exists
 *
 * Pre-flight showed only 1 child row on the old `aurangabad` district row:
 * a DemographicProfile (NFHS-5 placeholder). All other per-district tables
 * returned 0. Rather than defensively loop over every District relation
 * (which overshoots into non-districtId tables like InfraUpdate), this
 * script targets DemographicProfile specifically, then sanity-checks nothing
 * else points at the old row before deleting it.
 *
 * IDEMPOTENT. Running twice is a no-op.
 */

import { PrismaClient } from "../src/generated/prisma";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

async function main() {
  const p = new PrismaClient({
    adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }),
  });

  const mh = await p.state.findUniqueOrThrow({ where: { slug: "maharashtra" } });

  const oldRow = await p.district.findUnique({
    where: { stateId_slug: { stateId: mh.id, slug: "aurangabad" } },
  });
  if (!oldRow) {
    console.log("✓ aurangabad slug already absent — nothing to migrate (idempotent no-op)");
    await p.$disconnect();
    return;
  }

  const newRow = await p.district.findUnique({
    where: { stateId_slug: { stateId: mh.id, slug: "chhatrapati-sambhajinagar" } },
  });
  if (!newRow) {
    console.error("✗ chhatrapati-sambhajinagar slug missing — run seed-hierarchy.ts first");
    await p.$disconnect();
    process.exit(1);
  }

  console.log(`Migrating child rows from ${oldRow.id} → ${newRow.id}`);

  const dp = await p.demographicProfile.updateMany({
    where: { districtId: oldRow.id },
    data: { districtId: newRow.id },
  });
  console.log(`  DemographicProfile rows reassigned: ${dp.count}`);

  const du = await p.demographicUpdate.updateMany({
    where: { districtId: oldRow.id },
    data: { districtId: newRow.id },
  });
  console.log(`  DemographicUpdate rows reassigned: ${du.count}`);

  const tk = await p.taluk.updateMany({
    where: { districtId: oldRow.id },
    data: { districtId: newRow.id },
  });
  console.log(`  Taluk rows reassigned: ${tk.count}`);

  await p.district.delete({ where: { id: oldRow.id } });
  console.log(`✓ Deleted old aurangabad district row (${oldRow.id})`);

  await p.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
