/** Mountain peaks with a small temple silhouette. */

import { SvgFrame, type SvgProps } from "./SvgBase";

export default function SvgTourism(props: SvgProps) {
  return (
    <SvgFrame {...props} title={props.title ?? "Tourism"}>
      {({ fill, accent }) => (
        <>
          {/* Sun */}
          <circle cx="172" cy="76" r="14" fill={accent} stroke="none" />
          {/* Back mountain */}
          <path d="M40 200 L100 88 L160 200 z" fill={fill} />
          <path d="M86 116 L100 100 L114 116" stroke="#FFFFFF" />
          {/* Front mountain */}
          <path d="M100 200 L150 116 L200 200 z" fill={fill} />
          <path d="M138 132 L150 120 L162 132" stroke="#FFFFFF" />
          {/* Temple silhouette in foreground */}
          <g transform="translate(78 168)">
            <rect x="0" y="0" width="40" height="28" fill={fill} />
            <path d="M-4 0 L20 -16 L44 0 z" fill={fill} />
            <line x1="20" y1="-16" x2="20" y2="-22" />
            <circle cx="20" cy="-26" r="3" fill={accent} stroke="none" />
            <rect x="14" y="14" width="12" height="14" fill="#FFFFFF" stroke={accent} />
          </g>
          {/* Ground */}
          <line x1="30" y1="200" x2="210" y2="200" />
        </>
      )}
    </SvgFrame>
  );
}
