import normArray from 'ml-array-normed';
import { similarity as Similarity } from 'ml-distance';
import { XY } from 'ml-spectra-processing';

const cosine = Similarity.cosine;

/**
 * Returns the similarity between two spectra
 * @param {array<object>} experiment first spectrum
 * @param {array<object>} prediction second spectrum
 * @param {object} options
 * @param {function} [options.algorithm = cosine()] algorithm used to calculate the similarity between the spectra. Default is cosine similarity.
 * @param {object} [options.alignDelta = 1] two values of a experiment and prediction which difference is smaller than alignDelta will be put in the same X slot (considered as common).
 * @param {object} [options.minCommon = 6] minimal number of values that must remain in the spectra after alignment.
 * @returns {number} similarity between the two spectra
 */
export default function similarity(experiment, prediction, options = {}) {
  const { algorithm = cosine, minCommon = 6, alignDelta = 1 } = options;

  let aligned = XY.align(experiment.data, prediction.data, {
    delta: alignDelta,
    common: true,
  });

  if (aligned.x.length < minCommon) {
    // console.log('Insufficient common entries.');
    return 0;
  }

  const y1 = normArray(aligned.y1);
  const y2 = normArray(aligned.y2);

  return algorithm(y1, y2);
}
