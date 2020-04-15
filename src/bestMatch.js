import computeSimilarity from './similarity';

/**
 * Returns a structure with the predicted spectra the most similar to an experimental spectrum
 * @param {Entry} experiment Experimental spectrum
 * @param {Data} predictions Predicted spectra database
 * @param {object} [options={}]
 * @param {number} [options.massFilter=0.05] If defined, the predictions are filtered based on PEPMASS before computing any similarity. If the mass difference is over `massFilter`, `similarity` and `common` are set to 0.
 * @param {number} [options.threshold=0] Similarity threshold for predicted spectra to be returned
 * @param {number} [options.numberBestMatch=10] Number of best matching predicted spectra to return in the result (`undefined` to return all)
 * @param {object}   [similarity={}]
 * @param {function} [similarity.algorithm=intersection] Algorithm used to calculate the similarity between the spectra. Default is cosine similarity.
 * @param {number}   [similarity.alignDelta=0.05] Two values of a experiment and prediction which difference is smaller than `alignDelta` will be put in the same X slot (considered as common).
 * @param {number}   [similarity.minCommon=6] Minimal number of values that must remain in the spectra after alignment.
 * @param {bool}     [similarity.norm=false] If `true`, the spectra data are normalized before being sent to the similarity algorithm.
 * @param {function} [similarity.massWeight=defaultMassWeight] Function that weights a y value by a function of x.
 * @returns {Result} Best matching predicted spectra and meta information
 */
export default function findBestMatches(
  experiment,
  predictions,
  options = {},
  similarity = {},
) {
  const { massFilter = 0.05, threshold = 0, numberBestMatch = 10 } = options;
  const { minCommon = 6 } = similarity;

  /**
   * @typedef {Object} Result
   * @property {Entry} exp The experiment data
   * @property {array<Match>} matches All predictions sorted by similarity with exp
   * @property {number} matchIndex The index of the correct match for exp in matches. It is `NaN`if the similarity between the experiment and its correct match is zero.
   * @property {number} common Number of values considered common between exp and its correct math by the align algorith
   * @property {number} sufficientCommonCount Number of exp/pred couples that have sufficient common values after aligning (default less than 6)
   */
  let result = {
    exp: experiment,
    matches: [],
    matchIndex: -1,
    common: NaN,
    sufficientCommonCount: 0,
  };

  const histogram = {};

  const expMass = experiment.meta.PEPMASS;

  for (let prediction of predictions) {
    const predMass = prediction.meta.PEPMASS;

    /**
     * @typedef {Object} Match
     * @property {number} similarity The experiment data
     * @property {Entry} prediction All predictions sorted by similarity with exp
     * @property {bool} correctMatch Is true if prediction is the correct match of exp
     */
    let match = {
      similarity: undefined,
      prediction: prediction,
      correctMatch: false,
    };

    let exactMatchCommon;
    if (massFilter && Math.abs(predMass - expMass) > massFilter) {
      match.similarity = 0;
      exactMatchCommon = 0;
    } else {
      let simData = computeSimilarity(experiment, prediction, similarity);

      match.similarity = simData.similarity;
      exactMatchCommon = simData.common;
    }

    if (experiment.meta.idCodeNoStereo === prediction.meta.idCodeNoStereo) {
      // console.log('FOUND MATCH - similarity: ', match.similarity);
      match.correctMatch = true;
      result.common = exactMatchCommon;
      if (match.similarity === 0) {
        result.similarity = 0;
      }
      // console.log('EXPERIMENT: ', experiment.meta.SPECTRUMID);
      // console.log('PREDICTION: ', prediction.meta.FILENAME);
    }
    if (match.similarity > threshold) {
      result.matches.push(match);
    }

    if (exactMatchCommon >= minCommon) {
      result.sufficientCommonCount++;
    }

    if (!histogram[exactMatchCommon]) histogram[exactMatchCommon] = 0;
    histogram[exactMatchCommon]++;
  }

  // console.log(histogram);

  result.matches.sort((a, b) => b.similarity - a.similarity);

  if (result.similarity !== 0) {
    for (let i = 0; i < result.matches.length; i++) {
      if (result.matches[i].correctMatch) {
        // console.log('EXACT MATCH INDEX FOUND');
        result.matchIndex = i + 1;
        result.similarity = result.matches[i].similarity;
      }
    }
  } else {
    result.matchIndex = predictions.length;
  }

  if (result.matchIndex === -1) {
    throw new Error(
      `No exact match found for experiment with id code ${experiment.meta.idCodeNoStereo}`,
    );
  }

  if (numberBestMatch && result.matches.length > numberBestMatch) {
    result.matches = result.matches.slice(0, numberBestMatch - 1);
  }

  return result;
}
