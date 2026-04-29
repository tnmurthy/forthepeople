/** Cargo ship with stacked containers. */

import { SvgFrame, type SvgProps } from "./SvgBase";

export default function SvgTrade(props: SvgProps) {
  return (
    <SvgFrame {...props} title={props.title ?? "Trade"}>
      {({ fill, accent }) => (
        <>
          {/* Hull */}
          <path d="M40 158 h160 l-20 36 q-2 4 -8 4 h-104 q-6 0 -8 -4 z" fill={fill} />
          {/* Containers — three rows */}
          <g stroke={accent} fill="#FFFFFF">
            <rect x="60" y="120" width="32" height="20" />
            <rect x="96" y="120" width="32" height="20" />
            <rect x="132" y="120" width="32" height="20" />
            <rect x="78" y="98" width="32" height="20" />
            <rect x="114" y="98" width="32" height="20" />
            <rect x="96" y="76" width="32" height="20" />
          </g>
          {/* Bridge tower at the back */}
          <rect x="170" y="100" width="22" height="58" fill={fill} stroke={accent} />
          {/* Smokestack */}
          <rect x="178" y="84" width="6" height="20" fill={accent} stroke={accent} />
          {/* Waves */}
          <path d="M40 208 q12 -8 24 0 q12 8 24 0 q12 -8 24 0 q12 8 24 0 q12 -8 24 0 q12 8 24 0" />
        </>
      )}
    </SvgFrame>
  );
}
