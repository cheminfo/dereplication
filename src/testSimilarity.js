import Debug from 'debug';
import max from 'ml-array-max';
import mean from 'ml-array-mean';
import median from 'ml-array-median';
import min from 'ml-array-min';
import { similarity as Similarity } from 'ml-distance';

import findBestMatches from './bestMatch';
import loadAndMergeX from './loadData';

const debug = Debug('testSimilarity');

const cosine = Similarity.cosine;

/**
 * Test the similarity with predictions for many experiments and return data computed on the matchIndexes
 * @param {string} experimentsPath path to the experiments JSON file
 * @param {string} predictionsPath path to the predictions JSON file
 * @param {object} options
 * @param {string} [options.pathType = "relative"] Allows to define wether the path to the JSONs is "relative" or "absolute"
 * @param {number} [options.numExperiments = 10] Number of experiments for which the similarity should be computed (`slice` of the input experimental data). Should be `NaN` if all data must be used.
 * @param {number} [options.mergeSpan = 1] How close consecutive x values of a spectrum must be to be merged when loading data
 * @param {number} [options.alignDelta = 1] Two values of a experiment and prediction which difference is smaller than `alignDelta` will be put in the same X slot (considered as common).
 * @param {function} [options.algorithm = cosine] Algorithm used to calculate the similarity between the spectra. Default is cosine similarity.
 * @returns {Stats} Stats computed on the array of matchIndex
 */
export default function testSimilarity(
  experimentsPath,
  predictionsPath,
  options = {},
) {
  const {
    pathType = 'relative',
    numExperiments = 10,
    mergeSpan = 1,
    alignDelta = 1,
    algorithm = cosine,
  } = options;

  let experiments = loadAndMergeX(experimentsPath, { pathType, mergeSpan });
  let predictions = loadAndMergeX(predictionsPath, { pathType, mergeSpan });

  if (!isNaN(numExperiments)) {
    experiments = experiments.slice(0, numExperiments);
  }

  // console.log(experiments.length, predictions.length);

  debug(
    `number experiments: ${experiments.length}, mergeSpan; ${mergeSpan}, alignDelta: ${alignDelta}, algorithm: ${algorithm}`,
  );
  debug(
    `experiment`.padEnd(12),
    `common`.padEnd(10),
    `matchIndex`.padEnd(10),
    `similarity`.padEnd(10),
  );

  let indexes = [];

  for (let i = 0; i < experiments.length; i++) {
    const result = findBestMatches(experiments[i], predictions, {
      alignDelta,
      algorithm,
    });

    indexes.push(result.matchIndex);

    debug(
      `${i + 1}`.padEnd(12),
      `${result.common}`.padEnd(10),
      `${result.matchIndex}`.padEnd(10),
      `${(result.similarity * 100).toFixed(2)}`.padEnd(10),
    );
  }

  /**
   * @typedef {object} Stats Type that handles various information computed from an array of `matchIndex`
   * @property {number} mean Mean of the array
   * @property {number} median Median of the array
   * @property {number} min Min of the array
   * @property {number} max Max of the array
   */

  let stats = {
    average: mean(indexes),
    median: median(indexes),
    min: min(indexes),
    max: max(indexes),
  };

  debug(stats);

  return stats;
}
