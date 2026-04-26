/**
 * ForThePeople.in — Your District. Your Data. Your Right.
 * © 2026 Jayanth M B. MIT License with Attribution.
 * https://github.com/jayanthmb14/forthepeople
 *
 * Session 12 v7 — /contributors hero section.
 *
 * Renders ABOVE the existing GlobalContributorsClient. Three live stats
 * (total · raised this month · committed monthly) + a Join CTA pair.
 * Pulls from the same /api/payment/contributors endpoint so we don't
 * fan out to a new server route just for this page header.
 *
 * If the API doesn't return raisedThisMonth / committedMonthly today,
 * we derive them from the contributor list (sum amount where
 * createdAt within last 30 days; sum amount where isRecurring=true).
 */

"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useCountUp } from "@/lib/hooks/useCountUp";

interface ContributorRow {
  id?: string;
  amount?: number | null;
  isRecurring?: boolean;
  createdAt?: string;
}

interface Stats {
  total: number;
  raisedThisMonth: number;
  committedMonthly: number;
}

const ZERO_STATS: Stats = { total: 0, raisedThisMonth: 0, committedMonthly: 0 };

function StatTile({
  target,
  label,
  prefix,
}: {
  target: number;
  label: string;
  prefix?: string;
}) {
  const { value, ref } = useCountUp<HTMLDivElement>(target);
  return (
    <div className="ftp-contrib-hero-stat" ref={ref}>
      <div className="ftp-contrib-hero-num">
        {prefix ?? ""}
        {value.toLocaleString("en-IN")}
      </div>
      <div className="ftp-contrib-hero-stat-label">{label}</div>
    </div>
  );
}

export default function ContributorsHero({ locale }: { locale: string }) {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        // Fetch a generous limit so per-month + recurring totals are
        // accurate. The endpoint already paginates internally if needed.
        const res = await fetch("/api/payment/contributors?limit=500");
        if (!res.ok) {
          if (!cancelled) setStats(ZERO_STATS);
          return;
        }
        const data = (await res.json()) as {
          contributors?: ContributorRow[];
          total?: number;
          raisedThisMonth?: number;
          committedMonthly?: number;
        };
        if (cancelled) return;

        const list = data.contributors ?? [];
        const total = data.total ?? list.length;

        // Derive if API doesn't surface these yet.
        let raisedThisMonth = data.raisedThisMonth;
        let committedMonthly = data.committedMonthly;

        if (raisedThisMonth == null) {
          const cutoff = Date.now() - 30 * 24 * 3600 * 1000;
          raisedThisMonth = list.reduce((sum, c) => {
            const ts = c.createdAt ? new Date(c.createdAt).getTime() : 0;
            if (ts >= cutoff) return sum + (c.amount ?? 0);
            return sum;
          }, 0);
        }
        if (committedMonthly == null) {
          committedMonthly = list.reduce((sum, c) => {
            return c.isRecurring ? sum + (c.amount ?? 0) : sum;
          }, 0);
        }

        setStats({ total, raisedThisMonth, committedMonthly });
      } catch {
        if (!cancelled) setStats(ZERO_STATS);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const display = stats ?? ZERO_STATS;

  return (
    <section
      aria-labelledby="contributors-hero-heading"
      style={{
        background: "#FFFFFF",
        borderBottom: "1px solid #F0F0EC",
        padding: "40px 24px 32px",
      }}
    >
      <style>{`
        .ftp-contrib-hero-inner {
          max-width: 1100px;
          margin: 0 auto;
          text-align: center;
        }
        .ftp-contrib-hero-h1 {
          margin: 0 0 12px;
          font-size: 32px;
          font-weight: 600;
          letter-spacing: -0.02em;
          color: #1A1A1A;
        }
        .ftp-contrib-hero-sub {
          margin: 0 auto 24px;
          font-size: 15px;
          color: #4B5563;
          line-height: 1.55;
          max-width: 640px;
        }
        .ftp-contrib-hero-stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
          max-width: 720px;
          margin: 0 auto 24px;
        }
        .ftp-contrib-hero-stat {
          padding: 16px 12px;
          background: #FAFAF8;
          border-radius: 10px;
          border: 0.5px solid #E5E7EB;
        }
        .ftp-contrib-hero-num {
          font-size: 26px;
          font-weight: 700;
          color: #1A1A1A;
          font-variant-numeric: tabular-nums;
          line-height: 1;
        }
        .ftp-contrib-hero-stat-label {
          margin-top: 6px;
          font-size: 11px;
          color: #6B7280;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          font-weight: 600;
        }
        .ftp-contrib-hero-cta-group {
          display: inline-flex;
          align-items: center;
          gap: 16px;
          flex-wrap: wrap;
          justify-content: center;
        }
        .ftp-contrib-hero-cta-primary {
          background: #DC2626;
          color: #FFFFFF;
          padding: 10px 20px;
          border-radius: 999px;
          font-size: 14px;
          font-weight: 600;
          text-decoration: none;
        }
        .ftp-contrib-hero-cta-secondary {
          color: #BA7517;
          font-size: 14px;
          font-weight: 500;
          text-decoration: none;
        }
        .ftp-contrib-hero-cta-secondary:hover { text-decoration: underline; text-underline-offset: 4px; }
        @media (max-width: 767px) {
          .ftp-contrib-hero-h1 { font-size: 24px; }
          .ftp-contrib-hero-stats { grid-template-columns: 1fr; }
          .ftp-contrib-hero-cta-group { flex-direction: column; gap: 10px; }
        }
      `}</style>

      <div className="ftp-contrib-hero-inner">
        <h1 id="contributors-hero-heading" className="ftp-contrib-hero-h1">
          The People Behind the Platform
        </h1>
        <p className="ftp-contrib-hero-sub">
          Every name here keeps district-level government data free for
          780+ Indian districts. No corporate funding. No ads. Just
          citizens backing citizens.
        </p>

        <div className="ftp-contrib-hero-stats">
          <StatTile target={display.total} label="total supporters" />
          <StatTile
            target={Math.round(display.raisedThisMonth)}
            prefix="₹"
            label="raised this month"
          />
          <StatTile
            target={Math.round(display.committedMonthly)}
            prefix="₹"
            label="committed monthly"
          />
        </div>

        <div className="ftp-contrib-hero-cta-group">
          <Link href={`/${locale}/support`} className="ftp-contrib-hero-cta-primary">
            Join them — from ₹99/mo →
          </Link>
          <Link
            href={`/${locale}/support#founding-builder`}
            className="ftp-contrib-hero-cta-secondary"
          >
            Become a Founding Builder →
          </Link>
        </div>
      </div>
    </section>
  );
}
