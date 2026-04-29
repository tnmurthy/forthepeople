/**
 * ForThePeople.in — Your District. Your Data. Your Right.
 * © 2026 Jayanth M B. MIT License with Attribution.
 *
 * 12 metric tiles that drive the choropleth in Grid view. Each tile
 * shows the metric label + a tiny mini-stat (range or top-state),
 * and lights up the active metric's category accent border when
 * selected.
 *
 * MOCK DATA — replace in Session C1 (mini-stats use mock data).
 */

"use client";

import {
  MOCK_METRICS,
  getStateValuesForMetric,
} from "@/lib/india/mock-state-data";
import { CATEGORY_ACCENT, INDIA_DESIGN } from "@/lib/india/india-design";

interface Props {
  activeMetric: string;
  onSelect: (metricKey: string) => void;
}

export default function IndiaMetricPicker({ activeMetric, onSelect }: Props) {
  return (
    <div
      role="tablist"
      aria-label="Choose a metric to display on the map"
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
        gap: 10,
      }}
    >
      {MOCK_METRICS.map((m) => {
        const isActive = activeMetric === m.key;
        const accent = CATEGORY_ACCENT[m.category];
        const values = getStateValuesForMetric(m.key);
        const top = values[0];
        return (
          <button
            key={m.key}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onSelect(m.key)}
            style={{
              background: INDIA_DESIGN.bgCard,
              border: `1px solid ${isActive ? accent : INDIA_DESIGN.border}`,
              borderTop: `3px solid ${isActive ? accent : "transparent"}`,
              borderRadius: 10,
              padding: "10px 12px",
              textAlign: "left",
              cursor: "pointer",
              transition: "border-color 120ms ease, background 120ms ease",
              minHeight: 92,
              display: "flex",
              flexDirection: "column",
              gap: 4,
            }}
          >
            <span
              style={{
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                color: isActive ? accent : INDIA_DESIGN.textFaint,
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <span
                aria-hidden="true"
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: accent,
                }}
              />
              {m.label}
            </span>
            <span style={{ fontSize: 12, color: INDIA_DESIGN.textMuted }}>
              {m.description}
            </span>
            {top ? (
              <span
                style={{
                  marginTop: "auto",
                  fontSize: 11,
                  color: INDIA_DESIGN.textFaint,
                  fontFamily: INDIA_DESIGN.fontMono,
                }}
              >
                #1 {top.stateName} · {top.value.toLocaleString("en-IN")}
                {m.unit ? ` ${m.unit}` : ""}
              </span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
