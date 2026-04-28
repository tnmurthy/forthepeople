# 31 — India Dashboard Build · Claude Code Prompt
**Owner:** Jayanth M B · **Created:** 27 Apr 2026 · **Status:** Ready to paste into Claude Code · **Save to:** `Forthepeople/31-India-Dashboard-Build-Prompt.md`

> **Purpose:** This is the canonical, ready-to-paste Claude Code prompt to demolish the current `/en/india-detail` page and build a comprehensive, modular, scalable India National Dashboard at `/en/india`. The new page becomes the destination of the homepage's "Explore the whole India" CTA. Everything below is a single prompt; it can be split per phase if context window forces it.

> **Canonical context:** Read `docs/LIVE-STATE.md` first, then this file, then `Forthepeople/32-India-Dashboard-Scrapers-Plan.md`. Companion docs: `26-29` cover sub-product details.

> **PAIRING NOTE:** This file (31) covers page architecture, modules, layout, voting, legal disclaimers. File 32 covers the live-data scraping architecture that replaces the static-seed approach in section 15 below. **You MUST execute 32's phases (5, 8, 12, 13) instead of this file's original phases 5 and 8.** Read both files before starting.

---

## 0 · CONTEXT (PASTE-IN HEADER FOR CLAUDE CODE)

```
You are working on ForThePeople.in — India's first free, citizen transparency 
platform. Stack: Next.js 16, TypeScript, Tailwind v4, Prisma 7.5 (PrismaPg), 
PostgreSQL (Neon, shared), Upstash Redis, Vercel Pro, Railway scraper. 
Light theme: #FAFAF8 bg, Plus Jakarta Sans, JetBrains Mono for numbers, 
#2563EB accent, 1px #E8E8E4 borders, Linear.app aesthetic.

Goal of this session: replace the current /en/india-detail page with a new 
modular, dense, scalable India National Dashboard at /en/india. Keep the 
existing valuable blocks (latest news, new districts strip, district vote, 
KPI tiles, Royal Contributor). Add 17 new content sections covering all 
national dimensions: demographics, economy, budget, agriculture, livestock 
& dairy, wildlife & forests, infrastructure, energy, health, education, 
defence (PUBLIC DATA ONLY), justice, elections, science & space, foreign 
trade, tourism & heritage, sports. Add a "Vote for the next India module" 
widget mirroring the existing district vote pattern. Architect the code so 
new modules can be registered with one entry in a registry file — no page 
edits required. Update the homepage's "Explore the whole India" CTA to 
point here. DO NOT push to production. Commit locally only.

ZERO HARDCODED DATA. Every numeric value rendered on /en/india must come 
from the database, populated by a scraper running on its own cadence (see 
file 32 for per-module schedule). Seed files only seed truly constitutional 
constants (states count, UTs count, geographic area, scheduled languages).
```

---

## 1 · MANDATORY FILE READS — DO THESE FIRST

Before writing any code, read each of these files. Do not skip any.

```
✅ docs/BLUEPRINT-UNIFIED.md
✅ docs/FORTHEPEOPLE-SKILL-UPDATED.md
✅ docs/DISTRICT-EXPANSION-SKILL.md
✅ docs/AI-NEWS-INTELLIGENCE-SKILL.md
✅ docs/SCALING-CHECKLIST.md
✅ docs/LIVE-STATE.md
✅ Forthepeople/31-India-Dashboard-Build-Prompt.md  (this file)
✅ Forthepeople/32-India-Dashboard-Scrapers-Plan.md (scraping companion)
✅ src/app/[locale]/india-detail/page.tsx           (the page being replaced)
✅ src/app/[locale]/page.tsx                        (homepage; "Explore the whole India" CTA lives here)
✅ src/app/[locale]/[state]/[district]/page.tsx     (study existing district page structure)
✅ src/app/[locale]/[state]/[district]/overview/page.tsx
✅ src/components/banners/DataSourceBanner.tsx
✅ src/components/banners/EmptyState.tsx            (or similar — locate)
✅ src/components/feedback/*                        (feature voting components — to mirror)
✅ src/components/layout/Header.tsx
✅ src/components/layout/Footer.tsx
✅ src/lib/constants/state-config.ts
✅ src/lib/constants/districts.ts
✅ src/lib/ai-provider.ts
✅ src/scrapers/                                    (study existing scraper patterns)
✅ Dockerfile.scraper                               (Railway scraper container)
✅ vercel.json                                      (existing cron schedules)
✅ src/dictionaries/en.json
✅ src/dictionaries/kn.json
✅ prisma/schema.prisma
✅ next.config.ts
✅ src/app/sitemap.ts
✅ src/app/robots.ts
```

After reading, write a short audit (5–10 bullets max) confirming:
- The current `/en/india-detail` blocks you intend to preserve
- The DataSourceBanner contract you'll reuse
- The voting component pattern from `feedback/*`
- The headline pattern from district pages you'll copy
- The existing scraper conventions you'll mirror in `src/scrapers/india/`

---

## 2 · DO NOT MODIFY (HARD RULES)

```
❌ Do not modify any file under src/app/[locale]/[state]/  (district pages)
❌ Do not modify existing scrapers — ADD new India-only scrapers under src/scrapers/india/
❌ Do not modify the existing voting/feedback components — IMPORT and REUSE them
❌ Do not modify map components (DrillDownMap, IndiaStatesMap, TalukMap)
❌ Do not modify Prisma models that are in active use by district pages
   (Add new models; do not alter/rename existing ones)
❌ Do not change LiveTickerStrip on the homepage
❌ Do not touch admin-area files except to add the new "India Scrapers" tab
❌ Do not add ioredis, bullmq, node-cron-in-vercel, puppeteer
   (Railway already uses node-cron — extend it, don't duplicate)
❌ Do not call Anthropic / Gemini APIs directly — use callAI() from ai-provider.ts
❌ Do not add a separate India layout that breaks Header/Footer rendering
❌ Do not introduce a server-side timer/interval that runs every second
❌ Do not store budget values in Crores — store Rupees, divide by 1e7 in UI
❌ Do not hardcode any data point that should come from DB or live API
❌ Do not seed numeric values that change over time — wire a scraper instead (see file 32)
```

---

## 3 · DO NOT DEPLOY

```
🚨 This is a major build. Test EVERYTHING locally first.
🚨 Do NOT run `git push origin main` at the end of any phase.
🚨 Commit locally per phase: git add . && git commit -m "feat(india): <phase>".
🚨 Wait for Jayanth's explicit instruction "push now" before pushing.
🚨 Do not run `npx vercel --prod`.
🚨 Do not trigger any cron from this session except via the admin "Run now" button for QA.
🚨 If anything in this prompt would create legal risk (defamation, govt logos, 
   classified data, copyrighted images), stop and ask Jayanth in chat first.
```

---

## 4 · LEGAL GUARDRAILS — ENFORCE IN EVERY MODULE

The India page is the most legally exposed page on the platform. Apply ALL of these rules:

```
✅ Top of page: persistent amber banner (existing pattern):
   "ForThePeople.in is NOT an official government website. Data aggregated 
    from official portals (NDSAP), accredited research institutions, and 
    verified public sources. Always verify at the original source."

✅ Every module card: DataSourceBanner at the bottom
   (source name, source URL, last updated, next refresh)

✅ Every numeric value: traceable to a .gov.in / .nic.in / NDSAP / 
   peer-reviewed institutional source. NO fabrication. If a number can't 
   be verified, mark the field DATA_UNAVAILABLE — do not omit silently.

❌ NEVER use: Ashoka emblem, state seals, ministry logos, Indian flag as 
   decoration. Use only the existing tricolor dot motif (orange/grey/green) 
   that already appears on the FTP logo, and only sparingly.

❌ NEVER use the word "scraper / scraping / scraped" anywhere user-facing.
   Use: "sourced from", "aggregated from", "collected from", "data from".
   Internal code/files/comments may use "scraper" freely.

❌ NEVER show classified, operational, or strategic information in the 
   Defence section. ONLY publicly disclosed Ministry of Defence figures 
   (budget, personnel as released, exports as announced, DPSU listed-company 
   data). NO troop deployments. NO base locations. NO weapons inventory 
   beyond what MoD has publicly announced.

❌ NEVER reproduce news article paragraphs. Headline + 1-line snippet + 
   source link only — preserve existing pattern.

❌ NEVER show wildlife / heritage / sports photos that aren't either: 
   (a) CC-licensed (Wikimedia / PIB), (b) your own, or (c) sourced from 
   the official portal that owns them with attribution.

❌ NEVER suggest a citizen take a specific political action. The platform 
   is information-only. Frame everything as "here is the data" — never 
   "here is what you should do."

✅ Per-section disclaimers (inline italic, smaller font) for: Defence, 
   Health, Elections, Justice. Exact text below in section specs.

✅ During Model Code of Conduct (election period), the Elections section 
   must show an additional ECI non-endorsement banner. Add a feature flag:
   process.env.NEXT_PUBLIC_ELECTION_MODE === 'true' triggers it.
```

---

## 5 · ROUTE & REDIRECT STRATEGY

```
NEW ROUTE:    /en/india           (canonical)
OLD ROUTE:    /en/india-detail    (deprecated)

ACTIONS:
1. Create src/app/[locale]/india/page.tsx (new file).
2. After Phase 5 verification, DELETE src/app/[locale]/india-detail/page.tsx.
3. Add a 308 permanent redirect in next.config.ts:
     /en/india-detail → /en/india
     /kn/india-detail → /kn/india
     (And catch-all locale variants if any.)
4. Update src/app/sitemap.ts: replace any india-detail entry with /en/india.
5. Update src/app/[locale]/page.tsx: change the "Explore the whole India" 
   button href from "/en/india-detail" to "/en/india".
6. Search the codebase for any other references: rg "india-detail" — 
   update each occurrence.
7. Update src/dictionaries/en.json and kn.json: any "indiaDetail" key → 
   "india" (and update copy if needed).
```

---

## 6 · DATABASE SCHEMA — ADDITIONS ONLY

Add the following Prisma models. **DO NOT alter existing models.** Run `npx prisma migrate dev --name india_dashboard` after adding. **Note: scraper-related models (`IndiaScraperConfig`, `IndiaScraperRun`) live in file 32 — add them in Phase 5.**

```prisma
// ──────────────────────────────────────────────────────────────
// INDIA NATIONAL DASHBOARD — flexible indicator + time-series store
// ──────────────────────────────────────────────────────────────

/// One indicator value (latest snapshot) for an India-level metric.
/// Multiple snapshots over time → IndiaTimeSeries.
/// Populated by scrapers — NEVER hardcoded except for constitutional constants.
model IndiaIndicator {
  id            String   @id @default(cuid())
  moduleSlug    String   // 'demographics', 'economy', 'budget', etc.
  metricKey     String   // 'population_total', 'gdp_nominal_inr', 'forest_cover_pct'
  metricLabel   String   // 'Total Population', 'Nominal GDP (₹)'
  numericValue  Decimal? @db.Decimal(20, 4)
  textValue     String?
  unit          String?  // '₹ lakh crore', '%', 'million tonnes', 'count'
  asOfDate      DateTime // the source's reporting date, NOT the scrape time
  source        String   // 'MoSPI', 'RBI', 'Census of India', etc.
  sourceUrl     String   // exact URL from .gov.in / .nic.in
  notes         String?  @db.Text
  displayOrder  Int      @default(0)
  fetchedAt     DateTime @default(now())  // when our scraper last touched this
  updatedAt     DateTime @updatedAt

  @@unique([moduleSlug, metricKey])
  @@index([moduleSlug])
  @@index([metricKey])
}

/// Historical / trend values for charts.
model IndiaTimeSeries {
  id          String   @id @default(cuid())
  moduleSlug  String
  metricKey   String
  date        DateTime
  value       Decimal  @db.Decimal(20, 4)
  unit        String?
  source      String
  sourceUrl   String

  @@unique([moduleSlug, metricKey, date])
  @@index([moduleSlug, metricKey])
}

/// State-level rows used inside a national module 
/// (e.g., top 5 states by GSDP, ranked literacy).
model IndiaStateBreakdown {
  id          String   @id @default(cuid())
  moduleSlug  String
  metricKey   String
  stateSlug   String   // matches existing state slugs
  stateName   String
  value       Decimal  @db.Decimal(20, 4)
  unit        String?
  rank        Int?
  asOfDate    DateTime
  source      String
  sourceUrl   String

  @@unique([moduleSlug, metricKey, stateSlug])
  @@index([moduleSlug, metricKey])
}

/// User-suggested India modules with vote counts. 
/// Mirrors existing district-vote pattern.
model IndiaModuleSuggestion {
  id            String   @id @default(cuid())
  title         String   // 'Mining Royalty Tracker', 'Climate Commitments'
  description   String?  @db.Text
  category      String?  // optional grouping suggestion
  voteCount     Int      @default(0)
  status        String   @default("proposed") 
                         // proposed | shortlisted | in_progress | live | declined
  submittedBy   String?  // ipHash of submitter (no PII)
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  votes         IndiaModuleVote[]

  @@index([voteCount])
  @@index([status])
}

model IndiaModuleVote {
  id            String   @id @default(cuid())
  suggestionId  String
  ipHash        String   // hashed IP, NOT raw — privacy
  votedAt       DateTime @default(now())
  suggestion    IndiaModuleSuggestion @relation(fields: [suggestionId], references: [id], onDelete: Cascade)

  @@unique([suggestionId, ipHash])
  @@index([suggestionId])
}
```

> **Why this design:** The `(moduleSlug, metricKey)` keying lets a scraper add a new module simply by inserting rows — no schema migration. `IndiaStateBreakdown` powers the state-leaderboard widgets without joining 36 tables. `IndiaModuleSuggestion + IndiaModuleVote` mirrors the existing district-suggestion pattern so the voting UI can be cloned with minimal changes.

---

## 7 · MODULE REGISTRY — THE SCALABILITY KEY

The page must be **driven by a registry**, not by 17 hardcoded sections. Adding a new module = adding one entry. Create:

**File:** `src/lib/india/india-modules.ts`

```typescript
export type IndiaModuleCategory =
  | "snapshot"
  | "demographics"
  | "economy"
  | "budget"
  | "agriculture"
  | "livestock"
  | "wildlife"
  | "infrastructure"
  | "energy"
  | "health"
  | "education"
  | "defence"
  | "justice"
  | "elections"
  | "science"
  | "trade"
  | "tourism"
  | "sports"
  | "custom";          // future-proofing

export type IndiaModuleStatus = "live" | "beta" | "coming_soon";

export interface IndiaModuleSource {
  name: string;
  url: string;        // must be .gov.in / .nic.in / NDSAP / accredited
  type: "API" | "Static" | "Collected" | "RSS" | "Institutional";
  refresh: string;    // 'Daily', 'Weekly', 'Monthly', 'Quarterly', 'Annual'
}

export interface IndiaModuleDef {
  slug: string;                // 'demographics-population'
  category: IndiaModuleCategory;
  title: string;               // 'Population & Demographics'
  icon: string;                // emoji (or lucide icon name)
  tagline: string;             // one-line description
  description: string;         // longer description for the section
  status: IndiaModuleStatus;
  displayOrder: number;        // controls top-to-bottom order on the page
  sources: IndiaModuleSource[];
  componentName: string;       // matches a key in src/components/india/modules/
  legalNote?: string;          // inline italic disclaimer for sensitive sections
  hasStateBreakdown?: boolean; // shows top-5/bottom-5 widget
  hasTimeSeries?: boolean;     // shows trend line
  scraperKeys: string[];       // which scrapers populate this (see file 32)
}

export const INDIA_MODULES: IndiaModuleDef[] = [
  /* See section 8 below for the canonical list. */
];

export function getLiveIndiaModules(): IndiaModuleDef[] {
  return INDIA_MODULES.filter(m => m.status !== "coming_soon")
                      .sort((a, b) => a.displayOrder - b.displayOrder);
}

export function getComingSoonIndiaModules(): IndiaModuleDef[] {
  return INDIA_MODULES.filter(m => m.status === "coming_soon")
                      .sort((a, b) => a.displayOrder - b.displayOrder);
}

export function getIndiaCategories(): IndiaModuleCategory[] {
  return Array.from(new Set(INDIA_MODULES.map(m => m.category)));
}
```

The page's section nav is generated from `getLiveIndiaModules()`. The "Coming Soon" rail at the bottom is generated from `getComingSoonIndiaModules()`. **Adding a module later = one entry in this array + one component file + one or more scraper files (file 32).**

---

## 8 · CANONICAL MODULE LIST (REGISTER ALL OF THESE)

Register all of these in `INDIA_MODULES`. Set `status: "live"` only for modules where the scraper successfully populated at least 1 IndiaIndicator row this session; everything else starts as `"coming_soon"`.

| # | slug | category | title | icon | initial status | sources |
|---|------|----------|-------|------|---------------------|---------|
| 1 | `national-snapshot` | snapshot | National Snapshot | 🇮🇳 | live | MoSPI, Census, LGD, MHA |
| 2 | `demographics-population` | demographics | Population & Demographics | 👥 | live | censusindia.gov.in, mospi.gov.in, SRS |
| 3 | `economy-gdp` | economy | Economy & GDP | 📈 | live | mospi.gov.in, rbi.org.in |
| 4 | `economy-inflation` | economy | Inflation & Prices | 🛒 | live | mospi.gov.in, dpiit (WPI) |
| 5 | `economy-employment` | economy | Employment (PLFS) | 💼 | live | mospi.gov.in/plfs |
| 6 | `budget-union` | budget | Union Budget | 🏛️ | live | indiabudget.gov.in, cga.nic.in |
| 7 | `budget-gst` | budget | GST Collections | 🧾 | live | gstcouncil.gov.in |
| 8 | `agriculture-production` | agriculture | Crop Production | 🌾 | live | agricoop.nic.in, agmarknet |
| 9 | `agriculture-plantation` | agriculture | Plantation Crops | 🍃 | coming_soon | Tea/Coffee/Rubber/Spices Boards |
| 10 | `agriculture-pmkisan` | agriculture | PM-KISAN | 💰 | live | pmkisan.gov.in |
| 11 | `livestock-census` | livestock | Livestock & Dairy | 🐄 | coming_soon | dahd.nic.in, nddb.coop |
| 12 | `livestock-fisheries` | livestock | Fisheries | 🐟 | coming_soon | dof.gov.in |
| 13 | `wildlife-forests` | wildlife | Forests & Wildlife | 🌳 | live | fsi.nic.in, projecttiger.nic.in |
| 14 | `wildlife-tigers` | wildlife | Tiger Conservation | 🐅 | live | NTCA, projecttiger.nic.in |
| 15 | `wildlife-protected-areas` | wildlife | National Parks & Sanctuaries | 🦁 | live | wii.gov.in |
| 16 | `infra-roads` | infrastructure | Roads & Highways | 🛣️ | live | morth.nic.in, NHAI |
| 17 | `infra-railways` | infrastructure | Railways | 🚆 | live | indianrailways.gov.in |
| 18 | `infra-aviation` | infrastructure | Aviation | ✈️ | live | dgca.gov.in |
| 19 | `infra-ports` | infrastructure | Ports & Shipping | 🚢 | coming_soon | shipmin.gov.in, IPA |
| 20 | `infra-telecom` | infrastructure | Telecom & Internet | 📡 | live | trai.gov.in |
| 21 | `infra-smart-cities` | infrastructure | Smart Cities Mission | 🏙️ | coming_soon | smartcities.gov.in |
| 22 | `energy-power` | energy | Power Generation | ⚡ | live | cea.nic.in |
| 23 | `energy-renewables` | energy | Renewable Energy | ☀️ | live | mnre.gov.in |
| 24 | `energy-fuels` | energy | Petroleum & Fuels | 🛢️ | coming_soon | ppac.gov.in |
| 25 | `energy-coal` | energy | Coal | ⚫ | coming_soon | coal.nic.in |
| 26 | `health-overview` | health | Health Indicators | 🏥 | live | mohfw.gov.in, NFHS-5 |
| 27 | `health-pmjay` | health | Ayushman Bharat (PM-JAY) | 🩺 | live | pmjay.gov.in |
| 28 | `health-immunisation` | health | Vaccination & U-WIN | 💉 | live | cowin.gov.in, U-WIN |
| 29 | `education-schools` | education | Schools (UDISE+) | 🏫 | live | udiseplus.gov.in |
| 30 | `education-higher` | education | Higher Education | 🎓 | live | ugc.gov.in, aicte-india.org |
| 31 | `education-skills` | education | Skill India | 🛠️ | coming_soon | msde.gov.in, pmkvy |
| 32 | `defence-budget` | defence | Defence Budget (Public) | 🛡️ | live | mod.gov.in, indiabudget.gov.in |
| 33 | `defence-exports` | defence | Defence Exports | 📦 | live | mod.gov.in (PIB) |
| 34 | `defence-dpsu` | defence | DPSU Performance | 🏭 | coming_soon | HAL/BEL/Mazagon listed-co. annual reports |
| 35 | `justice-pendency` | justice | Court Pendency | ⚖️ | live | njdg.ecourts.gov.in |
| 36 | `justice-crime` | justice | NCRB Crime Statistics | 🚔 | live | ncrb.gov.in |
| 37 | `justice-police` | justice | Police Strength (BPRD) | 👮 | live | bprd.nic.in |
| 38 | `justice-prisons` | justice | Prison Statistics | 🔒 | coming_soon | NCRB Prison Stats |
| 39 | `elections-loksabha` | elections | Lok Sabha | 🗳️ | live | eci.gov.in |
| 40 | `elections-rajyasabha` | elections | Rajya Sabha | 🏛️ | live | rajyasabha.nic.in |
| 41 | `elections-turnout` | elections | Voter Turnout Trends | 📊 | live | eci.gov.in |
| 42 | `science-isro` | science | ISRO Missions | 🚀 | live | isro.gov.in |
| 43 | `science-rd` | science | R&D & Patents | 🔬 | live | dst.gov.in, ipindia.gov.in |
| 44 | `science-startups` | science | Startups & Unicorns | 🦄 | live | startupindia.gov.in (DPIIT) |
| 45 | `science-digital` | science | Digital India (UPI, Aadhaar) | 📱 | live | NPCI, UIDAI |
| 46 | `trade-overview` | trade | Foreign Trade | 🌐 | live | commerce.gov.in, DGFT |
| 47 | `trade-fdi` | trade | FDI & Investment | 💼 | coming_soon | dpiit.gov.in |
| 48 | `trade-diaspora` | trade | Diaspora & Remittances | ✈️ | coming_soon | mea.gov.in, RBI |
| 49 | `tourism-overview` | tourism | Tourism Statistics | 🧳 | live | tourism.gov.in |
| 50 | `tourism-heritage` | tourism | UNESCO & ASI Heritage | 🏛️ | live | asi.nic.in |
| 51 | `tourism-gi-tags` | tourism | GI Tags Registry | 🏷️ | coming_soon | ipindia.gov.in |
| 52 | `sports-olympics` | sports | Olympic Performance | 🏅 | live | IOA, sportsauthorityofindia.nic.in |
| 53 | `sports-khelo-india` | sports | Khelo India | 🏃 | coming_soon | KheloIndia |

> **Total: 53 modules.** ~28 launch as `live` once their scraper has succeeded; ~25 launch as `coming_soon` with sources declared. Adding modules #54+ later = registry entry + scraper file only.

---

## 9 · PAGE LAYOUT (TOP TO BOTTOM)

```
┌──────────────────────────────────────────────────────────────────────┐
│  1. SLIM STATUS BAR  (existing pattern: India · Last updated · Live) │
├──────────────────────────────────────────────────────────────────────┤
│  2. AMBER LEGAL DISCLAIMER STRIP  (always visible, sticky-aware)     │
├──────────────────────────────────────────────────────────────────────┤
│  3. HEADER  (existing global Header — unchanged)                     │
├──────────────────────────────────────────────────────────────────────┤
│  4. HERO BLOCK                                                       │
│     "🇮🇳 INDIA AT A GLANCE"                                          │
│     "India in one page."                                             │
│     "10 districts live · 29 dashboards/district · 290+ live points"  │
│     6-tile NATIONAL SNAPSHOT (Pop · GDP · Area · States · Districts ·│
│     Languages) — JetBrains Mono numbers, source per tile              │
├──────────────────────────────────────────────────────────────────────┤
│  5. NEW DISTRICTS THIS MONTH  (KEEP EXISTING — Pune, Lucknow, Hyd)   │
├──────────────────────────────────────────────────────────────────────┤
│  6. VOTE FOR THE NEXT DISTRICT  (KEEP EXISTING)                      │
├──────────────────────────────────────────────────────────────────────┤
│  7. LATEST FROM INDIA  (KEEP EXISTING — news strip)                  │
├──────────────────────────────────────────────────────────────────────┤
│  8. STICKY SECTION NAV  (NEW — scroll-spy chips, generated from      │
│     getLiveIndiaModules())                                            │
├──────────────────────────────────────────────────────────────────────┤
│  9. INDIA AT A GLANCE — TODAY  (KEEP — expand from 5 to 12 KPIs)     │
├──────────────────────────────────────────────────────────────────────┤
│ 10. ALL MODULE SECTIONS  (NEW — one band per module, looped from     │
│     INDIA_MODULES registry)                                           │
│      → Demographics                                                   │
│      → Economy                                                        │
│      → Budget                                                         │
│      → Agriculture                                                    │
│      → Livestock                                                      │
│      → Wildlife                                                       │
│      → Infrastructure                                                 │
│      → Energy                                                         │
│      → Health                                                         │
│      → Education                                                      │
│      → Defence  (extra inline disclaimer)                             │
│      → Justice                                                        │
│      → Elections (extra MCC banner if NEXT_PUBLIC_ELECTION_MODE)      │
│      → Science                                                        │
│      → Trade                                                          │
│      → Tourism                                                        │
│      → Sports                                                         │
├──────────────────────────────────────────────────────────────────────┤
│ 11. VOTE FOR THE NEXT INDIA MODULE  (NEW — mirrors district vote)    │
│     - Top 3 voted module suggestions with vote count                 │
│     - "Suggest a module" textarea (one-line input + submit)          │
│     - "Request your module →" link to feature page                   │
├──────────────────────────────────────────────────────────────────────┤
│ 12. COMING SOON RAIL  (KEEP — but driven by registry now)            │
├──────────────────────────────────────────────────────────────────────┤
│ 13. ROYAL CONTRIBUTOR OF INDIA · ₹9,999/month  (KEEP EXISTING)       │
├──────────────────────────────────────────────────────────────────────┤
│ 14. DATA SOURCES INDEX  (NEW — alphabetical table of every portal    │
│     cited on this page, with refresh cadence)                         │
├──────────────────────────────────────────────────────────────────────┤
│ 15. FOOTER  (existing global Footer — unchanged)                     │
└──────────────────────────────────────────────────────────────────────┘
```

---

## 10 · COMPONENT FILE STRUCTURE

Create exactly this tree. Do not deviate.

```
src/
├── app/
│   └── [locale]/
│       └── india/
│           ├── page.tsx                         (server component, generates metadata, renders <IndiaPage/>)
│           └── opengraph-image.tsx              (optional, for social previews)
│
├── components/
│   └── india/
│       ├── IndiaPage.tsx                        (client wrapper; orchestrates all sections)
│       ├── IndiaHero.tsx                        (the 6-tile national snapshot)
│       ├── IndiaSectionNav.tsx                  (sticky scroll-spy nav)
│       ├── IndiaTodaySnapshot.tsx               (12 KPI tiles — expanded from current 5)
│       ├── IndiaSectionBand.tsx                 (reusable wrapper around any module)
│       ├── IndiaStateLeaderboard.tsx            (top-5 / bottom-5 state widget)
│       ├── IndiaTimeSeriesChart.tsx             (line chart wrapper, recharts)
│       ├── IndiaModuleCard.tsx                  (single metric card with source)
│       ├── IndiaModuleSuggestVote.tsx           (NEW — voting widget for next module)
│       ├── IndiaComingSoonRail.tsx              (driven by registry)
│       ├── IndiaDataSourcesIndex.tsx            (bottom alphabetical table)
│       ├── IndiaLegalDisclaimer.tsx             (top amber strip; section-level inline)
│       └── modules/
│           ├── DemographicsModule.tsx
│           ├── EconomyGdpModule.tsx
│           ├── EconomyInflationModule.tsx
│           ├── EconomyEmploymentModule.tsx
│           ├── BudgetUnionModule.tsx
│           ├── BudgetGstModule.tsx
│           ├── AgricultureProductionModule.tsx
│           ├── AgriculturePmKisanModule.tsx
│           ├── WildlifeForestsModule.tsx
│           ├── WildlifeTigersModule.tsx
│           ├── WildlifeProtectedAreasModule.tsx
│           ├── InfraRoadsModule.tsx
│           ├── InfraRailwaysModule.tsx
│           ├── InfraAviationModule.tsx
│           ├── InfraTelecomModule.tsx
│           ├── EnergyPowerModule.tsx
│           ├── EnergyRenewablesModule.tsx
│           ├── HealthOverviewModule.tsx
│           ├── HealthPmJayModule.tsx
│           ├── HealthImmunisationModule.tsx
│           ├── EducationSchoolsModule.tsx
│           ├── EducationHigherModule.tsx
│           ├── DefenceBudgetModule.tsx
│           ├── DefenceExportsModule.tsx
│           ├── JusticePendencyModule.tsx
│           ├── JusticeCrimeModule.tsx
│           ├── JusticePoliceModule.tsx
│           ├── ElectionsLokSabhaModule.tsx
│           ├── ElectionsRajyaSabhaModule.tsx
│           ├── ElectionsTurnoutModule.tsx
│           ├── ScienceIsroModule.tsx
│           ├── ScienceRdModule.tsx
│           ├── ScienceStartupsModule.tsx
│           ├── ScienceDigitalModule.tsx
│           ├── TradeOverviewModule.tsx
│           ├── TourismOverviewModule.tsx
│           ├── TourismHeritageModule.tsx
│           └── SportsOlympicsModule.tsx
│
├── lib/
│   └── india/
│       ├── india-modules.ts                     (registry, the canonical list)
│       ├── india-sources.ts                     (Source registry — name, url, type)
│       ├── india-formatters.ts                  (₹ formatting, % formatting, etc.)
│       └── scraping-tiers.ts                    (see file 32)
│
├── scrapers/
│   └── india/                                   (see file 32 for full structure)
│
└── app/
    └── api/
        └── india/
            ├── snapshot/route.ts                (GET — top KPIs)
            ├── module/[slug]/route.ts           (GET — one module's data)
            ├── suggestions/route.ts             (GET list, POST new)
            └── suggestions/[id]/vote/route.ts   (POST — upvote)

prisma/
├── schema.prisma                                (additions in section 6 + file 32)
└── seed-india.ts                                (NEW — seeds ONLY constitutional constants + registry)
```

---

## 11 · MODULE COMPONENT CONTRACT

Every module file in `src/components/india/modules/` follows this exact contract. **All data comes from the API; nothing is hardcoded inside the component.**

```typescript
// Example: DemographicsModule.tsx
"use client";

import { IndiaSectionBand } from "../IndiaSectionBand";
import { IndiaModuleCard } from "../IndiaModuleCard";
import { IndiaStateLeaderboard } from "../IndiaStateLeaderboard";
import { IndiaTimeSeriesChart } from "../IndiaTimeSeriesChart";
import type { IndiaModuleDef } from "@/lib/india/india-modules";

interface Props {
  module: IndiaModuleDef;
  data: ModuleData;        // from /api/india/module/[slug]
}

export default function DemographicsModule({ module, data }: Props) {
  return (
    <IndiaSectionBand module={module}>
      {/* 1. Headline cards rendered FROM data only — no hardcoded numbers */}
      <div className="grid">
        {data.indicators.map(ind => (
          <IndiaModuleCard
            key={ind.metricKey}
            title={ind.metricLabel}
            value={ind.numericValue ?? ind.textValue}
            unit={ind.unit}
            asOfDate={ind.asOfDate}
            source={ind.source}
            sourceUrl={ind.sourceUrl}
          />
        ))}
      </div>

      {/* 2. Optional time series — also from data */}
      {module.hasTimeSeries && data.timeSeries?.length > 0 && (
        <IndiaTimeSeriesChart series={data.timeSeries} />
      )}

      {/* 3. Optional state breakdown — from data */}
      {module.hasStateBreakdown && data.stateBreakdown?.length > 0 && (
        <IndiaStateLeaderboard rows={data.stateBreakdown} />
      )}
    </IndiaSectionBand>
  );
}
```

**`IndiaSectionBand`** wraps every module with:
- Section anchor (`id={module.slug}`) so nav links work
- Icon + title + tagline header
- Status badge if not `live`
- Inline legal note if defined
- DataSourceBanner at the bottom (auto-built from `module.sources`)
- Empty-state handling: if no indicators in `data`, shows "Awaiting first sync — source: <name>" instead of fake numbers

This contract is **the pattern** — every new module is a copy of this skeleton with different field labels.

---

## 12 · API ROUTES

### `GET /api/india/snapshot`
Returns the 6 hero tiles + 12 today snapshot tiles + new districts list + latest news.
Cached 30 min in Redis.

### `GET /api/india/module/[slug]`
Returns: `{ indicators: [...], timeSeries: [...], stateBreakdown: [...], sources: [...], lastUpdated }`.
Cached per the module's refresh tier (see SCRAPING_TIERS in file 32).

### `GET /api/india/suggestions`
Lists `IndiaModuleSuggestion` rows ordered by `voteCount desc`, `createdAt asc`. Limit 20.

### `POST /api/india/suggestions`
Body: `{ title, description?, category? }`. Validates: 3–80 chars title, no URLs, no profanity (light filter). Hashes IP. Returns the new row.

### `POST /api/india/suggestions/[id]/vote`
Hashes IP, upserts `IndiaModuleVote`. Returns updated count. Rate-limit: 1 vote / suggestion / IP / day.

All POST routes use the existing admin IP middleware (`proxy.ts` — DO NOT modify, just import).

---

## 13 · STYLE & DESIGN TOKENS

```css
/* Reuse existing tokens — DO NOT introduce new colors. */
--bg-page:        #FAFAF8
--bg-card:        #FFFFFF
--bg-muted:       #F8FAFC
--bg-soft-blue:   #EFF6FF
--bg-amber-soft:  #FEF3C7
--border:         #E8E8E4
--text-primary:   #1A1A1A
--text-secondary: #4B4B4B
--text-muted:     #6B6B6B
--text-faint:     #9B9B9B
--accent-blue:    #2563EB
--accent-green:   #16A34A
--accent-amber:   #D97706
--accent-red:     #DC2626

/* Typography */
font-display: "Plus Jakarta Sans", system-ui, sans-serif
font-mono:    "JetBrains Mono", ui-monospace, monospace

/* Section bands */
section-padding-y:   64px desktop, 40px mobile
section-max-width:   1200px
section-divider:     1px solid var(--border)

/* Cards */
card-radius:         16px
card-padding:        24px
card-border:         1px solid var(--border)
card-hover-shadow:   0 1px 3px rgba(0,0,0,0.04)

/* KPI tiles (snapshot, today) */
tile-number-font:    JetBrains Mono, 36px (mobile 28px), weight 700
tile-label-font:     Plus Jakarta Sans, 11px, uppercase, letter-spacing 0.08em
tile-source-font:    Plus Jakarta Sans, 12px, color var(--text-faint)
```

**Density rule:** Each section band MUST contain at least 4 distinct visual elements (cards, charts, lists, tables) when its scraper has populated data. No section is allowed to be a single sentence with an empty state. If a section is `coming_soon`, render the `ComingSoonRail` slot at the bottom instead — do not give it a full band. If a `live` module's scraper has not yet succeeded, the band shows a single "Awaiting first sync — source: <name>. <link>" line.

---

## 14 · MOBILE BEHAVIOUR

```
< 480px   : single column everywhere; KPI grid → 2x3 instead of 6x1; 
            section nav becomes horizontal scroll chips (existing pattern)
480–768px : 2-col KPI; section bands stay single-column
768–1024px: 3-col KPI; charts at 100% width
≥ 1024px  : 6-col hero KPI; charts may go side-by-side in some modules
```

Use the existing breakpoint constants. No new media-query system.

---

## 15 · SEEDING POLICY (UPDATED — see file 32 for the live-data plan)

**OLD APPROACH (deprecated):** Seed ~80 indicators with verified static values.

**NEW APPROACH (canonical):** `prisma/seed-india.ts` seeds ONLY:

1. **Constitutional / static constants** (4 indicators only):
   - `national-snapshot` / `states_count` = 28 (Constitution)
   - `national-snapshot` / `uts_count` = 8 (Constitution)
   - `national-snapshot` / `geographic_area` = 32,87,263 km² (Surveyor General, near-static)
   - `national-snapshot` / `scheduled_languages` = 22 (8th Schedule)

2. **The `IndiaScraperConfig` registry** (one row per scraper — see file 32 §3).

3. **The 5 starter `IndiaModuleSuggestion` rows:**
   - Mining Royalty Tracker
   - Climate Commitments (NDC)
   - Pollution & Air Quality
   - MP Performance Index
   - Cooperative Sector Dashboard

**Everything else** is left empty for the scrapers (file 32) to populate on first run. The empty-state UI handles the gap until first sync.

```typescript
// prisma/seed-india.ts — minimal seed
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const STATIC_CONSTITUTIONAL = [
  {
    moduleSlug: "national-snapshot",
    metricKey: "states_count",
    metricLabel: "States",
    numericValue: 28,
    unit: "count",
    asOfDate: new Date("2024-01-01"),
    source: "Ministry of Home Affairs",
    sourceUrl: "https://www.mha.gov.in/",
  },
  {
    moduleSlug: "national-snapshot",
    metricKey: "uts_count",
    metricLabel: "Union Territories",
    numericValue: 8,
    unit: "count",
    asOfDate: new Date("2024-01-01"),
    source: "Ministry of Home Affairs",
    sourceUrl: "https://www.mha.gov.in/",
  },
  {
    moduleSlug: "national-snapshot",
    metricKey: "geographic_area",
    metricLabel: "Geographic Area",
    numericValue: 32_87_263,
    unit: "km²",
    asOfDate: new Date("2024-01-01"),
    source: "Surveyor General of India",
    sourceUrl: "https://surveyofindia.gov.in/",
  },
  {
    moduleSlug: "national-snapshot",
    metricKey: "scheduled_languages",
    metricLabel: "Scheduled Languages",
    numericValue: 22,
    unit: "count",
    asOfDate: new Date("1992-12-01"),
    source: "Constitution of India · 8th Schedule",
    sourceUrl: "https://legislative.gov.in/constitution-of-india/",
  },
];

const STARTER_SUGGESTIONS = [
  { title: "Mining Royalty Tracker",       category: "economy",   voteCount: 0 },
  { title: "Climate Commitments (NDC)",    category: "wildlife",  voteCount: 0 },
  { title: "Pollution & Air Quality",      category: "wildlife",  voteCount: 0 },
  { title: "MP Performance Index",         category: "elections", voteCount: 0 },
  { title: "Cooperative Sector Dashboard", category: "economy",   voteCount: 0 },
];

async function main() {
  // Upsert the 4 constitutional indicators
  for (const ind of STATIC_CONSTITUTIONAL) {
    await prisma.indiaIndicator.upsert({
      where: { moduleSlug_metricKey: { moduleSlug: ind.moduleSlug, metricKey: ind.metricKey } },
      update: {},
      create: ind,
    });
  }

  // Upsert starter suggestions
  for (const s of STARTER_SUGGESTIONS) {
    await prisma.indiaModuleSuggestion.upsert({
      where: { /* find unique handler */ id: undefined as any },
      create: s,
      update: {},
    });
  }

  // The IndiaScraperConfig registry seeding lives in file 32 §11.
  // Call seedScraperRegistry() here from src/scrapers/india/_registry.ts
}

main().finally(() => prisma.$disconnect());
```

The seed file is runnable as `npx tsx prisma/seed-india.ts` and idempotent.

---

## 16 · KEY UX DETAILS — DO NOT SKIP

```
1. SCROLL-SPY NAV
   - Sticky chips top-of-section, 56px below header.
   - Clicking a chip scroll-snaps to that section with smooth behaviour.
   - Active chip: blue background, white text. Inactive: white bg, grey text.
   - Mobile: horizontal-scroll chips (existing pattern from district sidebar).

2. KPI TILE
   - Large mono number, label above (uppercase, faint), source line below 
     (small, muted, link-coloured). 
   - Hover state: subtle border darken; reveal "as-of date" tooltip.
   - Click → smooth-scroll to the parent section anchor.

3. STATE LEADERBOARD WIDGET (used inside many modules)
   - Top-5 list with rank, state name, value, unit. 
   - Toggle: "Top 5" vs "Bottom 5". Default Top 5.
   - Each state name → links to /en/[state]. (Even if state is `coming_soon`, 
     route lands on the existing locked-state preview page — already exists.)

4. TIME-SERIES CHART
   - Recharts line chart. Y axis with unit suffix. X axis years/quarters.
   - Hover tooltip shows source + as-of-date for that data point.
   - 1Y / 5Y / 10Y / All toggle (default 5Y if data exists, else All).

5. EMPTY STATES
   - For status: coming_soon → DO NOT render an empty band. Render a compact 
     card under the Coming Soon Rail with: icon, title, "Sources: x · y · z", 
     "Expected: TBD", and a "Vote to prioritise" button.
   - For status: live but no data yet (scraper hasn't run successfully) → 
     render the band header + a single muted line: "Awaiting first sync — 
     source: <name>. <link>"
   - For status: live but stale (last successful scrape > 2× tier interval) → 
     show the cached value plus "⚠ Source unavailable; last fetch: <date>".

6. VOTE-FOR-NEXT-MODULE WIDGET
   - Mirrors the existing Vote for Next District UI byte-for-byte.
   - List of top 3 suggestions with vote counts.
   - "Suggest a module" inline form: 80-char input + 1-line description (optional).
   - On submit: optimistic UI, server validates, IP-hashed, rate-limited.
   - Success toast: "Thanks. Your idea is now visible to others to vote on."

7. COPY DOWNLOAD ("Export this section as CSV")
   - Phase 2 feature. Stub the button now (disabled with "Coming Soon" tooltip).

8. "WHY THIS PAGE?" PILL (existing on current page)
   - Keep, move to top-right of hero.
   - On click, opens a modal: "This page is the national-level companion to 
     district pages. It exists so every Indian can see the full picture of 
     their country in one place. Updated continuously from official portals."

9. PRINT STYLES (light)
   - Add @media print rules: hide nav, footer, voting; preserve sections + 
     numbers + sources. The page should be print-friendly for journalists 
     who export to PDF.

10. KEYBOARD ACCESSIBILITY
    - All section nav chips reachable by Tab. 
    - Section anchors land in viewport with proper focus offset.
    - Voting form: Enter to submit; Escape to cancel.
```

---

## 17 · PERFORMANCE & SCALE

```
- The /en/india page is high-traffic. Cache aggressively:
  ▸ Page-level: ISR with revalidate = 900 (15 min). 
  ▸ /api/india/snapshot:    Redis TTL 1800s (30 min).
  ▸ /api/india/module/*:    Redis TTL per module.refresh tier. Tiered:
                            DAILY=3600, WEEKLY=21600, MONTHLY=86400.
  ▸ /api/india/suggestions: Redis TTL 60s. POST invalidates.

- Image policy: do not use raw <img>. Use next/image with explicit width/height.
  All images must be Wikimedia/PIB CC-licensed or self-authored. Add an
  attribution line under each image.

- Lazy-load non-critical modules: react-server-component-friendly dynamic 
  imports for Defence, Justice, Science, Trade, Tourism, Sports (these sit 
  below the fold for >90% of users).

- Bundle budget for the page: keep the client bundle under 250 KB gzipped. 
  Add a CI check or at least a manual `next build` size review at the end.
```

---

## 18 · SEO & METADATA

```typescript
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "India in One Page — National Government Data Dashboard | ForThePeople.in",
    description:
      "Free, real-time dashboard of India's national indicators — population, GDP, " +
      "agriculture, infrastructure, health, education, defence (public), and more. " +
      "Sourced from official government portals under NDSAP. Independent citizen platform.",
    alternates: { 
      canonical: "https://forthepeople.in/en/india",
      languages: { "en": "/en/india", "kn": "/kn/india" }
    },
    openGraph: {
      title: "India in One Page",
      description: "Every key fact about India, sourced from .gov.in portals.",
      url: "https://forthepeople.in/en/india",
      siteName: "ForThePeople.in",
      type: "website",
    },
    twitter: { card: "summary_large_image" },
    keywords: [
      "India data", "India statistics", "India GDP", "India population",
      "India dashboard", "India transparency", "NDSAP", "ForThePeople.in"
    ],
  };
}
```

Add structured data (JSON-LD) of type `Dataset` for each section's primary metric — improves discoverability in Google Dataset Search.

---

## 19 · DICTIONARY ENTRIES

Add to `src/dictionaries/en.json` (and the same keys to `kn.json` with `TODO_TRANSLATE`):

```json
"india": {
  "title": "India in one page.",
  "subtitle": "Every key fact about your country, sourced from official government portals.",
  "hero": {
    "tag": "INDIA AT A GLANCE",
    "tiles": {
      "population": "Population",
      "gdp": "Nominal GDP",
      "area": "Geographic Area",
      "states": "States & UTs",
      "districts": "Districts",
      "languages": "Scheduled Languages"
    }
  },
  "nav": {
    "today": "Today",
    "demographics": "Demographics",
    "economy": "Economy",
    "budget": "Budget",
    "agriculture": "Agriculture",
    "livestock": "Livestock",
    "wildlife": "Wildlife",
    "infrastructure": "Infrastructure",
    "energy": "Energy",
    "health": "Health",
    "education": "Education",
    "defence": "Defence",
    "justice": "Justice",
    "elections": "Elections",
    "science": "Science",
    "trade": "Trade",
    "tourism": "Tourism",
    "sports": "Sports"
  },
  "suggestions": {
    "title": "Vote for the next India module",
    "subtitle": "Help us decide what to build next.",
    "suggest": "Suggest a module",
    "submitted": "Thanks — your idea is now visible to others to vote on.",
    "rateLimit": "You've already voted on this. Try tomorrow.",
    "request": "Request your module"
  },
  "comingSoon": {
    "title": "Coming Soon",
    "tag": "COMING SOON",
    "expected": "Expected",
    "voteToPrioritise": "Vote to prioritise"
  },
  "awaitingSync": {
    "title": "Awaiting first sync",
    "subtitle": "We will populate this section as soon as the source publishes."
  },
  "sources": {
    "title": "Data Sources",
    "subtitle": "Every portal cited on this page.",
    "lastUpdated": "Last updated",
    "refresh": "Refresh"
  },
  "disclaimers": {
    "top": "ForThePeople.in is NOT an official government website. Data aggregated from official portals (NDSAP), accredited research institutions, and verified public sources. Always verify at the original source.",
    "defence": "Data on this page is limited to information publicly disclosed by the Ministry of Defence, Press Information Bureau, and Parliamentary Q&A. ForThePeople.in does not publish, infer, or speculate on classified, operational, or strategic information.",
    "health": "Aggregated public-health statistics only. Personal health data and individual hospital outcomes are not published. Consult a registered medical practitioner for health decisions.",
    "elections": "Electoral data is for citizen information. ForThePeople.in does not endorse, predict, or campaign for any party or candidate.",
    "justice": "Aggregated case statistics from NJDG. Individual case details are not published.",
    "mcc": "Model Code of Conduct in effect. ForThePeople.in is non-partisan and complies with ECI guidelines."
  }
}
```

---

## 20 · PHASED EXECUTION ORDER

> **Phases 5, 8, 12, 13 are defined in file 32** and replace/extend the original Phase 5 / Phase 8 here. Use file 32's phasing for those numbers.

Execute strictly in this order. After each phase: commit locally + take a manual screenshot via `localhost:3000/en/india` for verification. Do NOT push.

```
PHASE 0  · CLEANUP & ROUTE SETUP                      (~30 min)
  - Read all files in section 1.
  - Add Prisma models from section 6. Run migration.
  - Create empty src/app/[locale]/india/page.tsx returning <h1>India</h1>.
  - Add 308 redirect /en/india-detail → /en/india in next.config.ts.
  - Update homepage button href in src/app/[locale]/page.tsx.
  - Update sitemap. Update dictionaries with the "india" key block.
  - Search & replace any other "india-detail" reference.
  - LOCAL COMMIT: "feat(india): scaffold /en/india route + redirect old path"

PHASE 1  · REGISTRY + LIB + API SCAFFOLD              (~45 min)
  - Create src/lib/india/india-modules.ts with full INDIA_MODULES array.
  - Create src/lib/india/india-sources.ts (canonical source list).
  - Create src/lib/india/india-formatters.ts.
  - Create src/lib/india/scraping-tiers.ts (from file 32 §1).
  - Create the 4 API routes in src/app/api/india/* (stubs returning empty arrays).
  - LOCAL COMMIT: "feat(india): module registry + api scaffold"

PHASE 2  · PAGE SHELL + HERO + DISCLAIMER             (~60 min)
  - Build IndiaPage.tsx (server-side data load via /api/india/snapshot).
  - Build IndiaLegalDisclaimer.tsx (top amber strip).
  - Build IndiaHero.tsx (6 KPI tiles).
  - Build IndiaSectionNav.tsx (sticky scroll-spy chips).
  - Wire up: /en/india renders disclaimer + hero + nav + an empty <main>.
  - LOCAL COMMIT: "feat(india): page shell + hero + section nav"

PHASE 3  · KEEP-EXISTING BLOCKS                       (~45 min)
  - Port the existing 4 blocks from /en/india-detail to /en/india:
    * New Districts This Month
    * Vote for the Next District
    * Latest from India (news strip)
    * India at a Glance — Today (expand from 5 to 12 KPIs)
  - These should render as new sub-components inside src/components/india/.
  - LOCAL COMMIT: "feat(india): preserve existing engagement blocks"

PHASE 4  · MODULE SECTION FRAMEWORK                   (~60 min)
  - Build IndiaSectionBand.tsx, IndiaModuleCard.tsx,
    IndiaTimeSeriesChart.tsx, IndiaStateLeaderboard.tsx,
    IndiaComingSoonRail.tsx, IndiaDataSourcesIndex.tsx.
  - Render every `live` module as a placeholder band with "Awaiting first sync".
  - The page should now scroll through ~28 visually-real bands.
  - LOCAL COMMIT: "feat(india): module band framework + placeholders"

PHASE 5  · → SEE FILE 32 §12 (scraper framework + 6 demo scrapers)

PHASE 6  · VOTE-FOR-NEXT-MODULE WIDGET                (~45 min)
  - Build IndiaModuleSuggestVote.tsx (mirrors district vote UI).
  - Wire /api/india/suggestions GET + POST + /[id]/vote POST.
  - Seed the 5 starter suggestions from section 15.
  - Add the "Vote to prioritise" button on Coming Soon cards (prefills form).
  - LOCAL COMMIT: "feat(india): module suggestion + voting"

PHASE 7  · DEFENCE GUARDRAILS + INLINE DISCLAIMERS    (~30 min)
  - Build DefenceBudgetModule.tsx and DefenceExportsModule.tsx using ONLY 
    public MoD/PIB figures from the scrapers.
  - Add inline italic disclaimer per module (text from dictionaries).
  - Add NEXT_PUBLIC_ELECTION_MODE handling in ElectionsLokSabhaModule.tsx.
  - LOCAL COMMIT: "feat(india): defence + elections legal guardrails"

PHASE 8  · → SEE FILE 32 §12 (wire remaining ~40 scrapers)

PHASE 9  · SEO, JSON-LD, METADATA, OG IMAGE           (~30 min)
  - generateMetadata() with full SEO block from section 18.
  - JSON-LD Dataset blocks per major module.
  - OG image at /en/india/opengraph-image.tsx.
  - LOCAL COMMIT: "feat(india): SEO + JSON-LD + OG"

PHASE 10 · MOBILE QA + PRINT + ACCESSIBILITY          (~45 min)
  - Walk through 320, 375, 414, 768, 1024, 1440 breakpoints.
  - Add @media print styles.
  - Tab through every interactive element.
  - LOCAL COMMIT: "polish(india): responsive + print + a11y"

PHASE 11 · DOCS UPDATE + FINAL VERIFICATION           (~30 min)
  - Update docs/BLUEPRINT-UNIFIED.md with India Dashboard section.
  - Update docs/FORTHEPEOPLE-SKILL-UPDATED.md with /en/india route + module 
    registry pattern + scraper architecture.
  - Update docs/LIVE-STATE.md current state.
  - Append a session entry to Forthepeople/SESSION-LOG.md.
  - Verify all docs are inside the git repo (rg "BLUEPRINT-UNIFIED" --files).
  - LOCAL COMMIT: "docs(india): update blueprint + skills + canonical state"
  - DELETE /en/india-detail page.tsx (only after all the above is verified).
  - LOCAL COMMIT: "chore(india): remove deprecated /en/india-detail"

PHASE 12 · → SEE FILE 32 §12 (cron activation)
PHASE 13 · → SEE FILE 32 §12 (first production dry-run)

DO NOT git push. STOP HERE. Report back to Jayanth in chat.
```

---

## 21 · ACCEPTANCE CHECKLIST (PRINT THIS BEFORE FINISHING)

```
□ /en/india renders without runtime errors at localhost:3000
□ /en/india-detail returns 308 → /en/india
□ Homepage "Explore the whole India" button lands on /en/india
□ Disclaimer banner is visible at top
□ Hero shows 6 KPI tiles, all numbers cite a .gov.in source from DB
□ Section nav is sticky and scroll-spy works
□ All 4 preserved blocks (new districts, vote next district, news, today)
  render correctly
□ India At a Glance — Today shows 12 KPIs (expanded from current 5)
□ All ~28 live modules render section bands with at least skeleton content
□ All ~25 coming-soon modules appear in the Coming Soon Rail with sources
□ Vote-for-next-module widget shows 5 starter suggestions; vote button works;
  rate-limit kicks in on second vote from same IP
□ Defence section shows inline disclaimer; only public budget + exports data
□ Elections section ready for MCC mode flag
□ Data Sources Index at bottom lists every portal cited (alphabetical)
□ Royal Contributor card preserved at the bottom
□ Mobile (375px): single-column layout, scroll-chip nav, no overflow
□ Print: nav/voting hidden, content + sources preserved
□ Tab navigation reaches every interactive element
□ Lighthouse: Performance ≥ 85, Accessibility ≥ 95, SEO ≥ 95
□ next build succeeds; bundle for /en/india < 250 KB gzipped
□ No hardcoded numbers in any module component (file 32 §13 audit passes)
□ No "scraper/scraping/scraped" word in user-facing strings
□ docs/BLUEPRINT-UNIFIED.md updated
□ docs/FORTHEPEOPLE-SKILL-UPDATED.md updated
□ docs/LIVE-STATE.md updated
□ Forthepeople/SESSION-LOG.md appended
□ /en/india-detail file deleted; no references left in codebase (rg confirms)
□ Admin "India Scrapers" tab shows all ~45 scrapers with status
□ All commits LOCAL ONLY. No git push run.
```

---

## 22 · REPORT BACK TO JAYANTH

When done, post in chat (NOT in Obsidian):
```
✅ /en/india built. ~28 live modules + ~25 coming-soon. 
   /en/india-detail removed; redirect in place. Homepage CTA updated. 
   Voting widget live with 5 seed suggestions. Defence + Elections 
   legal disclaimers in place. Bundle: <X> KB. Tested at <breakpoints>.

📡 Scrapers: <N>/45 succeeded on first run, <M> blocked (require Apify), 
   <K> paused (manual review needed).

⚠️ Modules awaiting first sync: <list of slugs>

⏭ Next: ready for `git push` on your word, OR Phase 14 to fix blocked 
   scrapers, OR demote any module to coming_soon if its source is 
   permanently inaccessible.
```

---

## 23 · APPENDIX — FUTURE PHASES (NOT THIS SESSION)

```
Phase 14: Fix any scrapers that failed on first dry-run.
Phase 15: Add IndiaTimeSeries data backfill for 6 trend charts (population, 
          GDP, forex, forest cover, renewable capacity, UPI tx).
Phase 16: Add CSV export per section.
Phase 17: Add AI weekly briefing (uses callAI, runs every 12h via cron).
Phase 18: Add bilingual variant /kn/india.
Phase 19: Add /en/india/[moduleSlug]/ deep-link routes for each module 
          (full-page mode for journalists / researchers).
Phase 20: Add international comparison toggle (India vs World Bank data — 
          clearly labelled non-government source).
Phase 21: PWA / installable web app for /en/india.
```

---

## 24 · KNOWN RISKS & MITIGATIONS

```
RISK: Number staleness — Indian govt portals don't have stable APIs.
MITIGATION: Every IndiaIndicator row has asOfDate. UI shows "as of" date 
            prominently. File 32 §10 handles stale-data UI: shows cached 
            value with "⚠ Source unavailable" if last sync > 2× tier.

RISK: Defence section legal exposure.
MITIGATION: Hard-coded scope (budget + exports only). Inline disclaimer. 
            Source URLs to MoD/PIB only. Skip the section entirely if 
            Jayanth confirms in chat that he wants zero risk.

RISK: NCRB / Crime data is sensitive politically.
MITIGATION: Show only published NCRB summary tables. No state-shaming framing.
            Use neutral language. Do not rank states by crime.

RISK: Election-period content.
MITIGATION: NEXT_PUBLIC_ELECTION_MODE flag triggers MCC banner. During MCC, 
            Elections section auto-suppresses any party-name highlights.

RISK: Image copyright (wildlife photos especially).
MITIGATION: Use only Wikimedia CC + PIB-released. Each image has visible 
            attribution. No third-party stock photos.

RISK: Page bundle size from many recharts components.
MITIGATION: Dynamic import below-fold sections. Tree-shake recharts via 
            named imports.

RISK: Vote spam.
MITIGATION: IP-hash + 1-vote-per-suggestion-per-day rate limit. Honeypot 
            field on the suggestion form. Light profanity filter.

RISK: SEO confusion between /en/india and /en/[state] state pages.
MITIGATION: Distinct titles, distinct canonical URLs, distinct hreflang. 
            Internal linking: India page links DOWN to states; state pages 
            link UP to /en/india in the breadcrumb.

RISK: Scrapers get blocked or change their HTML structure.
MITIGATION: file 32 covers — rate-limit + UA + retries + AdminAlert on 
            3 consecutive failures + "Awaiting first sync" graceful UI.
```

---

**END OF PROMPT.** Paste into Claude Code (Antigravity) as a single message, **then paste file 32**. Claude Code should read sections 1–4 of both files fully, then execute Phase 0. After every phase, commit and report progress. **No `git push` until Jayanth says push.**
