"use client";

import EmptyBlock from "../../common/EmptyBlock";
import { SEX_COLORS, type ProfileLike } from "../types";

interface Props {
  literacyTotal?: number | null;
  literacyMale?: number | null;
  literacyFemale?: number | null;
  stateRef?: number | null;
  nationalRef?: number | null;
}

export function canRenderLiteracyDumbbell(profile: ProfileLike | null | undefined): boolean {
  return (
    typeof profile?.literacyMale === "number" &&
    typeof profile?.literacyFemale === "number"
  );
}

export default function LiteracyDumbbell({
  literacyTotal,
  literacyMale,
  literacyFemale,
  stateRef,
  nationalRef,
}: Props) {
  if (typeof literacyMale !== "number" || typeof literacyFemale !== "number") {
    return (
      <EmptyBlock icon="📊" message="Literacy breakdown not available for this district yet" />
    );
  }

  const min = Math.min(literacyMale, literacyFemale);
  const max = Math.max(literacyMale, literacyFemale);

  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 16,
          margin: "4px 0 8px",
          fontSize: 11,
        }}
      >
        <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
          <span
            style={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              background: SEX_COLORS.male,
              display: "inline-block",
            }}
          />
          Male
        </span>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
          <span
            style={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              background: SEX_COLORS.female,
              display: "inline-block",
            }}
          />
          Female
        </span>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "80px 1fr 80px",
          alignItems: "center",
          gap: 10,
          margin: "10px 0",
        }}
      >
        <div style={{ fontSize: 12, color: "#4B4B4B", fontWeight: 500 }}>Literacy</div>
        <div
          style={{
            position: "relative",
            height: 26,
            background: "#F1F1ED",
            borderRadius: 4,
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 11,
              left: `${min}%`,
              width: `${max - min}%`,
              height: 4,
              background: "#D1D5DB",
              borderRadius: 2,
            }}
          />
          <div
            title={`Male ${literacyMale.toFixed(1)}%`}
            style={{
              position: "absolute",
              top: 5,
              left: `calc(${literacyMale}% - 8px)`,
              width: 16,
              height: 16,
              background: SEX_COLORS.male,
              borderRadius: "50%",
              border: "2px solid white",
            }}
          />
          <div
            title={`Female ${literacyFemale.toFixed(1)}%`}
            style={{
              position: "absolute",
              top: 5,
              left: `calc(${literacyFemale}% - 8px)`,
              width: 16,
              height: 16,
              background: SEX_COLORS.female,
              borderRadius: "50%",
              border: "2px solid white",
            }}
          />
        </div>
        <div style={{ fontSize: 11, color: "#6B6B6B", textAlign: "right" }}>
          Δ {(literacyMale - literacyFemale).toFixed(1)} pp
        </div>
      </div>
      {typeof literacyTotal === "number" && (
        <div style={{ fontSize: 11, color: "#6B6B6B", marginTop: 6 }}>
          District total:{" "}
          <strong style={{ color: "#4B4B4B" }}>{literacyTotal.toFixed(2)}%</strong>
          {typeof stateRef === "number" && <> · State: {stateRef.toFixed(2)}%</>}
          {typeof nationalRef === "number" && <> · India: {nationalRef.toFixed(2)}%</>}
        </div>
      )}
    </div>
  );
}
