/** Rocket inside an atom — orbits around a launching rocket. */

import { SvgFrame, type SvgProps } from "./SvgBase";

export default function SvgScience(props: SvgProps) {
  return (
    <SvgFrame {...props} title={props.title ?? "Science"}>
      {({ fill, accent }) => (
        <>
          {/* Rocket body */}
          <path d="M120 40 q14 18 14 50 v60 h-28 v-60 q0 -32 14 -50 z" fill={fill} />
          {/* Window */}
          <circle cx="120" cy="92" r="8" fill="none" stroke={accent} />
          {/* Fins */}
          <path d="M106 150 l-18 22 l18 -2 z" fill={fill} />
          <path d="M134 150 l18 22 l-18 -2 z" fill={fill} />
          {/* Flame */}
          <path d="M112 172 q8 24 16 0 q4 16 -8 22 q-12 -6 -8 -22 z" fill={accent} stroke={accent} />
          {/* Atom orbits */}
          <ellipse cx="120" cy="120" rx="80" ry="30" />
          <ellipse cx="120" cy="120" rx="80" ry="30" transform="rotate(60 120 120)" />
          <ellipse cx="120" cy="120" rx="80" ry="30" transform="rotate(-60 120 120)" />
          {/* Electrons */}
          <circle cx="200" cy="120" r="4" fill={accent} stroke="none" />
          <circle cx="58" cy="148" r="4" fill={accent} stroke="none" />
          <circle cx="58" cy="92" r="4" fill={accent} stroke="none" />
        </>
      )}
    </SvgFrame>
  );
}
