/** Olympic-style medal hanging from a ribbon, plus a torch. */

import { SvgFrame, type SvgProps } from "./SvgBase";

export default function SvgSports(props: SvgProps) {
  return (
    <SvgFrame {...props} title={props.title ?? "Sports"}>
      {({ fill, accent }) => (
        <>
          {/* Medal ribbon */}
          <path d="M104 30 L84 90 L96 96 L116 36 z" fill={fill} />
          <path d="M136 30 L156 90 L144 96 L124 36 z" fill={fill} />
          {/* Medal disc */}
          <circle cx="120" cy="130" r="36" fill={fill} />
          <circle cx="120" cy="130" r="22" fill="#FFFFFF" stroke={accent} />
          {/* Star inside */}
          <path
            d="M120 116 l5 12 l13 1 l-10 9 l3 13 l-11 -7 l-11 7 l3 -13 l-10 -9 l13 -1 z"
            fill={accent}
            stroke="none"
          />
          {/* Torch on the right */}
          <g transform="translate(184 86)">
            <path d="M-8 0 q4 -22 16 -28 q12 16 -4 32 q-6 8 -12 -4 z" fill={accent} stroke={accent} />
            <rect x="-2" y="0" width="6" height="36" fill={fill} />
            <rect x="-6" y="36" width="14" height="6" fill={fill} />
          </g>
          {/* Ground */}
          <line x1="40" y1="200" x2="200" y2="200" />
        </>
      )}
    </SvgFrame>
  );
}
