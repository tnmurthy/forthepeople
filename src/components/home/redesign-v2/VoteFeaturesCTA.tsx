/**
 * ForThePeople.in — Your District. Your Data. Your Right.
 * © 2026 Jayanth M B. MIT License with Attribution.
 * https://github.com/jayanthmb14/forthepeople
 *
 * Session 11.6 v6 — replaces RequestAndVoteCards right card.
 *
 * White card with the top 3 feature ideas by vote count + a CTA to the
 * full /<locale>/features page. Pulls live from /api/features (same
 * endpoint /features uses).
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
      style={{ background: "#FAFAF8", borderTop: "1px solid #F0F0EC" }}
    >
      <style>{`
        .ftp-vote-card {
          background: #FFFFFF;
          border: 0.5px solid #E5E7EB;
          border-radius: 12px;
          padding: 20px;
          max-width: 640px;
        }
        .ftp-vote-header {
          font-size: 15px;
          font-weight: 600;
          color: #1A1A1A;
          margin: 0 0 6px;
        }
        .ftp-vote-subtitle {
          font-size: 11px;
          color: #6B7280;
          margin-bottom: 14px;
        }
        .ftp-vote-list {
          font-size: 13px;
          color: #4B5563;
          line-height: 1.85;
          margin: 0 0 14px;
          padding: 0;
          list-style: none;
        }
        .ftp-vote-list li { display: flex; align-items: center; gap: 10px; }
        .ftp-vote-count {
          color: #6E59C0;
          font-weight: 600;
          font-family: var(--font-mono, ui-monospace, monospace);
          font-variant-numeric: tabular-nums;
          min-width: 56px;
        }
        .ftp-vote-cta {
          display: inline-block;
          font-size: 13px;
          color: #6E59C0;
          font-weight: 500;
          text-decoration: none;
        }
        .ftp-vote-cta:hover { text-decoration: underline; }
      `}</style>

      <div className="ftp-section-inner">
        <h2 id="features-heading" className="sr-only">
          Help shape what&apos;s next
        </h2>

        <div className="ftp-vote-card">
          <h3 className="ftp-vote-header">Help shape what&apos;s next</h3>
          <div className="ftp-vote-subtitle">
            {features === null
              ? "Loading…"
              : `${totalVotes.toLocaleString("en-IN")} vote${totalVotes === 1 ? "" : "s"} across ${totalIdeas} idea${totalIdeas === 1 ? "" : "s"}`}
          </div>

          {top3.length > 0 && (
            <ul className="ftp-vote-list">
              {top3.map((f) => (
                <li key={f.id}>
                  <span className="ftp-vote-count">
                    ▲ {f.votes.toLocaleString("en-IN")}
                  </span>
                  <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {f.title}
                  </span>
                </li>
              ))}
            </ul>
          )}

          <Link href={`/${locale}/features`} className="ftp-vote-cta">
            Vote on features →
          </Link>
        </div>
      </div>
    </section>
  );
}
