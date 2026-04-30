/**
 * LiveStrip — slim freshness/coverage strip above the hero.
 *
 * File 48 §4.7.2. Tricolor-tinted gradient background (saffron → blue → green
 * at ~4% opacity each). Five metadata items: last sync, sources, modules,
 * districts, states. Pulsing green LIVE dot on the left.
 *
 * Phase 4.7 ships placeholder values that match the current platform state
 * (10 districts live, 7 states, 53 data + 6 editorial modules, 320 sources).
 * Wiring real DB-derived counts is a future phase task — see TODO.
 */

import * as React from "react";

interface LiveStripProps {
  lastSync?: string;
  sourceCount?: number;
  liveModuleCount?: number;
  editorialModuleCount?: number;
  liveDistrictCount?: number;
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

export function LiveStrip({
  // TODO Phase 5+: derive from DB (last successful IndiaScraperRun, INDIA_SOURCES count,
  // INDIA_MODULES live count, District table count, State table count).
  lastSync = "14m ago",
  sourceCount = 320,
  liveModuleCount = 53,
  editorialModuleCount = 6,
  liveDistrictCount = 10,
  totalDistricts = 780,
  liveStateCount = 7,
  totalStates = 36,
}: LiveStripProps = {}) {
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
      <span
        style={{ display: "flex", alignItems: "center", gap: "6px", flexShrink: 0 }}
      >
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
