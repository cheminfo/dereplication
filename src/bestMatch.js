import computeSimilarity from './similarity';

/**
 * Returns a structure with the predicted spectra the most similar to an experimental spectrum
 * @param {object} experiment experimental spectrum
 * @param {array<object>} predictions predicted spectra database
 * @param {*} options
 * @param {number} [options.threshold = 0] similarity threshold for predicted spectra to be returned
 * @param {number} [options.numberBestMatch = 10] number of best matching predicted spectra to return in the result (`NaN` to return all)
 * @returns {object} best matching predicted spectra and meta information
 */
export default function findBestMatches(experiment, predictions, options = {}) {
  const { threshold = 0, numberBestMatch = 10 } = options;
  let result = {
    exp: experiment,
    matches: [],
    matchIndex: NaN,
  };

  for (let prediction of predictions) {
    let match = {
      similarity: computeSimilarity(experiment, prediction),
      prediction: prediction,
      exact: false,
    };
    if (experiment.meta.idCodeNoStereo === prediction.meta.idCodeNoStereo) {
      // console.log('FOUND MATCH', match.similarity);
      match.exact = true;
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
