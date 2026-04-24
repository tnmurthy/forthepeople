"use client";

import { useMemo, useState } from "react";

type Status = "PENDING" | "REVIEWED" | "ACCEPTED" | "REJECTED" | "SPAM" | "IMPLEMENTED";

type Row = {
  id: string;
  name: string;
  email: string | null;
  title: string;
  body: string;
  category: string | null;
  status: Status;
  adminNotes: string | null;
  upvotes: number;
  createdAt: string;
  updatedAt: string;
};

const STATUSES: Status[] = ["PENDING", "REVIEWED", "ACCEPTED", "REJECTED", "SPAM", "IMPLEMENTED"];

const STATUS_COLORS: Record<Status, { bg: string; fg: string }> = {
  PENDING:     { bg: "#FEF3C7", fg: "#854D0E" },
  REVIEWED:    { bg: "#DBEAFE", fg: "#1E40AF" },
  ACCEPTED:    { bg: "#DCFCE7", fg: "#166534" },
  REJECTED:    { bg: "#F3F4F6", fg: "#4B5563" },
  SPAM:        { bg: "#FEE2E2", fg: "#991B1B" },
  IMPLEMENTED: { bg: "#D1FAE5", fg: "#065F46" },
};

export default function SuggestionsClient({ initialRows }: { initialRows: Row[] }) {
  const [rows, setRows] = useState(initialRows);
  const [filter, setFilter] = useState<Status | "ALL">("ALL");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const filtered = useMemo(
    () => (filter === "ALL" ? rows : rows.filter((r) => r.status === filter)),
    [rows, filter],
  );

  async function updateRow(id: string, patch: { status?: Status; adminNotes?: string }) {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/suggestions/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error ?? `HTTP ${res.status}`);
      }
      setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Update failed");
    } finally {
      setBusy(false);
    }
  }

  async function deleteRow(id: string) {
    if (!confirm("Delete suggestion permanently?")) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/suggestions/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setRows((prev) => prev.filter((r) => r.id !== id));
      setSelected((prev) => { const next = new Set(prev); next.delete(id); return next; });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Delete failed");
    } finally {
      setBusy(false);
    }
  }

  async function bulkMarkSpamAndDelete() {
    if (selected.size === 0) return;
    if (!confirm(`Mark ${selected.size} as SPAM and delete permanently?`)) return;
    setBusy(true);
    try {
      for (const id of Array.from(selected)) {
        await fetch(`/api/admin/suggestions/${id}`, { method: "DELETE" });
      }
      setRows((prev) => prev.filter((r) => !selected.has(r.id)));
      setSelected(new Set());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Bulk delete failed");
    } finally {
      setBusy(false);
    }
  }

  function toggleSelect(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <div>
      {error && (
        <div style={{ padding: 10, marginBottom: 12, background: "#FEE2E2", color: "#991B1B", borderRadius: 6, fontSize: 13 }}>
          {error}
        </div>
      )}

      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
        <span style={{ fontSize: 12, color: "#6B6B6B" }}>Filter:</span>
        {(["ALL", ...STATUSES] as const).map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            style={{
              padding: "4px 10px", fontSize: 12, borderRadius: 16,
              border: `1px solid ${filter === s ? "#2563EB" : "#E0E0DA"}`,
              background: filter === s ? "#EFF6FF" : "white",
              color: filter === s ? "#2563EB" : "#4B4B4B",
              cursor: "pointer",
            }}
          >
            {s}
          </button>
        ))}
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 12, color: "#6B6B6B" }}>{selected.size} selected</span>
          <button
            onClick={bulkMarkSpamAndDelete}
            disabled={selected.size === 0 || busy}
            style={{
              padding: "6px 12px", fontSize: 12, borderRadius: 6,
              border: "1px solid #FECACA", background: "#FEF2F2", color: "#991B1B",
              cursor: selected.size === 0 ? "default" : "pointer",
              opacity: selected.size === 0 ? 0.5 : 1,
            }}
          >
            🗑️ Mark SPAM + delete
          </button>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {filtered.length === 0 ? (
          <div style={{ padding: 32, textAlign: "center", background: "#F6F6F2", borderRadius: 8, color: "#6B6B6B", fontSize: 13 }}>
            No suggestions {filter === "ALL" ? "" : `in ${filter}`} yet.
          </div>
        ) : (
          filtered.map((r) => (
            <SuggestionCard
              key={r.id}
              row={r}
              selected={selected.has(r.id)}
              onToggle={() => toggleSelect(r.id)}
              onUpdate={(patch) => updateRow(r.id, patch)}
              onDelete={() => deleteRow(r.id)}
              busy={busy}
            />
          ))
        )}
      </div>
    </div>
  );
}

function SuggestionCard({
  row, selected, onToggle, onUpdate, onDelete, busy,
}: {
  row: Row;
  selected: boolean;
  onToggle: () => void;
  onUpdate: (patch: { status?: Status; adminNotes?: string }) => void;
  onDelete: () => void;
  busy: boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  const [notes, setNotes] = useState(row.adminNotes ?? "");
  const notesDirty = notes !== (row.adminNotes ?? "");
  const c = STATUS_COLORS[row.status];

  return (
    <div style={{ background: "white", border: "1px solid #E8E8E4", borderRadius: 10, padding: "14px 18px" }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
        <input
          type="checkbox"
          checked={selected}
          onChange={onToggle}
          style={{ marginTop: 4 }}
        />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 6 }}>
            <strong style={{ fontSize: 14, color: "#1A1A1A" }}>{row.title}</strong>
            {row.category && (
              <span style={{ fontSize: 10, padding: "2px 7px", borderRadius: 10, background: "#EFF6FF", color: "#2563EB", fontWeight: 600 }}>
                {row.category}
              </span>
            )}
            <span style={{ fontSize: 10, padding: "2px 7px", borderRadius: 10, background: c.bg, color: c.fg, fontWeight: 600 }}>
              {row.status}
            </span>
            <span style={{ fontSize: 11, color: "#9B9B9B" }}>
              {new Date(row.createdAt).toLocaleDateString("en-IN")}
            </span>
          </div>
          <div style={{ fontSize: 12, color: "#6B6B6B", marginBottom: 6 }}>
            <strong>{row.name}</strong>
            {row.email ? <span> · {row.email}</span> : null}
          </div>
          <div style={{ fontSize: 13, color: "#4B4B4B", lineHeight: 1.5, whiteSpace: "pre-wrap" }}>
            {expanded || row.body.length <= 240 ? row.body : row.body.slice(0, 240) + "…"}
            {row.body.length > 240 && (
              <button
                onClick={() => setExpanded(!expanded)}
                style={{ marginLeft: 6, border: "none", background: "transparent", color: "#2563EB", cursor: "pointer", fontSize: 12 }}
              >
                {expanded ? "show less" : "show more"}
              </button>
            )}
          </div>

          <div style={{ marginTop: 10, display: "flex", gap: 10, alignItems: "flex-start", flexWrap: "wrap" }}>
            <label style={{ fontSize: 11, color: "#6B6B6B" }}>
              Status:{" "}
              <select
                value={row.status}
                onChange={(e) => onUpdate({ status: e.target.value as Status })}
                disabled={busy}
                style={{ padding: "4px 8px", fontSize: 12, borderRadius: 4, border: "1px solid #E0E0DA" }}
              >
                {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </label>
            <button
              onClick={onDelete}
              disabled={busy}
              style={{ padding: "4px 10px", fontSize: 12, borderRadius: 4, border: "1px solid #E0E0DA", background: "white", color: "#991B1B", cursor: "pointer" }}
            >
              Delete
            </button>
          </div>

          <div style={{ marginTop: 10 }}>
            <div style={{ fontSize: 11, color: "#6B6B6B", marginBottom: 4 }}>Admin notes (internal)</div>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              maxLength={2000}
              placeholder="Your internal notes on this suggestion…"
              style={{ width: "100%", padding: "6px 10px", fontSize: 12, borderRadius: 6, border: "1px solid #E0E0DA", fontFamily: "inherit", resize: "vertical" }}
            />
            {notesDirty && (
              <button
                onClick={() => onUpdate({ adminNotes: notes })}
                disabled={busy}
                style={{ marginTop: 4, padding: "4px 10px", fontSize: 12, borderRadius: 4, border: "none", background: "#2563EB", color: "white", cursor: "pointer" }}
              >
                Save notes
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
