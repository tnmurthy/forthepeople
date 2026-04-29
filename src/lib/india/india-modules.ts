/**
 * ForThePeople.in — Your District. Your Data. Your Right.
 * © 2026 Jayanth M B. MIT License with Attribution.
 *
 * The /[locale]/india page is driven by this registry.
 * Adding a new module = adding one entry here. The page loops through
 * INDIA_MODULES and renders one band per `live` module + a Coming Soon
 * Rail for the rest. See docs/india/31 §7-§8 + docs/india/32 §4.
 *
 * IMPORTANT: do NOT add hardcoded numeric values here. The registry
 * declares structure (slug, sources, refresh tier, scraperKeys); actual
 * values come from IndiaIndicator (DB) populated by scrapers under
 * src/scraper/india/.
 *
 * Initial-status policy (Phase 0):
 *   - "live"          → at least one scraper exists or is about to exist,
 *                       and the upstream source is reachable via plain
 *                       HTTP + pdf-parse (no JS rendering required).
 *   - "coming_soon"   → either (a) the source requires JS rendering / OCR
 *                       and needs an Apify rag-web-browser fallback before
 *                       it can go live (Phase 8), or (b) the scraper hasn't
 *                       been written yet.
 *
 * Per the audit's Correction 3, these slugs were demoted from `live`
 * (file 31 §8 default) to `coming_soon` because the upstream is JS-heavy
 * or scanned-PDF and would 404 on first scraper run:
 *   - elections-loksabha, elections-rajyasabha, elections-turnout (eci.gov.in JS + bot blocking)
 *   - justice-pendency (njdg.ecourts.gov.in Tableau dashboard)
 *   - justice-crime (NCRB Crime in India released as scanned PDFs → OCR pipeline)
 *   - health-pmjay (Tableau-style dashboard)
 *   - education-schools (UDISE+ Tableau, partial login walls)
 *   - science-isro (JS-heavy mission listing; PIB feed is the proven backup)
 */

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
  | "custom";

export type IndiaModuleStatus = "live" | "beta" | "coming_soon";

export interface IndiaModuleSource {
  /** Lookup key into INDIA_SOURCES (src/lib/india/india-sources.ts). */
  sourceKey: string;
  /** How the scraper interacts with this source. */
  type: "API" | "Static" | "Collected" | "RSS" | "Institutional";
  /** Display-only label for the refresh cadence (matches the scraper tier). */
  refresh:
    | "Daily"
    | "Weekly"
    | "Monthly"
    | "Quarterly"
    | "Annual"
    | "Event-driven"
    | "Manual";
}

export interface IndiaModuleDef {
  /** URL-safe slug; also the moduleSlug stored in IndiaIndicator. */
  slug: string;
  category: IndiaModuleCategory;
  title: string;
  /** Emoji or lucide icon name; rendered in the section header. */
  icon: string;
  /** One-line description shown under the section title. */
  tagline: string;
  /** Longer description for the Coming Soon card and module deep-link page. */
  description: string;
  status: IndiaModuleStatus;
  /** Top-to-bottom order on /[locale]/india. Lower = higher on the page. */
  displayOrder: number;
  /** Sources cited under every metric in this module. */
  sources: IndiaModuleSource[];
  /** Component file under src/components/india/modules/<componentName>.tsx. */
  componentName: string;
  /** Inline italic disclaimer for sensitive sections (Defence, Health, etc.). */
  legalNote?: string;
  /** Renders the IndiaStateLeaderboard widget inside the band. */
  hasStateBreakdown?: boolean;
  /** Renders the IndiaTimeSeriesChart widget inside the band. */
  hasTimeSeries?: boolean;
  /**
   * Scraper keys (from src/scraper/india/_registry.ts, Phase 5) that
   * populate this module. One module can be fed by multiple scrapers.
   */
  scraperKeys: string[];
}

export const INDIA_MODULES: IndiaModuleDef[] = [
  // ── Snapshot & Demographics ────────────────────────────────
  {
    slug: "national-snapshot",
    category: "snapshot",
    title: "National Snapshot",
    icon: "🇮🇳",
    tagline: "States, UTs, languages, geographic area at a glance.",
    description:
      "Constitutional and near-static reference values about the Republic of India.",
    status: "live",
    displayOrder: 1,
    sources: [
      { sourceKey: "MHA", type: "Static", refresh: "Annual" },
      { sourceKey: "CONSTITUTION", type: "Static", refresh: "Annual" },
      { sourceKey: "SOI", type: "Static", refresh: "Annual" },
      { sourceKey: "LGD", type: "Collected", refresh: "Monthly" },
    ],
    componentName: "NationalSnapshotModule",
    scraperKeys: ["mha-states-uts", "lgd-districts-count"],
  },
  {
    slug: "demographics-population",
    category: "demographics",
    title: "Population & Demographics",
    icon: "👥",
    tagline: "Population, fertility, life expectancy from SRS and Census.",
    description:
      "Annual SRS bulletin and decennial Census aggregates. SRS releases CBR, " +
      "CDR, IMR, life expectancy each year; Census provides full age-sex pyramid.",
    status: "live",
    displayOrder: 2,
    sources: [
      { sourceKey: "CENSUS", type: "Collected", refresh: "Annual" },
      { sourceKey: "MoSPI", type: "Collected", refresh: "Annual" },
    ],
    componentName: "DemographicsModule",
    hasTimeSeries: true,
    scraperKeys: ["srs-population"],
  },

  // ── Economy ────────────────────────────────────────────────
  {
    slug: "economy-gdp",
    category: "economy",
    title: "Economy & GDP",
    icon: "📈",
    tagline: "Quarterly GDP, GVA, sectoral growth from MoSPI.",
    description:
      "Real and nominal GDP, GVA by sector, Q-on-Q and Y-on-Y growth — released " +
      "end-Feb / end-May / end-Aug / end-Nov per MoSPI press notes.",
    status: "live",
    displayOrder: 3,
    sources: [
      { sourceKey: "MoSPI", type: "Collected", refresh: "Quarterly" },
      { sourceKey: "RBI", type: "Collected", refresh: "Quarterly" },
    ],
    componentName: "EconomyGdpModule",
    hasTimeSeries: true,
    scraperKeys: ["mospi-gdp"],
  },
  {
    slug: "economy-inflation",
    category: "economy",
    title: "Inflation & Prices",
    icon: "🛒",
    tagline: "CPI and WPI — monthly inflation from MoSPI and DPIIT.",
    description:
      "CPI (combined / rural / urban) on the 12th and WPI on the 14th. " +
      "Year-on-year change is the headline metric; series goes back decades.",
    status: "live",
    displayOrder: 4,
    sources: [
      { sourceKey: "MoSPI", type: "Collected", refresh: "Monthly" },
      { sourceKey: "EAINDUSTRY_WPI", type: "Collected", refresh: "Monthly" },
    ],
    componentName: "EconomyInflationModule",
    hasTimeSeries: true,
    scraperKeys: ["mospi-cpi", "dpiit-wpi"],
  },
  {
    slug: "economy-employment",
    category: "economy",
    title: "Employment (PLFS)",
    icon: "💼",
    tagline: "Labour force participation, unemployment from MoSPI PLFS.",
    description:
      "Periodic Labour Force Survey monthly bulletin — LFPR, WPR, " +
      "unemployment rate by Current Weekly Status (CWS).",
    status: "live",
    displayOrder: 5,
    sources: [{ sourceKey: "MoSPI", type: "Collected", refresh: "Monthly" }],
    componentName: "EconomyEmploymentModule",
    hasTimeSeries: true,
    scraperKeys: ["mospi-plfs"],
  },

  // ── Budget ────────────────────────────────────────────────
  {
    slug: "budget-union",
    category: "budget",
    title: "Union Budget",
    icon: "🏛️",
    tagline: "Annual Union Budget allocations, monthly CGA actuals.",
    description:
      "Total expenditure, revenue/capital split, top 10 ministries by " +
      "allocation. CGA Monthly Account tracks actual receipts vs estimates.",
    status: "live",
    displayOrder: 6,
    sources: [
      { sourceKey: "MoF_BUDGET", type: "Collected", refresh: "Annual" },
      { sourceKey: "CGA", type: "Collected", refresh: "Monthly" },
    ],
    componentName: "BudgetUnionModule",
    scraperKeys: ["indiabudget-allocations", "cga-monthly-accounts"],
  },
  {
    slug: "budget-gst",
    category: "budget",
    title: "GST Collections",
    icon: "🧾",
    tagline: "Monthly Gross GST collection, CGST/SGST/IGST split.",
    description:
      "Gross GST mop-up (CGST + SGST + IGST + Cess) released by GST Council " +
      "/ Ministry of Finance on the 1st of each month.",
    status: "live",
    displayOrder: 7,
    sources: [{ sourceKey: "GST_COUNCIL", type: "Collected", refresh: "Monthly" }],
    componentName: "BudgetGstModule",
    hasTimeSeries: true,
    hasStateBreakdown: true,
    scraperKeys: ["gst-collections"],
  },

  // ── Agriculture ───────────────────────────────────────────
  {
    slug: "agriculture-production",
    category: "agriculture",
    title: "Crop Production",
    icon: "🌾",
    tagline: "Crop estimates, mandi count, AGMARKNET coverage.",
    description:
      "DA&FW Advance Estimates of crop production (1st/2nd/3rd/4th) " +
      "released quarterly. Mandi count tracked monthly via AGMARKNET.",
    status: "live",
    displayOrder: 8,
    sources: [
      { sourceKey: "DAFW", type: "Collected", refresh: "Quarterly" },
      { sourceKey: "AGMARKNET", type: "Collected", refresh: "Monthly" },
    ],
    componentName: "AgricultureProductionModule",
    scraperKeys: ["dafw-crop-estimates", "agmarknet-mandi-count"],
  },
  {
    slug: "agriculture-plantation",
    category: "agriculture",
    title: "Plantation Crops",
    icon: "🍃",
    tagline: "Tea, coffee, rubber, spices — production and exports.",
    description:
      "Commodity board data for India's plantation sector. Each board (Tea/" +
      "Coffee/Rubber/Spices) publishes its own annual statistics report.",
    status: "coming_soon",
    displayOrder: 9,
    sources: [{ sourceKey: "DAFW", type: "Collected", refresh: "Annual" }],
    componentName: "AgriculturePlantationModule",
    scraperKeys: [],
  },
  {
    slug: "agriculture-pmkisan",
    category: "agriculture",
    title: "PM-KISAN",
    icon: "💰",
    tagline: "Cumulative beneficiaries and disbursements.",
    description:
      "Direct income support to small and marginal farmers. PM-KISAN portal " +
      "publishes cumulative beneficiary and instalment counts.",
    status: "live",
    displayOrder: 10,
    sources: [{ sourceKey: "PMKISAN", type: "Collected", refresh: "Monthly" }],
    componentName: "AgriculturePmKisanModule",
    hasTimeSeries: true,
    scraperKeys: ["pmkisan-beneficiaries"],
  },

  // ── Livestock ─────────────────────────────────────────────
  {
    slug: "livestock-census",
    category: "livestock",
    title: "Livestock & Dairy",
    icon: "🐄",
    tagline: "Livestock Census + NDDB milk production.",
    description:
      "Quinquennial Livestock Census and annual NDDB dairy data — milk " +
      "production by state, breed registry, cooperative reach.",
    status: "coming_soon",
    displayOrder: 11,
    sources: [{ sourceKey: "DAFW", type: "Collected", refresh: "Annual" }],
    componentName: "LivestockCensusModule",
    scraperKeys: [],
  },
  {
    slug: "livestock-fisheries",
    category: "livestock",
    title: "Fisheries",
    icon: "🐟",
    tagline: "Inland and marine fish production, exports.",
    description:
      "Department of Fisheries annual data — production by state, exports, " +
      "PMMSY beneficiaries.",
    status: "coming_soon",
    displayOrder: 12,
    sources: [{ sourceKey: "DAFW", type: "Collected", refresh: "Annual" }],
    componentName: "LivestockFisheriesModule",
    scraperKeys: [],
  },

  // ── Wildlife ──────────────────────────────────────────────
  {
    slug: "wildlife-forests",
    category: "wildlife",
    title: "Forests & Wildlife",
    icon: "🌳",
    tagline: "Forest cover from FSI's biennial India State of Forest Report.",
    description:
      "Total forest cover, tree cover, very dense / moderately dense / open " +
      "forest split — sourced from FSI's ISFR.",
    status: "live",
    displayOrder: 13,
    sources: [{ sourceKey: "FSI", type: "Collected", refresh: "Annual" }],
    componentName: "WildlifeForestsModule",
    hasStateBreakdown: true,
    scraperKeys: ["fsi-forest-cover"],
  },
  {
    slug: "wildlife-tigers",
    category: "wildlife",
    title: "Tiger Conservation",
    icon: "🐅",
    tagline: "Tiger reserves, population estimates from NTCA.",
    description:
      "Tiger population estimates (Status of Tigers, every 4 years), " +
      "tiger reserves, conservation funding via NTCA.",
    status: "live",
    displayOrder: 14,
    sources: [{ sourceKey: "NTCA", type: "Collected", refresh: "Annual" }],
    componentName: "WildlifeTigersModule",
    scraperKeys: ["ntca-tigers"],
  },
  {
    slug: "wildlife-protected-areas",
    category: "wildlife",
    title: "National Parks & Sanctuaries",
    icon: "🦁",
    tagline: "Protected area network — NPs, sanctuaries, Ramsar sites.",
    description:
      "Wildlife Institute of India database of all protected areas, plus " +
      "Ramsar wetland designations and biosphere reserves.",
    status: "live",
    displayOrder: 15,
    sources: [{ sourceKey: "WII", type: "Collected", refresh: "Quarterly" }],
    componentName: "WildlifeProtectedAreasModule",
    scraperKeys: ["wii-protected-areas"],
  },

  // ── Infrastructure ────────────────────────────────────────
  {
    slug: "infra-roads",
    category: "infrastructure",
    title: "Roads & Highways",
    icon: "🛣️",
    tagline: "National highway length, NHAI projects.",
    description:
      "MoRTH quarterly status — total NH km, ongoing project count and " +
      "value, expressways under construction.",
    status: "live",
    displayOrder: 16,
    sources: [{ sourceKey: "MORTH", type: "Collected", refresh: "Quarterly" }],
    componentName: "InfraRoadsModule",
    scraperKeys: ["morth-highways"],
  },
  {
    slug: "infra-railways",
    category: "infrastructure",
    title: "Railways",
    icon: "🚆",
    tagline: "Network length, passenger and freight from Indian Railways.",
    description:
      "Annual yearbook from Indian Railways — track km, electrification, " +
      "passenger originating, freight originating tonnes.",
    status: "live",
    displayOrder: 17,
    sources: [{ sourceKey: "RAILWAYS", type: "Collected", refresh: "Annual" }],
    componentName: "InfraRailwaysModule",
    scraperKeys: ["railways-yearbook"],
  },
  {
    slug: "infra-aviation",
    category: "infrastructure",
    title: "Aviation",
    icon: "✈️",
    tagline: "DGCA monthly traffic, fleet, airports.",
    description:
      "DGCA Monthly Performance Report — passenger traffic by airport, " +
      "domestic vs international, fleet size by carrier.",
    status: "live",
    displayOrder: 18,
    sources: [{ sourceKey: "DGCA", type: "Collected", refresh: "Monthly" }],
    componentName: "InfraAviationModule",
    hasStateBreakdown: true,
    scraperKeys: ["dgca-aviation"],
  },
  {
    slug: "infra-ports",
    category: "infrastructure",
    title: "Ports & Shipping",
    icon: "🚢",
    tagline: "Major and non-major port traffic.",
    description:
      "Indian Ports Association data on cargo throughput, container traffic, " +
      "vessel calls at the 12 major ports plus state-handled non-major ports.",
    status: "coming_soon",
    displayOrder: 19,
    sources: [{ sourceKey: "MORTH", type: "Collected", refresh: "Monthly" }],
    componentName: "InfraPortsModule",
    scraperKeys: [],
  },
  {
    slug: "infra-telecom",
    category: "infrastructure",
    title: "Telecom & Internet",
    icon: "📡",
    tagline: "TRAI subscribers, broadband penetration.",
    description:
      "TRAI Performance Indicators Report — total wireless and wireline " +
      "subscribers, urban/rural split, broadband and FTTH penetration.",
    status: "live",
    displayOrder: 20,
    sources: [{ sourceKey: "TRAI", type: "Collected", refresh: "Monthly" }],
    componentName: "InfraTelecomModule",
    hasStateBreakdown: true,
    scraperKeys: ["trai-telecom"],
  },
  {
    slug: "infra-smart-cities",
    category: "infrastructure",
    title: "Smart Cities Mission",
    icon: "🏙️",
    tagline: "Project completion, fund utilisation across 100 cities.",
    description:
      "Smart Cities Mission dashboard — projects sanctioned, completed, " +
      "under implementation, funds released vs utilised.",
    status: "coming_soon",
    displayOrder: 21,
    sources: [{ sourceKey: "MORTH", type: "Collected", refresh: "Monthly" }],
    componentName: "InfraSmartCitiesModule",
    scraperKeys: [],
  },

  // ── Energy ────────────────────────────────────────────────
  {
    slug: "energy-power",
    category: "energy",
    title: "Power Generation",
    icon: "⚡",
    tagline: "CEA installed capacity, generation by source.",
    description:
      "CEA Monthly Executive Summary — total installed capacity, monthly " +
      "generation by thermal/hydro/nuclear/RE, peak demand.",
    status: "live",
    displayOrder: 22,
    sources: [{ sourceKey: "CEA", type: "Collected", refresh: "Monthly" }],
    componentName: "EnergyPowerModule",
    hasStateBreakdown: true,
    hasTimeSeries: true,
    scraperKeys: ["cea-power-monthly"],
  },
  {
    slug: "energy-renewables",
    category: "energy",
    title: "Renewable Energy",
    icon: "☀️",
    tagline: "Installed RE capacity by segment from MNRE.",
    description:
      "MNRE monthly bulletin — solar (utility + rooftop), wind, biomass, " +
      "small hydro, total non-hydro RE installed capacity.",
    status: "live",
    displayOrder: 23,
    sources: [{ sourceKey: "MNRE", type: "Collected", refresh: "Monthly" }],
    componentName: "EnergyRenewablesModule",
    hasStateBreakdown: true,
    hasTimeSeries: true,
    scraperKeys: ["mnre-renewable"],
  },
  {
    slug: "energy-fuels",
    category: "energy",
    title: "Petroleum & Fuels",
    icon: "🛢️",
    tagline: "Crude import, product consumption, retail prices.",
    description:
      "PPAC monthly snapshot — crude imports, refinery throughput, " +
      "petrol/diesel/LPG consumption, retail price ranges.",
    status: "coming_soon",
    displayOrder: 24,
    sources: [{ sourceKey: "MNRE", type: "Collected", refresh: "Monthly" }],
    componentName: "EnergyFuelsModule",
    scraperKeys: [],
  },
  {
    slug: "energy-coal",
    category: "energy",
    title: "Coal",
    icon: "⚫",
    tagline: "Coal production, despatch, stock at thermal plants.",
    description:
      "Ministry of Coal monthly data — domestic production, imports, " +
      "despatch to power sector, stock at coal-based power plants.",
    status: "coming_soon",
    displayOrder: 25,
    sources: [{ sourceKey: "CEA", type: "Collected", refresh: "Monthly" }],
    componentName: "EnergyCoalModule",
    scraperKeys: [],
  },

  // ── Health ────────────────────────────────────────────────
  {
    slug: "health-overview",
    category: "health",
    title: "Health Indicators",
    icon: "🏥",
    tagline: "Headline NFHS-5 indicators and NHM coverage.",
    description:
      "NFHS-5 anthropometrics, child mortality, immunisation coverage. " +
      "Aggregate national values — state breakdowns inside.",
    status: "live",
    displayOrder: 26,
    sources: [
      { sourceKey: "MOHFW", type: "Collected", refresh: "Annual" },
      { sourceKey: "RCHIIPS_NFHS", type: "Collected", refresh: "Annual" },
    ],
    componentName: "HealthOverviewModule",
    legalNote: "health",
    hasStateBreakdown: true,
    scraperKeys: ["nfhs5-indicators"],
  },
  {
    slug: "health-pmjay",
    category: "health",
    title: "Ayushman Bharat (PM-JAY)",
    icon: "🩺",
    tagline: "Cards issued, hospitals empanelled, treatments authorised.",
    description:
      "NHA monthly dashboard — total Ayushman cards issued, empanelled " +
      "hospitals, hospitalisation events authorised.",
    status: "coming_soon",
    displayOrder: 27,
    sources: [{ sourceKey: "NHA_PMJAY", type: "Collected", refresh: "Monthly" }],
    componentName: "HealthPmJayModule",
    legalNote: "health",
    scraperKeys: [],
  },
  {
    slug: "health-immunisation",
    category: "health",
    title: "Vaccination & U-WIN",
    icon: "💉",
    tagline: "Cumulative U-WIN beneficiary registrations.",
    description:
      "Universal immunisation registry numbers — cumulative beneficiaries, " +
      "doses administered, antigen-wise coverage.",
    status: "live",
    displayOrder: 28,
    sources: [{ sourceKey: "UWIN", type: "Collected", refresh: "Monthly" }],
    componentName: "HealthImmunisationModule",
    legalNote: "health",
    scraperKeys: ["uwin-immunisation"],
  },

  // ── Education ─────────────────────────────────────────────
  {
    slug: "education-schools",
    category: "education",
    title: "Schools (UDISE+)",
    icon: "🏫",
    tagline: "School count, enrolment, infrastructure from UDISE+.",
    description:
      "Annual UDISE+ census — total schools, enrolment by stage, " +
      "infrastructure (toilets, electricity, computers), teacher count.",
    status: "coming_soon",
    displayOrder: 29,
    sources: [{ sourceKey: "UDISE", type: "Collected", refresh: "Annual" }],
    componentName: "EducationSchoolsModule",
    hasStateBreakdown: true,
    scraperKeys: [],
  },
  {
    slug: "education-higher",
    category: "education",
    title: "Higher Education",
    icon: "🎓",
    tagline: "AISHE annual aggregates — students, institutions, GER.",
    description:
      "All India Survey on Higher Education — enrolment, GER by gender " +
      "and category, recognised universities and colleges.",
    status: "live",
    displayOrder: 30,
    sources: [
      { sourceKey: "AISHE", type: "Collected", refresh: "Annual" },
      { sourceKey: "UGC", type: "Collected", refresh: "Annual" },
      { sourceKey: "AICTE", type: "Collected", refresh: "Annual" },
    ],
    componentName: "EducationHigherModule",
    scraperKeys: ["aishe-higher"],
  },
  {
    slug: "education-skills",
    category: "education",
    title: "Skill India",
    icon: "🛠️",
    tagline: "PMKVY beneficiaries, ITI seats, NCVET certifications.",
    description:
      "Ministry of Skill Development data — PMKVY trained and placed, " +
      "ITI seats and admissions, NSDC scheme coverage.",
    status: "coming_soon",
    displayOrder: 31,
    sources: [{ sourceKey: "AICTE", type: "Collected", refresh: "Annual" }],
    componentName: "EducationSkillsModule",
    scraperKeys: [],
  },

  // ── Defence ───────────────────────────────────────────────
  {
    slug: "defence-budget",
    category: "defence",
    title: "Defence Budget (Public)",
    icon: "🛡️",
    tagline: "Demand 17/19/20 — capital and revenue allocations.",
    description:
      "Defence allocations from the Union Budget (Demands 17/19/20) — total, " +
      "capital outlay, modernisation. Public figures only.",
    status: "live",
    displayOrder: 32,
    sources: [
      { sourceKey: "MOD", type: "Collected", refresh: "Annual" },
      { sourceKey: "MoF_BUDGET", type: "Collected", refresh: "Annual" },
    ],
    componentName: "DefenceBudgetModule",
    legalNote: "defence",
    scraperKeys: ["mod-budget"],
  },
  {
    slug: "defence-exports",
    category: "defence",
    title: "Defence Exports",
    icon: "📦",
    tagline: "Quarterly defence export figures via PIB.",
    description:
      "MoD-released defence export totals via PIB releases tagged Defence " +
      "Production. Quarterly cadence; aggregate value only.",
    status: "live",
    displayOrder: 33,
    sources: [
      { sourceKey: "MOD", type: "Collected", refresh: "Quarterly" },
      { sourceKey: "PIB", type: "Collected", refresh: "Quarterly" },
    ],
    componentName: "DefenceExportsModule",
    legalNote: "defence",
    scraperKeys: ["pib-defence-exports"],
  },
  {
    slug: "defence-dpsu",
    category: "defence",
    title: "DPSU Performance",
    icon: "🏭",
    tagline: "HAL, BEL, Mazagon — listed defence PSUs.",
    description:
      "Annual report data from listed Defence PSUs (HAL, BEL, Mazagon, " +
      "Cochin Shipyard, etc.) — revenue, profit, order book.",
    status: "coming_soon",
    displayOrder: 34,
    sources: [{ sourceKey: "MOD", type: "Collected", refresh: "Annual" }],
    componentName: "DefenceDpsuModule",
    legalNote: "defence",
    scraperKeys: [],
  },

  // ── Justice ───────────────────────────────────────────────
  {
    slug: "justice-pendency",
    category: "justice",
    title: "Court Pendency",
    icon: "⚖️",
    tagline: "Aggregate case pendency from NJDG.",
    description:
      "National Judicial Data Grid weekly snapshot — total pending cases " +
      "across district, high, and supreme courts. Aggregate only.",
    status: "coming_soon",
    displayOrder: 35,
    sources: [{ sourceKey: "NJDG", type: "Collected", refresh: "Weekly" }],
    componentName: "JusticePendencyModule",
    legalNote: "justice",
    scraperKeys: [],
  },
  {
    slug: "justice-crime",
    category: "justice",
    title: "NCRB Crime Statistics",
    icon: "🚔",
    tagline: "Annual Crime in India headline figures.",
    description:
      "National Crime Records Bureau Crime in India report — total IPC " +
      "cases, rate per lakh population. Released annually as a scanned PDF.",
    status: "coming_soon",
    displayOrder: 36,
    sources: [{ sourceKey: "NCRB", type: "Collected", refresh: "Annual" }],
    componentName: "JusticeCrimeModule",
    legalNote: "justice",
    scraperKeys: [],
  },
  {
    slug: "justice-police",
    category: "justice",
    title: "Police Strength (BPRD)",
    icon: "👮",
    tagline: "Sanctioned vs actual police strength from BPRD.",
    description:
      "Bureau of Police Research and Development annual data on " +
      "police organisations — strength, vacancies, ratio per lakh population.",
    status: "live",
    displayOrder: 37,
    sources: [{ sourceKey: "BPRD", type: "Collected", refresh: "Annual" }],
    componentName: "JusticePoliceModule",
    legalNote: "justice",
    hasStateBreakdown: true,
    scraperKeys: ["bprd-police"],
  },
  {
    slug: "justice-prisons",
    category: "justice",
    title: "Prison Statistics",
    icon: "🔒",
    tagline: "NCRB Prison Statistics India headline figures.",
    description:
      "Annual NCRB Prison Statistics — total prison population, undertrials, " +
      "convicts, capacity utilisation.",
    status: "coming_soon",
    displayOrder: 38,
    sources: [{ sourceKey: "NCRB", type: "Collected", refresh: "Annual" }],
    componentName: "JusticePrisonsModule",
    legalNote: "justice",
    scraperKeys: [],
  },

  // ── Elections ─────────────────────────────────────────────
  {
    slug: "elections-loksabha",
    category: "elections",
    title: "Lok Sabha",
    icon: "🗳️",
    tagline: "Composition, party-wise seats, vacancies.",
    description:
      "Election Commission of India data on the current Lok Sabha — " +
      "party-wise seat tally, vacancies, by-election results.",
    status: "coming_soon",
    displayOrder: 39,
    sources: [{ sourceKey: "ECI", type: "Collected", refresh: "Event-driven" }],
    componentName: "ElectionsLokSabhaModule",
    legalNote: "elections",
    scraperKeys: [],
  },
  {
    slug: "elections-rajyasabha",
    category: "elections",
    title: "Rajya Sabha",
    icon: "🏛️",
    tagline: "Party composition of the Council of States.",
    description:
      "Rajya Sabha membership and composition — party-wise strength, " +
      "elected vs nominated, vacancies.",
    status: "coming_soon",
    displayOrder: 40,
    sources: [
      { sourceKey: "RAJYA_SABHA", type: "Collected", refresh: "Monthly" },
    ],
    componentName: "ElectionsRajyaSabhaModule",
    legalNote: "elections",
    scraperKeys: [],
  },
  {
    slug: "elections-turnout",
    category: "elections",
    title: "Voter Turnout Trends",
    icon: "📊",
    tagline: "Historical Lok Sabha and state turnout from ECI.",
    description:
      "Long-run voter turnout series for Lok Sabha and state assembly " +
      "elections, from ECI's statistical reports.",
    status: "coming_soon",
    displayOrder: 41,
    sources: [{ sourceKey: "ECI", type: "Collected", refresh: "Annual" }],
    componentName: "ElectionsTurnoutModule",
    legalNote: "elections",
    hasTimeSeries: true,
    scraperKeys: [],
  },

  // ── Science ───────────────────────────────────────────────
  {
    slug: "science-isro",
    category: "science",
    title: "ISRO Missions",
    icon: "🚀",
    tagline: "Recent launches, satellite catalogue.",
    description:
      "ISRO mission count by year, recent launches, active satellite " +
      "catalogue. Event-driven — updates after each launch.",
    status: "coming_soon",
    displayOrder: 42,
    sources: [{ sourceKey: "ISRO", type: "Collected", refresh: "Event-driven" }],
    componentName: "ScienceIsroModule",
    scraperKeys: [],
  },
  {
    slug: "science-rd",
    category: "science",
    title: "R&D & Patents",
    icon: "🔬",
    tagline: "Gross R&D expenditure, patents granted.",
    description:
      "Department of Science & Technology R&D Statistics — GERD as % of " +
      "GDP, patents filed and granted via IP India.",
    status: "live",
    displayOrder: 43,
    sources: [
      { sourceKey: "DST", type: "Collected", refresh: "Annual" },
      { sourceKey: "IPINDIA", type: "Collected", refresh: "Annual" },
    ],
    componentName: "ScienceRdModule",
    scraperKeys: ["dst-rd"],
  },
  {
    slug: "science-startups",
    category: "science",
    title: "Startups & Unicorns",
    icon: "🦄",
    tagline: "DPIIT-recognised startups, unicorn count.",
    description:
      "Startup India / DPIIT recognised entities — total recognised, " +
      "by sector, by state, year-on-year growth.",
    status: "live",
    displayOrder: 44,
    sources: [
      { sourceKey: "STARTUP_INDIA", type: "Collected", refresh: "Monthly" },
      { sourceKey: "DPIIT", type: "Collected", refresh: "Monthly" },
    ],
    componentName: "ScienceStartupsModule",
    hasStateBreakdown: true,
    scraperKeys: ["dpiit-startups"],
  },
  {
    slug: "science-digital",
    category: "science",
    title: "Digital India (UPI, Aadhaar)",
    icon: "📱",
    tagline: "Monthly UPI volume + Aadhaar enrolment.",
    description:
      "UPI transaction volume and value (NPCI, monthly). Aadhaar enrolment " +
      "and authentication transactions (UIDAI).",
    status: "live",
    displayOrder: 45,
    sources: [
      { sourceKey: "NPCI", type: "Collected", refresh: "Monthly" },
      { sourceKey: "UIDAI", type: "Collected", refresh: "Monthly" },
    ],
    componentName: "ScienceDigitalModule",
    hasTimeSeries: true,
    scraperKeys: ["npci-upi"],
  },

  // ── Trade ─────────────────────────────────────────────────
  {
    slug: "trade-overview",
    category: "trade",
    title: "Foreign Trade",
    icon: "🌐",
    tagline: "Monthly exports, imports, trade balance.",
    description:
      "Department of Commerce QuickEstimates — monthly merchandise exports, " +
      "imports, services trade, trade balance.",
    status: "live",
    displayOrder: 46,
    sources: [
      { sourceKey: "COMMERCE", type: "Collected", refresh: "Monthly" },
      { sourceKey: "DGFT", type: "Collected", refresh: "Monthly" },
    ],
    componentName: "TradeOverviewModule",
    hasTimeSeries: true,
    scraperKeys: ["commerce-trade"],
  },
  {
    slug: "trade-fdi",
    category: "trade",
    title: "FDI & Investment",
    icon: "💼",
    tagline: "FDI inflows by sector, source country.",
    description:
      "DPIIT FDI inflow data — quarterly equity inflows by sector and " +
      "source country, RBI capital account data.",
    status: "coming_soon",
    displayOrder: 47,
    sources: [{ sourceKey: "DPIIT", type: "Collected", refresh: "Quarterly" }],
    componentName: "TradeFdiModule",
    scraperKeys: [],
  },
  {
    slug: "trade-diaspora",
    category: "trade",
    title: "Diaspora & Remittances",
    icon: "✈️",
    tagline: "Remittance inflows, diaspora estimates.",
    description:
      "RBI annual remittance data, MEA diaspora estimates by country.",
    status: "coming_soon",
    displayOrder: 48,
    sources: [{ sourceKey: "RBI", type: "Collected", refresh: "Annual" }],
    componentName: "TradeDiasporaModule",
    scraperKeys: [],
  },

  // ── Tourism ───────────────────────────────────────────────
  {
    slug: "tourism-overview",
    category: "tourism",
    title: "Tourism Statistics",
    icon: "🧳",
    tagline: "Monthly FTA and FEE from Ministry of Tourism.",
    description:
      "Foreign Tourist Arrivals and Foreign Exchange Earnings — monthly " +
      "bulletin from the Ministry of Tourism.",
    status: "live",
    displayOrder: 49,
    sources: [{ sourceKey: "TOURISM", type: "Collected", refresh: "Monthly" }],
    componentName: "TourismOverviewModule",
    hasTimeSeries: true,
    scraperKeys: ["tourism-arrivals"],
  },
  {
    slug: "tourism-heritage",
    category: "tourism",
    title: "UNESCO & ASI Heritage",
    icon: "🏛️",
    tagline: "Centrally protected monuments and World Heritage Sites.",
    description:
      "Archaeological Survey of India data on centrally protected monuments, " +
      "plus India's UNESCO World Heritage inscriptions.",
    status: "live",
    displayOrder: 50,
    sources: [{ sourceKey: "ASI", type: "Collected", refresh: "Quarterly" }],
    componentName: "TourismHeritageModule",
    scraperKeys: ["asi-heritage"],
  },
  {
    slug: "tourism-gi-tags",
    category: "tourism",
    title: "GI Tags Registry",
    icon: "🏷️",
    tagline: "Geographical Indication registry.",
    description:
      "Office of the Controller General of Patents GI registry — total " +
      "tags, by category, by state.",
    status: "coming_soon",
    displayOrder: 51,
    sources: [{ sourceKey: "IPINDIA", type: "Collected", refresh: "Annual" }],
    componentName: "TourismGiTagsModule",
    scraperKeys: [],
  },

  // ── Sports ────────────────────────────────────────────────
  {
    slug: "sports-olympics",
    category: "sports",
    title: "Olympic Performance",
    icon: "🏅",
    tagline: "Medals, athletes, contingent size.",
    description:
      "India's Olympic and Paralympic performance — medal record by Games, " +
      "contingent size, sport-wise breakdown.",
    status: "live",
    displayOrder: 52,
    sources: [
      { sourceKey: "IOA", type: "Institutional", refresh: "Event-driven" },
      { sourceKey: "SAI", type: "Collected", refresh: "Annual" },
    ],
    componentName: "SportsOlympicsModule",
    scraperKeys: ["ioa-medals"],
  },
  {
    slug: "sports-khelo-india",
    category: "sports",
    title: "Khelo India",
    icon: "🏃",
    tagline: "Khelo India Games, KISCE centres.",
    description:
      "Khelo India programme data — Games editions, KISCE centres, " +
      "athletes supported by sport.",
    status: "coming_soon",
    displayOrder: 53,
    sources: [{ sourceKey: "SAI", type: "Collected", refresh: "Annual" }],
    componentName: "SportsKheloIndiaModule",
    scraperKeys: [],
  },
];

// ── Selectors ───────────────────────────────────────────────

export function getLiveIndiaModules(): IndiaModuleDef[] {
  return INDIA_MODULES
    .filter((m) => m.status !== "coming_soon")
    .sort((a, b) => a.displayOrder - b.displayOrder);
}

export function getComingSoonIndiaModules(): IndiaModuleDef[] {
  return INDIA_MODULES
    .filter((m) => m.status === "coming_soon")
    .sort((a, b) => a.displayOrder - b.displayOrder);
}

export function getIndiaCategories(): IndiaModuleCategory[] {
  return Array.from(new Set(INDIA_MODULES.map((m) => m.category)));
}

export function getIndiaModuleBySlug(slug: string): IndiaModuleDef | undefined {
  return INDIA_MODULES.find((m) => m.slug === slug);
}

export function getIndiaModulesByCategory(
  category: IndiaModuleCategory,
): IndiaModuleDef[] {
  return INDIA_MODULES.filter((m) => m.category === category).sort(
    (a, b) => a.displayOrder - b.displayOrder,
  );
}
