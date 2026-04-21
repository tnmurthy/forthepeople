"use client";

import { useState } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import EmptyBlock from "../../common/EmptyBlock";

export interface DistrictValue {
  districtId?: string;
  slug: string;
  value: number | null;
}

interface Props {
  values: DistrictValue[];
  metric?: string;
  colorScale?: (v: number | null, min: number, max: number) => string;
}

// Sequential green scale (Color-Brewer YlGn 5-class) — neutral, safe for most metrics.
const DEFAULT_PALETTE = ["#EDF8E9", "#BAE4B3", "#74C476", "#31A354", "#006D2C"];

function defaultColorScale(v: number | null, min: number, max: number): string {
  if (v == null || !isFinite(v)) return "#E8E8E4";
  const span = max - min || 1;
  const ratio = Math.max(0, Math.min(1, (v - min) / span));
  const idx = Math.min(DEFAULT_PALETTE.length - 1, Math.floor(ratio * DEFAULT_PALETTE.length));
  return DEFAULT_PALETTE[idx];
}

export function canRenderKarnatakaChoropleth(
  values: DistrictValue[] | null | undefined,
): boolean {
  return Array.isArray(values) && values.length > 0;
}

type GeoFeature = {
  rsmKey: string;
  properties: { name?: string; slug?: string; [k: string]: unknown };
};

export default function KarnatakaChoropleth({
  values,
  metric = "value",
  colorScale = defaultColorScale,
}: Props) {
  const [hovered, setHovered] = useState<{ name: string; v: number | null } | null>(null);

  if (!Array.isArray(values) || values.length === 0) {
    return (
      <EmptyBlock icon="🗺️" message="District-level data not yet loaded for Karnataka choropleth" />
    );
  }

  const bySlug = new Map(values.map((v) => [v.slug, v.value]));
  const nums = values
    .map((v) => v.value)
    .filter((n): n is number => typeof n === "number" && isFinite(n));
  const min = nums.length ? Math.min(...nums) : 0;
  const max = nums.length ? Math.max(...nums) : 1;

  return (
    <div>
      <div style={{ width: "100%" }}>
        <ComposableMap
          projection="geoMercator"
          projectionConfig={{ scale: 4200, center: [76.5, 14.7] }}
          style={{ width: "100%", height: "auto" }}
        >
          <Geographies geography="/geo/karnataka-districts.json">
            {({ geographies }: { geographies: GeoFeature[] }) =>
              geographies.map((geo) => {
                const slug = String(geo.properties.slug ?? "");
                const v = bySlug.get(slug) ?? null;
                const fill = colorScale(v, min, max);
                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={fill}
                    stroke="#FFFFFF"
                    strokeWidth={0.5}
                    onMouseEnter={() =>
                      setHovered({ name: String(geo.properties.name ?? slug), v })
                    }
                    onMouseLeave={() => setHovered(null)}
                    style={{
                      default: { outline: "none" },
                      hover: { outline: "none", filter: "brightness(1.1)" },
                      pressed: { outline: "none" },
                    }}
                  />
                );
              })
            }
          </Geographies>
        </ComposableMap>
      </div>
      <div style={{ fontSize: 12, color: "#4B4B4B", marginTop: 6, minHeight: 18 }}>
        {hovered ? (
          <>
            <strong>{hovered.name}</strong>:{" "}
            {hovered.v != null ? `${hovered.v.toFixed(2)} ${metric}` : "data not available"}
          </>
        ) : (
          <span style={{ color: "#9B9B9B" }}>Hover a district to see its {metric}.</span>
        )}
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginTop: 6,
          fontSize: 10,
          color: "#9B9B9B",
        }}
      >
        <span>Low</span>
        {DEFAULT_PALETTE.map((c) => (
          <span
            key={c}
            style={{ width: 20, height: 10, background: c, display: "inline-block" }}
          />
        ))}
        <span>High</span>
      </div>
    </div>
  );
}
