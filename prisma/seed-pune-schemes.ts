/**
 * Pune government schemes seed — 6 central + central-state schemes with
 * Pune district-level status (Prompt 5/6, Seed D).
 *
 * ForThePeople.in — independent citizen platform by Jayanth M B.
 *
 * MODEL: Scheme (not HousingScheme). Scheme is the generic-purpose model
 * Mumbai uses (10 rows). HousingScheme requires per-fiscal-year sanctioned/
 * completed/in-progress Int counts which I do not have verified Pune figures
 * for, so PMAY-U and PMAY-G are seeded as Scheme rows with category="Housing"
 * to avoid fabricating HousingScheme counts.
 *
 * FIELD MAPPING (prompt → schema):
 *   schemeName        → name
 *   category          → category (free-text; matches Mumbai conventions)
 *   level             → level  ("CENTRAL" for central / central-state schemes,
 *                                matching Mumbai's mixed-case use of CENTRAL/STATE)
 *   unitSubsidy*      → amount (primary subsidy value)
 *   beneficiaryCount  → beneficiaryCount (where verified)
 *   puneDistrictStatus + eligibility → eligibility (packed prose)
 *   source            → source ("Publication | URL" primary)
 *   sourceSecondary   → packed into eligibility
 *   disclaimer        → packed into eligibility
 *   applyUrl          → applyUrl (official portal)
 *
 * Schema gap noted: Scheme has no separate description/sourceSecondary/
 * disclaimer fields. Packing into `eligibility` is a pragmatic workaround
 * that keeps `source` clean as primary.
 *
 * IDEMPOTENT. Uses findFirst({districtId, name}) → skip-if-exists.
 */

import { PrismaClient } from "../src/generated/prisma";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

function makeClient() {
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
  return new PrismaClient({ adapter });
}

type DBClient = ReturnType<typeof makeClient>;

type SchemeRec = {
  name: string;
  category: string;
  level: string;
  amount?: number;
  beneficiaryCount?: number;
  eligibility: string; // packed: eligibility + Pune status + secondary + disclaimer
  applyUrl?: string;
  source: string;
};

const RECORDS: SchemeRec[] = [
  // ── 1. PMAY-U ─────────────────────────────────────────────
  {
    name: "Pradhan Mantri Awas Yojana — Urban (PMAY-U)",
    category: "Housing",
    level: "CENTRAL",
    amount: 267000, // ₹2.67 lakh combined EWS subsidy + CLSS
    eligibility: [
      "Beneficiaries: EWS, LIG, MIG-I, MIG-II categories. Interest subsidies 6.5% (EWS/LIG), 4% (MIG-I), 3% (MIG-II). Ownership promoted in name of female members.",
      "Pune district status: PMC FY 2026-27 budget allocates construction of 4,725 houses under PMAY in Hadapsar and Wadgaon. 32 merged villages (2017) and 23 merged villages (2021) are priority expansion zones. Angikaar 2025 campaign (launched Sept 17, 2025) fast-tracks verification and completion.",
      "Secondary source: PMC FY 2026-27 Budget | https://www.thebridgechronicle.com/pune/pune-budget-2026-27-13995-crore-roads-water-infrastructure-merged-villages-agn97",
      "Disclaimer: Launched June 25, 2015; extended via PMAY-U 2.0 (Aug 2024) targeting 1 crore urban houses through FY 2029. Pune district-level beneficiary counts vary monthly — refer to pmay-urban.gov.in state/district dashboard for real-time status.",
    ].join(" // "),
    applyUrl: "https://pmay-urban.gov.in/",
    source: "PMAY Urban Official | https://pmay-urban.gov.in/",
  },

  // ── 2. PMAY-G ─────────────────────────────────────────────
  {
    name: "Pradhan Mantri Awas Yojana — Gramin (PMAY-G)",
    category: "Housing",
    level: "CENTRAL",
    amount: 120000, // ₹1.20 lakh plains area unit subsidy
    eligibility: [
      "Per-household grant: ₹1.20 lakh plains (₹1.30 lakh hilly/difficult). With converged schemes ₹2.39 lakh (₹2.00 lakh household + ₹12k SBM toilet + ₹27k MGNREGA 90/95 days wages). Additional ₹50,000 per GR 4 April 2025 (₹35k additional + ₹15k solar up to 1 kW).",
      "Pune district status: Implemented by Pune Zilla Parishad across rural talukas. Maha Awas Abhiyan 2024-25 launched by Divisional Commissioner. Integrated with MGNREGA (labor wages), SBM-G (toilets), PMUY (LPG), PM Surya Ghar (solar).",
      "Secondary source: PMAY-G Official | https://pmayg.nic.in/",
      "Disclaimer: Launched 2016 (restructured from Indira Awaas Yojana). Extended March 2025 to 2029 with 2 crore additional houses (total outlay ₹3,06,137 crore FY 2024-29). Pune district beneficiary counts updated periodically; for taluka-level status, refer to Pune ZP Rural Development Department.",
    ].join(" // "),
    applyUrl: "https://pmayg.nic.in/",
    source: "Divisional Commissioner, Pune Division — Maha Awas Abhiyan | https://divcompune.maharashtra.gov.in/en/scheme/maha-awas-abhiyan-2024-25/",
  },

  // ── 3. Jal Jeevan Mission ─────────────────────────────────
  {
    name: "Jal Jeevan Mission (JJM) — Har Ghar Jal",
    category: "Water",
    level: "CENTRAL",
    eligibility: [
      "Eligibility: Every rural household entitled to a Functional Household Tap Connection (FHTC).",
      "Pune district status: Implementation by Pune Zilla Parishad Water Supply & Sanitation Department. Coverage progressing across 14 talukas. Real-time household-level data available at ejalshakti.gov.in dashboard.",
      "Secondary source: Pune Zilla Parishad Water Supply Department | https://www.punezp.gov.in/",
      "Disclaimer: Launched August 15, 2019; originally targeted 2024 completion, continuing. Funding: 50:50 centre-state (90:10 NE/Himalayan states; 100% UTs). FHTC counts update monthly; for specific village status, query ejalshakti.gov.in.",
    ].join(" // "),
    applyUrl: "https://ejalshakti.gov.in/jjmreport/",
    source: "Jal Jeevan Mission Dashboard | https://ejalshakti.gov.in/jjmreport/",
  },

  // ── 4. MGNREGA ────────────────────────────────────────────
  {
    name: "Mahatma Gandhi National Rural Employment Guarantee Scheme (MGNREGS)",
    category: "Employment",
    level: "CENTRAL",
    eligibility: [
      "Eligibility: Every rural household whose adult members volunteer for unskilled manual work. Guarantees 100 days of wage employment per financial year. Daily wages notified by state (Maharashtra rates revised annually).",
      "Pune district status: Active implementation across rural talukas (Ambegaon, Khed, Junnar, Maval, Mulshi, Purandar, Velhe, Bhor, Baramati, Indapur, Daund, Shirur). Convergence with PMAY-G for rural masonry wages (90/95 days). Real-time job card + muster roll data at nrega.nic.in.",
      "Secondary source: Pune ZP | https://www.punezp.gov.in/",
      "Disclaimer: Statutory scheme under MGNREG Act 2005. Focus areas: water conservation, land development, drought proofing. For real-time Pune data, query nrega.nic.in public dashboard filtered by Pune district.",
    ].join(" // "),
    applyUrl: "https://nrega.nic.in/",
    source: "MGNREGA Official | https://nrega.nic.in/",
  },

  // ── 5. Ayushman Bharat PM-JAY ────────────────────────────
  {
    name: "Ayushman Bharat — Pradhan Mantri Jan Arogya Yojana (AB-PMJAY)",
    category: "Health Insurance",
    level: "CENTRAL",
    amount: 500000, // ₹5 lakh coverage per family per year
    eligibility: [
      "Eligibility: Beneficiaries identified via SECC 2011 (rural) and occupational categories (urban). Extended to senior citizens 70+ regardless of income (via Ayushman Vay Vandana). ₹5 lakh coverage per family per year for secondary + tertiary hospitalisation.",
      "Pune district status: Empanelled hospitals include Sassoon General (public) and multiple private hospitals. Card distribution ongoing through CSC centres, district collector's office, and hospital help desks. Mahatma Jyotirao Phule Jan Arogya Yojana (state scheme) integrated with PM-JAY for combined coverage.",
      "Secondary source: Mahatma Phule Jan Arogya Yojana Maharashtra | https://www.jeevandayee.gov.in/",
      "Disclaimer: For eligibility check visit pmjay.gov.in or nearest CSC. Coverage is per family per year; specific disease exclusions may apply. Cashless and paperless at empanelled public and private hospitals.",
    ].join(" // "),
    applyUrl: "https://pmjay.gov.in/",
    source: "PM-JAY Official | https://pmjay.gov.in/",
  },

  // ── 6. PM POSHAN ─────────────────────────────────────────
  {
    name: "Pradhan Mantri POSHAN Shakti Nirman (PM POSHAN / Mid-Day Meal)",
    category: "Education",
    level: "CENTRAL",
    beneficiaryCount: 238395,
    eligibility: [
      "Eligibility: Students in Classes 1-8 enrolled in government schools. Nutritious mid-day meal with supplementary food once a week.",
      "Pune district status: Implemented across all 3,546 Pune ZP primary schools covering 2,38,395 students. PMC schools also participate. Focus on nutritional status improvement and school enrolment/attendance.",
      "Secondary source: PM POSHAN Official | https://pmposhan.education.gov.in/",
      "Disclaimer: Beneficiary count reflects Pune ZP primary schools only; PMC schools and aided schools add additional coverage. For complete district count, refer to District Education Office (Pune).",
    ].join(" // "),
    applyUrl: "https://pmposhan.education.gov.in/",
    source: "Pune Zilla Parishad Primary Education | https://www.punezp.gov.in/en/primary-education-2/",
  },
];

export async function seedPuneSchemes(prisma?: DBClient) {
  const client = prisma ?? makeClient();
  const standalone = !prisma;

  try {
    const mh = await client.state.findUniqueOrThrow({
      where: { slug: "maharashtra" },
    });
    const pune = await client.district.findUniqueOrThrow({
      where: { stateId_slug: { stateId: mh.id, slug: "pune" } },
    });
    console.log(`Seeding Pune schemes (districtId=${pune.id})...`);

    let created = 0;
    let skipped = 0;

    for (const rec of RECORDS) {
      const existing = await client.scheme.findFirst({
        where: { districtId: pune.id, name: rec.name },
      });
      if (existing) {
        console.log(`  ⏭️  ${rec.name} — already present`);
        skipped++;
        continue;
      }

      await client.scheme.create({
        data: {
          districtId: pune.id,
          name: rec.name,
          category: rec.category,
          level: rec.level,
          amount: rec.amount ?? null,
          beneficiaryCount: rec.beneficiaryCount ?? null,
          eligibility: rec.eligibility,
          applyUrl: rec.applyUrl ?? null,
          source: rec.source,
          active: true,
        },
      });
      console.log(`  ✅ [${rec.category}/${rec.level}] ${rec.name}`);
      created++;
    }

    console.log(
      `\nSummary: ${created} created + ${skipped} skipped = ${RECORDS.length} total target.`,
    );
  } finally {
    if (standalone) await client.$disconnect();
  }
}

if (require.main === module) {
  seedPuneSchemes()
    .then(() => process.exit(0))
    .catch((e) => {
      console.error(e);
      process.exit(1);
    });
}
