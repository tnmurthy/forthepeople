"use client";

import { useCallback, useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import {
  Activity,
  Database,
  Server,
  Clock,
  CheckCircle,
  XCircle,
  RefreshCw,
} from "lucide-react";

interface HealthData {
  database: { status: string; responseMs: number; activeDistricts: number; totalNewsItems: number };
  redis: { status: string; responseMs: number };
  scrapers: {
    last24h: { total: number; successful: number; failed: number };
    recentLogs: Array<{
      id: string; jobName: string; status: string;
      recordsAffected: number; durationMs: number;
      error: string | null; createdAt: string;
    }>;
  };
  dataFreshness: Array<{
    district: string; slug: string;
    weather: string | null; news: string | null;
    crops: string | null; aiInsights: string | null;
  }>;
  pendingItems: { reviews: number; feedback: number; alerts: number; unreadAlerts: number };
  contributions: { last7days: number; totalRevenue: number };
  serverTimeMs: number;
  timestamp: string;
}

const card: React.CSSProperties = {
  background: "#FFFFFF",
  border: "1px solid #E8E8E4",
  borderRadius: 10,
  padding: 16,
};

function freshnessColor(iso: string | null, thresholds: [number, number]): React.CSSProperties {
  if (!iso) return { background: "#FEE2E2", color: "#DC2626" };
  const age = Date.now() - new Date(iso).getTime();
  const [green, amber] = thresholds;
  if (age < green) return { background: "#DCFCE7", color: "#16A34A" };
  if (age < amber) return { background: "#FEF3C7", color: "#D97706" };
  return { background: "#FEE2E2", color: "#DC2626" };
}

function relTime(iso: string | null): string {
  if (!iso) return "No data";
  try {
    return formatDistanceToNow(new Date(iso), { addSuffix: true });
  } catch {
    return "Unknown";
  }
}

const MS_30M = 30 * 60_000;
const MS_2H = 2 * 3_600_000;
const MS_3H = 3 * 3_600_000;
const MS_12H = 12 * 3_600_000;
const MS_24H = 24 * 3_600_000;
const MS_48H = 48 * 3_600_000;
const MS_4H = 4 * 3_600_000;

export default function SystemHealth() {
  const [data, setData] = useState<HealthData | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState<string>("");

  const fetchData = useCallback(() => {
    setLoading(true);
    fetch("/api/admin/system-health")
      .then((r) => r.json())
      .then((d) => {
        setData(d);
        setLastRefresh(new Date().toLocaleTimeString("en-IN", { hour12: false }));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 60_000);
    return () => clearInterval(interval);
  }, [fetchData]);

  if (loading && !data) {
    return (
      <div style={{ padding: 24, textAlign: "center", color: "#9B9B9B" }}>
        <RefreshCw size={20} style={{ animation: "spin 1s linear infinite" }} />
        <p style={{ marginTop: 8, fontSize: 13 }}>Loading system health...</p>
        <style>{`@keyframes spin { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }`}</style>
      </div>
    );
  }

  if (!data) return null;

  const s24 = data.scrapers.last24h;
  const successPct = s24.total > 0 ? (s24.successful / s24.total) * 100 : 100;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: "#1A1A1A" }}>System Health</h2>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 11, color: "#9B9B9B" }}>Last refreshed: {lastRefresh}</span>
          <button
            onClick={fetchData}
            style={{
              background: "none", border: "1px solid #E8E8E4", borderRadius: 6,
              padding: "4px 8px", cursor: "pointer", display: "flex", alignItems: "center", gap: 4,
              fontSize: 12, color: "#6B6B6B",
            }}
          >
            <RefreshCw size={12} /> Refresh
          </button>
        </div>
      </div>

      {/* Row 1: Service Status */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
        <div style={card}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <Database size={16} color="#6B6B6B" />
            <span style={{ fontSize: 12, fontWeight: 600, color: "#6B6B6B", textTransform: "uppercase", letterSpacing: "0.05em" }}>Database</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            {data.database.status === "healthy"
              ? <CheckCircle size={16} color="#16A34A" />
              : <XCircle size={16} color="#DC2626" />}
            <span style={{ fontSize: 15, fontWeight: 700, color: data.database.status === "healthy" ? "#16A34A" : "#DC2626" }}>
              {data.database.status === "healthy" ? "Healthy" : "Error"}
            </span>
          </div>
          <div style={{ fontSize: 11, color: "#9B9B9B", marginTop: 6 }}>
            {data.database.responseMs}ms · {data.database.activeDistricts} active districts
          </div>
        </div>

        <div style={card}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <Server size={16} color="#6B6B6B" />
            <span style={{ fontSize: 12, fontWeight: 600, color: "#6B6B6B", textTransform: "uppercase", letterSpacing: "0.05em" }}>Redis</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            {data.redis.status === "healthy"
              ? <CheckCircle size={16} color="#16A34A" />
              : <XCircle size={16} color="#DC2626" />}
            <span style={{ fontSize: 15, fontWeight: 700, color: data.redis.status === "healthy" ? "#16A34A" : "#DC2626" }}>
              {data.redis.status === "healthy" ? "Healthy" : "Error"}
            </span>
          </div>
          <div style={{ fontSize: 11, color: "#9B9B9B", marginTop: 6 }}>
            {data.redis.responseMs}ms response time
          </div>
        </div>

        <div style={card}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <Activity size={16} color="#6B6B6B" />
            <span style={{ fontSize: 12, fontWeight: 600, color: "#6B6B6B", textTransform: "uppercase", letterSpacing: "0.05em" }}>Server</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <CheckCircle size={16} color="#16A34A" />
            <span style={{ fontSize: 15, fontWeight: 700, color: "#16A34A" }}>Online</span>
          </div>
          <div style={{ fontSize: 11, color: "#9B9B9B", marginTop: 6 }}>
            Total response: {data.serverTimeMs}ms
          </div>
        </div>
      </div>

      {/* Row 2: Data Freshness */}
      <div style={card}>
        <div style={{ fontSize: 13, fontWeight: 600, color: "#1A1A1A", marginBottom: 12, display: "flex", alignItems: "center", gap: 6 }}>
          <Clock size={14} /> Data Freshness
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #E8E8E4" }}>
                <th style={{ textAlign: "left", padding: "6px 8px", color: "#9B9B9B", fontWeight: 600, fontSize: 11 }}>District</th>
                <th style={{ textAlign: "center", padding: "6px 8px", color: "#9B9B9B", fontWeight: 600, fontSize: 11 }}>Weather</th>
                <th style={{ textAlign: "center", padding: "6px 8px", color: "#9B9B9B", fontWeight: 600, fontSize: 11 }}>News</th>
                <th style={{ textAlign: "center", padding: "6px 8px", color: "#9B9B9B", fontWeight: 600, fontSize: 11 }}>Crops</th>
                <th style={{ textAlign: "center", padding: "6px 8px", color: "#9B9B9B", fontWeight: 600, fontSize: 11 }}>AI Insights</th>
              </tr>
            </thead>
            <tbody>
              {data.dataFreshness.map((d) => (
                <tr key={d.slug} style={{ borderBottom: "1px solid #F5F5F0" }}>
                  <td style={{ padding: "6px 8px", fontWeight: 600, color: "#1A1A1A" }}>{d.district}</td>
                  <td style={{ padding: "4px 6px", textAlign: "center" }}>
                    <span style={{ ...freshnessColor(d.weather, [MS_30M, MS_2H]), padding: "2px 8px", borderRadius: 4, fontSize: 11, fontWeight: 600 }}>
                      {relTime(d.weather)}
                    </span>
                  </td>
                  <td style={{ padding: "4px 6px", textAlign: "center" }}>
                    <span style={{ ...freshnessColor(d.news, [MS_3H, MS_12H]), padding: "2px 8px", borderRadius: 4, fontSize: 11, fontWeight: 600 }}>
                      {relTime(d.news)}
                    </span>
                  </td>
                  <td style={{ padding: "4px 6px", textAlign: "center" }}>
                    <span style={{ ...freshnessColor(d.crops, [MS_24H, MS_48H]), padding: "2px 8px", borderRadius: 4, fontSize: 11, fontWeight: 600 }}>
                      {relTime(d.crops)}
                    </span>
                  </td>
                  <td style={{ padding: "4px 6px", textAlign: "center" }}>
                    <span style={{ ...freshnessColor(d.aiInsights, [MS_4H, MS_12H]), padding: "2px 8px", borderRadius: 4, fontSize: 11, fontWeight: 600 }}>
                      {relTime(d.aiInsights)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Row 3: Scraper Status */}
      <div style={card}>
        <div style={{ fontSize: 13, fontWeight: 600, color: "#1A1A1A", marginBottom: 12 }}>Scraper Status (24h)</div>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
          <div style={{ flex: 1, height: 20, borderRadius: 10, overflow: "hidden", background: "#FEE2E2", display: "flex" }}>
            <div style={{ width: `${successPct}%`, background: "#16A34A", borderRadius: 10, transition: "width 300ms" }} />
          </div>
          <span style={{ fontSize: 12, fontWeight: 600, color: "#1A1A1A", whiteSpace: "nowrap" }}>
            {s24.successful} ✓ / {s24.failed} ✗
          </span>
        </div>
        {data.scrapers.recentLogs.length > 0 && (
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #E8E8E4" }}>
                <th style={{ textAlign: "left", padding: "6px 8px", color: "#9B9B9B", fontWeight: 600, fontSize: 11 }}>Job</th>
                <th style={{ textAlign: "center", padding: "6px 8px", color: "#9B9B9B", fontWeight: 600, fontSize: 11 }}>Status</th>
                <th style={{ textAlign: "right", padding: "6px 8px", color: "#9B9B9B", fontWeight: 600, fontSize: 11 }}>Duration</th>
                <th style={{ textAlign: "right", padding: "6px 8px", color: "#9B9B9B", fontWeight: 600, fontSize: 11 }}>Records</th>
                <th style={{ textAlign: "right", padding: "6px 8px", color: "#9B9B9B", fontWeight: 600, fontSize: 11 }}>Time</th>
              </tr>
            </thead>
            <tbody>
              {data.scrapers.recentLogs.map((log) => (
                <tr key={log.id} style={{ borderBottom: "1px solid #F5F5F0" }}>
                  <td style={{ padding: "6px 8px", color: "#1A1A1A", fontWeight: 500 }}>{log.jobName}</td>
                  <td style={{ padding: "6px 8px", textAlign: "center" }}>
                    {log.status === "success"
                      ? <span style={{ color: "#16A34A" }}>✓</span>
                      : <span style={{ color: "#DC2626" }}>✗</span>}
                  </td>
                  <td style={{ padding: "6px 8px", textAlign: "right", color: "#6B6B6B" }}>{(log.durationMs / 1000).toFixed(1)}s</td>
                  <td style={{ padding: "6px 8px", textAlign: "right", color: "#6B6B6B" }}>{log.recordsAffected}</td>
                  <td style={{ padding: "6px 8px", textAlign: "right", color: "#9B9B9B", fontSize: 11 }}>
                    {log.createdAt ? relTime(log.createdAt) : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Row 4: Pending Items */}
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        {[
          { label: "Reviews", count: data.pendingItems.reviews, bg: "#DBEAFE", color: "#2563EB" },
          { label: "Feedback", count: data.pendingItems.feedback, bg: "#FEF3C7", color: "#D97706" },
          { label: "Alerts", count: data.pendingItems.alerts, bg: "#FFEDD5", color: "#EA580C" },
          { label: "Unread Alerts", count: data.pendingItems.unreadAlerts, bg: data.pendingItems.unreadAlerts > 0 ? "#FEE2E2" : "#F3F4F6", color: data.pendingItems.unreadAlerts > 0 ? "#DC2626" : "#6B6B6B" },
        ].map((p) => (
          <div key={p.label} style={{ background: p.bg, color: p.color, padding: "6px 14px", borderRadius: 20, fontSize: 13, fontWeight: 600 }}>
            {p.count} {p.label}
          </div>
        ))}
      </div>

      {/* Row 5: Revenue */}
      <div style={card}>
        <div style={{ display: "flex", gap: 24, fontSize: 13 }}>
          <div>
            <span style={{ color: "#9B9B9B" }}>Last 7 days: </span>
            <span style={{ fontWeight: 700, color: "#1A1A1A" }}>₹{data.contributions.last7days.toLocaleString("en-IN")}</span>
          </div>
          <div>
            <span style={{ color: "#9B9B9B" }}>Total: </span>
            <span style={{ fontWeight: 700, color: "#1A1A1A" }}>₹{data.contributions.totalRevenue.toLocaleString("en-IN")}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
