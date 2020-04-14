/**
 * Default function used to weight the experimental and predicted spectra: `y = y*x^3`. The y values are a function of the x values.
 * @param {number} x x value
 * @param {number} y y value
 * @returns {number} weighted y value
 */
export default function defaultMassWeight(x, y) {
  y *= x ** 3;
  return y;
}
