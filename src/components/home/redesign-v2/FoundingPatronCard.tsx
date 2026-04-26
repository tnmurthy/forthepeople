/**
 * ForThePeople.in — Your District. Your Data. Your Right.
 * © 2026 Jayanth M B. MIT License with Attribution.
 * https://github.com/jayanthmb14/forthepeople
 *
 * Session 11 redesign — FoundingPatronCard.
 *
 * Highlights the top "Founding Builder" supporter (currently Micah Alex
 * per Razorpay live data). Pulls from /api/payment/contributors and
 * picks the highest-tier entry. Falls back to a hardcoded card if the
 * endpoint returns nothing.
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

const FALLBACK = {
  displayName: "Micah Alex",
  tierLabel: "👑 Founding Builder",
};

export default function FoundingPatronCard() {
  const [item, setItem] = useState<{ displayName: string; tierLabel: string } | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch("/api/payment/contributors?limit=20");
        if (!res.ok) return;
        const data = (await res.json()) as { contributors?: ContributorItem[] };
        const founder = (data.contributors ?? []).find(
          (c) => c.tierLabel?.includes("Founding") || c.tier === "founder",
        );
        if (cancelled) return;
        if (founder) {
          setItem({ displayName: founder.displayName, tierLabel: founder.tierLabel });
        } else {
          setItem(FALLBACK);
        }
      } catch {
        if (!cancelled) {
          setItem(FALLBACK);
        }
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  if (!item) {
    // Skeleton — preserve vertical rhythm but don't flash a fake name.
    return (
      <section
        aria-hidden="true"
        className="ftp-section-wrap ftp-patron-wrap"
        style={{ background: "#FAFAF8", borderTop: "1px solid #F0F0EC" }}
      >
        <div className="ftp-section-inner" style={{ paddingBottom: 8 }}>
          <div
            style={{
              background: "#FAEEDA",
              border: "0.5px solid #BA7517",
              borderRadius: 16,
              padding: 18,
              minHeight: 88,
              opacity: 0.6,
            }}
          />
        </div>
      </section>
    );
  }

  const initials = (item.displayName || "??")
    .split(/\s+/)
    .map((s) => s[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <section
      className="ftp-section-wrap ftp-patron-wrap"
      style={{ background: "#FAFAF8", borderTop: "1px solid #F0F0EC" }}
    >
      <div className="ftp-section-inner" style={{ paddingBottom: 8 }}>
      <style>{`
        .ftp-founder-card {
          background: #FAEEDA;
          border: 0.5px solid #BA7517;
          border-radius: 16px;
          padding: 18px;
          display: flex;
          align-items: center;
          gap: 16px;
          position: relative;
          animation: ftp-founder-glow 4s ease-in-out infinite;
        }
        @keyframes ftp-founder-glow {
          0%, 100% { box-shadow: 0 0 0 0 rgba(186, 117, 23, 0.0); }
          50%      { box-shadow: 0 0 0 4px rgba(186, 117, 23, 0.18); }
        }
        @media (prefers-reduced-motion: reduce) {
          .ftp-founder-card { animation: none; }
        }
        .ftp-founder-avatar {
          width: 44px; height: 44px; border-radius: 50%;
          background: #BA7517; color: #FFFFFF;
          display: flex; align-items: center; justify-content: center;
          font-weight: 700; font-size: 14px;
          flex-shrink: 0;
        }
        .ftp-founder-badge {
          position: absolute; top: 14px; right: 14px;
          padding: 4px 10px;
          background: #BA7517;
          color: #FFFFFF;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.08em;
          border-radius: 999px;
        }
      `}</style>

      <div className="ftp-founder-card">
        <div className="ftp-founder-avatar" aria-hidden="true">{initials}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: "#78350F" }}>
            {item.displayName} · Founding Builder
          </div>
          <div style={{ marginTop: 4, fontSize: 13, color: "#92400E", lineHeight: 1.45 }}>
            ₹50,000/mo · gold card on every page · listed first everywhere
          </div>
        </div>
        <span className="ftp-founder-badge" aria-label="Founding Builder tier">
          ♛ FOUNDER
        </span>
      </div>
      </div>
    </section>
  );
}
