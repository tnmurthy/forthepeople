# 32 — India Dashboard · Scraping & Live-Data Plan
**Owner:** Jayanth M B · **Created:** 27 Apr 2026 · **Companion to:** `31-India-Dashboard-Build-Prompt.md` · **Save to:** `Forthepeople/32-India-Dashboard-Scrapers-Plan.md`

> **Read order:** 30 (canonical state) → 31 (build prompt) → 32 (this — scraping plan).
> 
> **Status:** This file SUPERSEDES the seed-data-only approach in section 15 of file 31. The new rule is: **NOTHING is hardcoded.** Every value on `/en/india` is fetched by a scraper that runs on its own cadence. Seed files exist only to bootstrap an empty DB on local dev.

---

## 0 · CORE PRINCIPLE — ZERO HARDCODED DATA

```
RULE 1: No numeric value on the India page comes from a hardcoded TS file 
        in production. Every value is read from IndiaIndicator (DB), 
        which is populated by a scraper that ran on its own schedule.

RULE 2: Each module declares its OWN scraping cadence — driven by how 
        often the upstream government source actually publishes new data. 
        Most govt data updates monthly, quarterly, or annually. Hourly 
        scraping is wasteful and sometimes abusive.

RULE 3: Sensitive modules (Defence, Elections, Health, Justice, Crime) 
        are scraped ONLY from canonical .gov.in / .nic.in / PIB URLs. 
        No aggregators, no third-party mirrors, no Wikipedia, no news.

RULE 4: Every scraper is registered in scraper-registry.ts with: 
        source URL, cadence, parser, target module, target metricKeys. 
        Adding a metric = adding one entry. Same scalability as modules.

RULE 5: Every scraper run logs to ScraperRun (success/failure/duration). 
        Failures > N in a row → AdminAlert email + Sentry. The admin 
        sidebar shows a live scraper health board.

RULE 6: Respectful scraping. Rate limit 1 req per 2-3s per host. 
        User-Agent identifies ForThePeople with contact email. 
        Honor robots.txt and Retry-After. Cache aggressively.

RULE 7: The word "scraper" / "scraping" / "scraped" NEVER appears in 
        any user-facing copy. UI text uses: "sourced from", 
        "aggregated from", "collected from", "data from". 
        Internal code/files/comments may use "scraper" freely.

RULE 8: Bootstrapping: prisma/seed-india.ts seeds ONLY (a) the module 
        registry rows in scraper_config, (b) the module suggestions, 
        (c) static reference data that does NOT change (e.g., Constitution 
        Schedule numbers — "8th Schedule has 22 languages"). Everything 
        else is left empty for the scrapers to fill on first run.
```

---

## 1 · SCRAPING CADENCE TIERS

Defined ONCE in `src/lib/india/scraping-tiers.ts`. Each module references a tier — never a raw cron string.

```typescript
export const INDIA_SCRAPING_TIERS = {
  // For things that genuinely change daily on govt portals
  DAILY_EARLY: {
    label: "Daily, early morning IST",
    cron: "0 1 * * *",                  // 06:30 IST (01:00 UTC)
    description: "Runs once a day at 06:30 IST.",
    minIntervalHours: 23,
  },

  // For weekly govt releases (RBI WSS, NJDG snapshot, CWC reservoir bulletin)
  WEEKLY_MONDAY: {
    label: "Weekly, Monday",
    cron: "0 4 * * 1",                  // 09:30 IST Mon
    description: "Runs Mondays at 09:30 IST.",
    minIntervalHours: 167,
  },
  WEEKLY_FRIDAY: {                       // RBI publishes WSS Friday EOD
    label: "Weekly, Friday",
    cron: "0 13 * * 5",                 // 18:30 IST Fri
    description: "Runs Fridays at 18:30 IST (after RBI WSS).",
    minIntervalHours: 167,
  },

  // For monthly releases — split by where in the month they typically land
  MONTHLY_EARLY: {                       // GST 1st, UPI 1st-3rd
    label: "Monthly, 5th of the month",
    cron: "0 4 5 * *",                  // 09:30 IST on 5th
    description: "Runs on the 5th of each month at 09:30 IST.",
    minIntervalHours: 27 * 24,
  },
  MONTHLY_MID: {                         // CPI 12th, IIP 12th, WPI 14th, Trade 15th
    label: "Monthly, 15th of the month",
    cron: "0 4 15 * *",                 // 09:30 IST on 15th
    description: "Runs on the 15th of each month at 09:30 IST.",
    minIntervalHours: 27 * 24,
  },
  MONTHLY_LATE: {                        // PLFS, TRAI Performance Indicators, CEA
    label: "Monthly, 28th of the month",
    cron: "0 4 28 * *",                 // 09:30 IST on 28th
    description: "Runs on the 28th of each month at 09:30 IST.",
    minIntervalHours: 27 * 24,
  },

  // Quarterly — GDP releases end-Feb / end-May / end-Aug / end-Nov
  QUARTERLY: {
    label: "Quarterly, last week",
    cron: "0 4 28 2,5,8,11 *",          // 28th of Feb/May/Aug/Nov, 09:30 IST
    description: "Runs on 28th of Feb, May, Aug, Nov at 09:30 IST.",
    minIntervalHours: 80 * 24,
  },

  // Annual — most census-style data, ISFR, NCRB, UDISE+, NFHS
  ANNUAL_APRIL: {                        // Most surveys release Apr-Sep
    label: "Annual, April",
    cron: "0 4 1 4 *",                  // 1 April 09:30 IST
    description: "Runs once a year on 1 April at 09:30 IST.",
    minIntervalHours: 360 * 24,
  },
  ANNUAL_BUDGET_DAY: {                   // 1 Feb after Union Budget speech
    label: "Annual, Budget Day evening",
    cron: "30 12 1 2 *",                // 1 Feb 18:00 IST
    description: "Runs annually on 1 Feb at 18:00 IST after Budget speech.",
    minIntervalHours: 360 * 24,
  },

  // Event-driven — only triggered manually from admin or by polling 
  // a "watch list" weekly to detect new releases
  EVENT_DRIVEN_WEEKLY_POLL: {
    label: "Event-driven (weekly poll)",
    cron: "0 5 * * 1",                  // Mon 10:30 IST
    description: "Polls the source weekly; only writes if new event detected.",
    minIntervalHours: 167,
  },

  // Manual only — never runs on cron, only when admin clicks "Run now"
  MANUAL_ONLY: {
    label: "Manual / on-demand",
    cron: null,
    description: "Runs only when triggered from admin.",
    minIntervalHours: 0,
  },
} as const;

export type IndiaScrapingTierKey = keyof typeof INDIA_SCRAPING_TIERS;
```

> **Why these tiers and not raw cron strings:** when (not if) a tier needs adjustment, you change one constant — every scraper using that tier picks up the new schedule on next deploy. No find-and-replace across 50 scraper files.

---

## 2 · PER-MODULE SCRAPING SCHEDULE

Every module gets a scraping plan. Cadence is matched to **how often the source actually updates** — not how often we want it to update.

### Snapshot & Demographics

| Module slug | Source | Tier | Why this cadence |
|---|---|---|---|
| `national-snapshot` (states, UTs, languages) | MHA, 8th Schedule | `ANNUAL_APRIL` | These rarely change. Annual check is generous. |
| `national-snapshot` (districts count) | LGD `lgdirectory.gov.in` | `MONTHLY_LATE` | New districts get notified through the year; monthly is right. |
| `demographics-population` | SRS Bulletin, MoSPI | `ANNUAL_APRIL` | SRS releases annually. Decennial Census even rarer. |

### Economy

| Module slug | Source | Tier | Why this cadence |
|---|---|---|---|
| `economy-gdp` (GVA, GDP) | MoSPI press notes | `QUARTERLY` | Q-est releases end of Feb/May/Aug/Nov. |
| `economy-inflation` (CPI) | mospi.gov.in | `MONTHLY_MID` | CPI released on 12th. Run on 15th to be safe. |
| `economy-inflation` (WPI) | eaindustry.nic.in | `MONTHLY_MID` | WPI released on 14th. |
| `economy-employment` (PLFS) | mospi.gov.in/plfs | `MONTHLY_LATE` | PLFS Monthly Bulletin, late-month release. |
| `economy-rbi-repo` | rbi.org.in | `EVENT_DRIVEN_WEEKLY_POLL` | Repo only changes ~6 times/year at MPC. |
| `economy-forex` | RBI Weekly Statistical Supplement | `WEEKLY_FRIDAY` | RBI publishes WSS Friday EOD. |

### Budget

| Module slug | Source | Tier | Why this cadence |
|---|---|---|---|
| `budget-union` (allocations) | indiabudget.gov.in | `ANNUAL_BUDGET_DAY` | Union Budget = 1 Feb. |
| `budget-union` (actuals/CGA) | cga.nic.in | `MONTHLY_LATE` | CGA Monthly Account ~25th-28th. |
| `budget-gst` | gstcouncil.gov.in / PIB | `MONTHLY_EARLY` | GST collections released on 1st of every month. |

### Agriculture

| Module slug | Source | Tier | Why this cadence |
|---|---|---|---|
| `agriculture-production` | DA&FW Crop Estimates | `QUARTERLY` | 1st/2nd/3rd/4th Advance Estimates released quarterly. |
| `agriculture-production` (mandi count, AGMARKNET) | agmarknet.gov.in | `MONTHLY_LATE` | New mandis get added; monthly is generous. Daily mandi prices have their own existing scraper at district level — DON'T duplicate. |
| `agriculture-pmkisan` (cumulative beneficiaries) | pmkisan.gov.in | `MONTHLY_LATE` | Cumulative number; monthly snapshot enough. |
| `agriculture-msp` (notified crops, prices) | cacp.dacnet.nic.in | `ANNUAL_APRIL` | MSP announced before Kharif/Rabi seasons. |

### Livestock & Wildlife (high-sensitivity for accurate sourcing)

| Module slug | Source | Tier | Why this cadence |
|---|---|---|---|
| `wildlife-forests` (forest cover) | fsi.nic.in (ISFR) | `ANNUAL_APRIL` | ISFR releases every 2 years; annual check fine. |
| `wildlife-tigers` | NTCA Status Report + projecttiger.nic.in | `ANNUAL_APRIL` | Status of Tigers report every 4 years; annual poll catches news. |
| `wildlife-protected-areas` (NPs, sanctuaries, Ramsar) | wii.gov.in, moef.gov.in | `QUARTERLY` | New designations are notified during the year. |

### Infrastructure

| Module slug | Source | Tier | Why this cadence |
|---|---|---|---|
| `infra-roads` (NH length, ongoing) | morth.nic.in | `QUARTERLY` | MoRTH releases quarterly status reports. |
| `infra-railways` | indianrailways.gov.in stats book | `ANNUAL_APRIL` | Annual yearbook only. |
| `infra-aviation` (airports, traffic) | dgca.gov.in | `MONTHLY_LATE` | DGCA monthly stats are available. |
| `infra-telecom` (subscribers, broadband) | trai.gov.in | `MONTHLY_LATE` | TRAI Performance Indicators released ~28th. |

### Energy

| Module slug | Source | Tier | Why this cadence |
|---|---|---|---|
| `energy-power` (installed capacity, generation) | cea.nic.in Executive Summary | `MONTHLY_LATE` | CEA releases Monthly Executive Summary. |
| `energy-renewables` (RE installed, segment-wise) | mnre.gov.in | `MONTHLY_LATE` | MNRE monthly bulletin. |

### Health

| Module slug | Source | Tier | Why this cadence |
|---|---|---|---|
| `health-overview` (NFHS-5 indicators) | rchiips.org NFHS-5 | `ANNUAL_APRIL` | NFHS-5 is the latest large survey; rarely updates. |
| `health-pmjay` (cards issued, hospitals empanelled) | pmjay.gov.in dashboard | `MONTHLY_LATE` | NHA releases monthly numbers. |
| `health-immunisation` (U-WIN cumulative) | uwin.mohfw.gov.in | `MONTHLY_LATE` | Cumulative; monthly snapshot fine. |

### Education

| Module slug | Source | Tier | Why this cadence |
|---|---|---|---|
| `education-schools` (UDISE+ aggregates) | udiseplus.gov.in | `ANNUAL_APRIL` | UDISE+ annual report. |
| `education-higher` (students, institutions) | aishe.gov.in (AISHE), ugc.gov.in | `ANNUAL_APRIL` | AISHE annual. |

### Defence (highest legal sensitivity — official sources ONLY)

| Module slug | Source | Tier | Why this cadence |
|---|---|---|---|
| `defence-budget` | indiabudget.gov.in (Demand 17/19/20) + mod.gov.in | `ANNUAL_BUDGET_DAY` | Released on Budget Day; revised in December (Supp Demands). |
| `defence-exports` | PIB releases tagged "Defence Production" | `QUARTERLY` | MoD typically releases quarterly export figures via PIB. |

### Justice & Crime (sensitive)

| Module slug | Source | Tier | Why this cadence |
|---|---|---|---|
| `justice-pendency` | njdg.ecourts.gov.in | `WEEKLY_MONDAY` | NJDG dashboard updates daily, but weekly snapshot is enough — and reduces load. |
| `justice-crime` (NCRB headlines) | ncrb.gov.in Crime in India | `ANNUAL_APRIL` | NCRB CII released annually (typically Aug-Sep). Annual poll catches it. |
| `justice-police` (BPRD strength) | bprd.nic.in Data on Police | `ANNUAL_APRIL` | BPRD annual publication. |

### Elections (MCC-sensitive)

| Module slug | Source | Tier | Why this cadence |
|---|---|---|---|
| `elections-loksabha` (party seats, comp) | eci.gov.in | `EVENT_DRIVEN_WEEKLY_POLL` | Only changes at GE / by-elections. Weekly poll detects. |
| `elections-rajyasabha` | rajyasabha.nic.in | `MONTHLY_LATE` | Bi-annual elections to RS, monthly poll is generous. |
| `elections-turnout` (historical trends) | eci.gov.in | `ANNUAL_APRIL` | Historical aggregate, slow-changing. |

### Science

| Module slug | Source | Tier | Why this cadence |
|---|---|---|---|
| `science-isro` (mission count, latest) | isro.gov.in | `EVENT_DRIVEN_WEEKLY_POLL` | Launches are events; weekly poll catches them. |
| `science-rd` (R&D % GDP, patents) | dst.gov.in R&D Statistics + ipindia | `ANNUAL_APRIL` | Annual reports. |
| `science-startups` (DPIIT-recognised) | startupindia.gov.in | `MONTHLY_LATE` | DPIIT publishes cumulative numbers monthly. |
| `science-digital` (UPI tx) | npci.org.in stats | `MONTHLY_EARLY` | NPCI releases monthly UPI stats early-month. |

### Trade

| Module slug | Source | Tier | Why this cadence |
|---|---|---|---|
| `trade-overview` (exports, imports) | commerce.gov.in QuickEstimates | `MONTHLY_MID` | Commerce releases ~15th of each month. |

### Tourism

| Module slug | Source | Tier | Why this cadence |
|---|---|---|---|
| `tourism-overview` (FTA, FEE) | tourism.gov.in India Tourism Statistics | `MONTHLY_LATE` | Monthly bulletin. |
| `tourism-heritage` (UNESCO, ASI count) | asi.nic.in, whc.unesco.org | `QUARTERLY` | New designations are rare events; quarterly poll fine. |

### Sports

| Module slug | Source | Tier | Why this cadence |
|---|---|---|---|
| `sports-olympics` (medals, athletes) | IOA + sportsauthorityofindia.nic.in + Olympics.com (only for tally during Games) | `EVENT_DRIVEN_WEEKLY_POLL` | Olympic events; otherwise data is static. |

> **Total scrapers: ~45 distinct fetcher tasks** spread across 9 cadence tiers. Most run monthly or less. No tier runs more than once per day.

---

## 3 · PRISMA MODELS — ADD THESE (extends file 31 schema)

```prisma
// ──────────────────────────────────────────────────────────────
// SCRAPER CONFIGURATION & RUN HISTORY (India dashboard scope)
// ──────────────────────────────────────────────────────────────

/// One row per scraper task. Acts as the registry source-of-truth in DB 
/// (mirrored by code in src/scrapers/india/_registry.ts).
model IndiaScraperConfig {
  id              String   @id @default(cuid())
  scraperKey      String   @unique         // 'mospi-cpi', 'rbi-forex', 'pmkisan-beneficiaries'
  moduleSlug      String                   // 'economy-inflation' — links to module registry
  metricKeys      String[]                 // which IndiaIndicator metricKeys this scraper writes
  sourceUrl       String                   // canonical source page (or list page)
  sourceLicense   String?                  // 'NDSAP', 'CC-BY-4.0', 'GoI Open Data License'
  tier            String                   // matches IndiaScrapingTierKey
  cron            String?                  // resolved cron from tier (denormalised for ops)
  runtime         String   @default("railway") // 'vercel-cron' | 'railway' | 'manual'
  isActive        Boolean  @default(true)  // admin can pause without deleting
  lastRunAt       DateTime?
  lastSuccessAt   DateTime?
  lastFailureAt   DateTime?
  consecutiveFailures Int  @default(0)
  nextRunAt       DateTime?                // computed; for admin UI
  notes           String?  @db.Text
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  runs            IndiaScraperRun[]

  @@index([moduleSlug])
  @@index([isActive])
  @@index([nextRunAt])
}

/// One row per scraper invocation. Source-of-truth for ops dashboards.
model IndiaScraperRun {
  id            String   @id @default(cuid())
  scraperKey    String
  startedAt     DateTime @default(now())
  finishedAt    DateTime?
  durationMs    Int?
  status        String   // 'success' | 'failed' | 'partial' | 'skipped'
  recordsWritten Int     @default(0)
  recordsSkipped Int     @default(0)
  httpStatus    Int?
  errorMessage  String?  @db.Text
  errorStack    String?  @db.Text
  triggeredBy   String   @default("cron")  // 'cron' | 'manual' | 'webhook'
  config        IndiaScraperConfig @relation(fields: [scraperKey], references: [scraperKey], onDelete: Cascade)

  @@index([scraperKey, startedAt(sort: Desc)])
  @@index([status])
}
```

Run `npx prisma migrate dev --name india_scrapers` after adding.

---

## 4 · UPDATED MODULE REGISTRY

The `IndiaModuleDef` type (file 31, section 7) gets one more field. **No other changes** to file 31's registry shape.

```typescript
// In src/lib/india/india-modules.ts (extending file 31 definition)

export interface IndiaModuleDef {
  // ...all the fields from file 31...
  
  /// References to scraper keys that populate this module. 
  /// One module can be fed by multiple scrapers (e.g., economy-gdp 
  /// uses both 'mospi-gdp-quarterly' and 'mospi-gva-quarterly').
  scraperKeys: string[];
}
```

---

## 5 · SCRAPER FILE STRUCTURE

Mirror the module structure. One folder per category. Every scraper exports one default function with the same signature.

```
src/scrapers/india/
├── _registry.ts                       (re-exports + DB sync of IndiaScraperConfig)
├── _base/
│   ├── http.ts                        (fetch with rate-limit, UA, retry)
│   ├── pdf.ts                         (pdf-parse wrapper for govt PDFs)
│   ├── upsert.ts                      (idempotent IndiaIndicator writer)
│   ├── runner.ts                      (run-single + run-due, logs ScraperRun)
│   ├── tier-resolver.ts               (tier → cron, computes nextRunAt)
│   └── types.ts                       (ScraperContext, ScraperResult)
│
├── snapshot/
│   ├── lgd-districts-count.ts         (MONTHLY_LATE)
│   └── mha-states-uts.ts              (ANNUAL_APRIL)
│
├── demographics/
│   └── srs-population.ts              (ANNUAL_APRIL)
│
├── economy/
│   ├── mospi-gdp.ts                   (QUARTERLY)
│   ├── mospi-cpi.ts                   (MONTHLY_MID)
│   ├── dpiit-wpi.ts                   (MONTHLY_MID)
│   ├── mospi-plfs.ts                  (MONTHLY_LATE)
│   ├── rbi-repo.ts                    (EVENT_DRIVEN_WEEKLY_POLL)
│   └── rbi-forex.ts                   (WEEKLY_FRIDAY)
│
├── budget/
│   ├── indiabudget-allocations.ts     (ANNUAL_BUDGET_DAY)
│   ├── cga-monthly-accounts.ts        (MONTHLY_LATE)
│   └── gst-collections.ts             (MONTHLY_EARLY)
│
├── agriculture/
│   ├── dafw-crop-estimates.ts         (QUARTERLY)
│   ├── agmarknet-mandi-count.ts       (MONTHLY_LATE)
│   ├── pmkisan-beneficiaries.ts       (MONTHLY_LATE)
│   └── cacp-msp.ts                    (ANNUAL_APRIL)
│
├── wildlife/
│   ├── fsi-forest-cover.ts            (ANNUAL_APRIL)
│   ├── ntca-tigers.ts                 (ANNUAL_APRIL)
│   └── wii-protected-areas.ts         (QUARTERLY)
│
├── infra/
│   ├── morth-highways.ts              (QUARTERLY)
│   ├── railways-yearbook.ts           (ANNUAL_APRIL)
│   ├── dgca-aviation.ts               (MONTHLY_LATE)
│   └── trai-telecom.ts                (MONTHLY_LATE)
│
├── energy/
│   ├── cea-power-monthly.ts           (MONTHLY_LATE)
│   └── mnre-renewable.ts              (MONTHLY_LATE)
│
├── health/
│   ├── nfhs5-indicators.ts            (ANNUAL_APRIL)
│   ├── pmjay-dashboard.ts             (MONTHLY_LATE)
│   └── uwin-immunisation.ts           (MONTHLY_LATE)
│
├── education/
│   ├── udise-schools.ts               (ANNUAL_APRIL)
│   └── aishe-higher.ts                (ANNUAL_APRIL)
│
├── defence/
│   ├── mod-budget.ts                  (ANNUAL_BUDGET_DAY)
│   └── pib-defence-exports.ts         (QUARTERLY)
│
├── justice/
│   ├── njdg-pendency.ts               (WEEKLY_MONDAY)
│   ├── ncrb-crime.ts                  (ANNUAL_APRIL)
│   └── bprd-police.ts                 (ANNUAL_APRIL)
│
├── elections/
│   ├── eci-loksabha.ts                (EVENT_DRIVEN_WEEKLY_POLL)
│   ├── rajyasabha-composition.ts      (MONTHLY_LATE)
│   └── eci-turnout-historical.ts      (ANNUAL_APRIL)
│
├── science/
│   ├── isro-launches.ts               (EVENT_DRIVEN_WEEKLY_POLL)
│   ├── dst-rd.ts                      (ANNUAL_APRIL)
│   ├── dpiit-startups.ts              (MONTHLY_LATE)
│   └── npci-upi.ts                    (MONTHLY_EARLY)
│
├── trade/
│   └── commerce-trade.ts              (MONTHLY_MID)
│
├── tourism/
│   ├── tourism-arrivals.ts            (MONTHLY_LATE)
│   └── asi-heritage.ts                (QUARTERLY)
│
└── sports/
    └── ioa-medals.ts                  (EVENT_DRIVEN_WEEKLY_POLL)
```

---

## 6 · COMMON SCRAPER INTERFACE

Every scraper file exports the same shape so the runner can invoke any of them uniformly.

```typescript
// src/scrapers/india/_base/types.ts

export interface ScraperContext {
  scraperKey: string;
  moduleSlug: string;
  http: typeof fetch;          // pre-configured with UA, rate-limit, retry
  parsePdf: (buffer: Buffer) => Promise<string>;
  upsertIndicator: (input: IndicatorInput) => Promise<void>;
  upsertTimeSeries: (input: TimeSeriesInput) => Promise<void>;
  upsertStateBreakdown: (input: StateBreakdownInput) => Promise<void>;
  log: (msg: string, level?: "info" | "warn" | "error") => void;
}

export interface IndicatorInput {
  metricKey: string;
  metricLabel: string;
  numericValue?: number | null;
  textValue?: string | null;
  unit?: string | null;
  asOfDate: Date;             // <-- the source's reporting date, not now()
  source: string;
  sourceUrl: string;
  notes?: string;
  displayOrder?: number;
}

export type ScraperFn = (ctx: ScraperContext) => Promise<{
  recordsWritten: number;
  recordsSkipped: number;
  partial?: boolean;
}>;

export default async function example(ctx: ScraperContext) {
  // implementation
}
```

Example skeleton, drop in for every scraper:

```typescript
// src/scrapers/india/economy/mospi-cpi.ts

import type { ScraperFn } from "../_base/types";

const SOURCE_URL = "https://www.mospi.gov.in/cpi";
const SOURCE_NAME = "MoSPI · Consumer Price Index";

const scraper: ScraperFn = async (ctx) => {
  ctx.log(`Fetching CPI from ${SOURCE_URL}`);

  const res = await ctx.http(SOURCE_URL);
  if (!res.ok) {
    throw new Error(`Source returned ${res.status}`);
  }

  // 1. Parse the page / PDF / table to extract the latest CPI YoY %
  // 2. Find the as-of month from the press release header
  // 3. Upsert into IndiaIndicator

  const cpiYoY = /* parsed value */ 0;
  const asOfDate = /* parsed date */ new Date();

  await ctx.upsertIndicator({
    metricKey: "cpi_inflation_yoy",
    metricLabel: "CPI Inflation (YoY)",
    numericValue: cpiYoY,
    unit: "%",
    asOfDate,
    source: SOURCE_NAME,
    sourceUrl: SOURCE_URL,
  });

  return { recordsWritten: 1, recordsSkipped: 0 };
};

export default scraper;
```

---

## 7 · RUNNER & SCHEDULING — WHERE EACH SCRAPER LIVES

**Two runtimes.** Pick the right one per scraper based on weight.

| Runtime | Use for | Limits |
|---|---|---|
| **Vercel Cron** (`vercel.json` cron + `app/api/cron/india/[scraperKey]/route.ts`) | Lightweight HTTP fetch + JSON parse, finishes < 60s | Vercel cron caps at 60s for Hobby and Pro Standard; up to 300s on some plans. No persistent storage. |
| **Railway scraper container** (`Dockerfile.scraper`, `node-cron`) | PDF parsing, multi-step crawl, anything > 60s, anything that downloads files | Always-on, costs Railway runtime. Existing scraper container — extend, don't duplicate. |

**Default to Railway** unless the task is genuinely tiny. Vercel cron gets used only for: `economy-rbi-repo` poll, `economy-forex` (small JSON), `gst-collections` (small page).

The runner (`src/scrapers/india/_base/runner.ts`) does the same thing on both runtimes:

```typescript
export async function runScraper(scraperKey: string, triggeredBy = "cron") {
  const config = await prisma.indiaScraperConfig.findUnique({ where: { scraperKey } });
  if (!config || !config.isActive) return { skipped: true };

  const run = await prisma.indiaScraperRun.create({
    data: { scraperKey, status: "running", triggeredBy },
  });

  try {
    const fn = await loadScraperFn(scraperKey);  // dynamic import from _registry
    const ctx = buildContext(scraperKey, config);
    const result = await fn(ctx);

    await prisma.indiaScraperRun.update({
      where: { id: run.id },
      data: {
        finishedAt: new Date(),
        status: result.partial ? "partial" : "success",
        recordsWritten: result.recordsWritten,
        recordsSkipped: result.recordsSkipped,
        durationMs: Date.now() - run.startedAt.getTime(),
      },
    });
    await prisma.indiaScraperConfig.update({
      where: { scraperKey },
      data: {
        lastRunAt: new Date(),
        lastSuccessAt: new Date(),
        consecutiveFailures: 0,
        nextRunAt: computeNextRunAt(config.tier),
      },
    });
  } catch (err: any) {
    await prisma.indiaScraperRun.update({
      where: { id: run.id },
      data: {
        finishedAt: new Date(),
        status: "failed",
        errorMessage: err.message?.slice(0, 2000),
        errorStack: err.stack?.slice(0, 4000),
        durationMs: Date.now() - run.startedAt.getTime(),
      },
    });
    const updated = await prisma.indiaScraperConfig.update({
      where: { scraperKey },
      data: {
        lastRunAt: new Date(),
        lastFailureAt: new Date(),
        consecutiveFailures: { increment: 1 },
      },
    });
    if (updated.consecutiveFailures >= 3) {
      await createAdminAlert({
        severity: "high",
        title: `India scraper "${scraperKey}" failed ${updated.consecutiveFailures}x`,
        body: `Source: ${config.sourceUrl}\nError: ${err.message}`,
      });
    }
    throw err;
  }
}
```

The Railway container's `node-cron` schedules read from the resolved cron strings in `IndiaScraperConfig`. The Vercel side reads cron schedules from `vercel.json` for the few that run there.

---

## 8 · RESPECTFUL & LEGAL SCRAPING RULES

Hard-coded in `src/scrapers/india/_base/http.ts`. **Every scraper** uses this — never bare `fetch()`.

```
1. USER-AGENT
   "ForThePeople-Bot/1.0 (+https://forthepeople.in/about; support@forthepeople.in)"
   Mandatory. Identifies us so portal admins can contact us if there's an issue.

2. RATE LIMIT
   Per-host queue. Maximum 1 request per 2.5 seconds to any single host.
   Implemented as p-queue with concurrency 1 + 2500ms gap.

3. ROBOTS.TXT
   On the first call to a host within a process, fetch /robots.txt and 
   cache for the process lifetime. If the path is disallowed for our UA 
   or "*", abort with a clear error logged to ScraperRun.

4. TIMEOUTS
   Connect timeout 10s, total timeout 30s for HTML, 90s for PDFs.

5. RETRIES
   Up to 2 retries on 5xx and network errors. Exponential backoff: 
   5s, 20s. Honor Retry-After if present.

6. CACHE
   Every successful fetch stores response body + headers in Redis 
   for at minimum the tier's minIntervalHours (capped at 7 days). 
   Tier MONTHLY_MID = 27d cache; tier WEEKLY_FRIDAY = 6d cache. 
   This means re-runs in the same window short-circuit and don't 
   hit the source again — protects us and the portal.

7. NO HEADLESS BROWSER (default)
   Plain HTTP only. If a portal genuinely requires JS rendering, 
   flag the scraper with `requiresBrowser: true` and run it via 
   a server-side fetch to the existing Apify "rag-web-browser" 
   actor — DO NOT add Puppeteer or Playwright to our codebase. 
   This is the same rule as ANTI-PATTERNS in the project rules.

8. PDF HANDLING
   pdf-parse for text-only. Most govt PDFs are text-bearing. 
   Scanned PDFs (NCRB sometimes) get a separate pipeline: 
   download once, OCR offline, store extracted text in S3-equivalent 
   storage, scrapers read the extracted text. NEVER OCR on every 
   run — wasteful and slow.

9. LICENSE TRACKING
   Every IndiaScraperConfig row stores sourceLicense. Most govt 
   sources are NDSAP. PRS Legislative Research is CC-BY-4.0 (already 
   in memory). Wikimedia is CC. NPCI's UPI stats are public 
   domain. We never scrape from licensed databases.

10. CONTACT POLICY
    The /about page lists support@forthepeople.in for portal admins 
    to reach us. If we ever receive a complaint, we pause the scraper 
    immediately (admin sets isActive=false) and email back within 24h.
```

---

## 9 · ADMIN HEALTH BOARD

The existing admin sidebar gets a new tab: **India Scrapers**.

Shows:
- Every IndiaScraperConfig row in a table
- Columns: scraperKey, moduleSlug, tier, lastRunAt, lastSuccessAt, status, consecutiveFailures, nextRunAt, isActive toggle
- Each row clickable → drawer with last 20 ScraperRun rows (status, duration, error, records written)
- Top row: "Run now" button per scraper (manual trigger; uses `triggeredBy: "manual"`)
- Top of page: 3 KPI tiles — total scrapers, succeeded in last 24h, failed in last 24h
- Filter chips: by module category, by tier, by status

This is built into the existing admin shell — DO NOT create a new admin layout.

---

## 10 · UI: WHAT EVERY VALUE SHOWS

Every numeric value rendered on `/en/india` shows three things:

```
┌─────────────────────────────────┐
│  4.8%                            │ ← JetBrains Mono number
│  Unemployment Rate (CWS)         │ ← label
│  MoSPI · PLFS Monthly · Jan 2026 │ ← source · as-of-date (clickable to source URL)
└─────────────────────────────────┘
```

If the latest scraper run failed AND the existing value is older than 2× the tier's interval, the tile shows a small "⚠ Source unavailable; last fetch: <date>" line in muted text — but still shows the cached number. We don't blank out the page when one source is down.

If a metric has never been successfully fetched, the tile shows: "Awaiting first sync — source: <name>. <link>" — no fake placeholder number.

---

## 11 · BOOTSTRAP & SEED FILE (`prisma/seed-india.ts`)

The seed file's job changes. It now seeds **only** these things:

```typescript
// 1. Static reference values that constitutionally do not change
//    (or change only with constitutional amendments)
await prisma.indiaIndicator.upsert({
  where: { moduleSlug_metricKey: { moduleSlug: "national-snapshot", metricKey: "scheduled_languages" } },
  update: {},
  create: {
    moduleSlug: "national-snapshot",
    metricKey: "scheduled_languages",
    metricLabel: "Scheduled Languages",
    numericValue: 22,
    unit: "count",
    asOfDate: new Date("1992-12-01"),
    source: "Constitution of India · 8th Schedule (post-92nd Amendment)",
    sourceUrl: "https://legislative.gov.in/constitution-of-india/",
  },
});
// (states_count, uts_count, geographic_area, scheduled_languages — only these 
//  4 are truly constitutional/static. Everything else has a scraper.)

// 2. The IndiaScraperConfig registry — one row per scraper. 
//    The TS code in src/scrapers/india/_registry.ts holds the canonical list; 
//    the seed copies it to DB so the admin UI can edit pause/resume etc.

// 3. The 5 starter IndiaModuleSuggestion rows (file 31 section 15).

// 4. NOTHING ELSE. The first cron run of each scraper populates the rest.
```

---

## 12 · UPDATED PHASING (REPLACES FILE 31 PHASES 5 & 8)

File 31's Phases 0-4, 6, 7, 9, 10, 11 stay as-is. Phases 5 and 8 change because we no longer "seed verified data" — we wire scrapers instead.

```
PHASE 5  · SCRAPER FRAMEWORK + FIRST 6 SCRAPERS         (~120 min)
  - Add Prisma models from section 3 above. Run migration.
  - Build src/scrapers/india/_base/* (http, pdf, upsert, runner, types).
  - Build src/scrapers/india/_registry.ts.
  - Build admin "India Scrapers" health board.
  - Build the first 6 scrapers (one per category demo set):
    ▸ snapshot/lgd-districts-count.ts
    ▸ economy/rbi-repo.ts            (lightweight, runs on Vercel cron)
    ▸ budget/gst-collections.ts      (lightweight, runs on Vercel cron)
    ▸ agriculture/pmkisan-beneficiaries.ts
    ▸ wildlife/ntca-tigers.ts
    ▸ science/isro-launches.ts       (event-driven poll)
  - Manually trigger each from admin; verify rows appear in IndiaIndicator.
  - LOCAL COMMIT: "feat(india): scraper framework + 6 demo scrapers"

PHASE 8  · WIRE REMAINING ~40 SCRAPERS                  (~240 min)
  - Build the remaining ~40 scraper files (section 5).
  - Each scraper:
    ▸ Has a _registry.ts entry
    ▸ Has unit tests for the parser (mock HTML/PDF input → expected metric output)
    ▸ Manually triggered once from admin to verify it actually works against the live source
  - For any source that BLOCKS or REQUIRES JS:
    ▸ Mark `requiresBrowser: true`
    ▸ Add an Apify rag-web-browser caller path (don't add Puppeteer)
    ▸ If even Apify doesn't work, mark scraper isActive: false and 
      add a TODO note. The metric stays as "Awaiting first sync".
  - LOCAL COMMIT: "feat(india): all module scrapers wired"
  - LOCAL COMMIT (separate): "test(india): scraper parser unit tests"
```

Add these new phases after Phase 11:

```
PHASE 12 · CRON ACTIVATION & MONITORING                 (~45 min)
  - Add cron entries to vercel.json for the ~3 Vercel-hosted scrapers.
  - Update Dockerfile.scraper / Railway scraper to load the India 
    scraper registry and schedule via node-cron.
  - Verify via Railway logs that schedules register correctly (do 
    NOT wait for the actual cron tick — fast-forward by manual trigger).
  - Confirm AdminAlert fires by deliberately failing one scraper.
  - LOCAL COMMIT: "feat(india): cron activation + alert wiring"

PHASE 13 · FIRST PRODUCTION DRY-RUN                     (~30 min)
  - Walk through the entire IndiaScraperConfig table in admin.
  - Manually trigger every scraper at least once (rate-limit will 
    naturally space them).
  - Take note of any scraper that fails — fix obvious bugs, mark 
    site-blocking ones as isActive:false with a note.
  - Verify /en/india now shows real data (not seeded stubs).
  - LOCAL COMMIT: "chore(india): first dry-run results"

[ Stop here. Do NOT git push until Jayanth says push. ]
```

---

## 13 · ZERO-HARDCODED-DATA AUDIT (RUN BEFORE FINISHING)

A grep-based check Claude Code MUST run before reporting done:

```bash
# 1. No raw numbers in IndiaPage.tsx or any module component beyond layout/sizing
rg -n "\d{4,}" src/components/india/modules/ \
  | grep -v -E "(z-index|width|height|max-w|min-w|px-|py-|w-\d|h-\d|rounded|tracking)"

# 2. No "TODO_VERIFY" left in any seed file
rg -n "TODO_VERIFY" prisma/

# 3. No district / state names hardcoded in India scrapers
rg -n "(Bengaluru|Mandya|Mumbai|Pune|Karnataka)" src/scrapers/india/

# 4. Every module in INDIA_MODULES with status=live has scraperKeys.length > 0
node -e "
  const mods = require('./src/lib/india/india-modules.ts').INDIA_MODULES;
  const broken = mods.filter(m => m.status === 'live' && (!m.scraperKeys || m.scraperKeys.length === 0));
  if (broken.length) { console.error('LIVE MODULES WITHOUT SCRAPERS:', broken.map(b=>b.slug)); process.exit(1); }
  console.log('OK: all live modules have scrapers');
"

# 5. Every scraperKey in modules exists in the scraper registry
node -e "/* same idea, cross-check */"

# 6. No 'scraper' / 'scraping' / 'scraped' word in user-facing strings
rg -ni "scrap" src/dictionaries/ src/components/india/
# Should return ZERO matches (only internal code/files may use the word)
```

If any of these fails, the build is not done. Fix and re-run.

---

## 14 · COST IMPACT

- **Railway runtime:** existing scraper container already runs 24/7. Adding ~40 new scheduled jobs adds negligible CPU because they fire monthly/quarterly, not constantly. Estimated additional Railway cost: **₹0–200/month**.
- **Neon / Postgres:** ~45 ScraperRun rows per scraper per year + IndiaIndicator (~200 metrics) + IndiaTimeSeries (~6 modules × 60 points = 360 rows). **Negligible** vs existing district data.
- **Upstash Redis:** ~45 cached responses, max 7-day TTL. **Negligible.**
- **Vercel:** the ~3 lightweight scrapers add 3 new cron triggers — within the Vercel Pro cron quota.
- **Alert email volume:** Resend stays well within free tier even if every scraper failed weekly.

**Net: this build is essentially free at run-time.** The cost is engineering time, not infrastructure.

---

## 15 · LEGAL ESCALATION TABLE

For each module category, the source-of-truth and what we're NOT allowed to do:

| Category | Allowed sources only | Hard NOT allowed |
|---|---|---|
| Defence | mod.gov.in, indiabudget.gov.in (Demand 17/19/20), pib.gov.in PIB releases tagged Defence | Wikipedia, news articles, GlobalFirepower, defence-blogs, social-media leaks. No troop/base/inventory data beyond what MoD has publicly released. |
| Elections | eci.gov.in, rajyasabha.nic.in, sansad.in | Party manifestos, opinion polls, news articles, Wikipedia summaries during MCC. |
| Health | mohfw.gov.in, pmjay.gov.in, uwin.mohfw.gov.in, nha.gov.in, rchiips.org (NFHS) | Hospital review sites, doctor directories, individual patient outcomes. |
| Justice | njdg.ecourts.gov.in, ncrb.gov.in, bprd.nic.in | Individual case details, judgment text, news commentary. |
| Crime | ncrb.gov.in only | News-based crime trackers, social-media reports. |
| Census/Demographics | censusindia.gov.in, mospi.gov.in (SRS) | Estimates from think-tanks unless cited by a govt report we link to. |
| Economy | mospi.gov.in, rbi.org.in, eaindustry.nic.in (DPIIT), dgft.gov.in, commerce.gov.in | Bloomberg, Reuters, broker reports. |
| Budget | indiabudget.gov.in, cga.nic.in, gstcouncil.gov.in | Pre-budget speculation, news interpretations. |
| Wildlife | fsi.nic.in, ntca.gov.in, wii.gov.in, moef.gov.in | iNaturalist, eBird, Wikipedia counts. |

> **Pattern:** for every sensitive value, we go upstream to the ministry that issued it. If a ministry doesn't publish the data, we don't display the metric — we mark the module `coming_soon` until they do.

---

## 16 · WHAT JAYANTH DOES NEXT

1. **Save this file** to `Forthepeople/32-India-Dashboard-Scrapers-Plan.md` in your vault (Obsidian MCP is down — manual save).
2. **Open Claude Code (Antigravity).**
3. **Paste file 31 first** (the build prompt). Have Claude Code execute Phases 0-4.
4. **Then paste file 32** (this file). Have Claude Code execute Phases 5, 8, 12, 13 (which replace/extend file 31's phases).
5. **Stay in chat with this Claude project** for any decisions Claude Code surfaces (e.g., a portal that blocks our UA — choose: Apify wrapper / pause scraper / skip module).
6. **Don't push until you say push.**

---

**END OF PLAN.** Pair with file 31 — together they're the complete build spec.
