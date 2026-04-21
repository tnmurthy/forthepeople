# LEGAL-COMPLIANCE.md — ForThePeople.in Language & Compliance Rules

# Permanent Language Rules (Public-Facing Text)

The following words must NEVER appear on any user-facing page, UI text,
meta description, structured data field, or public API response:

- "scrape", "scraper", "scraping", "scraped"
- "corruption"
- "suspicious" (in the context of spending or projects)
- "promises vs reality"
- "ACTUALLY" in caps (in the context of timelines or government)
- "hold power accountable"

Internal code is fine — file names, function names, TypeScript comments,
server logs, and database model names like ScraperLog are not user-facing.

## Approved Neutral Alternatives

- For data collection: "sourced from", "aggregated from", "collected from"
- For spending oversight: "Budget Utilization", "Fund Allocation", "Fiscal Transparency"
- For representative tracking: "Elected Representative Dashboard",
  "projects delivered", "budget utilized", "progress on announced initiatives"
- For governance engagement: "engage with governance based on facts"
- For data refresh: "data refresh status", "update frequency", "refresh interval"

---

## DEMOGRAPHICS / POPULATION MODULE — LEGAL POSTURE

Added 2026-04-21 with Population Module v2.

### Applicable laws

| Law | Exposure | Mitigation |
|---|---|---|
| **IPC §153A / BNS §196-197** (promoting enmity between groups) | HIGH procedural — FIR risk on religion/caste displays. Conviction ~20% (NCRB), but defence costs ₹25-75L per case | (a) Neutral framing throughout — no "majority/minority/dominant" language; (b) Alphabetical ordering of religion categories (Buddhist, Christian, Hindu, Jain, Muslim, NotStated, Other, Sikh) and caste (SC, ST, Other); (c) §3B disclaimer explicitly declares no intent to promote disharmony; (d) 15-day grievance SLA via support@forthepeople.in; (e) Case precedents pre-compiled: Bilal Kaloo (1997) 7 SCC 431, Manzar Sayeed Khan (2007) 5 SCC 1, Patricia Mukhim (2021), Javed Hajam 2024 INSC 187, Kongkon Borthakur (Gauhati HC, 7 Aug 2024 — explicitly protected demographic journalism). |
| **RPA 1951 §126 + ECI Model Code of Conduct** | HIGH during election windows — constituency-level demographic visualisations within 48h of poll can trigger ECI notice | Election Mode feature flag (`electionModeActive` prop on `DemographicDisclaimer`). When active: constituency-level overlays disabled, §3E disclaimer banner shown, social-sharing disabled for demographic pages. Lockdown from ECI schedule date through 48-hour silence period. |
| **IT Rules 2021 Rule 3(2)** — publisher obligations | MEDIUM | support@forthepeople.in is the Grievance Officer address. 15-day response SLA. Monthly compliance report. No §79 safe harbour (we are publisher, not intermediary). |
| **PCPNDT Act 1994 §22** | LOW | Displaying Child Sex Ratio IS LAWFUL. What's prohibited is advertising sex-determination services. §3D disclaimer makes this clear. No advertising on any page. No links to diagnostic services from CSR-related content. |
| **SC/ST (Prevention of Atrocities) Act 1989 §3(1)(u)** | MEDIUM | Constitutional categories only (SC, ST, Other) — NEVER individual jati or sub-caste names. §3C disclaimer cites statutory classifications. Neutral grays for caste — no saturated colour. |
| **DPDP Act 2023** (full enforcement 13 May 2027) | LOW at v1 scope | All data is statistical aggregate. §3(c)(ii) exempts publicly-available data. Cell suppression n<10 in any future ward-level display. No cross-tabulation of religion × caste × ward. §3F disclaimer. |
| **Census Act 1948** | — | Legal basis for Census data being public. |
| **Copyright Act §52(1)(q) + GODL-India** (Gazette notification Feb 2017) | — | Enables reuse of Census, NFHS, NITI, MoSPI data. Attribution is compulsory via `<DataSourceCard>` on every chart. |
| **Defamation (IPC 499/500 / BNS 356-357)** | LOW at aggregate level | Per-chart source attribution; right-of-reply within 7 days via support@. |

### SECC 2011 caste data — why we don't display

The Government of India formally stated in Supreme Court proceedings (*State of
Maharashtra v. Union of India*, 2021) that raw SECC 2011 caste tables contained
classification errors and were "unusable"; ~4.67 million caste/sub-caste/gotra/
surname strings were recorded and the raw data has NOT been publicly released.
ForThePeople.in does not attempt to reconstruct or display this un-released data.
The caste display on ForThePeople.in uses ONLY the constitutional categories
(SC, ST, Other) drawn from Census 2011.

### Bengaluru Urban MPI rank 3 — worked example

During Group D seeding on 2026-04-21 we extracted MPI data from the NITI
Progress Review 2023 PDF. Bengaluru Urban came out as rank 3 of 30 Karnataka
districts by MPI headcount (H=1.47%), not rank 1 as initially assumed.
Ramanagara (H=0.88%) and Bengaluru Rural (H=0.99%) rank higher/better. This
is worth internalising: NEVER force seeded data to match a pre-existing
expectation. The PDF is authoritative; our assumptions are not.

### Disclaimer component IDs (audit + defence reference)

`src/components/demographics/DemographicDisclaimer.tsx` renders 7 sections
with stable identifiers:

| ID | Section |
|---|---|
| `§3A` | About this module |
| `§3B` | Religion data |
| `§3C` | Caste-category data |
| `§3D` | Child sex ratio (PCPNDT) |
| `§3E` | Election Mode (conditional) |
| `§3F` | Aggregate-only / privacy |
| `§3G` | Methodology & sources |

If a legal notice arrives referencing demographic content, the relevant §3X
section is the first artifact to cite in response.

### Grievance routing

ALL demographic-module grievances route to `support@forthepeople.in`. No
separate email (no `grievance@`, `demography@`, or any other). 15-day response
SLA per IT Rules 2021. Per-district update log (`DemographicUpdate` model)
carries update history — helps establish good-faith due diligence.

### Permanent policy — what ForThePeople.in NEVER displays

- Any ward-level demographic cross-tabulation (religion × caste × ward etc.)
- Any household-level or individual-level data
- Any colour-coded "which religion is dominant in which area" map
- Any jati / sub-caste / OBC drilldown (statutory categories only)
- Any forward population projection except UN WUP numbers cited as such
- Any overlay of crime or controversy data on religion/caste visualisations
- Any data from SECC 2011 raw caste tables (un-released by GoI)
