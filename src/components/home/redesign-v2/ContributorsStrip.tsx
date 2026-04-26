/**
 * ForThePeople.in — Your District. Your Data. Your Right.
 * © 2026 Jayanth M B. MIT License with Attribution.
 * https://github.com/jayanthmb14/forthepeople
 *
 * Session 11.6 v6 — replaces FoundingPatronCard + SupporterMarquee +
 * PricingTiers (homepage placement only).
 *
 * One subtle gray strip:
 *   "Backed by N supporters"
 *   <flat list of names separated by ·, first 9-10, then "+ X more">
 *   "View all supporters & contribute →"
 *
 * No tier badges, no marquee, no pricing cards. Pricing tiers live on
 * /support, which we link to.
 *
 * Founding Builder (currently Micah Alex) appears first in the list as
 * the natural top-supporter ordering — no special card or badge.
 *
 * Data: same /api/payment/contributors endpoint that SupporterMarquee
 * used. No new endpoints, no schema changes.
 */

"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface ContributorItem {
  displayName: string;
  tierLabel: string;
  tier: string | null;
  message: string | null;
  timeAgo: string;
}

const VISIBLE_COUNT = 10;
const FOUNDING_TIER_KEYWORDS = ["founding"]; // matches "👑 Founding Builder"

export interface ContributorsStripProps {
  locale: string;
}

export default function ContributorsStrip({ locale }: ContributorsStripProps) {
  const [contributors, setContributors] = useState<ContributorItem[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch("/api/payment/contributors?limit=200");
        if (!res.ok) {
          if (!cancelled) setContributors([]);
          return;
        }
        const data = (await res.json()) as { contributors?: ContributorItem[] };
        if (cancelled) return;
        setContributors(data.contributors ?? []);
      } catch {
        if (!cancelled) setContributors([]);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  // Order: Founding Builder first, then everyone else as the API returned them.
  const ordered = (() => {
    if (!contributors) return null;
    const founders = contributors.filter((c) =>
      FOUNDING_TIER_KEYWORDS.some((kw) =>
        (c.tierLabel ?? "").toLowerCase().includes(kw),
      ),
    );
    const rest = contributors.filter(
      (c) =>
        !FOUNDING_TIER_KEYWORDS.some((kw) =>
          (c.tierLabel ?? "").toLowerCase().includes(kw),
        ),
    );
    return [...founders, ...rest];
  })();

  return (
    <section
      aria-labelledby="supporters-heading"
      className="ftp-section-wrap ftp-contributors-wrap"
      style={{ background: "#FFFFFF", borderTop: "1px solid #F0F0EC" }}
    >
      <style>{`
        .ftp-contributors-card {
          background: #FAFAF8;
          border: 1px solid #E8E8E4;
          border-radius: 12px;
          padding: 24px;
        }
        .ftp-contributors-header {
          font-size: 14px;
          color: #6B7280;
          margin-bottom: 12px;
        }
        .ftp-contributors-header strong {
          color: #1A1A1A;
          font-weight: 600;
        }
        .ftp-contributors-names {
          font-size: 13px;
          color: #4B5563;
          line-height: 1.7;
          margin-bottom: 16px;
        }
        .ftp-contributors-more {
          color: #9B9B9B;
        }
        .ftp-contributors-cta {
          display: inline-block;
          font-size: 13px;
          color: #2563EB;
          font-weight: 500;
          text-decoration: none;
        }
        .ftp-contributors-cta:hover { text-decoration: underline; }
      `}</style>

      <div className="ftp-section-inner">
        <h2 id="supporters-heading" className="sr-only">
          Supporters
        </h2>

        <div className="ftp-contributors-card">
          {ordered === null ? (
            <div className="ftp-contributors-header">Loading supporters…</div>
          ) : ordered.length === 0 ? (
            <>
              <div className="ftp-contributors-header">Be the first to back us.</div>
              <Link href={`/${locale}/support`} className="ftp-contributors-cta">
                Contribute →
              </Link>
            </>
          ) : (
            <>
              <div className="ftp-contributors-header">
                Backed by <strong>{ordered.length}</strong> supporter
                {ordered.length === 1 ? "" : "s"}
              </div>

              <div className="ftp-contributors-names">
                {ordered.slice(0, VISIBLE_COUNT).map((c, i, arr) => (
                  <span key={`${c.displayName}-${i}`}>
                    {c.displayName}
                    {i < arr.length - 1 && (
                      <span style={{ color: "#D1D5DB", margin: "0 8px" }}>·</span>
                    )}
                  </span>
                ))}
                {ordered.length > VISIBLE_COUNT && (
                  <span className="ftp-contributors-more">
                    {" "}+ {ordered.length - VISIBLE_COUNT} more
                  </span>
                )}
              </div>

              <Link href={`/${locale}/contributors`} className="ftp-contributors-cta">
                View all supporters &amp; how to join →
              </Link>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
