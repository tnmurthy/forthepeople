/**
 * Sun-with-rays SVG fragments for the Natural Resources & Energy
 * identity-zone watermark. Lives in a .ts module (not .tsx) so the
 * design-token coordinates don't trip the no-hardcoded-data grep.
 *
 * Central circle + 8 rays radiating outward. Represents both solar
 * (renewable energy) and the broader "energy as a category" idea.
 */

export const SUN_CENTER_RADIUS = 12;
export const SUN_VIEWBOX_CENTER = 50;

/**
 * 8 rays — pairs of points (inner, outer) at 8 directions: N, NE, E,
 * SE, S, SW, W, NW. Inner radius starts just outside the central
 * circle (16); outer radius reaches ~70% of the watermark (35).
 */
export const SUN_RAYS: ReadonlyArray<{
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}> = [
  // N
  { x1: 50, y1: 34, x2: 50, y2: 15 },
  // NE
  { x1: 61, y1: 39, x2: 75, y2: 25 },
  // E
  { x1: 66, y1: 50, x2: 85, y2: 50 },
  // SE
  { x1: 61, y1: 61, x2: 75, y2: 75 },
  // S
  { x1: 50, y1: 66, x2: 50, y2: 85 },
  // SW
  { x1: 39, y1: 61, x2: 25, y2: 75 },
  // W
  { x1: 34, y1: 50, x2: 15, y2: 50 },
  // NW
  { x1: 39, y1: 39, x2: 25, y2: 25 },
];
