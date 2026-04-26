/**
 * ForThePeople.in — Your District. Your Data. Your Right.
 * © 2026 Jayanth M B. MIT License with Attribution.
 * https://github.com/jayanthmb14/forthepeople
 *
 * Session 11 redesign — SupporterMarquee.
 *
 * Continuous horizontal marquee of all supporters EXCEPT Founding
 * Builder (which is highlighted separately by FoundingPatronCard above).
 *
 * Tier badges use the colour palette confirmed from the existing /support
 * page CTAs and BadgeExplainer:
 *   ALL-INDIA PATRON  bg #FCEBEB  text #791F1F  border #E24B4A   ★
 *   STATE CHAMPION    bg #EEEDFE  text #3C3489  border #6E59C0   ⛳
 *   DISTRICT CHAMP    bg #DCFCE7  text #166534  border #86EFAC   ⌂
 *
 * Animation: 50s linear loop, hover pauses. prefers-reduced-motion
 * → static row, no marquee.
 */

"use client";

import { useEffect, useState } from "react";

interface ContributorItem {
  displayName: string;
  tierLabel: string;
  tier: string | null;
  message: string | null;
  timeAgo: string;
}

type Visible = {
  name: string;
  tierKey: "patron" | "state" | "district" | "other";
  badgeText: string;
};

function classify(c: ContributorItem): Visible | null {
  const label = c.tierLabel?.toLowerCase() ?? "";
  if (label.includes("founding")) return null; // shown in FoundingPatronCard
  if (label.includes("all-india") || label.includes("patron")) {
    return { name: c.displayName, tierKey: "patron", badgeText: "★ ALL-INDIA" };
  }
  if (label.includes("state")) {
    return { name: c.displayName, tierKey: "state", badgeText: "⛳ STATE" };
  }
  if (label.includes("district")) {
    return { name: c.displayName, tierKey: "district", badgeText: "⌂ DISTRICT" };
  }
  // Chai supporters etc. — render with a neutral badge
  return { name: c.displayName, tierKey: "other", badgeText: "☕ SUPPORTER" };
}

const TIER_STYLES: Record<Visible["tierKey"], { bg: string; color: string; border: string }> = {
  patron:   { bg: "#FCEBEB", color: "#791F1F", border: "#E24B4A" },
  state:    { bg: "#EEEDFE", color: "#3C3489", border: "#6E59C0" },
  district: { bg: "#DCFCE7", color: "#166534", border: "#86EFAC" },
  other:    { bg: "#F5F5F0", color: "#6B7280", border: "#E5E7EB" },
};

export default function SupporterMarquee({ locale }: { locale: string }) {
  const [items, setItems] = useState<Visible[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch("/api/payment/contributors?limit=100");
        if (!res.ok) {
          setItems([]);
          return;
        }
        const data = (await res.json()) as { contributors?: ContributorItem[] };
        const all = (data.contributors ?? []).map(classify).filter(Boolean) as Visible[];
        if (!cancelled) {
          setItems(all);
        }
      } catch {
        if (!cancelled) {
          setItems([]);
        }
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  // Empty state — first-back CTA.
  if (items && items.length === 0) {
    return (
      <section
        className="ftp-section-wrap ftp-supporter-wrap"
        style={{ background: "#FAFAF8" }}
      >
        <div
          className="ftp-section-inner"
          style={{ paddingTop: 0, paddingBottom: 24, textAlign: "center", fontSize: 13, color: "#6B7280" }}
        >
          Be the first to back ForThePeople →{" "}
          <a
            href={`/${locale}/support`}
            style={{ color: "#DC2626", fontWeight: 600, textDecoration: "none" }}
          >
            Support
          </a>
        </div>
      </section>
    );
  }

  if (!items) {
    // Skeleton row
    return (
      <section
        aria-hidden="true"
        className="ftp-section-wrap ftp-supporter-wrap"
        style={{ background: "#FAFAF8" }}
      >
        <div className="ftp-section-inner" style={{ paddingTop: 0, paddingBottom: 24 }}>
          <div style={{ height: 48, opacity: 0.5 }} />
        </div>
      </section>
    );
  }

  const loop = [...items, ...items];

  return (
    <section
      className="ftp-section-wrap ftp-supporter-wrap"
      role="region"
      aria-label="Recent supporters"
      style={{ background: "#FAFAF8", borderBottom: "1px solid #F0F0EC" }}
    >
      <div className="ftp-section-inner ftp-supporter-marquee" style={{ paddingTop: 0 }}>
      <style>{`
        .ftp-supporter-viewport {
          overflow: hidden;
          padding: 8px 0;
          -webkit-mask-image: linear-gradient(to right, transparent, black 32px, black calc(100% - 32px), transparent);
                  mask-image: linear-gradient(to right, transparent, black 32px, black calc(100% - 32px), transparent);
        }
        .ftp-supporter-track {
          display: inline-flex;
          gap: 14px;
          align-items: center;
          white-space: nowrap;
          will-change: transform;
          animation: ftp-supporter-marquee 50s linear infinite;
        }
        .ftp-supporter-marquee:hover .ftp-supporter-track {
          animation-play-state: paused;
        }
        @keyframes ftp-supporter-marquee {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @media (prefers-reduced-motion: reduce) {
          .ftp-supporter-track { animation: none; }
          .ftp-supporter-viewport { overflow-x: auto; -webkit-overflow-scrolling: touch; }
          .ftp-supporter-viewport::-webkit-scrollbar { display: none; }
        }
        .ftp-supporter-chip {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 5px 12px 5px 4px;
          background: #FFFFFF;
          border: 1px solid #E8E8E4;
          border-radius: 999px;
          font-size: 12px;
          color: #1A1A1A;
        }
        .ftp-supporter-badge {
          padding: 3px 8px;
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 0.06em;
          border-radius: 999px;
          border: 1px solid;
        }
      `}</style>

      <div className="ftp-supporter-viewport">
        <div className="ftp-supporter-track">
          {loop.map((v, i) => {
            const s = TIER_STYLES[v.tierKey];
            return (
              <span key={`${v.name}-${i}`} className="ftp-supporter-chip">
                <span
                  className="ftp-supporter-badge"
                  style={{ background: s.bg, color: s.color, borderColor: s.border }}
                >
                  {v.badgeText}
                </span>
                <span style={{ fontWeight: 500 }}>{v.name}</span>
              </span>
            );
          })}
        </div>
      </div>
      </div>
    </section>
  );
}
