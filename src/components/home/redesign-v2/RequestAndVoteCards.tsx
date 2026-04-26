/**
 * ForThePeople.in — Your District. Your Data. Your Right.
 * © 2026 Jayanth M B. MIT License with Attribution.
 * https://github.com/jayanthmb14/forthepeople
 *
 * Session 11 redesign — Request-district + Vote-on-features dual cards.
 *
 * LEFT: text input → POST /api/district-request (existing endpoint).
 *       Below: shows top requested district from GET /api/district-request.
 *
 * RIGHT: top 4 features by votes from GET /api/features (existing endpoint).
 *        Total vote count + idea count are derived from the same payload.
 *        CTA → /<locale>/features.
 */

"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

// ── /api/district-request shapes ──
interface DistrictRequestRow {
  id: string;
  stateName: string;
  districtName: string;
  requestCount: number;
}

// ── /api/features shape ──
interface FeatureRow {
  id: string;
  title: string;
  description?: string;
  category?: string;
  icon?: string;
  votes: number;
  status?: string;
  priority?: number;
}

export interface RequestAndVoteCardsProps {
  locale: string;
}

export default function RequestAndVoteCards({ locale }: RequestAndVoteCardsProps) {
  const [topRequest, setTopRequest] = useState<DistrictRequestRow | null>(null);
  const [features, setFeatures] = useState<FeatureRow[] | null>(null);

  // Form state
  const [draftDistrict, setDraftDistrict] = useState("");
  const [draftState, setDraftState] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitMsg, setSubmitMsg] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const [reqRes, feaRes] = await Promise.all([
          fetch("/api/district-request"),
          fetch("/api/features"),
        ]);

        if (reqRes.ok) {
          const data = (await reqRes.json()) as { top?: DistrictRequestRow[] };
          if (!cancelled && data.top && data.top.length > 0) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setTopRequest(data.top[0]);
          }
        }

        if (feaRes.ok) {
          const data = (await feaRes.json()) as { features?: FeatureRow[] };
          if (!cancelled) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setFeatures(data.features ?? []);
          }
        }
      } catch {
        /* ignore */
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  async function submitRequest(e: React.FormEvent) {
    e.preventDefault();
    if (!draftDistrict.trim() || submitting) return;
    setSubmitting(true);
    setSubmitMsg(null);
    try {
      const res = await fetch("/api/district-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          stateName: draftState.trim() || "Unspecified",
          districtName: draftDistrict.trim(),
        }),
      });
      if (res.ok) {
        setSubmitMsg(`✓ Request recorded for ${draftDistrict}.`);
        setDraftDistrict("");
        setDraftState("");
      } else {
        setSubmitMsg("Couldn't submit just now — try again in a moment.");
      }
    } catch {
      setSubmitMsg("Couldn't submit just now — try again in a moment.");
    } finally {
      setSubmitting(false);
    }
  }

  const totalVotes = (features ?? []).reduce((s, f) => s + (f.votes ?? 0), 0);
  const totalIdeas = features?.length ?? 0;
  const top4 = (features ?? []).slice(0, 4);
  const more = Math.max(0, totalIdeas - 4);

  return (
    <section
      aria-labelledby="participation-heading"
      style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 16px" }}
    >
      <h2 id="participation-heading" className="sr-only">
        Participate
      </h2>

      <style>{`
        .ftp-rv-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }
        @media (max-width: 767px) {
          .ftp-rv-grid { grid-template-columns: 1fr !important; }
        }
        .ftp-rv-card {
          background: #FFFFFF;
          border: 1px solid #E8E8E4;
          border-radius: 14px;
          padding: 20px;
          display: flex;
          flex-direction: column;
        }
        .ftp-rv-input {
          width: 100%;
          padding: 10px 12px;
          font-size: 14px;
          border: 1px solid #E5E7EB;
          border-radius: 10px;
          outline: none;
          background: #FAFAF8;
        }
        .ftp-rv-input:focus { border-color: #2563EB; background: #FFFFFF; }
        .ftp-rv-btn {
          padding: 10px 16px;
          border-radius: 999px;
          color: #FFFFFF;
          font-weight: 600;
          font-size: 13px;
          border: none;
          cursor: pointer;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }
      `}</style>

      <div className="ftp-rv-grid">
        {/* ── LEFT — Don't see your district? ── */}
        <form className="ftp-rv-card" onSubmit={submitRequest}>
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: "#9B9B9B",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
            }}
          >
            🗳️ Don&apos;t see your district?
          </div>
          <h3
            style={{
              margin: "6px 0 12px",
              fontSize: 18,
              fontWeight: 700,
              color: "#1A1A1A",
            }}
          >
            Request it
          </h3>
          <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
            <input
              type="text"
              placeholder="District…"
              value={draftDistrict}
              onChange={(e) => setDraftDistrict(e.target.value)}
              aria-label="District name"
              className="ftp-rv-input"
              style={{ flex: 2 }}
            />
            <input
              type="text"
              placeholder="State…"
              value={draftState}
              onChange={(e) => setDraftState(e.target.value)}
              aria-label="State name"
              className="ftp-rv-input"
              style={{ flex: 1 }}
            />
          </div>
          <button
            type="submit"
            disabled={!draftDistrict.trim() || submitting}
            className="ftp-rv-btn"
            style={{
              background: "#2563EB",
              alignSelf: "flex-start",
              opacity: submitting || !draftDistrict.trim() ? 0.5 : 1,
            }}
          >
            {submitting ? "Sending…" : "Request →"}
          </button>
          {submitMsg && (
            <div
              role="status"
              style={{
                marginTop: 10,
                fontSize: 12,
                color: submitMsg.startsWith("✓") ? "#166534" : "#9B9B9B",
              }}
            >
              {submitMsg}
            </div>
          )}
          <div style={{ marginTop: 14, fontSize: 12, color: "#6B7280" }}>
            {topRequest ? (
              <>
                Top:{" "}
                <strong style={{ color: "#1A1A1A" }}>{topRequest.districtName}</strong>{" "}
                · {topRequest.requestCount} vote{topRequest.requestCount === 1 ? "" : "s"}
              </>
            ) : (
              <span style={{ color: "#9B9B9B" }}>Be the first to request a district.</span>
            )}
          </div>
        </form>

        {/* ── RIGHT — Vote on features ── */}
        <div className="ftp-rv-card">
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: "#9B9B9B",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
            }}
          >
            ▲ Vote on next features
          </div>
          <h3
            style={{
              margin: "6px 0 4px",
              fontSize: 18,
              fontWeight: 700,
              color: "#1A1A1A",
            }}
          >
            What should we build next?
          </h3>
          <div style={{ fontSize: 12, color: "#6B7280" }}>
            {features === null
              ? "Loading…"
              : `${totalVotes.toLocaleString("en-IN")} votes across ${totalIdeas} idea${totalIdeas === 1 ? "" : "s"}`}
          </div>

          <ul
            style={{
              listStyle: "none",
              padding: 0,
              margin: "14px 0",
              display: "flex",
              flexDirection: "column",
              gap: 6,
              flex: 1,
            }}
          >
            {top4.map((f) => (
              <li
                key={f.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  fontSize: 13,
                  color: "#1A1A1A",
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-mono, ui-monospace, monospace)",
                    fontVariantNumeric: "tabular-nums",
                    color: "#6E59C0",
                    fontWeight: 600,
                    minWidth: 56,
                  }}
                >
                  ▲ {f.votes.toLocaleString("en-IN")}
                </span>
                <span
                  style={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                  title={f.title}
                >
                  {f.title}
                </span>
              </li>
            ))}
            {features !== null && top4.length === 0 && (
              <li style={{ fontSize: 12, color: "#9B9B9B" }}>
                No feature ideas seeded yet.
              </li>
            )}
          </ul>

          {more > 0 && (
            <div style={{ fontSize: 12, color: "#6B7280", marginBottom: 10 }}>
              + {more} more
            </div>
          )}

          <Link
            href={`/${locale}/features`}
            className="ftp-rv-btn"
            style={{ background: "#6E59C0", alignSelf: "flex-start" }}
          >
            Vote on features →
          </Link>
        </div>
      </div>
    </section>
  );
}
