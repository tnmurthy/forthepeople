/**
 * GlobeOrnamentDivider — small peacock-blue globe between two faded
 * rules. Used between the IndiaKpiStrip and IndiaInTheWorldCard to
 * signal "the world view of India" without the visual weight of a
 * second Mughal arch in close succession.
 *
 * Pure SVG (lucide-react Globe) + CSS module — no JS, no animation,
 * no client boundary needed.
 */

import { Globe } from "lucide-react";
import styles from "./GlobeOrnamentDivider.module.css";

export function GlobeOrnamentDivider() {
  return (
    <div role="separator" aria-hidden="true" className={styles.divider}>
      <span className={styles.line} />
      <Globe className={styles.icon} strokeWidth={1.2} aria-hidden="true" />
      <span className={styles.line} />
    </div>
  );
}

export default GlobeOrnamentDivider;
