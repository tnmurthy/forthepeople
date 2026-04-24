/**
 * Subtle NEW pill that auto-disappears 30 days after launch.
 *
 * Defaults to `subtle` per Jayanth's explicit "shouldn't be that much
 * covering or something" guidance. No animation, no bounce, no pulse.
 * Uses inline styles to match the repo's existing aesthetic (Plus Jakarta
 * Sans, #E8E8E4 borders, warm palette).
 */

import { isModuleNew } from "@/lib/config/module-launches";

export function NewPill({
  slug,
  subtle = true,
}: {
  slug: string;
  subtle?: boolean;
}) {
  if (!isModuleNew(slug)) return null;

  const base: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    padding: "1px 6px",
    marginLeft: 6,
    borderRadius: 10,
    fontSize: 9,
    fontWeight: 600,
    letterSpacing: "0.04em",
    lineHeight: 1.4,
    textTransform: "uppercase",
    verticalAlign: "middle",
  };

  const subtleVariant: React.CSSProperties = {
    background: "#ECFDF5",
    color: "#065F46",
    border: "1px solid #A7F3D0",
  };

  const loudVariant: React.CSSProperties = {
    background: "#16A34A",
    color: "#FFFFFF",
    border: "1px solid #15803D",
  };

  return (
    <span
      style={{ ...base, ...(subtle ? subtleVariant : loudVariant) }}
      aria-label="Recently added"
    >
      NEW
    </span>
  );
}
