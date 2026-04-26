/**
 * ForThePeople.in — Your District. Your Data. Your Right.
 * © 2026 Jayanth M B. MIT License with Attribution.
 * https://github.com/jayanthmb14/forthepeople
 *
 * Session 13 v8 Phase I (Fix #14) — supporters tiered marquee.
 *
 * Replaces the flat names list with a tier-colored, sliding marquee:
 *   👑 Founder (amber) · 🇮🇳 All-India (red) · 📍 State (purple) ·
 *   🏛 District (emerald) · Chai/one-time (neutral)
 *
 * Each pill: icon + display name + tier badge. Marquee duplicated for
 * seamless loop. Hover pauses. Edge fade-mask. Reduced-motion: items
 * wrap into a static row.
 *
 * Data source: existing /api/payment/contributors endpoint. Tier is
 * derived from the API's `tier` / `tierLabel` strings — no new schema
 * fields, no new endpoint.
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

function SupporterPill({ contributor }: { contributor: ContributorItem }) {
  const tier = classifyTier(contributor);
  const name = contributor.displayName;

  switch (tier) {
    case "founder":
      return (
        <span className="ftp-sup-pill ftp-sup-founder">
          <Crown className="ftp-sup-icon" aria-hidden="true" />
          <span className="ftp-sup-name">{name}</span>
          <span className="ftp-sup-badge">FOUNDER</span>
        </span>
      );
    case "all-india":
      return (
        <span className="ftp-sup-pill ftp-sup-allindia">
          <span className="ftp-sup-flag" aria-hidden="true">🇮🇳</span>
          <span className="ftp-sup-name">{name}</span>
          <span className="ftp-sup-badge">ALL-INDIA</span>
        </span>
      );
    case "state":
      return (
        <span className="ftp-sup-pill ftp-sup-state">
          <MapPin className="ftp-sup-icon" aria-hidden="true" />
          <span className="ftp-sup-name">{name}</span>
          <span className="ftp-sup-badge">STATE</span>
        </span>
      );
    case "district":
      return (
        <span className="ftp-sup-pill ftp-sup-district">
          <Building className="ftp-sup-icon" aria-hidden="true" />
          <span className="ftp-sup-name">{name}</span>
          <span className="ftp-sup-badge">DISTRICT</span>
        </span>
      );
    default:
      return (
        <span className="ftp-sup-pill ftp-sup-onetime">
          <span className="ftp-sup-name">{name}</span>
        </span>
      );
  }
}

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

  // Sort: founders first, then all-india, state, district, one-time.
  const TIER_ORDER: Record<SupTier, number> = {
    founder: 0,
    "all-india": 1,
    state: 2,
    district: 3,
    "one-time": 4,
  };
  const ordered = (() => {
    if (!contributors) return null;
    return [...contributors].sort(
      (a, b) => TIER_ORDER[classifyTier(a)] - TIER_ORDER[classifyTier(b)],
    );
  })();

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

        .ftp-supporters-marquee-viewport {
          overflow: hidden;
          position: relative;
          -webkit-mask-image: linear-gradient(to right, transparent, black 5%, black 95%, transparent);
          mask-image: linear-gradient(to right, transparent, black 5%, black 95%, transparent);
        }
        .ftp-supporters-marquee-track {
          display: inline-flex;
          gap: 10px;
          white-space: nowrap;
          animation: ftp-supporters-marquee 60s linear infinite;
          padding: 6px 0;
        }
        .ftp-supporters-marquee-track:hover { animation-play-state: paused; }

        .ftp-sup-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 12px;
          border: 0.5px solid;
          flex-shrink: 0;
        }
        .ftp-sup-icon { width: 12px; height: 12px; }
        .ftp-sup-name { font-weight: 500; }
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
          .ftp-supporters-marquee-track {
            animation: none;
            flex-wrap: wrap;
            white-space: normal;
          }
          .ftp-supporters-marquee-viewport { -webkit-mask-image: none; mask-image: none; }
        }
      `}</style>

      <div className="ftp-section-inner ftp-supporters-section">
        <h2 id="supporters-heading" className="sr-only">
          Supporters
        </h2>

        <div className="ftp-supporters-header">
          <div>
            <div className="ftp-supporters-title">
              {ordered === null
                ? "Loading supporters…"
                : ordered.length === 0
                  ? "Be the first to back us"
                  : `Backed by ${ordered.length} supporter${ordered.length === 1 ? "" : "s"}`}
            </div>
            <div className="ftp-supporters-subtitle">
              No corporate funding. No ads. Just citizens backing citizens.
            </div>
          </div>
          <Link href={`/${locale}/contributors`} className="ftp-supporters-more">
            View all &amp; how to join →
          </Link>
        </div>

        {ordered && ordered.length > 0 && (
          <div className="ftp-supporters-marquee-viewport">
            <div className="ftp-supporters-marquee-track">
              {ordered.map((c, i) => (
                <SupporterPill key={`a-${i}`} contributor={c} />
              ))}
              {ordered.map((c, i) => (
                <SupporterPill key={`b-${i}`} contributor={c} />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
