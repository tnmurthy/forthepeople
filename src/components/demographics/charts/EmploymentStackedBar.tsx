"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import EmptyBlock from "../../common/EmptyBlock";
import {
  OKABE_ITO,
  isNonEmptyObject,
  type EmploymentData,
  type ProfileLike,
} from "../types";

interface Props {
  employment: EmploymentData | null | undefined;
}

export function canRenderEmploymentStackedBar(
  profile: ProfileLike | null | undefined,
): boolean {
  if (!isNonEmptyObject(profile?.employment)) return false;
  const e = profile!.employment as EmploymentData;
  return (
    typeof e.mainWorkersPct === "number" ||
    typeof e.marginalWorkersPct === "number" ||
    typeof e.nonWorkersPct === "number"
  );
}

export default function EmploymentStackedBar({ employment }: Props) {
  if (!employment) {
    return <EmptyBlock icon="📊" message="Employment data not available for this district yet" />;
  }

  const data = [
    {
      name: "Working-age pop.",
      mainWorkers: employment.mainWorkersPct ?? 0,
      marginalWorkers: employment.marginalWorkersPct ?? 0,
      nonWorkers: employment.nonWorkersPct ?? 0,
    },
  ];

  return (
    <div>
      <div style={{ width: "100%", height: 180 }}>
        <ResponsiveContainer>
          <BarChart data={data} layout="vertical" margin={{ left: 10, right: 20 }}>
            <XAxis type="number" domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
            <YAxis type="category" dataKey="name" width={140} style={{ fontSize: 11 }} />
            <Tooltip formatter={(v) => (typeof v === "number" ? `${v.toFixed(2)}%` : "—")} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Bar
              dataKey="mainWorkers"
              name="Main workers"
              stackId="w"
              fill={OKABE_ITO.bluishGreen}
            />
            <Bar
              dataKey="marginalWorkers"
              name="Marginal workers"
              stackId="w"
              fill={OKABE_ITO.yellow}
            />
            <Bar dataKey="nonWorkers" name="Non-workers" stackId="w" fill="#D1D5DB" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      {typeof employment.workerParticipationRate === "number" && (
        <div style={{ fontSize: 12, color: "#6B6B6B", marginTop: 6 }}>
          Worker Participation Rate (WPR):{" "}
          <strong style={{ color: OKABE_ITO.vermillion }}>
            {employment.workerParticipationRate.toFixed(2)}%
          </strong>
        </div>
      )}
    </div>
  );
}
