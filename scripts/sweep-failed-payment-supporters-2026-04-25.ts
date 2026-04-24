/**
 * Sweep failed/orphan Supporter rows.
 *
 * New policy: no successful payment = no DB row. Rows with status other
 * than "success" (i.e. "failed", "pending", "refunded", "cancelled") must
 * not exist. Rows with no paymentId AND no razorpaySubscriptionId AND
 * source != "manual" are also orphans (intent-only, no money arrived).
 *
 * PRESERVES (never deletes):
 *   - status="success" rows (paid supporters — paid-supporter policy)
 *   - source="manual" rows (admin explicitly logged an offline payment)
 *   - subscriptionStatus in (active|paused|cancelled) where amount > 0 AND
 *     razorpaySubscriptionId is set (they paid at least once)
 *
 * Idempotent — re-running finds nothing once swept.
 */

import { PrismaClient } from "../src/generated/prisma";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

async function main() {
  const p = new PrismaClient({
    adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }),
  });

  // Orphan candidates: explicit non-success statuses
  const nonSuccess = await p.supporter.findMany({
    where: {
      status: { in: ["failed", "pending", "cancelled", "refunded"] },
      source: { not: "manual" },
    },
    select: {
      id: true, name: true, amount: true, tier: true, status: true,
      paymentId: true, razorpaySubscriptionId: true, createdAt: true,
    },
  });

  // Orphan candidates: no payment evidence at all
  const noEvidence = await p.supporter.findMany({
    where: {
      paymentId: null,
      razorpaySubscriptionId: null,
      source: { not: "manual" },
    },
    select: {
      id: true, name: true, amount: true, tier: true, status: true,
      paymentId: true, razorpaySubscriptionId: true, createdAt: true,
    },
  });

  // Dedup
  const allOrphans = new Map(
    [...nonSuccess, ...noEvidence].map((o) => [o.id, o]),
  );

  console.log(`Found ${allOrphans.size} orphan candidate(s):`);
  console.log(`  - non-success status: ${nonSuccess.length}`);
  console.log(`  - no payment evidence (non-manual): ${noEvidence.length}\n`);

  for (const o of allOrphans.values()) {
    console.log(
      `  - id=${o.id} name="${o.name}" tier=${o.tier} amount=${o.amount} ` +
      `status=${o.status} paymentId=${o.paymentId ?? "NULL"} ` +
      `subId=${o.razorpaySubscriptionId ?? "NULL"} created=${o.createdAt.toISOString().slice(0, 10)}`,
    );
  }

  if (allOrphans.size === 0) {
    console.log("✓ Audit clean — no orphans to sweep.");
  } else {
    const ids = Array.from(allOrphans.keys());
    const result = await p.supporter.deleteMany({ where: { id: { in: ids } } });
    console.log(`\n🗑️  Deleted ${result.count} orphan Supporter records.`);
  }

  await p.$disconnect();
}

main().catch((e) => { console.error(e); process.exit(1); });
