/**
 * Shorten business-name Supporter rows — paid records preserved.
 *
 * Any row whose CURRENT name (or originalName, whichever is the business
 * form) fails the tightened validator (BUSINESS_SUFFIXES) gets its display
 * name shortened:
 *
 *   "SML Finance"       → "SML F."
 *   "Globex Corp"       → "Globex C."
 *   "Apex Ventures"     → "Apex V."
 *   "Solo" (1 word)     → "Sol."
 *
 * nameFlagged remains true; originalName preserves the full business name
 * for admin review. Paid record, tier, amount, paymentId — all untouched.
 *
 * Idempotent.
 */

import { PrismaClient } from "../src/generated/prisma";
import { PrismaPg } from "@prisma/adapter-pg";
import { validateContributorName } from "../src/lib/validators/contributor-name";
import "dotenv/config";

function shortenToInitialForm(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "Anonymous";
  if (parts.length === 1) return parts[0].slice(0, 3) + ".";
  const first = parts[0];
  const second = parts[1];
  const initial = /[\p{L}]/u.test(second[0]) ? second[0].toUpperCase() : second.slice(0, 2);
  return `${first} ${initial}.`;
}

async function main() {
  const p = new PrismaClient({
    adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }),
  });

  // Also catch rows previously flagged as business but whose `name` may already
  // be shortened — originalName is the ground truth for re-evaluation.
  const rows = await p.supporter.findMany();
  let shortened = 0, skipped = 0;

  for (const s of rows) {
    // If the current name already passes, nothing to do.
    const currentOk = validateContributorName(s.name).ok;
    if (currentOk) { skipped++; continue; }

    // Re-evaluate original (or current if no original) to decide shortening.
    const source = (s.originalName ?? s.name).trim();
    const shortName = shortenToInitialForm(source);

    // If already this short form, no-op.
    if (s.name === shortName && s.originalName === source && s.nameFlagged) {
      skipped++;
      continue;
    }

    await p.supporter.update({
      where: { id: s.id },
      data: {
        name: shortName,
        nameFlagged: true,
        originalName: s.originalName ?? source,
      },
    });
    console.log(
      `  ✂️  Shortened: "${source}" → "${shortName}" (id=${s.id}, tier=${s.tier}, ₹${s.amount})`,
    );
    shortened++;
  }

  console.log(
    `\n✓ Shortened ${shortened} business-name records. Skipped ${skipped} ` +
    `(already clean or already shortened). Paid records intact.`,
  );
  await p.$disconnect();
}

main().catch((e) => { console.error(e); process.exit(1); });
