/**
 * Clean up Supporter rows whose "name" fails the validator.
 *
 * Strategy per row:
 *   - Try to salvage the first valid letter-sequence prefix (e.g. "SML Finance
 *     |14.5% p.a" → "SML Finance"). If that prefix itself passes validation,
 *     save it and set nameFlagged=true + originalName.
 *   - Otherwise anonymize to "Anonymous" + nameFlagged=true + originalName.
 *
 * Admin can later review flagged rows at /admin/contributors-flagged and
 * either approve, edit, or delete.
 *
 * Idempotent — subsequent runs only touch rows that still fail validation.
 */

import { PrismaClient } from "../src/generated/prisma";
import { PrismaPg } from "@prisma/adapter-pg";
import { validateContributorName } from "../src/lib/validators/contributor-name";
import "dotenv/config";

async function main() {
  const p = new PrismaClient({
    adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }),
  });

  const all = await p.supporter.findMany();
  let flagged = 0, salvaged = 0, anonymized = 0, alreadyClean = 0;

  for (const c of all) {
    const result = validateContributorName(c.name);
    if (result.ok) { alreadyClean++; continue; }

    flagged++;

    // Emails-as-names: don't salvage ("void@razorpay.com" → "void" is worse UX
    // than just "Anonymous"). Treat any row whose original name contained "@"
    // as unsalvageable.
    const isEmailAsName = c.name.includes("@");

    // Try salvage: first letter-run (up to 40 chars) that independently passes validation.
    // Require salvaged candidate to be at least 3 chars AND contain a space
    // OR be a known first-name-ish token (>= 3 chars). Short fragments like
    // "iamv" from "iamv1n" are worse UX than "Anonymous".
    const salvageMatch = isEmailAsName ? null : c.name.match(/[\p{L}][\p{L}\s.\-']{1,39}/u);
    const candidate = salvageMatch?.[0].trim();
    const candidateOk = candidate && candidate.length >= 3 && validateContributorName(candidate).ok;

    if (candidateOk) {
      await p.supporter.update({
        where: { id: c.id },
        data: { name: candidate!, nameFlagged: true, originalName: c.name },
      });
      console.log(`  🧹 SALVAGE  "${c.name}" → "${candidate}"`);
      salvaged++;
    } else {
      await p.supporter.update({
        where: { id: c.id },
        data: { name: "Anonymous", nameFlagged: true, originalName: c.name },
      });
      console.log(`  👻 ANON     "${c.name}" → "Anonymous"`);
      anonymized++;
    }
  }

  console.log(
    `\nSupporter name cleanup:\n` +
    `  clean-already: ${alreadyClean}\n` +
    `  flagged:       ${flagged}\n` +
    `  ├─ salvaged:   ${salvaged}\n` +
    `  └─ anonymized: ${anonymized}\n` +
    `  total:         ${all.length}`
  );

  await p.$disconnect();
}

main().catch((e) => { console.error(e); process.exit(1); });
