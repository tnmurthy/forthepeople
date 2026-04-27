"use client";

/**
 * Citizen suggestion form — used on /features (Share Your Idea tab) AND in
 * the floating CTA modal. POSTs to /api/suggestions.
 */

import { useMemo, useState } from "react";
import { validateContributorName } from "@/lib/validators/contributor-name";

const CATEGORIES = ["Feature", "Bug", "Data", "UX", "Other"] as const;

export default function SuggestionForm({ onSuccess }: { onSuccess?: () => void }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>("Feature");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const nameCheck = useMemo(() => validateContributorName(name), [name]);
  const nameError = name.length > 0 && !nameCheck.ok ? nameCheck.reason : null;
  const titleTrim = title.trim();
  const bodyTrim = body.trim();
  const titleOk = titleTrim.length >= 5 && titleTrim.length <= 120;
  const bodyOk = bodyTrim.length >= 20 && bodyTrim.length <= 2000;
  const canSubmit = nameCheck.ok && titleOk && bodyOk && !submitting;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/suggestions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email: email || undefined, category, title, body }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error ?? `HTTP ${res.status}`);
      }
      setSuccess(true);
      setName(""); setEmail(""); setTitle(""); setBody(""); setCategory("Feature");
      onSuccess?.();
      setTimeout(() => setSuccess(false), 4000);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Submit failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {success && (
        <div style={{
          padding: "10px 14px", background: "#ECFDF5", border: "1px solid #A7F3D0",
          color: "#065F46", borderRadius: 8, fontSize: 13,
        }}>
          Thanks! Your suggestion is pending review.
        </div>
      )}
      {error && (
        <div style={{
          padding: "10px 14px", background: "#FEF2F2", border: "1px solid #FECACA",
          color: "#991B1B", borderRadius: 8, fontSize: 13,
        }}>
          {error}
        </div>
      )}

      <div>
        <label style={label}>Your name *</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={40}
          required
          style={{ ...input, borderColor: nameError ? "#D4523A" : "#E8E8E4" }}
        />
        {nameError && <div style={hint}>{nameError}</div>}
      </div>

      <div>
        <label style={label}>Email (optional — for us to follow up)</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          maxLength={120}
          style={input}
        />
      </div>

      <div>
        <label style={label}>Category</label>
        {/* Session 19 v13 Phase G (Fix #7): custom-styled select.
            appearance:none kills the OS default chevron + bg; the
            background-image data-URL renders our own chevron. The
            opened popover is OS-controlled (cross-browser limit)
            but the closed state now matches the rest of the form. */}
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value as (typeof CATEGORIES)[number])}
          className="ftp-suggest-select"
          style={{
            ...input,
            cursor: "pointer",
            appearance: "none",
            WebkitAppearance: "none",
            MozAppearance: "none",
            paddingRight: 36,
            backgroundImage:
              "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'><path d='M3 4.5L6 7.5L9 4.5' stroke='%236B7280' stroke-width='1.5' fill='none' stroke-linecap='round' stroke-linejoin='round'/></svg>\")",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "right 12px center",
            backgroundSize: "12px",
          }}
        >
          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      <div>
        <label style={label}>Title (5-120 chars) *</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={120}
          required
          style={input}
        />
        <div style={{ ...hint, color: titleTrim.length > 0 && !titleOk ? "#D4523A" : "#9B9B9B" }}>
          {titleTrim.length} / 120
        </div>
      </div>

      <div>
        <label style={label}>Details (20-2000 chars) *</label>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={6}
          maxLength={2000}
          required
          style={{ ...input, resize: "vertical", minHeight: 100, fontFamily: "inherit" }}
          placeholder="What's the idea? Who benefits? Anything we should know?"
        />
        <div style={{ ...hint, color: bodyTrim.length > 0 && !bodyOk ? "#D4523A" : "#9B9B9B" }}>
          {bodyTrim.length} / 2000
        </div>
      </div>

      <button
        type="submit"
        disabled={!canSubmit}
        style={{
          padding: "10px 18px",
          borderRadius: 8,
          border: "none",
          background: canSubmit ? "#2563EB" : "#CBD5E1",
          color: "white",
          fontWeight: 600,
          fontSize: 14,
          cursor: canSubmit ? "pointer" : "not-allowed",
          minHeight: 42,
        }}
      >
        {submitting ? "Submitting…" : "💬 Share your idea"}
      </button>
      <div style={{ fontSize: 11, color: "#9B9B9B" }}>
        Your submission is reviewed before being shown publicly. Limit: 3 submissions per hour.
      </div>
    </form>
  );
}

const label: React.CSSProperties = { fontSize: 12, fontWeight: 600, color: "#4B4B4B", marginBottom: 4, display: "block" };
const input: React.CSSProperties = {
  width: "100%", padding: "9px 12px", border: "1px solid #E8E8E4",
  borderRadius: 8, fontSize: 13, background: "#FAFAF8", outline: "none",
};
const hint: React.CSSProperties = { fontSize: 11, color: "#9B9B9B", marginTop: 2 };
