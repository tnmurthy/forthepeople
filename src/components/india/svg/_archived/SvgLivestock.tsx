/** Stylised cow silhouette — minimal lines, side-on. */

import { SvgFrame, type SvgProps } from "./SvgBase";

export default function SvgLivestock(props: SvgProps) {
  return (
    <SvgFrame {...props} title={props.title ?? "Livestock"}>
      {({ fill }) => (
        <>
          {/* Body */}
          <path d="M58 132 h110 q14 0 14 14 v18 q0 6 -6 6 h-122 q-6 0 -6 -6 v-18 q0 -14 10 -14 z" fill={fill} />
          {/* Head */}
          <path d="M168 138 q22 -4 30 8 q4 6 -2 12 l-26 8 z" fill={fill} />
          {/* Horn (gentle curve) */}
          <path d="M188 142 q4 -10 12 -10" />
          {/* Eye */}
          <circle cx="184" cy="148" r="2" fill="currentColor" />
          {/* Legs */}
          <line x1="78" y1="170" x2="78" y2="200" />
          <line x1="98" y1="170" x2="98" y2="200" />
          <line x1="148" y1="170" x2="148" y2="200" />
          <line x1="168" y1="170" x2="168" y2="200" />
          {/* Tail */}
          <path d="M58 138 q-12 0 -16 12" />
          {/* Ground */}
          <line x1="60" y1="208" x2="180" y2="208" />
        </>
      )}
    </SvgFrame>
  );
}
