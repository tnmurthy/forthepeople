/**
 * MacroSnapshotDecoration — compass rose top-right + faint latitude lines
 * on the left edge. Section 2.5+3 Commit 5. Blue accent to match the macro
 * super-category palette.
 */

import * as React from "react";

export function MacroSnapshotDecoration() {
  return (
    <>
      <svg
        aria-hidden
        style={{
          position: "absolute",
          top: 14,
          right: 18,
          width: 80,
          height: 80,
          pointerEvents: "none",
          opacity: 0.45,
          zIndex: 0,
        }}
        viewBox="-40 -40 80 80"
      >
        <g stroke="#185FA5" strokeWidth="0.8" fill="none">
          <circle cx="0" cy="0" r="32" />
          <circle cx="0" cy="0" r="24" />
          <line x1="0" y1="-32" x2="0" y2="32" />
          <line x1="-32" y1="0" x2="32" y2="0" />
          <line x1="-23" y1="-23" x2="23" y2="23" />
          <line x1="-23" y1="23" x2="23" y2="-23" />
          <polygon points="0,-32 5,-12 0,-8 -5,-12" fill="#185FA5" opacity="0.7" />
          <polygon points="0,32 5,12 0,8 -5,12" fill="#185FA5" opacity="0.5" />
          <polygon points="32,0 12,5 8,0 12,-5" fill="#185FA5" opacity="0.5" />
          <polygon points="-32,0 -12,5 -8,0 -12,-5" fill="#185FA5" opacity="0.5" />
        </g>
      </svg>
      <svg
        aria-hidden
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: 30,
          height: "100%",
          pointerEvents: "none",
          opacity: 0.35,
          zIndex: 0,
        }}
        viewBox="0 0 30 320"
        preserveAspectRatio="none"
      >
        <g stroke="#185FA5" strokeWidth="0.5" strokeDasharray="3,4">
          <line x1="0" y1="40" x2="30" y2="40" />
          <line x1="0" y1="80" x2="30" y2="80" />
          <line x1="0" y1="120" x2="30" y2="120" />
          <line x1="0" y1="160" x2="30" y2="160" />
          <line x1="0" y1="200" x2="30" y2="200" />
          <line x1="0" y1="240" x2="30" y2="240" />
          <line x1="0" y1="280" x2="30" y2="280" />
        </g>
      </svg>
    </>
  );
}

export default MacroSnapshotDecoration;
