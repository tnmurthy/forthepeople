/**
 * LiveStrip — slim freshness/coverage strip above the hero.
 *
 * File 48 §4.7.2. Tricolor-tinted gradient background (saffron → blue → green
 * at ~4% opacity each). Five metadata items: last sync, sources, modules,
 * districts, states. Pulsing green LIVE dot on the left.
 *
 * Server Component. Two values are derived from the live system:
 *   - `lastSync`: MAX(IndiaScraperRun.startedAt) formatted via timeAgoLabel
 *   - `liveDistrictCount`: getTotalActiveDistrictCount() from the registry
 *
 * The other four values (sourceCount, liveModuleCount, editorialModuleCount,
 * liveStateCount, totalStates, totalDistricts) are slow-drift aggregates that
 * stay as hardcoded placeholders for Phase 4.7. Wire them when needed.
 */

import * as React from "react";
import { prisma } from "@/lib/db";
import { timeAgoLabel } from "@/lib/utils/timeAgo";
import { getTotalActiveDistrictCount } from "@/lib/constants/districts";

interface LiveStripProps {
  sourceCount?: number;
  liveModuleCount?: number;
  editorialModuleCount?: number;
  totalDistricts?: number;
  liveStateCount?: number;
  totalStates?: number;
}

function Item({ label, value }: { label: string; value: string }) {
  return (
    <span style={{ display: "flex", alignItems: "center", gap: "5px", whiteSpace: "nowrap" }}>
      <span
        style={{
          color: "var(--color-text-tertiary)",
          letterSpacing: "0.04em",
          textTransform: "uppercase",
          fontSize: "9.5px",
          fontWeight: 500,
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontFamily: "var(--font-mono)",
          fontWeight: 500,
          color: "var(--color-text-primary)",
          fontSize: "11px",
        }}
      >
        {value}
      </span>
    </span>
  );
}

function Divider() {
  return <span style={{ width: "1px", height: "11px", background: "rgba(0,0,0,0.08)" }} />;
}

export async function LiveStrip({
  // TODO Phase 5+: derive from DB (INDIA_SOURCES count, INDIA_MODULES live/editorial split,
  // State table count). These drift slowly so placeholder is acceptable for now.
  sourceCount = 320,
  liveModuleCount = 53,
  editorialModuleCount = 6,
  totalDistricts = 780,
  liveStateCount = 7,
  totalStates = 36,
}: LiveStripProps = {}) {
  // Latest scraper run across all sources — drives the freshness label.
  const latestRun = await prisma.indiaScraperRun.findFirst({
    orderBy: { startedAt: "desc" },
    select: { startedAt: true },
  });

  // Use a 30-day stale threshold instead of the default 2h. The "LIVE" pill
  // on the strip already conveys live status; the freshness label is meant
  // to show actual time since last sync ("14m ago" / "2h ago" / "3d ago").
  const lastSync = timeAgoLabel(latestRun?.startedAt ?? null, {
    staleThresholdMinutes: 30 * 24 * 60,
  }).label;

  const liveDistrictCount = getTotalActiveDistrictCount();

  return (
    <div
      style={{
        border: "0.5px solid rgba(83, 74, 183, 0.18)",
        background:
          "linear-gradient(90deg, rgba(255, 153, 51, 0.04) 0%, rgba(24, 95, 165, 0.04) 50%, rgba(19, 136, 8, 0.04) 100%)",
        borderRadius: "var(--border-radius-md)",
        padding: "7px 12px",
        display: "flex",
        alignItems: "center",
        gap: "14px",
        fontSize: "11px",
        marginBottom: "12px",
        overflowX: "auto",
      }}
      role="status"
      aria-label="Platform freshness and coverage"
    >
      <span style={{ display: "flex", alignItems: "center", gap: "6px", flexShrink: 0 }}>
        <span
          aria-hidden
          className="ftp-live-dot"
          style={{
            width: "6px",
            height: "6px",
            borderRadius: "50%",
            background: "#16A34A",
            boxShadow: "0 0 0 3px rgba(22, 163, 74, 0.12)",
          }}
        />
        <span
          style={{
            color: "#16A34A",
            fontWeight: 500,
            letterSpacing: "0.04em",
            fontSize: "10px",
          }}
        >
          LIVE
        </span>
      </span>

      <Divider />
      <Item label="Last sync" value={lastSync} />
      <Divider />
      <Item label="Sources" value={`${sourceCount} .gov.in`} />
      <Divider />
      <Item
        label="Modules"
        value={`${liveModuleCount} live · ${editorialModuleCount} editorial`}
      />
      <Divider />
      <Item label="Districts" value={`${liveDistrictCount} of ${totalDistricts}`} />
      <Divider />
      <Item label="States" value={`${liveStateCount} of ${totalStates}`} />

      <style>{`
        @keyframes ftp-live-pulse {
          0%, 100% { box-shadow: 0 0 0 3px rgba(22, 163, 74, 0.12); }
          50%      { box-shadow: 0 0 0 5px rgba(22, 163, 74, 0.06); }
        }
        @media (prefers-reduced-motion: no-preference) {
          .ftp-live-dot { animation: ftp-live-pulse 1800ms ease-in-out infinite; }
        }
      `}</style>
    </div>
  );
}

export default LiveStrip;
