/**
 * ForThePeople.in — Your District. Your Data. Your Right.
 * © 2026 Jayanth M B. MIT License with Attribution.
 * https://github.com/jayanthmb14/forthepeople
 *
 * Session 13 v8 Phase J (Fix #16) — purple gradient card.
 *
 * Production-pattern violet card showing the top 3 feature ideas by vote
 * count + a primary CTA to the full /<locale>/features page. Pulls live
 * from the existing /api/features endpoint.
 *
 * Visual: violet gradient bg, oversized 🗳️ watermark, inner white rows
 * with hover-translate, violet vote-count chip, violet primary button.
 */

"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

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
          padding: 28px;
          position: relative;
          overflow: hidden;
        }
        .ftp-vote-features::before {
          content: "🗳️";
          position: absolute;
          top: -10px;
          right: -10px;
          font-size: 96px;
          opacity: 0.08;
          pointer-events: none;
          line-height: 1;
        }
        .ftp-vote-features-header {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 18px;
          font-weight: 600;
          color: #3C3489;
          margin: 0 0 4px;
        }
        .ftp-vote-features-subtitle {
          font-size: 13px;
          color: #6E59C0;
          margin-bottom: 16px;
        }
        .ftp-vote-features-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-bottom: 16px;
          padding: 0;
          list-style: none;
        }
        .ftp-vote-feature-row {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 14px;
          background: #FFFFFF;
          border-radius: 8px;
          font-size: 13px;
          color: #1A1A1A;
          transition: transform 150ms ease;
          border: 0.5px solid rgba(110, 89, 192, 0.10);
        }
        .ftp-vote-feature-row:hover { transform: translateX(4px); }
        .ftp-vote-feature-count {
          background: #6E59C0;
          color: #FFFFFF;
          padding: 2px 8px;
          border-radius: 4px;
          font-size: 11px;
          font-weight: 700;
          font-variant-numeric: tabular-nums;
          min-width: 44px;
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
          background: #6E59C0;
          color: #FFFFFF;
          padding: 10px 18px;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 500;
          text-decoration: none;
          transition: background 150ms ease, transform 200ms ease;
        }
        .ftp-vote-features-cta:hover {
          background: #5B47A8;
          transform: scale(1.02);
        }
        @media (prefers-reduced-motion: reduce) {
          .ftp-vote-feature-row,
          .ftp-vote-features-cta { transition: none; }
          .ftp-vote-feature-row:hover { transform: none; }
          .ftp-vote-features-cta:hover { transform: none; }
        }
      `}</style>

      <div className="ftp-section-inner">
        <h2 id="features-heading" className="sr-only">
          Help shape what&apos;s next
        </h2>

        <div className="ftp-vote-features">
          <div className="ftp-vote-features-header">
            <span aria-hidden="true">🗳️</span>
            Help shape what&apos;s next
          </div>
          <div className="ftp-vote-features-subtitle">
            {features === null
              ? "Loading…"
              : `${totalVotes.toLocaleString("en-IN")} vote${totalVotes === 1 ? "" : "s"} across ${totalIdeas} idea${totalIdeas === 1 ? "" : "s"}`}
          </div>

          {top3.length > 0 && (
            <ul className="ftp-vote-features-list">
              {top3.map((f) => (
                <li key={f.id} className="ftp-vote-feature-row">
                  <span className="ftp-vote-feature-count">
                    ▲ {f.votes.toLocaleString("en-IN")}
                  </span>
                  <span className="ftp-vote-feature-title">{f.title}</span>
                </li>
              ))}
            </ul>
          )}

          <Link href={`/${locale}/features`} className="ftp-vote-features-cta">
            Vote on features →
          </Link>
        </div>
      </div>
    </section>
  );
}
