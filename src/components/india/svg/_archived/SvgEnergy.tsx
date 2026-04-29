/** Sun + wind turbine — renewable energy archetype. */

import { SvgFrame, type SvgProps } from "./SvgBase";

export default function SvgEnergy(props: SvgProps) {
  return (
    <SvgFrame {...props} title={props.title ?? "Energy"}>
      {({ fill, accent }) => (
        <>
          {/* Sun */}
          <circle cx="74" cy="74" r="22" fill={fill} />
          {Array.from({ length: 8 }).map((_, i) => {
            const a = (i * Math.PI) / 4;
            const x1 = 74 + Math.cos(a) * 32;
            const y1 = 74 + Math.sin(a) * 32;
            const x2 = 74 + Math.cos(a) * 44;
            const y2 = 74 + Math.sin(a) * 44;
            return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} />;
          })}
          {/* Wind turbine pole */}
          <line x1="160" y1="72" x2="160" y2="200" />
          {/* Hub */}
          <circle cx="160" cy="72" r="5" fill={accent} stroke="none" />
          {/* Three blades */}
          <path d="M160 72 q-10 -36 -36 -32 q14 22 36 32" fill={fill} />
          <path d="M160 72 q34 -8 50 14 q-26 6 -50 -14" fill={fill} />
          <path d="M160 72 q-12 22 4 50 q12 -22 -4 -50" fill={fill} />
          {/* Ground */}
          <line x1="40" y1="208" x2="200" y2="208" />
        </>
      )}
    </SvgFrame>
  );
}
