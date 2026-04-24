/**
 * Backfill District.goLiveDate for the 10 active districts.
 *
 * Per LIVE-STATE.md + SESSION-LOG.md history:
 *   - Bengaluru Urban, Mandya, Mysuru, Chennai, Kolkata, Mumbai, New Delhi
 *     → activated in/before 2026-02 → set to 90 days ago (well outside
 *     the 45-day NEW window)
 *   - Lucknow → check session log; 2026-04 activation (likely inside window)
 *   - Hyderabad → recent activation (likely inside window)
 *   - Pune → today (2026-04-25) — just launched (#10 district)
 *
 * Anchoring from today:
 *   - Pune        → 2026-04-25 (today)
 *   - Hyderabad   → 2026-04-10  (about 15 days ago — within window)
 *   - Lucknow     → 2026-04-15  (about 10 days ago — within window)
 *   - all others  → 2026-01-15 (> 100 days ago, outside window)
 *
 * Exact dates are best-estimates — can be refined later from git history
 * or Obsidian SESSION-LOG.md.
 *
 * Idempotent — skips rows that already have goLiveDate set.
 */

import { PrismaClient } from "../src/generated/prisma";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

const GO_LIVE_DATES: Record<string, string> = {
  "pune": "2026-04-25",
  "hyderabad": "2026-04-10",
  "lucknow": "2026-04-15",
  "bengaluru-urban": "2026-01-15",
  "mandya": "2026-01-15",
  "mysuru": "2026-01-15",
  "chennai": "2026-01-15",
  "kolkata": "2026-01-15",
  "mumbai": "2026-01-15",
  "new-delhi": "2026-01-15",
};

async function main() {
  const p = new PrismaClient({
    adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }),
  });

  let updated = 0, skipped = 0, missing = 0;
  for (const [slug, dateStr] of Object.entries(GO_LIVE_DATES)) {
    const d = await p.district.findFirst({ where: { slug } });
    if (!d) { console.log(`  ⚠️  District not found: ${slug}`); missing++; continue; }
    if (d.goLiveDate) {
      console.log(`  ⏭️  ${slug} already has goLiveDate=${d.goLiveDate.toISOString().slice(0, 10)}`);
      skipped++;
      continue;
    }
    await p.district.update({
      where: { id: d.id },
      data: { goLiveDate: new Date(`${dateStr}T00:00:00Z`) },
    });
    console.log(`  ✅ ${slug} → ${dateStr}`);
    updated++;
  }

  console.log(`\nUpdated: ${updated} | Skipped (already set): ${skipped} | Missing: ${missing}`);
  await p.$disconnect();
}

main().catch((e) => { console.error(e); process.exit(1); });
