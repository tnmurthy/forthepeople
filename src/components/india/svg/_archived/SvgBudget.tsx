/**
 * Stylised Parliament-dome silhouette — pillars + dome. Deliberately
 * generic (no Ashoka emblem, no specific govt building, no flag). The
 * dome shape is a universally legible "legislature" cue.
 */

import { SvgFrame, type SvgProps } from "./SvgBase";

export default function SvgBudget(props: SvgProps) {
  return (
    <SvgFrame {...props} title={props.title ?? "Budget"}>
      {({ fill }) => (
        <>
          {/* Dome */}
          <path d="M70 110 q50 -70 100 0" fill={fill} />
          <path d="M120 38 v8" />
          <circle cx="120" cy="34" r="6" fill={fill} />
          {/* Architrave */}
          <rect x="62" y="110" width="116" height="10" fill={fill} />
          {/* Pillars */}
          {[78, 100, 122, 144, 166].map((x) => (
            <line key={x} x1={x} y1="120" x2={x} y2="180" />
          ))}
          {/* Base */}
          <rect x="56" y="180" width="128" height="12" fill={fill} />
          <line x1="50" y1="198" x2="190" y2="198" />
        </>
      )}
    </SvgFrame>
  );
}
