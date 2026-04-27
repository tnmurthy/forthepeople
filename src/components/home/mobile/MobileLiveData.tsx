/**
 * ForThePeople.in — Your District. Your Data. Your Right.
 * © 2026 Jayanth M B. MIT License with Attribution.
 *
 * Session M1 Phase F: mobile compact "Live Data" — 4-row inline list
 * (Crop Prices / Schemes / Local News / Budget) replaces the desktop
 * 4-card grid. Each row is a 56px tap target linking into the chosen
 * district's module page.
 */

import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface DistrictRef {
  slug: string;
  name: string;
  stateSlug: string;
}

interface Props {
  locale: string;
  /** Anchor district for the live preview links (default: first active). */
  district: DistrictRef;
}

const ROWS = [
  { key: "crops",   icon: "🌾", label: "Crop Prices",  hint: "Live mandi rates" },
  { key: "schemes", icon: "🏛", label: "Schemes",      hint: "Active gov schemes" },
  { key: "news",    icon: "📰", label: "Local News",   hint: "Today's headlines" },
  { key: "finance", icon: "💰", label: "Budget",       hint: "Where money is going" },
] as const;

export function MobileLiveData({ locale, district }: Props) {
  const base = `/${locale}/${district.stateSlug}/${district.slug}`;
  return (
    <section className="ftp-m-section" aria-labelledby="m-livedata-heading">
      <header className="ftp-m-section-head">
        <h2 id="m-livedata-heading">
          <span className="ftp-m-live-dot" aria-hidden="true" /> LIVE DATA ·{" "}
          <span className="ftp-m-section-head-pill">{district.name}</span>
        </h2>
        <Link href={base} className="ftp-m-section-cta">
          All →
        </Link>
      </header>
      <ul className="ftp-m-data-list">
        {ROWS.map((r) => (
          <li key={r.key}>
            <Link href={`${base}/${r.key}`} className="ftp-m-data-row">
              <span className="ftp-m-data-icon" aria-hidden="true">{r.icon}</span>
              <span className="ftp-m-data-body">
                <span className="ftp-m-data-label">{r.label}</span>
                <span className="ftp-m-data-hint">{r.hint}</span>
              </span>
              <ChevronRight size={16} className="ftp-m-data-arrow" aria-hidden="true" />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
