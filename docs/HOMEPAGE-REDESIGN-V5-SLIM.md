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
