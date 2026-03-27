/** Quadratic ease in-out (same as original: t < .5 ? 2*t*t : -1+(4-2*t)*t) */
export function easeInOut(t: number): number {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}
