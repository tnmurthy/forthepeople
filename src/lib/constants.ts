/**
 * ForThePeople.in — top-level constants used across the homepage redesign.
 *
 * Keep this file SMALL — granular per-feature constants belong in their
 * own files under src/lib/constants/. This is the high-level platform
 * shape only.
 */

/**
 * Number of dashboard modules each active district exposes.
 *
 * Derived from the actual route count under /[locale]/[state]/[district]/<module>:
 *   leadership, finance, infrastructure, tenders, industries, jjm,
 *   power, transport, health, schools, housing, police, courts,
 *   file-rti, rti, contributors, schemes, services, exams, elections,
 *   famous-personalities, alerts, offices, citizen-corner, news,
 *   data-sources, update-log, map, population, weather,
 *   responsibility, crime-stats (planned)
 *
 * Update when modules are added or removed. UI labels like
 * "32 dashboards/district" derive from this single source.
 */
export const DASHBOARDS_PER_DISTRICT = 32;

/**
 * Canonical total of Indian districts (2024 Census-aligned). Used for
 * "X coming" stat tiles and the /vote-district pool size.
 */
export const TOTAL_INDIA_DISTRICTS = 780;
