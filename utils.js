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

/**
 * Identifies the t value for two lines such that they result in the same lerp
 * If 0, lines are parallel
 * @param {Number} A
 * @param {Number} B
 * @param {Number} C
 * @param {Number} D
 */
function getIntersection(A, B, C, D) {
  const tTop = (D.x - C.x) * (A.y - C.y) - (D.y - C.y) * (A.x - C.x);
  const uTop = (C.y - A.y) * (A.x - B.x) - (C.x - A.x) * (A.y - B.y);
  const bottom = (D.y - C.y) * (B.x - A.x) - (D.x - C.x) * (B.y - A.y);

  if (bottom === 0) return null;

  const t = tTop / bottom;
  const u = uTop / bottom;
  if (t < 0 || t > 1 || u < 0 || u > 1) return null;

  return {
    x: lerp(A.x, B.x, t),
    y: lerp(A.y, B.y, t),
    offset: t,
  };
}

/**
 * Find the intersection of two polygons
 * @param {Polygon} poly1
 * @param {Polygon} poly2
 * @returns {Boolean}
 */
function polysIntersect(poly1, poly2) {
  for (let i = 0; i < poly1.length; i++) {
    for (let j = 0; j < poly2.length; j++) {
      // % - prevents overflow and ensures last segment is included in check
      const touch = getIntersection(
        poly1[i],
        poly1[(i + 1) % poly1.length],
        poly2[j],
        poly2[(j + 1) % poly2.length]
      );
      if (touch) return true;
    }
  }

  return false;
}

function getRGBA(value) {
  const alpha = Math.abs(value);
  const R = value < 0 ? 0 : 255;
  const G = R;
  const B = value > 0 ? 0 : 255;
  return "rgba(" + R + "," + G + "," + B + "," + alpha + ")";
}
