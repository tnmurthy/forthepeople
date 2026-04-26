/**
 * ForThePeople.in — Your District. Your Data. Your Right.
 * © 2026 Jayanth M B. MIT License with Attribution.
 * https://github.com/jayanthmb14/forthepeople
 *
 * Session 16 v10 Phase J (Fix #11b) — combined Vote + Share Your Idea card.
 *
 * Two-column purple gradient card:
 *   LEFT  — top 3 voted features (links to /features)
 *   RIGHT — Share-Your-Idea form (existing SuggestionForm component,
 *           POSTs to existing /api/suggestions endpoint)
 *
 * The /features page is now voting-only again (Session 16 Phase J Fix #11);
 * idea submission lives here on the homepage so visitors can shape the
 * roadmap without navigating away.
 */

"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import SuggestionForm from "@/components/features/SuggestionForm";

interface FeatureRow {
  id: string;
  title: string;
  votes: number;
}

export interface VoteFeaturesCTAProps {
  locale: string;
}

export default function VoteFeaturesCTA({ locale }: VoteFeaturesCTAProps) {
  const [features, setFeatures] = useState<FeatureRow[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch("/api/features");
        if (!res.ok) {
          if (!cancelled) setFeatures([]);
          return;
        }
        const data = (await res.json()) as { features?: FeatureRow[] };
        if (!cancelled) setFeatures(data.features ?? []);
      } catch {
        if (!cancelled) setFeatures([]);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const totalVotes = (features ?? []).reduce((s, f) => s + (f.votes ?? 0), 0);
  const totalIdeas = features?.length ?? 0;
  const top3 = (features ?? []).slice(0, 3);

  return (
    <section
      aria-labelledby="features-heading"
      className="ftp-section-wrap ftp-vote-wrap"
      style={{ borderTop: "1px solid #F0F0EC" }}
    >
      <style>{`
        .ftp-vote-features {
          background: linear-gradient(135deg, #EEEDFE 0%, #F4F3FE 100%);
          border: 1px solid #DDD6FE;
          border-radius: 16px;
          padding: 24px 28px;
          position: relative;
          overflow: hidden;
        }
        .ftp-vote-features::before {
          content: "🗳️";
          position: absolute;
          top: -10px;
          right: -10px;
          font-size: 96px;
          opacity: 0.06;
          pointer-events: none;
          line-height: 1;
        }
        .ftp-vote-features-header {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          margin-bottom: 20px;
          gap: 12px;
          flex-wrap: wrap;
        }
        .ftp-vote-features-h2 {
          margin: 0;
          font-size: 18px;
          font-weight: 700;
          color: #3C3489;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .ftp-vote-features-stats {
          font-size: 13px;
          color: #6E59C0;
        }
        .ftp-vote-features-stats strong { color: #3C3489; }

        /* Session 16 v10 Phase J: 2-col grid (vote left, share-idea right) */
        .ftp-features-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
        }
        .ftp-features-subhead {
          font-size: 13px;
          font-weight: 700;
          color: #3C3489;
          margin: 0 0 10px;
        }
        .ftp-features-share-sub {
          font-size: 11px;
          color: #6E59C0;
          margin: 0 0 12px;
        }

        .ftp-vote-features-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin: 0 0 12px;
          padding: 0;
          list-style: none;
        }
        .ftp-vote-feature-row {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 12px;
          background: #FFFFFF;
          border-radius: 8px;
          font-size: 12px;
          color: #1A1A1A;
          text-decoration: none;
          border: 1px solid #DDD6FE;
          transition: transform 150ms ease, border-color 150ms ease;
        }
        .ftp-vote-feature-row:hover {
          transform: translateX(2px);
          border-color: #6E59C0;
        }
        .ftp-vote-feature-count {
          background: #6E59C0;
          color: #FFFFFF;
          padding: 2px 8px;
          border-radius: 4px;
          font-size: 11px;
          font-weight: 700;
          font-variant-numeric: tabular-nums;
          min-width: 50px;
          text-align: center;
        }
        .ftp-vote-feature-title {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          flex: 1;
        }
        .ftp-vote-features-cta {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 12px;
          font-weight: 600;
          color: #6E59C0;
          text-decoration: none;
        }
        .ftp-vote-features-cta:hover {
          text-decoration: underline;
          text-underline-offset: 3px;
        }

        @media (max-width: 767px) {
          .ftp-features-grid { grid-template-columns: 1fr; gap: 16px; }
          .ftp-vote-features { padding: 20px; }
          .ftp-vote-features-header { flex-direction: column; align-items: flex-start; gap: 4px; }
        }
        @media (prefers-reduced-motion: reduce) {
          .ftp-vote-feature-row { transition: none; }
          .ftp-vote-feature-row:hover { transform: none; }
        }
      `}</style>

      <div className="ftp-section-inner">
        <h2 id="features-heading" className="sr-only">
          Help shape what&apos;s next
        </h2>

        <div className="ftp-vote-features">
          <div className="ftp-vote-features-header">
            <h3 className="ftp-vote-features-h2">
              <span aria-hidden="true">🗳️</span>
              Help shape what&apos;s next
            </h3>
            <span className="ftp-vote-features-stats">
              {features === null ? (
                "Loading…"
              ) : (
                <>
                  <strong>{totalVotes.toLocaleString("en-IN")}</strong>{" "}
                  vote{totalVotes === 1 ? "" : "s"} across{" "}
                  <strong>{totalIdeas}</strong>{" "}
                  idea{totalIdeas === 1 ? "" : "s"}
                </>
              )}
            </span>
          </div>

          <div className="ftp-features-grid">
            {/* LEFT — top 3 voted */}
            <div>
              <h4 className="ftp-features-subhead">Top voted</h4>
              {top3.length > 0 ? (
                <ul className="ftp-vote-features-list">
                  {top3.map((f) => (
                    <li key={f.id}>
                      <Link href={`/${locale}/features`} className="ftp-vote-feature-row">
                        <span className="ftp-vote-feature-count">
                          ▲ {f.votes.toLocaleString("en-IN")}
                        </span>
                        <span className="ftp-vote-feature-title">{f.title}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <div style={{ fontSize: 12, color: "#6E59C0", marginBottom: 12 }}>
                  No ideas yet — be the first.
                </div>
              )}
              <Link href={`/${locale}/features`} className="ftp-vote-features-cta">
                Vote on all features →
              </Link>
            </div>

            {/* RIGHT — share your idea (existing SuggestionForm component) */}
            <div>
              <h4 className="ftp-features-subhead">💡 Share your idea</h4>
              <p className="ftp-features-share-sub">
                Have a feature in mind that&apos;s not listed? Suggest it.
              </p>
              <SuggestionForm />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
