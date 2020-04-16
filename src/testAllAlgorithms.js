import Debug from 'debug';

import computeSimilarities from './computeSimilarities';

const debug = Debug('testAllAlgo');

const simMethods = [
  'cosine',
  'czekanowski',
  'dice',
  'intersection',
  'jaccard',
  'kulczynski',
  'motyka',
];

testAllAlgorithms(simMethods);

/**
 * Test various parameters that vary the matchIndex for all similarity algorithms and debug results.
 * @param {Array<string>} algorithms List of all the algorithms names
 * @param {object} [options={}]
 * @param {number} [options.numExperiments=undefined] Number of experiments for which the similarity should be computed (`slice` of the input experimental data). Should be `undefined` if all data must be used.
 * @param {object} [options.loadData={}]
 * @param {string} [options.treatment="mergeX"] If 'mergeX': x spectra values are merged with span `mergeSpan`, if 'maxPeaks' return `numberMaxPeaks` peaks of the spectra
 * @param {number} [options.numberMaxPeaks=30] Used if options.treatment='maxPeaks'. Number of max. intensity peaks to keep. This removes some of the spectrum noise.
 * @param {number} [options.loadData.mergeSpan=0.05] How close consecutive x values of a spectrum must be to be merged
 * @param {string} [options.loadData.pathType="relative"] Allows to define wether the path to the JSON is "relative" or "absolute"
 * @param {bool}   [options.loadData.norm=true] If `true`, the spectra data are normalized before merging too close x values.
 * @param {object}   [options.similarity={}]
 * @param {function} [options.similarity.algorithm=intersection] Algorithm used to calculate the similarity between the spectra. Default is cosine similarity.
 * @param {number}   [options.similarity.alignDelta=0.05] Two values of a experiment and prediction which difference is smaller than `alignDelta` will be put in the same X slot (considered as common).
 * @param {number}   [options.similarity.minCommon=6] Minimal number of values that must remain in the spectra after alignment.
 * @param {bool}     [options.similarity.norm=false] If `true`, the spectra data are normalized before being sent to the similarity algorithm.
 * @param {function} [options.similarity.massWeight=defaultMassWeight] Function that weights a y value by a function of x.
 * @param {object} [options.bestMatch={}]
 * @param {number} [options.bestMatch.threshold=0] Similarity threshold for predicted spectra to be returned
 * @param {number} [options.bestMatch.numberBestMatch=10] Number of best matching predicted spectra to return in the result (`NaN` to return all)
 * @param {number} [options.bestMatch.massFilter=0.05] If defined, the predictions are filtered based on PEPMASS before computing any similarity. If the mass difference is over `massFilter`, `similarity` and `common` are set to 0.
 * @returns {Stats} Stats computed on the array of matchIndex
 */
export default function testAllAlgorithms(algorithms, options = {}) {
  const {
    numExperiments = 200,
    loadData = {},
    similarity = {},
    bestMatch = {},
  } = options;

  const experiments = './data/matchingExperiments.json';
  const predictions = './data/predictions.json';

  debug(
    `number experiments: ${numExperiments}, mergeSpan: ${
      loadData.mergeSpan || 0.05
    }, alignDelta: ${similarity.alignDelta || 0.05}, loadData.norm: ${
      loadData.norm || true
    }, loadData.norm: ${similarity.norm || false}, massWeight: ${
      similarity.massWeight || '*x^3'
    }, massFilter: ${bestMatch.massFilter || 0.05}`,
  );

  for (let algorithm of algorithms) {
    const stats = computeSimilarities(experiments, predictions, options);

    debug(`algorithm: ${algorithm}`.padEnd(26), `median: ${stats.median}`);

    // console.log(stats.median);
  }
}
