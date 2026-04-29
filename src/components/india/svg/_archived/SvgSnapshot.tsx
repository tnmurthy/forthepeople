/**
 * Stylised India outline + 3-dot tricolor accent. Abstract — not
 * intended to be cartographically precise (and explicitly NOT the flag
 * or any govt emblem). The tricolor dots come from the FTP logo motif.
 */

import { SvgFrame, type SvgProps } from "./SvgBase";

export default function SvgSnapshot(props: SvgProps) {
  return (
    <SvgFrame {...props} title={props.title ?? "India snapshot"}>
      {({ fill }) => (
        <>
          <path
            d="M88 38 q12 -10 26 -8 q22 4 38 -2 q14 -4 22 8 q14 22 -2 50 q-6 12 4 22 q14 14 -2 36 q-12 16 4 32 q10 12 -10 26 q-22 16 -34 50 q-8 22 -28 -8 q-16 -24 -28 -28 q-26 -10 -22 -36 q4 -22 -16 -34 q-22 -12 -10 -36 q14 -28 26 -42 q12 -14 32 -30 z"
            fill={fill}
          />
          <circle cx="58" cy="200" r="6" fill="#FF9933" stroke="none" />
          <circle cx="74" cy="208" r="6" fill="#9B9B9B" stroke="none" />
          <circle cx="90" cy="216" r="6" fill="#138808" stroke="none" />
        </>
      )}
    </SvgFrame>
  );
}
