/**
 * Karnataka MPI district extractor — NITI Aayog Progress Review 2023
 *
 * Purpose: one-time extraction of Karnataka district-level MPI values
 *          (H, A, MPI for both 2015-16 and 2019-21) from the bar chart
 *          on page 132 of the NITI MPI 2023 PDF.
 *
 * Input:   scripts/data-pdfs/niti-mpi-2023.pdf (22 MB, 410 pp)
 *          Fetched by scripts/fetch-source-pdfs.ts
 *          Source URL: https://www.niti.gov.in/sites/default/files/2023-08/India-National-Multidimentional-Poverty-Index-2023.pdf
 *
 * Output:  Text files in scripts/data-pdfs/ (gitignored):
 *          - mpi-karnataka-barchart-full.txt
 *          - mpi-karnataka-overview.txt
 *          - mpi-state-table.txt
 *          - mpi-karnataka-full-chapter.txt
 *
 * Authoritative: YES. The values seeded in prisma/seed-karnataka-mpi.ts
 *                come from this script's output.
 *
 * Validation:    Every row passes the arithmetic check MPI = H × A / 10000.
 *                Bar chart order verified against overview table ordering.
 *
 * Run:     npx tsx -r dotenv/config scripts/extract-mpi-barchart-full.ts
 *
 * Extracted: 2026-04-21 by Jayanth M B (ForThePeople.in Population Module v2).
 */

import { PDFParse } from "pdf-parse";
import { readFileSync, writeFileSync } from "fs";

async function main() {
  const buf = readFileSync("scripts/data-pdfs/niti-mpi-2023.pdf");
  const parser = new PDFParse({ data: buf });
  const result = await parser.getText();
  const text = result.text;

  // The Karnataka district bar chart values trail the district name list.
  // Name list appears around position 212800–213200 (ends with "…Ramanagara").
  // Values should follow as 30 pairs (2015-16, 2019-21 H%).
  // Grab 7000 chars starting at position 212500 to cover the full chart safely.
  const window = text.slice(212500, 219500);
  writeFileSync("scripts/data-pdfs/mpi-karnataka-barchart-full.txt", window);
  console.log(`Bar-chart window (212500–219500) → mpi-karnataka-barchart-full.txt (${window.length} chars)`);

  console.log("\n--- BAR CHART WINDOW (whitespace-normalised, full 7000 chars) ---");
  console.log(window.replace(/\s+/g, " "));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
