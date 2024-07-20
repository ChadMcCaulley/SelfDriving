/**
 * Linear interpolation between two values A and B based on a parameter t.
 *
 * @function lerp
 * @param {number} A - The start value.
 * @param {number} B - The end value.
 * @param {number} t - The interpolation factor, typically between 0 and 1.
 * @returns {number} The interpolated value between A and B.
 *
 * @example
 * // Interpolate between 0 and 100 with a factor of 0.5
 * const interpolatedValue = lerp(0, 100, 0.5);
 * console.log(interpolatedValue); // Output: 50
 */
function lerp(A, B, t) {
  return A + (B - A) * t;
}
