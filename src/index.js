import { similarity as Similarity } from 'ml-distance';

import computeSimilarities from './computeSimilarities';

const intersection = Similarity.intersection;

const experimental = './data/matchingExperiments.json';
const predicted = './data/predictions.json';

computeSimilarities(experimental, predicted, {
  numExperiments: undefined,
  alignDelta: 0.05,
  mergeSpan: 0.05,
  algorithm: intersection,
  norm: 'loadData',
  massFilter: 0.05,
});
