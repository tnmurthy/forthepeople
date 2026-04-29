/** Three wheat stalks bound at the base. */

import { SvgFrame, type SvgProps } from "./SvgBase";

export default function SvgAgriculture(props: SvgProps) {
  return (
    <SvgFrame {...props} title={props.title ?? "Agriculture"}>
      {({ fill, accent }) => {
        const Stalk = ({ x, lean = 0 }: { x: number; lean?: number }) => (
          <g transform={`translate(${x} 0) rotate(${lean} 0 200)`}>
            <line x1="0" y1="200" x2="0" y2="80" />
            {[100, 120, 140, 160].map((y) => (
              <g key={y}>
                <path d={`M0 ${y} q-12 -10 -16 -22 q14 4 16 22 z`} fill={fill} />
                <path d={`M0 ${y} q12 -10 16 -22 q-14 4 -16 22 z`} fill={fill} />
              </g>
            ))}
            {/* Top tassel */}
            <path d="M0 80 q-6 -14 0 -28 q6 14 0 28 z" fill={fill} />
          </g>
        );
        return (
          <>
            <Stalk x={120} lean={-10} />
            <Stalk x={120} lean={0} />
            <Stalk x={120} lean={10} />
            {/* Binding ribbon */}
            <path d="M104 200 q16 8 32 0" stroke={accent} strokeWidth={3} />
            {/* Ground */}
            <line x1="60" y1="218" x2="180" y2="218" />
          </>
        );
      }}
    </SvgFrame>
  );
}
