/**
 * IndiaAtGlanceSection — magazine-spread band that replaces the generic
 * SuperCategoryPreviewBand for the macro-snapshot super-category only.
 * Other 9 super-categories continue to use the band template.
 *
 * Server component. Awaits getMacroSnapshotData on the server, then
 * hands plain values to client children that own the animations.
 *
 * data-tint-id="macro" is preserved (NOT "macro-snapshot") because
 * ScrollColorShift / scroll progress bar key off the tint id, not the
 * super-category slug.
 */

import { getMacroSnapshotData } from "@/lib/india/getMacroSnapshotData";
import styles from "./styles.module.css";
import { Sidebar } from "./Sidebar";
import { Headline } from "./Headline";
import { Context } from "./Context";
import { StatGrid } from "./StatGrid";
import { ModuleNav } from "./ModuleNav";
import { Backdrop } from "./Backdrop";
import { MACRO_MASTHEAD_LABEL } from "./metrics";

export async function IndiaAtGlanceSection({ locale }: { locale: string }) {
  const data = await getMacroSnapshotData();
  const sectionNumber = data.superCategory.displayOrder;
  const total = data.totalSuperCategories;

  return (
    <section
      data-tint-id="macro"
      className={styles.section}
      aria-labelledby="india-at-a-glance-title"
    >
      <Backdrop />
      <div className={styles.layout}>
        <Sidebar
          sectionNumber={sectionNumber}
          totalSections={total}
          liveCount={data.liveCount}
          totalCount={data.totalCount}
          sources={data.sources}
          lastRefreshAt={data.lastRefreshAt}
        />
        <div className={styles.main}>
          <header className={styles.masthead}>
            <span
              id="india-at-a-glance-title"
              className={styles.mastheadLabel}
            >
              {MACRO_MASTHEAD_LABEL}
            </span>
            <span className={styles.mastheadIndex}>
              no. {String(sectionNumber).padStart(2, "0")} / {total}
            </span>
            <span className={styles.scanLine} aria-hidden />
          </header>

          <div className={styles.heroRow}>
            <Headline indicatorByKey={data.indicatorByKey} />
            <Context editorialText={data.superCategory.editorialContext ?? null} />
          </div>

          <StatGrid indicatorByKey={data.indicatorByKey} />

          <ModuleNav modules={data.modules} locale={locale} />
        </div>
      </div>
    </section>
  );
}
