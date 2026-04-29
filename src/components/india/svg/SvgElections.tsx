/** Ballot box + ballot sliding in. */

import { SvgFrame, type SvgProps } from "./SvgBase";

export default function SvgElections(props: SvgProps) {
  return (
    <SvgFrame {...props} title={props.title ?? "Elections"}>
      {({ fill, accent }) => (
        <>
          {/* Box body */}
          <rect x="56" y="120" width="128" height="80" rx="6" fill={fill} />
          {/* Slot */}
          <rect x="84" y="116" width="72" height="8" rx="2" stroke={accent} fill={accent} />
          {/* Ballot paper sliding in */}
          <g transform="translate(96 50) rotate(-12)">
            <rect x="0" y="0" width="60" height="60" fill="#FFFFFF" stroke={accent} />
            <line x1="8" y1="12" x2="48" y2="12" />
            <line x1="8" y1="22" x2="48" y2="22" />
            <line x1="8" y1="32" x2="36" y2="32" />
            {/* Tick mark */}
            <path d="M14 46 l8 8 l24 -20" stroke={accent} fill="none" strokeWidth={3} />
          </g>
          {/* Ground */}
          <line x1="40" y1="216" x2="200" y2="216" />
        </>
      )}
    </SvgFrame>
  );
}
