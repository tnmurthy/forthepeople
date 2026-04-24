# ForThePeople.in — Live State

_Living document. Append new sections; don't rewrite history._

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

