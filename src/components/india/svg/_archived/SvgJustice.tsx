/** Scales of justice — abstract beam + two pans. */

import { SvgFrame, type SvgProps } from "./SvgBase";

export default function SvgJustice(props: SvgProps) {
  return (
    <SvgFrame {...props} title={props.title ?? "Justice"}>
      {({ fill }) => (
        <>
          {/* Central pillar */}
          <line x1="120" y1="40" x2="120" y2="200" />
          <circle cx="120" cy="40" r="6" fill={fill} />
          {/* Cross-beam */}
          <line x1="50" y1="80" x2="190" y2="80" />
          {/* Left pan */}
          <line x1="70" y1="80" x2="70" y2="120" />
          <path d="M40 120 q30 24 60 0 q-30 -10 -60 0 z" fill={fill} />
          {/* Right pan */}
          <line x1="170" y1="80" x2="170" y2="124" />
          <path d="M140 124 q30 22 60 0 q-30 -10 -60 0 z" fill={fill} />
          {/* Base */}
          <rect x="100" y="200" width="40" height="10" fill={fill} />
          <line x1="80" y1="216" x2="160" y2="216" />
        </>
      )}
    </SvgFrame>
  );
}
