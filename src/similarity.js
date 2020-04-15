import normArray from 'ml-array-normed';
import { similarity as Similarity } from 'ml-distance';
import { XY } from 'ml-spectra-processing';

const intersection = Similarity.intersection;

/**
 * @typedef {object} SimStats Data type exported by `similarity()`
 * @property {number} similarity similarity between the two spectra
 * @property {number} common number of entries considered common by the align algorithm
 */

/**
 * Returns the similarity between two spectra
 * @param {Entry} experiment First spectrum
 * @param {Entry} prediction Second spectrum
 * @param {object}   [options={}]
 * @param {function} [options.algorithm=intersection] Algorithm used to calculate the similarity between the spectra. Default is cosine similarity.
 * @param {number}   [options.alignDelta=0.05] Two values of a experiment and prediction which difference is smaller than `alignDelta` will be put in the same X slot (considered as common).
 * @param {number}   [options.minCommon=6] Minimal number of values that must remain in the spectra after alignment.
 * @param {bool}     [options.norm=false] If `true`, the spectra data are normalized before being sent to the similarity algorithm.
 * @param {function} [options.massWeight=defaultMassWeight] Function that weights a y value by a function of x.
 * @returns {SimStats} Information on the similarity between the 2 spectra
 */
export default function similarity(experiment, prediction, options = {}) {
  const {
    algorithm = intersection,
    alignDelta = 0.05,
    minCommon = 6,
    norm = false,
    massWeight = defaultMassWeight,
  } = options;

  let aligned = XY.align(experiment.data, prediction.data, {
    delta: alignDelta,
    common: true,
  });

  // console.log(aligned);

  let commonCount = aligned.x.length;

  if (commonCount < minCommon) {
    // console.log('Insufficient common entries.');
    return { similarity: 0, common: commonCount };
  }

  // weighting the data (weight y by x, or x^2 or ...)
  for (let i = 0; i < aligned.x.length; i++) {
    aligned.y1[i] = massWeight(aligned.x[i], aligned.y1[i]);
    aligned.y2[i] = massWeight(aligned.x[i], aligned.y2[i]);
  }

  let exp = aligned.y1;
  let pred = aligned.y2;
  // console.log(exp, pred);

  if (norm) {
    // norm here gives really bad results!
    exp = normArray(aligned.y1);
    pred = normArray(aligned.y2);
  }
  // console.log(exp, pred);
  return { similarity: algorithm(exp, pred), common: commonCount };
}

/**
 * Default function used to weight the experimental and predicted spectra: `y=y*x^3`. The y values are a function of the x values.
 * @param {number} x x value
 * @param {number} y y value
 * @returns {number} weighted y value
 */
function defaultMassWeight(x, y) {
  y *= x ** 3;
  return y;
}
