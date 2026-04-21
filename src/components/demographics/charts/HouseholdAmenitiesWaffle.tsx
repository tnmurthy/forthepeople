"use client";

import EmptyBlock from "../../common/EmptyBlock";
import {
  OKABE_ITO,
  isNonEmptyObject,
  type HouseholdAmenitiesData,
  type ProfileLike,
} from "../types";

interface Props {
  amenities: HouseholdAmenitiesData | null | undefined;
}

const AMENITIES: {
  key: keyof HouseholdAmenitiesData;
  label: string;
  color: string;
}[] = [
  { key: "electricityPct", label: "Electricity", color: OKABE_ITO.yellow },
  { key: "tapWaterPct", label: "Tap Water", color: OKABE_ITO.skyBlue },
  { key: "toiletPct", label: "Toilet", color: OKABE_ITO.bluishGreen },
  { key: "lpgCleanFuelPct", label: "Clean Cooking Fuel", color: OKABE_ITO.orange },
];

export function canRenderHouseholdAmenitiesWaffle(
  profile: ProfileLike | null | undefined,
): boolean {
  return isNonEmptyObject(profile?.householdAmenities);
}

function Waffle({ pct, color, label }: { pct: number; color: string; label: string }) {
  const filled = Math.round(Math.max(0, Math.min(100, pct)));
  return (
    <div style={{ textAlign: "center" }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(10, 1fr)",
          gap: 2,
          width: 120,
          margin: "0 auto",
        }}
        aria-label={`${label}: ${pct.toFixed(1)} percent of households`}
      >
        {Array.from({ length: 100 }).map((_, i) => (
          <div
            key={i}
            style={{
              aspectRatio: "1",
              background: i < filled ? color : "#E8E8E4",
              borderRadius: 2,
            }}
          />
        ))}
      </div>
      <div style={{ marginTop: 6, fontSize: 13, fontWeight: 600, color: "#4B4B4B" }}>
        {pct.toFixed(1)}%
      </div>
      <div style={{ fontSize: 11, color: "#9B9B9B" }}>{label}</div>
    </div>
  );
}

export default function HouseholdAmenitiesWaffle({ amenities }: Props) {
  if (!amenities) {
    return (
      <EmptyBlock icon="📊" message="Household amenities not available for this district yet" />
    );
  }
  const available = AMENITIES.filter((a) => typeof amenities[a.key] === "number");
  if (available.length === 0) {
    return (
      <EmptyBlock icon="📊" message="Household amenities not available for this district yet" />
    );
  }
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${available.length}, 1fr)`,
        gap: 20,
        padding: "12px 0",
      }}
    >
      {available.map((a) => (
        <Waffle
          key={a.key as string}
          pct={amenities[a.key] as number}
          color={a.color}
          label={a.label}
        />
      ))}
    </div>
  );
}
