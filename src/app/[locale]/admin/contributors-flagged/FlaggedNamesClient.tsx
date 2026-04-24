"use client";

import { useState } from "react";
import { validateContributorName } from "@/lib/validators/contributor-name";

type Row = {
  id: string;
  name: string;
  originalName: string | null;
  email: string | null;
  tier: string | null;
  amount: number;
  createdAt: string;
};

export default function FlaggedNamesClient({ initialRows }: { initialRows: Row[] }) {
  const [rows, setRows] = useState(initialRows);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function apply(id: string, action: "unflag" | "restore" | "rename" | "delete", payload?: { name?: string }) {
    setBusy(id);
    setError(null);
    try {
      const res = await fetch(`/api/admin/supporters/${id}/flag`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, ...payload }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? `HTTP ${res.status}`);
      }
      // Remove the row from the list — once handled, it's no longer flagged.
      setRows((prev) => prev.filter((r) => r.id !== id));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed");
    } finally {
      setBusy(null);
    }
  }

  if (rows.length === 0) {
    return (
      <div style={{ padding: 32, textAlign: "center", background: "#F6F6F2", borderRadius: 8 }}>
        <p style={{ color: "#6B6B6B", fontSize: 13 }}>No flagged names remain. ✓</p>
      </div>
    );
  }

  return (
    <div>
      {error && (
        <div style={{ padding: 12, marginBottom: 12, background: "#FDE8E4", color: "#A62F1F", borderRadius: 6, fontSize: 13 }}>
          {error}
        </div>
      )}
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
        <thead>
          <tr style={{ background: "#F6F6F2", textAlign: "left" }}>
            <th style={th}>Current Name</th>
            <th style={th}>Original</th>
            <th style={th}>Email</th>
            <th style={th}>Tier / ₹</th>
            <th style={th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <FlaggedRow
              key={r.id}
              row={r}
              busy={busy === r.id}
              onApply={apply}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function FlaggedRow({
  row,
  busy,
  onApply,
}: {
  row: Row;
  busy: boolean;
  onApply: (id: string, action: "unflag" | "restore" | "rename" | "delete", payload?: { name?: string }) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(row.name);
  const draftValid = validateContributorName(draft);
  const originalValid = row.originalName ? validateContributorName(row.originalName).ok : false;

  return (
    <tr style={{ borderBottom: "1px solid #EAEAE6" }}>
      <td style={td}>
        {editing ? (
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            maxLength={40}
            style={{
              padding: "6px 8px", border: "1px solid #E0E0DA", borderRadius: 4,
              fontSize: 13, width: "100%",
            }}
          />
        ) : (
          <strong>{row.name}</strong>
        )}
      </td>
      <td style={{ ...td, color: "#8B8B85", fontStyle: "italic", maxWidth: 260, wordBreak: "break-word" }}>
        {row.originalName ?? "—"}
      </td>
      <td style={td}>{row.email ?? "—"}</td>
      <td style={td}>{row.tier} / ₹{row.amount}</td>
      <td style={{ ...td, whiteSpace: "nowrap" }}>
        {editing ? (
          <>
            <button
              onClick={() => {
                if (!draftValid.ok) return;
                onApply(row.id, "rename", { name: draftValid.cleaned });
              }}
              disabled={busy || !draftValid.ok}
              style={{ ...btn, background: "#245", color: "white", opacity: draftValid.ok ? 1 : 0.5 }}
              title={!draftValid.ok ? (draftValid as { reason: string }).reason : "Save"}
            >
              Save
            </button>
            <button onClick={() => setEditing(false)} disabled={busy} style={btn}>
              Cancel
            </button>
          </>
        ) : (
          <>
            <button onClick={() => { setDraft(row.name); setEditing(true); }} disabled={busy} style={btn}>
              Edit
            </button>
            <button
              onClick={() => onApply(row.id, "unflag")}
              disabled={busy}
              style={btn}
              title="Keep current name, remove flag"
            >
              Approve
            </button>
            <button
              onClick={() => onApply(row.id, "restore")}
              disabled={busy || !originalValid}
              style={btn}
              title={originalValid ? "Restore original name (and clear flag)" : "Original name fails validation — can't restore"}
            >
              Restore
            </button>
            <button
              onClick={() => {
                if (confirm(`Delete supporter row "${row.name}" (₹${row.amount})? This is permanent.`)) {
                  onApply(row.id, "delete");
                }
              }}
              disabled={busy}
              style={{ ...btn, color: "#A62F1F" }}
            >
              Delete
            </button>
          </>
        )}
      </td>
    </tr>
  );
}

const th: React.CSSProperties = { padding: "10px 12px", fontWeight: 600, fontSize: 12, borderBottom: "1px solid #E0E0DA" };
const td: React.CSSProperties = { padding: "10px 12px", verticalAlign: "top" };
const btn: React.CSSProperties = {
  padding: "4px 10px", marginRight: 6, border: "1px solid #D0D0C8",
  background: "white", borderRadius: 4, fontSize: 12, cursor: "pointer",
};
