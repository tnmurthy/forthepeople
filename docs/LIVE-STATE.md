# ForThePeople.in — Live State

_Living document. Append new sections; don't rewrite history._

---

## 2026-04-25 — Session 5: /en restraint pass (PRE-PUSH)

**Status:** 84 commits ahead of origin/main. 3 code commits this session — pure UI, zero backend.

### What changed
- /en restored to pre-Session-4 layout (HomeDrilldown's HomepageStats stat row is the visual lead again; map at ~1% from top of visible text vs Session 4's ~30%).
- Three small additions on /en:
  1. Single-line kicker above stats: "Your district. (gray) Your data. (lighter gray) Your right. (blue)" — 13/15px all-caps, 0.14em tracking.
  2. Pastel-blue CTA pill below kicker: "🇮🇳 View India in one page →" + NewPill (auto-expires 30 days post-launch via module-launches.ts).
  3. Two bottom inline summaries above the suggestion banner: 🆕 Recently launched (Pune · Lucknow · Hyderabad → View India) and 🗳️ Vote next (Ahmedabad 29 · Ernakulam 28 · Thiruvananthapuram 26 → See all). Server-fetched via direct Prisma in page.tsx.
- HomeDrilldown surgical edit: removed Session 4's LIVE PULSE OF INDIA wrapper. Kept Session 4's color-grade chip palette + Pune NEW pill SSR fallback (isNewDistrictBySlug + DISTRICT_LAUNCH_SSR_FALLBACK).

### What's preserved from Session 4 (non-/en wins)
- Sourcing language ("accredited research institutions") in DisclaimerBar/Footer/RefreshIndicator/about/root layout
- Pune NEW pill on /en district tiles (SSR works)
- Color-coded grade chips
- /en/india-detail entirely untouched (8 sections including Coming Soon research-backed cards)
- GitHub footer link (Session 3)

### Components on disk but not currently used by /en
- HeroIndia, AnimatedCounter, NewDistrictsBand, VoteNextDistrictBand — all 4 stay reusable. NewDistrictsBand + VoteNextDistrictBand are still mounted on /en/india-detail.

### Reversibility (5 layers)
- Tag `pre-session-5-restraint-2026-04-25` at commit `f3684f6`
- Branch `ui-backup-restraint-2026-04-25`
- `page.v3.tsx` + `HomeDrilldown.v2.tsx` (post-Session-4 snapshots)
- All earlier session backups intact
- Rollback addendum in `32-Session3-UI-Rollback-Guide.md` with 6 options (least invasive: remove bottom strips only; nuclear: reset to pre-session-3 tag)

### Email scan
0 hits for `jayanthmbj@gmail.com` in src/prisma/scripts.

---

## 2026-04-25 — Session 4: /en hero refresh + restructure + sourcing language (PRE-PUSH)

**Status:** 77 commits ahead of origin/main. 10 code/data commits this session — UI + research file, zero backend.

### Reversibility (4 layers verified)
- Tag `pre-session-4-en-refresh-2026-04-25` at commit `d78b9a4` (Session 3 end)
- Branch `ui-backup-en-refresh-2026-04-25`
- `.v` backups for every touched file (`page.v2.tsx`, `Footer.v3.tsx`, `HomeDrilldown.v1.tsx`, `DisclaimerBar.v1.tsx`, `RefreshIndicator.v1.tsx`, `about/page.v1.tsx`, `layout.v1.tsx`, `india-detail/page.v1.tsx`)
- Rollback addendum in `32-Session3-UI-Rollback-Guide.md` with 4 options

### /en restructure
- New section order: Ticker → **HeroIndia** → **NewDistrictsBand** → HomeDrilldown (with **LIVE PULSE OF INDIA** header above LiveDataPreview, HomepageStats suppressed via `heroShown`) → **VoteNextDistrictBand** → TopTierShowcase (DEMOTED from position 3 → position 6) → suggest banner → contributor wall.
- New components: `HeroIndia.tsx`, `AnimatedCounter.tsx`, `NewDistrictsBand.tsx`, `VoteNextDistrictBand.tsx`.
- HomeDrilldown gains `heroShown` prop + LIVE PULSE OF INDIA section header.

### Pune NEW pill regression — root cause + fix
- Session 3 fix to `isNewDistrict` was correct math; SSR `preview?.goLiveDate` was undefined because React Query hadn't fired.
- Fix: `DISTRICT_LAUNCH_SSR_FALLBACK` static map keyed by slug; new `isNewDistrictBySlug` helper. NEW pill count in `/en` SSR HTML jumped from 1 to 4.

### Sourcing language site-wide
- Old: "publicly available government portals under India's Open Data Policy"
- New: "official government portals (NDSAP), accredited research institutions, and verified public sources"
- Updated in DisclaimerBar (yellow strip), Footer (row 1 + meta description), RefreshIndicator (small grey footer line), About page (Methodology paragraph), root `layout.tsx` (Twitter card description). Disclaimer/Privacy/Terms pages NOT touched.

### Health-grade chip colors
- `gradeColor()` updated to Tailwind 50/700/200 family in both HomeDrilldown and india-detail. Border added to chip render. Same emerald/blue/amber/rose family used by Coming Soon cards.

### `/en/india-detail` Coming Soon cards
- Replaced vague blurbs with specific MVP data points + first-party source names from `research/india-modules-coming-soon-sources-2026-04-25.md` (444 lines, 160 verified URLs).
- ComingSoonCard component extended with optional `sources` slot (mono font, dashed divider). Cards retain dashed border + 0.78 opacity.

### Backend untouched policy
- Zero Prisma schema changes. Zero API route edits. Zero seed scripts. All edits in `.tsx` files + 1 research markdown.
- Email scan: 0 hits for `jayanthmbj@gmail.com` in src/prisma/scripts.

---

## 2026-04-25 — Session 3: India aggregate page + mobile/visual fixes (PRE-PUSH)

**Status:** 66 commits ahead of origin/main. 10 code commits this session — all UI, zero backend.

### Reversibility (3 layers)
- Git tag `pre-session-3-ui-2026-04-25` at commit `b658eef` (Session 2 end)
- Backup branch `ui-backup-2026-04-25`
- `.v1.tsx` backups committed BEFORE each edit: `Footer.v1.tsx`, `CompactContributorWall.v1.tsx`, `TopTierShowcase.v1.tsx`, `[locale]/page.v1.tsx`
- Rollback guide: Obsidian `32-Session3-UI-Rollback-Guide.md`

### Fixes
- **Pune NEW badge** on `/en` now renders. Root cause: `isNewDistrict` gated on `ms >= 0` → failed on launch-morning UTC skew. Fix: `FUTURE_GRACE_MS = 24h`.
- **GitHub link** visible in Footer (text + icon, no `hidden sm:inline` guard) so innerText contains "GitHub" at any viewport.
- **Carousels slowed** 2× + touch-pause: `CompactContributorWall` 20s→40s; `TopTierShowcase` 60s/30s→120s both.

### New surfaces
- `src/lib/config/module-launches.ts` — single source of truth for launch dates. NEW pill auto-expires 30 days later.
- `src/components/ui/NewPill.tsx` — subtle pastel green pill, no animation.
- `src/components/home/NextDistrictLeaderboard.tsx` — reads `DistrictRequest` top-3.
- `/[locale]/india-detail` — 8-section aggregate India page (hero, new districts, next district leaderboard, latest news, health ranking, 4× Coming Soon, Royal CTA).
- `/en` gains ONE new link ("View India in one page →" + NewPill) above the Suggest banner. All other /en content unchanged.

### Backend policy compliance
- Zero Prisma schema edits
- Zero API route edits
- Zero seed scripts
- Paid-supporter + failed-payment policies: no Supporter rows touched
- Email hardcode scan: 0 hits for `jayanthmbj@gmail.com` in src/prisma/scripts

---

## 2026-04-25 — Session 2: Pune responsibility module + grade/NEW tile fix (PRE-PUSH)

**Status:** 55 commits ahead of origin/main. 7 code commits + 1 research-data commit this session.

### Schema
- New model **ResponsibilityItem** (districtId, section, action, whyRelevant, reportTo*, phoneVerified, sourceNotes, ordering, active). District gained `responsibilityItems` reverse relation. Pushed via `db push`.

### Data seeded (Neon prod)
- ResponsibilityItem: **50** for Pune across 8 sections. 3 phones flagged unverified (admin review pending).
- DistrictHealthScore: new row for Pune (C, 48.91) — computed via existing `calculateDistrictHealthScore()`.

### API + UI
- `GET /api/data/responsibility` — district-specific when available, `{ fallback: "generic" }` otherwise.
- `/responsibility` page renders 8 section cards with phone/URL links + Source expanders for Pune; other districts continue to render generic content (no regression).
- `/admin/responsibility` — district picker + unverified-phone filter + bulk verify + per-row edit/hide/delete. Sidebar entry added under Community group.

### Fix: Pune grade + NEW badge on /en/india
- DistrictHealthScore was null for Pune because cron hadn't swept the just-launched district. Computed via one-shot script using the existing health-score function. Tile now shows `C` grade + NEW badge like Hyderabad/Lucknow.

### Row counts (end of session)
- Supporter: 70 (unchanged — no writes)
- NewsItem: 461 (unchanged)
- ResponsibilityItem: 50 (Pune only)
- DistrictHealthScore: 10 (all active districts)

---

## 2026-04-25 — Session 1 pre-push fix pass (PRE-PUSH, local only)

**Status:** 47 commits ahead of origin/main. Dev server on :3000, all schema migrations pushed via `prisma db push`.

### Policies formalized this session
- **Paid-supporter:** never delete paid records. SHORTEN names, CLEAR spam messages. Originals preserved.
- **Failed-payment:** orphan rows deleted. No successful payment → no DB row.
- **Motion-safe:** animations honor `prefers-reduced-motion`.

### Schema additions (all pushed via db push)
- `District.goLiveDate DateTime?` — drives NEW badge 45-day window
- `Supporter.messageFlagged Boolean + originalMessage String?`
- `NewsItem.publisher String? + duplicateOf String? + originalSummary String?` + index on duplicateOf

### Data cleanups (Neon prod, all idempotent)
- InfraProject: 3 cross-state Mumbai-Pune Expressway duplicates deleted; 2 anchors changed scope NATIONAL → STATE
- LocalAlert: 1 irrelevant Pune alert deleted (Karnataka Express)
- Supporter: 4 spam messages cleared + 3 business names shortened (e.g. "SML Finance" → "SML F.") — paid records intact
- NewsItem: 453/461 items cleaned of title-dupe summaries + 453 publishers extracted + 2 near-duplicates marked
- Supporter orphan sweep: 0 found (audit clean)

### Row counts (active districts: 10)
- Supporter: 70 (unchanged — no paid record deleted this session)
- NewsItem: 461 (canonical; 2 marked as duplicates)
- InfraProject (state-scope MH): 11 (10 from prior session + 2 Mumbai-Pune now STATE; 1 net change from 3 NATIONAL dupes deleted)
- District.goLiveDate: populated on all 10 active districts

### Webhook hardening
`razorpay-webhook/route.ts` `payment.failed` branch no longer creates Supporter rows — instead deletes any non-success row matching paymentId. Keeps paid-supporter policy watertight.

### Manual action pending
Razorpay ₹999 monthly plan creation (Jayanth, dashboard + paste into `src/lib/razorpay/plans.ts`).

---

## 2026-04-24 (late evening) — 3-Part Fix: Name Validation + State Price + Suggestions (PRE-PUSH)

**Status:** Local-only; 34 commits ahead of origin/main. Awaiting Jayanth's review + Razorpay manual step before push conversation.

### Part A — Supporter name validation
- Shared validator at `src/lib/validators/contributor-name.ts` (Unicode letters + spam-pattern rejection).
- Applied server-side on `create-order`, `create-subscription`, `manual-supporter`, `api/suggestions`. Client-side inline errors on `SupportCheckout`, `ManualSupporterForm`, `SuggestionForm`.
- Schema: `Supporter.nameFlagged` + `Supporter.originalName` + index. Pushed via `prisma db push`.
- Cleanup ran: 70 rows → 58 clean + 12 flagged (11 salvaged, 1 anon; + 8 email-as-name subsequently re-anonymized).
- Admin review tab at `/admin/contributors-flagged` (Edit / Approve / Restore / Delete per row).

### Part B — State Champion ₹1,999 → ₹999
- `TIER_CONFIG.state.amount` + `minAmount` dropped to 999; `district.maxAmount` dropped to 998 for clean band boundaries; `state.maxAmount` unchanged (9998).
- Daily framing: "₹67/day auto ride" → "₹33/day cup of coffee".
- Copy swapped on 8 surfaces (see Obsidian note 29 for full list).
- `VISIBILITY_THRESHOLD.state` lowered 1999 → 999 so sponsor-wall inclusion tracks the new price.
- New `src/lib/razorpay/plans.ts` documents grandfathering + placeholder for Jayanth's manual Razorpay dashboard step (creating the new ₹999 monthly plan).
- Existing ₹1,999 subscribers grandfathered (they stay on the old dynamic plan ID; zero recurring-charge touches).

### Part C — Community Suggestions
- New Prisma model `Suggestion` + `SuggestionStatus` enum (PENDING / REVIEWED / ACCEPTED / REJECTED / SPAM / IMPLEMENTED). Pushed via `db push`.
- Public `POST /api/suggestions` — validated, 3/hr IP rate limit, non-blocking Resend to `forthepeople1547@gmail.com`.
- Public `GET /api/suggestions` — ACCEPTED + IMPLEMENTED only.
- Admin CRUD at `/api/admin/suggestions` + `/api/admin/suggestions/[id]` with audit-log.
- `/features` refactored into two tabs: Vote on Features (existing) + Share Your Idea (new).
- Site-wide CTAs: floating 💬 FAB (locale layout), home banner, district sidebar footer, footer "Share an Idea" link.
- Admin review at `/admin/suggestions` with status filter + inline notes + bulk SPAM+delete.

### Verification
- `tsc --noEmit`: clean.
- Hardcoded `jayanthmbj@gmail.com` in `src/ prisma/ scripts/`: 0 hits.
- Dev server restarted to pick up regenerated Prisma client.
- Smoke tests: GET empty array, POST valid 200 ok, POST spam-name 400 with reason.

### Manual action pending
Jayanth to create ₹999 monthly plan in Razorpay dashboard and paste plan_id into `src/lib/razorpay/plans.ts` (replacing `REPLACE_WITH_NEW_999_PLAN_ID`).

---

## 2026-04-24 — Pune full-audit fix + Maharashtra state infrastructure (take 3, PRE-PUSH)

**Status:** Third autonomous pre-push pass. 7 new seeds executed against Neon production. No push yet — awaiting Jayanth review.

### Record deltas this pass (added to counts below)
- **BudgetAllocation (FY 2025-26):** 3 rows updated — PMC ₹9,842 cr released / ₹8,201 cr spent; PCMC ₹7,546 cr / ₹6,288 cr; ZP ₹227.76 cr / ₹189.8 cr. Remarks suffix flags 78%/65% estimate pending CAG audit. Idempotent.
- **BusRoute:** +8 (PMPML 4/158/57/105/200/AC-1; MSRTC Shivneri + Ashwamedh)
- **TrainSchedule:** +6 (Deccan Queen 12123/24, Pragati 12125, Intercity 12127, Indrayani 22105, Secunderabad Shatabdi 12025)
- **LocalIndustry:** +8 (Hinjawadi RGIP, Chakan MIDC, PCMC Auto Belt, Bhosari, Ranjangaon, Talegaon, Kharadi-Magarpatta, Defence & Aerospace)
- **RtiTemplate:** +5 (PMC roads, PCMC property tax, Pune Metro, Collectorate 7/12, ZP schools)
- **School (PRIVATE):** +4 (Symbiosis University, SIBM Pune, MIT-WPU, FLAME University) — enables PRIVATE-type color coding
- **InfraProject (STATE-scope):** +10 MH state-level: Samruddhi Expressway, NMIA, Vadhavan Port, Shaktipeeth Expressway, Versova-Bandra Sea Link, Mumbai Metro Line 3, Thane Creek Bridge III, Nagpur Metro Phase 2, Jalyukt Shivar 2.0, WDFC Maharashtra. Anchored to Pune districtId with scope="STATE".

### Phases skipped (with reasons)
- **DamReading (Phase 4):** live-data snapshot model — needs real scraper values, not one-time seed
- **Hospital (Phase 5):** schema model doesn't exist fleet-wide — tracked in BUG-TRACKER
- **PowerOutage (Phase 7):** fabrication risk — outage history should come from utility feeds
- **Elections API fix (Phase 8), Exams dedup (Phase 9), Weather scraper (Phase 11):** code/API changes deferred — not in-scope for pre-push data fix
- **AirQualityStation (Phase 12):** schema model doesn't exist
- **HousingScheme PMAY-U delete (Phase 14):** reconsidered — row is NOT a stub. Has real 4,725 target + source caption explaining FY 2026-27 just started (April 2026). Deleting would leave /housing empty. Keeping.

### Pre-push commit state (pending)
New seed files uncommitted:
- `prisma/seed-pune-transport.ts`
- `prisma/seed-pune-local-industry.ts`
- `prisma/seed-pune-rti.ts`
- `prisma/seed-pune-schools-private.ts`
- `prisma/seed-maharashtra-state-infra.ts`
- `scripts/fix-pune-finance-utilization-2026-04-24.ts`

---

## 2026-04-23 — Pune #10 LAUNCH (local complete, PRE-PUSH)

**Status:** All 6 prompts complete locally (Phases A-F of Prompt 6 done). Awaiting commits (G), pre-push verification (H), and explicit go-ahead for push (I), then 24-48h monitoring (J).

### Record counts in Neon production (Phase C + 2026-04-24 fix passes)
- Leader: **41** (17 governance + 24 elected reps; Baramati seat seeded VACANT pending ECI)
- BudgetAllocation: **5** (rich per-body data — PMC 25-26 + PMC 26-27 + PCMC 25-26 + PCMC 26-27 core + ZP 25-26)
- BudgetEntry: **5** (sector aggregates for `/finance` UI compat — derived from BudgetAllocation; sums match to the rupee)
- InfraProject: **13**
- School: **8** (3 aggregates + 5 notables; descriptions rewritten 2026-04-24)
- Scheme: **10** (was 6 — added 4 Maharashtra state schemes 2026-04-24: Ladki Bahin, MJPJAY, Maharashtra Gharkul, Ramai Awas; eligibility format cleaned)
- HousingScheme: **1** (PMAY-U FY 2026-27 — 2026-04-24; PMAY-G deferred)
- PopulationHistory: **4** (Census 1991/2001/2011 + 2021 estimate — added 2026-04-24)
- FamousPersonality: **6** (Tilak, Gokhale, J Phule, S Phule, Karve, Savarkar — added 2026-04-24)
- GovOffice: **8** (Collectorate, PMC, PCMC, ZP, 2 Police, RTO, IT — added 2026-04-24)
- ServiceGuide: **5** (birth/death, property tax, DL, ration, water — added 2026-04-24)
- Tagline badges (districts.ts): **4** (Education Hub, Detroit, IT Corridor, Cultural Capital — added 2026-04-24)
- Taluk: **14** (Prompt 1)
- CourtStat: **0** (deferred — schema requires non-nullable Int stats; awaiting live NJDG API)
- Hospital: **0** (schema model missing across the fleet)

### Commits ahead of origin/main
**18 total** = 1 Prompt 1 + 9 Phase G + 2 morning UX fix (schemes/housing) + 6 afternoon module-population fix (badges/pop/famous/offices/services/schools).

### Phase status
A pre-flight ✓ | B GeoJSON ✓ | C seeds executed ✓ | D admin+budget UI ✓ | E smoke test ✓ | F docs ✓ | G commits ✓ | + 2026-04-24 morning UX fix ✓ | + 2026-04-24 afternoon module population ✓ | H pre-push ✓ | I push ⏳ | J monitor ⏳

### Known gaps at launch (all documented in BUG-TRACKER)
- **Hospital module:** generic `/health` template only; Hospital schema model missing fleet-wide
- **Baramati MLA:** VACANT row seeded but API's `active=true` filter silently hides it from UI — ship-as-is, patch post-ECI certification
- **14 Pune taluk polygons** pending authoritative fetch (DataMeet / geohacker / OSM)
- **BudgetAllocation / BudgetEntry** parallel models — reconciliation deferred
- **Mumbai DB ≠ Mumbai seed file** (surfaced during Pune launch) — dedicated reconciliation prompt needed
- **Cross-district convention drift** (party names, role strings, scheme level casing) — low-priority backlog

### Live event
Baramati Assembly by-election April 23, 2026. ECI certification pending (~24-72h window). Sunetra Pawar principal candidate (NCP-SP did not field; Congress withdrew Aakash More). Post-launch patch will update VACANT row to certified winner.

---

## Tooling added 2026-04-20

- **CodeRabbit**: Installed on jayanthmb14/forthepeople repo only (not all repos). Pro tier auto-enabled (free for public repos regardless of license). Permissions: read + write on single repo for PR review comments. Action: next PR opened on main will trigger automated review comments within ~2 min of push.

---

## 2026-04-20: Database migration + Tenders module launch

### Database migration (completed)
- **NEW Neon**: ep-bitter-sea-a1n9ttad (PG 17, Launch $19/mo, AWS ap-southeast-1 Singapore, forthepeople1547@gmail.com)
- **Migrated from**: OLD Neon ep-broad-wildflower-a14s55kg on old Gmail
- **Method**: GitHub Codespace + pg_dump/pg_restore with PG 17 client tools
- **Row counts verified**: District=152, InfraProject=397, NewsItem=446, Supporter=61 (exact OLD↔NEW match)

### Upstash migration (completed)
- **NEW**: allowing-kid-70988.upstash.io (Mumbai, Pay-as-you-go, forthepeople1547@gmail.com)
- **OLD**: skilled-marten-75302.upstash.io — kept for 7-day rollback safety, decommission 2026-04-27

### Vercel
- Project still on zurvoapps-projects team (old Gmail) — migration deferred
- Env vars updated on all 3 environments — pointing to NEW Neon + NEW Upstash

### Sentry
- Fully configured: client/server/edge configs + DSN + AUTH_TOKEN on .env + Vercel
- Organization: forthepeople.in, single project: javascript-nextjs

### Tenders module (Module 30 — launched 2026-04-20)
- **Scope**: Karnataka pilot — Bengaluru, Mandya, Mysuru
- **14 Prisma models**: Tender, TenderAuthority, TenderCorrigendum, TenderAward, TenderBidder, TenderContract, TenderDocument, TenderCategory, TenderRedFlag, TenderAISummary, TenderSavedByUser, TenderScraperConfig, TenderScraperRun, TenderEducationContent
- **Data sources**: KPPP, CPPP, defproc, eprocurebel, IREPS, HAL eProc (GeM deferred due to Cloudflare Turnstile + IT Act §43 risk)
- **Red flag detection**: SQL-deterministic (never LLM) — single bidder, <21-day window, price hit rate >98%, repeat winner, re-tendered, restrictive turnover, direct nomination
- **Lint**: scripts/lint-tender-copy.sh blocks inflammatory language
- **Disclaimers**: TenderDisclaimer component on every page

### Banner
- Built but DISABLED via static fallback (enabled: false) — migration complete, no user-facing announcement needed
- Admin-controlled banner module TO BUILD — planned as new admin tab, modal-first-visit pattern, user clicks OK → site opens
- Current code can be re-used when admin module is built

### Deferred to future work
- **Neon password rotation**: Low risk (only in private chat logs), do on weekend
- **Vercel ownership migration**: ~2026-04-27, 20-min task
- **OLD Neon + OLD Upstash decommission**: 2026-04-27 (7-day rollback safety net)
- **SiteAnnouncement + missing Tender tables on NEW Neon**: Need `prisma db push` from Codespace
- **Admin banner module build**: New module under admin panel, replaces the disabled static banner

---

## 2026-04-20: Tenders module fixes (post-audit)

Phase 1 audit identified 12 issues. Fixed 10 in this session, deferred 2.

### Fixed

1. **All invented email addresses replaced** with contextual `mailto:support@forthepeople.in?subject=...` links. 6 `takedown@` references removed (1 scraper UA string, 1 component, 4 doc-file mentions). Scraper User-Agent now uses `https://forthepeople.in/contact` instead (bots can't click mailto).
2. **Sidebar reorganised by civic priority**: 7 tiers (Civic Duty → Maps & Data), numeric `priority` field replaces dead `group` enum. All 3 nav components (Sidebar, MobileSidebar, MobileTabNav) now derive categories from a single `getTieredModules()` helper — no more hardcoded slug arrays.
3. **Tenders visible on all districts with DB-driven lock state**: `District.tendersActive Boolean @default(false)`. Non-activated districts see a lock + sponsor-CTA card instead of the misleading empty-dashboard. Sidebar entry stays universal for discoverability.
4. **Per-state disclaimer route** at `/tenders/disclaimer`: reuses `TenderEducationContent` with new `docType` + `stateSlug` columns. 7 universal clauses (GFR 2017, GODL-India, RTI §4, DPDP 2023, Advocates Act §33, takedown, licence) + 2 Karnataka-specific (KTPPA 1999, portal list). Fixes the previously-broken `<Link href="/tenders/disclaimer">`.
5. **Tenders overview snippet** on every district home: matches LeadersSnippet/InfraSnippet pattern, status badge cycles LIVE/STALE/LOCKED/NO_DATA, shows live count, closing-48h callout, next-deadline strip, and time-ago.
6. **Deadline urgency indicator** on tender cards + detail hero: green border >7d, yellow 2–7d, red pulsing <48h, grey/dimmed past. Client-side from `bidSubmissionEnd`.
7. **Structured plain-English bullets** on detail page: `TenderAISummary.plainBullets Json?` with `{ what, whoCanApply, deadline }`. New 4th prompt in enrichment cron at grade-6 reading level, max 25 words/bullet. "Summary being prepared" fallback when absent.
8. **Save & Alert** on detail page now opens a mailto pre-filled with tender context (title, source URL, ID). Replaces the fake `alert()`. TODO flagged for real DPDP-compliant email collection in v2.
9. **Apply Guide / Transparency / How It Works** buttons verified live on prod — no dead buttons. Also fixed `/api/tenders/how-it-works` to filter by `docType='explainer'` so disclaimer rows don't leak into the explainer page.
10. **Activation runbook** at `docs/TENDERS-ACTIVATION.md` — SQL flip + seed pattern + state-specific gotchas.

### Deferred (not blocking Phase 2 push)

- **Scraper cron registration** (Issue #11): KPPP portal CAPTCHA / rate-limit blocker remains. Not wiring to `vercel.json` crons until the engine is proven stable from a Railway / domestic-IP environment.
- **"Crime Statistics" module** from Phase 1 Tier 4 list: module doesn't exist in codebase, silently dropped. Split `police` module remains single.

### Schema changes (additive, no data loss)

Land on Vercel's next deploy via `vercel.json` build command (`npx prisma db push`):

- `District.tendersActive Boolean @default(false)` — issue #3
- `TenderEducationContent.docType String @default("explainer")` — issue #4
- `TenderEducationContent.stateSlug String?` — issue #4
- `TenderAISummary.plainBullets Json?` — issue #7

### New files

- `src/components/district/TenderSnippet.tsx`
- `src/components/tenders/TenderLockedState.tsx`
- `src/app/api/tenders/[district]/access/route.ts`
- `src/app/api/tenders/[state]/disclaimer/route.ts`
- `src/app/api/tenders/live-districts/route.ts`
- `src/app/[locale]/[state]/[district]/tenders/disclaimer/page.tsx`
- `prisma/seed-tender-legal.ts`
- `scripts/activate-tenders-districts.ts`
- `docs/TENDERS-ACTIVATION.md`

### Enabled districts for tenders (after activation script runs)

`bengaluru-urban`, `mandya`, `mysuru` (all other districts render lock state).

### Post-push manual actions required

1. Wait for Vercel build to complete (adds the 4 schema columns via `prisma db push`).
2. Run `npx tsx scripts/activate-tenders-districts.ts` against production DB → flips `tendersActive=true` for the 3 KA pilot districts.
3. Run `npx tsx prisma/seed-tender-legal.ts` against production DB → seeds 9 disclaimer clauses.
4. (Optional) Run enrichment cron to populate `plainBullets` on the 12 stub tenders.

