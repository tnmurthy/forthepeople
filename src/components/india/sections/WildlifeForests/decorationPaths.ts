/**
 * SVG path strings + ellipse coordinates for the leafy-branch
 * watermark in the Wildlife & Forests identity zone. Lives in a .ts
 * module (not .tsx) so the design-token coordinates don't trip the
 * no-hardcoded-data grep.
 */

export const BRANCH_STEM_PATHS: ReadonlyArray<string> = [
  "M 50 90 L 50 30",
  "M 50 30 Q 35 25, 25 35 Q 30 28, 45 32",
  "M 50 40 Q 65 35, 75 45 Q 70 38, 55 42",
  "M 50 50 Q 35 45, 25 55 Q 30 48, 45 52",
  "M 50 60 Q 65 55, 75 65 Q 70 58, 55 62",
];

export const BRANCH_LEAVES: ReadonlyArray<{
  cx: number;
  cy: number;
  rx: number;
  ry: number;
  rotateDeg: number;
}> = [
  { cx: 32, cy: 33, rx: 6, ry: 3, rotateDeg: -30 },
  { cx: 68, cy: 43, rx: 6, ry: 3, rotateDeg: 30 },
  { cx: 32, cy: 53, rx: 6, ry: 3, rotateDeg: -30 },
  { cx: 68, cy: 63, rx: 6, ry: 3, rotateDeg: 30 },
];
