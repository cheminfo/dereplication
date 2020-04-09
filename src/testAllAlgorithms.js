import Debug from 'debug';
import { similarity as Similarity } from 'ml-distance';

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

testAllAlgorithms(simMethods, { alignDelta: 0.5, mergeSpan: 0.5 });

export default function testAllAlgorithms(algorithms, options = {}) {
  const { numExperiments = 200, alignDelta = 0.05, mergeSpan = 0.05 } = options;

  const experiments = './data/matchingExperiments.json';
  const predictions = './data/predictions.json';

  console.log(
    `number experiments: ${numExperiments}, mergeSpan: ${mergeSpan}, alignDelta: ${alignDelta}`,
  );

  for (let algorithm of algorithms) {
    const stats = testSimilarity(experiments, predictions, {
      numExperiments,
      alignDelta,
      mergeSpan,
      algorithm: Similarity[algorithm],
    });

    debug(`algorithm: ${algorithm}`.padEnd(26), `median: ${stats.median}`);

    console.log(stats.median);
  }
}
