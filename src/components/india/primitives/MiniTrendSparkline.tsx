/**
 * MiniTrendSparkline — small filled-area sparkline used inside the
 * featured module card on the v3 split hero band (file 47 §4.6.4).
 *
 * Phase 4.6: simple polyline + linear gradient fill. Phase 5 may swap
 * for smooth bezier curves.
 *
 * Decorative trend cue, not exact reading — no axis labels.
 */

import * as React from "react";

export interface MiniTrendSparklineProps {
  values: number[];
  accentHex: string;
  className?: string;
  height?: number;
  ariaLabel?: string;
}

const VIEW_W = 200;

export function MiniTrendSparkline({
  values,
  accentHex,
  className,
  height = 32,
  ariaLabel,
}: MiniTrendSparklineProps) {
  if (!values || values.length === 0) {
    return null;
  }

  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;

  const stepX = VIEW_W / Math.max(values.length - 1, 1);
  const points = values
    .map((v, i) => {
      const x = i * stepX;
      const y = 28 - ((v - min) / range) * 24; // padding 4px top/bottom on a 32px viewBox
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");

  const areaPoints = `0,32 ${points} ${VIEW_W},32`;

  const gradientId = `mini-trend-${accentHex.replace("#", "")}`;

  return (
    <svg
      viewBox={`0 0 ${VIEW_W} 32`}
      width="100%"
      height={height}
      preserveAspectRatio="none"
      className={className}
      role={ariaLabel ? "img" : undefined}
      aria-label={ariaLabel}
      aria-hidden={ariaLabel ? undefined : true}
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={accentHex} stopOpacity="0.15" />
          <stop offset="100%" stopColor={accentHex} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={areaPoints} fill={`url(#${gradientId})`} />
      <polyline points={points} fill="none" stroke={accentHex} strokeWidth="1.5" />
    </svg>
  );
}

export default MiniTrendSparkline;
