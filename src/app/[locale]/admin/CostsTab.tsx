"use client";

import { useEffect, useState } from "react";

interface UsageData {
  totalCalls: number;
  totalTokens: number;
  totalCostINR: number;
  avgCostPerCall: number;
  byPurpose: Array<{ purpose: string; calls: number; tokens: number; costINR: number }>;
  byDay: Array<{ day: string; calls: number; tokens: number; costINR: number }>;
  byModel: Array<{ model: string; calls: number; tokens: number }>;
}

interface Sub {
  id: string;
  name: string;
  provider: string;
  category: string;
  costINR: number;
  billingCycle: string;
  status: string;
  dashboardUrl?: string;
  notes?: string;
}

interface SubData {
  subscriptions: Sub[];
  totalMonthly: number;
  totalYearlyPerMonth: number;
}

const card: React.CSSProperties = {
  background: "#FFFFFF", border: "1px solid #E8E8E4", borderRadius: 10, padding: 16,
};

export default function CostsTab() {
  const [usage, setUsage] = useState<UsageData | null>(null);
  const [subs, setSubs] = useState<SubData | null>(null);
  const [range, setRange] = useState("30");

  useEffect(() => {
    const from = new Date(Date.now() - Number(range) * 86_400_000).toISOString().slice(0, 10);
    fetch(`/api/admin/usage?from=${from}`)
      .then((r) => r.json())
      .then(setUsage)
      .catch(() => {});
    fetch("/api/admin/subscriptions")
      .then((r) => r.json())
      .then(setSubs)
      .catch(() => {});
  }, [range]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: "#1A1A1A" }}>Costs</h2>
        <div style={{ display: "flex", gap: 4 }}>
          {[{ v: "7", l: "7d" }, { v: "30", l: "30d" }, { v: "90", l: "90d" }].map((r) => (
            <button key={r.v} onClick={() => setRange(r.v)} style={{
              padding: "4px 10px", borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: "pointer",
              border: range === r.v ? "1px solid #2563EB" : "1px solid #E8E8E4",
              background: range === r.v ? "#EFF6FF" : "#fff",
              color: range === r.v ? "#2563EB" : "#6B6B6B",
            }}>{r.l}</button>
          ))}
        </div>
      </div>

      {/* AI Usage Stats */}
      {usage && (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
            {[
              { label: "Total Calls", value: String(usage.totalCalls), color: "#2563EB" },
              { label: "Total Tokens", value: usage.totalTokens.toLocaleString("en-IN"), color: "#7C3AED" },
              { label: "Total Cost", value: `₹${usage.totalCostINR.toFixed(2)}`, color: "#16A34A" },
              { label: "Avg/Call", value: `₹${usage.avgCostPerCall.toFixed(3)}`, color: "#D97706" },
            ].map((s) => (
              <div key={s.label} style={card}>
                <div style={{ fontSize: 11, color: "#9B9B9B", fontWeight: 600, textTransform: "uppercase", marginBottom: 4 }}>{s.label}</div>
                <div style={{ fontSize: 20, fontWeight: 700, color: s.color }}>{s.value}</div>
              </div>
            ))}
          </div>

          {/* By Purpose */}
          {usage.byPurpose.length > 0 && (
            <div style={card}>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#1A1A1A", marginBottom: 10 }}>By Purpose</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {usage.byPurpose.map((p) => (
                  <div key={p.purpose} style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}>
                    <span style={{ color: "#1A1A1A", fontWeight: 500 }}>{p.purpose}</span>
                    <span style={{ color: "#6B6B6B" }}>{p.calls} calls · {p.tokens.toLocaleString("en-IN")} tokens</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* By Model */}
          {usage.byModel.length > 0 && (
            <div style={card}>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#1A1A1A", marginBottom: 10 }}>By Model</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {usage.byModel.map((m) => (
                  <div key={m.model} style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}>
                    <span style={{ color: "#1A1A1A", fontWeight: 500, fontFamily: "var(--font-mono)" }}>{m.model}</span>
                    <span style={{ color: "#6B6B6B" }}>{m.calls} calls · {m.tokens.toLocaleString("en-IN")} tokens</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Daily Trend */}
          {usage.byDay.length > 0 && (
            <div style={card}>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#1A1A1A", marginBottom: 10 }}>Daily Calls</div>
              <div style={{ display: "flex", alignItems: "flex-end", gap: 3, height: 60 }}>
                {usage.byDay.slice(-14).map((d) => {
                  const max = Math.max(...usage.byDay.map((x) => x.calls), 1);
                  return (
                    <div key={d.day} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                      <div style={{ width: "100%", height: `${(d.calls / max) * 50}px`, background: "#2563EB", borderRadius: 2, minHeight: 2 }} />
                      <span style={{ fontSize: 8, color: "#9B9B9B" }}>{d.day.slice(8)}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}

      {/* Subscriptions */}
      {subs && (
        <div style={card}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#1A1A1A" }}>Subscriptions</div>
            <div style={{ fontSize: 12, color: "#6B6B6B" }}>
              Monthly: <strong style={{ color: "#1A1A1A" }}>₹{(subs.totalMonthly + subs.totalYearlyPerMonth).toFixed(0)}</strong>
            </div>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
              <thead>
                <tr style={{ borderBottom: "1px solid #E8E8E4" }}>
                  <th style={{ textAlign: "left", padding: "6px 8px", color: "#9B9B9B", fontWeight: 600, fontSize: 11 }}>Service</th>
                  <th style={{ textAlign: "left", padding: "6px 8px", color: "#9B9B9B", fontWeight: 600, fontSize: 11 }}>Category</th>
                  <th style={{ textAlign: "right", padding: "6px 8px", color: "#9B9B9B", fontWeight: 600, fontSize: 11 }}>Cost</th>
                  <th style={{ textAlign: "center", padding: "6px 8px", color: "#9B9B9B", fontWeight: 600, fontSize: 11 }}>Cycle</th>
                  <th style={{ textAlign: "center", padding: "6px 8px", color: "#9B9B9B", fontWeight: 600, fontSize: 11 }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {subs.subscriptions.map((s) => (
                  <tr key={s.id} style={{ borderBottom: "1px solid #F5F5F0" }}>
                    <td style={{ padding: "6px 8px", color: "#1A1A1A", fontWeight: 500 }}>
                      {s.dashboardUrl ? (
                        <a href={s.dashboardUrl} target="_blank" rel="noopener noreferrer" style={{ color: "#2563EB", textDecoration: "none" }}>{s.name}</a>
                      ) : s.name}
                    </td>
                    <td style={{ padding: "6px 8px", color: "#6B6B6B" }}>{s.category}</td>
                    <td style={{ padding: "6px 8px", textAlign: "right", fontFamily: "var(--font-mono)", fontWeight: 600 }}>
                      {s.costINR > 0 ? `₹${s.costINR.toLocaleString("en-IN")}` : "Free"}
                    </td>
                    <td style={{ padding: "6px 8px", textAlign: "center", color: "#9B9B9B" }}>{s.billingCycle}</td>
                    <td style={{ padding: "6px 8px", textAlign: "center" }}>
                      <span style={{
                        fontSize: 10, fontWeight: 600, padding: "2px 6px", borderRadius: 4,
                        background: s.status === "active" ? "#DCFCE7" : "#FEE2E2",
                        color: s.status === "active" ? "#16A34A" : "#DC2626",
                      }}>{s.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
