/** Plus + heartbeat line — abstract medical archetype. */

import { SvgFrame, type SvgProps } from "./SvgBase";

export default function SvgHealth(props: SvgProps) {
  return (
    <SvgFrame {...props} title={props.title ?? "Health"}>
      {({ fill }) => (
        <>
          {/* Cross / plus */}
          <rect x="100" y="60" width="40" height="120" rx="8" fill={fill} />
          <rect x="60" y="100" width="120" height="40" rx="8" fill={fill} />
          {/* Heartbeat line */}
          <path d="M40 200 h22 l8 -28 l14 56 l10 -28 h26 l8 -16 l10 16 h70" />
        </>
      )}
    </SvgFrame>
  );
}
