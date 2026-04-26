/**
 * ForThePeople.in — Your District. Your Data. Your Right.
 * © 2026 Jayanth M B. MIT License with Attribution.
 * https://github.com/jayanthmb14/forthepeople
 *
 * Session 12 v7 — /vote-district client page.
 *
 * Flattens INDIA_STATES → all locked districts. Augments with vote
 * counts from existing /api/district-request GET (top 5 cached) when
 * available; falls back to 0 votes for districts not in the response.
 *
 * Vote action: POST to /api/district-request with { stateName, districtName }.
 * Server upserts on (stateName, districtName) so re-votes simply increment.
 * If POST fails, the row stays in optimistic-vote state but shows a
 * brief inline error.
 *
 * UI:
 *   - Search input (filters by district name)
 *   - State select (filters by state)
 *   - Sort select (votes desc · alphabetical)
 *   - Paginated list, 20 per page
 *   - Preselected district (from ?d=<slug>) gets a highlighted ring
 */

"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Lock } from "lucide-react";
import { INDIA_STATES } from "@/lib/constants/districts";

type LockedDistrict = {
  slug: string;
  name: string;
  stateSlug: string;
  stateName: string;
  voteCount: number;
};

interface DistrictRequestRow {
  id: string;
  stateName: string;
  districtName: string;
  requestCount: number;
}

const PAGE_SIZE = 20;

function flattenLocked(): LockedDistrict[] {
  const out: LockedDistrict[] = [];
  for (const s of INDIA_STATES) {
    for (const d of s.districts) {
      if (!d.active) {
        out.push({
          slug: d.slug,
          name: d.name,
          stateSlug: s.slug,
          stateName: s.name,
          voteCount: 0,
        });
      }
    }
  }
  return out;
}

export interface VoteDistrictPageProps {
  locale: string;
  preselected: string | null;
}

export default function VoteDistrictPage({
  locale,
  preselected,
}: VoteDistrictPageProps) {
  const allLocked = useMemo(flattenLocked, []);

  // ── Augment with live vote counts ──
  const [voteMap, setVoteMap] = useState<Record<string, number>>({});
  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch("/api/district-request");
        if (!res.ok) return;
        const data = (await res.json()) as { top?: DistrictRequestRow[] };
        if (cancelled) return;
        const next: Record<string, number> = {};
        for (const r of data.top ?? []) {
          next[`${r.stateName}::${r.districtName}`.toLowerCase()] = r.requestCount;
        }
        setVoteMap(next);
      } catch {
        /* ignore */
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  // ── Filter / sort / paginate ──
  const [search, setSearch] = useState(preselected ?? "");
  const [stateFilter, setStateFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"votes" | "alpha">("votes");
  const [page, setPage] = useState(0);

  // Local optimistic vote tracking (slug → bump)
  const [bumps, setBumps] = useState<Record<string, number>>({});
  const [voted, setVoted] = useState<Set<string>>(new Set());
  const [errorSlug, setErrorSlug] = useState<string | null>(null);

  const filteredSorted = useMemo(() => {
    const q = search.trim().toLowerCase();
    let list = allLocked.map((d) => ({
      ...d,
      voteCount:
        (voteMap[`${d.stateName}::${d.name}`.toLowerCase()] ?? d.voteCount) +
        (bumps[d.slug] ?? 0),
    }));

    if (q) {
      list = list.filter(
        (d) =>
          d.name.toLowerCase().includes(q) ||
          d.stateName.toLowerCase().includes(q),
      );
    }
    if (stateFilter !== "all") {
      list = list.filter((d) => d.stateSlug === stateFilter);
    }

    if (sortBy === "alpha") {
      list.sort((a, b) => a.name.localeCompare(b.name));
    } else {
      list.sort((a, b) => b.voteCount - a.voteCount || a.name.localeCompare(b.name));
    }
    return list;
  }, [allLocked, voteMap, bumps, search, stateFilter, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filteredSorted.length / PAGE_SIZE));
  const pageItems = filteredSorted.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  // Reset to page 0 when filters change
  useEffect(() => {
    setPage(0);
  }, [search, stateFilter, sortBy]);

  // Pre-select scroll: if preselected, scroll its row into view on mount
  useEffect(() => {
    if (!preselected) return;
    const el = document.getElementById(`vote-row-${preselected}`);
    if (el) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      el.scrollIntoView({ block: "center" });
    }
  }, [preselected]);

  async function handleVote(d: LockedDistrict) {
    if (voted.has(d.slug)) return;
    setVoted((prev) => new Set(prev).add(d.slug));
    setBumps((prev) => ({ ...prev, [d.slug]: (prev[d.slug] ?? 0) + 1 }));
    setErrorSlug(null);
    try {
      const res = await fetch("/api/district-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stateName: d.stateName, districtName: d.name }),
      });
      if (!res.ok) {
        setErrorSlug(d.slug);
      }
    } catch {
      setErrorSlug(d.slug);
    }
  }

  // Sorted state list for filter dropdown
  const stateOptions = useMemo(() => {
    return [...INDIA_STATES]
      .filter((s) => s.districts.some((d) => !d.active))
      .map((s) => ({ slug: s.slug, name: s.name }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, []);

  return (
    <main className="ftp-vote-page">
      <style>{`
        .ftp-vote-page {
          max-width: 880px;
          margin: 0 auto;
          padding: 24px 16px 56px;
        }
        .ftp-back-link {
          display: inline-block;
          font-size: 13px;
          color: #6B7280;
          text-decoration: none;
          margin-bottom: 12px;
        }
        .ftp-back-link:hover { color: #1A1A1A; }
        .ftp-vote-h1 {
          font-size: 28px;
          font-weight: 600;
          letter-spacing: -0.015em;
          margin: 0 0 8px;
          color: #1A1A1A;
        }
        .ftp-vote-sub {
          font-size: 14px;
          color: #4B5563;
          margin: 0 0 20px;
        }
        .ftp-vote-toolbar {
          display: grid;
          grid-template-columns: 1.5fr 1fr 1fr;
          gap: 10px;
          margin-bottom: 16px;
        }
        @media (max-width: 640px) {
          .ftp-vote-toolbar { grid-template-columns: 1fr; }
        }
        .ftp-vote-input,
        .ftp-vote-select {
          padding: 9px 12px;
          font-size: 14px;
          border: 1px solid #E5E7EB;
          border-radius: 8px;
          background: #FFFFFF;
          color: #1A1A1A;
          outline: none;
        }
        .ftp-vote-input:focus,
        .ftp-vote-select:focus { border-color: #2563EB; }
        .ftp-vote-list {
          display: flex; flex-direction: column;
          background: #FFFFFF;
          border: 1px solid #E8E8E4;
          border-radius: 12px;
          overflow: hidden;
        }
        .ftp-vote-row {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          border-bottom: 1px solid #F0F0EC;
          background: #FFFFFF;
          transition: background 150ms ease;
        }
        .ftp-vote-row:last-child { border-bottom: none; }
        .ftp-vote-row:hover { background: #FAFAF8; }
        .ftp-vote-row-pre {
          background: #EFF6FF;
          box-shadow: inset 0 0 0 2px #BFDBFE;
        }
        .ftp-vote-lock { color: #9B9B9B; flex-shrink: 0; }
        .ftp-vote-row-info {
          flex: 1; display: flex; align-items: center; gap: 10px;
          min-width: 0;
        }
        .ftp-vote-name { font-size: 14px; font-weight: 500; color: #1A1A1A; }
        .ftp-vote-state { font-size: 12px; color: #6B7280; }
        .ftp-vote-btn {
          background: #FFFFFF;
          border: 1px solid #2563EB;
          color: #2563EB;
          padding: 6px 14px;
          border-radius: 999px;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          font-variant-numeric: tabular-nums;
          flex-shrink: 0;
          min-height: 36px;
          transition: background 150ms ease, color 150ms ease;
        }
        .ftp-vote-btn:hover:not(:disabled) {
          background: #2563EB;
          color: #FFFFFF;
        }
        .ftp-vote-btn-voted {
          background: #16A34A !important;
          color: #FFFFFF !important;
          border-color: #16A34A !important;
          cursor: default;
        }
        .ftp-vote-empty {
          padding: 28px;
          text-align: center;
          color: #9B9B9B;
          font-size: 13px;
        }
        .ftp-vote-pagination {
          display: flex; justify-content: space-between; align-items: center;
          margin-top: 14px;
          font-size: 13px;
          color: #6B7280;
        }
        .ftp-vote-page-btn {
          padding: 6px 12px;
          background: #FFFFFF;
          border: 1px solid #E5E7EB;
          border-radius: 8px;
          font-size: 13px;
          color: #1A1A1A;
          cursor: pointer;
          min-height: 36px;
        }
        .ftp-vote-page-btn:disabled { color: #D1D5DB; cursor: not-allowed; }
        .ftp-vote-error {
          font-size: 11px; color: #DC2626; margin-left: 8px;
        }
      `}</style>

      <Link href={`/${locale}`} className="ftp-back-link">
        ← Back to home
      </Link>
      <h1 className="ftp-vote-h1">Vote for the next district</h1>
      <p className="ftp-vote-sub">
        770 districts waiting. Your vote prioritises which goes live next.
      </p>

      <div className="ftp-vote-toolbar">
        <input
          type="search"
          className="ftp-vote-input"
          placeholder="🔎 Search any locked district…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Search locked districts"
        />
        <select
          className="ftp-vote-select"
          value={stateFilter}
          onChange={(e) => setStateFilter(e.target.value)}
          aria-label="Filter by state"
        >
          <option value="all">All states</option>
          {stateOptions.map((s) => (
            <option key={s.slug} value={s.slug}>
              {s.name}
            </option>
          ))}
        </select>
        <select
          className="ftp-vote-select"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as "votes" | "alpha")}
          aria-label="Sort by"
        >
          <option value="votes">Sort: most votes</option>
          <option value="alpha">Sort: alphabetical</option>
        </select>
      </div>

      <div className="ftp-vote-list">
        {pageItems.length === 0 ? (
          <div className="ftp-vote-empty">
            No matching districts. Try a different filter.
          </div>
        ) : (
          pageItems.map((d) => {
            const isVoted = voted.has(d.slug);
            const isPre = preselected === d.slug;
            const hadError = errorSlug === d.slug;
            return (
              <div
                key={`${d.stateSlug}-${d.slug}`}
                id={`vote-row-${d.slug}`}
                className={`ftp-vote-row${isPre ? " ftp-vote-row-pre" : ""}`}
              >
                <div className="ftp-vote-row-info">
                  <Lock size={14} className="ftp-vote-lock" aria-hidden="true" />
                  <div style={{ minWidth: 0 }}>
                    <div className="ftp-vote-name">
                      {d.name}, <span className="ftp-vote-state">{d.stateName}</span>
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  className={`ftp-vote-btn${isVoted ? " ftp-vote-btn-voted" : ""}`}
                  onClick={() => handleVote(d)}
                  disabled={isVoted}
                  aria-label={`Vote for ${d.name}, ${d.stateName}`}
                >
                  ▲ {d.voteCount.toLocaleString("en-IN")}{" "}
                  {isVoted ? "Voted" : "Vote"}
                </button>
                {hadError && (
                  <span className="ftp-vote-error">network error — try again</span>
                )}
              </div>
            );
          })
        )}
      </div>

      <div className="ftp-vote-pagination">
        <button
          type="button"
          className="ftp-vote-page-btn"
          onClick={() => setPage((p) => Math.max(0, p - 1))}
          disabled={page === 0}
        >
          ← Previous
        </button>
        <span>
          Page {page + 1} of {totalPages} · {filteredSorted.length} districts
        </span>
        <button
          type="button"
          className="ftp-vote-page-btn"
          onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
          disabled={page >= totalPages - 1}
        >
          Next →
        </button>
      </div>
    </main>
  );
}
