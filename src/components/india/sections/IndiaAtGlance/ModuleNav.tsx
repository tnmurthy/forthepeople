/**
 * Module nav row at the bottom of the IndiaAtGlance band.
 * Renders one inline link per macro module (slug + title from the
 * registry). Locale comes from the page; URL pattern matches
 * SuperCategoryPreviewBand's `/${locale}/india/${slug}`.
 */

import Link from "next/link";
import styles from "./styles.module.css";
import type { MacroModuleRef } from "@/lib/india/getMacroSnapshotData";

export function ModuleNav({
  modules,
  locale,
}: {
  modules: MacroModuleRef[];
  locale: string;
}) {
  if (modules.length === 0) return null;
  return (
    <nav className={styles.moduleNav} aria-label="Macro module links">
      <span className={styles.moduleNavLabel}>read more →</span>
      {modules.map((m, i) => (
        <span key={m.slug} className={styles.moduleNavItem}>
          <Link
            href={`/${locale}/india/${m.slug}`}
            className={styles.moduleLink}
          >
            {m.title}
          </Link>
          {i < modules.length - 1 && (
            <span className={styles.moduleSep} aria-hidden>
              ·
            </span>
          )}
        </span>
      ))}
    </nav>
  );
}
