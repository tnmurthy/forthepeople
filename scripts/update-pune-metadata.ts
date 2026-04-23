/**
 * One-off metadata fix for Pune District.
 *
 * The hierarchy upsert uses `update: { active: def.active }` which doesn't
 * overwrite numeric fields on already-existing rows. Pune pre-dated the
 * upsert so its population/area/etc stayed null. This script fills them.
 *
 * IDEMPOTENT. Running twice just re-sets the same values.
 *
 * Field mapping (user spec → schema):
 *   literacyRate → literacy  (schema uses short name)
 * Skipped (no schema column — flag for potential Phase 2 schema expansion):
 *   urbanPct, ruralPct, districtCode, households, gramPanchayats,
 *   panchayatSamitis.
 *
 * Source: Census of India 2011 + pune.gov.in district profile.
 */

import { PrismaClient } from "../src/generated/prisma";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

async function main() {
  const p = new PrismaClient({
    adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }),
  });

  const mh = await p.state.findUniqueOrThrow({ where: { slug: "maharashtra" } });

  const result = await p.district.update({
    where: { stateId_slug: { stateId: mh.id, slug: "pune" } },
    data: {
      population: 9429408,
      area: 15643,
      sexRatio: 915,
      literacy: 86.15,
      density: 603,
      talukCount: 14,
      villageCount: 1866,
      // Source: India Meteorological Department (IMD) Pune regional center
      // https://mausam.imd.gov.in/pune/
      avgRainfall: 722,
    },
  });

  console.log("Pune metadata updated:");
  console.log(
    `  pop=${result.population?.toLocaleString()}  area=${result.area}  sexRatio=${result.sexRatio}  literacy=${result.literacy}  density=${result.density}  taluks=${result.talukCount}  villages=${result.villageCount}`,
  );

  await p.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
