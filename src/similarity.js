import normArray from 'ml-array-normed';
import { similarity as Similarity } from 'ml-distance';
import { XY } from 'ml-spectra-processing';

const cosine = Similarity.cosine;

/**
 * @typedef {object} SimStats Data type exported by `similarity()`
 * @property {Array} x X entries of the spectrum
 * @property {Array} y X entries of the spectrum
 */

/**
 * Returns the similarity between two spectra
 * @param {Entry} experiment first spectrum
 * @param {Entry} prediction second spectrum
 * @param {object} options
 * @param {function} [options.algorithm = cosine()] algorithm used to calculate the similarity between the spectra. Default is cosine similarity.
 * @param {object} [options.alignDelta = 1] two values of a experiment and prediction which difference is smaller than `alignDelta` will be put in the same X slot (considered as common).
 * @param {object} [options.minCommon = 6] minimal number of values that must remain in the spectra after alignment.
 * @returns {SimStats} similarity: similarity between the two spectra, common: number of entries considered common by the align algorithm
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
