"use client";

import EmptyBlock from "../../common/EmptyBlock";
import {
  OKABE_ITO,
  isNonEmptyObject,
  type EconomicClassData,
  type ProfileLike,
} from "../types";

interface Props {
  economicClass: EconomicClassData | null | undefined;
}

export function canRenderMPIIndicatorCard(profile: ProfileLike | null | undefined): boolean {
  if (!isNonEmptyObject(profile?.economicClass)) return false;
  const e = profile!.economicClass as EconomicClassData;
  return typeof e.mpiHeadcount === "number" || typeof e.mpi === "number";
}

export default function MPIIndicatorCard({ economicClass }: Props) {
  if (
    !economicClass ||
    (typeof economicClass.mpiHeadcount !== "number" && typeof economicClass.mpi !== "number")
  ) {
    return (
      <EmptyBlock
        icon="📊"
        message="Multidimensional Poverty Index not yet published at district level for this district."
      />
    );
  }

  return (
    <div
      style={{
        background: "#FFFFFF",
        border: "1px solid #E8E8E4",
        borderRadius: 10,
        padding: "16px 20px",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
          gap: 16,
        }}
      >
        {typeof economicClass.mpiHeadcount === "number" && (
          <div>
            <div
              style={{
                fontSize: 11,
                color: "#9B9B9B",
                textTransform: "uppercase",
                letterSpacing: 0.3,
              }}
            >
              MPI Headcount
            </div>
            <div style={{ fontSize: 24, fontWeight: 600, color: OKABE_ITO.vermillion }}>
              {economicClass.mpiHeadcount.toFixed(2)}%
            </div>
            <div style={{ fontSize: 11, color: "#6B6B6B" }}>of population is poor</div>
          </div>
        )}
        {typeof economicClass.mpiIntensity === "number" && (
          <div>
            <div
              style={{
                fontSize: 11,
                color: "#9B9B9B",
                textTransform: "uppercase",
                letterSpacing: 0.3,
              }}
            >
              Intensity
            </div>
            <div style={{ fontSize: 24, fontWeight: 600, color: "#4B4B4B" }}>
              {economicClass.mpiIntensity.toFixed(2)}%
            </div>
            <div style={{ fontSize: 11, color: "#6B6B6B" }}>avg deprivation</div>
          </div>
        )}
        {typeof economicClass.mpi === "number" && (
          <div>
            <div
              style={{
                fontSize: 11,
                color: "#9B9B9B",
                textTransform: "uppercase",
                letterSpacing: 0.3,
              }}
            >
              MPI value
            </div>
            <div style={{ fontSize: 24, fontWeight: 600, color: "#4B4B4B" }}>
              {economicClass.mpi.toFixed(4)}
            </div>
            <div style={{ fontSize: 11, color: "#6B6B6B" }}>composite</div>
          </div>
        )}
        {typeof economicClass.districtRankInState === "number" && (
          <div>
            <div
              style={{
                fontSize: 11,
                color: "#9B9B9B",
                textTransform: "uppercase",
                letterSpacing: 0.3,
              }}
            >
              District rank
            </div>
            <div style={{ fontSize: 24, fontWeight: 600, color: "#4B4B4B" }}>
              #{economicClass.districtRankInState}
            </div>
            <div style={{ fontSize: 11, color: "#6B6B6B" }}>within state</div>
          </div>
        )}
      </div>
      {economicClass.source && (
        <div style={{ fontSize: 11, color: "#9B9B9B", marginTop: 10 }}>
          Source: {economicClass.source}
        </div>
      )}
    </div>
  );
}
