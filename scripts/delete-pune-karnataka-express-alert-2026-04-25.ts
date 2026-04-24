/**
 * Delete the irrelevant "Karnataka Express" alert scraped to Pune.
 * Pune scraper will refill with genuine Pune alerts over time.
 */

import { PrismaClient } from "../src/generated/prisma";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

async function main() {
  const p = new PrismaClient({
    adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }),
  });

  const pune = await p.district.findFirstOrThrow({ where: { slug: "pune" } });
  const matches = await p.localAlert.findMany({
    where: {
      districtId: pune.id,
      OR: [
        { title: { contains: "Karnataka Express", mode: "insensitive" } },
        { description: { contains: "Karnataka Express", mode: "insensitive" } },
      ],
    },
    select: { id: true, title: true },
  });

  for (const m of matches) {
    console.log(`  🗑️  Deleting: "${m.title}"`);
    await p.localAlert.delete({ where: { id: m.id } });
  }

  console.log(`\nDeleted ${matches.length} irrelevant alert(s) from Pune.`);
  await p.$disconnect();
}

main().catch((e) => { console.error(e); process.exit(1); });
