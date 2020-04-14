import { similarity as Similarity } from 'ml-distance';

import testSimilarity from './testSimilarity';

const intersection = Similarity.intersection;

const experimental = './data/matchingExperiments.json';
const predicted = './data/predictions.json';

testSimilarity(experimental, predicted, {
  numExperiments: undefined,
  alignDelta: 0.05,
  mergeSpan: 0.05,
  algorithm: intersection,
  norm: 'loadData',
  massFilter: 0.05,
});
