import { writeFileSync, mkdirSync, existsSync } from "fs";
import { join } from "path";

// NFHS-5 district factsheets deferred — rchiips.org removed /nfhs/ paths and
// iipsindia.ac.in / nfhsiips.in require interactive login. Group D will seed
// NFHS-5 rows with empty JSONB + TODO markers. NITI MPI 2023 is fetchable
// (note: "Multidimentional" is NITI's own typo in the filename — keep as-is).
const TARGETS = [
  { slug: "niti-mpi-2023", url: "https://www.niti.gov.in/sites/default/files/2023-08/India-National-Multidimentional-Poverty-Index-2023.pdf" },
];

const outDir = "scripts/data-pdfs";

async function main() {
  mkdirSync(outDir, { recursive: true });

  for (const t of TARGETS) {
    const outPath = join(outDir, `${t.slug}.pdf`);
    if (existsSync(outPath)) {
      console.log(`  ⏭  ${t.slug}.pdf already present — skipping download`);
      continue;
    }
    try {
      const res = await fetch(t.url);
      if (!res.ok) {
        console.log(`  ⚠️  ${t.slug}: HTTP ${res.status}`);
        continue;
      }
      const buf = Buffer.from(await res.arrayBuffer());
      writeFileSync(outPath, buf);
      console.log(`  ✓ ${t.slug}.pdf (${(buf.length / 1024).toFixed(0)} KB)`);
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      console.log(`  ⚠️  ${t.slug}: ${msg}`);
    }
  }

  console.log("\nDone. Files in scripts/data-pdfs/");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
