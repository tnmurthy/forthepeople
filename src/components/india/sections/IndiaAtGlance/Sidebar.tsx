"use client";

/**
 * Left vertical column of the IndiaAtGlance band.
 * Four blocks: section number + position dots, modules count + status,
 * top-source list, last refresh time. All counts and dates come from
 * props; this component never invents values.
 */

import styles from "./styles.module.css";

type Props = {
  sectionNumber: number;
  totalSections: number;
  liveCount: number;
  totalCount: number;
  sources: string[];
  lastRefreshAt: Date | null;
};

function formatRelativeTime(date: Date | null): string {
  if (!date) return "—";
  const diffMs = Date.now() - date.getTime();
  if (diffMs < 0) return "just now";
  const hours = Math.floor(diffMs / 3_600_000);
  if (hours < 1) return "<1h ago";
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export function Sidebar({
  sectionNumber,
  totalSections,
  liveCount,
  totalCount,
  sources,
  lastRefreshAt,
}: Props) {
  const statusLabel =
    liveCount === totalCount
      ? "· all live"
      : `· ${liveCount} live · ${totalCount - liveCount} soon`;
  const statusClass =
    liveCount === totalCount ? styles.statusGreen : styles.statusMixed;

  return (
    <aside className={styles.sidebar}>
      <div className={styles.sidebarBlock} style={{ animationDelay: "0.05s" }}>
        <div className={styles.kicker}>section</div>
        <div className={styles.bigSerif}>
          {String(sectionNumber).padStart(2, "0")}
        </div>
        <div
          className={styles.dotRow}
          aria-label={`Section ${sectionNumber} of ${totalSections}`}
        >
          {Array.from({ length: totalSections }).map((_, i) => (
            <span
              key={i}
              className={i + 1 === sectionNumber ? styles.dotActive : styles.dot}
            />
          ))}
        </div>
      </div>

      <div className={styles.sidebarBlock} style={{ animationDelay: "0.15s" }}>
        <div className={styles.kicker}>modules</div>
        <div className={styles.midSerif}>
          {liveCount} / {totalCount}
        </div>
        <div className={statusClass}>{statusLabel}</div>
      </div>

      {sources.length > 0 && (
        <div className={styles.sidebarBlock} style={{ animationDelay: "0.25s" }}>
          <div className={styles.kicker}>sources</div>
          <div className={styles.sourceList}>
            {sources.map((s) => (
              <div key={s}>{s}</div>
            ))}
          </div>
        </div>
      )}

      <div
        className={`${styles.sidebarBlock} ${styles.sidebarBottom}`}
        style={{ animationDelay: "0.35s" }}
      >
        <div className={styles.kicker}>refresh</div>
        <div className={styles.refreshTime}>
          {formatRelativeTime(lastRefreshAt)}
        </div>
      </div>
    </aside>
  );
}
