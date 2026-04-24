/**
 * Mark near-duplicate NewsItem rows.
 *
 * Group by district + normalized title prefix (first 40 chars, lowercased,
 * alphanumeric). Within each group, the earliest publishedAt is canonical;
 * later items within 24h get duplicateOf=<canonical.id>.
 *
 * Canonical articles always preserved. Public /api/data/news filter should
 * exclude rows with duplicateOf != null.
 *
 * Idempotent.
 */

import { PrismaClient } from "../src/generated/prisma";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

function normalizePrefix(title: string): string {
  return title.toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 40);
}

async function main() {
  const p = new PrismaClient({
    adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }),
  });

  const all = await p.newsItem.findMany({
    where: { duplicateOf: null },
    orderBy: { publishedAt: "asc" },
    select: { id: true, title: true, districtId: true, publishedAt: true },
  });
  console.log(`Scanning ${all.length} canonical news items for near-duplicates...\n`);

  const DAY_MS = 24 * 60 * 60 * 1000;
  const groups = new Map<string, typeof all>();

  for (const n of all) {
    const prefix = normalizePrefix(n.title);
    if (!prefix || prefix.length < 15) continue;
    const key = `${n.districtId ?? "NULL"}|${prefix}`;
    const arr = groups.get(key) ?? [];
    arr.push(n);
    groups.set(key, arr);
  }

  let dupesMarked = 0, groupsWithDupes = 0;

  for (const [, arr] of groups) {
    if (arr.length < 2) continue;
    arr.sort((a, b) => a.publishedAt.getTime() - b.publishedAt.getTime());
    const canonical = arr[0];
    let marked = 0;
    for (const dupe of arr.slice(1)) {
      const dt = Math.abs(dupe.publishedAt.getTime() - canonical.publishedAt.getTime());
      if (dt > DAY_MS) continue;
      await p.newsItem.update({
        where: { id: dupe.id },
        data: { duplicateOf: canonical.id },
      });
      console.log(
        `  🔁 "${dupe.title.slice(0, 60)}" → canonical "${canonical.title.slice(0, 60)}"`,
      );
      marked++;
    }
    if (marked > 0) { groupsWithDupes++; dupesMarked += marked; }
  }

  console.log(`\n✓ Marked ${dupesMarked} near-duplicates across ${groupsWithDupes} story group(s).`);
  await p.$disconnect();
}

main().catch((e) => { console.error(e); process.exit(1); });
