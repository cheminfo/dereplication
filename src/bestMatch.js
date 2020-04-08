import computeSimilarity from './similarity';

/**
 * Returns a structure with the predicted spectra the most similar to an experimental spectrum
 * @param {object} experiment Experimental spectrum
 * @param {array<object>} predictions Predicted spectra database
 * @param {object} options
 * @param {number} [options.threshold = 0] Similarity threshold for predicted spectra to be returned
 * @param {number} [options.numberBestMatch = 10] Number of best matching predicted spectra to return in the result (`NaN` to return all)
 * @param {object} [options.alignDelta = 1] Two values of a experiment and prediction which difference is smaller than alignDelta will be put in the same X slot (considered as common and therefore kept to apply the similarity algorithm).
 * @returns {Result} Best matching predicted spectra and meta information
 */
export default function findBestMatches(experiment, predictions, options = {}) {
  const { threshold = 0, numberBestMatch = 10, alignDelta = 1 } = options;
  /**
   * @typedef {Object} Result
   * @property {Entry} exp The experiment data
   * @property {array<Match>} matches All predictions sorted by similarity with exp
   * @property {number} matchIndex The index of the correct match for exp in matches
   * @property {number} common Number of values considered common between exp and its correct math by the align algorith
   */
  let result = {
    exp: experiment,
    matches: [],
    matchIndex: NaN,
    common: NaN,
  };

  for (let prediction of predictions) {
    let simData = computeSimilarity(experiment, prediction, { alignDelta });
    /**
     * @typedef {Object} Match
     * @property {number} similarity The experiment data
     * @property {Entry} prediction All predictions sorted by similarity with exp
     * @property {bool} correctMatch Is true if prediction is the correct match of exp
     */
    let match = {
      similarity: simData.similarity,
      prediction: prediction,
      correctMatch: false,
    };
    if (experiment.meta.idCodeNoStereo === prediction.meta.idCodeNoStereo) {
      // console.log('FOUND MATCH', match.similarity);
      match.correctMatch = true;
      result.common = simData.common;
    }
    if (match.similarity >= threshold) {
      result.matches.push(match);
    }
  }

  result.matches.sort((a, b) => b.similarity - a.similarity);

  for (let i = 0; i < result.matches.length; i++) {
    if (result.matches[i].exact) {
      result.matchIndex = i;
    }
  }
  if (isNaN(result.matchIndex)) {
    throw new Error(
      `No exact match found for experiment with id code ${experiment.meta.idCodeNoStereo}`,
    );
  }

  if (!isNaN(numberBestMatch && result.matches.length >= numberBestMatch)) {
    result.matches = result.matches.slice(0, numberBestMatch - 1);
  }

  return result;
}
