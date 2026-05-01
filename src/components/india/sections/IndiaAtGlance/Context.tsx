/**
 * Drop-cap editorial paragraph beside the headline stat. The text comes
 * from the SuperCategory registry's editorialContext field; if absent,
 * renders nothing rather than padding with placeholder copy.
 */

import styles from "./styles.module.css";

export function Context({ editorialText }: { editorialText: string | null }) {
  if (!editorialText) return null;
  const firstChar = editorialText.charAt(0);
  const rest = editorialText.slice(1);
  return (
    <div className={styles.contextBlock}>
      <div className={styles.kicker}>in context</div>
      <p className={styles.contextProse}>
        <span className={styles.dropCap}>{firstChar}</span>
        {rest}
      </p>
    </div>
  );
}
