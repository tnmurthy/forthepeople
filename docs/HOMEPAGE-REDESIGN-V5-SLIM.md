# Homepage Redesign v5 — Slim Core Reference (Session 11, 2026-04-26)

This is the in-repo reference for the Session 11 redesign. Built component-by-component as drop-in replacements; **page.tsx swap landed as commit `3dd7570`**. Layout-level chrome (legacy DisclaimerBar + Header + Footer in `[locale]/layout.tsx`) is intentionally preserved — see "Deferred" section below for the elevation plan.

---

## Layout map (compose order in `src/app/[locale]/page.tsx`)

```
<DisclaimerBar />     ← LAYOUT (legacy, preserved)
<Header />            ← LAYOUT (legacy, preserved)
<main>
  <FinancialTicker />
  <LiveActivityRibbon />
  <HeroSection />
  <DistrictExplorer />
  <LiveDataShowcase />
  <FoundingPatronCard />
  <SupporterMarquee />
  <PricingTiers />
  <RequestAndVoteCards />
</main>
<Footer />            ← LAYOUT (legacy, preserved)
```

All redesign-v2 components live in `src/components/home/redesign-v2/`.

The `redesign-v2/DisclaimerBanner.tsx`, `redesign-v2/HeaderBar.tsx`, `redesign-v2/Footer.tsx` are built, TSC-clean, and ready to be elevated to `[locale]/layout.tsx` in a follow-up commit (after district pages are also re-themed).

## Tier color reference

| Tier | Price | Background | Text | Border | Badge |
|---|---|---|---|---|---|
| District Champion | ₹99/mo | `#DCFCE7` (emerald-100) | `#166534` (emerald-700) | `#86EFAC` | ⌂ |
| State Champion (most popular) | ₹999/mo | `#EEEDFE` (violet-50) | `#3C3489` (violet-900) | `#6E59C0` (violet-600) | ⛳ |
| All-India Patron | ₹9,999/mo | `#FCEBEB` (red-50) | `#791F1F` (red-900) | `#E24B4A` (red-600) | ★ |
| Founding Builder | ₹50,000/mo | `#FAEEDA` (amber-50) | `#78350F` (amber-900) | `#BA7517` (amber-600) | ♛ |
| Buy me a Chai (one-time) | from ₹50 | `#F5F5F0` (neutral-100) | `#6B7280` (neutral-500) | `#E5E7EB` | ☕ |

These match the production /support page CTAs and `BadgeExplainer.tsx`. Verified Session 11 audit phase.

## Animation list

| Element | Animation | Duration | reduced-motion fallback |
|---|---|---|---|
| FinancialTicker | left→right marquee | 60s linear infinite | overflow-x: auto, no animation |
| LiveActivityRibbon | left→right marquee | 90s linear infinite | overflow-x: auto, no animation |
| LiveActivityRibbon green dot | opacity pulse | 2s ease-in-out infinite | no animation |
| HeroSection | fade-in on mount | 300ms ease-out | no animation |
| LiveDataShowcase tab switch | cross-fade | 250ms ease-out | no animation |
| FoundingPatronCard | gold glow pulse | 4s ease-in-out infinite | no animation |
| SupporterMarquee | left→right marquee | 50s linear infinite | overflow-x: auto, no animation |
| PricingTiers (state-champion card) | violet glow pulse | 4s ease-in-out infinite | no animation |
| HeaderBar updated-pill green dot | opacity pulse | 2s ease-in-out infinite | no animation |
| DisclaimerBanner | slide-in | 250ms ease-out | no animation |
| Hover lifts (cards) | translateY(-1px) | 150ms ease | no transform |

All animations use raw CSS keyframes — `framer-motion` is **not** installed.

## Mobile breakpoints (single threshold: 768px)

Each component declares its own `@media (max-width: 767px)` rules inline (Tailwind v4 + scoped `<style>` per component). Key collapses:

| Component | Desktop | Mobile (<768px) |
|---|---|---|
| HeaderBar | logo · product ▾ · pill · search · ☼/☾ · lang · GitHub · ♥ | logo · search · ♥ · ☰ |
| HeroSection | 60/40 grid (text · map) | stacks; map below; stats 2×3 |
| DistrictExplorer | 50/50 grid (map · list) | map above, list below |
| LiveDataShowcase chips | horizontal scroll | horizontal scroll |
| LiveDataShowcase cards | 4 columns | 2×2 grid |
| PricingTiers | 1fr 1.1fr 1fr | stacked; State Champion middle |
| RequestAndVoteCards | 2 columns | stacked |
| Footer rows | inline | stacked |

## Endpoints (no schema changes; no new endpoints)

| Component | Endpoint(s) consumed |
|---|---|
| FinancialTicker | GET `/api/data/market-ticker` |
| LiveActivityRibbon | GET `/api/data/homepage-stats`, GET `/api/data/homepage-preview` |
| HeroSection | GET `/api/data/homepage-stats` |
| DistrictExplorer | server-side `prisma.district.findMany` + `prisma.districtRequest.findMany` (props-in pattern via page.tsx) |
| LiveDataShowcase | GET `/api/data/crops`, `/weather`, `/news`, `/infrastructure-projects` per district chip |
| FoundingPatronCard | GET `/api/payment/contributors?limit=20` |
| SupporterMarquee | GET `/api/payment/contributors?limit=100` |
| PricingTiers | static — links to `/<locale>/support?tier=...&autoselect=...` |
| RequestAndVoteCards | GET + POST `/api/district-request`, GET `/api/features` |
| HeaderBar updated-pill | GET `/api/data/homepage-stats` (60s poll) |
| Footer updated-pill | GET `/api/data/homepage-stats` (60s poll) |

## /public/districts/{slug}.svg slot

`LiveDataShowcase` performs a `HEAD /districts/<slug>.svg` probe per active district. If the SVG exists, it renders as a 56px round avatar in the header. If not, a generic blue location-pin SVG renders. **Drop new SVGs into `public/districts/` to upgrade — zero code change required.**

Example: `public/districts/mandya.svg`, `public/districts/pune.svg`.

## Session 11.1 — Chrome swap completed (2026-04-26)

The redesign-v2 chrome (DisclaimerBanner + HeaderBar + Footer) is now wired into `src/app/[locale]/layout.tsx` and renders **site-wide**, not just on the homepage.

**Verified post-swap (HTTP 200 + reasonable HTML size):**

| Route | Status | Size |
|---|---|---|
| /en | 200 | 87 KB |
| /en/karnataka/mandya | 200 | 127 KB |
| /en/karnataka/bengaluru-urban | 200 | 127 KB |
| /en/karnataka/mysuru | 200 | 127 KB |
| /en/maharashtra/mumbai | 200 | 125 KB |
| /en/maharashtra/pune | 200 | 122 KB |
| /en/delhi/new-delhi | 200 | 123 KB |
| /en/tamil-nadu/chennai | 200 | 124 KB |
| /en/west-bengal/kolkata | 200 | 124 KB |
| /en/telangana/hyderabad | 200 | 133 KB |
| /en/uttar-pradesh/lucknow | 200 | 126 KB |

TSC: 0 errors. Lint: 107 problems (exactly baseline, no regression).

**Intentional regressions vs legacy Header (each documented inline in `HeaderBar.tsx` SCOPE NOTE):**
- No state/district autocomplete (search submits to `/<locale>?q=...`)
- No "Lock" indicator per-district
- No MobileSidebar wired (HeaderBar's ☰ button is a no-op until layout passes `onOpenMobileNav` callback wired to existing MobileSidebar)
- Footer trades the live IST clock for an "Updated Xm ago" pill

## v6 simplification (Session 11.6, 2026-04-27)

Localhost review of the v5 homepage flagged it as over-engineered: too many salesy sections (pricing tiers + big founder card + supporter marquee), redundant district browsers (explorer with tier groups + live-data 4-card showcase), and a dual request-and-vote card. v6 collapses the homepage body to **5 simpler sections** while pricing/founder/supporter content continues to render at `/support` from the same source of truth.

### New homepage structure (post-v6)

```
[layout chrome — DisclaimerBanner + HeaderBar (with green/red status dots)]
<main>
  1. FinancialTicker
  2. LiveActivityRibbon
  3. HeroSection           ← map LEFT (55%), text RIGHT (45%), 3-stat row
  4. LiveDistrictsList     ← flat 10-district grid, NEW badge on 3 newest
  5. UpcomingDistricts     ← top 2 voted + "Vote for the next district →"
  6. ContributorsStrip     ← flat names + "View all supporters & contribute →"
  7. VoteFeaturesCTA       ← top 3 features + "Vote on features →"
</main>
[layout chrome — Footer]
```

### Removed from homepage (all retained on disk)

| Component | Reason |
|---|---|
| `PricingTiers.tsx` | Defer to `/support` — already renders the same tiers from `src/lib/razorpay/plans.ts` |
| `FoundingPatronCard.tsx` | Defer to `/support` — Micah Alex appears first in the new flat ContributorsStrip without special treatment |
| `SupporterMarquee.tsx` | Defer to `/support` — flat names with "View all" link is honest civic vibe |
| `LiveDataShowcase.tsx` | District pages already cover crops/infra/news/weather per district |
| `DistrictExplorer.tsx` | Replaced by simpler `LiveDistrictsList` (no tab UI, no second map column) |
| `RequestAndVoteCards.tsx` | Split into focused `UpcomingDistricts` + `VoteFeaturesCTA` |

### HeaderBar product-dropdown change

Three items, status dots only — `"Coming soon"` text labels removed:
- 🟢 ForThePeople**.in** (active)
- 🔴 ForThePeople**.connect** → `/coming-soon`
- 🔴 ForThePeople**.jobs** → `/coming-soon`

### Verified Session 11.6
- TSC: 0 errors
- Lint: 107 problems (61 errors, 46 warnings) — exact baseline preserved
- HTML payload `/en`: 84 KB (was 105 KB in v5 — ~20% slimmer)
- District pages `/en/karnataka/mandya`, `/en/maharashtra/pune`: still HTTP 200
- Tag `pre-session-11.6-v6-simplification-2026-04-26` covers full pre-state

---

## Old components (kept on disk for rollback)

| Legacy file | Replaced by | Status |
|---|---|---|
| `src/components/layout/DisclaimerBar.tsx` | `redesign-v2/DisclaimerBanner.tsx` | legacy still wired in layout |
| `src/components/layout/Header.tsx` | `redesign-v2/HeaderBar.tsx` | legacy still wired in layout |
| `src/components/layout/Footer.tsx` | `redesign-v2/Footer.tsx` | legacy still wired in layout |
| `src/components/layout/MarketTickerClient.tsx` | `redesign-v2/FinancialTicker.tsx` | legacy unused on /en after page.tsx swap |
| `src/components/layout/HomeDrilldown.tsx` | `redesign-v2/DistrictExplorer.tsx` + `LiveDataShowcase.tsx` | legacy unused on /en after page.tsx swap |
| `src/components/home/HomepageStats.tsx` | merged into `redesign-v2/HeroSection.tsx` | legacy unused on /en after page.tsx swap |
| `src/components/support/CompactContributorWallClient.tsx` | merged into `redesign-v2/SupporterMarquee.tsx` | legacy unused on /en after page.tsx swap |
| `src/app/[locale]/page.v8.tsx` | snapshot of pre-swap page.tsx | rollback target |

## Deferred to a future session

| Feature | Why deferred | Where to start |
|---|---|---|
| Interactive 780-district SVG choropleth | `react-simple-maps ^3.0.0` IS installed; component build is its own session | `redesign-v2/HeroSection.tsx` map placeholder + `redesign-v2/DistrictExplorer.tsx` map placeholder |
| Count-up animations on hero stats | low-value, low-noise; static values render correctly | `redesign-v2/HeroSection.tsx` Stat component |
| GitHub stars live API | `swr` not installed; hardcoded ★ 149 fallback works | `redesign-v2/HeaderBar.tsx` GITHUB_STAR_FALLBACK |
| react-window virtualization for district list | unnecessary at 10 districts; revisit at >100 | `redesign-v2/DistrictExplorer.tsx` |
| Per-district SVG illustrations | `public/districts/` slot ready; SVG files not authored yet | drop file, no code change |
| `/coming-soon` page (for ProductDropdown links) | content authoring task | new page at `src/app/coming-soon/page.tsx` |
| `/en/india-detail` page | content authoring task | new page at `src/app/[locale]/india-detail/page.tsx` |
| Layout-level swap to redesign-v2 chrome | requires district-page redesign first | swap `[locale]/layout.tsx` imports when ready |
| Theme toggle deep wiring (CSS variables across all surfaces) | `ThemeToggle.tsx` already toggles `data-theme`; comprehensive `--bg-*` mapping is its own pass | `globals.css` `[data-theme="dark"]` block |
| Hindi (`hi`) and other non-en/kn locales | dictionaries not present | `src/dictionaries/hi.json`, etc. |

---

# Session 12 — v7 Comprehensive Redesign (2026-04-26, NOT pushed)

Built phase-by-phase, single commit per phase, on `main` locally. Push held for final review per instructions.

## v7 layout map (compose order in `src/app/[locale]/page.tsx`)

```
<PageProgressBar />     ← LAYOUT (NEW, NProgress-style top bar)
<MigrationBanner />     ← LAYOUT
<DisclaimerBanner />    ← LAYOUT (yellow palette, was orange)
<HeaderBar />           ← LAYOUT (overhauled — see below)
<main>
  <FinancialTicker />        — LIVE pill + scrolling marquee + Updated label
  <StatsBar />               — count-up stats line (replaces LiveActivityRibbon timestamps)
  <HeroSection />            — map LEFT 60%, text RIGHT 40%
  <LiveDistrictsList />      — 10-district grid, NEW badges, mobile scroll-snap
  <LiveDataShowcase />       — RESTORED (district chip tabs + 4 module cards)
  <HowItWorks />             — NEW 4-step explainer
  <ContributorsStrip />      — links to /contributors (was /support)
  <VoteFeaturesCTA />        — top 3 feature ideas + /features link
</main>
<Footer />              ← LAYOUT
<SuggestionFloatingButton />
```

`UpcomingDistricts` removed from the homepage. Its function is served by the new dedicated `/vote-district` route, deep-linked from the HeaderBar district autocomplete via `?d=<slug>`.

## v7 commits (16 commits, all `main`, no push)

| # | Commit | Phase | Surface |
|---|---|---|---|
| 1 | `e919a01` style(disclaimer) | B | DisclaimerBanner — yellow palette + pulsing icon |
| 2 | `057096e` feat(header) | C | HeaderBar — emojis 👥/🤝/💼, district autocomplete, locked dark mode |
| 3 | `ac2e462` feat(ticker) | D | FinancialTicker — LIVE pill, viewport containment, Updated timestamp |
| 4 | `8a1e948` feat(home) | E | StatsBar (filename retained as LiveActivityRibbon.tsx for stable imports) |
| 5 | `9b784ca` fix(stats) | E hotfix | StatsBar props made optional w/ defaults during transition |
| 6 | `26c3bbd` feat(home) | F | HeroSection — map LEFT 60%, text RIGHT 40%, no inline stats |
| 7 | `9fcdc61` feat(home) | G | LiveDistrictsList — intros, NEW badges, stagger reveal, mobile scroll-snap |
| 8 | `3143e39` feat(home) | I | HowItWorks 4-step (Aggregate → Process → Surface → Sustain) + sources caption |
| 9 | `92b99dd` feat(home) | J | ContributorsStrip → /contributors link |
| 10 | `a12c14b` feat(contributors) | K | ContributorsHero stats + Join CTA above existing leaderboard |
| 11 | `69b86f6` feat(vote-district) | L | New `/vote-district` route — search/filter/vote, ?d= preselect |
| 12 | `090bb6c` feat(homepage) | N | page.tsx swap — activate v7 composition |
| 13 | `9b4fb38` polish(map) | O | DrillDownMap ambient pulse on active states (CSS-only) |
| 14 | `ad65bcf` feat(ux) | P | PageProgressBar — NProgress-style top bar |
| 15 | `7f29a51` chore(lint) | Q | Lint cleanup for vote-district + PageProgressBar |

(Phase H restored LiveDataShowcase — file already on disk from Session 11, no commit needed beyond Phase N's reimport. Phase M verified VoteFeaturesCTA still works as-is.)

## What's new on disk (Session 12 only)

**New routes**
- `src/app/[locale]/vote-district/page.tsx` — server entry, awaits `?d=` searchParam
- `src/components/vote-district/VoteDistrictPage.tsx` — client (search/filter/sort/paginate/vote)

**New components**
- `src/components/home/redesign-v2/HowItWorks.tsx` — 4-step explainer with count-up step numbers
- `src/components/common/PageProgressBar.tsx` — global top bar, no third-party dep
- `src/app/[locale]/contributors/ContributorsHero.tsx` — hero above existing leaderboard

**New constants**
- `src/lib/constants.ts` exports `DASHBOARDS_PER_DISTRICT = 32` and `TOTAL_INDIA_DISTRICTS = 780`

**Heavily reworked existing**
- `HeaderBar.tsx` — full overhaul (~570 LOC)
- `FinancialTicker.tsx` — restructured around LIVE pill + viewport
- `LiveActivityRibbon.tsx` — repurposed as StatsBar export (filename retained for import stability)
- `HeroSection.tsx` — clean rewrite to 60/40 layout
- `LiveDistrictsList.tsx` — added NEW badges + intros + mobile scroll-snap
- `DisclaimerBanner.tsx` — yellow palette
- `ContributorsStrip.tsx` — link target changed to /contributors
- `globals.css` — added `.ftp-geo-active` pulse + `prefers-reduced-motion` guard

## StatsBar data wiring (Phase N)

`page.tsx` fetches `/api/data/homepage-stats` (5-min cache) during SSR. Falls back to `activeRows.length` and zeros if the endpoint is unreachable. `comingDistricts = TOTAL_INDIA_DISTRICTS - activeCount`.

## DrillDownMap polish — read-only data flow preserved

Hard Rule 8 honored. Only added a `className={isActive ? "ftp-geo-active" : "ftp-geo-locked"}` and `data-active` on the `<Geography>` element so CSS could attach a pulse. No state, query, click handler, or geo-data flow was touched.

## Reduced-motion respected everywhere

Every animation introduced this session — count-up, stagger reveal, profile-ring pulse, geo-pulse — has a `@media (prefers-reduced-motion: reduce)` skip. The PageProgressBar still renders for accessibility but uses immediate state transitions rather than long easings.

## Lint state at end of session

| | Before Session 12 | After Session 12 |
|---|---|---|
| Total problems | 107 | 108 |
| Errors | 61 | 62 |
| Warnings | 46 | 46 |

Net delta: **+1 error in unrelated pre-existing code** (not introduced by any Session 12 file). All v7 files have zero lint issues.

## Push status

**NOT pushed.** Per session prompt — all 16 commits are local on `main`. Single-commit-per-phase = clean reversibility. Push only after manual smoke test of:
- Homepage scroll-through (FinancialTicker → VoteFeaturesCTA, look for visual regressions)
- HeaderBar district autocomplete → `/vote-district?d=<slug>` deep link
- StatsBar count-up animation on first scroll
- HowItWorks step numbers count-up
- DrillDownMap state pulse (active vs locked)
- PageProgressBar fires on internal nav, doesn't pin after failed navs
- /contributors page hero stats + CTA
- /vote-district vote action (POST → optimistic bump → server upsert)
- prefers-reduced-motion turned on → no animations
- Lighthouse / Core Web Vitals on the new homepage

---

# Session 13 — v8 final polish (2026-04-26, NOT pushed)

19 production-pattern-matching fixes from Jayanth's localhost review.
~14 commits, all on local `main`. Reversibility tag:
`pre-session-13-v8-polish-2026-04-26`.

## What changed

| Surface | Change | Fix # |
|---|---|---|
| DisclaimerBanner | Wording → explicit "ForThePeople.in is NOT an official government website" | #1 |
| HeaderBar (logo) | Drop 👥 emoji — plain text "ForThePeople.in" / "FTP.in" | #11 |
| HeaderBar (products) | Lucide icons in brand colors (Users blue · Network purple · Briefcase yellow); .jobs uses YELLOW not orange | #12, #13 |
| HeaderBar (GitHub) | Replace redundant Support text link with GitHub link showing live star count + scalable color tier (bronze/silver/gold/platinum/diamond, sessionStorage 1h cache, fallback 149) | #2 |
| HeaderBar (Support btn) | Layered red — rose-50 bg / rose-600 text / rose-200 border (production pattern) | #18 |
| FinancialTicker | Replace LIVE pill with Market Open/Closed status (Indian market hours: Mon-Fri 09:15-15:30 IST) | #3 |
| StatsBar | Drop LIVE prefix; redesign as dashboard-style 5-tile grid with hairline dividers, hover, larger 24px tabular figures, uppercase labels; mobile 2-col + last tile spans full width | #4 |
| HeroSection (map) | 480-560px tall map with floating "Click a state to explore" hint (glass-morphism backdrop) | #5 |
| HeroSection (right) | Districts moved INTO hero right column as inline rows; "Explore the whole India →" green CTA between subtitle and districts list | #6, #7 |
| HeroSection (rows) | Each row: name + state suffix + 2 curated tag-bullets (Sugar capital · KRS dam · Cauvery basin etc.); NEW = small 8px letter pill, no card-bg color change | #8, #9 |
| LiveDistrictsList | Removed from page.tsx (file kept on disk for rollback) | #7 |
| ContributorsStrip | Tier-colored marquee — Founder amber+Crown · All-India red+🇮🇳 · State purple+MapPin · District emerald+Building · One-time neutral; 60s linear, hover-pause, edge fade-mask | #14 |
| HowItWorks | 40px gradient number circles with pop-in animation, connecting hairline behind cards (desktop), hover-lift + emerald shadow | #17 |
| VoteFeaturesCTA | Purple gradient card (#EEEDFE → #F4F3FE) with oversized 🗳️ watermark, white inner rows, violet vote chip + primary button | #16 |
| Footer | Single line: links · brand IG (@forthepeople_in) + project GitHub · "Built by · Updated"; personal IG removed | #15 |
| All data | Existing APIs only — no new endpoints, no new schema fields | #10 |
| Spacing | Hero stretch-aligned, sections flow tightly | #19 |

## v8 layout map (compose order in `src/app/[locale]/page.tsx`)

```
<PageProgressBar />     ← LAYOUT
<MigrationBanner />     ← LAYOUT
<DisclaimerBanner />    ← LAYOUT (wording: NOT an official government website)
<HeaderBar />           ← LAYOUT (plain logo · GitHub stars · Lucide products · layered Support)
<main>
  <FinancialTicker />        — Market Open/Closed pill + marquee + Updated
  <StatsBar />               — 5-tile dashboard grid (no LIVE prefix)
  <HeroSection />            — map LEFT 60% / text + districts inline RIGHT 40%
  <LiveDataShowcase />       — district chip tabs + 4 module cards
  <HowItWorks />             — 4 gradient-circle steps + connecting line
  <ContributorsStrip />      — tier-colored marquee (5 tiers)
  <VoteFeaturesCTA />        — purple gradient card
</main>
<Footer />              ← LAYOUT (single line)
<SuggestionFloatingButton />
```

## v8 commits (14 commits, all `main`, no push)

| # | Commit | Phase | Surface |
|---|---|---|---|
| 1 | `11beac9` | B | DisclaimerBanner — explicit "NOT official government" wording |
| 2 | `45cc2a5` | C | HeaderBar — emoji-less logo, GitHub stars, Lucide products, .jobs yellow, layered-red Support |
| 3 | `19c4b37` | D | FinancialTicker — Market Open/Closed status pill |
| 4 | `69fc080` | E | StatsBar — dashboard 5-tile grid |
| 5 | `5af155c` | F+G | HeroSection — bigger map + hint, districts inline w/ rich intros |
| 6 | `f3fe5ba` | H | page.tsx — drop separate LiveDistrictsList section |
| 7 | `3b8057d` | I | ContributorsStrip — tier-colored marquee |
| 8 | `b248536` | J | VoteFeaturesCTA — purple gradient card |
| 9 | `369b232` | K | HowItWorks — gradient circles + connecting line + hover lift |
| 10 | `e904f9b` | L | Footer — single line, brand IG + GitHub only |
| 11 | `80581df` | M | page.tsx — docstring refresh to v8 composition |
| 12 | `5179fb9` | N | FinancialTicker — lazy-init nowMs (lint cleanup) |

## Verification

| | Before Session 13 | After Session 13 |
|---|---|---|
| Total problems | 108 | 108 |
| Errors | 62 | 62 |
| Warnings | 46 | 46 |

- TSC: 0 errors throughout.
- Lint: 108 baseline preserved exactly.
- Localhost smoke: `/en`, `/en/karnataka/mandya`, `/en/maharashtra/pune`, `/en/contributors`, `/en/vote-district` all 200.
- GitHub star fetch: cached 1h in sessionStorage; falls back to 149 on rate-limit.

## Push status

**NOT pushed.** Reversibility tag `pre-session-13-v8-polish-2026-04-26` exists; all 14 commits sit on local `main`. Push only after Jayanth's manual review.

---

# Session 14 — v8.1 polish (2026-04-26, NOT pushed)

11 surface-level fixes from Jayanth's localhost review of v8.
~9 commits, all on local `main`. Reversibility tag:
`pre-session-14-polish-2026-04-26`.

## What changed

| Surface | Change | Fix # |
|---|---|---|
| HeaderBar | GitHub link gets white-bg outline, default star color YELLOW (#EAB308); tier scale silver→#94A3B8, gold→#EAB308 | #1 |
| HeaderBar | Vote on Features → purple pill (light bg / dark text / soft border) | #2 |
| HeaderBar | Language button → Lucide Globe icon + outline + chevron | #3 |
| HeaderBar | Theme toggle → 32px square w/ outline (was bare) | #4 |
| HeaderBar | Padding 10px 16px → 8px 24px so contents extend toward corners | #5 |
| StatsBar | Numbers BLUE (#2563EB), 28px (was 24), font-weight 700 (was 600); dividers 1px (was 0.5px); hover #F0F7FF | #6, #7 |
| HeroSection | Map column 540-640px tall (was 480-560); SVG max-height 620px | #8 |
| HeroSection | h1 white-space:nowrap + grid 56/44 + gap 28px → tagline single line at 1280px+ | #9 |
| HeroSection | District rows outlined (1px border, 8px radius), padding 10×14, hover slides right + blue border + soft blue shadow; all 3 curated tags shown (was 2); list lost max-height + overflow:auto so all 10 visible | #10 |
| /contributors | Removed Session 12 ContributorsHero — was a second hero stacked above the existing GlobalContributorsClient hero. ContributorsHero.tsx kept on disk for rollback. | #11 |
| /contributors | Wired useCountUp into GlobalContributorsClient hero stats (totalContributors / activeSubscribers / districtsSponsored) — animates 0 → final on scroll-into-view, mirroring StatsBar | #12 |
| ContributorsStrip | 3 sliding tracks at tier-paced speeds: All-India+Founder 90s SLOW, State 60s MED, District+Onetime 35s FAST; hover-pause; reduced-motion freezes + wraps | #13 |
| ContributorsStrip | Pills clickable when contributor.socialLink exists (existing schema field, now surfaced by API gated on isPublic); safeExternalLink rejects non-http(s) and accepts bare @handles as Instagram | #14 |
| ContributorsStrip / API | Public-supporter names render in full (anonymizeName drops the "First L." truncation when isPublic=true; private supporters still show "Anonymous"); pill names use white-space:nowrap | #15 |
| HowItWorks | Theme switched green → blue: hover border #10B981→#2563EB, num-circle gradient #10B981→#059669 → #2563EB→#1D4ED8, shadows + connecting line tinted blue | #16 |
| API | /api/payment/contributors now surfaces socialLink + socialPlatform from existing Supporter schema; cache key bumped v3→v4 | #14, #15 |

## Verification

| | Before Session 14 | After Session 14 |
|---|---|---|
| Total problems | 108 | 108 |
| Errors | 62 | 62 |
| Warnings | 46 | 46 |

- TSC: 0 errors throughout.
- Lint: 108 baseline preserved exactly.
- Localhost smoke: `/en`, `/en/karnataka/mandya`, `/en/maharashtra/pune`, `/en/contributors`, `/en/vote-district` all 200.
- Verified live: `/api/payment/contributors?limit=5` now returns `socialLink` + `socialPlatform` fields, and "Vignesh" displays in full (was "Vig...").

## v8.1 commits (9 commits, all `main`, no push)

| # | Commit | Phase | Surface |
|---|---|---|---|
| 1 | `8462f6a` | B | Header — outlined GitHub/Vote/Language/Theme + yellow star + purple Vote pill + Globe icon |
| 2 | `554e3ef` | C | StatsBar — blue numbers + bolder + 1px dividers |
| 3 | `ceebc8d` | D | Hero map — bigger (640px max) |
| 4 | `96ea21a` | E | Hero h1 — nowrap + 56/44 grid ratio |
| 5 | `b7303cc` | F | District rows — outlined + 3 tags + all 10 visible |
| 6 | `8aa5441` | G | /contributors — remove duplicate hero + count-up on 72/16/4 |
| 7 | `e9dd410` | H | Supporters — tier-based marquee speeds + clickable + full names |
| 8 | `0673c98` | I | HowItWorks — blue theme (was green) |

## Push status

**NOT pushed.** Reversibility tag `pre-session-14-polish-2026-04-26` exists; all v8.1 commits sit on local `main`. Push after Jayanth's manual review.
