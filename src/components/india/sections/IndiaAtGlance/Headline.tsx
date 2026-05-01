"use client";

/**
 * Hero stat for the IndiaAtGlance band — population, formatted as
 * "1.43 billion", with the YoY growth + source attribution as a foot
 * line. All values come from the indicatorByKey lookup map; the
 * tagline string lives in metrics.ts (editorial copy, not data).
 *
 * Returns a graceful "headline data unavailable" microtext when the
 * MACRO_HEADLINE indicator is missing — never invents a number.
 */

import styles from "./styles.module.css";
import {
  MACRO_HEADLINE,
  MACRO_GROWTH,
  MACRO_HEADLINE_TAGLINE,
  indicatorKey,
} from "./metrics";
import type { MacroIndicator } from "@/lib/india/getMacroSnapshotData";

type FormattedHeadline = { major: string; minor: string };

function formatHeadline(value: number, unit: string): FormattedHeadline {
  if (unit === "people" && value >= 1e9) {
    return { major: (value / 1e9).toFixed(2), minor: "billion" };
  }
  if (unit === "people" && value >= 1e6) {
    return { major: (value / 1e6).toFixed(1), minor: "million" };
  }
  return { major: value.toLocaleString(), minor: unit };
}

function formatYear(date: Date): string {
  return String(date.getFullYear());
}

export function Headline({
  indicatorByKey,
}: {
  indicatorByKey: Record<string, MacroIndicator>;
}) {
  const headline = indicatorByKey[indicatorKey(MACRO_HEADLINE)];
  const growth = indicatorByKey[indicatorKey(MACRO_GROWTH)];

  if (!headline) {
    return <div className={styles.headlineMissing}>headline data unavailable</div>;
  }

  const formatted = formatHeadline(headline.value, headline.unit);

  return (
    <div className={styles.headlineBlock}>
      <div className={styles.kicker}>the headline</div>
      <div className={styles.headlineRow}>
        <span className={styles.headlineMajor}>{formatted.major}</span>
        <span className={styles.headlineMinor}>{formatted.minor}</span>
      </div>
      <div className={styles.headlineTagline}>{MACRO_HEADLINE_TAGLINE}</div>
      {growth && (
        <div className={styles.headlineFoot}>
          <span className={styles.upArrow} aria-hidden>
            ↑
          </span>
          <span className={styles.growthValue}>{growth.value}% YoY</span>
          {headline.source && (
            <span className={styles.attribution}>
              · {headline.source} {formatYear(headline.asOfDate)}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
