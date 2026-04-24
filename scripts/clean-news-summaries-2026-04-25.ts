/**
 * Clean NewsItem.summary fields.
 *
 * Google News RSS uses the description pattern:
 *   "<title>&nbsp;&nbsp;<PublisherName>"
 *
 * which gets stored verbatim as summary. After stripping the publisher
 * suffix, the remaining text often equals the title (duplicate rendering).
 *
 * This script:
 *   1. Extracts the publisher to NewsItem.publisher
 *   2. Clears summary if normalized(cleaned) equals normalized(title)
 *   3. Preserves the raw pre-clean value in originalSummary for audit
 *
 * Idempotent.
 */

import { PrismaClient } from "../src/generated/prisma";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

function extractPublisher(summary: string | null): { publisher: string | null; cleaned: string | null } {
  if (!summary) return { publisher: null, cleaned: null };
  const patterns: RegExp[] = [
    /&nbsp;&nbsp;(.+?)$/,
    /  (.+?)$/,
    /\s{2,}(.+?)$/,
  ];
  for (const pat of patterns) {
    const m = summary.match(pat);
    if (m) {
      const pub = m[1].trim();
      const cleaned = summary.replace(pat, "").trim();
      return { publisher: pub || null, cleaned: cleaned || null };
    }
  }
  return { publisher: null, cleaned: summary.trim() || null };
}

function normalizeTitle(s: string): string {
  return s.toLowerCase()
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
  });
  console.log(`Inspecting ${all.length} news items (non-dupes only)...\n`);

  let cleanedCount = 0, publishersCaught = 0, skipped = 0;

  for (const n of all) {
    const { publisher, cleaned: cleanedSum } = extractPublisher(n.summary);

    // If we already processed (originalSummary present) skip unless publisher missing.
    if (n.originalSummary && n.publisher) { skipped++; continue; }

    const titleDuplicate = n.title && cleanedSum
      && normalizeTitle(cleanedSum) === normalizeTitle(n.title);
    const finalSummary = titleDuplicate ? null : cleanedSum;

    const needsUpdate =
      (publisher && publisher !== n.publisher) ||
      (finalSummary !== n.summary) ||
      (!n.originalSummary && n.summary);

    if (!needsUpdate) { skipped++; continue; }

    await p.newsItem.update({
      where: { id: n.id },
      data: {
        publisher: publisher ?? n.publisher ?? null,
        summary: finalSummary,
        originalSummary: n.originalSummary ?? n.summary ?? null,
      },
    });
    if (finalSummary !== n.summary) cleanedCount++;
    if (publisher) publishersCaught++;
  }

  console.log(`✓ Summaries cleaned (title-dupe or altered): ${cleanedCount}`);
  console.log(`✓ Publishers extracted: ${publishersCaught}`);
  console.log(`✓ Skipped (already processed or no change): ${skipped}`);
  await p.$disconnect();
}

main().catch((e) => { console.error(e); process.exit(1); });
