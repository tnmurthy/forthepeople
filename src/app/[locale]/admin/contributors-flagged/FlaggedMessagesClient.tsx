"use client";

import { useState } from "react";
import { validateSupporterMessage } from "@/lib/validators/supporter-message";

type Row = {
  id: string;
  name: string;
  message: string | null;
  originalMessage: string | null;
  email: string | null;
  tier: string | null;
  amount: number;
  createdAt: string;
};

export default function FlaggedMessagesClient({ initialRows }: { initialRows: Row[] }) {
  const [rows, setRows] = useState(initialRows);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function apply(
    id: string,
    action: "keep-cleared" | "restore",
  ) {
    setBusy(id);
    setError(null);
    try {
      const res = await fetch(`/api/admin/supporters/${id}/flag-message`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? `HTTP ${res.status}`);
      }
      setRows((prev) => prev.filter((r) => r.id !== id));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed");
    } finally {
      setBusy(null);
    }
  }

  if (rows.length === 0) {
    return (
      <div style={{ padding: 24, textAlign: "center", background: "#F6F6F2", borderRadius: 8, color: "#6B6B6B", fontSize: 13 }}>
        No flagged messages remain. ✓
      </div>
    );
  }

  return (
    <div>
      {error && (
        <div style={{ padding: 10, marginBottom: 12, background: "#FDE8E4", color: "#A62F1F", borderRadius: 6, fontSize: 13 }}>
          {error}
        </div>
      )}
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
        <thead>
          <tr style={{ background: "#F6F6F2", textAlign: "left" }}>
            <th style={th}>Supporter</th>
            <th style={th}>Current Message</th>
            <th style={th}>Original (flagged)</th>
            <th style={th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => {
            const originalCheck = r.originalMessage
              ? validateSupporterMessage(r.originalMessage)
              : { ok: false as const, reason: "—" };
            return (
              <tr key={r.id} style={{ borderBottom: "1px solid #EAEAE6" }}>
                <td style={td}>
                  <strong>{r.name}</strong>
                  <div style={{ fontSize: 11, color: "#9B9B9B" }}>
                    {r.tier} · ₹{r.amount}
                  </div>
                </td>
                <td style={{ ...td, color: "#9B9B9B", fontStyle: "italic" }}>
                  {r.message ?? "(cleared)"}
                </td>
                <td style={{ ...td, maxWidth: 320, wordBreak: "break-word", fontStyle: "italic" }}>
                  {r.originalMessage ?? "—"}
                </td>
                <td style={{ ...td, whiteSpace: "nowrap" }}>
                  <button
                    onClick={() => apply(r.id, "keep-cleared")}
                    disabled={busy === r.id}
                    style={btn}
                    title="Confirm the cleared state, remove flag"
                  >
                    Keep cleared
                  </button>
                  <button
                    onClick={() => apply(r.id, "restore")}
                    disabled={busy === r.id || !originalCheck.ok}
                    style={btn}
                    title={
                      originalCheck.ok
                        ? "Restore original message"
                        : "Original still fails validation — cannot restore"
                    }
                  >
                    Restore
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

const th: React.CSSProperties = { padding: "10px 12px", fontWeight: 600, fontSize: 12, borderBottom: "1px solid #E0E0DA" };
const td: React.CSSProperties = { padding: "10px 12px", verticalAlign: "top" };
const btn: React.CSSProperties = {
  padding: "4px 10px", marginRight: 6, border: "1px solid #D0D0C8",
  background: "white", borderRadius: 4, fontSize: 12, cursor: "pointer",
};
