/**
 * ForThePeople.in — Your District. Your Data. Your Right.
 * © 2026 Jayanth M B. MIT License with Attribution.
 * https://github.com/jayanthmb14/forthepeople
 *
 * Session 14 v8.1 Phase H (Fixes #13, #14, #15) — tier-based marquee.
 *
 * Three separate sliding tracks at tier-paced speeds, top → bottom:
 *   1. All-India + Founder pills — SLOW (90s) so the eye can read each name
 *   2. State pills              — MEDIUM (60s)
 *   3. District + One-time pills — FAST (35s)
 *
 * Each pill is clickable IF the contributor exposes a social link;
 * otherwise it falls back to a non-link <span>.
 *
 * Names render full (no truncation) for public supporters; the API now
 * returns the un-anonymized name when isPublic=true (Session 14 Phase H
 * API surface). Private supporters still appear as "Anonymous".
 *
 * Data source: existing /api/payment/contributors endpoint (now surfaces
 * socialLink + socialPlatform from the existing Supporter schema).
 * No new endpoints, no new schema fields.
 */

"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Building, Crown, MapPin } from "lucide-react";

interface ContributorItem {
  displayName: string;
  tierLabel: string;
  tier: string | null;
  message: string | null;
  timeAgo: string;
  socialLink?: string | null;
  socialPlatform?: string | null;
}

type SupTier = "founder" | "all-india" | "state" | "district" | "one-time";

function classifyTier(c: ContributorItem): SupTier {
  const label = `${c.tierLabel ?? ""} ${c.tier ?? ""}`.toLowerCase();
  if (label.includes("found")) return "founder";
  if (label.includes("all-india") || label.includes("patron")) return "all-india";
  if (label.includes("state")) return "state";
  if (label.includes("district") || label.includes("monthly")) return "district";
  return "one-time";
}

function safeExternalLink(url: string | null | undefined): string | null {
  if (!url) return null;
  const trimmed = url.trim();
  if (!trimmed) return null;
  // Only allow http(s) and basic handle/url forms; reject javascript:, data:, etc.
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  // Bare handle like "@user" → assume Instagram (common case)
  if (trimmed.startsWith("@")) return `https://instagram.com/${trimmed.slice(1)}`;
  return null;
}

function SupporterPill({ contributor }: { contributor: ContributorItem }) {
  const tier = classifyTier(contributor);
  const name = contributor.displayName;
  const link = safeExternalLink(contributor.socialLink);

  const innerByTier: Record<SupTier, React.ReactNode> = {
    founder: (
      <>
        <Crown className="ftp-sup-icon" aria-hidden="true" />
        <span className="ftp-sup-name">{name}</span>
        <span className="ftp-sup-badge">FOUNDER</span>
      </>
    ),
    "all-india": (
      <>
        <span className="ftp-sup-flag" aria-hidden="true">🇮🇳</span>
        <span className="ftp-sup-name">{name}</span>
        <span className="ftp-sup-badge">ALL-INDIA</span>
      </>
    ),
    state: (
      <>
        <MapPin className="ftp-sup-icon" aria-hidden="true" />
        <span className="ftp-sup-name">{name}</span>
        <span className="ftp-sup-badge">STATE</span>
      </>
    ),
    district: (
      <>
        <Building className="ftp-sup-icon" aria-hidden="true" />
        <span className="ftp-sup-name">{name}</span>
        <span className="ftp-sup-badge">DISTRICT</span>
      </>
    ),
    "one-time": (
      <>
        <span className="ftp-sup-name">{name}</span>
      </>
    ),
  };

  const className = `ftp-sup-pill ftp-sup-${tier}${link ? " ftp-sup-link" : ""}`;

  if (link) {
    return (
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
        title={contributor.socialPlatform ? `${name} on ${contributor.socialPlatform}` : name}
      >
        {innerByTier[tier]}
      </a>
    );
  }
  return <span className={className}>{innerByTier[tier]}</span>;
}

export interface ContributorsStripProps {
  locale: string;
}

const TIER_ORDER: Record<SupTier, number> = {
  founder: 0,
  "all-india": 1,
  state: 2,
  district: 3,
  "one-time": 4,
};

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

  // Split into 3 tracks. Founders ride with All-India (top tier).
  const tracks = (() => {
    if (!contributors) return null;
    const sorted = [...contributors].sort(
      (a, b) => TIER_ORDER[classifyTier(a)] - TIER_ORDER[classifyTier(b)],
    );
    const top: ContributorItem[] = [];
    const mid: ContributorItem[] = [];
    const fast: ContributorItem[] = [];
    for (const c of sorted) {
      const t = classifyTier(c);
      if (t === "founder" || t === "all-india") top.push(c);
      else if (t === "state") mid.push(c);
      else fast.push(c);
    }
    return { top, mid, fast };
  })();

  const total = contributors?.length ?? 0;

  return (
    <section
      aria-labelledby="supporters-heading"
      className="ftp-section-wrap ftp-supporters-wrap"
      style={{ background: "#FFFFFF", borderTop: "1px solid #F0F0EC" }}
    >
      <style>{`
        .ftp-supporters-section { padding: 28px 24px; }
        .ftp-supporters-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: 16px;
          gap: 16px;
          flex-wrap: wrap;
        }
        .ftp-supporters-title {
          font-size: 16px;
          font-weight: 600;
          color: #1A1A1A;
        }
        .ftp-supporters-subtitle {
          font-size: 12px;
          color: #6B7280;
          margin-top: 2px;
        }
        .ftp-supporters-more {
          font-size: 12px;
          color: #2563EB;
          font-weight: 500;
          text-decoration: none;
        }
        .ftp-supporters-more:hover { text-decoration: underline; }

        .ftp-supporters-marquees {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .ftp-marquee-viewport {
          overflow: hidden;
          position: relative;
          -webkit-mask-image: linear-gradient(to right, transparent, black 5%, black 95%, transparent);
          mask-image: linear-gradient(to right, transparent, black 5%, black 95%, transparent);
        }
        .ftp-marquee-track {
          display: inline-flex;
          gap: 10px;
          white-space: nowrap;
          padding: 6px 0;
        }
        /* Session 14 v8.1 Phase H Fix #13: tier-based marquee speeds */
        .ftp-marquee-slow   { animation: ftp-supporters-marquee 90s linear infinite; }
        .ftp-marquee-medium { animation: ftp-supporters-marquee 60s linear infinite; }
        .ftp-marquee-fast   { animation: ftp-supporters-marquee 35s linear infinite; }
        .ftp-marquee-track:hover { animation-play-state: paused; }

        /* Pills */
        .ftp-sup-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 12px;
          border: 0.5px solid;
          flex-shrink: 0;
          text-decoration: none;
          color: inherit;
          transition: transform 150ms ease, box-shadow 150ms ease;
        }
        .ftp-sup-link { cursor: pointer; }
        .ftp-sup-link:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 10px rgba(0,0,0,0.06);
        }
        .ftp-sup-icon { width: 12px; height: 12px; }
        .ftp-sup-name { font-weight: 500; white-space: nowrap; }
        .ftp-sup-badge {
          font-size: 9px;
          font-weight: 700;
          padding: 1px 5px;
          border-radius: 3px;
          letter-spacing: 0.3px;
          text-transform: uppercase;
          color: #FFFFFF;
        }
        .ftp-sup-flag { font-size: 13px; line-height: 1; }

        .ftp-sup-founder {
          background: #FEF3C7;
          color: #92400E;
          border-color: #FCD34D;
        }
        .ftp-sup-founder .ftp-sup-badge { background: #BA7517; }
        .ftp-sup-founder .ftp-sup-icon { color: #BA7517; }

        .ftp-sup-allindia {
          background: #FCEBEB;
          color: #791F1F;
          border-color: #E24B4A;
        }
        .ftp-sup-allindia .ftp-sup-badge { background: #E24B4A; }

        .ftp-sup-state {
          background: #EEEDFE;
          color: #3C3489;
          border-color: #6E59C0;
        }
        .ftp-sup-state .ftp-sup-badge { background: #6E59C0; }
        .ftp-sup-state .ftp-sup-icon { color: #6E59C0; }

        .ftp-sup-district {
          background: #D1FAE5;
          color: #065F46;
          border-color: #10B981;
        }
        .ftp-sup-district .ftp-sup-badge { background: #10B981; }
        .ftp-sup-district .ftp-sup-icon { color: #10B981; }

        .ftp-sup-onetime {
          background: #F3F4F6;
          color: #4B5563;
          border-color: #E5E7EB;
        }

        @keyframes ftp-supporters-marquee {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @media (prefers-reduced-motion: reduce) {
          .ftp-marquee-slow,
          .ftp-marquee-medium,
          .ftp-marquee-fast {
            animation: none;
            flex-wrap: wrap;
            white-space: normal;
          }
          .ftp-marquee-viewport { -webkit-mask-image: none; mask-image: none; }
          .ftp-sup-link:hover { transform: none; box-shadow: none; }
        }
      `}</style>

      <div className="ftp-section-inner ftp-supporters-section">
        <h2 id="supporters-heading" className="sr-only">
          Supporters
        </h2>

        <div className="ftp-supporters-header">
          <div>
            <div className="ftp-supporters-title">
              {contributors === null
                ? "Loading supporters…"
                : total === 0
                  ? "Be the first to back us"
                  : `Backed by ${total} supporter${total === 1 ? "" : "s"}`}
            </div>
            <div className="ftp-supporters-subtitle">
              No corporate funding. No ads. Just citizens backing citizens.
            </div>
          </div>
          <Link href={`/${locale}/contributors`} className="ftp-supporters-more">
            View all &amp; how to join →
          </Link>
        </div>

        {tracks && total > 0 && (
          <div className="ftp-supporters-marquees">
            {tracks.top.length > 0 && (
              <div className="ftp-marquee-viewport">
                <div className="ftp-marquee-track ftp-marquee-slow">
                  {tracks.top.map((c, i) => (
                    <SupporterPill key={`top-a-${i}`} contributor={c} />
                  ))}
                  {tracks.top.map((c, i) => (
                    <SupporterPill key={`top-b-${i}`} contributor={c} />
                  ))}
                </div>
              </div>
            )}
            {tracks.mid.length > 0 && (
              <div className="ftp-marquee-viewport">
                <div className="ftp-marquee-track ftp-marquee-medium">
                  {tracks.mid.map((c, i) => (
                    <SupporterPill key={`mid-a-${i}`} contributor={c} />
                  ))}
                  {tracks.mid.map((c, i) => (
                    <SupporterPill key={`mid-b-${i}`} contributor={c} />
                  ))}
                </div>
              </div>
            )}
            {tracks.fast.length > 0 && (
              <div className="ftp-marquee-viewport">
                <div className="ftp-marquee-track ftp-marquee-fast">
                  {tracks.fast.map((c, i) => (
                    <SupporterPill key={`fast-a-${i}`} contributor={c} />
                  ))}
                  {tracks.fast.map((c, i) => (
                    <SupporterPill key={`fast-b-${i}`} contributor={c} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
