/** Rupee symbol behind an ascending bar chart. */

import { SvgFrame, type SvgProps } from "./SvgBase";

export default function SvgEconomy(props: SvgProps) {
  return (
    <SvgFrame {...props} title={props.title ?? "Economy"}>
      {({ fill, accent }) => (
        <>
          {/* Rupee glyph (₹) */}
          <g opacity="0.35">
            <path d="M70 60 h70 M70 80 h70 M75 60 v90 q0 -30 30 -30 q30 0 30 30 l-50 -30" />
          </g>
          {/* Ascending bars */}
          <rect x="60" y="160" width="22" height="36" fill={fill} stroke={accent} />
          <rect x="92" y="140" width="22" height="56" fill={fill} stroke={accent} />
          <rect x="124" y="116" width="22" height="80" fill={fill} stroke={accent} />
          <rect x="156" y="92" width="22" height="104" fill={fill} stroke={accent} />
          {/* Trend line */}
          <path d="M71 152 L103 132 L135 108 L167 84" />
          <circle cx="167" cy="84" r="4" fill={accent} stroke={accent} />
        </>
      )}
    </SvgFrame>
  );
}
