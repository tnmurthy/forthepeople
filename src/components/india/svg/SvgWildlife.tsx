/**
 * Tiger — Jayanth's canonical category. Stylised standing-tiger
 * profile with simple stripe lines and a head turned slightly toward
 * the viewer. Single colour line art with the soft accent fill.
 */

import { SvgFrame, type SvgProps } from "./SvgBase";

export default function SvgWildlife(props: SvgProps) {
  return (
    <SvgFrame {...props} title={props.title ?? "Wildlife"}>
      {({ fill, accent }) => (
        <>
          {/* Body — torso elongated, slight curve along the back */}
          <path
            d="M50 148
               q4 -22 32 -28
               q14 -2 28 -2
               q40 0 64 14
               q14 8 18 24
               q2 14 -10 22
               q-10 6 -28 6
               h-90
               q-18 0 -18 -16
               z"
            fill={fill}
          />
          {/* Head — turned ~10° toward viewer */}
          <path
            d="M152 142
               q22 -16 38 -8
               q14 8 12 22
               q-2 12 -16 16
               q-14 4 -26 -4
               q-12 -8 -8 -26
               z"
            fill={fill}
          />
          {/* Ears */}
          <path d="M168 122 q4 -16 14 -10 q4 4 0 14" />
          <path d="M188 122 q4 -16 14 -10 q4 4 -2 14" />
          {/* Eyes (just dots) */}
          <circle cx="174" cy="148" r="2" fill={accent} stroke="none" />
          <circle cx="188" cy="148" r="2" fill={accent} stroke="none" />
          {/* Snout + nose */}
          <path d="M178 156 q4 6 12 4" />
          <circle cx="182" cy="160" r="1.6" fill={accent} stroke="none" />
          {/* Front legs */}
          <line x1="72" y1="174" x2="72" y2="208" />
          <line x1="96" y1="174" x2="96" y2="208" />
          {/* Back legs */}
          <path d="M148 172 q-2 24 -10 36" />
          <path d="M170 172 q4 22 14 32" />
          {/* Tail — long arching line */}
          <path d="M44 142 q-14 -8 -14 -28 q0 -18 14 -22 q12 -2 16 12" />
          {/* Stripes — thin vertical accents along the body */}
          <g strokeWidth="2.2">
            <path d="M86 134 q-2 14 0 28" />
            <path d="M104 134 q-2 14 0 28" />
            <path d="M124 134 q-2 14 0 28" />
            <path d="M142 134 q-2 14 0 28" />
          </g>
          {/* Ground */}
          <line x1="40" y1="216" x2="200" y2="216" />
        </>
      )}
    </SvgFrame>
  );
}
