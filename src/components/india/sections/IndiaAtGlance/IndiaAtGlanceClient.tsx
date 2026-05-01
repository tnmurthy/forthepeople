"use client";

/**
 * v7 IndiaAtGlance band — dense magazine layout.
 *
 * Three columns: identity zone with 7-module directory, featured
 * zone with compound cells + global-rank callout, right stack of
 * 3 module cards. Owns:
 *   - IntersectionObserver flipping `visible` for the entry cascade
 *   - CountUpNumber on every numeric value once visible
 *   - Locale-aware module deep links + super-category browse link
 *
 * Missing data → "—" (em dash). Never invents.
 */

import Link from "next/link";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import styles from "./styles.module.css";
import { CompassWatermark } from "./Backdrop";
import { CountUpNumber } from "./CountUpNumber";
import {
  MACRO_DIRECTORY,
  FEATURED_HEADLINE,
  FEATURED_GROWTH,
  FEATURED_RANK,
  FEATURED_CELLS,
  RIGHT_STACK,
  FEATURED_RANK_LABEL,
  FEATURED_RANK_SUBTITLE,
  FEATURED_DESCRIPTION,
  indicatorKey,
  type DirectoryRow,
  type FeaturedCell,
  type RightCard,
  type DirectoryFormat,
} from "./metrics";
import { INDIA_SUPER_CATEGORIES } from "@/lib/india/india-super-categories";
import type {
  MacroSnapshotData,
  MacroIndicator,
} from "@/lib/india/getMacroSnapshotData";

type Props = {
  data: MacroSnapshotData;
  locale: string;
};

const EM_DASH = "—";

// ── Formatters ──

function formatLakhInr(value: number): string {
  return `₹${(value / 100_000).toFixed(1)}L`;
}

function pctOf(numerator: number, denominator: number): string {
  if (denominator === 0) return EM_DASH;
  return `${Math.round((numerator / denominator) * 100)}`;
}

// ── Helpers ──

function getInd(
  byKey: Record<string, MacroIndicator>,
  ref: { moduleSlug: string; metricKey: string },
): MacroIndicator | undefined {
  return byKey[indicatorKey(ref)];
}

// ── Sub-components ──

function DirectoryRowItem({
  row,
  data,
  locale,
}: {
  row: DirectoryRow;
  data: MacroSnapshotData;
  locale: string;
}) {
  const module_ = data.moduleBySlug[row.moduleSlug];
  const headlineInd = getInd(data.indicatorByKey, row.headlineRef);
  const companionInd = row.companion ? getInd(data.indicatorByKey, row.companion) : undefined;

  if (!module_) return null;

  const displayValue: React.ReactNode = headlineInd
    ? renderDirectoryDisplay(row.format, headlineInd.value, companionInd?.value)
    : EM_DASH;

  return (
    <Link
      href={`/${locale}/india/${row.moduleSlug}`}
      className={`${styles.directoryRow} ${row.isFeatured ? styles.featured : ""}`}
    >
      <span className={styles.directoryRowLabel}>
        {row.emoji} {module_.title}
        {row.isFeatured && (
          <span className={styles.directoryRowFeaturedTag}>▸ featured</span>
        )}
      </span>
      <span className={styles.directoryRowValue}>{displayValue}</span>
    </Link>
  );
}

function renderDirectoryDisplay(
  format: DirectoryFormat,
  primary: number,
  companion?: number,
): React.ReactNode {
  switch (format) {
    case "trillion_usd":
      return (
        <>
          $<CountUpValue value={primary} decimals={1} />T
        </>
      );
    case "percent":
      return (
        <>
          <CountUpValue value={primary} decimals={1} />%
        </>
      );
    case "lakh_crore_inr":
      return (
        <>
          ₹<CountUpValue value={primary} decimals={1} />L cr
        </>
      );
    case "lakh_crore_per_month":
      return (
        <>
          ₹<CountUpValue value={primary} decimals={1} />L cr/mo
        </>
      );
    case "billion_people":
      return (
        <>
          <CountUpValue value={primary / 1e9} decimals={2} />B
        </>
      );
    case "millions_people":
      return (
        <>
          <CountUpValue value={Math.round(primary / 1e6)} decimals={0} />M+
        </>
      );
    case "states_uts_combined":
      if (companion === undefined) {
        return <CountUpValue value={primary} decimals={0} />;
      }
      return (
        <>
          <CountUpValue value={primary} decimals={0} /> +{" "}
          <CountUpValue value={companion} decimals={0} />
        </>
      );
  }
}

/** Local context so deep children render CountUpValue without
 *  threading `visible` through every prop layer. */
const VisibleCtx = createContext(false);

function CountUpValue({
  value,
  decimals,
  duration = 1200,
}: {
  value: number;
  decimals: number;
  duration?: number;
}) {
  const visible = useContext(VisibleCtx);
  return (
    <CountUpNumber
      value={value}
      decimals={decimals}
      duration={duration}
      visible={visible}
    />
  );
}

// ── Featured cell ──

function FeaturedCellItem({
  cell,
  data,
}: {
  cell: FeaturedCell;
  data: MacroSnapshotData;
}) {
  const primary = getInd(data.indicatorByKey, cell.primary);
  const companion = cell.companion ? getInd(data.indicatorByKey, cell.companion) : undefined;

  let valueNode: React.ReactNode = EM_DASH;
  if (primary) {
    switch (cell.primaryFormat) {
      case "with_suffix":
        valueNode = <CountUpValue value={primary.value} decimals={0} />;
        break;
      case "millions_people":
        valueNode = (
          <>
            <CountUpValue value={Math.round(primary.value / 1e6)} decimals={0} />
            M+
          </>
        );
        break;
      case "states_uts_combined":
        valueNode =
          companion !== undefined ? (
            <>
              <CountUpValue value={primary.value} decimals={0} /> +{" "}
              <CountUpValue value={companion.value} decimals={0} />
            </>
          ) : (
            <CountUpValue value={primary.value} decimals={0} />
          );
        break;
      case "count":
        valueNode = <CountUpValue value={primary.value} decimals={0} />;
        break;
      case "count_kg":
        valueNode = (
          <>
            <CountUpValue value={primary.value} decimals={0} /> kg
          </>
        );
        break;
    }
  }

  let subNode: React.ReactNode = null;
  if (cell.sub) {
    switch (cell.sub.kind) {
      case "static_label":
      case "static_attribution":
        subNode = cell.sub.text;
        break;
      case "computed_pct_of": {
        const num = getInd(data.indicatorByKey, cell.sub.numerator);
        const den = getInd(data.indicatorByKey, cell.sub.denominator);
        if (num && den) {
          subNode = `${pctOf(num.value, den.value)}${cell.sub.suffix}`;
        } else {
          subNode = EM_DASH;
        }
        break;
      }
      case "computed_sum": {
        const a = getInd(data.indicatorByKey, cell.sub.first);
        const b = getInd(data.indicatorByKey, cell.sub.second);
        if (a && b) {
          subNode = `${a.value + b.value}${cell.sub.suffix}`;
        } else {
          subNode = EM_DASH;
        }
        break;
      }
    }
  }

  return (
    <div className={styles.featuredCell}>
      <div className={styles.featuredCellLabel}>{cell.label}</div>
      <div>
        <div className={styles.featuredCellValue}>{valueNode}</div>
        {subNode !== null && (
          <div className={styles.featuredCellSub}>{subNode}</div>
        )}
      </div>
    </div>
  );
}

// ── Right card ──

function RightCardItem({
  card,
  data,
  locale,
}: {
  card: RightCard;
  data: MacroSnapshotData;
  locale: string;
}) {
  const module_ = data.moduleBySlug[card.moduleSlug];
  const headline = getInd(data.indicatorByKey, card.headline);

  let majorNode: React.ReactNode = EM_DASH;
  let unit = "";
  if (headline) {
    switch (card.headlineFormat) {
      case "trillion_usd":
        majorNode = (
          <>
            $<CountUpValue value={headline.value} decimals={1} />
          </>
        );
        unit = "T";
        break;
      case "percent":
        majorNode = <CountUpValue value={headline.value} decimals={1} />;
        unit = "%";
        break;
      case "lakh_crore_inr":
        majorNode = (
          <>
            ₹<CountUpValue value={headline.value} decimals={1} />
          </>
        );
        unit = "L cr";
        break;
    }
  }

  let secondaryNode: React.ReactNode = null;
  if (card.secondary) {
    if ("ref" in card.secondary) {
      const ind = getInd(data.indicatorByKey, card.secondary.ref);
      if (ind) {
        secondaryNode = (
          <span className={styles.rightCardSecondaryPill}>
            <span className={styles.rightCardSecondaryPillArrow} aria-hidden>
              ↑
            </span>
            <span className={styles.rightCardSecondaryPillValue}>
              <CountUpValue value={ind.value} decimals={1} />% YoY
            </span>
          </span>
        );
      }
    } else {
      secondaryNode = (
        <span className={styles.rightCardSecondaryLabel}>
          {card.secondary.text}
        </span>
      );
    }
  }

  const titleText = module_?.title ?? card.moduleSlug;

  return (
    <Link
      href={`/${locale}/india/${card.moduleSlug}`}
      className={styles.rightCard}
    >
      <div className={styles.rightCardHeader}>
        <div className={styles.rightCardHeaderLeft}>
          <span className={styles.rightCardIcon} aria-hidden>
            {card.emoji}
          </span>
          <span className={styles.rightCardTitle}>{titleText}</span>
        </div>
        {module_?.status === "live" && (
          <span className={styles.rightCardLivePill}>live</span>
        )}
      </div>
      <div className={styles.rightCardValueRow}>
        <span className={styles.rightCardValue}>
          {majorNode}
          <span className={styles.rightCardValueUnit}>{unit}</span>
        </span>
        {secondaryNode}
      </div>
      <div className={styles.rightCardSubGrid}>
        {card.subStats.map((s, i) => {
          let subValue: React.ReactNode = EM_DASH;
          if ("staticValue" in s) {
            subValue = s.staticValue;
          } else {
            const ind = getInd(data.indicatorByKey, s.valueRef);
            if (ind) {
              if (s.format === "lakh_inr") {
                subValue = formatLakhInr(ind.value);
              } else if (s.format === "with_unit") {
                subValue = `${ind.value}${s.staticUnit ?? ""}`;
              }
            }
          }
          return (
            <div key={i} className={styles.rightCardSubItem}>
              <span className={styles.label}>{s.label}</span>
              <span className={styles.value}>{subValue}</span>
            </div>
          );
        })}
      </div>
    </Link>
  );
}

// ── Main composition ──

export function IndiaAtGlanceClient({ data, locale }: Props) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setVisible(true);
      },
      { threshold: 0.15, rootMargin: "0px 0px -10% 0px" },
    );
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  // Featured zone references.
  const headlineInd = getInd(data.indicatorByKey, FEATURED_HEADLINE);
  const growthInd = getInd(data.indicatorByKey, FEATURED_GROWTH);
  const rankInd = getInd(data.indicatorByKey, FEATURED_RANK);
  const featuredModuleSlug = FEATURED_HEADLINE.moduleSlug;
  const featuredModule = data.moduleBySlug[featuredModuleSlug];

  return (
    <VisibleCtx.Provider value={visible}>
      <section
        ref={ref}
        data-tint-id="macro"
        className={`${styles.section} ${visible ? styles.visible : ""}`}
        aria-labelledby="india-at-a-glance-title"
      >
        <div className={styles.layout}>
          {/* LEFT — Identity zone with directory */}
          <div className={styles.identityZone}>
            <div className={styles.sectionLabel}>
              <span className={styles.sectionLabelDot} aria-hidden />
              SECTION{" "}
              {String(data.superCategory.displayOrder).padStart(2, "0")} · OF{" "}
              {INDIA_SUPER_CATEGORIES.length}
            </div>
            <h2
              id="india-at-a-glance-title"
              className={styles.identityTitle}
            >
              {data.superCategory.title}
            </h2>
            <p className={styles.identityDesc}>
              {data.superCategory.tagline ?? ""}
            </p>

            <div className={styles.modulesCount}>
              <span className={styles.modulesCountLabel}>Modules</span>
              <span className={styles.modulesCountValue}>
                {data.liveCount} of {data.totalCount} live
              </span>
            </div>

            <div className={styles.directory}>
              {MACRO_DIRECTORY.map((row) => (
                <DirectoryRowItem
                  key={row.moduleSlug}
                  row={row}
                  data={data}
                  locale={locale}
                />
              ))}
            </div>

            <Link
              href={`/${locale}/india/category/${data.superCategory.slug}`}
              className={styles.browseBtn}
            >
              <span>Browse all {data.totalCount}</span>
              <span className={styles.browseBtnArrow} aria-hidden>
                →
              </span>
            </Link>

            <CompassWatermark />
          </div>

          {/* MIDDLE — Featured */}
          <div className={styles.featured}>
            <div className={styles.featuredHeader}>
              <div className={styles.featuredHeaderLeft}>
                <span className={styles.featuredIcon} aria-hidden>
                  {/* The featured module's icon comes via the directory entry. */}
                  {MACRO_DIRECTORY.find((r) => r.isFeatured)?.emoji ?? ""}
                </span>
                <span className={styles.featuredTitle}>
                  {featuredModule?.title ?? featuredModuleSlug}
                </span>
                {headlineInd?.source && (
                  <span className={styles.featuredSourceInline}>
                    · {headlineInd.source}
                  </span>
                )}
              </div>
              {featuredModule?.status === "live" && (
                <span className={styles.livePill}>live</span>
              )}
            </div>

            <div className={styles.headlineRow}>
              {headlineInd ? (
                <>
                  <span className={styles.headlineMajor}>
                    <CountUpValue
                      value={headlineInd.value / 1e9}
                      decimals={2}
                      duration={1500}
                    />
                  </span>
                  <div className={styles.headlineMinorBlock}>
                    <span className={styles.headlineMinor}>billion</span>
                    {growthInd && (
                      <span className={styles.growthPill}>
                        <span className={styles.growthArrow} aria-hidden>
                          ↑
                        </span>
                        <span className={styles.growthValue}>
                          <CountUpValue
                            value={growthInd.value}
                            decimals={1}
                          />
                          % YoY
                        </span>
                      </span>
                    )}
                  </div>
                </>
              ) : (
                <span className={styles.headlineMajor}>{EM_DASH}</span>
              )}

              {rankInd && (
                <div className={styles.rankCallout}>
                  <div className={styles.rankLabel}>{FEATURED_RANK_LABEL}</div>
                  <div className={styles.rankValue}>
                    #
                    <CountUpValue value={rankInd.value} decimals={0} />
                  </div>
                  <div className={styles.rankSubtitle}>
                    {FEATURED_RANK_SUBTITLE}
                  </div>
                </div>
              )}
            </div>

            <div className={styles.featuredDesc}>{FEATURED_DESCRIPTION}</div>

            <div className={styles.featuredGrid}>
              {FEATURED_CELLS.map((cell) => (
                <FeaturedCellItem key={cell.label} cell={cell} data={data} />
              ))}
            </div>

            <div className={styles.featuredBottom}>
              <span className={styles.featuredSources}>
                Sources: {data.sources.slice(0, 3).join(" · ")}
              </span>
              <Link
                href={`/${locale}/india/${featuredModuleSlug}`}
                className={styles.openModuleLink}
              >
                Open module →
              </Link>
            </div>
          </div>

          {/* RIGHT — three-card stack */}
          <div className={styles.rightStack}>
            {RIGHT_STACK.map((card) => (
              <RightCardItem
                key={card.moduleSlug}
                card={card}
                data={data}
                locale={locale}
              />
            ))}
          </div>
        </div>
      </section>
    </VisibleCtx.Provider>
  );
}
