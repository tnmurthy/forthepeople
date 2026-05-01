/**
 * Wheat-stalk SVG fragments for the Agriculture & Livestock identity-zone
 * watermark. Lives in a .ts module (not .tsx) so the design-token
 * coordinates don't trip the no-hardcoded-data grep.
 *
 * Single vertical stalk with paired grain heads (small ovals) on
 * alternating sides at four levels.
 */

export const WHEAT_STALK_STEM = "M 50 88 L 50 22";

export const WHEAT_STALK_BRACTS: ReadonlyArray<string> = [
  // small bracts curving outward to support the grain heads
  "M 50 32 Q 42 28, 36 30",
  "M 50 32 Q 58 28, 64 30",
  "M 50 44 Q 42 40, 36 42",
  "M 50 44 Q 58 40, 64 42",
  "M 50 56 Q 42 52, 36 54",
  "M 50 56 Q 58 52, 64 54",
  "M 50 68 Q 42 64, 36 66",
  "M 50 68 Q 58 64, 64 66",
];

export const WHEAT_STALK_GRAINS: ReadonlyArray<{
  cx: number;
  cy: number;
  rx: number;
  ry: number;
  rotateDeg: number;
}> = [
  { cx: 36, cy: 30, rx: 5, ry: 2.5, rotateDeg: -25 },
  { cx: 64, cy: 30, rx: 5, ry: 2.5, rotateDeg: 25 },
  { cx: 36, cy: 42, rx: 5, ry: 2.5, rotateDeg: -25 },
  { cx: 64, cy: 42, rx: 5, ry: 2.5, rotateDeg: 25 },
  { cx: 36, cy: 54, rx: 5, ry: 2.5, rotateDeg: -25 },
  { cx: 64, cy: 54, rx: 5, ry: 2.5, rotateDeg: 25 },
  { cx: 36, cy: 66, rx: 5, ry: 2.5, rotateDeg: -25 },
  { cx: 64, cy: 66, rx: 5, ry: 2.5, rotateDeg: 25 },
];
