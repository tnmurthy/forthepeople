/**
 * ForThePeople.in — Your District. Your Data. Your Right.
 * © 2026 Jayanth M B. MIT License with Attribution.
 *
 * Session M1 Phase C: mobile homepage hero — single column, h1 + sub +
 * search-shortcut + 5-tile horizontal scroll-snap stats. Replaces the
 * desktop 60/40 grid (HeroSection + StatsBar) on viewport ≤ 767px.
 *
 * Reuses the same data the desktop StatsBar receives so values stay
 * in sync.
 */

import Link from "next/link";
import { Search } from "lucide-react";
import { timeAgoLabel } from "@/lib/utils/timeAgo";

interface Props {
  locale: string;
  activeDistricts: number;
  dashboardsPerDistrict: number;
  totalDataPoints: number;
  comingDistricts: number;
  mostRecentAt: string | null;
}

export function MobileHero({
  locale,
  activeDistricts,
  dashboardsPerDistrict,
  totalDataPoints,
  comingDistricts,
  mostRecentAt,
}: Props) {
  const refresh = mostRecentAt ? timeAgoLabel(mostRecentAt) : null;
  const refreshLabel = refresh?.label ?? "—";

  return (
    <section className="ftp-m-hero" aria-label="Citizen transparency platform">
      <h1 className="ftp-m-hero-h1">
        Your district.<br />
        Your data.<br />
        Your right.
      </h1>

      <p className="ftp-m-hero-sub">
        {activeDistricts} districts live · {dashboardsPerDistrict} dashboards each
      </p>

      <Link
        href={`/${locale}/search`}
        className="ftp-m-hero-search"
        aria-label="Search any district"
      >
        <Search size={18} className="ftp-m-hero-search-icon" aria-hidden="true" />
        <span>Search any district…</span>
      </Link>

      <div className="ftp-m-hero-stats" role="region" aria-label="Live statistics">
        <div className="ftp-m-stat">
          <div className="ftp-m-stat-num">{activeDistricts}</div>
          <div className="ftp-m-stat-lab">Districts live</div>
        </div>
        <div className="ftp-m-stat">
          <div className="ftp-m-stat-num">{dashboardsPerDistrict}</div>
          <div className="ftp-m-stat-lab">Dashboards / district</div>
        </div>
        <div className="ftp-m-stat">
          <div className="ftp-m-stat-num">
            {totalDataPoints >= 1_000_000
              ? `${(totalDataPoints / 1_000_000).toFixed(1)}M`
              : totalDataPoints >= 1_000
                ? `${(totalDataPoints / 1_000).toFixed(0)}K`
                : totalDataPoints.toString()}
          </div>
          <div className="ftp-m-stat-lab">Data points tracked</div>
        </div>
        <div className="ftp-m-stat">
          <div className="ftp-m-stat-num">{comingDistricts}</div>
          <div className="ftp-m-stat-lab">Districts coming</div>
        </div>
        <div className="ftp-m-stat">
          <div className="ftp-m-stat-num">{refreshLabel}</div>
          <div className="ftp-m-stat-lab">Last refresh</div>
        </div>
      </div>
    </section>
  );
}
