"use client";

import { useCallback, useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";

interface AdminAlertItem {
  id: string;
  level: string;
  title: string;
  message: string;
  details: Record<string, string | number> | null;
  module: string | null;
  district: string | null;
  read: boolean;
  emailed: boolean;
  createdAt: string;
}

const card: React.CSSProperties = {
  background: "#FFFFFF",
  border: "1px solid #E8E8E4",
  borderRadius: 10,
  padding: 16,
};

const EMOJI: Record<string, string> = { critical: "🚨", warning: "⚠️", info: "ℹ️" };
const LEVEL_COLOR: Record<string, string> = { critical: "#DC2626", warning: "#D97706", info: "#2563EB" };

export default function AlertsAndLogs() {
  const [alerts, setAlerts] = useState<AdminAlertItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");
  const [unreadOnly, setUnreadOnly] = useState(false);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [offset, setOffset] = useState(0);

  const fetchAlerts = useCallback((reset = true) => {
    setLoading(true);
    const params = new URLSearchParams();
    if (filter !== "all") params.set("level", filter);
    if (unreadOnly) params.set("read", "false");
    params.set("limit", "50");
    params.set("offset", reset ? "0" : String(offset));

    fetch(`/api/admin/alerts?${params}`)
      .then((r) => r.json())
      .then((d) => {
        if (reset) {
          setAlerts(d.alerts || []);
          setOffset(50);
        } else {
          setAlerts((prev) => [...prev, ...(d.alerts || [])]);
          setOffset((prev) => prev + 50);
        }
        setTotal(d.total || 0);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [filter, unreadOnly, offset]);

  useEffect(() => {
    fetchAlerts(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, unreadOnly]);

  const markRead = async (ids: string[]) => {
    await fetch("/api/admin/alerts", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids }),
    });
    setAlerts((prev) => prev.map((a) => (ids.includes(a.id) ? { ...a, read: true } : a)));
  };

  const markAllRead = async () => {
    await fetch("/api/admin/alerts", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ markAllRead: true }),
    });
    setAlerts((prev) => prev.map((a) => ({ ...a, read: true })));
  };

  const clearOld = async () => {
    const res = await fetch("/api/admin/alerts", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ olderThanDays: 30 }),
    });
    const d = await res.json();
    if (d.deleted > 0) fetchAlerts(true);
  };

  const toggleExpand = (id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const unreadCount = alerts.filter((a) => !a.read).length;
  const critToday = alerts.filter(
    (a) => a.level === "critical" && new Date(a.createdAt).toDateString() === new Date().toDateString()
  ).length;
  const lastAlert = alerts[0]?.createdAt;

  const hasEmailActive = alerts.some((a) => a.emailed);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <h2 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: "#1A1A1A" }}>Alerts & Logs</h2>

      {/* Quick stats + actions */}
      <div style={{ ...card, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
        <div style={{ fontSize: 13, color: "#6B6B6B" }}>
          <strong style={{ color: "#1A1A1A" }}>{unreadCount}</strong> unread
          {" · "}
          <strong style={{ color: "#DC2626" }}>{critToday}</strong> critical today
          {lastAlert && (
            <>
              {" · Last alert: "}
              {formatDistanceToNow(new Date(lastAlert), { addSuffix: true })}
            </>
          )}
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={markAllRead}
            style={{
              background: "#2563EB", color: "#fff", border: "none", borderRadius: 6,
              padding: "6px 12px", fontSize: 12, fontWeight: 600, cursor: "pointer",
            }}
          >
            Mark All Read
          </button>
          <button
            onClick={clearOld}
            style={{
              background: "#fff", color: "#DC2626", border: "1px solid #FCA5A5", borderRadius: 6,
              padding: "6px 12px", fontSize: 12, fontWeight: 600, cursor: "pointer",
            }}
          >
            Clear 30d+
          </button>
        </div>
      </div>

      {/* Filter bar */}
      <div style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" }}>
        {[
          { id: "all", label: "All" },
          { id: "critical", label: "🚨 Critical" },
          { id: "warning", label: "⚠️ Warning" },
          { id: "info", label: "ℹ️ Info" },
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            style={{
              padding: "5px 12px", borderRadius: 6, fontSize: 12, fontWeight: 600,
              border: filter === f.id ? "1px solid #2563EB" : "1px solid #E8E8E4",
              background: filter === f.id ? "#EFF6FF" : "#fff",
              color: filter === f.id ? "#2563EB" : "#6B6B6B",
              cursor: "pointer",
            }}
          >
            {f.label}
          </button>
        ))}
        <label style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "#6B6B6B", marginLeft: 8, cursor: "pointer" }}>
          <input
            type="checkbox"
            checked={unreadOnly}
            onChange={(e) => setUnreadOnly(e.target.checked)}
            style={{ accentColor: "#2563EB" }}
          />
          Unread only
        </label>
      </div>

      {/* Alert feed */}
      {loading && alerts.length === 0 ? (
        <div style={{ padding: 24, textAlign: "center", color: "#9B9B9B", fontSize: 13 }}>Loading alerts...</div>
      ) : alerts.length === 0 ? (
        <div style={{ ...card, textAlign: "center", color: "#9B9B9B", fontSize: 13, padding: 32 }}>
          No alerts found.
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {alerts.map((alert) => (
            <div
              key={alert.id}
              style={{
                ...card,
                borderLeft: `3px solid ${alert.read ? "#D1D5DB" : "#2563EB"}`,
                cursor: "pointer",
              }}
              onClick={() => toggleExpand(alert.id)}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span>{EMOJI[alert.level] || "ℹ️"}</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: LEVEL_COLOR[alert.level] || "#1A1A1A" }}>
                    {alert.title}
                  </span>
                  {!alert.read && (
                    <span style={{ background: "#2563EB", color: "#fff", fontSize: 9, fontWeight: 700, padding: "1px 5px", borderRadius: 4 }}>
                      unread
                    </span>
                  )}
                </div>
                <span style={{ fontSize: 11, color: "#9B9B9B", whiteSpace: "nowrap", marginLeft: 8 }}>
                  {formatDistanceToNow(new Date(alert.createdAt), { addSuffix: true })}
                </span>
              </div>
              <div style={{ fontSize: 12, color: "#6B6B6B", marginTop: 4 }}>{alert.message}</div>

              {expanded.has(alert.id) && alert.details && (
                <div style={{
                  marginTop: 8, background: "#FAFAF8", border: "1px solid #E8E8E4",
                  borderRadius: 6, padding: 10, fontSize: 12,
                }}>
                  {Object.entries(alert.details).map(([k, v]) => (
                    <div key={k} style={{ display: "flex", gap: 8, padding: "2px 0" }}>
                      <span style={{ color: "#9B9B9B", minWidth: 80 }}>{k}:</span>
                      <span style={{ color: "#1A1A1A", fontWeight: 500, wordBreak: "break-all" }}>{String(v)}</span>
                    </div>
                  ))}
                </div>
              )}

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8 }}>
                {!alert.read ? (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      markRead([alert.id]);
                    }}
                    style={{
                      background: "none", border: "1px solid #E8E8E4", borderRadius: 4,
                      padding: "3px 10px", fontSize: 11, color: "#2563EB", cursor: "pointer", fontWeight: 600,
                    }}
                  >
                    Mark as Read
                  </button>
                ) : (
                  <span style={{ fontSize: 11, color: "#9B9B9B" }}>Read</span>
                )}
                <span style={{ fontSize: 11, color: "#9B9B9B" }}>
                  {alert.emailed ? "📧 Email sent" : "📧 Not emailed"}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Load more */}
      {alerts.length < total && (
        <button
          onClick={() => fetchAlerts(false)}
          style={{
            background: "#fff", border: "1px solid #E8E8E4", borderRadius: 8,
            padding: "8px 16px", fontSize: 13, color: "#2563EB", cursor: "pointer",
            fontWeight: 600, alignSelf: "center",
          }}
        >
          Load more ({total - alerts.length} remaining)
        </button>
      )}

      {/* Email status */}
      <div style={{ ...card, fontSize: 12, color: "#6B6B6B" }}>
        {hasEmailActive
          ? "✓ Email alerts active — recent alerts have been emailed successfully"
          : "✗ Email alerts may not be configured — set RESEND_API_KEY and ADMIN_EMAIL in environment"}
      </div>
    </div>
  );
}
