"use client";

import EmptyBlock from "../../common/EmptyBlock";
import { type ProfileLike } from "../types";

interface Props {
  sexRatio?: number | null;
  childSexRatio?: number | null;
}

export function canRenderSexRatioGauge(profile: ProfileLike | null | undefined): boolean {
  return typeof profile?.sexRatio === "number";
}

const MIN = 700;
const MAX = 1100;
const MARKS = [900, 950, 1000];

function Track({ ratio, label }: { ratio: number; label: string }) {
  const clamped = Math.max(MIN, Math.min(MAX, ratio));
  const pct = ((clamped - MIN) / (MAX - MIN)) * 100;
  return (
    <div style={{ margin: "10px 0" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: 11,
          color: "#6B6B6B",
          marginBottom: 4,
        }}
      >
        <span>{label}</span>
        <span style={{ fontWeight: 600, color: "#4B4B4B" }}>
          {ratio} females / 1000 males
        </span>
      </div>
      <div
        style={{
          position: "relative",
          height: 12,
          background:
            "linear-gradient(90deg,#FEE2E2 0%,#FEF3C7 50%,#DCFCE7 100%)",
          borderRadius: 6,
        }}
      >
        {MARKS.map((m) => {
          const mp = ((m - MIN) / (MAX - MIN)) * 100;
          return (
            <div
              key={m}
              title={`${m}`}
              style={{
                position: "absolute",
                top: -2,
                left: `calc(${mp}% - 0.5px)`,
                width: 1,
                height: 16,
                background: "#9B9B9B",
              }}
            />
          );
        })}
        <div
          style={{
            position: "absolute",
            top: -3,
            left: `calc(${pct}% - 4px)`,
            width: 8,
            height: 18,
            background: "#000000",
            borderRadius: 2,
          }}
        />
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: 10,
          color: "#9B9B9B",
          marginTop: 2,
        }}
      >
        <span>{MIN}</span>
        <span>900</span>
        <span>950</span>
        <span>1000 (parity)</span>
        <span>{MAX}</span>
      </div>
    </div>
  );
}

export default function SexRatioGauge({ sexRatio, childSexRatio }: Props) {
  if (typeof sexRatio !== "number") {
    return <EmptyBlock icon="📊" message="Sex ratio not available for this district yet" />;
  }
  return (
    <div>
      <Track ratio={sexRatio} label="Sex Ratio (all ages)" />
      {typeof childSexRatio === "number" && (
        <>
          <Track ratio={childSexRatio} label="Child Sex Ratio (0–6)" />
          <div style={{ fontSize: 11, color: "#9B9B9B", marginTop: 4 }}>
            * Published in the public interest. See the &quot;Child sex ratio (PCPNDT Act
            context)&quot; section of the disclosure panel.
          </div>
        </>
      )}
    </div>
  );
}
