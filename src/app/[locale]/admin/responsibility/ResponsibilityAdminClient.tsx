"use client";

import { useEffect, useMemo, useState } from "react";

type District = { id: string; slug: string; name: string };

type Item = {
  id: string;
  districtId: string;
  section: string;
  sectionIcon: string;
  sectionOrder: number;
  action: string;
  whyRelevant: string;
  reportToName: string | null;
  reportToUrl: string | null;
  reportToPhone: string | null;
  phoneVerified: boolean;
  sourceNotes: string | null;
  itemOrder: number;
  active: boolean;
  district: { slug: string; name: string };
};

export default function ResponsibilityAdminClient({
  districts, defaultSlug,
}: {
  districts: District[];
  defaultSlug: string;
}) {
  const [slug, setSlug] = useState(defaultSlug);
  const [unverifiedOnly, setUnverifiedOnly] = useState(false);
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const qs = new URLSearchParams();
      if (slug) qs.set("district", slug);
      if (unverifiedOnly) qs.set("unverifiedOnly", "1");
      const res = await fetch(`/api/admin/responsibility?${qs.toString()}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const j = await res.json();
      setItems(j.data.items as Item[]);
      setSelected(new Set());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Load failed");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [slug, unverifiedOnly]);

  async function patch(id: string, patchBody: Partial<Item>) {
    setError(null);
    try {
      const res = await fetch(`/api/admin/responsibility/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patchBody),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error ?? `HTTP ${res.status}`);
      }
      const j = await res.json();
      setItems((prev) => prev.map((it) => (it.id === id ? (j.data as Item) : it)));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed");
    }
  }

  async function remove(id: string) {
    if (!confirm("Delete this responsibility item?")) return;
    setError(null);
    try {
      const res = await fetch(`/api/admin/responsibility/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setItems((prev) => prev.filter((it) => it.id !== id));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Delete failed");
    }
  }

  async function bulkVerifyPhones() {
    const ids = Array.from(selected).filter((id) => {
      const it = items.find((x) => x.id === id);
      return it && it.reportToPhone && !it.phoneVerified;
    });
    if (ids.length === 0) {
      alert("Select rows that have a phone number but are unverified.");
      return;
    }
    if (!confirm(`Mark ${ids.length} phone(s) as verified?`)) return;
    for (const id of ids) {
      await patch(id, { phoneVerified: true });
    }
    setSelected(new Set());
  }

  const bySection = useMemo(() => {
    const m = new Map<string, Item[]>();
    for (const it of items) {
      const arr = m.get(it.section) ?? [];
      arr.push(it);
      m.set(it.section, arr);
    }
    return Array.from(m.entries()).sort((a, b) => {
      return (a[1][0]?.sectionOrder ?? 0) - (b[1][0]?.sectionOrder ?? 0);
    });
  }, [items]);

  function toggleSelect(id: string) {
    setSelected((s) => {
      const n = new Set(s);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });
  }

  const unverifiedCount = items.filter((i) => i.reportToPhone && !i.phoneVerified).length;

  return (
    <div>
      {error && (
        <div style={{ padding: 10, marginBottom: 12, background: "#FEE2E2", color: "#991B1B", borderRadius: 6, fontSize: 13 }}>
          {error}
        </div>
      )}

      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
        <label style={{ fontSize: 12, color: "#6B6B6B" }}>
          District:{" "}
          <select
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            style={{ padding: "4px 8px", fontSize: 12, borderRadius: 4, border: "1px solid #E0E0DA" }}
          >
            {districts.map((d) => (
              <option key={d.slug} value={d.slug}>{d.name}</option>
            ))}
          </select>
        </label>
        <label style={{ fontSize: 12, color: "#6B6B6B", display: "inline-flex", alignItems: "center", gap: 6 }}>
          <input
            type="checkbox"
            checked={unverifiedOnly}
            onChange={(e) => setUnverifiedOnly(e.target.checked)}
          />
          Unverified phones only ({unverifiedCount})
        </label>
        <button
          onClick={load}
          style={btnStyle}
        >
          Refresh
        </button>
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 12, color: "#6B6B6B" }}>{selected.size} selected</span>
          <button
            onClick={bulkVerifyPhones}
            disabled={selected.size === 0}
            style={{
              ...btnStyle,
              background: selected.size === 0 ? "#F3F4F6" : "#DCFCE7",
              color: selected.size === 0 ? "#9B9B9B" : "#166534",
              borderColor: selected.size === 0 ? "#E0E0DA" : "#A7F3D0",
              cursor: selected.size === 0 ? "default" : "pointer",
            }}
          >
            ✓ Mark selected phones verified
          </button>
        </div>
      </div>

      {loading && <div style={{ color: "#9B9B9B", fontSize: 13 }}>Loading…</div>}

      {!loading && items.length === 0 && (
        <div style={{ padding: 24, textAlign: "center", background: "#F6F6F2", borderRadius: 8, color: "#6B6B6B", fontSize: 13 }}>
          No responsibility items for this district yet.
        </div>
      )}

      {!loading && items.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          {bySection.map(([sectionName, rows]) => (
            <div key={sectionName}>
              <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 8, color: "#1A1A1A" }}>
                {rows[0]?.sectionIcon} {sectionName} ({rows.length})
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {rows.map((it) => (
                  <Row
                    key={it.id}
                    item={it}
                    selected={selected.has(it.id)}
                    onToggleSelect={() => toggleSelect(it.id)}
                    onPatch={(p) => patch(it.id, p)}
                    onDelete={() => remove(it.id)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Row({
  item, selected, onToggleSelect, onPatch, onDelete,
}: {
  item: Item;
  selected: boolean;
  onToggleSelect: () => void;
  onPatch: (p: Partial<Item>) => void;
  onDelete: () => void;
}) {
  const [editing, setEditing] = useState(false);
  const [phone, setPhone] = useState(item.reportToPhone ?? "");

  return (
    <div
      style={{
        background: "white",
        border: "1px solid #E8E8E4",
        borderRadius: 8,
        padding: "10px 14px",
        display: "flex",
        gap: 12,
        alignItems: "flex-start",
      }}
    >
      <input
        type="checkbox"
        checked={selected}
        onChange={onToggleSelect}
        style={{ marginTop: 4 }}
      />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: "#1A1A1A", marginBottom: 2 }}>
          {item.action}
        </div>
        <div style={{ fontSize: 11, color: "#6B6B6B", marginBottom: 6 }}>
          {item.reportToName ?? "—"}
          {item.reportToPhone && (
            <span style={{ marginLeft: 8 }}>
              📞 {editing ? (
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  style={{ padding: "2px 6px", fontSize: 11, borderRadius: 4, border: "1px solid #E0E0DA" }}
                />
              ) : (
                item.reportToPhone
              )}
              <span
                style={{
                  marginLeft: 6,
                  padding: "1px 6px",
                  borderRadius: 8,
                  fontSize: 10,
                  fontWeight: 600,
                  background: item.phoneVerified ? "#DCFCE7" : "#FEE2E2",
                  color: item.phoneVerified ? "#166534" : "#991B1B",
                }}
              >
                {item.phoneVerified ? "verified" : "unverified"}
              </span>
            </span>
          )}
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 4, flexWrap: "wrap", justifyContent: "flex-end" }}>
        {editing ? (
          <>
            <button
              onClick={() => {
                onPatch({ reportToPhone: phone.trim() || null, phoneVerified: !!phone.trim() });
                setEditing(false);
              }}
              style={{ ...btnStyle, background: "#2563EB", color: "white", borderColor: "#2563EB" }}
            >
              Save phone
            </button>
            <button onClick={() => { setPhone(item.reportToPhone ?? ""); setEditing(false); }} style={btnStyle}>
              Cancel
            </button>
          </>
        ) : (
          <>
            <button onClick={() => setEditing(true)} style={btnStyle}>Edit phone</button>
            {item.reportToPhone && !item.phoneVerified && (
              <button
                onClick={() => onPatch({ phoneVerified: true })}
                style={{ ...btnStyle, background: "#DCFCE7", color: "#166534", borderColor: "#A7F3D0" }}
              >
                ✓ Verify
              </button>
            )}
            <button
              onClick={() => onPatch({ active: !item.active })}
              style={btnStyle}
            >
              {item.active ? "Hide" : "Show"}
            </button>
            <button onClick={onDelete} style={{ ...btnStyle, color: "#991B1B" }}>
              Delete
            </button>
          </>
        )}
      </div>
    </div>
  );
}

const btnStyle: React.CSSProperties = {
  padding: "4px 10px",
  fontSize: 12,
  borderRadius: 4,
  border: "1px solid #E0E0DA",
  background: "white",
  cursor: "pointer",
};
