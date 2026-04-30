/**
 * SourceHealthDot — green/amber/red freshness dot per authenticity move #3 (file 45 §6).
 *
 * Server Component. Queries IndiaScraperRun for the latest sync row matching
 * the source key (the `scraperKey` prop name persists in code per spec — only
 * user-facing copy says "source freshness" / "data sync").
 *
 * Phase 4.6 reality: most automated syncs haven't been wired yet, so the dot
 * defaults to amber with an honest tooltip ("Initial dataset · Automated sync
 * planned"). Honest disclosure, not a UX defect.
 */

import * as React from "react";
import { prisma } from "@/lib/db";

export type ScraperCadence =
  | "daily"
  | "weekly"
  | "monthly"
  | "quarterly"
  | "annual"
  | "quadrennial"
  | "event-driven";

export interface SourceHealthDotProps {
  scraperKey: string;
  expectedCadence?: ScraperCadence;
  size?: "small" | "medium";
  className?: string;
}

type Health = "green" | "amber" | "red";

const HEALTH_COLOR: Record<Health, string> = {
  green: "#16A34A",
  amber: "#BA7517",
  red: "#A32D2D",
};

// Cadence threshold in milliseconds — source is fresh if the last successful
// sync ran within this window.
const CADENCE_MS: Record<ScraperCadence, number> = {
  daily: 24 * 60 * 60 * 1000,
  weekly: 7 * 24 * 60 * 60 * 1000,
  monthly: 31 * 24 * 60 * 60 * 1000,
  quarterly: 95 * 24 * 60 * 60 * 1000,
  annual: 370 * 24 * 60 * 60 * 1000,
  quadrennial: 4 * 370 * 24 * 60 * 60 * 1000,
  // event-driven cadence has no time bound — treat as annual for staleness purposes
  "event-driven": 370 * 24 * 60 * 60 * 1000,
};

async function computeHealth(
  scraperKey: string,
  expectedCadence: ScraperCadence,
): Promise<{ health: Health; tooltip: string }> {
  const latest = await prisma.indiaScraperRun.findFirst({
    where: { scraperKey, status: "success" },
    orderBy: { startedAt: "desc" },
  });

  if (!latest) {
    return {
      health: "amber",
      tooltip: "Initial dataset · Automated sync planned",
    };
  }

  const sinceMs = Date.now() - new Date(latest.startedAt).getTime();
  const expected = CADENCE_MS[expectedCadence];
  if (sinceMs <= expected) {
    return { health: "green", tooltip: `Last sync within ${expectedCadence} cadence` };
  }
  if (sinceMs <= 1.5 * expected) {
    return { health: "amber", tooltip: "Source is slightly stale" };
  }
  return { health: "red", tooltip: "Source has not synced for over 2× cadence" };
}

export async function SourceHealthDot({
  scraperKey,
  expectedCadence = "annual",
  size = "small",
  className,
}: SourceHealthDotProps) {
  const { health, tooltip } = await computeHealth(scraperKey, expectedCadence);
  const diameter = size === "small" ? 6 : 8;

  return (
    <span
      title={tooltip}
      aria-label={`Source freshness: ${health} — ${tooltip}`}
      className={className}
      style={{
        display: "inline-block",
        width: `${diameter}px`,
        height: `${diameter}px`,
        borderRadius: "50%",
        background: HEALTH_COLOR[health],
        verticalAlign: "middle",
      }}
    />
  );
}

export default SourceHealthDot;
