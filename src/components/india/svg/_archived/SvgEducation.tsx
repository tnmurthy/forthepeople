/** Open book + graduation cap. */

import { SvgFrame, type SvgProps } from "./SvgBase";

export default function SvgEducation(props: SvgProps) {
  return (
    <SvgFrame {...props} title={props.title ?? "Education"}>
      {({ fill, accent }) => (
        <>
          {/* Mortarboard */}
          <path d="M120 56 L60 84 L120 112 L180 84 z" fill={fill} />
          <line x1="120" y1="112" x2="120" y2="138" />
          <path d="M120 138 q-14 -2 -14 -16" />
          <circle cx="106" cy="120" r="3" fill={accent} stroke="none" />
          {/* Book pages */}
          <path d="M60 150 q60 -10 60 0 q0 -10 60 0 v40 q-60 -10 -60 0 q0 -10 -60 0 z" fill={fill} />
          <path d="M120 150 v40" />
          {/* Lines on pages */}
          <g opacity="0.6">
            <path d="M74 162 q40 -6 40 2" />
            <path d="M74 174 q40 -6 40 2" />
            <path d="M126 164 q40 -6 40 2" />
            <path d="M126 176 q40 -6 40 2" />
          </g>
          {/* Base shelf */}
          <line x1="50" y1="208" x2="190" y2="208" />
        </>
      )}
    </SvgFrame>
  );
}
