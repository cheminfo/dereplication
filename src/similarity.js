import normArray from 'ml-array-normed';
import { similarity as Similarity } from 'ml-distance';
import { XY } from 'ml-spectra-processing';

const cosine = Similarity.cosine;

/**
 * @typedef {object} SimStats Data type exported by `similarity()`
 * @property {number} similarity similarity between the two spectra
 * @property {number} common number of entries considered common by the align algorithm
 */

/**
 * Returns the similarity between two spectra
 * @param {Entry} experiment First spectrum
 * @param {Entry} prediction Second spectrum
 * @param {object} options
 * @param {function} [options.algorithm = cosine()] Algorithm used to calculate the similarity between the spectra. Default is cosine similarity.
 * @param {number} [options.alignDelta = 1] Two values of a experiment and prediction which difference is smaller than `alignDelta` will be put in the same X slot (considered as common).
 * @param {number} [options.minCommon = 6] Minimal number of values that must remain in the spectra after alignment.
 * @returns {SimStats} Information on the similarity between the 2 spectra
 */
export default function similarity(experiment, prediction, options = {}) {
  const { algorithm = cosine, minCommon = 6, alignDelta = 1 } = options;

  let aligned = XY.align(experiment.data, prediction.data, {
    delta: alignDelta,
    common: true,
  });

  let commonCount = aligned.x.length;

  if (commonCount < minCommon) {
    // console.log('Insufficient common entries.');
    return { similarity: 0, common: commonCount };
  }

  const y1 = normArray(aligned.y1);
  const y2 = normArray(aligned.y2);

  return { similarity: algorithm(y1, y2), common: commonCount };
}
