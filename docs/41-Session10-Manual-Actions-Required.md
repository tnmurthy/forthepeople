# Manual Actions Required — Session 10 Audit (2026-04-26)

These cannot be fixed from code. Each requires Jayanth to log into a
dashboard and click. Verified via Chrome MCP audit + local API probes.

---

## 🚨 URGENT (within 48 hours)

### 1. Railway: Trial expiring
- **Account:** `jayanthmbj@gmail.com` (NOT migrated like Neon/Upstash/Vercel)
- **Status:** $2.05 / 2 days remaining
- **URL:** https://railway.com/project/4d3d9cc1-dfee-467a-b55d-413c537ad757

**Recommended:** Upgrade to Hobby plan ($5/mo). One click on the
Railway dashboard. This restores the cron-driven scraper container
that handles weather, dam, and traffic data. Without it, those
modules stay frozen indefinitely.

**After upgrade:** When Jayanth does the unified `git push origin main`
later, Railway will see commit `bc33bec` (the package-lock fix from
Apr 22) and start successfully deploying again. The Apr 22-25 deploy
failures (`npm error Invalid Version`) were caused by a transitive
dependency ghost entry that's already fixed.

**Future:** Migrate Railway from `jayanthmbj@gmail.com` to
`zurvoapp@gmail.com` to consolidate accounts. Railway has a Project
Transfer feature in Settings.

---

## 🟠 IMPORTANT (this week)

### 2. Razorpay ₹999 plan creation
- Open Razorpay dashboard → Subscriptions → Plans → Create plan
- Plan name: "State Champion" (or similar)
- Amount: ₹999, monthly
- Copy the resulting `plan_id` (format: `plan_XXXXXXXXXXXXXX`)
- Paste into `src/lib/razorpay/plans.ts` line 42, replacing
  `REPLACE_WITH_NEW_999_PLAN_ID`
- Commit + include in unified push

Confirmed by Phase 5 audit: placeholder `REPLACE_WITH_NEW_999_PLAN_ID`
still present in `src/lib/razorpay/plans.ts:42`.

### 3. RESEND_API_KEY — verify domain in Resend dashboard

**Phase 3 verdict (Apr 26):** Local probe of `https://api.resend.com/domains`
with the `.env.local` key returned:
```
HTTP 401  {"statusCode":401,"message":"This API key is restricted to only send emails","name":"restricted_api_key"}
```

This means:
- ✓ Key is **valid and operational** (a truly invalid key returns "Invalid API key")
- ✓ Key has **send-only scope** (least-privilege, intentional)
- ⚠ Domain verification status **cannot** be confirmed via this restricted key

**Action:** open https://resend.com/domains directly. If `forthepeople.in`
shows `verified: true`, emails will send and the Vercel "Needs Attention"
badge can be dismissed (it's the standard "confirm a verified sender
domain exists" nudge). If no verified domain, add SPF + DKIM DNS records
and wait for verification.

If the key needs to be regenerated (e.g., for a full-permission token to
manage domains via API), update both `.env.local` and Vercel env vars.

### 4. Sentry SDK initialization (PARTIALLY-INSTALLED, needs decision)

**Phase 4 verdict:**
- ✓ `@sentry/nextjs ^10.48.0` is installed in `package.json`
- ✓ `next.config.ts` wraps with `withSentryConfig({ org: "forthepeople", project: "forthepeople-web" })`
- ✓ `Sentry.captureException()` called in 7+ places (cron routes, `global-error.tsx`, API routes)
- ✗ **NO `instrumentation.ts`** (or per-runtime `sentry.{client,server,edge}.config.ts`)

Sentry SDK v10 requires SDK initialization in `instrumentation.ts`
(Next 13+ pattern). Without it, the SDK is loaded but never initialized
→ `captureException()` calls become no-ops → 0 events received in
Sentry console (matches what Jayanth observed).

**Two issues need clarification before any code change:**

(a) **Org / project name mismatch** —
   - `next.config.ts` says: `org: "forthepeople", project: "forthepeople-web"`
   - Jayanth's Sentry dashboard shows: `forthepeoplein / javascript-nextjs`

   Which is the canonical project? If `forthepeoplein/javascript-nextjs`,
   `next.config.ts` needs a 2-line edit. If `forthepeople/forthepeople-web`,
   ensure that project actually exists in the Sentry dashboard.

(b) **Once (a) is resolved**, install the missing init file. Two paths:
   - **Manual** (~15 lines, no wizard noise): create `instrumentation.ts`
     at repo root with `import * as Sentry from "@sentry/nextjs";` and a
     `Sentry.init({ dsn: process.env.NEXT_PUBLIC_SENTRY_DSN, tracesSampleRate: 0.1 })`
     call wrapped in a `register()` export per Next.js docs.
   - **Wizard** (interactive, generates 5 files):
     ```
     npx @sentry/wizard@latest -i nextjs --saas --org <CORRECT_ORG> --project <CORRECT_PROJECT>
     ```
     Estimated total commits added if approved: 1.

After deploy: trigger a deliberate test error in production to verify
events flow into Sentry within 5 min.

---

## 🛡️ DEFAULTS to enable (cost/safety controls)

### 5. Neon spending limit
- URL: https://console.neon.tech/app/org-dry-lab-59757599/billing
- Click "Enable spending limits" banner
- Recommended limit: $10/mo (₹830) — alerts long before any surprise

### 6. Upstash Redis already has $50 budget cap on Pay-As-You-Go ✓
No action needed. `forthepeople-production`, $0.29 / $50 used this month,
endpoint `allowing-kid` matches Vercel `REDIS_URL` — no drift.

### 7. Vercel "Needs Attention" — only RESEND_API_KEY actually flagged
Earlier audit incorrectly listed OPENWEATHER and DATA_GOV — those
are NOT flagged. Only RESEND. See item #3 above for the verdict
and required dashboard check.

---

## ✅ HEALTHY — confirmed Apr 26 ~08:00 UTC, no action needed

- **Vercel Pro** (zurvoapp account): 0% error rate over 6h, 24K edge
  requests, all 5 crons firing.
- **Neon "Launch"** paid plan: project ForThePeople active, DB compute
  hot every few minutes.
- **Upstash Redis** `forthepeople-production`: Pay-As-You-Go with $50
  budget cap, $0.29/$50 used this month, 143K commands, 313 KB storage.
  Endpoint `allowing-kid` matches Vercel REDIS_URL — no drift.
- **News scrapers:** writing fresh rows every 24h cycle (8 of 10
  districts updated within last hour at audit time).
- **AI cron pipeline:** news-intelligence (every 4h) + generate-insights
  (every 12h) — both writing within last cron cycle.
- **AGMARKNET (data.gov.in)** crops endpoint: API itself is healthy
  (returns 200 with records), but the data hasn't been updated since
  2026-04-21 — verified across all 10 districts via Phase 4
  `[scrape-debug]` instrumentation. NOT a code bug, NOT a budget issue.

---

## 🆕 Fixed in this session (already committed locally)

- **Homepage `Last Updated` stat** — was showing "2 days ago" and
  climbing because `mostRecentAt` only read `cropPrice.fetchedAt`
  (AGMARKNET upstream stale) and `weatherReading.recordedAt` (Railway
  scraper offline). Now reads `newsItem.fetchedAt` + `infraUpdate.createdAt`
  + `localAlert.createdAt`. CACHE_KEY bumped v2 → v3 to force Redis
  cache eviction on next deploy. Verified locally:
  pre-fix `2026-04-24T03:30:43Z` → post-fix `2026-04-26T06:03:47Z`.
