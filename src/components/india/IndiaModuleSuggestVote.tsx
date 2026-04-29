/**
 * ForThePeople.in — Your District. Your Data. Your Right.
 * © 2026 Jayanth M B. MIT License with Attribution.
 *
 * Vote-for-the-next-India-module widget.
 *
 * Mirrors the existing NextDistrictLeaderboard chrome (file 31 §16):
 * top 3 suggestions ordered by voteCount, vote button per row, "Suggest
 * a module" inline form below. Anchor #india-vote so coming-soon cards
 * can deep-link with a `data-prefill` param to scroll here and prefill
 * the form.
 *
 * The suggestion + vote APIs return 503 when the schema isn't yet
 * db-pushed. We surface that as a one-line warning instead of a stack
 * trace, so the widget renders + form is visible but submit + vote
 * report "coming soon" until Jayanth applies the schema.
 */

"use client";

import { useEffect, useRef, useState } from "react";
import { INDIA_DESIGN } from "@/lib/india/india-design";

interface Suggestion {
  id: string;
  title: string;
  description: string | null;
  category: string | null;
  voteCount: number;
  status: string;
  createdAt: string;
}

const TITLE_MAX = 80;
const DESC_MAX = 200;

export default function IndiaModuleSuggestVote() {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [dbPending, setDbPending] = useState(false);
  const [loading, setLoading] = useState(true);
  const [voting, setVoting] = useState<string | null>(null);
  const [votedIds, setVotedIds] = useState<Set<string>>(new Set());
  const [voteError, setVoteError] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{
    kind: "success" | "error";
    text: string;
  } | null>(null);

  const titleInputRef = useRef<HTMLInputElement>(null);

  // Initial load
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/india/suggestions");
        const data = await res.json();
        if (cancelled) return;
        if (res.status === 503) {
          setDbPending(true);
          setSuggestions([]);
        } else if (res.ok && Array.isArray(data.suggestions)) {
          setSuggestions(data.suggestions);
        }
      } catch {
        /* network down — leave list empty */
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Listen for "Vote to prioritise →" clicks on Coming Soon cards.
  useEffect(() => {
    function onClick(e: MouseEvent) {
      const target = e.target as HTMLElement | null;
      const link = target?.closest('[data-prefill]') as HTMLElement | null;
      if (!link) return;
      const prefill = link.getAttribute("data-prefill");
      if (!prefill) return;
      e.preventDefault();
      setTitle(prefill.slice(0, TITLE_MAX));
      // Scroll into view + focus
      const widget = document.getElementById("india-vote");
      if (widget) widget.scrollIntoView({ behavior: "smooth", block: "start" });
      setTimeout(() => titleInputRef.current?.focus(), 350);
    }
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  async function castVote(id: string) {
    if (voting || votedIds.has(id)) return;
    setVoting(id);
    setVoteError(null);

    // Optimistic increment
    setSuggestions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, voteCount: s.voteCount + 1 } : s)),
    );

    try {
      const res = await fetch(`/api/india/suggestions/${id}/vote`, {
        method: "POST",
      });
      const data = await res.json();
      if (res.status === 503) {
        setDbPending(true);
        setVoteError("Voting is queued — coming online once the schema is applied.");
        // Roll back optimistic
        setSuggestions((prev) =>
          prev.map((s) => (s.id === id ? { ...s, voteCount: s.voteCount - 1 } : s)),
        );
      } else if (res.status === 409) {
        setVoteError("You've already voted on this today.");
        // Reconcile with server count
        if (typeof data.voteCount === "number") {
          setSuggestions((prev) =>
            prev.map((s) => (s.id === id ? { ...s, voteCount: data.voteCount } : s)),
          );
        }
        setVotedIds((prev) => new Set(prev).add(id));
      } else if (res.ok) {
        setVotedIds((prev) => new Set(prev).add(id));
        if (typeof data.voteCount === "number") {
          setSuggestions((prev) =>
            prev.map((s) => (s.id === id ? { ...s, voteCount: data.voteCount } : s)),
          );
        }
      } else {
        setVoteError(data.error ?? "Vote failed.");
        setSuggestions((prev) =>
          prev.map((s) => (s.id === id ? { ...s, voteCount: s.voteCount - 1 } : s)),
        );
      }
    } catch {
      setVoteError("Network error — please retry.");
      setSuggestions((prev) =>
        prev.map((s) => (s.id === id ? { ...s, voteCount: s.voteCount - 1 } : s)),
      );
    } finally {
      setVoting(null);
    }
  }

  async function submitSuggestion(e: React.FormEvent) {
    e.preventDefault();
    if (submitting) return;
    setSubmitMessage(null);

    const trimmed = title.trim();
    if (trimmed.length < 3) {
      setSubmitMessage({ kind: "error", text: "Title must be at least 3 characters." });
      return;
    }
    if (trimmed.length > TITLE_MAX) {
      setSubmitMessage({ kind: "error", text: `Title must be ≤ ${TITLE_MAX} characters.` });
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/india/suggestions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: trimmed,
          description: description.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (res.status === 503) {
        setDbPending(true);
        setSubmitMessage({
          kind: "error",
          text: "Submissions queued — coming online once the schema is applied.",
        });
      } else if (res.ok && data.suggestion) {
        setSuggestions((prev) => [...prev, data.suggestion]);
        setSubmitMessage({
          kind: "success",
          text: "Thanks — your idea is now visible to others to vote on.",
        });
        setTitle("");
        setDescription("");
      } else {
        setSubmitMessage({
          kind: "error",
          text: data.error ?? "Something went wrong — try again.",
        });
      }
    } catch {
      setSubmitMessage({ kind: "error", text: "Network error — please retry." });
    } finally {
      setSubmitting(false);
    }
  }

  const top3 = [...suggestions]
    .sort((a, b) => b.voteCount - a.voteCount)
    .slice(0, 3);

  return (
    <section
      id="india-vote"
      style={{
        padding: "32px 16px 28px",
        scrollMarginTop: INDIA_DESIGN.headerOffsetPx + 56,
      }}
    >
      <div style={{ maxWidth: 760, margin: "0 auto" }}>
        <div
          style={{
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.07em",
            textTransform: "uppercase",
            color: INDIA_DESIGN.textFaint,
            display: "flex",
            alignItems: "center",
            gap: 6,
            marginBottom: 6,
          }}
        >
          <span aria-hidden="true">🗳️</span> Vote for the next India module
        </div>
        <p style={{ fontSize: 13, color: INDIA_DESIGN.textMuted, margin: "0 0 14px" }}>
          Help us decide what to build next.
        </p>

        {dbPending ? (
          <div
            role="status"
            style={{
              padding: "10px 12px",
              background: INDIA_DESIGN.amberStrip,
              border: `1px solid ${INDIA_DESIGN.amberStripBorder}`,
              borderRadius: 8,
              fontSize: 12,
              color: "#78350F",
              marginBottom: 14,
            }}
          >
            Voting infrastructure is queued. Backend goes live once
            <code style={{ margin: "0 4px", padding: "1px 4px", background: "#FEF3C7", borderRadius: 3 }}>
              prisma db push
            </code>
            applies the schema. Submissions and votes will land afterwards.
          </div>
        ) : null}

        {/* Top 3 list */}
        <div
          style={{
            background: INDIA_DESIGN.bgCard,
            border: `1px solid ${INDIA_DESIGN.border}`,
            borderRadius: 14,
            overflow: "hidden",
          }}
        >
          {loading ? (
            <div style={{ padding: 14, fontSize: 12, color: INDIA_DESIGN.textFaint }}>
              Loading suggestions…
            </div>
          ) : top3.length === 0 ? (
            <div style={{ padding: 18, fontSize: 13, color: INDIA_DESIGN.textMuted }}>
              No suggestions yet. Be the first — drop your idea below.
            </div>
          ) : (
            top3.map((s, idx) => (
              <div
                key={s.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "12px 16px",
                  borderBottom: idx === top3.length - 1 ? "none" : `1px solid ${INDIA_DESIGN.border}`,
                  minHeight: 56,
                }}
              >
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: INDIA_DESIGN.textMuted,
                    fontFamily: INDIA_DESIGN.fontMono,
                    width: 18,
                    flexShrink: 0,
                  }}
                >
                  #{idx + 1}
                </span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: 14,
                      fontWeight: 600,
                      color: INDIA_DESIGN.textPrimary,
                      lineHeight: 1.3,
                    }}
                  >
                    {s.title}
                  </div>
                  {s.description ? (
                    <div
                      style={{
                        fontSize: 11,
                        color: INDIA_DESIGN.textFaint,
                        marginTop: 2,
                        lineHeight: 1.4,
                      }}
                    >
                      {s.description}
                    </div>
                  ) : null}
                </div>
                <button
                  type="button"
                  onClick={() => castVote(s.id)}
                  disabled={voting === s.id || votedIds.has(s.id) || dbPending}
                  style={{
                    flexShrink: 0,
                    fontSize: 12,
                    fontWeight: 600,
                    fontFamily: INDIA_DESIGN.fontMono,
                    padding: "6px 12px",
                    minHeight: 32,
                    borderRadius: 8,
                    border: `1px solid ${votedIds.has(s.id) ? "#A7F3D0" : INDIA_DESIGN.border}`,
                    background: votedIds.has(s.id) ? "#ECFDF5" : INDIA_DESIGN.bgCard,
                    color: votedIds.has(s.id) ? "#065F46" : INDIA_DESIGN.accentBlue,
                    cursor: voting === s.id || votedIds.has(s.id) || dbPending ? "default" : "pointer",
                    opacity: voting === s.id ? 0.6 : 1,
                  }}
                >
                  {votedIds.has(s.id) ? "✓ Voted" : `▲ ${s.voteCount.toLocaleString("en-IN")}`}
                </button>
              </div>
            ))
          )}
        </div>

        {voteError ? (
          <div
            role="alert"
            style={{
              fontSize: 12,
              color: "#B91C1C",
              marginTop: 8,
              padding: "6px 10px",
              background: "#FEF2F2",
              border: "1px solid #FECACA",
              borderRadius: 6,
            }}
          >
            {voteError}
          </div>
        ) : null}

        {/* Suggestion form */}
        <form
          onSubmit={submitSuggestion}
          style={{
            marginTop: 16,
            background: INDIA_DESIGN.bgCard,
            border: `1px solid ${INDIA_DESIGN.border}`,
            borderRadius: 14,
            padding: "14px 16px",
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}
        >
          <label
            htmlFor="india-suggest-title"
            style={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              color: INDIA_DESIGN.textFaint,
            }}
          >
            Suggest a module
          </label>
          <input
            id="india-suggest-title"
            ref={titleInputRef}
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value.slice(0, TITLE_MAX))}
            placeholder="e.g. Mining Royalty Tracker"
            maxLength={TITLE_MAX}
            style={{
              fontSize: 14,
              padding: "8px 10px",
              borderRadius: 8,
              border: `1px solid ${INDIA_DESIGN.border}`,
              background: INDIA_DESIGN.bgPage,
              color: INDIA_DESIGN.textPrimary,
              minHeight: 36,
            }}
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value.slice(0, DESC_MAX))}
            placeholder="One-line description (optional)"
            rows={2}
            maxLength={DESC_MAX}
            style={{
              fontSize: 12.5,
              padding: "8px 10px",
              borderRadius: 8,
              border: `1px solid ${INDIA_DESIGN.border}`,
              background: INDIA_DESIGN.bgPage,
              color: INDIA_DESIGN.textPrimary,
              fontFamily: "inherit",
              resize: "vertical",
              minHeight: 56,
            }}
          />
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
              flexWrap: "wrap",
            }}
          >
            <span style={{ fontSize: 11, color: INDIA_DESIGN.textFaint }}>
              {title.length} / {TITLE_MAX}
              {description ? `  ·  ${description.length} / ${DESC_MAX}` : null}
            </span>
            <button
              type="submit"
              disabled={submitting || title.trim().length < 3}
              style={{
                background: INDIA_DESIGN.accentBlue,
                color: "#FFFFFF",
                border: "none",
                borderRadius: 8,
                padding: "8px 16px",
                fontSize: 13,
                fontWeight: 600,
                cursor: submitting || title.trim().length < 3 ? "default" : "pointer",
                opacity: submitting || title.trim().length < 3 ? 0.55 : 1,
                minHeight: 36,
              }}
            >
              {submitting ? "Submitting…" : "Submit suggestion"}
            </button>
          </div>
          {submitMessage ? (
            <div
              role={submitMessage.kind === "error" ? "alert" : "status"}
              style={{
                fontSize: 12,
                color: submitMessage.kind === "error" ? "#B91C1C" : "#065F46",
                background:
                  submitMessage.kind === "error" ? "#FEF2F2" : "#ECFDF5",
                border: `1px solid ${
                  submitMessage.kind === "error" ? "#FECACA" : "#A7F3D0"
                }`,
                padding: "6px 10px",
                borderRadius: 6,
              }}
            >
              {submitMessage.text}
            </div>
          ) : null}
        </form>
      </div>
    </section>
  );
}
