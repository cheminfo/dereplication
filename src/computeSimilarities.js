import Debug from 'debug';
import max from 'ml-array-max';
import mean from 'ml-array-mean';
import median from 'ml-array-median';
import min from 'ml-array-min';

import findBestMatches from './bestMatch';
import loadData from './loadData';

const debug = Debug('testSimilarity');

/**
 * Test the similarity with predictions for many experiments and return data computed on the matchIndexes
 * @param {string} experimentsPath path to the experiments JSON file
 * @param {string} predictionsPath path to the predictions JSON file
 * @param {object} [options={}]
 * @param {number} [options.numExperiments=undefined] Number of experiments for which the similarity should be computed (`slice` of the input experimental data). Should be `undefined` if all data must be used.
 * @param {object} [options.loadData={}]
 * @param {string} [options.treatment="mergeX"] If 'mergeX': x spectra values are merged with span `mergeSpan`, if 'maxPeaks' return `numberMaxPeaks` peaks of the spectra
 * @param {number} [options.numberMaxPeaks=30] Used if options.treatment='maxPeaks'. Number of max. intensity peaks to keep. This removes some of the spectrum noise.
 * @param {number} [options.loadData.mergeSpan=0.05] How close consecutive x values of a spectrum must be to be merged
 * @param {string} [options.loadData.pathType="relative"] Allows to define wether the path to the JSON is "relative" or "absolute"
 * @param {bool}   [options.loadData.norm=true] If `true`, the spectra data are normalized before merging too close x values.
 * @param {object}    [options.similarity={}]
 * @param {function} [options.similarity.algorithm=intersection] Algorithm used to calculate the similarity between the spectra. Default is cosine similarity.
 * @param {number}   [options.similarity.alignDelta=0.05] Two values of a experiment and prediction which difference is smaller than `alignDelta` will be put in the same X slot (considered as common).
 * @param {number}   [options.similarity.minCommon=6] Minimal number of values that must remain in the spectra after alignment.
 * @param {bool}     [options.similarity.norm=false] If `true`, the spectra data are normalized before being sent to the similarity algorithm.
 * @param {function} [options.similarity.massWeight=defaultMassWeight] Function that weights a y value by a function of x.
 * @param {object}  [options.bestMatch={}]
 * @param {number} [options.bestMatch.threshold=0] Similarity threshold for predicted spectra to be returned
 * @param {number} [options.bestMatch.numberBestMatch=10] Number of best matching predicted spectra to return in the result (`NaN` to return all)
 * @param {number} [options.bestMatch.massFilter=0.05] If defined, the predictions are filtered based on PEPMASS before computing any similarity. If the mass difference is over `massFilter`, `similarity` and `common` are set to 0.
 * @returns {Stats} Stats computed on the array of matchIndex
 */
export default function computeSimilarities(
  experimentsPath,
  predictionsPath,
  options = {},
) {
  const {
    numExperiments,
    loadData = {},
    similarity = {},
    bestMatch = {},
  } = options;

  const startLoadData = Date.now();

  let experiments = loadData(experimentsPath, loadData);
  let predictions = loadData(predictionsPath, loadData);

  debug('time to load data: ', Date.now() - startLoadData);

  if (numExperiments) {
    experiments = experiments.slice(0, numExperiments);
  }

  // console.log(experiments.length, predictions.length);

  debug(
    `number experiments: ${experiments.length}, mergeSpan: ${
      loadData.mergeSpan || 0.05
    }, alignDelta: ${similarity.alignDelta || 0.05}, loadData.norm: ${
      loadData.norm || true
    }, similarity.norm: ${similarity.norm || false}, massWeight: ${
      similarity.massWeight || '*x^3'
    }, massFilter: ${bestMatch.massFilter || 0.05}`,
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
    const result = findBestMatches(
      experiments[i],
      predictions,
      bestMatch,
      similarity,
    );

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
