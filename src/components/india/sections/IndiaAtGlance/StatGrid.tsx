"use client";

/**
 * Renders MACRO_PRIMARY (4 cards, growth in green) and MACRO_SECONDARY
 * (3 pills, including a combined "states + UTs" cell) by iterating the
 * metrics.ts arrays. Skips any entry whose indicator is missing — never
 * invents a value or shows a placeholder card.
 */

import styles from "./styles.module.css";
import {
  MACRO_PRIMARY,
  MACRO_SECONDARY,
  indicatorKey,
  type MetricDisplay,
  type MetricFormat,
} from "./metrics";
import type { MacroIndicator } from "@/lib/india/getMacroSnapshotData";

function formatValue(format: MetricFormat, value: number): string {
  switch (format) {
    case "trillion_usd":
      return `$${value.toFixed(1)}T`;
    case "percent":
      return `${value.toFixed(1)}%`;
    case "lakh_inr": {
      const lakhs = value / 100_000;
      return `₹${lakhs.toFixed(1)}L`;
    }
    case "count":
      return `${value}`;
    case "scheduled":
      return `${value} scheduled`;
    case "millions_workforce":
      if (value >= 1e9) return `${(value / 1e9).toFixed(2)}B+`;
      if (value >= 1e6) return `${Math.round(value / 1e6)}M+`;
      return `${value}`;
    case "billion_people":
      if (value >= 1e9) return `${(value / 1e9).toFixed(2)}B`;
      if (value >= 1e6) return `${Math.round(value / 1e6)}M`;
      return `${value}`;
    case "states_uts":
      // States_uts is a combined display; primary value rendered alone
      // here, the companion is folded in by the calling code.
      return `${value}`;
    default:
      return `${value}`;
  }
}

function combinedStatesUts(
  primary: MacroIndicator,
  companion: MacroIndicator,
): string {
  return `${primary.value} + ${companion.value} UTs`;
}

function attributionLabel(ind: MacroIndicator): string {
  if (!ind.source) return "";
  const year = ind.asOfDate.getFullYear();
  return `${ind.source} · ${year}`;
}

function PrimaryCard({
  display,
  indicator,
  delaySeconds,
}: {
  display: MetricDisplay;
  indicator: MacroIndicator;
  delaySeconds: number;
}) {
  const value = formatValue(display.format, indicator.value);
  return (
    <div
      className={display.green ? styles.cardGreen : styles.card}
      style={{ animationDelay: `${delaySeconds}s` }}
    >
      <div className={styles.kicker}>{display.label}</div>
      <div className={styles.cardValue}>
        {value}
        {display.green && (
          <span className={styles.upArrow} aria-hidden>
            ↑
          </span>
        )}
      </div>
      {indicator.source && (
        <div className={styles.cardAttribution}>{attributionLabel(indicator)}</div>
      )}
    </div>
  );
}

function SecondaryPill({
  display,
  indicator,
  companion,
  delaySeconds,
}: {
  display: MetricDisplay;
  indicator: MacroIndicator;
  companion: MacroIndicator | undefined;
  delaySeconds: number;
}) {
  let valueText: string;
  if (display.format === "states_uts") {
    if (!companion) return null;
    valueText = combinedStatesUts(indicator, companion);
  } else {
    valueText = formatValue(display.format, indicator.value);
  }
  return (
    <div className={styles.pill} style={{ animationDelay: `${delaySeconds}s` }}>
      <span className={styles.kicker}>{display.label}</span>
      <span className={styles.pillValue}>{valueText}</span>
    </div>
  );
}

export function StatGrid({
  indicatorByKey,
}: {
  indicatorByKey: Record<string, MacroIndicator>;
}) {
  const primaryItems = MACRO_PRIMARY.map((display, i) => {
    const indicator = indicatorByKey[indicatorKey(display)];
    if (!indicator) return null;
    return (
      <PrimaryCard
        key={`${display.moduleSlug}::${display.metricKey}`}
        display={display}
        indicator={indicator}
        delaySeconds={0.4 + i * 0.1}
      />
    );
  }).filter(Boolean);

  const secondaryItems = MACRO_SECONDARY.map((display, i) => {
    const indicator = indicatorByKey[indicatorKey(display)];
    if (!indicator) return null;
    const companion = display.companion
      ? indicatorByKey[indicatorKey(display.companion)]
      : undefined;
    return (
      <SecondaryPill
        key={`${display.moduleSlug}::${display.metricKey}`}
        display={display}
        indicator={indicator}
        companion={companion}
        delaySeconds={0.8 + i * 0.05}
      />
    );
  }).filter(Boolean);

  return (
    <>
      {primaryItems.length > 0 && (
        <div className={styles.primaryGrid}>{primaryItems}</div>
      )}
      {secondaryItems.length > 0 && (
        <div className={styles.secondaryGrid}>{secondaryItems}</div>
      )}
    </>
  );
}
