import max from 'ml-array-max';
import mean from 'ml-array-mean';
import median from 'ml-array-median';
import min from 'ml-array-min';

import findBestMatches from './bestMatch';
import loadAndMergeX from './loadData';

const experimental = './data/matchingExperiments.json';
const predicted = './data/predictions.json';

/**
 * @typedef {object} Spectrum Data type of all the spectra
 * @property {Array} x X entries of the spectrum
 * @property {Array} y X entries of the spectrum
 */

/**
 * @typedef {object} Entry Entries of Data type: contains a spectrum and meta-information
 * @property {string} kind Kind of the entries of the data (in general: 'IONS')
 * @property {object} meta Meta-information about the spectrum
 * @property {Spectrum} data The spectrum data
 */

/**
 * @typedef {Array<Entry>} Data The type of experimental and predicted data after MGF parsing
 */

testSimilarity(experimental, predicted);

export default function testSimilarity(
  experimentsPath,
  predictionsPath,
  options = {},
) {
  const {
    maxExperiments = 10,
    mergeSpan = 1,
    alignDelta = 1,
    output = true,
  } = options;

  let experiments = loadAndMergeX(experimentsPath, { mergeSpan });
  const predictions = loadAndMergeX(predictionsPath, { mergeSpan });

  if (!isNaN(maxExperiments)) {
    experiments = experiments.slice(0, maxExperiments);
  }

  if (output) {
    console.log(
      `number experiments: ${experiments.length}, mergeSpan; ${mergeSpan}, alignDelta: ${alignDelta}`,
      '\n\f',
    );
    console.log(`experiment`.padEnd(12), `common`.padEnd(10), `matchIndex`);
  }

  let indexes = [];

  for (let i = 0; i < experiments.length; i++) {
    const result = findBestMatches(experiments[i], predictions, {
      alignDelta,
    });

    indexes.push(result.matchIndex);

    if (output) {
      console.log(
        `${i + 1}`.padEnd(12),
        `${result.common}`.padEnd(10),
        `${result.matchIndex}`,
      );
    }
  }

  let stats = {
    average: mean(indexes),
    median: median(indexes),
    min: min(indexes),
    max: max(indexes),
  };

  if (output) {
    console.log(stats);
  }

  return stats;
}
