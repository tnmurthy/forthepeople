/** Highway with a stylised cable-stay bridge in the background. */

import { SvgFrame, type SvgProps } from "./SvgBase";

export default function SvgInfrastructure(props: SvgProps) {
  return (
    <SvgFrame {...props} title={props.title ?? "Infrastructure"}>
      {({ fill, accent }) => (
        <>
          {/* Bridge towers */}
          <line x1="80" y1="40" x2="80" y2="160" />
          <line x1="160" y1="40" x2="160" y2="160" />
          {/* Suspension cables */}
          <path d="M80 50 q40 60 80 0" />
          <path d="M80 60 L160 60" />
          {/* Cable verticals */}
          {[100, 120, 140].map((x) => (
            <line key={x} x1={x} y1="62" x2={x} y2="158" />
          ))}
          {/* Deck */}
          <rect x="50" y="160" width="140" height="10" fill={fill} />
          {/* Highway perspective lines */}
          <path d="M40 220 L120 180 L200 220" fill={fill} />
          {/* Lane dashes */}
          <g strokeDasharray="6 6" stroke={accent}>
            <line x1="80" y1="220" x2="120" y2="200" />
            <line x1="160" y1="220" x2="120" y2="200" />
          </g>
        </>
      )}
    </SvgFrame>
  );
}
