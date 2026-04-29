/** Three abstract people silhouettes — different heights to suggest demographic variation. */

import { SvgFrame, type SvgProps } from "./SvgBase";

export default function SvgDemographics(props: SvgProps) {
  return (
    <SvgFrame {...props} title={props.title ?? "Demographics"}>
      {({ fill }) => (
        <>
          {/* Three figures, decreasing height left → right (representing age cohorts) */}
          <g>
            <circle cx="70" cy="80" r="20" fill={fill} />
            <path d="M50 110 q20 -8 40 0 v60 q0 10 -10 10 h-20 q-10 0 -10 -10 z" fill={fill} />
          </g>
          <g>
            <circle cx="120" cy="70" r="22" fill={fill} />
            <path d="M98 102 q22 -10 44 0 v68 q0 10 -10 10 h-24 q-10 0 -10 -10 z" fill={fill} />
          </g>
          <g>
            <circle cx="174" cy="86" r="18" fill={fill} />
            <path d="M156 114 q18 -8 36 0 v56 q0 10 -10 10 h-16 q-10 0 -10 -10 z" fill={fill} />
          </g>
          {/* Floor line */}
          <path d="M40 198 h160" />
        </>
      )}
    </SvgFrame>
  );
}
