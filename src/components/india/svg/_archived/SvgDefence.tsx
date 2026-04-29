/**
 * Stylised shield. Deliberately abstract — no military insignia, no
 * national emblem, no rank chevrons, no weapons (file 31 §4 — ZERO
 * govt iconography for the Defence section, which is the most
 * legally sensitive).
 */

import { SvgFrame, type SvgProps } from "./SvgBase";

export default function SvgDefence(props: SvgProps) {
  return (
    <SvgFrame {...props} title={props.title ?? "Defence"}>
      {({ fill, accent }) => (
        <>
          {/* Shield outline */}
          <path
            d="M120 36
               q-46 6 -64 18
               v50
               q0 60 64 96
               q64 -36 64 -96
               v-50
               q-18 -12 -64 -18 z"
            fill={fill}
          />
          {/* Inner divider — abstract horizontal bar */}
          <path d="M68 116 h104" />
          {/* Diamond accent — purely geometric, no emblem */}
          <path d="M120 130 l18 18 l-18 18 l-18 -18 z" fill="none" stroke={accent} />
        </>
      )}
    </SvgFrame>
  );
}
