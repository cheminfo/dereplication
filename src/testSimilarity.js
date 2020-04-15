import Debug from 'debug';
import max from 'ml-array-max';
import mean from 'ml-array-mean';
import median from 'ml-array-median';
import min from 'ml-array-min';
import { similarity as Similarity } from 'ml-distance';

import findBestMatches from './bestMatch';
import defaultMassWeight from './defaultMassWeight';
import loadAndMergeX from './loadData';

const debug = Debug('testSimilarity');

const intersection = Similarity.intersection;

/**
 * Test the similarity with predictions for many experiments and return data computed on the matchIndexes
 * @param {string} experimentsPath path to the experiments JSON file
 * @param {string} predictionsPath path to the predictions JSON file
 * @param {object} options
 * @param {string} [options.pathType = "relative"] Allows to define wether the path to the JSONs is "relative" or "absolute"
 * @param {number} [options.numExperiments = 10] Number of experiments for which the similarity should be computed (`slice` of the input experimental data). Should be `NaN` if all data must be used.
 * @param {number} [options.mergeSpan = 0.05] How close consecutive x values of a spectrum must be to be merged when loading data
 * @param {number} [options.alignDelta = 0.05] Two values of a experiment and prediction which difference is smaller than `alignDelta` will be put in the same X slot (considered as common).
 * @param {function} [options.algorithm = intersection] Algorithm used to calculate the similarity between the spectra. Default is cosine similarity.
 * @param {string} [options.norm = "loadData"] Defines where the spectra should be normalized ("loadData", "similarity", "both" or "none")
 * @param {function} [options.massWeight = defaultMassWeight] Function to weight the y values of spectra by the mass to give more importance to bigger fragments.
 * @param {number} [options.massFilter = undefined] If defined, the predictions are filtered based on PEPMASS before computing any similarity. If the mass difference is over `massFilter`, `similarity` and `common` are set to 0.
 * @returns {Stats} Stats computed on the array of matchIndex
 */
export default function testSimilarity(
  experimentsPath,
  predictionsPath,
  options = {},
) {
  const {
    pathType = 'relative',
    numExperiments,
    mergeSpan = 0.05,
    alignDelta = 0.05,
    algorithm = intersection,
    norm = 'loadData',
    massWeight = defaultMassWeight,
    massFilter = undefined,
  } = options;

  let normLoadData;
  let normSimilarity;

  switch (norm) {
    case 'loadData':
      normLoadData = true;
      normSimilarity = false;
      break;
    case 'similarity':
      normLoadData = false;
      normSimilarity = true;
      break;
    case 'both':
      normLoadData = true;
      normSimilarity = true;
      break;
    case 'none':
      normLoadData = false;
      normSimilarity = false;
      break;
    default:
      throw new Error(`Unknown norm configuration ${norm}`);
  }

  const startLoadData = Date.now();

  let experiments = loadAndMergeX(experimentsPath, {
    pathType,
    mergeSpan,
    norm: normLoadData,
  });
  let predictions = loadAndMergeX(predictionsPath, {
    pathType,
    mergeSpan,
    norm: normLoadData,
  });

  debug('time to load data: ', Date.now() - startLoadData);

  if (numExperiments) {
    experiments = experiments.slice(0, numExperiments);
  }

  // console.log(experiments.length, predictions.length);

  debug(
    `number experiments: ${experiments.length}, mergeSpan: ${mergeSpan}, alignDelta: ${alignDelta}, algorithm: ${algorithm.name}, norm: ${norm}, massWeight: ${massWeight.name}, massFilter: ${massFilter}`,
  );
  debug(
    `experiment`.padEnd(12),
    `common`.padEnd(10),
    `matchIndex`.padEnd(10),
    `similarity`.padEnd(15),
    `sufficientCommon`.padEnd(12),
  );

  let indexes = [];

  const startTreatData = Date.now();

  for (let i = 0; i < experiments.length; i++) {
    const result = findBestMatches(experiments[i], predictions, {
      alignDelta,
      algorithm,
      norm: normSimilarity,
      massWeight,
      massFilter,
    });

    indexes.push(result.matchIndex);

    debug(
      `${i + 1}`.padEnd(12),
      `${result.common}`.padEnd(10),
      `${result.matchIndex}`.padEnd(10),
      `${(result.similarity * 100).toFixed(2)}`.padEnd(15),
      `${result.sufficientCommonCount}`.padEnd(12),
    );
  }
  debug('time to treat data: ', Date.now() - startTreatData);

  const indexHistogram = {};
  for (let index of indexes) {
    if (!indexHistogram[index]) indexHistogram[index] = 0;
    indexHistogram[index]++;
  }
  // console.log(indexHistogram);

  const keepInfo = [1, 2, 3, 4, 5, predictions.length];
  const indexHistogramSubset = {};
  const indexHistogramSubsetPercent = {};

  for (let key of keepInfo) {
    if (indexHistogram[key]) {
      indexHistogramSubset[key] = indexHistogram[key];
      indexHistogramSubsetPercent[key] = `${(
        (indexHistogram[key] / experiments.length) *
        100
      ).toFixed(2)}`;
    }
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
    matchIndexHistogram: indexHistogramSubset,
    matchIndexHistogramPercent: indexHistogramSubsetPercent,
  };

  debug(stats);

  return stats;
}
