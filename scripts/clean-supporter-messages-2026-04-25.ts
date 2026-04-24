/**
 * Clear spam messages on Supporter rows.
 *
 * Paid-supporter policy: NEVER delete a paid record. For messages that fail
 * the validator (promotional content, phone numbers, interest rates, URLs),
 * set message=null + messageFlagged=true and preserve the original in
 * originalMessage for admin review.
 *
 * Idempotent — subsequent runs only touch rows whose current message still
 * fails validation.
 */

import { PrismaClient } from "../src/generated/prisma";
import { PrismaPg } from "@prisma/adapter-pg";
import { validateSupporterMessage } from "../src/lib/validators/supporter-message";
import "dotenv/config";

async function main() {
  const p = new PrismaClient({
    adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }),
  });

  const rows = await p.supporter.findMany({
    where: { message: { not: null } },
    select: { id: true, name: true, tier: true, amount: true, message: true, originalMessage: true },
  });

  console.log(`Inspecting ${rows.length} Supporter rows with non-null messages...\n`);

  let cleared = 0, kept = 0;
  for (const r of rows) {
    const result = validateSupporterMessage(r.message);
    if (result.ok) { kept++; continue; }

    await p.supporter.update({
      where: { id: r.id },
      data: {
        message: null,
        messageFlagged: true,
        originalMessage: r.originalMessage ?? r.message,
      },
    });
    console.log(
      `  🧹 Cleared message for ${r.name} (tier=${r.tier}, ₹${r.amount}) — reason: ${result.reason.slice(0, 80)}`,
    );
    console.log(`     original: "${r.message?.slice(0, 120)}"`);
    cleared++;
  }

  console.log(
    `\n✓ Cleared ${cleared} spam messages. Kept ${kept} clean messages. ` +
    `All records + tiers + paymentIds intact.`,
  );
  await p.$disconnect();
}

main().catch((e) => { console.error(e); process.exit(1); });
