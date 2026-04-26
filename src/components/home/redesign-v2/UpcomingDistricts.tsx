/**
 * ForThePeople.in — Your District. Your Data. Your Right.
 * © 2026 Jayanth M B. MIT License with Attribution.
 * https://github.com/jayanthmb14/forthepeople
 *
 * Session 11.6 v6 — replaces RequestAndVoteCards left card.
 *
 * Top 2 most-voted upcoming districts + a centered "Vote for the next
 * district →" link to the existing /<locale>/contribute flow (or wherever
 * the request CTA lives).
 *
 * Data is server-fetched in [locale]/page.tsx and passed in via props.
 */

import Link from "next/link";

interface DistrictRequestRow {
  id: string;
  stateName: string;
  districtName: string;
  requestCount: number;
}

export interface UpcomingDistrictsProps {
  locale: string;
  voteRequests: DistrictRequestRow[];
}

export default function UpcomingDistricts({
  locale,
  voteRequests,
}: UpcomingDistrictsProps) {
  const top2 = voteRequests.slice(0, 2);

  return (
    <section
      aria-labelledby="upcoming-heading"
      className="ftp-section-wrap ftp-upcoming-wrap"
      style={{ background: "#FFFFFF", borderTop: "1px solid #F0F0EC" }}
    >
      <style>{`
        .ftp-upcoming-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
          margin-bottom: 12px;
        }
        .ftp-upcoming-card {
          background: #EFF6FF;
          border: 1px solid #BFDBFE;
          padding: 12px 14px;
          border-radius: 8px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
          font-size: 13px;
        }
        .ftp-upcoming-text { min-width: 0; }
        .ftp-upcoming-name {
          font-weight: 500;
          color: #1D4ED8;
          font-size: 14px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .ftp-upcoming-state {
          font-size: 10px;
          color: #6B7280;
          margin-top: 2px;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }
        .ftp-upcoming-vote {
          color: #1D4ED8;
          font-weight: 600;
          font-size: 12px;
          font-family: var(--font-mono, ui-monospace, monospace);
          font-variant-numeric: tabular-nums;
          flex-shrink: 0;
          display: inline-flex;
          align-items: center;
          gap: 4px;
        }
        .ftp-upcoming-cta {
          text-align: center;
          font-size: 13px;
        }
        .ftp-upcoming-cta a {
          color: #1D4ED8;
          font-weight: 500;
          text-decoration: none;
        }
        .ftp-upcoming-cta a:hover { text-decoration: underline; }
        @media (max-width: 767px) {
          .ftp-upcoming-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="ftp-section-inner">
        <div style={{ marginBottom: 14 }}>
          <h2
            id="upcoming-heading"
            style={{ margin: 0, fontSize: 18, fontWeight: 600, color: "#1A1A1A" }}
          >
            Upcoming districts ·{" "}
            <span style={{ color: "#6B7280", fontWeight: 400 }}>vote what&apos;s next</span>
          </h2>
        </div>

        {top2.length > 0 && (
          <div className="ftp-upcoming-grid">
            {top2.map((r) => (
              <div key={r.id} className="ftp-upcoming-card">
                <div className="ftp-upcoming-text">
                  <div className="ftp-upcoming-name">{r.districtName}</div>
                  <div className="ftp-upcoming-state">{r.stateName}</div>
                </div>
                <span className="ftp-upcoming-vote">
                  <span aria-hidden="true">▲</span>
                  {r.requestCount.toLocaleString("en-IN")}
                </span>
              </div>
            ))}
          </div>
        )}

        <div className="ftp-upcoming-cta">
          <Link href={`/${locale}/contribute`}>
            Vote for the next district →
          </Link>
        </div>
      </div>
    </section>
  );
}
