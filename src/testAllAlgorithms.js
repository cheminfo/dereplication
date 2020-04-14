import Debug from 'debug';
import { similarity as Similarity } from 'ml-distance';

import defaultMassWeight from './defaultMassWeight';
import testSimilarity from './testSimilarity';

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
 * @param {*} options
 * @param {number} [options.numExperiments = 200] Number of experiments for which the similarity should be computed (`slice` of the input experimental data). Should be `NaN` if all data must be used.
 * @param {number} [options.mergeSpan = 0.05] How close consecutive x values of a spectrum must be to be merged when loading data
 * @param {number} [options.alignDelta = 0.05] Two values of a experiment and prediction which difference is smaller than `alignDelta` will be put in the same X slot (considered as common).
 * @param {string} [options.norm = "loadData"] Defines where the spectra should be normalized ("loadData", "similarity", "both" or "none")
 * @param {function} [options.massWeight = defaultMassWeight] Function to weight the y values of spectra by the mass to give more importance to bigger fragments.
 */
export default function testAllAlgorithms(algorithms, options = {}) {
  const {
    numExperiments = 200,
    alignDelta = 0.05,
    mergeSpan = 0.05,
    norm = 'loadData',
    massWeight = defaultMassWeight,
  } = options;

  const experiments = './data/matchingExperiments.json';
  const predictions = './data/predictions.json';

  debug(
    `number experiments: ${numExperiments}, mergeSpan: ${mergeSpan}, alignDelta: ${alignDelta}, norm: ${norm}, massWeight: ${massWeight}`,
  );

  for (let algorithm of algorithms) {
    const stats = testSimilarity(experiments, predictions, {
      numExperiments,
      alignDelta,
      mergeSpan,
      algorithm: Similarity[algorithm],
      norm,
      massWeight,
    });

    debug(`algorithm: ${algorithm}`.padEnd(26), `median: ${stats.median}`);

    // console.log(stats.median);
  }
}
