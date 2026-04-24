/**
 * Pune schools UX fix — rewrite the 8 existing School rows' `address`
 * fields from packed multi-`//` separator format to brief one-line
 * descriptions matching Mumbai/Mandya convention.
 *
 * Triggered by Chrome MCP audit; same root cause as earlier scheme
 * eligibility fix — Phase 5 schema-gap workaround that packed
 * description + sources + disclaimer into one text field.
 *
 * IDEMPOTENT. UPDATE by name; if not found, log warning and skip.
 *
 * Refs: Forthepeople/27-Pune-Module-Population-2026-04-24.md
 */

import { PrismaClient } from "../src/generated/prisma";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

async function main() {
  const p = new PrismaClient({
    adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }),
  });
  const pune = await p.district.findFirstOrThrow({ where: { slug: "pune" } });

  const updates = [
    {
      name: "Savitribai Phule Pune University (SPPU)",
      address:
        "Ganeshkhind, Pune 411007 | Founded 1949. State public research university. ~475 affiliated colleges across Pune and 4 neighbouring districts.",
    },
    {
      name: "Fergusson College",
      address:
        "Fergusson College Road, Shivajinagar, Pune 411004 | Founded 1885. Autonomous (Deccan Education Society). Arts & Science. Alumni: Tilak, Gokhale, Savarkar.",
    },
    {
      name: "College of Engineering, Pune (COEP Technological University)",
      address:
        "Wellesley Road, Shivajinagar, Pune 411005 | Founded 1854. Autonomous technological university. ~3,500 students. One of India's oldest engineering colleges.",
    },
    {
      name: "Film and Television Institute of India (FTII)",
      address:
        "Law College Road, Pune 411004 | Founded 1960. Government of India film & TV training institute. ~100 students per year.",
    },
    {
      name: "National Defence Academy (NDA)",
      address:
        "Khadakwasla, Pune 411023 | Founded 1954. Tri-service Armed Forces training academy. ~1,800 cadets in 3-year inter-service course.",
    },
    {
      name: "Pune Zilla Parishad — Primary Education Department",
      address:
        "ZP Pune, Shivaji Road | 3,546 primary schools (Classes 1-7) across 14 talukas. 238,395 students. Mid-day meal + free textbooks + free uniforms.",
    },
    {
      name: "Pune Zilla Parishad — Secondary Education Department",
      address:
        "ZP Pune, Shivaji Road | Manages govt-approved secondary schools: aided, unaided, permanently unaided, self-financed. Standards 5-12, multiple mediums.",
    },
    {
      name: "Pune Municipal Corporation — Education Department",
      address:
        "PMC HQ, Shivajinagar, Pune 411005 | Operates primary and secondary schools across 15 ward offices. CBSE syllabus adoption announced.",
    },
  ];

  let updated = 0;
  let skipped = 0;
  for (const u of updates) {
    const existing = await p.school.findFirst({
      where: { districtId: pune.id, name: u.name },
    });
    if (!existing) {
      console.log(`  ⚠️  not found, skipping: ${u.name}`);
      skipped++;
      continue;
    }
    await p.school.update({ where: { id: existing.id }, data: { address: u.address } });
    console.log(`  ✅ ${u.name}  (${u.address.length} chars)`);
    updated++;
  }
  console.log(`Schools rewritten: updated=${updated} skipped=${skipped}`);

  await p.$disconnect();
}

main().catch((e) => { console.error(e); process.exit(1); });
